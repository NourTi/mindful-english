import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

const STT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`;

// Voice settings for different environment personas (Web Speech API)
export const environmentVoiceSettings: Record<string, { pitch: number; rate: number }> = {
  gothic: { pitch: 0.8, rate: 0.9 },    // Deep, slow
  cyber: { pitch: 1.1, rate: 1.1 },     // Slightly robotic
  cosmic: { pitch: 1.0, rate: 0.85 },   // Ethereal, slow
  zen: { pitch: 0.95, rate: 0.8 },      // Calm, soothing
  urban: { pitch: 1.0, rate: 1.0 },     // Natural
  forest: { pitch: 0.9, rate: 0.9 },    // Warm
  arcade: { pitch: 1.2, rate: 1.15 },   // Energetic
};

export const useVoiceChat = (environment: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Disabled by default - user must opt-in
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const voiceSettings = environmentVoiceSettings[environment] || environmentVoiceSettings.urban;

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Get a good English voice
  const getVoice = useCallback(() => {
    // Prefer high-quality voices
    const preferredVoices = voices.filter(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha'))
    );
    return preferredVoices[0] || voices.find(v => v.lang.startsWith('en')) || voices[0];
  }, [voices]);

  // Text-to-Speech: Speak AI response using Web Speech API
  const speakText = useCallback(async (text: string) => {
    if (!voiceEnabled || !text.trim()) return;

    // Check if Web Speech API is available
    if (!('speechSynthesis' in window)) {
      toast.error('Speech synthesis not supported in this browser');
      return;
    }

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
      // Stop any current speech
      window.speechSynthesis.cancel();

      setIsSpeaking(true);
      console.log('Speaking with Web Speech API:', cleanText.substring(0, 50));

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      // Apply environment-specific settings
      utterance.pitch = voiceSettings.pitch;
      utterance.rate = voiceSettings.rate;
      utterance.volume = 1;

      // Set voice
      const selectedVoice = getVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      toast.error('Voice playback failed');
    }
  }, [voiceEnabled, voiceSettings, getVoice]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
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
