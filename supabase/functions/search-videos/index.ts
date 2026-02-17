import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface VideoResult {
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  source: string;
}

// Context-to-search-query mapping for ESL video content
const CONTEXT_QUERIES: Record<string, string> = {
  airport: 'English conversation airport travel phrases',
  cafe: 'ordering coffee English real conversation',
  job_interview: 'English job interview practice questions answers',
  flatshare: 'English flatmate conversation daily life',
  hotel: 'English hotel check-in conversation phrases',
  restaurant: 'English restaurant ordering conversation',
  home_study: 'English listening practice daily conversation',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context } = await req.json();

    if (!context || !CONTEXT_QUERIES[context]) {
      return new Response(
        JSON.stringify({ error: 'Invalid context', videos: [] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try YouTube Data API if key is available
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    
    if (YOUTUBE_API_KEY) {
      try {
        const query = encodeURIComponent(CONTEXT_QUERIES[context]);
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=3&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`;
        
        const ytResp = await fetch(ytUrl);
        if (ytResp.ok) {
          const ytData = await ytResp.json();
          const videos: VideoResult[] = (ytData.items || []).map((item: any) => ({
            title: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
            videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            source: 'YouTube',
          }));
          
          return new Response(
            JSON.stringify({ videos, source: 'youtube_api' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (err) {
        console.error('YouTube API error:', err);
      }
    }

    // Fallback: Use Lovable AI to generate contextual video recommendations
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (LOVABLE_API_KEY) {
      try {
        const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-lite',
            messages: [{
              role: 'user',
              content: `Suggest 3 real YouTube videos for ESL learners practicing English in a "${context}" context. Return ONLY a JSON array with objects having: title, videoUrl (real YouTube URL), thumbnailUrl (use https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg format). No explanation, just the JSON array.`
            }],
            temperature: 0.3,
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const content = data.choices?.[0]?.message?.content || '';
          // Extract JSON array from response
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const videos = JSON.parse(jsonMatch[0]).map((v: any) => ({
              ...v,
              source: 'AI Recommended',
            }));
            return new Response(
              JSON.stringify({ videos, source: 'ai_recommended' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (err) {
        console.error('AI recommendation error:', err);
      }
    }

    // Final fallback: empty array (client will use its own fallbacks)
    return new Response(
      JSON.stringify({ videos: [], source: 'none' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search videos error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', videos: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
