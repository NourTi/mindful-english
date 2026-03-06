import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Square, Volume2, VolumeX, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AudioVisualizer } from '@/components/immergo/AudioVisualizer';
import { LiveTranscript, type TranscriptEntry } from '@/components/immergo/LiveTranscript';
import { TTSLoadingIndicator } from '@/components/immergo/TTSLoadingIndicator';
import { VoicePicker } from '@/components/immergo/VoicePicker';
import { StarterPrompts } from '@/components/immergo/StarterPrompts';
import { 
  type ImmergoMission, 
  type LearningMode,
  supportedLanguages,
  type SessionResult,
} from '@/data/immergoMissions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getVideoForMissionContext } from '@/lib/environmentVideos';
import VideoBackground from '@/components/VideoBackground';
import { suggestVoiceForMission, preloadModel } from '@/lib/tts';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/immergo-chat`;

interface SessionState {
  mission: ImmergoMission;
  nativeLang: string;
  targetLang: string;
  mode: LearningMode;
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const ImmergoChat = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMissionStarted, setIsMissionStarted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState<SessionResult | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>();
  const [selectedVoice, setSelectedVoice] = useState('af_bella');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load session from sessionStorage
  useEffect(() => {
    const sessionData = sessionStorage.getItem('immergo_session');
    if (!sessionData) {
      navigate('/immergo');
      return;
    }
    try {
      const parsed = JSON.parse(sessionData);
      setSession(parsed);
      // Set default voice based on mission context
      const suggested = suggestVoiceForMission(parsed.mission.target_role);
      setSelectedVoice(suggested);
      // Preload TTS model early
      preloadModel();
    } catch {
      navigate('/immergo');
    }
  }, [navigate]);

  // Get language display
  const getLangName = useCallback((code: string) => {
    const lang = supportedLanguages.find(l => l.code === code);
    return lang?.name || code;
  }, []);

  // TTS via kokoro-js (client-side) with Web Speech fallback
  const speakText = useCallback(async (text: string) => {
    if (!voiceEnabled || !text.trim()) return;

    const cleanText = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    if (!cleanText) return;
    setIsAISpeaking(true);

    // Try kokoro-js with selected voice
    try {
      const { getActiveTTSProvider, playAudioBuffer } = await import('@/lib/tts');
      const provider = getActiveTTSProvider();
      const buffer = await provider.synthesize(cleanText, selectedVoice);
      if (buffer) {
        await playAudioBuffer(buffer);
        setIsAISpeaking(false);
        return;
      }
    } catch (e) {
      console.warn('kokoro-js TTS failed:', e);
    }

    // Fallback: Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft'))) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.onend = () => setIsAISpeaking(false);
      utterance.onerror = () => setIsAISpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsAISpeaking(false);
    }
  }, [voiceEnabled, selectedVoice]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsAISpeaking(false);
  }, []);

  // Stream chat response from AI
  const streamChat = useCallback(async (userMessage: string) => {
    if (!session) return;

    const userEntry: TranscriptEntry = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setTranscript(prev => [...prev, userEntry]);

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();
    let assistantContent = '';

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          mission: {
            title: session.mission.title,
            desc: session.mission.desc,
            target_role: session.mission.target_role,
          },
          targetLanguage: getLangName(session.targetLang),
          nativeLanguage: getLangName(session.nativeLang),
          mode: session.mode,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantEntryId = crypto.randomUUID();

      setTranscript(prev => [...prev, {
        id: assistantEntryId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            const toolCalls = parsed.choices?.[0]?.delta?.tool_calls;
            
            if (content) {
              assistantContent += content;
              setTranscript(prev => prev.map(entry => 
                entry.id === assistantEntryId 
                  ? { ...entry, content: assistantContent }
                  : entry
              ));
            }

            if (toolCalls) {
              for (const call of toolCalls) {
                if (call.function?.name === 'complete_mission') {
                  try {
                    const args = JSON.parse(call.function.arguments || '{}');
                    const levels = { 1: 'Tiro', 2: 'Proficiens', 3: 'Peritus' } as const;
                    setResult({
                      score: args.score || 2,
                      feedback: args.feedback_pointers || [],
                      level: levels[args.score as 1 | 2 | 3] || 'Proficiens',
                    });
                  } catch (e) {
                    console.error('Failed to parse tool call:', e);
                  }
                }
              }
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);

      if (assistantContent) {
        speakText(assistantContent);
      }

    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Chat error:', error);
        toast.error('Failed to get AI response');
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [session, messages, getLangName, speakText]);

  // ── Transcribe audio blob via ElevenLabs, returns text or null ──
  const transcribeWithElevenLabs = useCallback(async (audioBlob: Blob): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.warn('[STT] ElevenLabs returned', response.status);
        return null;
      }

      const data = await response.json();
      return data.text?.trim() || null;
    } catch (err) {
      console.warn('[STT] ElevenLabs call failed:', err);
      return null;
    }
  }, []);

  // ── Browser-native SpeechRecognition as a reliable fallback ──
  const speechRecRef = useRef<any>(null);

  const startBrowserSTT = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        resolve(null);
        return;
      }

      const recognition = new SpeechRecognition();
      speechRecRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      let resolved = false;
      const finish = (text: string | null) => {
        if (!resolved) { resolved = true; resolve(text); }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        finish(transcript.trim() || null);
      };
      recognition.onerror = (event: any) => {
        console.warn('[STT] Browser SpeechRecognition error:', event.error);
        finish(null);
      };
      recognition.onend = () => finish(null);

      recognition.start();
    });
  }, []);

  const stopBrowserSTT = useCallback(() => {
    if (speechRecRef.current) {
      try { speechRecRef.current.stop(); } catch { /* already stopped */ }
      speechRecRef.current = null;
    }
  }, []);

  // ── Dual-track recording: MediaRecorder + Browser STT in parallel ──
  const browserSttPromiseRef = useRef<Promise<string | null> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // CRITICAL: getUserMedia called directly in click handler
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      setAudioStream(stream);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      // Start browser STT in parallel as a backup
      browserSttPromiseRef.current = startBrowserSTT();

      console.log('[Recording] Started with mimeType:', mimeType);
    } catch (error) {
      console.error('[Recording] Microphone error:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow mic access in your browser settings.');
      } else {
        toast.error('Failed to start recording. Please try again.');
      }
    }
  }, [startBrowserSTT]);

  // Stop recording and transcribe (ElevenLabs first, browser STT fallback)
  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      setIsRecording(false);
      stopBrowserSTT();
      return;
    }

    return new Promise<void>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        setAudioStream(undefined);

        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        console.log('[Recording] Stopped, blob size:', audioBlob.size);

        if (audioBlob.size < 500) {
          toast.info('Recording too short. Hold the mic button longer.');
          setIsRecording(false);
          resolve();
          return;
        }

        // Strategy: try ElevenLabs first, fall back to browser STT result
        let transcription: string | null = null;

        // 1. Try ElevenLabs cloud STT
        transcription = await transcribeWithElevenLabs(audioBlob);

        // 2. If that failed, use browser STT result (was running in parallel)
        if (!transcription && browserSttPromiseRef.current) {
          console.log('[STT] ElevenLabs unavailable, using browser fallback');
          transcription = await browserSttPromiseRef.current;
        }
        browserSttPromiseRef.current = null;

        if (transcription) {
          console.log('[STT] Transcribed:', transcription.substring(0, 60));
          streamChat(transcription);
        } else {
          toast.info('No speech detected. Try speaking louder or use the text input.');
        }

        setIsRecording(false);
        resolve();
      };

      stopBrowserSTT();
      mediaRecorder.stop();
    });
  }, [streamChat, transcribeWithElevenLabs, stopBrowserSTT]);

  // Start mission
  const handleStartMission = useCallback(async () => {
    setIsMissionStarted(true);
    if (session?.mode === 'immersive') {
      await streamChat("Hello, I'm here to " + session.mission.desc.toLowerCase());
    }
  }, [session, streamChat]);

  // Handle mic button
  const handleMicClick = useCallback(async () => {
    if (!isMissionStarted) {
      handleStartMission();
      return;
    }

    if (isRecording) {
      await stopRecording();
    } else {
      stopSpeaking();
      await startRecording();
    }
  }, [isMissionStarted, isRecording, handleStartMission, stopRecording, startRecording, stopSpeaking]);

  // End session
  const handleEndSession = useCallback(() => {
    stopSpeaking();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (!result) {
      setResult({ incomplete: true } as SessionResult);
    }
  }, [stopSpeaking, result]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show result screen
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-6">
            {result.incomplete ? (
              <>
                <div className="text-6xl">🚪</div>
                <h2 className="text-2xl font-bold">Session Ended</h2>
                <p className="text-muted-foreground">
                  You left early. Come back when you're ready!
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl">
                  {result.score === 3 ? '🏆' : result.score === 2 ? '⭐' : '📚'}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    Performance Level
                  </div>
                  <h2 className="text-3xl font-bold text-primary">{result.level}</h2>
                </div>
                
                {result.feedback.length > 0 && (
                  <div className="text-left space-y-2">
                    <div className="text-sm font-semibold">Feedback:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {result.feedback.map((point, i) => (
                        <li key={i} className="flex gap-2">
                          <span>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/immergo')}
              >
                New Mission
              </Button>
              <Button 
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleEndSession}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </Button>
          
          <div className="text-center flex-1">
            <div className="font-semibold text-sm">{session.mission.target_role}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 justify-center">
              <span>{supportedLanguages.find(l => l.code === session.nativeLang)?.flag}</span>
              <span>→</span>
              <span className="text-primary font-medium">
                {supportedLanguages.find(l => l.code === session.targetLang)?.flag} {getLangName(session.targetLang)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <TTSLoadingIndicator />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Voice picker row */}
        {voiceEnabled && (
          <div className="max-w-2xl mx-auto px-4 pb-2 flex justify-end">
            <VoicePicker selectedVoiceId={selectedVoice} onSelect={setSelectedVoice} />
          </div>
        )}
      </header>

      {/* Mission Info */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6 text-center">
        <h2 className="text-xl font-bold">{session.mission.title}</h2>
        <p className="text-muted-foreground text-sm mt-1">{session.mission.desc}</p>
        
        {session.mode === 'teacher' && (
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary">
            🧑‍🏫 Ask for translations & explanations anytime
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        {/* AI Visualizer */}
        <div className="h-24 rounded-xl bg-card/30 border border-border/50 overflow-hidden">
          <AudioVisualizer type="ai" isActive={isAISpeaking || isStreaming} />
        </div>

        {/* Transcript (only in teacher mode) */}
        {session.mode === 'teacher' && (
          <div className="flex-1 min-h-[200px] max-h-[300px]">
            <LiveTranscript entries={transcript} isStreaming={isStreaming} />
          </div>
        )}

        {/* User Visualizer */}
        <div className="h-24 rounded-xl bg-card/30 border border-border/50 overflow-hidden">
          <AudioVisualizer type="user" isActive={isRecording} audioStream={audioStream} />
        </div>
      </main>

      {/* CTA Button */}
      <div className="pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Arabic starter prompts for novice users - show before mission starts or when no messages sent */}
          {isMissionStarted && messages.length === 0 && (
            <div className="mb-4">
              <StarterPrompts
                missionTitle={session.mission.title}
                missionDesc={session.mission.desc}
                targetRole={session.mission.target_role}
                onSelect={(text) => streamChat(text)}
                disabled={isStreaming}
              />
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMicClick}
            disabled={isStreaming}
            className={cn(
              "w-full max-w-xs mx-auto py-6 px-8 rounded-2xl font-bold text-lg",
              "flex flex-col items-center gap-2 transition-all",
              "shadow-lg",
              isRecording 
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground hover:shadow-xl"
            )}
          >
            {isRecording ? (
              <>
                <Square className="w-6 h-6" />
                <span>Stop Recording</span>
              </>
            ) : isMissionStarted ? (
              <>
                <Mic className="w-6 h-6" />
                <span>Hold to Speak</span>
              </>
            ) : (
              <>
                <span className="text-xl">🎬</span>
                <span>Start Mission</span>
                <span className="text-xs opacity-80 font-normal">You start the conversation!</span>
              </>
            )}
          </motion.button>

          {isMissionStarted && (
            <>
              <div className="flex gap-2 mt-4 max-w-xs mx-auto">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={isStreaming ? 'AI is responding…' : 'Or type here…'}
                  disabled={isStreaming || isRecording}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && textInput.trim() && !isStreaming) {
                      streamChat(textInput.trim());
                      setTextInput('');
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  disabled={!textInput.trim() || isStreaming}
                  onClick={() => {
                    if (textInput.trim()) {
                      streamChat(textInput.trim());
                      setTextInput('');
                    }
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {isStreaming ? 'AI is responding...' : 'Tap mic to speak or type below'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImmergoChat;
