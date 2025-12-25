import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface UserProfile {
  id: string;
  name: string;
  learning_style: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  anxiety_level: number;
  confidence_level: number;
  error_streak: number;
  semantic_context: 'workplace' | 'travel' | 'daily_life' | 'academic';
  vocabulary_level: string;
  preferred_chunk_duration: number;
  total_xp: number;
  current_level: number;
  streak_days: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
      return { error };
    }
  };

  const incrementErrorStreak = async () => {
    if (!profile) return { newStreak: 0, triggerReset: false };
    
    const newStreak = profile.error_streak + 1;
    await updateProfile({ error_streak: newStreak });
    
    return { 
      newStreak, 
      triggerReset: newStreak >= 3 
    };
  };

  const resetErrorStreak = async () => {
    await updateProfile({ error_streak: 0 });
  };

  const addXP = async (amount: number) => {
    if (!profile) return;
    
    const newXP = profile.total_xp + amount;
    const xpPerLevel = 500;
    const newLevel = Math.floor(newXP / xpPerLevel) + 1;
    
    await updateProfile({ 
      total_xp: newXP,
      current_level: newLevel,
      last_activity_date: new Date().toISOString().split('T')[0]
    });
  };

  return {
    profile,
    loading,
    updateProfile,
    incrementErrorStreak,
    resetErrorStreak,
    addXP,
    refetch: fetchProfile
  };
};
