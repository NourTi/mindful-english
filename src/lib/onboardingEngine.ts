import { DiagnosticEngine, DiagnosticAxis, DiagnosticScreener, DiagnosticSection, LearnerProfile, PathRecommendation, ScoringRule, PathSelectionRule } from '@/types/onboarding';
import { safeGetItem, safeSetItem, safeRemoveItem, trackSession } from '@/lib/storage';
import system from '../../data/see_learning_system.json';

const PROFILE_KEY = 'see_learner_profile';

interface SystemData {
  diagnosticEngine: DiagnosticEngine;
  paths: Array<{ id: string; label: string; sequence: string[] }>;
}

const typedSystem = system as unknown as SystemData;

export function getDiagnosticEngine(): DiagnosticEngine {
  return typedSystem.diagnosticEngine;
}

export function getSections(): DiagnosticSection[] {
  return typedSystem.diagnosticEngine.sections || [];
}

export function getAxes(): DiagnosticAxis[] {
  return typedSystem.diagnosticEngine.axes || [];
}

export function getScreeners(): DiagnosticScreener[] {
  return typedSystem.diagnosticEngine.screeners || [];
}

export function getAxisById(id: string): DiagnosticAxis | undefined {
  return getAxes().find(a => a.id === id);
}

export function getScreenerById(id: string): DiagnosticScreener | undefined {
  return getScreeners().find(s => s.id === id);
}

/**
 * Evaluate scoring rules against answers to produce profile labels
 */
function evaluateCondition(condition: Record<string, string>, answers: Record<string, number | string>): boolean {
  for (const [key, rule] of Object.entries(condition)) {
    if (key.endsWith('_max')) continue; // handled by the base key
    
    const value = answers[key];
    if (value === undefined) return false;

    // String equality check (for motivation etc.)
    if (typeof value === 'string') {
      if (value !== rule) return false;
      continue;
    }

    // Numeric comparisons
    if (rule.startsWith('>=')) {
      if (value < Number(rule.slice(2))) return false;
    } else if (rule.startsWith('<=')) {
      if (value > Number(rule.slice(2))) return false;
    } else if (rule.startsWith('>')) {
      if (value <= Number(rule.slice(1))) return false;
    } else if (rule.startsWith('<')) {
      if (value >= Number(rule.slice(1))) return false;
    } else {
      if (value !== Number(rule)) return false;
    }

    // Check _max variant
    const maxKey = `${key}_max`;
    if (condition[maxKey]) {
      const maxRule = condition[maxKey];
      if (maxRule.startsWith('<=') && value > Number(maxRule.slice(2))) return false;
      if (maxRule.startsWith('<') && value >= Number(maxRule.slice(1))) return false;
    }
  }
  return true;
}

export function computeLabels(answers: Record<string, number | string>): string[] {
  const rules: ScoringRule[] = typedSystem.diagnosticEngine.scoringRules || [];
  const labels: string[] = [];
  for (const rule of rules) {
    if (evaluateCondition(rule.condition, answers)) {
      labels.push(rule.label);
    }
  }
  return labels;
}

export function selectPaths(labels: string[]): { primaryPathId: string; secondaryPathId: string } {
  const rules: PathSelectionRule[] = typedSystem.diagnosticEngine.pathSelectionRules || [];
  
  // Find the best matching rule (most labels matched)
  let bestMatch: PathSelectionRule | null = null;
  let bestScore = 0;
  
  for (const rule of rules) {
    const matchCount = rule.labels.filter(l => labels.includes(l)).length;
    if (matchCount > 0 && matchCount >= rule.labels.length && matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = rule;
    }
  }
  
  // Partial match fallback
  if (!bestMatch) {
    for (const rule of rules) {
      const matchCount = rule.labels.filter(l => labels.includes(l)).length;
      if (matchCount > bestScore) {
        bestScore = matchCount;
        bestMatch = rule;
      }
    }
  }
  
  return {
    primaryPathId: bestMatch?.primaryPath || 'path-social-confidence',
    secondaryPathId: bestMatch?.secondaryPath || 'path-travel-english'
  };
}

export function buildLearnerProfile(answers: Record<string, number | string>): LearnerProfile {
  const labels = computeLabels(answers);
  const { primaryPathId, secondaryPathId } = selectPaths(labels);
  
  return {
    speakingLevel: (answers.speaking_level as number) || 3,
    listeningLevel: (answers.listening_level as number) || 3,
    socialAnxiety: (answers.social_anxiety as number) || 3,
    selfEfficacy: (answers.self_efficacy as number) || 3,
    motivation: (answers.motivation as string) || 'Personal growth / Curiosity',
    collocationAwareness: (answers.collocation_awareness as number) || 3,
    preferredFormat: (answers.preferred_format as string) || 'Chat with AI',
    labels,
    primaryPathId,
    secondaryPathId
  };
}

export function buildRecommendation(profile: LearnerProfile): PathRecommendation {
  const primaryPath = typedSystem.paths.find(p => p.id === profile.primaryPathId);
  const secondaryPath = typedSystem.paths.find(p => p.id === profile.secondaryPathId);
  
  const difficulty: 'easy' | 'medium' | 'hard' = 
    profile.socialAnxiety >= 4 || profile.speakingLevel <= 2 ? 'easy' :
    profile.speakingLevel >= 4 && profile.socialAnxiety <= 2 ? 'hard' : 'medium';
  
  const psySupport: 'low' | 'medium' | 'high' =
    profile.socialAnxiety >= 4 ? 'high' :
    profile.socialAnxiety >= 2 ? 'medium' : 'low';

  const reason = generateReason(profile, difficulty, psySupport);

  trackSession({ type: 'assessment', psySupportUsed: psySupport === 'high' });

  return {
    pathId: profile.primaryPathId,
    pathLabel: primaryPath?.label || 'Social Confidence Path',
    difficulty,
    psySupport,
    reason,
    secondaryPathId: profile.secondaryPathId,
    secondaryPathLabel: secondaryPath?.label || 'Travel English Path',
    labels: profile.labels
  };
}

function generateReason(profile: LearnerProfile, difficulty: string, psySupport: string): string {
  const anxietyDesc = profile.socialAnxiety >= 4 ? 'high social anxiety' : profile.socialAnxiety >= 2 ? 'moderate anxiety' : 'good confidence';
  const speakingDesc = profile.speakingLevel <= 2 ? 'beginner speaking skills' : profile.speakingLevel >= 4 ? 'strong speaking foundation' : 'intermediate speaking level';
  const supportDesc = psySupport === 'high' ? 'with extensive psychological support' : psySupport === 'medium' ? 'with balanced pacing and encouragement' : 'focusing on practical challenges';
  
  return `Based on your ${anxietyDesc} and ${speakingDesc}, we recommend starting at ${difficulty} difficulty ${supportDesc}.`;
}

// Storage helpers
export function saveLearnerProfile(profile: LearnerProfile): boolean {
  try {
    const { success } = safeSetItem(PROFILE_KEY, profile);
    return success;
  } catch {
    console.error('Failed to save learner profile');
    return false;
  }
}

export function getLearnerProfile(): LearnerProfile | null {
  try {
    const { data } = safeGetItem<LearnerProfile | null>(PROFILE_KEY, null);
    return data;
  } catch {
    return null;
  }
}

export function hasLearnerProfile(): boolean {
  try {
    const { data } = safeGetItem<LearnerProfile | null>(PROFILE_KEY, null);
    return data !== null;
  } catch {
    return false;
  }
}

export function clearLearnerProfile(): void {
  safeRemoveItem(PROFILE_KEY);
}

export function getFirstLessonFromPath(pathId: string): string | null {
  const path = typedSystem.paths.find(p => p.id === pathId);
  if (!path || path.sequence.length === 0) return null;
  return path.sequence[0];
}

// Legacy compat
export function getRecommendedPath(profile: { speaking_level: number; listening_level: number; anxiety: string; motivation: string; format: string }): PathRecommendation {
  const answers: Record<string, number | string> = {
    speaking_level: profile.speaking_level,
    listening_level: profile.listening_level,
    social_anxiety: profile.anxiety.toLowerCase().includes('high') ? 5 : profile.anxiety.toLowerCase().includes('medium') ? 3 : 1,
    motivation: profile.motivation,
    self_efficacy: 3,
    collocation_awareness: 3,
    preferred_format: profile.format
  };
  const learnerProfile = buildLearnerProfile(answers);
  return buildRecommendation(learnerProfile);
}

export function saveOnboardingProfile(profile: { speaking_level: number; listening_level: number; anxiety: string; motivation: string; format: string }): boolean {
  const answers: Record<string, number | string> = {
    speaking_level: profile.speaking_level,
    listening_level: profile.listening_level,
    social_anxiety: profile.anxiety.toLowerCase().includes('high') ? 5 : profile.anxiety.toLowerCase().includes('medium') ? 3 : 1,
    motivation: profile.motivation,
    self_efficacy: 3,
    collocation_awareness: 3,
    preferred_format: profile.format
  };
  const learnerProfile = buildLearnerProfile(answers);
  return saveLearnerProfile(learnerProfile);
}

export function isOnboardingComplete(): boolean {
  return hasLearnerProfile();
}

export function clearOnboardingData(): void {
  clearLearnerProfile();
}

export function getOnboardingProfile() {
  return getLearnerProfile();
}
