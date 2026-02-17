// Types for SEE Learning System

export interface SeeMeta {
  version: string;
  sourceModels: string[];
  description: string;
}

export interface SeeLevel {
  level: number;
  label: string;
  minXP: number;
}

export interface SeeLearnerModel {
  traits: string[];
  levels: SeeLevel[];
}

export interface SeeModule {
  id: string;
  type: string;
  title: string;
  instructions: string;
  content?: string;
}

export interface SeeLesson {
  id: string;
  title: string;
  mode: string;
  environment: string;
  psyTargets: string[];
  learningGoals: string[];
  modules: SeeModule[];
  // Backward compat optional fields
  tags?: string[];
  psyProfileTarget?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface SeeExercise {
  id: string;
  lessonId: string;
  skill: string;
  knowledgeComponent: string;
  prompt: string;
  expectedResponseType: string;
  maxAttempts: number;
  xpReward: number;
}

export interface SeePath {
  id: string;
  label: string;
  forTraits: string[];
  sequence: string[];
}

export interface SeeMode {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface SeeAdaptivityConditions {
  psyState?: string[];
  lastExerciseResult?: string;
  streakSuccessCount?: number;
}

export interface SeeAdaptivityAction {
  type: string;
  supportModuleType?: string;
}

export interface SeeAdaptivityRule {
  id: string;
  description: string;
  conditions: SeeAdaptivityConditions;
  action: SeeAdaptivityAction;
}

export interface SeeAvatarCharacter {
  characterId: string;
  role: string;
  environments: string[];
  defaultEmotion: string;
  emotionProfile: Record<string, string>;
  description: string;
}

export interface SeeLearningSystem {
  meta: SeeMeta;
  learnerModel: SeeLearnerModel;
  modes: SeeMode[];
  lessons: SeeLesson[];
  exercises: SeeExercise[];
  paths: SeePath[];
  adaptivityRules: SeeAdaptivityRule[];
  diagnosticEngine: unknown;
  avatarCharacters?: SeeAvatarCharacter[];
}

// Import the JSON data
import system from '../../data/see_learning_system.json';

const typedSystem = system as unknown as SeeLearningSystem;

// Helper functions
export function getLessons(): SeeLesson[] {
  return typedSystem.lessons || [];
}

export function getExercisesByLesson(lessonId: string): SeeExercise[] {
  return (typedSystem.exercises || []).filter(ex => ex.lessonId === lessonId);
}

export function getPaths(): SeePath[] {
  return typedSystem.paths || [];
}

export function getAdaptivityRules(): SeeAdaptivityRule[] {
  return typedSystem.adaptivityRules || [];
}

export function getMeta(): SeeMeta {
  return typedSystem.meta;
}

export function getLearnerModel(): SeeLearnerModel {
  return typedSystem.learnerModel;
}

export function getLessonById(lessonId: string): SeeLesson | undefined {
  return (typedSystem.lessons || []).find(lesson => lesson.id === lessonId);
}

export function getPathById(pathId: string): SeePath | undefined {
  return (typedSystem.paths || []).find(path => path.id === pathId);
}

// New helpers
export function getModes(): SeeMode[] {
  return typedSystem.modes || [];
}

export function getLessonsByMode(modeId: string): SeeLesson[] {
  return (typedSystem.lessons || []).filter(lesson => lesson.mode === modeId);
}

// Avatar character helpers
export function getAvatarCharacters(): SeeAvatarCharacter[] {
  return typedSystem.avatarCharacters || [];
}

export function getAvatarForEnvironment(environment: string): SeeAvatarCharacter | undefined {
  return (typedSystem.avatarCharacters || []).find(c =>
    c.environments.includes(environment)
  );
}
