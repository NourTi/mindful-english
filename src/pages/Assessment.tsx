import { AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '@/stores/assessmentStore';
import WelcomeStep from '@/components/assessment/WelcomeStep';
import LearningStyleStep from '@/components/assessment/LearningStyleStep';
import AnxietyStep from '@/components/assessment/AnxietyStep';
import VocabularyStep from '@/components/assessment/VocabularyStep';
import CompleteStep from '@/components/assessment/CompleteStep';

const Assessment = () => {
  const { currentStep } = useAssessmentStore();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-lg">
              S
            </div>
            <span className="font-display text-xl font-semibold text-foreground">SEE</span>
          </div>
          
          {currentStep !== 'welcome' && currentStep !== 'complete' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Cognitive Assessment</span>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && <WelcomeStep key="welcome" />}
          {currentStep === 'learning-style' && <LearningStyleStep key="learning-style" />}
          {currentStep === 'anxiety' && <AnxietyStep key="anxiety" />}
          {currentStep === 'vocabulary' && <VocabularyStep key="vocabulary" />}
          {currentStep === 'complete' && <CompleteStep key="complete" />}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Assessment;
