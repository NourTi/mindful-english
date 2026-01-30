import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;
const STT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`;

// Voice IDs for different environment personas
export const environmentVoices: Record<string, string> = {
  gothic: 'onwK4e9ZLuTAKqWW03F9',    // Daniel - deep, mysterious
  cyber: 'cjVigY5qzO86Huf0OWal',     // Eric - tech/futuristic
  cosmic: 'XrExE9yKIg1WjnnlVkGX',    // Matilda - ethereal
  zen: 'pFZP5JQG7iQjIQuC4Bku',       // Lily - calm, soothing
  urban: 'TX3LPaxmHKxFdv7VOQHJ',     // Liam - casual, friendly
  forest: 'EXAVITQu4vr4xnSDxMaL',    // Sarah - warm, nurturing
  arcade: 'iP95p4xoKVk53GoZ742B',    // Chris - energetic
};

export const useVoiceChat = (environment: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const voiceId = environmentVoices[environment] || environmentVoices.urban;

  // Text-to-Speech: Speak AI response
  const speakText = useCallback(async (text: string) => {
    if (!voiceEnabled || !text.trim()) return;

    // Clean markdown from text for natural speech
    const cleanText = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/>\s/g, '')
      .trim();

    if (!cleanText) return;

    try {
      setIsSpeaking(true);
      console.log('Requesting TTS for:', cleanText.substring(0, 50));

      const response = await fetch(TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: cleanText, voiceId }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        console.error('Audio playback error');
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      toast.error('Voice playback failed');
    }
  }, [voiceEnabled, voiceId]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Speech-to-Text: Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Microphone access denied');
    }
  }, []);

  // Speech-to-Text: Stop recording and transcribe
  const stopRecording = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        
        if (audioBlob.size < 1000) {
          console.log('Recording too short');
          setIsRecording(false);
          resolve(null);
          return;
        }

        try {
          console.log('Transcribing audio:', audioBlob.size, 'bytes');
          
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const response = await fetch(STT_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`STT request failed: ${response.status}`);
          }

          const result = await response.json();
          const transcription = result.text || '';
          console.log('Transcription:', transcription);
          
          setIsRecording(false);
          resolve(transcription);
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

  // Toggle voice on/off
  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (prev) {
        stopSpeaking();
      }
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
