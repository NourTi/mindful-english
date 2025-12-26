import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wind, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TakeABreathModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint?: string;
  errorCount?: number;
}

export const TakeABreathModal = ({ isOpen, onClose, hint, errorCount = 2 }: TakeABreathModalProps) => {
  const [phase, setPhase] = useState<'breathing' | 'hint'>('breathing');
  const [breathingComplete, setBreathingComplete] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isOpen) {
      setPhase('breathing');
      setBreathingComplete(false);
      setBreathCount(0);
      return;
    }

    // Breathing cycle: 4s inhale, 4s hold, 4s exhale
    const cycle = () => {
      setBreathPhase('inhale');
      setTimeout(() => setBreathPhase('hold'), 4000);
      setTimeout(() => setBreathPhase('exhale'), 8000);
    };

    cycle();
    const interval = setInterval(() => {
      setBreathCount(prev => {
        if (prev >= 2) {
          setBreathingComplete(true);
          clearInterval(interval);
          return prev;
        }
        cycle();
        return prev + 1;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const breathText = {
    inhale: 'Breathe In...',
    hold: 'Hold...',
    exhale: 'Breathe Out...',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md"
          >
            <Card className="border-primary/20 shadow-glow overflow-hidden">
              <CardContent className="p-8">
                {phase === 'breathing' ? (
                  <div className="text-center">
                    {/* Header */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="mb-6"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">Take a Breath</span>
                      </div>
                      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                        It's okay to slow down
                      </h2>
                      <p className="text-muted-foreground">
                        Making mistakes is part of learning. Let's take a moment to relax.
                      </p>
                    </motion.div>

                    {/* Breathing Animation */}
                    <div className="relative h-48 flex items-center justify-center mb-6">
                      <motion.div
                        className="absolute w-32 h-32 rounded-full bg-primary/20"
                        animate={{
                          scale: breathPhase === 'inhale' ? 1.5 : breathPhase === 'hold' ? 1.5 : 1,
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute w-24 h-24 rounded-full bg-primary/40"
                        animate={{
                          scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 1,
                        }}
                        transition={{ duration: 4, ease: "easeInOut", delay: 0.1 }}
                      />
                      <motion.div
                        className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center"
                        animate={{
                          scale: breathPhase === 'inhale' ? 1.3 : breathPhase === 'hold' ? 1.3 : 1,
                        }}
                        transition={{ duration: 4, ease: "easeInOut", delay: 0.2 }}
                      >
                        <Wind className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                    </div>

                    {/* Breath Phase Text */}
                    <motion.p
                      key={breathPhase}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xl font-display font-semibold text-primary mb-6"
                    >
                      {breathText[breathPhase]}
                    </motion.p>

                    {/* Progress or Skip */}
                    {breathingComplete ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Button
                          onClick={() => hint ? setPhase('hint') : onClose()}
                          className="gap-2"
                        >
                          {hint ? "Show me a hint" : "Continue Learning"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i <= breathCount ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    {/* Hint Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-sm font-medium">Helpful Hint</span>
                      </div>
                      
                      <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                        Here's a little help
                      </h2>
                      
                      <div className="bg-muted/50 rounded-xl p-4 mb-6">
                        <p className="text-foreground leading-relaxed">
                          {hint || "Remember to focus on the key vocabulary words we learned earlier. Take your time to sound out each word."}
                        </p>
                      </div>

                      <Button onClick={onClose} className="gap-2">
                        Try Again
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TakeABreathModal;