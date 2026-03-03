import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Brain, MessageCircle, RefreshCcw, ChevronRight, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { loadSeeChallenges } from '@/lib/seeData';
import type { SeeChallenge, SeeChallengeStep } from '@/lib/seeData';

const stepIcons: Record<string, React.ReactNode> = {
  psyground: <Brain className="w-5 h-5" />,
  dialogue: <MessageCircle className="w-5 h-5" />,
  reflection: <RefreshCcw className="w-5 h-5" />,
};

const stepLabels: Record<string, string> = {
  psyground: 'Grounding',
  dialogue: 'Dialogue',
  reflection: 'Reflection',
};

export default function Challenge() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = useMemo(() => {
    const all = loadSeeChallenges();
    return all.find(c => c.id === challengeId) || null;
  }, [challengeId]);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Challenge not found</h2>
          <p className="text-muted-foreground mb-4">The challenge "{challengeId}" doesn't exist.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const step = challenge.steps[currentStep];
  const progress = completed ? 100 : ((currentStep) / challenge.steps.length) * 100;

  const handleNext = () => {
    if (currentStep < challenge.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold truncate">{challenge.label}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs capitalize">{challenge.difficulty}</Badge>
              <span className="text-xs text-muted-foreground">
                Step {Math.min(currentStep + 1, challenge.steps.length)} of {challenge.steps.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">+{challenge.xpReward} XP</span>
          </div>
        </div>
        <Progress value={progress} className="h-1" />
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Challenge Complete! 🎉</h2>
              <p className="text-muted-foreground mb-2">{challenge.label}</p>
              <div className="flex items-center justify-center gap-1 text-accent mb-8">
                <Zap className="w-5 h-5" />
                <span className="text-lg font-semibold">+{challenge.xpReward} XP earned</span>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate(-1)}>Back to Challenges</Button>
                <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {stepIcons[step.kind] || <Brain className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{stepLabels[step.kind] || step.kind}</h3>
                      <p className="text-xs text-muted-foreground">Step {currentStep + 1}</p>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed text-lg">{step.text}</p>
                </CardContent>
              </Card>

              {/* Step navigation dots */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {challenge.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === currentStep ? 'bg-primary' : i < currentStep ? 'bg-primary/40' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button className="w-full" size="lg" onClick={handleNext}>
                {currentStep < challenge.steps.length - 1 ? (
                  <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
                ) : (
                  <>Complete Challenge <CheckCircle className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
