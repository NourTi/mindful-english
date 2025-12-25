import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { breathingExercise } from '@/lib/psycholinguistics';

interface BreathingExerciseProps {
  onComplete: () => void;
}

type BreathingPhase = 'intro' | 'inhale' | 'hold' | 'exhale' | 'outro';

const phaseConfig: Record<BreathingPhase, { duration: number; scale: number; color: string }> = {
  intro: { duration: 2000, scale: 1, color: 'from-primary to-primary-glow' },
  inhale: { duration: 4000, scale: 1.5, color: 'from-success to-success/80' },
  hold: { duration: 2000, scale: 1.5, color: 'from-accent to-accent/80' },
  exhale: { duration: 6000, scale: 1, color: 'from-secondary to-secondary/80' },
  outro: { duration: 2000, scale: 1, color: 'from-primary to-primary-glow' },
};

const BreathingExercise = ({ onComplete }: BreathingExerciseProps) => {
  const [phase, setPhase] = useState<BreathingPhase>('intro');
  const [cycleCount, setCycleCount] = useState(0);
  const totalCycles = 2;

  useEffect(() => {
    const sequence: BreathingPhase[] = ['intro', 'inhale', 'hold', 'exhale'];
    let currentIndex = 0;
    let cycles = 0;

    const runPhase = () => {
      const currentPhase = sequence[currentIndex];
      setPhase(currentPhase);

      const timer = setTimeout(() => {
        currentIndex++;
        
        if (currentIndex >= sequence.length) {
          cycles++;
          setCycleCount(cycles);
          
          if (cycles >= totalCycles) {
            setPhase('outro');
            setTimeout(() => {
              onComplete();
            }, phaseConfig.outro.duration);
            return;
          }
          
          currentIndex = 1; // Skip intro on subsequent cycles
        }
        
        runPhase();
      }, phaseConfig[currentPhase].duration);

      return () => clearTimeout(timer);
    };

    const cleanup = runPhase();
    return cleanup;
  }, [onComplete]);

  const config = phaseConfig[phase];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center"
    >
      <div className="text-center px-6 max-w-md">
        {/* Animated Circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.color} opacity-20`}
            animate={{
              scale: config.scale * 1.2,
            }}
            transition={{
              duration: config.duration / 1000,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className={`absolute inset-4 rounded-full bg-gradient-to-br ${config.color} opacity-40`}
            animate={{
              scale: config.scale,
            }}
            transition={{
              duration: config.duration / 1000,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className={`absolute inset-8 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center`}
            animate={{
              scale: config.scale * 0.8,
            }}
            transition={{
              duration: config.duration / 1000,
              ease: 'easeInOut',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {phase === 'intro' || phase === 'outro' ? (
                  <Heart className="w-12 h-12 text-white" />
                ) : (
                  <Wind className="w-12 h-12 text-white" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Instructions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-display font-bold text-foreground">
              {phase === 'intro' && 'Let\'s take a moment'}
              {phase === 'inhale' && 'Breathe In'}
              {phase === 'hold' && 'Hold'}
              {phase === 'exhale' && 'Breathe Out'}
              {phase === 'outro' && 'Well done!'}
            </h2>
            <p className="text-muted-foreground">
              {breathingExercise[phase]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Cycle Progress */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalCycles }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < cycleCount ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Skip Button */}
        <Button
          variant="ghost"
          className="mt-8 text-muted-foreground"
          onClick={onComplete}
        >
          Skip
        </Button>
      </div>
    </motion.div>
  );
};

export default BreathingExercise;
