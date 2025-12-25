import { motion } from 'framer-motion';
import { BookOpen, FileText, PenTool, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ReadingContent as ReadingContentType, SemanticAnchor } from '@/types/learning';

interface ReadingContentProps {
  content: ReadingContentType;
  semanticAnchors: SemanticAnchor[];
  chunkIndex: number;
}

const ReadingContent = ({ content, semanticAnchors, chunkIndex }: ReadingContentProps) => {
  // Parse markdown-like formatting
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={i} className="font-bold text-lg mt-4 mb-2 text-foreground">{line.slice(2, -2)}</h3>;
      }
      if (line.startsWith('- ')) {
        const parts = line.slice(2).split(' - ');
        if (parts.length === 2) {
          return (
            <li key={i} className="flex gap-2 mb-2">
              <span className="font-semibold text-cognitive-reading">{parts[0]}</span>
              <span className="text-muted-foreground">- {parts[1]}</span>
            </li>
          );
        }
        return <li key={i} className="mb-2 text-foreground">{line.slice(2)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-foreground leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Reading Learning Header */}
      <div className="flex items-center gap-3 text-cognitive-reading">
        <div className="p-2 rounded-lg bg-cognitive-reading/10">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium">Reading Learning Mode</span>
      </div>

      {/* Main Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="elevated" className="overflow-hidden">
          <div className="p-6 bg-gradient-to-b from-cognitive-reading/5 to-transparent">
            <div className="prose prose-sm max-w-none">
              {formatText(content.mainText)}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Grammar Rules */}
      {content.grammarRules.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Grammar Rules
          </h4>
          <div className="space-y-2">
            {content.grammarRules.map((rule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-4 bg-cognitive-reading/5 border-cognitive-reading/20">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cognitive-reading/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-cognitive-reading">{i + 1}</span>
                    </div>
                    <p className="text-foreground">{rule}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Exercises */}
      {content.exercises.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Quick Exercises
          </h4>
          <div className="space-y-2">
            {content.exercises.map((exercise, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className="p-4 bg-muted/50 border-dashed hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cognitive-reading/10 flex items-center justify-center">
                      <PenTool className="w-4 h-4 text-cognitive-reading" />
                    </div>
                    <p className="text-foreground">{exercise}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Semantic Anchors - Dictionary Style */}
      {semanticAnchors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Vocabulary to Remember
          </h4>
          {semanticAnchors.slice(0, 2).map((anchor, i) => (
            <motion.div
              key={anchor.newWord}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className="p-4 border-cognitive-reading/20">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <h5 className="font-bold text-lg text-cognitive-reading">{anchor.newWord}</h5>
                    <span className="text-xs text-muted-foreground">(noun)</span>
                  </div>
                  <p className="text-foreground">{anchor.definition}</p>
                  {anchor.personalizedExample && (
                    <p className="text-sm text-muted-foreground italic border-l-2 border-cognitive-reading/30 pl-3">
                      {anchor.personalizedExample}
                    </p>
                  )}
                  {anchor.relatedConcepts.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {anchor.relatedConcepts.map(concept => (
                        <span key={concept} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingContent;
