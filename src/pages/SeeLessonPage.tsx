import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Target, Brain, Dumbbell, Headphones, Play, Pause, Square, Volume2, Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getLessonById, getExercisesByLesson } from '@/lib/seeLearningSystem';
import { getActiveTTSProvider, playAudioBuffer, preloadModel, onModelStateChange } from '@/lib/tts';
import TTSLoadingIndicator from '@/components/immergo/TTSLoadingIndicator';

type PlayState = 'idle' | 'loading' | 'playing';

const SeeLessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [modelState, setModelState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  if (!lessonId) return null;

  const lesson = getLessonById(lessonId);
  const exercises = getExercisesByLesson(lessonId);
  const isAudioMode = lesson?.mode === 'audio_exercises';

  // Preload TTS model for audio exercises
  useEffect(() => {
    if (isAudioMode) {
      preloadModel();
    }
    const unsub = onModelStateChange(setModelState);
    return unsub;
  }, [isAudioMode]);

  const stopAudio = useCallback(() => {
    try { sourceRef.current?.stop(); } catch {}
    sourceRef.current = null;
    setActiveItemId(null);
    setPlayState('idle');
  }, []);

  const speakText = useCallback(async (id: string, text: string) => {
    // If same item is playing, stop it
    if (activeItemId === id && playState === 'playing') {
      stopAudio();
      return;
    }
    // Stop any current playback
    stopAudio();

    setActiveItemId(id);
    setPlayState('loading');

    try {
      const provider = getActiveTTSProvider();
      const buffer = await provider.synthesize(text);
      if (!buffer) {
        setPlayState('idle');
        setActiveItemId(null);
        return;
      }

      setPlayState('playing');

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      sourceRef.current = source;

      source.onended = () => {
        setPlayState('idle');
        setActiveItemId(null);
        sourceRef.current = null;
      };

      source.start(0);
    } catch (err) {
      console.error('[SeeLessonPage] TTS error:', err);
      setPlayState('idle');
      setActiveItemId(null);
    }
  }, [activeItemId, playState, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopAudio(); };
  }, [stopAudio]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Lesson not found.</p>
            <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderPlayButton = (id: string, text: string, colorClass: string) => {
    const isActive = activeItemId === id;
    const isLoading = isActive && playState === 'loading';
    const isPlaying = isActive && playState === 'playing';

    return (
      <Button
        variant="ghost"
        size="icon"
        className={`shrink-0 w-10 h-10 rounded-full ${colorClass} transition-all`}
        onClick={(e) => { e.stopPropagation(); speakText(id, text); }}
        disabled={modelState === 'loading'}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isPlaying ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => { stopAudio(); navigate(-1); }}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{lesson.environment}</Badge>
              <Badge variant="outline">{lesson.mode.replace(/_/g, ' ')}</Badge>
            </div>
          </div>
          {isAudioMode && <TTSLoadingIndicator />}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Audio Mode Hero Banner */}
        {isAudioMode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden border-2 border-success/30">
              <div className="bg-gradient-to-r from-success via-success/80 to-success/60 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-bold mb-1">🎧 Audio Exercise Mode</h2>
                    <p className="text-sm text-white/80">
                      {modelState === 'loading'
                        ? 'Loading voice engine… this may take a moment on first use.'
                        : modelState === 'ready'
                        ? 'Voice engine ready — tap play on any section to hear it spoken aloud.'
                        : 'Tap play on any section to hear the content read aloud.'}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-white/70">
                    {modelState === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Psy Targets */}
        {lesson.psyTargets && lesson.psyTargets.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Psychological Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lesson.psyTargets.map(t => (
                    <Badge key={t} className="bg-primary/10 text-primary border-primary/20">{t.replace(/_/g, ' ')}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Learning Goals */}
        {lesson.learningGoals && lesson.learningGoals.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-success" /> Learning Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.learningGoals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground">
                      <span className="text-success mt-0.5">•</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Modules — with real TTS */}
        {lesson.modules && lesson.modules.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isAudioMode ? <Headphones className="w-5 h-5 text-success" /> : <BookOpen className="w-5 h-5 text-accent" />}
                  {isAudioMode ? 'Audio Modules' : 'Modules'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.modules.map((mod) => {
                  const spokenText = mod.instructions || mod.content || mod.title;
                  return (
                    <div key={mod.id} className={`p-4 rounded-xl border transition-all ${isAudioMode ? 'bg-success/5 border-success/20 hover:border-success/40' : 'bg-muted/30 border-border/50'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {isAudioMode && renderPlayButton(mod.id, spokenText, 'bg-success/10 hover:bg-success/20 text-success')}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full uppercase ${isAudioMode ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>
                              {mod.type.replace(/_/g, ' ')}
                            </span>
                            <h4 className="font-semibold text-foreground truncate">{mod.title}</h4>
                          </div>
                          {activeItemId === mod.id && playState === 'playing' && (
                            <motion.div
                              className="flex items-center gap-1 my-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {[...Array(12)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1 rounded-full bg-success"
                                  animate={{ height: [4, 12 + Math.random() * 8, 4] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                                />
                              ))}
                              <span className="text-xs text-success ml-2">Speaking…</span>
                            </motion.div>
                          )}
                          <p className="text-sm text-muted-foreground">{mod.instructions || mod.content}</p>
                        </div>
                        {isAudioMode && <Mic className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Exercises — with real TTS */}
        {exercises && exercises.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-warning" /> Exercises</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercises.map(ex => (
                  <div key={ex.id} className={`p-4 rounded-xl border transition-all ${isAudioMode ? 'bg-success/5 border-success/20 hover:border-success/40' : 'bg-muted/30 border-border/50'}`}>
                    <div className="flex items-center gap-3">
                      {isAudioMode && renderPlayButton(ex.id, ex.prompt, 'bg-warning/10 hover:bg-warning/20 text-warning')}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{ex.skill}</Badge>
                          <span className="text-xs text-muted-foreground">+{ex.xpReward} XP</span>
                        </div>
                        {activeItemId === ex.id && playState === 'playing' && (
                          <motion.div
                            className="flex items-center gap-1 my-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 rounded-full bg-warning"
                                animate={{ height: [4, 12 + Math.random() * 8, 4] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                              />
                            ))}
                            <span className="text-xs text-warning ml-2">Speaking…</span>
                          </motion.div>
                        )}
                        <p className="text-sm text-foreground">{ex.prompt}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Response: {ex.expectedResponseType} • Max attempts: {ex.maxAttempts}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SeeLessonPage;
