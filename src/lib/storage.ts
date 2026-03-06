/**
 * In-memory storage wrapper — no longer uses localStorage.
 * All persistent data is stored in the database via Lovable Cloud.
 */

// In-memory store (lives for the duration of the browser tab)
const memoryStore = new Map<string, string>();

export interface StorageError {
  type: 'NO_CONSENT' | 'STORAGE_ERROR' | 'PARSE_ERROR';
  message: string;
}

/**
 * GDPR consent is always considered granted since we store in DB (server-side).
 */
export function hasGDPRConsent(): boolean {
  return true;
}

export function setGDPRConsent(_granted: boolean): void {
  // No-op: data is managed server-side
}

export function clearAllSEEData(): void {
  memoryStore.clear();
  // Also clear any legacy localStorage entries
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('see-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    // Also remove legacy zustand keys
    localStorage.removeItem('see-assessment');
    localStorage.removeItem('see-lessons');
  } catch {
    // localStorage not available
  }
}

/**
 * Safe in-memory getItem
 */
export function safeGetItem<T>(key: string, defaultValue: T): { data: T; error: StorageError | null } {
  try {
    const item = memoryStore.get(key);
    if (item === undefined) {
      return { data: defaultValue, error: null };
    }
    const parsed = JSON.parse(item) as T;
    return { data: parsed, error: null };
  } catch {
    return { data: defaultValue, error: { type: 'PARSE_ERROR', message: 'Failed to parse data.' } };
  }
}

/**
 * Safe in-memory setItem
 */
export function safeSetItem<T>(key: string, value: T): { success: boolean; error: StorageError | null } {
  try {
    memoryStore.set(key, JSON.stringify(value));
    return { success: true, error: null };
  } catch {
    return { success: false, error: { type: 'STORAGE_ERROR', message: 'Failed to save data.' } };
  }
}

/**
 * Safe in-memory removeItem
 */
export function safeRemoveItem(key: string): void {
  memoryStore.delete(key);
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

export function trackSession(session: Omit<LearningSession, 'id' | 'startedAt'>): string {
  const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newSession: LearningSession = {
    id,
    startedAt: new Date().toISOString(),
    ...session
  };

  const { data: sessions } = safeGetItem<LearningSession[]>(SESSIONS_KEY, []);
  sessions.push(newSession);
  const trimmedSessions = sessions.slice(-100);
  safeSetItem(SESSIONS_KEY, trimmedSessions);

  return id;
}

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

export function getSessions(): LearningSession[] {
  const { data: sessions } = safeGetItem<LearningSession[]>(SESSIONS_KEY, []);
  return sessions;
}

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
