import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const STT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kokoro-tts`;

interface VoiceAssessmentProps {
  word: string;
}

type FeedbackState = null | 'recording' | 'processing' | 'success' | 'retry';

const VoiceAssessment = ({ word }: VoiceAssessmentProps) => {
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Listen to correct pronunciation
  const playPronunciation = useCallback(async () => {
    setIsPlaying(true);
    try {
      const response = await fetch(TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: word, voice: 'af_bella', speed: 0.8 }),
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob.size > 100) {
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.onended = () => { setIsPlaying(false); URL.revokeObjectURL(url); };
          audio.onerror = () => { setIsPlaying(false); URL.revokeObjectURL(url); };
          await audio.play();
          return;
        }
      }
    } catch {}

    // Fallback to Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  }, [word]);

  // Record user's pronunciation
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(100);
      setFeedback('recording');
      setFeedbackText('');
      setUserTranscript('');
    } catch {
      toast.error('Microphone access denied');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

    setFeedback('processing');

    return new Promise<void>((resolve) => {
      const recorder = mediaRecorderRef.current!;
      recorder.onstop = async () => {
        recorder.stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (blob.size < 500) {
          setFeedback(null);
          setFeedbackText('Recording too short. Try again.');
          resolve();
          return;
        }

        try {
          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');

          const response = await fetch(STT_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            const transcript = (result.text || '').trim().toLowerCase().replace(/[.,!?]/g, '');
            setUserTranscript(transcript);

            const target = word.toLowerCase().replace(/[.,!?]/g, '');
            
            if (transcript === target || transcript.includes(target) || target.includes(transcript)) {
              setFeedback('success');
              setFeedbackText(`Perfect! You said "${transcript}" — great pronunciation! 🎉`);
            } else if (transcript) {
              setFeedback('retry');
              setFeedbackText(`You said "${transcript}" — expected "${word}". Try listening first, then repeat.`);
            } else {
              setFeedback('retry');
              setFeedbackText('No speech detected. Speak closer to the mic and try again.');
            }
          } else {
            setFeedback('retry');
            setFeedbackText('Could not process audio. Try again.');
          }
        } catch {
          setFeedback('retry');
          setFeedbackText('Transcription failed. Check your connection.');
        }
        resolve();
      };
      recorder.stop();
    });
  }, [word]);

  const handleMicClick = useCallback(() => {
    if (feedback === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  }, [feedback, startRecording, stopRecording]);

  return (
    <div className="mb-6 space-y-3">
      {/* Listen button */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={playPronunciation}
          disabled={isPlaying}
          className="gap-2"
        >
          <Volume2 className="w-4 h-4" />
          {isPlaying ? 'Playing…' : 'Listen'}
        </Button>

        <Button
          variant={feedback === 'recording' ? 'destructive' : 'outline'}
          size="sm"
          onClick={handleMicClick}
          disabled={feedback === 'processing'}
          className="gap-2"
        >
          {feedback === 'processing' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Checking…</>
          ) : feedback === 'recording' ? (
            <><MicOff className="w-4 h-4 animate-pulse" /> Stop</>
          ) : (
            <><Mic className="w-4 h-4" /> Say it</>
          )}
        </Button>
      </div>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {feedbackText && (
          <motion.div
            key={feedbackText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-sm px-4 py-2 rounded-lg ${
              feedback === 'success'
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-warning/10 text-warning border border-warning/20'
            }`}
          >
            {feedback === 'success' ? (
              <CheckCircle className="w-4 h-4 inline mr-1" />
            ) : (
              <AlertCircle className="w-4 h-4 inline mr-1" />
            )}
            {feedbackText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAssessment;
