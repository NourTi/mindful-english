export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
export type AnxietyLevel = 1 | 2 | 3 | 4 | 5;
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export type SemanticContext = 'workplace' | 'travel' | 'daily_life' | 'academic';

export interface CognitiveProfile {
  learningStyle: LearningStyle;
  learningStyleScores: Record<LearningStyle, number>;
  anxietyLevel: AnxietyLevel;
  confidenceLevel: ConfidenceLevel;
  vocabularyLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced';
  knownConcepts: string[];
  preferredChunkDuration: number; // in minutes
  semanticContext?: SemanticContext;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cognitiveProfile: CognitiveProfile;
  progress: {
    completedLessons: string[];
    currentStreak: number;
    totalXP: number;
    level: number;
  };
  emotionalState: {
    currentMood: 'calm' | 'focused' | 'anxious' | 'frustrated' | 'confident';
    consecutiveErrors: number;
    lastBreathingExercise?: Date;
  };
}

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  contentVariants: {
    visual: VisualContent;
    auditory: AuditoryContent;
    reading: ReadingContent;
    kinesthetic: KinestheticContent;
  };
  semanticAnchors: SemanticAnchor[];
  assessmentQuestions: AssessmentQuestion[];
}

export interface VisualContent {
  type: 'visual';
  images: string[];
  infographics: string[];
  videoUrl?: string;
  vrScenarioId?: string;
}

export interface AuditoryContent {
  type: 'auditory';
  audioUrl: string;
  transcriptHighlights: string[];
  pronunciationGuide: string[];
}

export interface ReadingContent {
  type: 'reading';
  mainText: string;
  grammarRules: string[];
  exercises: string[];
}

export interface KinestheticContent {
  type: 'kinesthetic';
  interactiveScenarioId: string;
  rolePlayPrompts: string[];
  physicalActivities: string[];
}

export interface SemanticAnchor {
  newWord: string;
  definition: string;
  contextualImage?: string;
  relatedConcepts: string[];
  personalizedExample?: string;
  spaceRepetitionDue?: Date;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  growthMindsetFeedback: {
    correct: string;
    incorrect: string;
  };
}

export interface EmotionalFeedback {
  type: 'encouragement' | 'reset' | 'celebration' | 'breathing';
  message: string;
  action?: 'pause' | 'simplify' | 'continue' | 'celebrate';
}
