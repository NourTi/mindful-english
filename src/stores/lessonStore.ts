import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LessonContent, LearningStyle, CognitiveProfile, EmotionalFeedback } from '@/types/learning';
import { determineEmotionalFeedback } from '@/lib/psycholinguistics';

export interface LessonChunk {
  id: string;
  content: string;
  type: 'introduction' | 'content' | 'practice' | 'review';
  estimatedSeconds: number;
  completed: boolean;
}

export interface LessonProgress {
  lessonId: string;
  currentChunkIndex: number;
  totalChunks: number;
  completedChunks: number[];
  correctAnswers: number;
  totalQuestions: number;
  consecutiveErrors: number;
  startedAt: Date;
  lastActivityAt: Date;
  xpEarned: number;
}

interface LessonState {
  currentLesson: LessonContent | null;
  chunks: LessonChunk[];
  progress: LessonProgress | null;
  emotionalFeedback: EmotionalFeedback | null;
  isInBreathingExercise: boolean;
  completedLessons: string[];
  totalXP: number;
  
  // Actions
  startLesson: (lesson: LessonContent, profile: CognitiveProfile) => void;
  nextChunk: () => void;
  previousChunk: () => void;
  markChunkComplete: () => void;
  recordAnswer: (correct: boolean) => void;
  triggerBreathingExercise: () => void;
  completeBreathingExercise: () => void;
  clearEmotionalFeedback: () => void;
  completeLesson: () => void;
  resetLesson: () => void;
}

// Generate chunks based on content type and profile
const generateChunks = (lesson: LessonContent, profile: CognitiveProfile): LessonChunk[] => {
  const chunkDuration = profile.preferredChunkDuration * 60; // Convert to seconds
  const style = profile.learningStyle;
  const content = lesson.contentVariants[style];
  
  const chunks: LessonChunk[] = [];
  
  // Introduction chunk
  chunks.push({
    id: `${lesson.id}-intro`,
    content: 'introduction',
    type: 'introduction',
    estimatedSeconds: Math.min(60, chunkDuration / 3),
    completed: false,
  });
  
  // Content chunks based on learning style
  if (style === 'visual') {
    const visualContent = content as typeof lesson.contentVariants.visual;
    visualContent.images.forEach((_, i) => {
      chunks.push({
        id: `${lesson.id}-visual-${i}`,
        content: `visual-${i}`,
        type: 'content',
        estimatedSeconds: chunkDuration,
        completed: false,
      });
    });
  } else if (style === 'reading') {
    const readingContent = content as typeof lesson.contentVariants.reading;
    // Split main text into paragraphs for chunking
    const paragraphs = readingContent.mainText.split('\n\n');
    paragraphs.forEach((_, i) => {
      chunks.push({
        id: `${lesson.id}-reading-${i}`,
        content: `reading-${i}`,
        type: 'content',
        estimatedSeconds: chunkDuration,
        completed: false,
      });
    });
  } else if (style === 'auditory') {
    chunks.push({
      id: `${lesson.id}-audio-main`,
      content: 'audio-main',
      type: 'content',
      estimatedSeconds: chunkDuration * 2,
      completed: false,
    });
  } else if (style === 'kinesthetic') {
    const kinContent = content as typeof lesson.contentVariants.kinesthetic;
    kinContent.rolePlayPrompts.forEach((_, i) => {
      chunks.push({
        id: `${lesson.id}-kinesthetic-${i}`,
        content: `kinesthetic-${i}`,
        type: 'content',
        estimatedSeconds: chunkDuration,
        completed: false,
      });
    });
  }
  
  // Practice chunk
  chunks.push({
    id: `${lesson.id}-practice`,
    content: 'practice',
    type: 'practice',
    estimatedSeconds: chunkDuration,
    completed: false,
  });
  
  // Review chunk
  chunks.push({
    id: `${lesson.id}-review`,
    content: 'review',
    type: 'review',
    estimatedSeconds: chunkDuration / 2,
    completed: false,
  });
  
  return chunks;
};

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      currentLesson: null,
      chunks: [],
      progress: null,
      emotionalFeedback: null,
      isInBreathingExercise: false,
      completedLessons: [],
      totalXP: 0,

      startLesson: (lesson, profile) => {
        const chunks = generateChunks(lesson, profile);
        set({
          currentLesson: lesson,
          chunks,
          progress: {
            lessonId: lesson.id,
            currentChunkIndex: 0,
            totalChunks: chunks.length,
            completedChunks: [],
            correctAnswers: 0,
            totalQuestions: 0,
            consecutiveErrors: 0,
            startedAt: new Date(),
            lastActivityAt: new Date(),
            xpEarned: 0,
          },
          emotionalFeedback: null,
          isInBreathingExercise: false,
        });
      },

      nextChunk: () => {
        const { progress, chunks } = get();
        if (!progress || progress.currentChunkIndex >= chunks.length - 1) return;
        
        set({
          progress: {
            ...progress,
            currentChunkIndex: progress.currentChunkIndex + 1,
            lastActivityAt: new Date(),
          },
        });
      },

      previousChunk: () => {
        const { progress } = get();
        if (!progress || progress.currentChunkIndex <= 0) return;
        
        set({
          progress: {
            ...progress,
            currentChunkIndex: progress.currentChunkIndex - 1,
            lastActivityAt: new Date(),
          },
        });
      },

      markChunkComplete: () => {
        const { progress, chunks } = get();
        if (!progress) return;
        
        const currentChunk = chunks[progress.currentChunkIndex];
        const updatedChunks = chunks.map(c => 
          c.id === currentChunk.id ? { ...c, completed: true } : c
        );
        
        const completedChunks = progress.completedChunks.includes(progress.currentChunkIndex)
          ? progress.completedChunks
          : [...progress.completedChunks, progress.currentChunkIndex];
        
        const xpGain = currentChunk.type === 'practice' ? 20 : 10;
        
        set({
          chunks: updatedChunks,
          progress: {
            ...progress,
            completedChunks,
            xpEarned: progress.xpEarned + xpGain,
            lastActivityAt: new Date(),
          },
        });
      },

      recordAnswer: (correct) => {
        const { progress } = get();
        if (!progress) return;
        
        const newConsecutiveErrors = correct ? 0 : progress.consecutiveErrors + 1;
        const feedback = determineEmotionalFeedback(newConsecutiveErrors, correct);
        
        set({
          progress: {
            ...progress,
            correctAnswers: correct ? progress.correctAnswers + 1 : progress.correctAnswers,
            totalQuestions: progress.totalQuestions + 1,
            consecutiveErrors: newConsecutiveErrors,
            xpEarned: correct ? progress.xpEarned + 5 : progress.xpEarned,
            lastActivityAt: new Date(),
          },
          emotionalFeedback: feedback,
          isInBreathingExercise: feedback?.action === 'simplify' || newConsecutiveErrors >= 3,
        });
      },

      triggerBreathingExercise: () => {
        set({ isInBreathingExercise: true });
      },

      completeBreathingExercise: () => {
        const { progress } = get();
        set({
          isInBreathingExercise: false,
          emotionalFeedback: null,
          progress: progress ? {
            ...progress,
            consecutiveErrors: 0,
          } : null,
        });
      },

      clearEmotionalFeedback: () => {
        set({ emotionalFeedback: null });
      },

      completeLesson: () => {
        const { currentLesson, progress, completedLessons, totalXP } = get();
        if (!currentLesson || !progress) return;
        
        set({
          completedLessons: [...completedLessons, currentLesson.id],
          totalXP: totalXP + progress.xpEarned + 50, // Bonus XP for completion
          currentLesson: null,
          chunks: [],
          progress: null,
        });
      },

      resetLesson: () => {
        set({
          currentLesson: null,
          chunks: [],
          progress: null,
          emotionalFeedback: null,
          isInBreathingExercise: false,
        });
      },
    }),
    {
      name: 'see-lessons',
    }
  )
);
