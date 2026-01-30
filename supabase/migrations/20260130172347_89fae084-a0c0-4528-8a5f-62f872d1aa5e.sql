-- Add new columns to scenarios table for immersive content
ALTER TABLE public.scenarios 
ADD COLUMN IF NOT EXISTS environment_slug text,
ADD COLUMN IF NOT EXISTS visual_context jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS dialogue_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS neuro_emotional_state text,
ADD COLUMN IF NOT EXISTS difficulty_level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS estimated_duration_minutes integer DEFAULT 10;

-- Create index for faster environment lookups
CREATE INDEX IF NOT EXISTS idx_scenarios_environment_slug ON public.scenarios(environment_slug);
CREATE INDEX IF NOT EXISTS idx_scenarios_context_type ON public.scenarios(context_type);