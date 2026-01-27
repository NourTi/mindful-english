-- Create data export audit log table
CREATE TABLE public.data_export_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL,
  record_count INTEGER NOT NULL,
  fields_exported TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on the export log table
ALTER TABLE public.data_export_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view export logs
CREATE POLICY "Admins can view export logs"
ON public.data_export_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Only allow inserts through edge function (service role)
-- No direct insert policy for regular users