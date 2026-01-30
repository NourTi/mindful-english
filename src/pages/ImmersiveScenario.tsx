import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Send, ArrowLeft, Mic, MicOff, Volume2, VolumeX, 
  Sparkles, MessageSquare, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Environment configurations with themes
const environments: Record<string, {
  name: string;
  tagline: string;
  gradient: string;
  bgImage: string;
  textColor: string;
  accentColor: string;
  openingPrompt: string;
}> = {
  gothic: {
    name: 'Gothic Sanctuary',
    tagline: 'Deep contemplative learning',
    gradient: 'from-purple-950/90 via-slate-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop',
    textColor: 'text-purple-100',
    accentColor: 'bg-purple-600',
    openingPrompt: 'Begin a mysterious conversation in an ancient library. Set the scene and ask me to describe what I see.'
  },
  cyber: {
    name: 'Cyber Matrix',
    tagline: 'Neural network training',
    gradient: 'from-cyan-950/90 via-slate-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&auto=format&fit=crop',
    textColor: 'text-cyan-100',
    accentColor: 'bg-cyan-500',
    openingPrompt: 'Initialize a futuristic scenario. I am jacking into the system. Guide me through a digital training simulation.'
  },
  cosmic: {
    name: 'Cosmic Voyage',
    tagline: 'Exploring infinite horizons',
    gradient: 'from-indigo-950/90 via-purple-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&auto=format&fit=crop',
    textColor: 'text-indigo-100',
    accentColor: 'bg-indigo-500',
    openingPrompt: 'I am aboard a starship. Begin an adventure where we discover something amazing in deep space.'
  },
  zen: {
    name: 'Zen Garden',
    tagline: 'Mindful practice',
    gradient: 'from-green-950/90 via-emerald-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1503149779833-1de50ced91f4?w=1920&auto=format&fit=crop',
    textColor: 'text-green-100',
    accentColor: 'bg-green-500',
    openingPrompt: 'Welcome me to a peaceful garden and guide me through a calming English conversation about nature and mindfulness.'
  },
  urban: {
    name: 'Urban Pulse',
    tagline: 'Street-smart conversation',
    gradient: 'from-amber-950/90 via-orange-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&auto=format&fit=crop',
    textColor: 'text-amber-100',
    accentColor: 'bg-amber-500',
    openingPrompt: 'I just walked into a trendy city café. Start a natural social conversation with me as a friendly local.'
  },
  forest: {
    name: 'Forest of Wisdom',
    tagline: 'Natural growth',
    gradient: 'from-emerald-950/90 via-green-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&auto=format&fit=crop',
    textColor: 'text-emerald-100',
    accentColor: 'bg-emerald-500',
    openingPrompt: 'I have wandered into an ancient forest. As a wise Forest Spirit, greet me and begin a conversation about my journey.'
  },
  arcade: {
    name: 'Neon Arcade',
    tagline: 'Gamified learning',
    gradient: 'from-pink-950/90 via-purple-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=1920&auto=format&fit=crop',
    textColor: 'text-pink-100',
    accentColor: 'bg-pink-500',
    openingPrompt: 'I am PLAYER_ONE entering the arcade. Start an exciting game-like English challenge with points and achievements!'
  }
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scenario-chat`;

const ImmersiveScenario = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const envKey = searchParams.get('env') || 'urban';
  const environment = environments[envKey] || environments.urban;
  
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice chat hook
  const {
    isRecording,
    isSpeaking,
    voiceEnabled,
    startRecording,
    stopRecording,
    speakText,
    stopSpeaking,
    toggleVoice,
  } = useVoiceChat(envKey);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Initialize conversation with AI
  const initializeConversation = useCallback(async () => {
    setIsInitializing(true);
    
    try {
      const userProfile = {
        learningStyle: profile?.learning_style || 'visual',
        anxietyLevel: profile?.anxiety_level || 3,
        vocabularyLevel: profile?.vocabulary_level || 'beginner',
        semanticContext: profile?.semantic_context || 'daily_life',
        name: profile?.name || 'Learner'
      };

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: environment.openingPrompt }],
          environment: envKey,
          userProfile
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Rate limit reached. Please wait a moment.");
          return;
        }
        if (resp.status === 402) {
          toast.error("AI usage limit reached.");
          return;
        }
        throw new Error("Failed to initialize conversation");
      }

      let assistantContent = "";
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let textBuffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages([{
                id: 'initial',
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date()
              }]);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize:', error);
      toast.error("Failed to start scenario. Please try again.");
      // Fallback message
      setMessages([{
        id: 'initial',
        role: 'assistant',
        content: `*Welcome to the ${environment.name}...* 

Greetings, traveler. I sense you seek to expand your understanding of the English language. 

Tell me, what brings you to this place? What would you like to explore together?`,
        timestamp: new Date()
      }]);
    } finally {
      setIsInitializing(false);
    }
  }, [environment, envKey, profile]);

  // Initialize on mount
  useEffect(() => {
    if (!profileLoading && !authLoading && user) {
      initializeConversation();
    }
  }, [profileLoading, authLoading, user, initializeConversation]);

  // Send message (text or voice)
  const sendMessage = async (textOverride?: string) => {
    const messageText = textOverride || inputValue.trim();
    if (!messageText || isLoading) return;

    // Stop any current speech
    stopSpeaking();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    let fullAssistantResponse = '';

    try {
      const userProfile = {
        learningStyle: profile?.learning_style || 'visual',
        anxietyLevel: profile?.anxiety_level || 3,
        vocabularyLevel: profile?.vocabulary_level || 'beginner',
        semanticContext: profile?.semantic_context || 'daily_life',
        name: profile?.name || 'Learner'
      };

      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: conversationHistory,
          environment: envKey,
          userProfile
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Rate limit reached. Please wait a moment.");
          return;
        }
        if (resp.status === 402) {
          toast.error("AI usage limit reached.");
          return;
        }
        throw new Error("Failed to send message");
      }

      let assistantContent = "";
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      const assistantId = `assistant-${Date.now()}`;
      let textBuffer = "";

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              fullAssistantResponse = assistantContent;
              setMessages(prev => 
                prev.map(m => 
                  m.id === assistantId 
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Speak the complete response
      if (fullAssistantResponse && voiceEnabled) {
        speakText(fullAssistantResponse);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice recording
  const handleVoiceInput = async () => {
    if (isRecording) {
      const transcription = await stopRecording();
      if (transcription && transcription.trim()) {
        setInputValue(transcription);
        // Auto-send after transcription
        sendMessage(transcription);
      }
    } else {
      startRecording();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${environment.bgImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${environment.gradient}`} />
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${environment.accentColor} opacity-40`}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10
            }}
            animate={{ 
              y: -10,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
            
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${environment.accentColor}/20`}>
                <Sparkles className={`w-5 h-5 ${environment.textColor}`} />
              </div>
              <div className="text-center">
                <span className={`font-display font-semibold ${environment.textColor}`}>
                  {environment.name}
                </span>
                <p className="text-xs text-white/60">{environment.tagline}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={initializeConversation}
              disabled={isInitializing}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
          {isInitializing ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className={`w-16 h-16 ${environment.textColor}`} />
              </motion.div>
              <p className={`${environment.textColor} text-center`}>
                Entering {environment.name}...
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl backdrop-blur-sm ${
                      msg.role === 'user' 
                        ? `${environment.accentColor} text-white rounded-br-sm` 
                        : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/10'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                          <MessageSquare className="w-3 h-3" />
                          <span>{environment.name} Guide</span>
                        </div>
                      )}
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-black/40 backdrop-blur-lg border-t border-white/10">
          <div className="max-w-4xl mx-auto p-4">
            {/* Voice Controls */}
            <div className="flex justify-center gap-2 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className={`text-white/70 hover:text-white hover:bg-white/10 ${!voiceEnabled ? 'opacity-50' : ''}`}
              >
                {voiceEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 mr-1" />
                    <span className="text-xs">Voice On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 mr-1" />
                    <span className="text-xs">Voice Off</span>
                  </>
                )}
              </Button>
              
              {isSpeaking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopSpeaking}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                  </motion.div>
                  <span className="text-xs">Stop</span>
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {/* Voice Input Button */}
              <Button
                onClick={handleVoiceInput}
                disabled={isLoading || isInitializing || isSpeaking}
                variant="ghost"
                className={`${isRecording 
                  ? 'bg-red-500/80 text-white animate-pulse' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isRecording ? "Listening..." : "Type or tap mic to speak..."}
                disabled={isLoading || isInitializing || isRecording}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              />
              
              <Button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading || isInitializing}
                className={`${environment.accentColor} hover:opacity-90`}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            
            <p className="text-xs text-white/40 text-center mt-2">
              {isRecording 
                ? "Tap mic again when done speaking" 
                : "Speak or type naturally — AI reads responses aloud"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveScenario;
