import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  exportType: 'all_users' | 'volunteers';
  justification?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Client with user auth for checking permissions
    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Service client for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from token
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is an admin
    const { data: adminCheck, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminError || !adminCheck) {
      console.error('Admin check failed:', adminError);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: ExportRequest = await req.json();
    const { exportType, justification } = body;

    if (!exportType || !['all_users', 'volunteers'].includes(exportType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid export type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Export requested by admin ${user.id}: type=${exportType}`);

    // Fetch profiles based on export type
    let query = supabaseAdmin.from('profiles').select('*');
    
    if (exportType === 'volunteers') {
      query = query.eq('is_volunteer', true);
    }

    const { data: profiles, error: profilesError } = await query.order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profiles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Define which fields to export (limited set for security)
    const fieldsExported = exportType === 'volunteers' 
      ? ['name', 'email', 'first_name', 'last_name', 'phone_number', 'whatsapp_number', 'is_volunteer']
      : ['name', 'email', 'first_name', 'last_name', 'learning_style', 'current_level', 'total_xp', 'is_volunteer', 'profile_completed', 'created_at'];

    // Log the export action
    const { error: logError } = await supabaseAdmin
      .from('data_export_log')
      .insert({
        admin_user_id: user.id,
        export_type: exportType,
        record_count: profiles?.length || 0,
        fields_exported: fieldsExported,
      });

    if (logError) {
      console.error('Error logging export:', logError);
      // Continue with export even if logging fails, but log the error
    }

    // Helper to mask sensitive data
    const maskPhone = (phone: string | null): string => {
      if (!phone || phone.length < 8) return phone || '';
      return phone.slice(0, 4) + '****' + phone.slice(-3);
    };

    // Generate CSV with masked sensitive fields
    const headers = exportType === 'volunteers'
      ? ['Name', 'Email', 'First Name', 'Last Name', 'Phone (Masked)', 'WhatsApp (Masked)', 'Is Volunteer']
      : ['Name', 'Email', 'First Name', 'Last Name', 'Learning Style', 'Level', 'Total XP', 'Is Volunteer', 'Profile Complete', 'Joined'];

    const csvRows = profiles?.map(profile => {
      if (exportType === 'volunteers') {
        return [
          profile.name || '',
          profile.email || '',
          profile.first_name || '',
          profile.last_name || '',
          maskPhone(profile.phone_number),
          maskPhone(profile.whatsapp_number),
          profile.is_volunteer ? 'Yes' : 'No',
        ];
      } else {
        return [
          profile.name || '',
          profile.email || '',
          profile.first_name || '',
          profile.last_name || '',
          profile.learning_style || '',
          profile.current_level?.toString() || '',
          profile.total_xp?.toString() || '',
          profile.is_volunteer ? 'Yes' : 'No',
          profile.profile_completed ? 'Yes' : 'No',
          profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '',
        ];
      }
    }) || [];

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    console.log(`Export completed: ${profiles?.length || 0} records exported for ${exportType}`);

    return new Response(
      JSON.stringify({ 
        csv: csvContent, 
        recordCount: profiles?.length || 0,
        exportedAt: new Date().toISOString(),
        fieldsExported,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
