import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getActiveTTSProvider, playAudioBuffer } from '@/lib/tts';

const STT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`;

// Fallback Web Speech API settings per environment
export const environmentVoiceSettings: Record<string, { pitch: number; rate: number }> = {
  gothic: { pitch: 0.8, rate: 0.9 },
  cyber: { pitch: 1.1, rate: 1.1 },
  cosmic: { pitch: 1.0, rate: 0.85 },
  zen: { pitch: 0.95, rate: 0.8 },
  urban: { pitch: 1.0, rate: 1.0 },
  forest: { pitch: 0.9, rate: 0.9 },
  arcade: { pitch: 1.2, rate: 1.15 },
};

export const useVoiceChat = (environment: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const voiceSettings = environmentVoiceSettings[environment] || environmentVoiceSettings.urban;

  // ---------- Fallback: Web Speech API ----------
  const speakWithWebSpeech = useCallback((cleanText: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = voiceSettings.pitch;
    utterance.rate = voiceSettings.rate;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.filter(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha'))
    );
    const voice = preferred[0] || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [voiceSettings]);

  // ---------- Main speak function ----------
  const speakText = useCallback(async (text: string) => {
    if (!voiceEnabled || !text.trim()) return;

    const cleanText = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/>\s/g, '')
      .trim();

    if (!cleanText) return;
    setIsSpeaking(true);

    // Try kokoro-js provider
    try {
      const provider = getActiveTTSProvider();
      if (provider.isEnabled()) {
        const buffer = await provider.synthesize(cleanText);
        if (buffer) {
          await playAudioBuffer(buffer);
          setIsSpeaking(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[TTS] kokoro-js failed, falling back:', err);
    }

    // Fallback to Web Speech
    speakWithWebSpeech(cleanText);
  }, [voiceEnabled, speakWithWebSpeech]);

  // ---------- Stop ----------
  const stopSpeaking = useCallback(() => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch { /* already stopped */ }
      sourceNodeRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // ---------- STT: Start recording ----------
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Microphone access denied');
    }
  }, []);

  // ---------- STT: Stop recording & transcribe ----------
  const stopRecording = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());

        if (audioBlob.size < 1000) {
          setIsRecording(false);
          resolve(null);
          return;
        }

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const response = await fetch(STT_URL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
            body: formData,
          });

          if (!response.ok) throw new Error(`STT request failed: ${response.status}`);

          const result = await response.json();
          setIsRecording(false);
          resolve(result.text || '');
        } catch (error) {
          console.error('STT error:', error);
          toast.error('Voice transcription failed');
          setIsRecording(false);
          resolve(null);
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  // ---------- Toggle ----------
  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (prev) stopSpeaking();
      return !prev;
    });
  }, [stopSpeaking]);

  return {
    isRecording,
    isSpeaking,
    voiceEnabled,
    startRecording,
    stopRecording,
    speakText,
    stopSpeaking,
    toggleVoice,
  };
};
