import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hand, MessageSquare, Zap, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KinestheticContent as KinestheticContentType, SemanticAnchor } from '@/types/learning';

interface KinestheticContentProps {
  content: KinestheticContentType;
  semanticAnchors: SemanticAnchor[];
  chunkIndex: number;
}

const KinestheticContent = ({ content, semanticAnchors, chunkIndex }: KinestheticContentProps) => {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);

  const handleNextPrompt = () => {
    if (activePromptIndex < content.rolePlayPrompts.length - 1) {
      setActivePromptIndex(prev => prev + 1);
      setShowResponse(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kinesthetic Learning Header */}
      <div className="flex items-center gap-3 text-cognitive-kinesthetic">
        <div className="p-2 rounded-lg bg-cognitive-kinesthetic/10">
          <Hand className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium">Kinesthetic Learning Mode</span>
      </div>

      {/* Interactive Scenario */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="elevated" className="overflow-hidden">
          <div className="bg-gradient-to-br from-cognitive-kinesthetic to-cognitive-kinesthetic/80 p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium text-white/80">Role-Play Scenario</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Practice Time!</h3>
            <p className="text-white/80 text-sm">
              Act out the scenario below. Say the words out loud for better learning!
            </p>
          </div>
          
          <CardContent className="p-6">
            {/* Current Prompt */}
            <motion.div
              key={activePromptIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <div className="flex items-start gap-3 p-4 bg-cognitive-kinesthetic/10 rounded-lg border border-cognitive-kinesthetic/20">
                <div className="w-10 h-10 rounded-full bg-cognitive-kinesthetic/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-cognitive-kinesthetic" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Scenario {activePromptIndex + 1} of {content.rolePlayPrompts.length}</p>
                  <p className="text-foreground font-medium">{content.rolePlayPrompts[activePromptIndex]}</p>
                </div>
              </div>
            </motion.div>

            {/* Response Area */}
            <div className="space-y-4">
              {!showResponse ? (
                <Button 
                  className="w-full gap-2 bg-cognitive-kinesthetic hover:bg-cognitive-kinesthetic/90 text-white"
                  size="lg"
                  onClick={() => setShowResponse(true)}
                >
                  <Zap className="w-4 h-4" />
                  I'm ready to respond!
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="p-4 bg-success/10 border-success/30">
                    <p className="text-success font-medium text-center">
                      Great job practicing! Remember to speak out loud! 🎉
                    </p>
                  </Card>
                  {activePromptIndex < content.rolePlayPrompts.length - 1 && (
                    <Button 
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleNextPrompt}
                    >
                      Next Scenario
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {content.rolePlayPrompts.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === activePromptIndex
                      ? 'bg-cognitive-kinesthetic'
                      : i < activePromptIndex
                      ? 'bg-cognitive-kinesthetic/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Physical Activities */}
      {content.physicalActivities.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Try These Activities
          </h4>
          <div className="space-y-2">
            {content.physicalActivities.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-4 bg-cognitive-kinesthetic/5 border-cognitive-kinesthetic/20 hover:bg-cognitive-kinesthetic/10 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cognitive-kinesthetic/10 flex items-center justify-center group-hover:bg-cognitive-kinesthetic/20 transition-colors">
                      <Hand className="w-4 h-4 text-cognitive-kinesthetic" />
                    </div>
                    <p className="text-foreground">{activity}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Semantic Anchors - Action Cards */}
      {semanticAnchors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Practice These Words</h4>
          <div className="grid gap-3">
            {semanticAnchors.slice(0, 2).map((anchor, i) => (
              <motion.div
                key={anchor.newWord}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Card className="p-4 bg-gradient-to-r from-cognitive-kinesthetic/10 to-transparent border-cognitive-kinesthetic/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-lg">{anchor.newWord}</h5>
                      <p className="text-sm text-muted-foreground">{anchor.definition}</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Zap className="w-4 h-4" />
                      Practice
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KinestheticContent;
