import { useState, useRef, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById } from "@/lib/seeLearningSystem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, Send, Loader2, Brain, BookOpen, 
  MessageCircle, Award, Glasses, X
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface EvaluationResult {
  cefr_level: string;
  score: number;
  strengths: string[];
  areas_to_improve: string[];
  vocabulary_used?: string[];
  grammar_feedback?: string;
  fluency_rating: string;
  xp_earned: number;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lesson-chat`;

export default function ChatLesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const lesson = lessonId ? getLessonById(lessonId) : null;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showVR, setShowVR] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lazy load VRStage
  const VRStage = showVR ? 
    import('@/components/vr/VRStage').then(mod => mod.default) : null;
  const [VRComponent, setVRComponent] = useState<React.ComponentType<{ lessonId: string; onClose: () => void }> | null>(null);

  useEffect(() => {
    if (showVR && lessonId) {
      import('@/components/vr/VRStage').then(mod => {
        setVRComponent(() => mod.default);
      });
    }
  }, [showVR, lessonId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Lesson not found</p>
            <Button onClick={() => navigate('/situations')}>
              Back to Situations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const streamChat = async (userMessage: string) => {
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          lesson: {
            id: lesson.id,
            title: lesson.title,
            environment: lesson.environment,
            modules: lesson.modules,
            difficulty: lesson.difficulty,
            psyProfileTarget: lesson.psyProfileTarget,
          }
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Rate limit exceeded. Please wait a moment.");
          return;
        }
        if (resp.status === 402) {
          toast.error("Credits needed. Please add funds to continue.");
          return;
        }
        throw new Error("Failed to start stream");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      // Add placeholder assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim()) continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    streamChat(input.trim());
    setInput("");
  };

  const handleEvaluate = async () => {
    if (messages.length < 4) {
      toast.info("Have a bit more conversation before evaluating!");
      return;
    }

    setIsEvaluating(true);
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages,
          lesson: {
            id: lesson.id,
            title: lesson.title,
            environment: lesson.environment,
            modules: lesson.modules,
            difficulty: lesson.difficulty,
            psyProfileTarget: lesson.psyProfileTarget,
          },
          evaluate: true,
        }),
      });

      if (!resp.ok) throw new Error("Evaluation failed");

      const data = await resp.json();
      setEvaluation(data.evaluation);
      
      // Log to history (would be saved to DB in production)
      console.log("Learning History Entry:", {
        lessonId: lesson.id,
        completedAt: new Date().toISOString(),
        evaluation: data.evaluation,
        messageCount: messages.length,
      });

      toast.success(`+${data.evaluation.xp_earned} XP earned!`);
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error("Failed to evaluate conversation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const moduleTypeIcons: Record<string, React.ReactNode> = {
    psy_prep: <Brain className="h-4 w-4" />,
    dialogue: <MessageCircle className="h-4 w-4" />,
    reflection: <BookOpen className="h-4 w-4" />,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* VR Modal */}
      <AnimatePresence>
        {showVR && VRComponent && lessonId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <Suspense fallback={
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              <VRComponent lessonId={lessonId} onClose={() => setShowVR(false)} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/situations')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-display font-semibold">{lesson.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="capitalize">{lesson.environment}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs">{lesson.difficulty}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowVR(true)}
              className="gap-2"
            >
              <Glasses className="h-4 w-4" />
              Enter VR
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleEvaluate}
              disabled={isEvaluating || messages.length < 4}
              className="gap-2"
            >
              {isEvaluating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Award className="h-4 w-4" />
              )}
              Evaluate
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container py-4 grid md:grid-cols-[300px_1fr] gap-4">
        {/* Sidebar - Lesson Modules */}
        <div className="hidden md:block">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lesson Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lesson.modules.map((mod, idx) => (
                <div 
                  key={mod.id}
                  className="p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded bg-primary/10 text-primary">
                      {moduleTypeIcons[mod.type] || <BookOpen className="h-4 w-4" />}
                    </span>
                    <span className="text-sm font-medium">{mod.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{mod.content}</p>
                </div>
              ))}

              {/* Tags */}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Results */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="mt-4 border-success/50 bg-success/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="h-5 w-5 text-success" />
                        Evaluation
                      </CardTitle>
                      <Badge className="bg-primary">{evaluation.cefr_level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Score</span>
                      <span className="font-bold text-lg">{evaluation.score}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>XP Earned</span>
                      <span className="font-bold text-success">+{evaluation.xp_earned}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fluency</span>
                      <Badge variant="outline" className="capitalize">
                        {evaluation.fluency_rating}
                      </Badge>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="font-medium mb-1">Strengths:</p>
                      <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                        {evaluation.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium mb-1">To Improve:</p>
                      <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                        {evaluation.areas_to_improve.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Area */}
        <Card className="flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start Your Conversation</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  You're in a {lesson.environment} scenario. Say hello to begin practicing 
                  English in this realistic situation.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => streamChat("Hello!")}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start with 'Hello!'"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[44px] max-h-32 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
