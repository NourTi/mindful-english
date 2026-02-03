import { create } from 'zustand';
import { AssessmentProfile, PathRecommendation } from '@/types/onboarding';
import { getRecommendedPath, saveOnboardingProfile } from '@/lib/onboardingEngine';

interface OnboardingState {
  currentSectionIndex: number;
  answers: Partial<AssessmentProfile>;
  recommendation: PathRecommendation | null;
  isComplete: boolean;
  
  // Actions
  setAnswer: (questionId: string, value: string | number) => void;
  nextSection: () => void;
  prevSection: () => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const initialState = {
  currentSectionIndex: 0,
  answers: {} as Partial<AssessmentProfile>,
  recommendation: null as PathRecommendation | null,
  isComplete: false,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  
  setAnswer: (questionId, value) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: value
      }
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
    const { answers } = get();
    
    // Create full profile with defaults for any missing values
    const profile: AssessmentProfile = {
      speaking_level: (answers.speaking_level as number) || 3,
      listening_level: (answers.listening_level as number) || 3,
      anxiety: (answers.anxiety as string) || 'Medium - nervous but try',
      motivation: (answers.motivation as string) || 'Personal growth',
      format: (answers.format as string) || 'Chat with AI'
    };
    
    // Save to localStorage
    saveOnboardingProfile(profile);
    
    // Get recommendation
    const recommendation = getRecommendedPath(profile);
    
    set({
      isComplete: true,
      recommendation
    });
  },
  
  reset: () => set(initialState)
}));
