-- Create bookmarked_lessons table
CREATE TABLE public.bookmarked_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.bookmarked_lessons ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own bookmarks"
ON public.bookmarked_lessons
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
ON public.bookmarked_lessons
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
ON public.bookmarked_lessons
FOR DELETE
USING (auth.uid() = user_id);