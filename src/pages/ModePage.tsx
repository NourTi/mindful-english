import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getModes, getLessonsByMode } from '@/lib/seeLearningSystem';
import type { SeeLesson } from '@/lib/seeLearningSystem';

const ModePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null;

  const modes = getModes();
  const mode = modes.find(m => m.id === id);
  const lessons = getLessonsByMode(id);

  if (!mode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Mode not found.</p>
            <Button className="mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{mode.label}</h1>
            <p className="text-sm text-muted-foreground">{mode.description}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!lessons || lessons.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">Content coming soon</h3>
                <p className="text-muted-foreground">We're working on adding lessons for this mode. Check back later!</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {lessons.map((lesson: SeeLesson, index: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="group cursor-pointer border-border hover:border-primary/50 transition-all h-full"
                  onClick={() => navigate(`/lesson/${lesson.id}`)}
                >
                  <CardContent className="p-5 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{lesson.environment}</Badge>
                      <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-auto pt-3">
                      {(lesson.psyTargets || []).slice(0, 3).map(t => (
                        <Badge key={t} variant="outline" className="text-xs">{t.replace(/_/g, ' ')}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModePage;
