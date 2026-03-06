// Types for SEE Challenge System

export type PsyProfile = 'mild_anxiety' | 'introvert' | 'extrovert' | 'perfectionist';
export type SkillType = 'listening' | 'speaking' | 'confidence' | 'reading' | 'writing';
export type Environment = 'airport' | 'cafe' | 'meetup' | 'classroom' | 'office' | 'street' | 'marketplace' | 'bank';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type StepKind = 'psyground' | 'dialogue' | 'reflection';

export interface SeeChallengeStep {
  kind: StepKind;
  text: string;
}

export interface SeeChallenge {
  id: string;
  label: string;
  type: 'challenge';
  environment: Environment;
  difficulty: Difficulty;
  psyProfile: PsyProfile[];
  skills: SkillType[];
  xpReward: number;
  steps: SeeChallengeStep[];
}

export interface SeeCommunityPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
}

export interface SeeLevel {
  level: number;
  label: string;
  requiredXP: number;
}

export interface SeeBadge {
  id: string;
  label: string;
  description: string;
}

export interface SeeProgress {
  levels: SeeLevel[];
  badges: SeeBadge[];
}

export interface SeePath {
  id: string;
  label: string;
  psyProfile: PsyProfile[];
  sequence: string[];
}

// Loader functions
import seeChallengesData from '../../data/see_challenges.json';
import seeCommunityPromptsData from '../../data/see_community_prompts.json';
import seeProgressData from '../../data/see_progress.json';
import seePathsData from '../../data/see_paths.json';

export function loadSeeChallenges(): SeeChallenge[] {
  return seeChallengesData as SeeChallenge[];
}

export function loadSeeCommunityPrompts(): SeeCommunityPrompt[] {
  return seeCommunityPromptsData as SeeCommunityPrompt[];
}

export function loadSeeProgress(): SeeProgress {
  return seeProgressData as SeeProgress;
}

export function loadSeePaths(): SeePath[] {
  return seePathsData as SeePath[];
}
