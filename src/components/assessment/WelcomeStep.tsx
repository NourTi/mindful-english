import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Sparkles, BookOpen, ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/stores/assessmentStore';

const WelcomeStep = () => {
  const navigate = useNavigate();
  const { setStep, setUserName, userName } = useAssessmentStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
    >
      {/* Floating icons */}
      <div className="relative w-full max-w-md h-32 mb-8">
        <motion.div
          className="absolute left-1/4 top-0"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="p-4 rounded-2xl bg-cognitive-visual/10 text-cognitive-visual">
            <Brain className="w-8 h-8" />
          </div>
        </motion.div>
        <motion.div
          className="absolute right-1/4 top-4"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="p-4 rounded-2xl bg-cognitive-auditory/10 text-cognitive-auditory">
            <Heart className="w-8 h-8" />
          </div>
        </motion.div>
        <motion.div
          className="absolute left-1/3 bottom-0"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="p-4 rounded-2xl bg-cognitive-reading/10 text-cognitive-reading">
            <BookOpen className="w-8 h-8" />
          </div>
        </motion.div>
        <motion.div
          className="absolute right-1/3 bottom-4"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        >
          <div className="p-4 rounded-2xl bg-cognitive-kinesthetic/10 text-cognitive-kinesthetic">
            <Sparkles className="w-8 h-8" />
          </div>
        </motion.div>
      </div>

      <motion.h1 
        className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to <span className="gradient-text">SEE</span>
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Students for Education Empowerment — Your personalized journey to English fluency starts here.
      </motion.p>

      <motion.div
        className="w-full max-w-sm space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
            What should we call you?
          </label>
          <input
            id="name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={() => setStep('learning-style')}
          disabled={!userName.trim()}
        >
          Begin Your Journey
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>

        {/* Skip to Dashboard - Direct immersion */}
        <Button
          variant="outline"
          size="lg"
          className="w-full group"
          onClick={() => {
            if (userName.trim()) {
              // Save the name and skip to dashboard
              navigate('/dashboard');
            }
          }}
          disabled={!userName.trim()}
        >
          <Rocket className="w-4 h-4 mr-2 group-hover:animate-bounce" />
          Skip to Learning
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>

      <motion.p
        className="mt-8 text-sm text-muted-foreground max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Take the assessment to personalize your experience, or skip ahead and start learning immediately. 
        You can complete your profile anytime from the Dashboard.
      </motion.p>
    </motion.div>
  );
};

export default WelcomeStep;
