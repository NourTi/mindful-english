import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Check, X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';

interface VocabQuestion {
  id: number;
  word: string;
  context: string;
  options: string[];
  correctIndex: number;
  difficulty: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced';
}

const vocabQuestions: VocabQuestion[] = [
  {
    id: 1,
    word: "Happy",
    context: "She felt very _____ when she got the good news.",
    options: ["Sad", "Happy", "Angry", "Tired"],
    correctIndex: 1,
    difficulty: 'beginner',
  },
  {
    id: 2,
    word: "Delicious",
    context: "The food at the restaurant was absolutely _____.",
    options: ["Terrible", "Delicious", "Boring", "Fast"],
    correctIndex: 1,
    difficulty: 'elementary',
  },
  {
    id: 3,
    word: "Accomplish",
    context: "She worked hard to _____ her goals.",
    options: ["Avoid", "Forget", "Accomplish", "Ignore"],
    correctIndex: 2,
    difficulty: 'intermediate',
  },
  {
    id: 4,
    word: "Resilience",
    context: "Her _____ helped her overcome many challenges in life.",
    options: ["Weakness", "Resilience", "Confusion", "Anger"],
    correctIndex: 1,
    difficulty: 'upper-intermediate',
  },
  {
    id: 5,
    word: "Ephemeral",
    context: "The beauty of cherry blossoms is _____; they only last a few days.",
    options: ["Permanent", "Ephemeral", "Invisible", "Heavy"],
    correctIndex: 1,
    difficulty: 'advanced',
  },
  {
    id: 6,
    word: "Ubiquitous",
    context: "Smartphones have become _____ in modern society.",
    options: ["Rare", "Ubiquitous", "Ancient", "Mysterious"],
    correctIndex: 1,
    difficulty: 'advanced',
  },
];

const VocabularyStep = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { addVocabularyAnswer, setStep, vocabularyAnswers } = useAssessmentStore();

  const question = vocabQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / vocabQuestions.length) * 100;
  const isCorrect = selectedOption === question.correctIndex;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    addVocabularyAnswer(index === question.correctIndex);
  };

  const handleNext = () => {
    if (currentQuestion < vocabQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setStep('complete');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setStep('anxiety');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Vocabulary Check
            </span>
          </div>
          <span className="text-sm font-medium text-primary capitalize">
            {question.difficulty}
          </span>
        </div>
        <Progress value={progress} size="sm" indicatorVariant="cognitive" className="mb-2" />
        <p className="text-xs text-muted-foreground text-center">
          Question {currentQuestion + 1} of {vocabQuestions.length}
        </p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass" className="mb-6">
            <CardContent className="p-6">
              <p className="text-lg md:text-xl text-center font-medium">
                {question.context.split('_____').map((part, index, arr) => (
                  <span key={index}>
                    {part}
                    {index < arr.length - 1 && (
                      <span className="px-3 py-1 mx-1 rounded-lg bg-primary/10 text-primary font-bold">
                        ?
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption = index === question.correctIndex;
              
              let borderColor = 'border-border';
              let bgColor = '';
              
              if (showFeedback) {
                if (isCorrectOption) {
                  borderColor = 'border-success';
                  bgColor = 'bg-success/10';
                } else if (isSelected && !isCorrectOption) {
                  borderColor = 'border-destructive';
                  bgColor = 'bg-destructive/10';
                }
              } else if (isSelected) {
                borderColor = 'border-primary';
                bgColor = 'bg-primary/5';
              }

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    variant="cognitive"
                    className={`cursor-pointer transition-all duration-300 ${borderColor} ${bgColor} ${
                      showFeedback ? 'pointer-events-none' : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleSelect(index)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="font-medium">{option}</span>
                      {showFeedback && isCorrectOption && (
                        <Check className="w-5 h-5 text-success" />
                      )}
                      {showFeedback && isSelected && !isCorrectOption && (
                        <X className="w-5 h-5 text-destructive" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-6 p-4 rounded-xl ${
                  isCorrect 
                    ? 'bg-success/10 border border-success/30' 
                    : 'bg-secondary border border-secondary-foreground/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <Sparkles className="w-5 h-5 text-success mt-0.5" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                      <span className="text-xs">💡</span>
                    </div>
                  )}
                  <div>
                    <p className={`font-medium ${isCorrect ? 'text-success' : 'text-foreground'}`}>
                      {isCorrect 
                        ? "Excellent! You got it right!" 
                        : "Not yet — but you're learning!"
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isCorrect 
                        ? `"${question.word}" is exactly the right fit here.`
                        : `The answer is "${question.options[question.correctIndex]}". This word means something that fits naturally in this context.`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="hero"
          onClick={handleNext}
          disabled={!showFeedback}
        >
          {currentQuestion < vocabQuestions.length - 1 ? 'Next' : 'See Results'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default VocabularyStep;
