import { AssessmentProfile, PathRecommendation, ProfileMapping } from '@/types/onboarding';
import { safeGetItem, safeSetItem, safeRemoveItem, trackSession } from '@/lib/storage';
import system from '../../data/see_learning_system.json';

const STORAGE_KEY = 'see-onboarding-profile';
const ONBOARDING_COMPLETE_KEY = 'see-onboarding-complete';

interface SystemData {
  assessment: {
    profileMapping: Record<string, ProfileMapping>;
  };
  paths: Array<{
    id: string;
    label: string;
    sequence: string[];
  }>;
}

const typedSystem = system as unknown as SystemData;

/**
 * Maps assessment profile to a recommended learning path
 */
export function getRecommendedPath(profile: AssessmentProfile): PathRecommendation {
  try {
    const { speaking_level, anxiety, motivation } = profile;
    
    // Determine anxiety level key
    let anxietyKey: 'high' | 'medium' | 'low';
    if (anxiety.toLowerCase().includes('high') || anxiety.toLowerCase().includes('avoid')) {
      anxietyKey = 'high';
    } else if (anxiety.toLowerCase().includes('medium') || anxiety.toLowerCase().includes('nervous')) {
      anxietyKey = 'medium';
    } else {
      anxietyKey = 'low';
    }
    
    // Determine speaking level key
    const speakingKey = speaking_level <= 2 ? 'low_speaking' : speaking_level >= 4 ? 'high_speaking' : 'medium_speaking';
    
    // Determine motivation key
    let motivationKey: string;
    if (motivation.toLowerCase().includes('job') || motivation.toLowerCase().includes('career')) {
      motivationKey = 'job';
    } else if (motivation.toLowerCase().includes('travel') || motivation.toLowerCase().includes('social')) {
      motivationKey = 'travel';
    } else {
      motivationKey = 'growth';
    }
    
    // Build mapping key
    const mappingKeys = [
      `${anxietyKey}_anxiety_${speakingKey}_${motivationKey}`,
      `${anxietyKey}_anxiety_${motivationKey}`,
      `${anxietyKey}_anxiety`,
    ];
    
    // Find matching profile mapping
    let mapping: ProfileMapping | null = null;
    for (const key of mappingKeys) {
      if (typedSystem.assessment.profileMapping[key]) {
        mapping = typedSystem.assessment.profileMapping[key];
        break;
      }
    }
    
    // Fallback to default path
    if (!mapping) {
      mapping = {
        recommendedPath: 'path-social-confidence',
        startingDifficulty: 'easy',
        psySupport: 'high'
      };
    }
    
    // Find path label
    const path = typedSystem.paths.find(p => p.id === mapping!.recommendedPath);
    const pathLabel = path?.label || 'Social Confidence Path';
    
    // Generate recommendation reason
    const reason = generateRecommendationReason(anxietyKey, speaking_level, motivationKey, mapping);
    
    // Track assessment completion
    trackSession({ type: 'assessment', psySupportUsed: anxietyKey === 'high' });
    
    return {
      pathId: mapping.recommendedPath,
      pathLabel,
      difficulty: mapping.startingDifficulty,
      psySupport: mapping.psySupport,
      reason
    };
  } catch (error) {
    console.error('Error getting recommended path:', error);
    // Return safe fallback
    return {
      pathId: 'path-social-confidence',
      pathLabel: 'Social Confidence Path',
      difficulty: 'easy',
      psySupport: 'high',
      reason: 'We recommend starting with our beginner-friendly path with full psychological support.'
    };
  }
}

function generateRecommendationReason(
  anxiety: 'high' | 'medium' | 'low',
  speakingLevel: number,
  motivation: string,
  mapping: ProfileMapping
): string {
  const anxietyDescriptions = {
    high: 'high anxiety level',
    medium: 'moderate anxiety',
    low: 'confidence'
  };
  
  const speakingDescriptions = speakingLevel <= 2 
    ? 'beginner speaking skills' 
    : speakingLevel >= 4 
      ? 'strong speaking foundation'
      : 'intermediate speaking level';
  
  const psySupportDescriptions = {
    high: 'with extensive psychological support modules',
    medium: 'with balanced pacing and encouragement',
    low: 'focusing on practical challenges'
  };
  
  return `Based on your ${anxietyDescriptions[anxiety]} and ${speakingDescriptions}, we recommend starting with ${mapping.startingDifficulty} difficulty ${psySupportDescriptions[mapping.psySupport]}.`;
}

/**
 * Save assessment profile to localStorage with error handling
 */
export function saveOnboardingProfile(profile: AssessmentProfile): boolean {
  try {
    const { success: profileSuccess } = safeSetItem(STORAGE_KEY, profile);
    const { success: completeSuccess } = safeSetItem(ONBOARDING_COMPLETE_KEY, true);
    return profileSuccess && completeSuccess;
  } catch (error) {
    console.error('Failed to save onboarding profile:', error);
    return false;
  }
}

/**
 * Get saved assessment profile from localStorage with error handling
 */
export function getOnboardingProfile(): AssessmentProfile | null {
  try {
    const { data, error } = safeGetItem<AssessmentProfile | null>(STORAGE_KEY, null);
    if (error) {
      console.warn('Error loading onboarding profile:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Failed to get onboarding profile:', error);
    return null;
  }
}

/**
 * Check if onboarding has been completed
 */
export function isOnboardingComplete(): boolean {
  try {
    const { data } = safeGetItem<boolean>(ONBOARDING_COMPLETE_KEY, false);
    return data === true;
  } catch {
    return false;
  }
}

/**
 * Clear onboarding data (for reset purposes)
 */
export function clearOnboardingData(): void {
  try {
    safeRemoveItem(STORAGE_KEY);
    safeRemoveItem(ONBOARDING_COMPLETE_KEY);
  } catch (error) {
    console.error('Failed to clear onboarding data:', error);
  }
}

/**
 * Get the first lesson ID from a path
 */
export function getFirstLessonFromPath(pathId: string): string | null {
  try {
    const path = typedSystem.paths.find(p => p.id === pathId);
    if (!path || path.sequence.length === 0) return null;
    return path.sequence[0];
  } catch (error) {
    console.error('Error getting first lesson from path:', error);
    return null;
  }
}
