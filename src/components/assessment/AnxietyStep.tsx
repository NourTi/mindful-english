import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Smile, Frown, Meh, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { AnxietyLevel, ConfidenceLevel } from '@/types/learning';

const anxietyLevels = [
  { level: 1, label: 'Very Relaxed', description: 'Speaking English feels natural and comfortable', icon: Smile, color: 'text-success' },
  { level: 2, label: 'Mostly Calm', description: 'A little nervous but generally okay', icon: Smile, color: 'text-success' },
  { level: 3, label: 'Neutral', description: 'It depends on the situation', icon: Meh, color: 'text-warning' },
  { level: 4, label: 'Somewhat Anxious', description: 'I often feel nervous when speaking', icon: Frown, color: 'text-destructive/70' },
  { level: 5, label: 'Very Anxious', description: 'Speaking English is quite stressful for me', icon: Frown, color: 'text-destructive' },
];

const confidenceLevels = [
  { level: 1, label: 'Not Confident', description: "I doubt my English abilities often" },
  { level: 2, label: 'Slightly Confident', description: "I'm working on building my confidence" },
  { level: 3, label: 'Moderately Confident', description: "I'm okay in familiar situations" },
  { level: 4, label: 'Quite Confident', description: "I believe I can handle most situations" },
  { level: 5, label: 'Very Confident', description: "I'm comfortable with my English skills" },
];

const AnxietyStep = () => {
  const { anxietyLevel, confidenceLevel, setAnxietyLevel, setConfidenceLevel, setStep, userName } = useAssessmentStore();
  const [phase, setPhase] = useState<'anxiety' | 'confidence'>('anxiety');

  const handleContinue = () => {
    if (phase === 'anxiety') {
      setPhase('confidence');
    } else {
      setStep('vocabulary');
    }
  };

  const handleBack = () => {
    if (phase === 'confidence') {
      setPhase('anxiety');
    } else {
      setStep('learning-style');
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
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {phase === 'anxiety' ? (
            <>
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Emotional Baseline</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Confidence Check</span>
            </>
          )}
        </motion.div>

        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {phase === 'anxiety' 
            ? `${userName}, understanding your comfort level helps us create a safe learning environment.`
            : "This helps us calibrate the right level of challenge for you."
          }
        </motion.p>
      </div>

      {phase === 'anxiety' ? (
        <motion.div
          key="anxiety"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
            How do you feel about speaking English?
          </h2>

          <div className="grid gap-3">
            {anxietyLevels.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.level}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card
                    variant="assessment"
                    className={`cursor-pointer transition-all duration-300 ${
                      anxietyLevel === item.level
                        ? 'border-primary bg-primary/5 shadow-soft'
                        : 'hover:border-primary/30'
                    }`}
                    onClick={() => setAnxietyLevel(item.level as AnxietyLevel)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`p-2 rounded-lg ${anxietyLevel === item.level ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      {anxietyLevel === item.level && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Sparkles className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {anxietyLevel >= 4 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 rounded-xl bg-secondary border border-secondary-foreground/10"
            >
              <p className="text-sm text-secondary-foreground">
                <strong>That's completely okay.</strong> Many learners feel this way. 
                Our system is designed to lower anxiety and build your confidence step by step. 
                We'll start with low-stakes exercises and gradually increase challenges at your pace. 💚
              </p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="confidence"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
            How confident do you feel about your English skills?
          </h2>

          <div className="grid gap-3">
            {confidenceLevels.map((item, index) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  variant="assessment"
                  className={`cursor-pointer transition-all duration-300 ${
                    confidenceLevel === item.level
                      ? 'border-primary bg-primary/5 shadow-soft'
                      : 'hover:border-primary/30'
                  }`}
                  onClick={() => setConfidenceLevel(item.level as ConfidenceLevel)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      confidenceLevel === item.level 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.level}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {confidenceLevel === item.level && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Sparkles className="w-3 h-3 text-primary-foreground" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button variant="hero" onClick={handleContinue}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default AnxietyStep;
