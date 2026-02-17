import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Target, Brain, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLessonById, getExercisesByLesson } from '@/lib/seeLearningSystem';

const SeeLessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  if (!lessonId) return null;

  const lesson = getLessonById(lessonId);
  const exercises = getExercisesByLesson(lessonId);

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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{lesson.environment}</Badge>
              <Badge variant="outline">{lesson.mode.replace(/_/g, ' ')}</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Psy Targets */}
        {lesson.psyTargets && lesson.psyTargets.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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

        {/* Modules */}
        {lesson.modules && lesson.modules.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-accent" /> Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.modules.map((mod, i) => (
                  <div key={mod.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase">
                        {mod.type.replace(/_/g, ' ')}
                      </span>
                      <h4 className="font-semibold text-foreground">{mod.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{mod.instructions || mod.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Exercises */}
        {exercises && exercises.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-warning" /> Exercises</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercises.map(ex => (
                  <div key={ex.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{ex.skill}</Badge>
                      <span className="text-xs text-muted-foreground">+{ex.xpReward} XP</span>
                    </div>
                    <p className="text-sm text-foreground">{ex.prompt}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Response: {ex.expectedResponseType} • Max attempts: {ex.maxAttempts}
                    </p>
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
