import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonById } from '@/lib/seeLearningSystem';
import { getLearnerProfile } from '@/lib/onboardingEngine';
import {
  createInitialNPCState,
  nextNPCState,
  isConversationComplete,
  type NPCState,
} from '@/lib/npcEngine';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft, Send, Loader2, Maximize2, Minimize2,
  MessageCircle, CheckCircle2, AlertCircle, Volume2, VolumeX, Mic, MicOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ImmersiveNPCScene = lazy(() => import('@/components/ImmersiveNPCScene'));

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lesson-chat`;
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface ConversationTurn {
  role: 'user' | 'npc';
  content: string;
  emotion?: string;
  phase?: string;
}

export default function VRSimulation() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const lesson = lessonId ? getLessonById(lessonId) : null;
  const profile = getLearnerProfile();

  const [npcState, setNpcState] = useState<NPCState>(() => createInitialNPCState(profile));
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is3D, setIs3D] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [completed, setCompleted] = useState(false);
  const lastSpokenRef = useRef('');

  // Voice chat integration (Kokoro TTS + Web Speech fallback)
  const {
    isSpeaking,
    voiceEnabled,
    isRecording,
    speakText,
    stopSpeaking,
    toggleVoice,
    startRecording,
    stopRecording,
  } = useVoiceChat(lesson?.environment || 'hotel');

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setIs3D(false);
    } catch {
      setIs3D(false);
    }
  }, []);

  // Initialize: get first NPC utterance
  const initConversation = useCallback(async () => {
    if (!lesson || initialized) return;
    setIsLoading(true);
    setInitialized(true);

    try {
      const firstState = await nextNPCState(
        createInitialNPCState(profile),
        '',
        profile,
        lesson.title,
        lesson.environment,
        CHAT_URL,
        API_KEY
      );
      setNpcState(firstState);
      setConversation([{
        role: 'npc',
        content: firstState.npcUtterance,
        emotion: firstState.npcEmotion,
        phase: firstState.phase,
      }]);
    } catch (err) {
      console.error('Init error:', err);
      toast.error('NPC is thinking, try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, [lesson, profile, initialized]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // Auto-speak NPC utterances when voice is enabled
  useEffect(() => {
    if (npcState.npcUtterance && npcState.npcUtterance !== lastSpokenRef.current) {
      lastSpokenRef.current = npcState.npcUtterance;
      if (voiceEnabled) {
        speakText(npcState.npcUtterance);
      }
    }
  }, [npcState.npcUtterance, voiceEnabled, speakText]);

  // Handle voice recording result
  const handleVoiceInput = useCallback(async () => {
    if (isRecording) {
      const transcript = await stopRecording();
      if (transcript && transcript.trim()) {
        setInput(transcript);
      }
    } else {
      stopSpeaking(); // Stop NPC speaking when user starts recording
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording, stopSpeaking]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !lesson || completed) return;
    const userMsg = input.trim();
    setInput('');

    setConversation(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const newState = await nextNPCState(
        npcState,
        userMsg,
        profile,
        lesson.title,
        lesson.environment,
        CHAT_URL,
        API_KEY
      );
      setNpcState(newState);
      setConversation(prev => [...prev, {
        role: 'npc',
        content: newState.npcUtterance,
        emotion: newState.npcEmotion,
        phase: newState.phase,
      }]);

      if (isConversationComplete(newState)) {
        setCompleted(true);
        toast.success('Conversation complete! Well done! 🎉');
      }
    } catch (err) {
      console.error('NPC error:', err);
      toast.error('NPC is thinking, try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">Lesson not found</p>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const phaseLabels: Record<string, string> = {
    greeting: '👋 Greeting',
    info_exchange: '💬 Information Exchange',
    challenge: '🎯 Challenge',
    closure: '🤝 Closure',
  };

  return (
    <div className={`bg-background flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'}`}>
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold truncate">{lesson.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">{lesson.environment}</Badge>
                <Badge variant="secondary" className="text-xs">
                  {phaseLabels[npcState.phase] || npcState.phase}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={voiceEnabled ? 'default' : 'ghost'}
              size="icon"
              onClick={toggleVoice}
              title={voiceEnabled ? 'Mute NPC voice' : 'Enable NPC voice'}
              className="h-8 w-8"
            >
              {voiceEnabled ? (
                <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIs3D(!is3D)}
              className="text-xs"
            >
              {is3D ? '2D' : '3D'}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8 w-8">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 grid md:grid-cols-[1fr_320px] min-h-0">
        {/* VR / NPC Scene */}
        <div className="relative min-h-[300px] md:min-h-0">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <ImmersiveNPCScene
              npcUtterance={npcState.npcUtterance}
              npcEmotion={npcState.npcEmotion}
              environment={lesson.environment}
              phase={npcState.phase}
              is3D={is3D}
            />
          </Suspense>

          {/* Phase progress */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {['greeting', 'info_exchange', 'challenge', 'closure'].map(p => (
              <div
                key={p}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  npcState.phase === p ? 'bg-primary' :
                  npcState.phaseHistory.includes(p as any) ? 'bg-primary/40' :
                  'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Conversation panel */}
        <div className="border-l border-border flex flex-col min-h-0">
          <div className="px-4 py-2 border-b border-border flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Conversation</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Turn {npcState.turnCount}
            </span>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {conversation.map((turn, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      turn.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}>
                      {turn.content}
                      {turn.emotion && turn.role === 'npc' && (
                        <span className="block text-xs opacity-60 mt-1 capitalize">
                          {turn.emotion} • {turn.phase}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              {completed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Conversation Complete!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Great practice session — {npcState.turnCount} turns
                  </p>
                  <Button size="sm" className="mt-3" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                  </Button>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          {!completed && (
            <div className="p-3 border-t border-border">
              <form
                onSubmit={e => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Button
                  type="button"
                  variant={isRecording ? 'destructive' : 'ghost'}
                  size="icon"
                  onClick={handleVoiceInput}
                  title={isRecording ? 'Stop recording' : 'Speak your reply'}
                  className="shrink-0"
                >
                  {isRecording ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isRecording ? 'Listening...' : 'Type your reply...'}
                  disabled={isLoading || isRecording}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
