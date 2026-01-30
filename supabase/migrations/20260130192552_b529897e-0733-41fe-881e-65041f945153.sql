-- Create scenario_progress table to track user progress
CREATE TABLE public.scenario_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 0,
  emotion_score INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_answers INTEGER NOT NULL DEFAULT 0,
  selected_choices INTEGER[] NOT NULL DEFAULT '{}',
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scenario_id)
);

-- Enable RLS
ALTER TABLE public.scenario_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view their own scenario progress"
  ON public.scenario_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert their own scenario progress"
  ON public.scenario_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own scenario progress"
  ON public.scenario_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own progress (for restart)
CREATE POLICY "Users can delete their own scenario progress"
  ON public.scenario_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_scenario_progress_updated_at
  BEFORE UPDATE ON public.scenario_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();