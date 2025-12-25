import { motion } from 'framer-motion';
import { Eye, Image, PlayCircle, Box } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { VisualContent as VisualContentType, SemanticAnchor } from '@/types/learning';

interface VisualContentProps {
  content: VisualContentType;
  semanticAnchors: SemanticAnchor[];
  chunkIndex: number;
}

const VisualContent = ({ content, semanticAnchors, chunkIndex }: VisualContentProps) => {
  return (
    <div className="space-y-6">
      {/* Visual Learning Header */}
      <div className="flex items-center gap-3 text-cognitive-visual">
        <div className="p-2 rounded-lg bg-cognitive-visual/10">
          <Eye className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium">Visual Learning Mode</span>
      </div>

      {/* Main Visual Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="cognitive" className="overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-cognitive-visual/20 to-cognitive-visual/5 flex items-center justify-center">
            {content.videoUrl ? (
              <div className="text-center">
                <PlayCircle className="w-16 h-16 text-cognitive-visual mb-2 mx-auto" />
                <p className="text-muted-foreground">Video lesson available</p>
              </div>
            ) : content.vrScenarioId ? (
              <div className="text-center">
                <Box className="w-16 h-16 text-cognitive-visual mb-2 mx-auto" />
                <p className="text-muted-foreground">VR Scenario: {content.vrScenarioId}</p>
              </div>
            ) : (
              <div className="text-center">
                <Image className="w-16 h-16 text-cognitive-visual mb-2 mx-auto" />
                <p className="text-muted-foreground">Visual illustration</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Image Gallery */}
      {content.images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {content.images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden group cursor-pointer hover:ring-2 hover:ring-cognitive-visual/50 transition-all">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Image className="w-8 h-8 text-muted-foreground group-hover:text-cognitive-visual transition-colors" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Infographics */}
      {content.infographics.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Infographics</h4>
          {content.infographics.map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Card className="p-4 bg-cognitive-visual/5 border-cognitive-visual/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cognitive-visual/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-cognitive-visual" />
                  </div>
                  <span className="font-medium">{info}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Semantic Anchors - Visual Cards */}
      {semanticAnchors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Key Vocabulary</h4>
          <div className="grid gap-3">
            {semanticAnchors.slice(0, 2).map((anchor, i) => (
              <motion.div
                key={anchor.newWord}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Card className="p-4 bg-gradient-to-r from-cognitive-visual/10 to-transparent border-cognitive-visual/20">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-cognitive-visual/10 flex items-center justify-center shrink-0">
                      <Image className="w-8 h-8 text-cognitive-visual" />
                    </div>
                    <div>
                      <h5 className="font-bold text-lg text-foreground">{anchor.newWord}</h5>
                      <p className="text-sm text-muted-foreground">{anchor.definition}</p>
                    </div>
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

export default VisualContent;
