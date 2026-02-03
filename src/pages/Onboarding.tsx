import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import ScaleQuestionInput from '@/components/onboarding/ScaleQuestionInput';
import MultipleQuestionInput from '@/components/onboarding/MultipleQuestionInput';
import RecommendationCard from '@/components/onboarding/RecommendationCard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { getFirstLessonFromPath, isOnboardingComplete } from '@/lib/onboardingEngine';
import { AssessmentSection, AssessmentQuestion, ScaleQuestion, MultipleQuestion } from '@/types/onboarding';
import system from '../../data/see_learning_system.json';

interface SystemData {
  assessment: {
    welcome: string;
    sections: AssessmentSection[];
  };
}

const typedSystem = system as unknown as SystemData;

const Onboarding = () => {
  const navigate = useNavigate();
  const { 
    currentSectionIndex, 
    answers, 
    recommendation,
    isComplete,
    setAnswer, 
    nextSection, 
    prevSection,
    completeOnboarding,
    reset
  } = useOnboardingStore();
  
  const sections = typedSystem.assessment.sections;
  const sectionTitles = sections.map(s => s.title);
  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;
  
  // Check if current section is complete
  const isSectionComplete = useMemo(() => {
    if (!currentSection) return false;
    return currentSection.questions.every((q: AssessmentQuestion) => {
      const answer = answers[q.id as keyof typeof answers];
      return answer !== undefined && answer !== '';
    });
  }, [currentSection, answers]);
  
  // Redirect if already completed onboarding
  useEffect(() => {
    if (isOnboardingComplete() && !isComplete) {
      navigate('/dashboard');
    }
  }, [navigate, isComplete]);
  
  // Initialize default values for scale questions
  useEffect(() => {
    currentSection?.questions.forEach((q: AssessmentQuestion) => {
      if (q.type === 'scale' && answers[q.id as keyof typeof answers] === undefined) {
        setAnswer(q.id, 3);
      }
    });
  }, [currentSection, answers, setAnswer]);
  
  const handleNext = () => {
    if (isLastSection) {
      completeOnboarding();
    } else {
      nextSection();
    }
  };
  
  const handleStartPath = () => {
    if (recommendation) {
      const firstLesson = getFirstLessonFromPath(recommendation.pathId);
      if (firstLesson) {
        navigate(`/chat/${firstLesson}`);
      } else {
        // Fallback to paths page if no lesson found
        navigate('/paths');
      }
    }
  };
  
  const handleRestart = () => {
    reset();
  };
  
  // Show recommendation screen when complete
  if (isComplete && recommendation) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <header className="relative z-10 py-6 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-lg">
                S
              </div>
              <span className="font-display text-xl font-semibold text-foreground">SEE</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleRestart}>
              Retake Assessment
            </Button>
          </div>
        </header>
        
        <main className="relative z-10 px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Assessment Complete!</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                Your Learning Journey Awaits
              </h1>
            </motion.div>
            
            <RecommendationCard 
              recommendation={recommendation} 
              onStartPath={handleStartPath} 
            />
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-lg">
              S
            </div>
            <span className="font-display text-xl font-semibold text-foreground">SEE</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Step {currentSectionIndex + 1} of {sections.length}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <OnboardingProgress 
              sections={sectionTitles} 
              currentIndex={currentSectionIndex} 
            />
          </div>
          
          {/* Welcome Message (first section only) */}
          {currentSectionIndex === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground mb-8"
            >
              {typedSystem.assessment.welcome}
            </motion.p>
          )}
          
          {/* Section Card */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-soft">
            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection?.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Section Title */}
                  <h2 className="text-xl font-display font-bold text-foreground mb-6">
                    {currentSection?.title}
                  </h2>
                  
                  {/* Questions */}
                  <div className="space-y-8">
                    {currentSection?.questions.map((question: AssessmentQuestion) => (
                      <div key={question.id}>
                        {question.type === 'scale' ? (
                          <ScaleQuestionInput
                            question={question as ScaleQuestion}
                            value={(answers[question.id as keyof typeof answers] as number) ?? 3}
                            onChange={(value) => setAnswer(question.id, value)}
                          />
                        ) : (
                          <MultipleQuestionInput
                            question={question as MultipleQuestion}
                            value={(answers[question.id as keyof typeof answers] as string) ?? ''}
                            onChange={(value) => setAnswer(question.id, value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/50">
                <Button
                  variant="ghost"
                  onClick={prevSection}
                  disabled={currentSectionIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                
                <Button
                  variant="hero"
                  onClick={handleNext}
                  disabled={!isSectionComplete}
                  className="gap-2"
                >
                  {isLastSection ? 'See My Results' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
