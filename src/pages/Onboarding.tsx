import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import RecommendationCard from '@/components/onboarding/RecommendationCard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { getSections, getAxisById, getScreenerById, hasLearnerProfile, getFirstLessonFromPath } from '@/lib/onboardingEngine';
import type { DiagnosticSection, DiagnosticAxis, DiagnosticScreener } from '@/types/onboarding';

const Onboarding = () => {
  const navigate = useNavigate();
  const {
    currentSectionIndex,
    answers,
    screenerAnswers,
    recommendation,
    learnerProfile,
    isComplete,
    setAnswer,
    setScreenerAnswer,
    nextSection,
    prevSection,
    completeOnboarding,
    reset
  } = useOnboardingStore();

  const sections = getSections();
  const sectionTitles = sections.map(s => s.title);
  const currentSection: DiagnosticSection | undefined = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  // Redirect if already completed
  useEffect(() => {
    if (hasLearnerProfile() && !isComplete) {
      navigate('/dashboard');
    }
  }, [navigate, isComplete]);

  // Initialize scale defaults
  useEffect(() => {
    if (!currentSection) return;
    currentSection.axisIds.forEach(axisId => {
      const axis = getAxisById(axisId);
      if (axis?.scale && answers[axisId] === undefined) {
        setAnswer(axisId, 3);
      }
    });
  }, [currentSection, answers, setAnswer]);

  const isSectionComplete = useMemo(() => {
    if (!currentSection) return false;
    return currentSection.axisIds.every(axisId => {
      const axis = getAxisById(axisId);
      if (!axis) return true;
      const val = answers[axisId];
      return val !== undefined && val !== '';
    });
  }, [currentSection, answers]);

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
        navigate('/dashboard');
      }
    }
  };

  if (!sections.length) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Diagnostic data is not available. Please check your configuration.</p>
            <Button className="mt-4" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Summary screen
  if (isComplete && recommendation && learnerProfile) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <header className="relative z-10 py-6 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-lg">S</div>
              <span className="font-display text-xl font-semibold text-foreground">SEE</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => reset()}>Retake Assessment</Button>
          </div>
        </header>

        <main className="relative z-10 px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Assessment Complete!</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">Your Learning Profile</h1>
            </motion.div>

            {/* Detected Labels */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-display font-bold text-foreground mb-3">We detected:</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {learnerProfile.labels.length > 0 ? learnerProfile.labels.map(label => (
                      <span key={label} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {label.replace(/_/g, ' ')}
                      </span>
                    )) : (
                      <span className="text-muted-foreground text-sm">No specific labels detected — using default profile.</span>
                    )}
                  </div>

                  {/* Axis Breakdown */}
                  <div className="space-y-3 mt-4">
                    <AxisBar label="Speaking" value={learnerProfile.speakingLevel} max={5} />
                    <AxisBar label="Listening" value={learnerProfile.listeningLevel} max={5} />
                    <AxisBar label="Social Anxiety" value={learnerProfile.socialAnxiety} max={5} />
                    <AxisBar label="Self-Efficacy" value={learnerProfile.selfEfficacy} max={5} />
                    <AxisBar label="Collocations" value={learnerProfile.collocationAwareness} max={5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <RecommendationCard recommendation={recommendation} onStartPath={handleStartPath} />

            {recommendation.secondaryPathLabel && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <p className="text-center text-sm text-muted-foreground">
                  Secondary recommendation: <span className="font-medium text-foreground">{recommendation.secondaryPathLabel}</span>
                </p>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Multi-step form
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <header className="relative z-10 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-lg">S</div>
            <span className="font-display text-xl font-semibold text-foreground">SEE</span>
          </div>
          <div className="text-sm text-muted-foreground">Step {currentSectionIndex + 1} of {sections.length}</div>
        </div>
      </header>

      <main className="relative z-10 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <OnboardingProgress sections={sectionTitles} currentIndex={currentSectionIndex} />
          </div>

          {currentSectionIndex === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground mb-8">
              Let's create your perfect learning path. Answer a few quick questions.
            </motion.p>
          )}

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-soft">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection?.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-4 sm:mb-6">
                    {currentSection?.title}
                  </h2>

                  <div className="space-y-6 sm:space-y-8">
                    {/* Render axes for this section */}
                    {currentSection?.axisIds.map(axisId => {
                      const axis = getAxisById(axisId);
                      if (!axis) return null;

                      if (axis.scale) {
                        return (
                          <ScaleInput
                            key={axis.id}
                            axis={axis}
                            value={(answers[axis.id] as number) ?? 3}
                            onChange={(v) => setAnswer(axis.id, v)}
                          />
                        );
                      }

                      if (axis.type === 'multiple' && axis.options) {
                        return (
                          <MultipleInput
                            key={axis.id}
                            axis={axis}
                            value={(answers[axis.id] as string) ?? ''}
                            onChange={(v) => setAnswer(axis.id, v)}
                          />
                        );
                      }

                      return null;
                    })}

                    {/* Render screeners for this section */}
                    {currentSection?.screenerIds.map(screenerId => {
                      const screener = getScreenerById(screenerId);
                      if (!screener) return null;
                      return (
                        <ScreenerInput
                          key={screener.id}
                          screener={screener}
                          value={screenerAnswers[screener.id]}
                          onChange={(v) => setScreenerAnswer(screener.id, v)}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50">
                <Button variant="ghost" onClick={prevSection} disabled={currentSectionIndex === 0} className="gap-2 w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button variant="hero" onClick={handleNext} disabled={!isSectionComplete} className="gap-2 w-full sm:w-auto">
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

// Sub-components

function AxisBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function ScaleInput({ axis, value, onChange }: { axis: DiagnosticAxis; value: number; onChange: (v: number) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="space-y-1">
        <Label className="text-lg font-medium text-foreground">{axis.label}</Label>
        <p className="text-sm text-muted-foreground">{axis.description}</p>
      </div>
      <div className="pt-2 pb-2">
        <Slider
          value={[value]}
          onValueChange={(v) => onChange(v[0])}
          min={axis.scale!.min}
          max={axis.scale!.max}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-3 text-sm text-muted-foreground">
          <span>{axis.scale!.min}</span>
          <span className="text-primary font-semibold text-lg">{value}</span>
          <span>{axis.scale!.max}</span>
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground/70">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </motion.div>
  );
}

function MultipleInput({ axis, value, onChange }: { axis: DiagnosticAxis; value: string; onChange: (v: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="space-y-1">
        <Label className="text-lg font-medium text-foreground">{axis.label}</Label>
        <p className="text-sm text-muted-foreground">{axis.description}</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {(axis.options || []).map(option => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              value === option
                ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                value === option ? 'border-primary bg-primary' : 'border-muted-foreground/40'
              }`}>
                {value === option && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
              </div>
              <span className="font-medium">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ScreenerInput({ screener, value, onChange }: { screener: DiagnosticScreener; value: string | number | undefined; onChange: (v: string | number) => void }) {
  if (screener.type === 'emotion_rating' || screener.type === 'self_assessment') {
    const scale = screener.scale;
    if (!scale) return null;
    const currentVal = typeof value === 'number' ? value : 3;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
        <div className="space-y-1">
          <Label className="text-base font-medium text-foreground">{screener.title}</Label>
          <p className="text-sm text-muted-foreground">{screener.instructions}</p>
          {screener.question && <p className="text-sm font-medium text-foreground mt-2">{screener.question}</p>}
        </div>
        <Slider
          value={[currentVal]}
          onValueChange={(v) => onChange(v[0])}
          min={scale.min}
          max={scale.max}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{scale.labels?.[0] || scale.min}</span>
          <span className="text-primary font-semibold">{scale.labels?.[currentVal - 1] || currentVal}</span>
          <span>{scale.labels?.[scale.max - 1] || scale.max}</span>
        </div>
      </motion.div>
    );
  }

  if (screener.type === 'listening_comprehension' && screener.options) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
        <div className="space-y-1">
          <Label className="text-base font-medium text-foreground">{screener.title}</Label>
          <p className="text-sm text-muted-foreground">{screener.instructions}</p>
        </div>
        {screener.stimulus && (
          <div className="p-3 rounded-lg bg-card border border-border italic text-sm text-foreground">
            {screener.stimulus}
          </div>
        )}
        {screener.question && <p className="text-sm font-medium text-foreground">{screener.question}</p>}
        <div className="grid grid-cols-1 gap-2">
          {screener.options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`text-left p-3 rounded-lg border transition-all ${
                value === opt ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (screener.type === 'collocation_test' && screener.pairs) {
    // Simple: just show pairs and let user pick
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
        <div className="space-y-1">
          <Label className="text-base font-medium text-foreground">{screener.title}</Label>
          <p className="text-sm text-muted-foreground">{screener.instructions}</p>
        </div>
        {screener.pairs.map((pair, i) => {
          const pairKey = `${screener.id}_${i}`;
          const selected = typeof value === 'string' ? value : '';
          return (
            <div key={i} className="flex gap-3">
              <button
                onClick={() => onChange(pair.a)}
                className={`flex-1 p-3 rounded-lg border text-sm transition-all ${
                  selected === pair.a ? 'border-primary bg-primary/10 text-foreground font-medium' : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {pair.a}
              </button>
              <button
                onClick={() => onChange(pair.b)}
                className={`flex-1 p-3 rounded-lg border text-sm transition-all ${
                  selected === pair.b ? 'border-primary bg-primary/10 text-foreground font-medium' : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {pair.b}
              </button>
            </div>
          );
        })}
      </motion.div>
    );
  }

  return null;
}

export default Onboarding;
