import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProcessingSpeedTestProps {
  onComplete: (score: number, averageTime: number) => void;
}

// Image-word pairs for the test
const testItems = [
  { image: '🍎', word: 'Apple', correct: true },
  { image: '🚗', word: 'Bicycle', correct: false },
  { image: '☀️', word: 'Sun', correct: true },
  { image: '🌙', word: 'Star', correct: false },
  { image: '🐕', word: 'Dog', correct: true },
  { image: '🏠', word: 'Building', correct: false },
  { image: '📚', word: 'Books', correct: true },
  { image: '✈️', word: 'Plane', correct: true },
  { image: '🎸', word: 'Piano', correct: false },
  { image: '🌳', word: 'Tree', correct: true },
];

export const ProcessingSpeedTest = ({ onComplete }: ProcessingSpeedTestProps) => {
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'test' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [responses, setResponses] = useState<{ correct: boolean; time: number }[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentItem = testItems[currentIndex];
  const progress = (currentIndex / testItems.length) * 100;

  // Countdown effect
  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'countdown' && countdown === 0) {
      setPhase('test');
      setStartTime(Date.now());
    }
  }, [phase, countdown]);

  const handleResponse = useCallback((userSaysMatch: boolean) => {
    const responseTime = Date.now() - startTime;
    const isCorrect = userSaysMatch === currentItem.correct;
    
    setResponses(prev => [...prev, { correct: isCorrect, time: responseTime }]);
    setShowFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex < testItems.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setStartTime(Date.now());
      } else {
        setPhase('result');
      }
    }, 500);
  }, [currentIndex, currentItem, startTime]);

  // Calculate results
  const calculateResults = () => {
    const correctCount = responses.filter(r => r.correct).length;
    const score = Math.round((correctCount / testItems.length) * 100);
    const avgTime = responses.reduce((sum, r) => sum + r.time, 0) / responses.length;
    return { score, avgTime, correctCount };
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== 'test') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        handleResponse(false);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        handleResponse(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, handleResponse]);

  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Timer className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-4">Processing Speed Test</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You'll see an image and a word. Quickly decide if they match!
          This helps us understand how fast you process information.
        </p>
        
        <div className="bg-muted/50 rounded-xl p-4 mb-6 max-w-sm mx-auto">
          <p className="text-sm font-medium mb-2">How it works:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Press <kbd className="px-2 py-0.5 bg-background rounded text-xs">→</kbd> or <kbd className="px-2 py-0.5 bg-background rounded text-xs">D</kbd> if they MATCH</li>
            <li>• Press <kbd className="px-2 py-0.5 bg-background rounded text-xs">←</kbd> or <kbd className="px-2 py-0.5 bg-background rounded text-xs">A</kbd> if they DON'T</li>
          </ul>
        </div>

        <Button onClick={() => { setPhase('countdown'); }} size="lg">
          Start Test
        </Button>
      </motion.div>
    );
  }

  if (phase === 'countdown') {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-muted-foreground mb-4">Get ready...</p>
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-8xl font-display font-bold text-primary"
        >
          {countdown || 'Go!'}
        </motion.div>
      </motion.div>
    );
  }

  if (phase === 'test') {
    return (
      <div className="relative">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{currentIndex + 1} of {testItems.length}</span>
            <span className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              React quickly!
            </span>
          </div>
          <Progress value={progress} size="sm" />
        </div>

        {/* Test Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`relative overflow-hidden border-2 transition-colors ${
              showFeedback === 'correct' ? 'border-success bg-success/5' :
              showFeedback === 'wrong' ? 'border-destructive bg-destructive/5' :
              'border-border'
            }`}>
              <CardContent className="p-8">
                {/* Feedback overlay */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-background/80 z-10"
                    >
                      {showFeedback === 'correct' ? (
                        <CheckCircle className="w-16 h-16 text-success" />
                      ) : (
                        <XCircle className="w-16 h-16 text-destructive" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center">
                  {/* Image */}
                  <div className="text-8xl mb-6">{currentItem.image}</div>
                  
                  {/* Word */}
                  <div className="text-3xl font-display font-bold mb-8">
                    {currentItem.word}
                  </div>

                  {/* Response Buttons */}
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleResponse(false)}
                      className="flex-1 max-w-40 border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      No Match
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleResponse(true)}
                      className="flex-1 max-w-40 bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Match!
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Result phase
  const results = calculateResults();
  
  useEffect(() => {
    if (phase === 'result') {
      onComplete(results.score, results.avgTime);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6"
      >
        <CheckCircle className="w-10 h-10 text-success" />
      </motion.div>
      
      <h2 className="text-2xl font-display font-bold mb-2">Test Complete!</h2>
      <p className="text-muted-foreground mb-6">Here's how you performed</p>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
          <p className="text-3xl font-display font-bold text-primary">{results.score}%</p>
          <p className="text-xs text-muted-foreground">{results.correctCount}/{testItems.length} correct</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg. Speed</p>
          <p className="text-3xl font-display font-bold text-accent">{Math.round(results.avgTime)}ms</p>
          <p className="text-xs text-muted-foreground">per response</p>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProcessingSpeedTest;