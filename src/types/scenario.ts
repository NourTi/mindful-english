export interface UserOption {
  text: string;
  is_correct: boolean;
  feedback: string;
  emotion_impact: number;
}

export interface DialogueStep {
  step_number: number;
  npc_name: string;
  npc_dialogue: string;
  user_options: UserOption[];
}

export interface DialogueData {
  opening_context: string;
  steps: DialogueStep[];
  success_message: string;
  vocabulary_focus: string[];
}

export interface VisualContext {
  scene_description: string;
  ambient_sounds: string[];
  lighting: string;
  time_of_day: string;
  key_objects: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  context_type: string;
  environment_slug: string;
  is_active: boolean;
  neuro_emotional_state: string;
  difficulty_level: number;
  estimated_duration_minutes: number;
  visual_context: VisualContext;
  dialogue_data: DialogueData;
  created_at: string;
  updated_at: string;
}

export interface ScenarioProgress {
  currentStep: number;
  emotionScore: number;
  correctAnswers: number;
  totalAnswers: number;
  selectedChoices: number[];
  completed: boolean;
}
