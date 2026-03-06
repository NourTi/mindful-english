import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, X, Check, Clock, 
  Sparkles, Brain, ChevronLeft, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLessonStore } from '@/stores/lessonStore';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { LearningStyle, AssessmentQuestion } from '@/types/learning';
import VisualContent from './VisualContent';
import AuditoryContent from './AuditoryContent';
import ReadingContent from './ReadingContent';
import KinestheticContent from './KinestheticContent';
import BreathingExercise from './BreathingExercise';
import QuizQuestion from './QuizQuestion';
import GameActivity from './GameActivity';
import VideoBackground from '@/components/VideoBackground';
import { getEnvironmentVideo, getVideoForMissionContext } from '@/lib/environmentVideos';

const LessonPlayer = () => {
  const navigate = useNavigate();
  const { calculateProfile } = useAssessmentStore();
  const {
    currentLesson,
    chunks,
    progress,
    emotionalFeedback,
    isInBreathingExercise,
    nextChunk,
    previousChunk,
    markChunkComplete,
    completeBreathingExercise,
    completeLesson,
    resetLesson,
  } = useLessonStore();

  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const profile = calculateProfile();

  if (!currentLesson || !progress) {
    return null;
  }

  const currentChunk = chunks[progress.currentChunkIndex];
  const progressPercent = ((progress.currentChunkIndex + 1) / chunks.length) * 100;

  const handleNext = () => {
    markChunkComplete();
    
    if (currentChunk.type === 'practice') {
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
    } else if (progress.currentChunkIndex >= chunks.length - 1) {
      completeLesson();
      navigate('/dashboard');
    } else {
      nextChunk();
    }
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    if (progress.currentChunkIndex < chunks.length - 1) {
      nextChunk();
    } else {
      completeLesson();
      navigate('/dashboard');
    }
  };

  const handleExit = () => {
    resetLesson();
    navigate('/dashboard');
  };

  const renderContent = () => {
    const style = profile.learningStyle as LearningStyle;
    const contentVariant = currentLesson.contentVariants[style];

    if (currentChunk.type === 'introduction') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">{currentLesson.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {currentLesson.description}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {currentLesson.estimatedMinutes} min
            </span>
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {currentLesson.difficulty}
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              +{50 + currentLesson.assessmentQuestions.length * 5} XP
            </span>
          </div>
        </motion.div>
      );
    }

    if (currentChunk.type === 'game') {
      // Derive a topic string from the lesson
      const topic = currentLesson.semanticAnchors
        .map(a => a.newWord)
        .join(', ') || currentLesson.title;
      return (
        <GameActivity
          lessonTitle={currentLesson.title}
          lessonTopic={topic}
          difficulty={currentLesson.difficulty}
        />
      );
    }

    if (currentChunk.type === 'review') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Lesson Complete!</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Great work! You've completed this lesson. Here's your summary:
          </p>
          <Card className="max-w-sm mx-auto mb-8">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Correct Answers</span>
                <span className="font-semibold">{progress.correctAnswers}/{progress.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">XP Earned</span>
                <span className="font-semibold text-accent">{progress.xpEarned} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Spent</span>
                <span className="font-semibold">
                  {Math.round((new Date().getTime() - new Date(progress.startedAt).getTime()) / 60000)} min
                </span>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 flex-1"
              onClick={() => { resetLesson(); navigate('/lessons'); }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lessons
            </Button>
            <Button
              variant="hero"
              size="lg"
              className="gap-2 flex-1"
              onClick={() => { completeLesson(); navigate('/dashboard'); }}
            >
              <Sparkles className="w-4 h-4" />
              Finish & Earn XP
            </Button>
          </div>
        </motion.div>
      );
    }

    // Render style-specific content
    switch (style) {
      case 'visual':
        return (
          <VisualContent
            content={currentLesson.contentVariants.visual}
            semanticAnchors={currentLesson.semanticAnchors}
            chunkIndex={progress.currentChunkIndex}
          />
        );
      case 'auditory':
        return (
          <AuditoryContent
            content={currentLesson.contentVariants.auditory}
            semanticAnchors={currentLesson.semanticAnchors}
            chunkIndex={progress.currentChunkIndex}
          />
        );
      case 'reading':
        return (
          <ReadingContent
            content={currentLesson.contentVariants.reading}
            semanticAnchors={currentLesson.semanticAnchors}
            chunkIndex={progress.currentChunkIndex}
          />
        );
      case 'kinesthetic':
        return (
          <KinestheticContent
            content={currentLesson.contentVariants.kinesthetic}
            semanticAnchors={currentLesson.semanticAnchors}
            chunkIndex={progress.currentChunkIndex}
          />
        );
    }
  };

  return (
    <>
      {/* Breathing Exercise Overlay */}
      <AnimatePresence>
        {isInBreathingExercise && (
          <BreathingExercise onComplete={completeBreathingExercise} />
        )}
      </AnimatePresence>

      {/* Quiz Overlay */}
      <AnimatePresence>
        {showQuiz && (
          <QuizQuestion
            questions={currentLesson.assessmentQuestions}
            currentIndex={currentQuestionIndex}
            onNext={() => {
              if (currentQuestionIndex < currentLesson.assessmentQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
              } else {
                handleQuizComplete();
              }
            }}
            onComplete={handleQuizComplete}
          />
        )}
      </AnimatePresence>

      {/* Environment video background for immersive lessons */}
      {(() => {
        const envSlug = (currentLesson as any).environment || '';
        const bgVideo = getEnvironmentVideo(envSlug) || getVideoForMissionContext(currentLesson.title + ' ' + currentLesson.description);
        return bgVideo ? <VideoBackground src={bgVideo} overlayOpacity={0.75} /> : null;
      })()}

      <div className="min-h-screen flex flex-col relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <Button variant="ghost" size="sm" onClick={handleExit} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Exit
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-semibold">{progress.xpEarned} XP</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={progressPercent} size="sm" className="flex-1" indicatorVariant="cognitive" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {progress.currentChunkIndex + 1} / {chunks.length}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={progress.currentChunkIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          {/* Emotional Feedback Toast */}
          <AnimatePresence>
            {emotionalFeedback && !isInBreathingExercise && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30"
              >
                <Card className="p-4 bg-secondary border-secondary shadow-lg">
                  <p className="text-center text-foreground">{emotionalFeedback.message}</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Navigation Footer */}
        <footer className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousChunk}
              disabled={progress.currentChunkIndex === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex gap-1">
              {chunks.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === progress.currentChunkIndex
                      ? 'bg-primary'
                      : i < progress.currentChunkIndex
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} className="gap-2">
              {progress.currentChunkIndex >= chunks.length - 1 ? 'Complete' : 'Continue'}
              {progress.currentChunkIndex < chunks.length - 1 && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LessonPlayer;
