import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PathRecommendation } from '@/types/onboarding';

interface RecommendationCardProps {
  recommendation: PathRecommendation;
  onStartPath: () => void;
}

const RecommendationCard = ({ recommendation, onStartPath }: RecommendationCardProps) => {
  const difficultyColors = {
    easy: 'text-success',
    medium: 'text-warning',
    hard: 'text-destructive'
  };
  
  const psySupportIcons = {
    low: <Zap className="w-5 h-5" />,
    medium: <Brain className="w-5 h-5" />,
    high: <Shield className="w-5 h-5" />
  };
  
  const psySupportLabels = {
    low: 'Standard Support',
    medium: 'Enhanced Support',
    high: 'Full Psychological Support'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-glow overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground">
                Your Personalized Path
              </h3>
              <p className="text-sm text-muted-foreground">
                Tailored just for you
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-background/50 border border-border/50">
              <h4 className="text-2xl font-display font-bold text-primary mb-2">
                {recommendation.pathLabel}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {recommendation.reason}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Difficulty
                </span>
                <p className={`text-lg font-semibold capitalize ${difficultyColors[recommendation.difficulty]}`}>
                  {recommendation.difficulty}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Support Level
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary">{psySupportIcons[recommendation.psySupport]}</span>
                  <p className="text-sm font-medium text-foreground">
                    {psySupportLabels[recommendation.psySupport]}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="hero"
              size="xl"
              onClick={onStartPath}
              className="w-full group"
            >
              Start My Path
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;
