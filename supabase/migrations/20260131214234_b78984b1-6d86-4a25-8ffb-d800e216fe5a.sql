-- Create table to log when admins view the export log (audit trail for audit trail)
CREATE TABLE public.export_log_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  access_type TEXT NOT NULL DEFAULT 'view', -- 'view', 'export'
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.export_log_access ENABLE ROW LEVEL SECURITY;

-- Only admins can view their own access logs
CREATE POLICY "Admins can view their own export log access"
ON public.export_log_access
FOR SELECT
USING (auth.uid() = admin_user_id);

-- Insert is done via edge function with service role, no client insert needed