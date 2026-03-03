import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Send, Loader2, AlertCircle, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AvatarStatus } from '@/lib/avatarBackend';

const AVATAR_API = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/avatar-generate`;
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface TalkingAvatarPanelProps {
  /** Current NPC text to display as caption */
  npcText: string;
  /** Character / avatar identifier */
  characterId: string;
  /** Current NPC emotion */
  emotion?: string;
  /** Called when the user submits text/audio via the Talk button */
  onUserInput?: (text: string) => void;
  /** Whether to show the talk input controls */
  showInput?: boolean;
  /** Extra class names */
  className?: string;
}

const statusConfig: Record<AvatarStatus, { label: string; color: string; icon?: React.ReactNode }> = {
  idle:       { label: 'Idle',        color: 'bg-muted-foreground' },
  listening:  { label: 'Listening…',  color: 'bg-primary',         icon: <Mic className="h-3 w-3 animate-pulse" /> },
  generating: { label: 'Generating…', color: 'bg-accent',          icon: <Loader2 className="h-3 w-3 animate-spin" /> },
  error:      { label: 'Error',       color: 'bg-destructive',     icon: <AlertCircle className="h-3 w-3" /> },
};

export default function TalkingAvatarPanel({
  npcText,
  characterId,
  emotion,
  onUserInput,
  showInput = false,
  className = '',
}: TalkingAvatarPanelProps) {
  const [status, setStatus] = useState<AvatarStatus>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ── Request avatar video whenever npcText changes ───────────────────
  useEffect(() => {
    if (!npcText?.trim()) return;

    let cancelled = false;

    const fetchAvatar = async () => {
      setStatus('generating');
      try {
        const resp = await fetch(AVATAR_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
            apikey: API_KEY,
          },
          body: JSON.stringify({ text: npcText, characterId, emotion }),
        });

        if (resp.status === 501 || !resp.ok) {
          // 501 = no backend configured (text-only mode) — not an error
          if (!cancelled) {
            setVideoUrl(null);
            setStatus('idle');
          }
          return;
        }

        const data = await resp.json();
        if (!cancelled && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setStatus('idle');
        } else if (!cancelled) {
          setVideoUrl(null);
          setStatus('idle');
        }
      } catch {
        if (!cancelled) {
          setVideoUrl(null);
          setStatus('idle'); // graceful degradation, don't show error for text-only
        }
      }
    };

    fetchAvatar();
    return () => { cancelled = true; };
  }, [npcText, characterId, emotion]);

  // ── Play video when URL updates ─────────────────────────────────────
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl]);

  // ── Microphone recording ────────────────────────────────────────────
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      // Stop
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setStatus('idle');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (blob.size < 500) return;

          // For now, send as text prompt via onUserInput — future: send audioUrl to avatar backend
          onUserInput?.('[voice input recorded]');
        };

        recorder.start(100);
        setIsRecording(true);
        setStatus('listening');
      } catch {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }
  }, [isRecording, onUserInput]);

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onUserInput?.(textInput.trim());
    setTextInput('');
  };

  const cfg = statusConfig[status];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Video box (16:9) */}
      <div className="rounded-xl overflow-hidden border border-border bg-card">
        <AspectRatio ratio={16 / 9}>
          <div className="relative w-full h-full bg-background flex items-center justify-center">
            {videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                onEnded={() => setVideoUrl(null)}
              />
            ) : (
              /* Text-only avatar placeholder */
              <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Video className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Avatar video will appear here when a backend is configured
                </p>
              </div>
            )}

            {/* Status badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="gap-1.5 text-xs bg-background/80 backdrop-blur-sm">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
                {cfg.icon}
                {cfg.label}
              </Badge>
            </div>
          </div>
        </AspectRatio>
      </div>

      {/* Caption area */}
      <AnimatePresence mode="wait">
        {npcText && (
          <motion.div
            key={npcText.slice(0, 30)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-muted/60 border border-border p-3"
          >
            <ScrollArea className="max-h-24">
              <p className="text-sm text-foreground leading-relaxed">{npcText}</p>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Talk input (optional) */}
      {showInput && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant={isRecording ? 'destructive' : 'ghost'}
            size="icon"
            onClick={toggleRecording}
            title={isRecording ? 'Stop recording' : 'Hold to talk'}
            className="shrink-0"
          >
            {isRecording ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={isRecording ? 'Listening…' : 'Type to talk…'}
            disabled={isRecording}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit(); }}
            className="flex-1"
          />
          <Button size="icon" onClick={handleTextSubmit} disabled={!textInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
