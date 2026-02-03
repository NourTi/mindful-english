/**
 * Safe localStorage wrapper with GDPR consent checks and error handling
 */

const CONSENT_KEY = 'see-gdpr-consent';

export interface StorageError {
  type: 'NO_CONSENT' | 'STORAGE_ERROR' | 'PARSE_ERROR';
  message: string;
}

/**
 * Check if user has given GDPR consent
 */
export function hasGDPRConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
}

/**
 * Set GDPR consent status
 */
export function setGDPRConsent(granted: boolean): void {
  try {
    if (granted) {
      localStorage.setItem(CONSENT_KEY, 'granted');
    } else {
      // Clear all SEE-related localStorage if consent is revoked
      clearAllSEEData();
      localStorage.setItem(CONSENT_KEY, 'denied');
    }
  } catch (error) {
    console.error('Failed to set GDPR consent:', error);
  }
}

/**
 * Clear all SEE-related data from localStorage
 */
export function clearAllSEEData(): void {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('see-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear SEE data:', error);
  }
}

/**
 * Safe localStorage getItem with consent check and error handling
 */
export function safeGetItem<T>(key: string, defaultValue: T): { data: T; error: StorageError | null } {
  try {
    if (!hasGDPRConsent()) {
      return { data: defaultValue, error: { type: 'NO_CONSENT', message: 'Please accept data storage to use this feature.' } };
    }
    
    const item = localStorage.getItem(key);
    if (item === null) {
      return { data: defaultValue, error: null };
    }
    
    const parsed = JSON.parse(item) as T;
    return { data: parsed, error: null };
  } catch (error) {
    console.error(`Failed to get item ${key}:`, error);
    return { 
      data: defaultValue, 
      error: { type: 'PARSE_ERROR', message: 'Failed to load your data. It may have been corrupted.' }
    };
  }
}

/**
 * Safe localStorage setItem with consent check and error handling
 */
export function safeSetItem<T>(key: string, value: T): { success: boolean; error: StorageError | null } {
  try {
    if (!hasGDPRConsent()) {
      return { success: false, error: { type: 'NO_CONSENT', message: 'Please accept data storage to save your progress.' } };
    }
    
    localStorage.setItem(key, JSON.stringify(value));
    return { success: true, error: null };
  } catch (error) {
    console.error(`Failed to set item ${key}:`, error);
    return { 
      success: false, 
      error: { type: 'STORAGE_ERROR', message: 'Failed to save your data. Your browser storage may be full.' }
    };
  }
}

/**
 * Safe localStorage removeItem
 */
export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item ${key}:`, error);
  }
}

// Session tracking types
export interface LearningSession {
  id: string;
  type: 'lesson' | 'scenario' | 'chat' | 'assessment';
  startedAt: string;
  completedAt?: string;
  lessonId?: string;
  psySupportUsed: boolean;
  score?: number;
}

const SESSIONS_KEY = 'see-learning-sessions';

/**
 * Track a new learning session
 */
export function trackSession(session: Omit<LearningSession, 'id' | 'startedAt'>): string {
  const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newSession: LearningSession = {
    id,
    startedAt: new Date().toISOString(),
    ...session
  };
  
  const { data: sessions } = safeGetItem<LearningSession[]>(SESSIONS_KEY, []);
  sessions.push(newSession);
  
  // Keep only last 100 sessions
  const trimmedSessions = sessions.slice(-100);
  safeSetItem(SESSIONS_KEY, trimmedSessions);
  
  return id;
}

/**
 * Complete a learning session
 */
export function completeSession(sessionId: string, score?: number): void {
  const { data: sessions } = safeGetItem<LearningSession[]>(SESSIONS_KEY, []);
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex !== -1) {
    sessions[sessionIndex].completedAt = new Date().toISOString();
    if (score !== undefined) {
      sessions[sessionIndex].score = score;
    }
    safeSetItem(SESSIONS_KEY, sessions);
  }
}

/**
 * Get all learning sessions
 */
export function getSessions(): LearningSession[] {
  const { data: sessions } = safeGetItem<LearningSession[]>(SESSIONS_KEY, []);
  return sessions;
}

/**
 * Get session statistics
 */
export function getSessionStats() {
  const sessions = getSessions();
  const last10 = sessions.slice(-10);
  
  return {
    totalSessions: sessions.length,
    completedLessons: sessions.filter(s => s.type === 'lesson' && s.completedAt).length,
    psySupportUsed: sessions.filter(s => s.psySupportUsed).length,
    recentSessions: last10.reverse(),
    averageScore: sessions.filter(s => s.score).reduce((acc, s) => acc + (s.score || 0), 0) / 
      Math.max(1, sessions.filter(s => s.score).length)
  };
}
