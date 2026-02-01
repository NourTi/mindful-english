import { 
  getAdaptivityRules, 
  getLessonById, 
  getPaths,
  SeeAdaptivityRule, 
  SeeModule,
  SeePath
} from './seeLearningSystem';

export type PsyState = 'anxious' | 'confident' | 'neutral' | 'frustrated';

export interface AdaptivityResult {
  nextLessonId: string;
  action: 'repeat' | 'advance' | 'stay';
  supportModule?: SeeModule;
  message: string;
}

/**
 * Finds the active path that contains the current lesson
 */
function findActivePath(currentLessonId: string): SeePath | undefined {
  const paths = getPaths();
  return paths.find(path => path.sequence.includes(currentLessonId));
}

/**
 * Gets the next lesson ID in the path sequence
 */
function getNextLessonInPath(currentLessonId: string, path: SeePath): string | null {
  const currentIndex = path.sequence.indexOf(currentLessonId);
  if (currentIndex === -1 || currentIndex >= path.sequence.length - 1) {
    return null; // Not found or already at the last lesson
  }
  return path.sequence[currentIndex + 1];
}

/**
 * Checks if a rule matches the current learner state
 */
function ruleMatches(
  rule: SeeAdaptivityRule, 
  psyState: PsyState, 
  streakSuccessCount: number,
  lastExerciseResult?: 'pass' | 'fail'
): boolean {
  const { conditions } = rule;
  
  // Check psyState condition
  if (conditions.psyState && !conditions.psyState.includes(psyState)) {
    return false;
  }
  
  // Check lastExerciseResult condition
  if (conditions.lastExerciseResult && lastExerciseResult !== conditions.lastExerciseResult) {
    return false;
  }
  
  // Check streakSuccessCount condition
  if (conditions.streakSuccessCount !== undefined && streakSuccessCount < conditions.streakSuccessCount) {
    return false;
  }
  
  return true;
}

/**
 * Decides the next step based on adaptivity rules
 * 
 * @param currentLessonId - The ID of the current lesson
 * @param psyState - The learner's current psychological state
 * @param streakSuccessCount - Number of consecutive correct answers
 * @param lastExerciseResult - Result of the last exercise (pass/fail)
 * @returns AdaptivityResult with next lesson and any support modules
 */
export function decideNextStep(
  currentLessonId: string,
  psyState: PsyState,
  streakSuccessCount: number,
  lastExerciseResult?: 'pass' | 'fail'
): AdaptivityResult {
  const rules = getAdaptivityRules();
  const currentLesson = getLessonById(currentLessonId);
  const activePath = findActivePath(currentLessonId);
  
  // Find matching rule
  const matchingRule = rules.find(rule => 
    ruleMatches(rule, psyState, streakSuccessCount, lastExerciseResult)
  );
  
  // Default result - stay on current lesson
  const defaultResult: AdaptivityResult = {
    nextLessonId: currentLessonId,
    action: 'stay',
    message: 'Continue with the current lesson.'
  };
  
  if (!matchingRule) {
    return defaultResult;
  }
  
  // Handle rule-anxious-easy: repeat with support
  if (matchingRule.action.type === 'repeat_lesson_with_support') {
    const supportModuleType = matchingRule.action.supportModuleType || 'psy_prep';
    const supportModule = currentLesson?.modules.find(
      mod => mod.type === supportModuleType
    );
    
    return {
      nextLessonId: currentLessonId,
      action: 'repeat',
      supportModule,
      message: supportModule 
        ? `Take a moment to ground yourself. ${supportModule.content}`
        : 'Take a deep breath and try again. You\'re doing great!'
    };
  }
  
  // Handle rule-confident-progress: advance to next lesson
  if (matchingRule.action.type === 'advance_in_path') {
    if (!activePath) {
      return {
        ...defaultResult,
        message: 'Great job! Continue exploring more lessons.'
      };
    }
    
    const nextLessonId = getNextLessonInPath(currentLessonId, activePath);
    
    if (nextLessonId) {
      const nextLesson = getLessonById(nextLessonId);
      return {
        nextLessonId,
        action: 'advance',
        message: `Excellent progress! You're ready for "${nextLesson?.title || 'the next lesson'}".`
      };
    } else {
      return {
        nextLessonId: currentLessonId,
        action: 'stay',
        message: 'Congratulations! You\'ve completed this learning path! 🎉'
      };
    }
  }
  
  return defaultResult;
}

/**
 * Hook-friendly state interface for tracking learner progress
 */
export interface LearnerAdaptivityState {
  psyState: PsyState;
  streakSuccessCount: number;
  lastExerciseResult?: 'pass' | 'fail';
}

/**
 * Updates the learner state based on exercise result
 */
export function updateLearnerState(
  currentState: LearnerAdaptivityState,
  exerciseResult: 'pass' | 'fail'
): LearnerAdaptivityState {
  if (exerciseResult === 'pass') {
    const newStreak = currentState.streakSuccessCount + 1;
    return {
      psyState: newStreak >= 3 ? 'confident' : currentState.psyState,
      streakSuccessCount: newStreak,
      lastExerciseResult: 'pass'
    };
  } else {
    return {
      psyState: currentState.psyState === 'anxious' ? 'anxious' : 'neutral',
      streakSuccessCount: 0,
      lastExerciseResult: 'fail'
    };
  }
}
