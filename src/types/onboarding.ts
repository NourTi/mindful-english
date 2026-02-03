// Onboarding Assessment Types

export interface ScaleQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'scale';
  min: number;
  max: number;
}

export interface MultipleQuestion {
  id: string;
  question: string;
  type: 'multiple';
  options: string[];
}

export type AssessmentQuestion = ScaleQuestion | MultipleQuestion;

export interface AssessmentSection {
  title: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentData {
  welcome: string;
  sections: AssessmentSection[];
  profileMapping: Record<string, ProfileMapping>;
}

export interface ProfileMapping {
  recommendedPath: string;
  startingDifficulty: 'easy' | 'medium' | 'hard';
  psySupport: 'low' | 'medium' | 'high';
}

export interface AssessmentProfile {
  speaking_level: number;
  listening_level: number;
  anxiety: string;
  motivation: string;
  format: string;
}

export interface PathRecommendation {
  pathId: string;
  pathLabel: string;
  difficulty: 'easy' | 'medium' | 'hard';
  psySupport: 'low' | 'medium' | 'high';
  reason: string;
}
