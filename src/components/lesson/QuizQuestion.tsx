import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AssessmentQuestion } from '@/types/learning';
import { useLessonStore } from '@/stores/lessonStore';

interface QuizQuestionProps {
  questions: AssessmentQuestion[];
  currentIndex: number;
  onNext: () => void;
  onComplete: () => void;
}

const QuizQuestion = ({ questions, currentIndex, onNext, onComplete }: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { recordAnswer } = useLessonStore();

  const question = questions[currentIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
    setHasAnswered(true);
    recordAnswer(index === question.correctAnswer);
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">+5 XP per correct answer</span>
            </div>
          </div>
          <Progress 
            value={((currentIndex + 1) / questions.length) * 100} 
            size="sm" 
            indicatorVariant="cognitive"
          />
        </div>
      </header>

      {/* Question Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-display font-bold text-center mb-8">
              {question.question}
            </h2>

            <div className="grid gap-3">
              {question.options.map((option, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrectOption = i === question.correctAnswer;
                
                let variant = 'outline';
                let extraClasses = 'hover:bg-muted';
                
                if (hasAnswered) {
                  if (isCorrectOption) {
                    variant = 'default';
                    extraClasses = 'bg-success border-success text-white hover:bg-success';
                  } else if (isSelected) {
                    variant = 'default';
                    extraClasses = 'bg-destructive border-destructive text-white hover:bg-destructive';
                  } else {
                    extraClasses = 'opacity-50';
                  }
                } else if (isSelected) {
                  extraClasses = 'border-primary bg-primary/10';
                }

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${extraClasses}`}
                      onClick={() => handleAnswer(i)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            hasAnswered && isCorrectOption
                              ? 'bg-white/20 text-white'
                              : hasAnswered && isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                        {hasAnswered && (
                          <AnimatePresence>
                            {isCorrectOption && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check className="w-5 h-5" />
                              </motion.div>
                            )}
                            {isSelected && !isCorrectOption && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <X className="w-5 h-5" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Feedback */}
          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card className={`p-4 ${isCorrect ? 'bg-success/10 border-success/30' : 'bg-secondary'}`}>
                  <div className="space-y-2">
                    <p className={`font-semibold ${isCorrect ? 'text-success' : 'text-foreground'}`}>
                      {isCorrect 
                        ? question.growthMindsetFeedback.correct 
                        : question.growthMindsetFeedback.incorrect}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleContinue}
                >
                  {isLastQuestion ? 'See Results' : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                {isLastQuestion && (
                  <p className="text-xs text-center text-muted-foreground">
                    You'll see your score summary next
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </motion.div>
  );
};

export default QuizQuestion;
