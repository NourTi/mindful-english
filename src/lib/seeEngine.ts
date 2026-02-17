/**
 * SEE Multi-Agent Engine
 * Adapted from DeepTutor's architecture patterns (not source code).
 * Implements a lightweight 3-agent orchestration for ESL learning.
 */

import { getLessons, getExercisesByLesson, getLessonById } from './seeLearningSystem';
import { getLearnerProfile } from './onboardingEngine';
import type { LearnerProfile } from '@/types/onboarding';

// ─── Types ────────────────────────────────────────────────────────────

export interface SeeAgent {
  role: 'diagnosis' | 'lesson_planner' | 'feedback';
  name: string;
  goals: string[];
  tools: string[];
  policies: string[];
}

export interface ToolLayer {
  searchLessons: (query: string, environment?: string) => SearchResult[];
  tts: (text: string) => Promise<void>; // stub
  log: (event: string, data: Record<string, unknown>) => void;
}

export interface SearchResult {
  lessonId: string;
  title: string;
  environment: string;
  relevance: number;
}

export interface AgentOutput {
  agentRole: string;
  diagnosis?: DiagnosisOutput;
  plan?: PlanOutput;
  feedback?: FeedbackOutput;
}

export interface DiagnosisOutput {
  currentLevel: string;
  anxietyState: 'low' | 'medium' | 'high';
  strengths: string[];
  gaps: string[];
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
}

export interface PlanOutput {
  nextExerciseId: string | null;
  nextExercisePrompt: string | null;
  conversationPrompt: string | null;
  recommendedVideos: VideoRecommendation[];
  lessonContext: string;
}

export interface FeedbackOutput {
  encouragement: string;
  corrections: string[];
  emotionCheck: EmotionCheck | null;
  adaptiveHint: string | null;
}

export interface VideoRecommendation {
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  source: string;
}

export interface EmotionCheck {
  question: string;
  type: 'anxiety' | 'confidence';
  options: string[];
}

// ─── Agent Definitions ────────────────────────────────────────────────

export const AGENTS: Record<string, SeeAgent> = {
  diagnosis: {
    role: 'diagnosis',
    name: 'DiagnosisAgent',
    goals: [
      'Assess learner current state from profile + diagnosticEngine',
      'Identify anxiety level and speaking gaps',
      'Determine appropriate difficulty level',
    ],
    tools: ['searchLessons', 'log'],
    policies: [
      'Never increase difficulty if anxiety is high',
      'Always check self-efficacy before challenging tasks',
    ],
  },
  lesson_planner: {
    role: 'lesson_planner',
    name: 'LessonPlannerAgent',
    goals: [
      'Select the next suitable exercise based on diagnosis',
      'Pick conversation prompts matching the lesson environment',
      'Recommend contextual videos for reinforcement',
    ],
    tools: ['searchLessons', 'log'],
    policies: [
      'Prioritize exercises matching learner psyTargets',
      'Include at least 1 video recommendation when available',
    ],
  },
  feedback: {
    role: 'feedback',
    name: 'FeedbackAgent',
    goals: [
      'Generate psy-aware feedback on learner responses',
      'Insert emotion checks at appropriate intervals',
      'Adapt encouragement based on anxiety + self-efficacy',
    ],
    tools: ['tts', 'log'],
    policies: [
      'Use growth-mindset language for all feedback',
      'If anxiety is high, prioritize encouragement over correction',
    ],
  },
};

// ─── Tool Layer Implementation ────────────────────────────────────────

export function createToolLayer(): ToolLayer {
  return {
    searchLessons(query: string, environment?: string): SearchResult[] {
      const lessons = getLessons();
      return lessons
        .filter(l => {
          const matchesEnv = !environment || l.environment === environment;
          const matchesQuery = !query ||
            l.title.toLowerCase().includes(query.toLowerCase()) ||
            l.learningGoals.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
            l.psyTargets.some(t => t.toLowerCase().includes(query.toLowerCase()));
          return matchesEnv && matchesQuery;
        })
        .map(l => ({
          lessonId: l.id,
          title: l.title,
          environment: l.environment,
          relevance: query && l.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0.5,
        }))
        .sort((a, b) => b.relevance - a.relevance);
    },

    async tts(_text: string): Promise<void> {
      // Stub — will integrate with Kokoro TTS in future
      console.log('[TTS stub] Would speak:', _text.substring(0, 50));
    },

    log(event: string, data: Record<string, unknown>): void {
      console.log(`[SEE:${event}]`, JSON.stringify(data));
    },
  };
}

// ─── Agent Orchestration ──────────────────────────────────────────────

/**
 * Runs the DiagnosisAgent: reads learner profile and determines current state
 */
export function runDiagnosis(profile: LearnerProfile | null): DiagnosisOutput {
  if (!profile) {
    return {
      currentLevel: 'unknown',
      anxietyState: 'medium',
      strengths: [],
      gaps: ['No learner profile available'],
      recommendedDifficulty: 'easy',
    };
  }

  const anxietyState: 'low' | 'medium' | 'high' =
    profile.socialAnxiety >= 4 ? 'high' :
    profile.socialAnxiety >= 2 ? 'medium' : 'low';

  const strengths: string[] = [];
  const gaps: string[] = [];

  if (profile.speakingLevel >= 4) strengths.push('Strong speaking foundation');
  else if (profile.speakingLevel <= 2) gaps.push('Speaking confidence needs building');
  
  if (profile.listeningLevel >= 4) strengths.push('Good listening comprehension');
  else if (profile.listeningLevel <= 2) gaps.push('Listening skills need development');

  if (profile.collocationAwareness >= 4) strengths.push('Natural collocation awareness');
  else if (profile.collocationAwareness <= 2) gaps.push('Collocation practice needed');

  if (profile.selfEfficacy >= 4) strengths.push('High self-efficacy');
  else if (profile.selfEfficacy <= 2) gaps.push('Self-efficacy needs nurturing');

  const recommendedDifficulty: 'easy' | 'medium' | 'hard' =
    anxietyState === 'high' || profile.speakingLevel <= 2 ? 'easy' :
    profile.speakingLevel >= 4 && anxietyState === 'low' ? 'hard' : 'medium';

  return {
    currentLevel: profile.speakingLevel <= 2 ? 'beginner' :
                   profile.speakingLevel >= 4 ? 'advanced' : 'intermediate',
    anxietyState,
    strengths,
    gaps,
    recommendedDifficulty,
  };
}

/**
 * Runs the LessonPlannerAgent: selects next exercise and conversation prompts
 */
export function runLessonPlanner(
  lessonId: string,
  diagnosis: DiagnosisOutput,
  tools: ToolLayer
): PlanOutput {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return {
      nextExerciseId: null,
      nextExercisePrompt: null,
      conversationPrompt: null,
      recommendedVideos: [],
      lessonContext: 'Lesson not found',
    };
  }

  const exercises = getExercisesByLesson(lessonId);
  
  // Select exercise based on difficulty
  const selectedExercise = exercises.length > 0 ? exercises[0] : null;

  // Get conversation prompt
  const conversationPrompts = (lesson as any).conversationPrompts as string[] | undefined;
  const conversationPrompt = conversationPrompts && conversationPrompts.length > 0
    ? conversationPrompts[0]
    : null;

  tools.log('lesson_plan_created', {
    lessonId,
    exerciseId: selectedExercise?.id,
    difficulty: diagnosis.recommendedDifficulty,
  });

  return {
    nextExerciseId: selectedExercise?.id || null,
    nextExercisePrompt: selectedExercise?.prompt || null,
    conversationPrompt,
    recommendedVideos: [], // Will be populated by video content provider
    lessonContext: `${lesson.title} (${lesson.environment})`,
  };
}

/**
 * Runs the FeedbackAgent: generates emotion-aware feedback context
 */
export function runFeedbackAgent(
  lessonId: string,
  diagnosis: DiagnosisOutput,
  turnCount: number,
  tools: ToolLayer
): FeedbackOutput {
  const lesson = getLessonById(lessonId);
  const emotionChecks = (lesson as any)?.emotionChecks as Array<{
    question: string;
    type: 'anxiety' | 'confidence';
    options: string[];
  }> | undefined;

  // Insert emotion check every 3-5 turns
  const shouldCheckEmotion = turnCount > 0 && turnCount % 4 === 0 && emotionChecks && emotionChecks.length > 0;
  const checkIndex = Math.floor(turnCount / 4) % (emotionChecks?.length || 1);

  const encouragement = diagnosis.anxietyState === 'high'
    ? "You're doing really well. Take your time — there's no rush at all."
    : diagnosis.anxietyState === 'medium'
    ? "Great progress! Keep going at your own pace."
    : "Excellent work! You're handling this like a pro.";

  const adaptiveHint = diagnosis.anxietyState === 'high'
    ? "Remember: making mistakes is how we learn. Every attempt makes you stronger."
    : null;

  tools.log('feedback_generated', {
    lessonId,
    turnCount,
    anxietyState: diagnosis.anxietyState,
    emotionCheckTriggered: shouldCheckEmotion,
  });

  return {
    encouragement,
    corrections: [],
    emotionCheck: shouldCheckEmotion && emotionChecks
      ? {
          question: emotionChecks[checkIndex].question,
          type: emotionChecks[checkIndex].type,
          options: emotionChecks[checkIndex].options,
        }
      : null,
    adaptiveHint,
  };
}

/**
 * Main orchestrator: runs all 3 agents in sequence and returns combined output.
 * Called when a chat lesson starts or at key interaction points.
 */
export function orchestrateAgents(
  lessonId: string,
  turnCount: number = 0
): {
  diagnosis: DiagnosisOutput;
  plan: PlanOutput;
  feedback: FeedbackOutput;
} {
  const tools = createToolLayer();
  const profile = getLearnerProfile();

  // 1. DiagnosisAgent
  const diagnosis = runDiagnosis(profile);
  tools.log('diagnosis_complete', { diagnosis });

  // 2. LessonPlannerAgent
  const plan = runLessonPlanner(lessonId, diagnosis, tools);

  // 3. FeedbackAgent
  const feedback = runFeedbackAgent(lessonId, diagnosis, turnCount, tools);

  return { diagnosis, plan, feedback };
}
