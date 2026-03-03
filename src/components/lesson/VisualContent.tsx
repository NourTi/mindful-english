import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Lightbulb, ArrowRight, ArrowDown, Sparkles, BookOpen, Zap, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VisualContent as VisualContentType, SemanticAnchor } from '@/types/learning';

interface VisualContentProps {
  content: VisualContentType;
  semanticAnchors: SemanticAnchor[];
  chunkIndex: number;
}

// ── Animated Grammar Diagram ──────────────────────────────────────────
function GrammarDiagram({ text }: { text: string }) {
  // Parse infographic text into a visual diagram
  const parts = text.split(/[→↔:]/);
  const hasArrow = text.includes('→');
  const hasDoubleArrow = text.includes('↔');
  const hasColon = text.includes(':');

  if (parts.length >= 2 && (hasArrow || hasDoubleArrow)) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 rounded-xl bg-primary/10 border-2 border-primary/30 p-4 text-center"
        >
          <span className="font-mono text-sm font-semibold text-primary">{parts[0].trim()}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-primary"
        >
          {hasDoubleArrow ? (
            <div className="flex items-center gap-1">
              <ArrowRight className="w-5 h-5" />
              <ArrowRight className="w-5 h-5 rotate-180" />
            </div>
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-1 rounded-xl bg-accent/10 border-2 border-accent/30 p-4 text-center"
        >
          <span className="font-mono text-sm font-semibold text-accent-foreground">{parts.slice(1).join(hasArrow ? '→' : '↔').trim()}</span>
        </motion.div>
      </div>
    );
  }

  if (hasColon && parts.length >= 2) {
    return (
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-primary/10 border border-primary/20 p-4"
        >
          <h5 className="text-sm font-bold text-primary mb-2">{parts[0].trim()}</h5>
          <p className="text-sm text-foreground/80">{parts.slice(1).join(':').trim()}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-muted/80 border border-border p-4"
    >
      <p className="text-sm font-medium">{text}</p>
    </motion.div>
  );
}

// ── Animated Vocabulary Flashcard ─────────────────────────────────────
function VocabCard({ anchor, index }: { anchor: SemanticAnchor; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.15 * index, type: 'spring', stiffness: 200 }}
      className="perspective-1000"
    >
      <div
        className="relative cursor-pointer group"
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
      >
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -90 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-2 border-cognitive-visual/30 hover:border-cognitive-visual/60 transition-all hover:shadow-lg hover:shadow-cognitive-visual/10">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="px-3 py-1.5 rounded-lg bg-cognitive-visual/15">
                      <span className="text-lg font-bold text-cognitive-visual">{anchor.newWord}</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Tap to flip
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic">{anchor.definition}</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-2 border-accent/30 bg-accent/5">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">Example</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-3">{anchor.personalizedExample}</p>
                  {anchor.relatedConcepts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {anchor.relatedConcepts.map((c) => (
                        <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Animated Sentence Builder ─────────────────────────────────────────
function SentenceAnimation({ sentences }: { sentences: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (sentences.length === 0) return null;

  // Color-code words in sentence (nouns=primary, verbs=accent, etc.)
  const colorize = (sentence: string) => {
    const words = sentence.split(' ');
    return words.map((word, i) => {
      const clean = word.replace(/[""".,!?;:()]/g, '');
      const isQuoted = word.startsWith('"') || word.startsWith('"');
      const isBold = word.startsWith('**') && word.endsWith('**');
      const isHighlight = /^[A-Z]{2,}/.test(clean);

      let className = 'text-foreground';
      if (isQuoted) className = 'text-primary font-semibold';
      if (isBold) className = 'text-accent font-bold';
      if (isHighlight) className = 'text-warning font-bold';

      return (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`${className} inline-block mr-1`}
        >
          {isBold ? word.replace(/\*\*/g, '') : word}
        </motion.span>
      );
    });
  };

  return (
    <Card className="border border-border overflow-hidden">
      <div className="bg-muted/40 px-4 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Examples</span>
        </div>
        <span className="text-xs text-muted-foreground">{activeIndex + 1}/{sentences.length}</span>
      </div>
      <CardContent className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[3rem] flex items-center flex-wrap"
          >
            {colorize(sentences[activeIndex])}
          </motion.div>
        </AnimatePresence>
        {sentences.length > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="flex gap-1.5">
              {sentences.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === activeIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 text-xs"
              onClick={() => setActiveIndex((activeIndex + 1) % sentences.length)}
            >
              Next <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Animated Rule Cards ───────────────────────────────────────────────
function RuleCard({ rule, index }: { rule: string; index: number }) {
  const icons = [CheckCircle2, Lightbulb, Sparkles, BookOpen];
  const Icon = icons[index % icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.1 * index, type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/30 hover:bg-muted/80 transition-all group">
        <div className="mt-0.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{rule}</p>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
const VisualContent = ({ content, semanticAnchors, chunkIndex }: VisualContentProps) => {
  // Build example sentences from infographic text
  const exampleSentences = content.infographics.filter(text =>
    text.includes('"') || text.includes('"') || text.includes('→') || text.includes('↔')
  );
  const diagramTexts = content.infographics.filter(text =>
    !exampleSentences.includes(text)
  );

  return (
    <div className="space-y-6">
      {/* Visual Learning Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-cognitive-visual/15 shadow-sm shadow-cognitive-visual/10">
          <Eye className="w-5 h-5 text-cognitive-visual" />
        </div>
        <div>
          <span className="text-sm font-semibold text-cognitive-visual">Visual Learning Mode</span>
          <p className="text-xs text-muted-foreground">Interactive diagrams & animated examples</p>
        </div>
      </motion.div>

      {/* Animated Diagrams from Infographics */}
      {diagramTexts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Key Concepts</h4>
          </div>
          <div className="space-y-3">
            {diagramTexts.map((text, i) => (
              <GrammarDiagram key={i} text={text} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Animated Example Sentences */}
      {exampleSentences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SentenceAnimation sentences={exampleSentences} />
        </motion.div>
      )}

      {/* Vocabulary Flashcards */}
      {semanticAnchors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-cognitive-visual" />
            <h4 className="text-sm font-semibold text-foreground">Vocabulary Cards</h4>
            <Badge variant="outline" className="text-xs ml-auto">Tap to flip</Badge>
          </div>
          <div className="grid gap-3">
            {semanticAnchors.map((anchor, i) => (
              <VocabCard key={anchor.newWord} anchor={anchor} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Visual Rule Summary */}
      {content.infographics.length === 0 && semanticAnchors.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-cognitive-visual/15 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-cognitive-visual" />
          </div>
          <p className="text-muted-foreground text-sm">
            Switch to another learning mode for this section, or continue to the next chunk.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default VisualContent;
