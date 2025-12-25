import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Headphones, BookOpen, Hand, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { LearningStyle } from '@/types/learning';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    style: LearningStyle;
    icon: React.ReactNode;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "When learning a new word, what helps you remember it best?",
    options: [
      { text: "Seeing a picture or image of it", style: 'visual', icon: <Eye className="w-5 h-5" /> },
      { text: "Hearing it pronounced aloud", style: 'auditory', icon: <Headphones className="w-5 h-5" /> },
      { text: "Reading its definition multiple times", style: 'reading', icon: <BookOpen className="w-5 h-5" /> },
      { text: "Using it in a conversation or activity", style: 'kinesthetic', icon: <Hand className="w-5 h-5" /> },
    ],
  },
  {
    id: 2,
    question: "How do you prefer to follow directions to a new place?",
    options: [
      { text: "Looking at a map or GPS visuals", style: 'visual', icon: <Eye className="w-5 h-5" /> },
      { text: "Listening to spoken directions", style: 'auditory', icon: <Headphones className="w-5 h-5" /> },
      { text: "Reading written instructions", style: 'reading', icon: <BookOpen className="w-5 h-5" /> },
      { text: "Walking the route once to remember it", style: 'kinesthetic', icon: <Hand className="w-5 h-5" /> },
    ],
  },
  {
    id: 3,
    question: "When studying for an exam, you typically:",
    options: [
      { text: "Create diagrams, charts, or mind maps", style: 'visual', icon: <Eye className="w-5 h-5" /> },
      { text: "Record yourself or listen to explanations", style: 'auditory', icon: <Headphones className="w-5 h-5" /> },
      { text: "Read and re-read notes or textbooks", style: 'reading', icon: <BookOpen className="w-5 h-5" /> },
      { text: "Practice problems or do hands-on activities", style: 'kinesthetic', icon: <Hand className="w-5 h-5" /> },
    ],
  },
  {
    id: 4,
    question: "In a meeting or class, you understand best when:",
    options: [
      { text: "There are slides, videos, or visual aids", style: 'visual', icon: <Eye className="w-5 h-5" /> },
      { text: "Someone explains things verbally", style: 'auditory', icon: <Headphones className="w-5 h-5" /> },
      { text: "You have handouts or notes to review", style: 'reading', icon: <BookOpen className="w-5 h-5" /> },
      { text: "There are group activities or demonstrations", style: 'kinesthetic', icon: <Hand className="w-5 h-5" /> },
    ],
  },
  {
    id: 5,
    question: "When assembling something new, you prefer to:",
    options: [
      { text: "Look at the diagrams and pictures", style: 'visual', icon: <Eye className="w-5 h-5" /> },
      { text: "Have someone explain the steps to you", style: 'auditory', icon: <Headphones className="w-5 h-5" /> },
      { text: "Read the instruction manual carefully", style: 'reading', icon: <BookOpen className="w-5 h-5" /> },
      { text: "Just start putting it together", style: 'kinesthetic', icon: <Hand className="w-5 h-5" /> },
    ],
  },
  {
    id: 6,
    question: "When remembering a phone number, you:",
    options: [
      { text: "Visualize the numbers in your mind", style: 'visual', icon: <Eye className="w-5 h-5" /> },
      { text: "Say it out loud a few times", style: 'auditory', icon: <Headphones className="w-5 h-5" /> },
      { text: "Write it down to remember it", style: 'reading', icon: <BookOpen className="w-5 h-5" /> },
      { text: "Dial it several times to remember the pattern", style: 'kinesthetic', icon: <Hand className="w-5 h-5" /> },
    ],
  },
];

const styleColors: Record<LearningStyle, string> = {
  visual: 'border-cognitive-visual hover:bg-cognitive-visual/10',
  auditory: 'border-cognitive-auditory hover:bg-cognitive-auditory/10',
  reading: 'border-cognitive-reading hover:bg-cognitive-reading/10',
  kinesthetic: 'border-cognitive-kinesthetic hover:bg-cognitive-kinesthetic/10',
};

const LearningStyleStep = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { addLearningStyleAnswer, setStep, learningStyleAnswers } = useAssessmentStore();

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedOption !== null) {
      addLearningStyleAnswer(selectedOption);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setStep('anxiety');
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(learningStyleAnswers[currentQuestion - 1] ?? null);
    } else {
      setStep('welcome');
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
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-primary">
            Cognitive Style Assessment
          </span>
        </div>
        <Progress value={progress} size="sm" indicatorVariant="cognitive" className="mb-2" />
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
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
            {question.question}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant="cognitive"
                  className={`cursor-pointer transition-all duration-300 ${
                    styleColors[option.style]
                  } ${
                    selectedOption === index 
                      ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
                      : ''
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`p-3 rounded-xl ${
                      selectedOption === index 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    } transition-colors`}>
                      {option.icon}
                    </div>
                    <span className="text-base md:text-lg font-medium">
                      {option.text}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
          disabled={selectedOption === null}
        >
          {currentQuestion < questions.length - 1 ? 'Next' : 'Continue'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningStyleStep;
