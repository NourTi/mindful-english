import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

const STT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`;
const KOKORO_TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kokoro-tts`;

// Kokoro voice mappings for different environments
export const environmentKokoroVoices: Record<string, { voice: string; speed: number }> = {
  gothic: { voice: 'bf_emma', speed: 0.9 },      // Deep female voice, slower
  cyber: { voice: 'am_adam', speed: 1.1 },       // Male voice, faster
  cosmic: { voice: 'af_sarah', speed: 0.85 },    // Ethereal female, slow
  zen: { voice: 'af_bella', speed: 0.8 },        // Calm female, soothing
  urban: { voice: 'am_michael', speed: 1.0 },    // Natural male
  forest: { voice: 'bf_emma', speed: 0.9 },      // Warm female
  arcade: { voice: 'am_adam', speed: 1.15 },     // Energetic male
  // Default environments from scenarios
  'corporate-boardroom': { voice: 'am_michael', speed: 1.0 },
  'international-airport': { voice: 'af_bella', speed: 1.0 },
  'university-campus': { voice: 'af_sarah', speed: 0.95 },
  'local-coffee-shop': { voice: 'bf_emma', speed: 1.0 },
  'medical-clinic': { voice: 'af_bella', speed: 0.9 },
};

// Fallback Web Speech API settings
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [useKokoro, setUseKokoro] = useState(true); // Try Kokoro first
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const kokoroSettings = environmentKokoroVoices[environment] || environmentKokoroVoices.urban || { voice: 'af_bella', speed: 1.0 };
  const voiceSettings = environmentVoiceSettings[environment] || environmentVoiceSettings.urban;

  // Load available voices for fallback
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

  // Get a good English voice for fallback
  const getVoice = useCallback(() => {
    const preferredVoices = voices.filter(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha'))
    );
    return preferredVoices[0] || voices.find(v => v.lang.startsWith('en')) || voices[0];
  }, [voices]);

  // Fallback to Web Speech API
  const speakWithWebSpeech = useCallback((cleanText: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    console.log('Speaking with Web Speech API (fallback):', cleanText.substring(0, 50));

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;
    utterance.pitch = voiceSettings.pitch;
    utterance.rate = voiceSettings.rate;
    utterance.volume = 1;

    const selectedVoice = getVoice();
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voiceSettings, getVoice]);

  // Primary TTS: Kokoro neural TTS
  const speakWithKokoro = useCallback(async (cleanText: string): Promise<boolean> => {
    try {
      console.log(`Speaking with Kokoro TTS: "${cleanText.substring(0, 50)}..." voice: ${kokoroSettings.voice}`);
      
      const response = await fetch(KOKORO_TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          text: cleanText,
          voice: kokoroSettings.voice,
          language: 'en-us',
          speed: kokoroSettings.speed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('Kokoro TTS failed:', response.status, errorData);
        return false;
      }

      const audioBlob = await response.blob();
      if (audioBlob.size < 100) {
        console.warn('Kokoro returned empty audio');
        return false;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      setIsSpeaking(true);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
      console.log('Kokoro audio playing successfully');
      return true;
    } catch (error) {
      console.warn('Kokoro TTS error:', error);
      return false;
    }
  }, [kokoroSettings]);

  // Main speak function - tries Kokoro first, falls back to Web Speech
  const speakText = useCallback(async (text: string) => {
    if (!voiceEnabled || !text.trim()) return;

    // Clean markdown from text
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

    // Try Kokoro first if enabled
    if (useKokoro) {
      const success = await speakWithKokoro(cleanText);
      if (success) return;
      
      // Kokoro failed, try Web Speech as fallback
      console.log('Falling back to Web Speech API');
    }

    // Use Web Speech API
    speakWithWebSpeech(cleanText);
  }, [voiceEnabled, useKokoro, speakWithKokoro, speakWithWebSpeech]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    // Stop Kokoro audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // Stop Web Speech
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
