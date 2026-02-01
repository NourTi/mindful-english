import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Route, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPaths, getLessons, SeeLesson, SeePath } from '@/lib/seeLearningSystem';

interface PathWithLessons extends SeePath {
  lessonDetails: SeeLesson[];
}

const LearningPathsSection = () => {
  const navigate = useNavigate();
  const paths = getPaths();
  const allLessons = getLessons();

  // Map paths to include lesson details
  const pathsWithLessons: PathWithLessons[] = paths.map(path => ({
    ...path,
    lessonDetails: path.sequence
      .map(lessonId => allLessons.find(l => l.id === lessonId))
      .filter((lesson): lesson is SeeLesson => lesson !== undefined)
  }));

  const handleStartPath = (path: PathWithLessons) => {
    if (path.lessonDetails.length > 0) {
      const firstLessonId = path.lessonDetails[0].id;
      navigate(`/lesson/${firstLessonId}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/10 text-success border-success/30';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'hard':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (paths.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Route className="w-6 h-6 text-primary" />
          <h2 className="font-display text-2xl font-bold">Learning Paths</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/paths')}>
          View All Paths
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Structured journeys tailored to your learning profile
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pathsWithLessons.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card 
              variant="elevated" 
              className="h-full hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => handleStartPath(path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Route className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {path.forTraits.slice(0, 2).map(trait => (
                      <Badge key={trait} variant="outline" className="text-xs capitalize">
                        {trait.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                  {path.label}
                </CardTitle>
                <CardDescription className="text-sm">
                  {path.lessonDetails.length} lesson{path.lessonDetails.length !== 1 ? 's' : ''} in this path
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Lesson list */}
                <div className="space-y-2 mb-4">
                  {path.lessonDetails.map((lesson, lessonIndex) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {lessonIndex + 1}
                      </div>
                      <span className="flex-1 truncate text-muted-foreground">
                        {lesson.title}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}
                      >
                        {lesson.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* XP indicator */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Earn XP for each lesson</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="gap-1 group-hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartPath(path);
                    }}
                  >
                    Start
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LearningPathsSection;
