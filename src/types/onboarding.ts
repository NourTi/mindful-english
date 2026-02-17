// Onboarding & Diagnostic Engine Types

export interface DiagnosticAxis {
  id: string;
  label: string;
  description: string;
  section: string;
  scale?: { min: number; max: number };
  type?: 'multiple';
  options?: string[];
  exampleItems: string[];
}

export interface DiagnosticScreener {
  id: string;
  type: string;
  section: string;
  title: string;
  instructions: string;
  stimulus?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  scale?: { min: number; max: number; labels?: string[] };
  pairs?: { a: string; b: string; correct: string }[];
  mapsToAxis: string;
}

export interface DiagnosticSection {
  id: string;
  title: string;
  axisIds: string[];
  screenerIds: string[];
}

export interface ScoringRule {
  condition: Record<string, string>;
  label: string;
}

export interface PathSelectionRule {
  labels: string[];
  primaryPath: string;
  secondaryPath: string;
}

export interface DiagnosticEngine {
  axes: DiagnosticAxis[];
  screeners: DiagnosticScreener[];
  sections: DiagnosticSection[];
  scoringRules: ScoringRule[];
  pathSelectionRules: PathSelectionRule[];
}

export interface LearnerProfile {
  speakingLevel: number;
  listeningLevel: number;
  socialAnxiety: number;
  selfEfficacy: number;
  motivation: string;
  collocationAwareness: number;
  preferredFormat: string;
  labels: string[];
  primaryPathId: string;
  secondaryPathId: string;
}

export interface SeeMode {
  id: string;
  label: string;
  description: string;
  icon: string;
}

// Legacy compat types
export interface ProfileMapping {
  recommendedPath: string;
  startingDifficulty: 'easy' | 'medium' | 'hard';
  psySupport: 'low' | 'medium' | 'high';
}

export interface PathRecommendation {
  pathId: string;
  pathLabel: string;
  difficulty: 'easy' | 'medium' | 'hard';
  psySupport: 'low' | 'medium' | 'high';
  reason: string;
  secondaryPathId?: string;
  secondaryPathLabel?: string;
  labels?: string[];
}

// Keep old types for backward compat
export type ScaleQuestion = { id: string; question: string; description?: string; type: 'scale'; min: number; max: number };
export type MultipleQuestion = { id: string; question: string; type: 'multiple'; options: string[] };
export type AssessmentQuestion = ScaleQuestion | MultipleQuestion;
export interface AssessmentSection { title: string; questions: AssessmentQuestion[] }
export interface AssessmentData { welcome: string; sections: AssessmentSection[]; profileMapping: Record<string, ProfileMapping> }
export interface AssessmentProfile {
  speaking_level: number;
  listening_level: number;
  anxiety: string;
  motivation: string;
  format: string;
}
