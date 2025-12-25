-- Create partner_requests table for the bulletin board
CREATE TABLE public.partner_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  learning_style TEXT NOT NULL DEFAULT 'visual',
  context TEXT NOT NULL DEFAULT 'daily_life',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_reports table for flagging inappropriate content
CREATE TABLE public.content_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES public.partner_requests(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- Partner Requests Policies
CREATE POLICY "Anyone can view active partner requests"
ON public.partner_requests
FOR SELECT
USING (is_active = true);

CREATE POLICY "Users can create their own requests"
ON public.partner_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
ON public.partner_requests
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests"
ON public.partner_requests
FOR DELETE
USING (auth.uid() = user_id);

-- Content Reports Policies
CREATE POLICY "Users can create reports"
ON public.content_reports
FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports"
ON public.content_reports
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
));

CREATE POLICY "Admins can update reports"
ON public.content_reports
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
));

-- Add triggers for updated_at
CREATE TRIGGER update_partner_requests_updated_at
BEFORE UPDATE ON public.partner_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();