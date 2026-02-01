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
  type: 'psy_prep' | 'dialogue' | 'reflection';
  title: string;
  content: string;
}

export interface SeeLesson {
  id: string;
  title: string;
  environment: string;
  tags: string[];
  psyProfileTarget: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  modules: SeeModule[];
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

export interface SeeLearningSystem {
  meta: SeeMeta;
  learnerModel: SeeLearnerModel;
  lessons: SeeLesson[];
  exercises: SeeExercise[];
  paths: SeePath[];
  adaptivityRules: SeeAdaptivityRule[];
}

// Import the JSON data
import system from '../../data/see_learning_system.json';

const typedSystem = system as SeeLearningSystem;

// Helper functions
export function getLessons(): SeeLesson[] {
  return typedSystem.lessons;
}

export function getExercisesByLesson(lessonId: string): SeeExercise[] {
  return typedSystem.exercises.filter(ex => ex.lessonId === lessonId);
}

export function getPaths(): SeePath[] {
  return typedSystem.paths;
}

export function getAdaptivityRules(): SeeAdaptivityRule[] {
  return typedSystem.adaptivityRules;
}

// Additional helper functions
export function getMeta(): SeeMeta {
  return typedSystem.meta;
}

export function getLearnerModel(): SeeLearnerModel {
  return typedSystem.learnerModel;
}

export function getLessonById(lessonId: string): SeeLesson | undefined {
  return typedSystem.lessons.find(lesson => lesson.id === lessonId);
}

export function getPathById(pathId: string): SeePath | undefined {
  return typedSystem.paths.find(path => path.id === pathId);
}
