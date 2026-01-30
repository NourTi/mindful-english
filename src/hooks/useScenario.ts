import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Scenario, ScenarioProgress } from '@/types/scenario';

export const useScenario = (environmentSlug: string | null) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ScenarioProgress>({
    currentStep: 0,
    emotionScore: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    selectedChoices: [],
    completed: false,
  });

  useEffect(() => {
    if (!environmentSlug) {
      setLoading(false);
      return;
    }

    const fetchScenario = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('scenarios')
          .select('*')
          .eq('environment_slug', environmentSlug)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          // Parse JSON fields if they're strings
          const parsedScenario: Scenario = {
            ...data,
            visual_context: typeof data.visual_context === 'string' 
              ? JSON.parse(data.visual_context) 
              : data.visual_context,
            dialogue_data: typeof data.dialogue_data === 'string' 
              ? JSON.parse(data.dialogue_data) 
              : data.dialogue_data,
          };
          setScenario(parsedScenario);
        } else {
          setError('Scenario not found');
        }
      } catch (err) {
        console.error('Error fetching scenario:', err);
        setError('Failed to load scenario');
      } finally {
        setLoading(false);
      }
    };

    fetchScenario();
  }, [environmentSlug]);

  const selectChoice = (choiceIndex: number, emotionImpact: number, isCorrect: boolean) => {
    setProgress(prev => ({
      ...prev,
      emotionScore: prev.emotionScore + emotionImpact,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      totalAnswers: prev.totalAnswers + 1,
      selectedChoices: [...prev.selectedChoices, choiceIndex],
    }));
  };

  const advanceStep = () => {
    if (!scenario) return;
    
    const nextStep = progress.currentStep + 1;
    const totalSteps = scenario.dialogue_data.steps.length;
    
    setProgress(prev => ({
      ...prev,
      currentStep: nextStep,
      completed: nextStep >= totalSteps,
    }));
  };

  const resetProgress = () => {
    setProgress({
      currentStep: 0,
      emotionScore: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      selectedChoices: [],
      completed: false,
    });
  };

  return {
    scenario,
    loading,
    error,
    progress,
    selectChoice,
    advanceStep,
    resetProgress,
  };
};
