import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Loader2, RefreshCw, Download, Send, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GameActivityProps {
  lessonTitle: string;
  lessonTopic: string;
  difficulty: string;
}

const GameActivity = ({ lessonTitle, lessonTopic, difficulty }: GameActivityProps) => {
  const [gameHtml, setGameHtml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [improvementRequest, setImprovementRequest] = useState('');
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateGame = useCallback(async (userRequest?: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const body: Record<string, string> = {
        lessonTitle,
        lessonTopic,
        difficulty,
      };

      if (gameHtml && userRequest) {
        body.existingCode = gameHtml;
        body.userRequest = userRequest;
      }

      const { data, error: fnError } = await supabase.functions.invoke('generate-game', {
        body,
      });

      if (fnError) throw fnError;

      if (data?.error) {
        setError(data.error);
        toast.error(data.error);
        return;
      }

      if (data?.html) {
        setGameHtml(data.html);
        setImprovementRequest('');
        toast.success(gameHtml ? 'Game updated!' : 'Game generated! Have fun learning! 🎮');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate game';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  }, [lessonTitle, lessonTopic, difficulty, gameHtml]);

  const downloadGame = () => {
    if (!gameHtml) return;
    const blob = new Blob([gameHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle.replace(/\s+/g, '-').toLowerCase()}-game.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImprove = () => {
    if (!improvementRequest.trim()) return;
    generateGame(improvementRequest.trim());
  };

  if (!gameHtml && !isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-8"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
          <Gamepad2 className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-display font-bold mb-3">Practice with a Game!</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          AI will generate a custom HTML5 game based on this lesson's topic to help you
          practice <span className="font-semibold text-foreground">{lessonTopic}</span> in a fun way.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-destructive mb-4 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button
          onClick={() => generateGame()}
          size="lg"
          className="gap-2"
          variant="hero"
        >
          <Sparkles className="w-5 h-5" />
          Generate Game
        </Button>
      </motion.div>
    );
  }

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center py-12"
      >
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <Loader2 className="w-8 h-8 text-primary animate-spin absolute -bottom-2 -right-2" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2">
          {gameHtml ? 'Improving your game...' : 'Generating your game...'}
        </h3>
        <p className="text-muted-foreground text-sm">
          Qwen3-Coder is crafting a custom game for you. This may take 15-30 seconds.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Game iframe */}
      <Card className="overflow-hidden border-primary/20">
        <CardContent className="p-0">
          <iframe
            ref={iframeRef}
            srcDoc={gameHtml!}
            title="Educational Game"
            className="w-full border-0"
            style={{ height: '500px' }}
            sandbox="allow-scripts allow-same-origin"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Ask for improvements... (e.g. 'make it harder', 'add more words')"
            value={improvementRequest}
            onChange={(e) => setImprovementRequest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleImprove()}
          />
          <Button
            onClick={handleImprove}
            disabled={!improvementRequest.trim()}
            size="icon"
            variant="outline"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => generateGame()} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </Button>
          <Button onClick={downloadGame} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameActivity;
