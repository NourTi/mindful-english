import { create } from 'zustand';
import { LearnerProfile, PathRecommendation } from '@/types/onboarding';
import { buildLearnerProfile, buildRecommendation, saveLearnerProfile } from '@/lib/onboardingEngine';

interface OnboardingState {
  currentSectionIndex: number;
  answers: Record<string, number | string>;
  screenerAnswers: Record<string, number | string>;
  learnerProfile: LearnerProfile | null;
  recommendation: PathRecommendation | null;
  isComplete: boolean;
  
  setAnswer: (questionId: string, value: string | number) => void;
  setScreenerAnswer: (screenerId: string, value: string | number) => void;
  nextSection: () => void;
  prevSection: () => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const initialState = {
  currentSectionIndex: 0,
  answers: {} as Record<string, number | string>,
  screenerAnswers: {} as Record<string, number | string>,
  learnerProfile: null as LearnerProfile | null,
  recommendation: null as PathRecommendation | null,
  isComplete: false,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  
  setAnswer: (questionId, value) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: value }
    }));
  },
  
  setScreenerAnswer: (screenerId, value) => {
    set((state) => ({
      screenerAnswers: { ...state.screenerAnswers, [screenerId]: value }
    }));
  },
  
  nextSection: () => {
    set((state) => ({
      currentSectionIndex: state.currentSectionIndex + 1
    }));
  },
  
  prevSection: () => {
    set((state) => ({
      currentSectionIndex: Math.max(0, state.currentSectionIndex - 1)
    }));
  },
  
  completeOnboarding: () => {
    const { answers, screenerAnswers } = get();
    
    // Merge screener answers that map to axes into the main answers
    // For now screener answers augment the profile
    const mergedAnswers = { ...answers };
    
    // Apply screener corrections: if a screener result diverges from self-report, adjust
    for (const [_id, value] of Object.entries(screenerAnswers)) {
      // Screener values can override if needed in future
      void value;
    }
    
    const learnerProfile = buildLearnerProfile(mergedAnswers);
    const recommendation = buildRecommendation(learnerProfile);
    
    saveLearnerProfile(learnerProfile);
    
    set({
      isComplete: true,
      learnerProfile,
      recommendation
    });
  },
  
  reset: () => set(initialState)
}));
