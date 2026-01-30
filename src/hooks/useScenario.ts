import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Scenario, ScenarioProgress } from '@/types/scenario';
import { useAuth } from './useAuth';

const defaultProgress: ScenarioProgress = {
  currentStep: 0,
  emotionScore: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  selectedChoices: [],
  completed: false,
};

export const useScenario = (environmentSlug: string | null) => {
  const { user } = useAuth();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ScenarioProgress>(defaultProgress);
  const [progressId, setProgressId] = useState<string | null>(null);

  // Fetch scenario and existing progress
  useEffect(() => {
    if (!environmentSlug) {
      setLoading(false);
      return;
    }

    const fetchScenarioAndProgress = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch scenario
        const { data: scenarioData, error: fetchError } = await supabase
          .from('scenarios')
          .select('*')
          .eq('environment_slug', environmentSlug)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!scenarioData) {
          setError('Scenario not found');
          setLoading(false);
          return;
        }

        const parsedScenario: Scenario = {
          ...scenarioData,
          visual_context: typeof scenarioData.visual_context === 'string' 
            ? JSON.parse(scenarioData.visual_context) 
            : scenarioData.visual_context,
          dialogue_data: typeof scenarioData.dialogue_data === 'string' 
            ? JSON.parse(scenarioData.dialogue_data) 
            : scenarioData.dialogue_data,
        };
        setScenario(parsedScenario);

        // Fetch existing progress if user is logged in
        if (user) {
          const { data: progressData } = await supabase
            .from('scenario_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('scenario_id', scenarioData.id)
            .maybeSingle();

          if (progressData && !progressData.completed) {
            setProgress({
              currentStep: progressData.current_step,
              emotionScore: progressData.emotion_score,
              correctAnswers: progressData.correct_answers,
              totalAnswers: progressData.total_answers,
              selectedChoices: progressData.selected_choices || [],
              completed: progressData.completed,
            });
            setProgressId(progressData.id);
          }
        }
      } catch (err) {
        console.error('Error fetching scenario:', err);
        setError('Failed to load scenario');
      } finally {
        setLoading(false);
      }
    };

    fetchScenarioAndProgress();
  }, [environmentSlug, user]);

  // Save progress to database
  const saveProgress = useCallback(async (newProgress: ScenarioProgress) => {
    if (!user || !scenario) return;

    try {
      const progressData = {
        user_id: user.id,
        scenario_id: scenario.id,
        current_step: newProgress.currentStep,
        emotion_score: newProgress.emotionScore,
        correct_answers: newProgress.correctAnswers,
        total_answers: newProgress.totalAnswers,
        selected_choices: newProgress.selectedChoices,
        completed: newProgress.completed,
        completed_at: newProgress.completed ? new Date().toISOString() : null,
      };

      if (progressId) {
        // Update existing progress
        await supabase
          .from('scenario_progress')
          .update(progressData)
          .eq('id', progressId);
      } else {
        // Insert new progress
        const { data } = await supabase
          .from('scenario_progress')
          .insert(progressData)
          .select('id')
          .single();
        
        if (data) setProgressId(data.id);
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, [user, scenario, progressId]);

  const selectChoice = useCallback((choiceIndex: number, emotionImpact: number, isCorrect: boolean) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        emotionScore: prev.emotionScore + emotionImpact,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        totalAnswers: prev.totalAnswers + 1,
        selectedChoices: [...prev.selectedChoices, choiceIndex],
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress]);

  const advanceStep = useCallback(() => {
    if (!scenario) return;
    
    const nextStep = progress.currentStep + 1;
    const totalSteps = scenario.dialogue_data.steps.length;
    
    setProgress(prev => {
      const newProgress = {
        ...prev,
        currentStep: nextStep,
        completed: nextStep >= totalSteps,
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, [scenario, progress.currentStep, saveProgress]);

  const resetProgress = useCallback(async () => {
    // Delete existing progress from database
    if (user && progressId) {
      await supabase
        .from('scenario_progress')
        .delete()
        .eq('id', progressId);
    }
    
    setProgressId(null);
    setProgress(defaultProgress);
  }, [user, progressId]);

  return {
    scenario,
    loading,
    error,
    progress,
    selectChoice,
    advanceStep,
    resetProgress,
    isAuthenticated: !!user,
  };
};
