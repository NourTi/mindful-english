import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, Headphones, BookOpen, Hand, Sparkles, Rocket, Brain, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { LearningStyle } from '@/types/learning';

const styleInfo: Record<LearningStyle, { icon: React.ReactNode; label: string; description: string; color: string }> = {
  visual: {
    icon: <Eye className="w-6 h-6" />,
    label: 'Visual Learner',
    description: 'You learn best through images, diagrams, and visual representations.',
    color: 'bg-cognitive-visual text-white',
  },
  auditory: {
    icon: <Headphones className="w-6 h-6" />,
    label: 'Auditory Learner',
    description: 'You learn best through listening, discussions, and verbal explanations.',
    color: 'bg-cognitive-auditory text-white',
  },
  reading: {
    icon: <BookOpen className="w-6 h-6" />,
    label: 'Reading/Writing Learner',
    description: 'You learn best through reading texts and writing notes.',
    color: 'bg-cognitive-reading text-white',
  },
  kinesthetic: {
    icon: <Hand className="w-6 h-6" />,
    label: 'Kinesthetic Learner',
    description: 'You learn best through hands-on activities and practice.',
    color: 'bg-cognitive-kinesthetic text-white',
  },
};

const CompleteStep = () => {
  const navigate = useNavigate();
  const { calculateProfile, userName, reset } = useAssessmentStore();
  const [profile, setProfile] = useState(calculateProfile());
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setProfile(calculateProfile());
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [calculateProfile]);

  const primaryStyle = styleInfo[profile.learningStyle];
  const sortedStyles = Object.entries(profile.learningStyleScores)
    .sort((a, b) => b[1] - a[1]) as [LearningStyle, number][];

  const handleStartLearning = () => {
    navigate('/dashboard');
  };

  const handleRetake = () => {
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      {/* Celebration Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Assessment Complete!</span>
        </motion.div>

        <motion.h1
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Welcome, {userName}! 🎉
        </motion.h1>

        <motion.p
          className="text-muted-foreground max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We've created your personalized cognitive profile. Here's what we learned about how you learn best.
        </motion.p>
      </motion.div>

      {/* Primary Learning Style Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Card variant="elevated" className="overflow-hidden">
          <div className={`p-6 ${primaryStyle.color}`}>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                {primaryStyle.icon}
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Your Primary Learning Style</p>
                <h2 className="text-2xl font-display font-bold text-white">
                  {primaryStyle.label}
                </h2>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">{primaryStyle.description}</p>
            
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground mb-3">Your Learning Style Breakdown</p>
              {sortedStyles.map(([style, score], index) => (
                <motion.div
                  key={style}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{style}</span>
                    <span className="text-muted-foreground">{score}%</span>
                  </div>
                  <Progress 
                    value={score} 
                    size="sm" 
                    indicatorVariant={style}
                    animated
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotional & Vocabulary Stats */}
      <motion.div
        className="grid md:grid-cols-2 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-secondary">
                <Heart className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comfort Level</p>
                <p className="font-semibold capitalize">
                  {profile.anxietyLevel <= 2 ? 'Relaxed' : profile.anxietyLevel === 3 ? 'Neutral' : 'Needs Support'}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile.anxietyLevel >= 4 
                ? "We'll start with low-stakes exercises to build your confidence gradually."
                : "You're in a good headspace for learning. Let's challenge you!"
              }
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-secondary">
                <Brain className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vocabulary Level</p>
                <p className="font-semibold capitalize">{profile.vocabularyLevel.replace('-', ' ')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll anchor new vocabulary to concepts you already know, making retention stronger.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <Card variant="elevated" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">Ready to Start Learning?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your personalized learning journey is ready. We'll adapt content to match 
              your {primaryStyle.label.toLowerCase()} style and help manage any anxiety along the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" onClick={handleStartLearning}>
                <Sparkles className="w-5 h-5 mr-2" />
                Start My Journey
              </Button>
              <Button variant="outline" size="lg" onClick={handleRetake}>
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CompleteStep;
