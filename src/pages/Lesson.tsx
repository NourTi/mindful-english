import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLessonStore } from '@/stores/lessonStore';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { sampleLessons } from '@/data/sampleLessons';
import LessonPlayer from '@/components/lesson/LessonPlayer';

const Lesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { startLesson, currentLesson } = useLessonStore();
  const { calculateProfile, userName } = useAssessmentStore();

  useEffect(() => {
    // If no current lesson, find and start the requested lesson
    if (!currentLesson && lessonId) {
      const lesson = sampleLessons.find(l => l.id === lessonId);
      if (lesson) {
        const profile = calculateProfile();
        startLesson(lesson, profile);
      } else {
        navigate('/dashboard');
      }
    }
  }, [lessonId, currentLesson, navigate, startLesson, calculateProfile]);

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading lesson...</div>
      </div>
    );
  }

  return <LessonPlayer />;
};

export default Lesson;
