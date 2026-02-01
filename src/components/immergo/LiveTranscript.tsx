import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export interface TranscriptEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LiveTranscriptProps {
  entries: TranscriptEntry[];
  isStreaming: boolean;
  className?: string;
}

export const LiveTranscript = ({ entries, isStreaming, className }: LiveTranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className={cn(
      "relative h-full overflow-hidden rounded-xl",
      "bg-black/20 backdrop-blur-sm border border-white/10",
      className
    )}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-md px-4 py-2 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            Live Transcript
          </span>
          {isStreaming && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-primary">Listening...</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Transcript content */}
      <div
        ref={scrollRef}
        className="h-[calc(100%-40px)] overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                "rounded-lg p-3 max-w-[85%]",
                entry.role === 'user' 
                  ? "bg-primary/20 ml-auto text-right border border-primary/30" 
                  : "bg-white/10 mr-auto border border-white/10"
              )}
            >
              <div className="text-xs font-semibold mb-1 opacity-60">
                {entry.role === 'user' ? 'You' : 'AI Tutor'}
              </div>
              <div className="text-sm text-white/90 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{entry.content}</ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/40 text-sm italic">
              Start speaking to begin the conversation...
            </p>
          </div>
        )}
      </div>

      {/* Fade effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
};
