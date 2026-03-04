import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { onModelStateChange } from '@/lib/tts';
import { cn } from '@/lib/utils';

export const TTSLoadingIndicator = () => {
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    return onModelStateChange(setState);
  }, []);

  if (state === 'idle' || state === 'ready') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium",
          state === 'loading' && "bg-primary/10 text-primary",
          state === 'error' && "bg-destructive/10 text-destructive"
        )}
      >
        {state === 'loading' && (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Loading voice…</span>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="w-3 h-3" />
            <span>Voice unavailable</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
