import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CognitiveProfile, LearningStyle, AnxietyLevel, ConfidenceLevel } from '@/types/learning';

type SemanticContext = 'workplace' | 'travel' | 'daily_life' | 'academic';

interface AssessmentState {
  currentStep: 'welcome' | 'learning-style' | 'anxiety' | 'vocabulary' | 'semantic-context' | 'complete';
  learningStyleAnswers: number[];
  anxietyLevel: AnxietyLevel;
  confidenceLevel: ConfidenceLevel;
  vocabularyAnswers: boolean[];
  userName: string;
  semanticContext: SemanticContext | null;
  
  // Actions
  setStep: (step: AssessmentState['currentStep']) => void;
  addLearningStyleAnswer: (answer: number) => void;
  setAnxietyLevel: (level: AnxietyLevel) => void;
  setConfidenceLevel: (level: ConfidenceLevel) => void;
  addVocabularyAnswer: (correct: boolean) => void;
  setUserName: (name: string) => void;
  setSemanticContext: (context: SemanticContext) => void;
  calculateProfile: () => CognitiveProfile;
  reset: () => void;
}

const initialState = {
  currentStep: 'welcome' as const,
  learningStyleAnswers: [],
  anxietyLevel: 3 as AnxietyLevel,
  confidenceLevel: 3 as ConfidenceLevel,
  vocabularyAnswers: [],
  userName: '',
  semanticContext: null as SemanticContext | null,
};

export const useAssessmentStore = create<AssessmentState>()(
  (set, get) => ({
    ...initialState,

    setStep: (step) => set({ currentStep: step }),
    
    addLearningStyleAnswer: (answer) => 
      set((state) => ({ 
        learningStyleAnswers: [...state.learningStyleAnswers, answer] 
      })),
    
    setAnxietyLevel: (level) => set({ anxietyLevel: level }),
    
    setConfidenceLevel: (level) => set({ confidenceLevel: level }),
    
    addVocabularyAnswer: (correct) => 
      set((state) => ({ 
        vocabularyAnswers: [...state.vocabularyAnswers, correct] 
      })),
    
    setUserName: (name) => set({ userName: name }),

    setSemanticContext: (context) => set({ semanticContext: context }),
    
    calculateProfile: () => {
      const state = get();
      
      const scores: Record<LearningStyle, number> = {
        visual: 0,
        auditory: 0,
        reading: 0,
        kinesthetic: 0,
      };
      
      const styleMap: LearningStyle[] = ['visual', 'auditory', 'reading', 'kinesthetic'];
      state.learningStyleAnswers.forEach((answer) => {
        scores[styleMap[answer]] += 1;
      });
      
      const total = Object.values(scores).reduce((a, b) => a + b, 1);
      Object.keys(scores).forEach((key) => {
        scores[key as LearningStyle] = Math.round((scores[key as LearningStyle] / total) * 100);
      });
      
      const primaryStyle = (Object.entries(scores) as [LearningStyle, number][])
        .sort((a, b) => b[1] - a[1])[0][0];
      
      const correctCount = state.vocabularyAnswers.filter(Boolean).length;
      const vocabLevels = ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced'] as const;
      const vocabIndex = Math.min(Math.floor(correctCount / 2), vocabLevels.length - 1);
      
      return {
        learningStyle: primaryStyle,
        learningStyleScores: scores,
        anxietyLevel: state.anxietyLevel,
        confidenceLevel: state.confidenceLevel,
        vocabularyLevel: vocabLevels[vocabIndex],
        knownConcepts: [],
        preferredChunkDuration: 5,
        semanticContext: state.semanticContext || 'daily_life',
      };
    },
    
    reset: () => set(initialState),
  })
);
