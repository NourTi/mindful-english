-- Strengthen messages RLS policies with defense-in-depth
-- This adds direct ownership checks alongside conversation participation checks

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Create strengthened SELECT policy with dual verification
-- Users must be a conversation participant AND the message must belong to that conversation
CREATE POLICY "Users can view messages in their conversations"
ON public.messages
FOR SELECT
TO authenticated
USING (
  -- Verify user is a participant in the conversation
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  )
  AND (
    -- User is either the sender or the recipient
    sender_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (
        (c.participant_one = auth.uid() AND c.participant_two = sender_id)
        OR (c.participant_two = auth.uid() AND c.participant_one = sender_id)
      )
    )
  )
);

-- Create strengthened INSERT policy
-- User must be the sender AND a participant in the conversation
CREATE POLICY "Users can send messages in their conversations"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  -- User must be the sender
  auth.uid() = sender_id
  AND
  -- User must be a participant in the conversation
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  )
);

-- Create restrictive UPDATE policy - only for marking RECEIVED messages as read
-- Users can only update read_at on messages they received, not sent
CREATE POLICY "Users can mark received messages as read"
ON public.messages
FOR UPDATE
TO authenticated
USING (
  -- User must NOT be the sender (can only mark received messages)
  sender_id != auth.uid()
  AND
  -- User must be a participant in the conversation
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  )
)
WITH CHECK (
  -- Only allow updating if read_at is being set (not null after update)
  read_at IS NOT NULL
);

-- Add a CHECK constraint to limit message content length (defense-in-depth)
ALTER TABLE public.messages 
ADD CONSTRAINT messages_content_length_check 
CHECK (length(content) <= 5000);

-- Create an audit log table for message access (optional but recommended)
CREATE TABLE IF NOT EXISTS public.message_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  conversation_id UUID NOT NULL,
  access_type TEXT NOT NULL, -- 'view', 'send', 'mark_read'
  message_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.message_access_log ENABLE ROW LEVEL SECURITY;

-- Only system can insert (via triggers), admins can view
CREATE POLICY "Admins can view message access logs"
ON public.message_access_log
FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Create index for efficient audit log queries
CREATE INDEX IF NOT EXISTS idx_message_access_log_user_time 
ON public.message_access_log(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_message_access_log_conversation 
ON public.message_access_log(conversation_id, created_at DESC);