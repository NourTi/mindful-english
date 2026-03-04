import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mic2 } from 'lucide-react';
import { KOKORO_VOICES, type VoiceOption } from '@/lib/tts';
import { cn } from '@/lib/utils';

interface VoicePickerProps {
  selectedVoiceId: string;
  onSelect: (voiceId: string) => void;
}

export const VoicePicker = ({ selectedVoiceId, onSelect }: VoicePickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = KOKORO_VOICES.find(v => v.id === selectedVoiceId) || KOKORO_VOICES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs",
          "bg-muted/60 border border-border hover:bg-muted transition-colors"
        )}
      >
        <Mic2 className="w-3.5 h-3.5 text-primary" />
        <span className="font-medium">{selected.label}</span>
        <span className="text-muted-foreground hidden sm:inline">· {selected.tone}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full mt-1 right-0 z-50 w-64",
              "bg-card border border-border rounded-xl shadow-lg p-2",
              "max-h-64 overflow-y-auto"
            )}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 font-semibold">
              Choose Voice
            </div>
            {KOKORO_VOICES.map(voice => (
              <button
                key={voice.id}
                onClick={() => { onSelect(voice.id); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
                  voice.id === selectedVoiceId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/60"
                )}
              >
                <span className="text-sm">
                  {voice.gender === 'female' ? '👩' : '👨'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{voice.label}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {voice.tone} · {voice.accent === 'british' ? '🇬🇧' : '🇺🇸'} {voice.accent}
                  </div>
                </div>
                {voice.id === selectedVoiceId && (
                  <span className="text-primary text-xs">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
