import { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Play, Pause, Volume2, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AuditoryContent as AuditoryContentType, SemanticAnchor } from '@/types/learning';

interface AuditoryContentProps {
  content: AuditoryContentType;
  semanticAnchors: SemanticAnchor[];
  chunkIndex: number;
}

const AuditoryContent = ({ content, semanticAnchors, chunkIndex }: AuditoryContentProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Simulate audio progress
    if (!isPlaying) {
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auditory Learning Header */}
      <div className="flex items-center gap-3 text-cognitive-auditory">
        <div className="p-2 rounded-lg bg-cognitive-auditory/10">
          <Headphones className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium">Auditory Learning Mode</span>
      </div>

      {/* Main Audio Player */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="elevated" className="overflow-hidden">
          <div className="bg-gradient-to-r from-cognitive-auditory to-cognitive-auditory/80 p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Button
                size="lg"
                variant="glass"
                className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Lesson Audio</h3>
                <p className="text-sm text-white/70">Listen and repeat for best results</p>
              </div>
              <Volume2 className="w-5 h-5 text-white/70" />
            </div>
            <Progress value={audioProgress} size="sm" className="bg-white/20" indicatorVariant="default" />
          </div>
        </Card>
      </motion.div>

      {/* Transcript Highlights */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          Key Phrases to Listen For
        </h4>
        <div className="space-y-2">
          {content.transcriptHighlights.map((highlight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-4 bg-cognitive-auditory/5 border-cognitive-auditory/20 hover:bg-cognitive-auditory/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cognitive-auditory/10 flex items-center justify-center group-hover:bg-cognitive-auditory/20 transition-colors">
                    <Play className="w-4 h-4 text-cognitive-auditory" />
                  </div>
                  <p className="text-foreground italic">{highlight}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pronunciation Guide */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Mic className="w-4 h-4" />
          Pronunciation Guide
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {content.pronunciationGuide.map((guide, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Card className="p-3 bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-foreground">{guide}</code>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Volume2 className="w-4 h-4 text-cognitive-auditory" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Semantic Anchors - Audio Focus */}
      {semanticAnchors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Listen & Learn</h4>
          {semanticAnchors.slice(0, 2).map((anchor, i) => (
            <motion.div
              key={anchor.newWord}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className="p-4 border-cognitive-auditory/20">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-bold text-lg">{anchor.newWord}</h5>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Volume2 className="w-4 h-4" />
                    Listen
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{anchor.definition}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditoryContent;
