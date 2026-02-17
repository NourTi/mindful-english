/**
 * SMPLpix Avatar Service Client
 *
 * Calls the external SMPLpix GPU service to generate neural avatar videos.
 * Falls back gracefully when the service is unavailable.
 */

import type { NPCEmotion } from '@/lib/npcEngine';

// ─── Types ────────────────────────────────────────────────────────────

export interface AvatarResult {
  videoUrl: string;
  thumbnailUrl: string;
}

export interface AvatarCharacter {
  characterId: string;
  role: string;
  environments: string[];
  defaultEmotion: NPCEmotion;
  description: string;
}

interface GenerateAvatarRequest {
  characterId: string;
  emotion: string;
  textPrompt?: string;
  audioUrl?: string;
}

interface GenerateAvatarResponse {
  videoUrl: string;
  thumbnailUrl: string;
  durationMs: number;
  characterId: string;
  emotion: string;
}

// ─── Configuration ────────────────────────────────────────────────────

const SERVICE_URL = import.meta.env.VITE_SMPLPIX_SERVICE_URL as string | undefined;
const REQUEST_TIMEOUT_MS = 30_000;

// ─── Session-level cache ──────────────────────────────────────────────

const avatarCache = new Map<string, AvatarResult>();

function cacheKey(characterId: string, emotion: string): string {
  return `${characterId}__${emotion}`;
}

// ─── Availability check ───────────────────────────────────────────────

export function isSmplpixAvailable(): boolean {
  return !!SERVICE_URL && SERVICE_URL.length > 0;
}

// ─── Main API call ────────────────────────────────────────────────────

export async function requestAvatar(
  characterId: string,
  lessonId: string,
  emotion: NPCEmotion
): Promise<AvatarResult | null> {
  // 1. If service not configured, return null (caller uses fallback)
  if (!isSmplpixAvailable()) return null;

  // 2. Check session cache
  const key = cacheKey(characterId, emotion);
  const cached = avatarCache.get(key);
  if (cached) return cached;

  // 3. Call the SMPLpix service
  const body: GenerateAvatarRequest = {
    characterId,
    emotion,
    textPrompt: `NPC in ${emotion} state for lesson ${lessonId}`,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const resp = await fetch(`${SERVICE_URL}/generate-avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      console.warn(`[SMPLpix] Service returned ${resp.status}`);
      return null;
    }

    const data: GenerateAvatarResponse = await resp.json();
    const result: AvatarResult = {
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
    };

    // Cache for session
    avatarCache.set(key, result);
    return result;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.warn('[SMPLpix] Request timed out');
    } else {
      console.warn('[SMPLpix] Request failed:', err);
    }
    return null;
  }
}

// ─── Throttled emotion update ─────────────────────────────────────────

let lastEmotionUpdateTurn = 0;
const MIN_TURNS_BETWEEN_UPDATES = 3;

/**
 * Call this when the NPC emotion changes. It will only actually
 * request a new avatar every N turns to avoid hammering the GPU.
 */
export async function requestAvatarIfEmotionChanged(
  characterId: string,
  lessonId: string,
  emotion: NPCEmotion,
  turnCount: number
): Promise<AvatarResult | null> {
  // Always serve from cache if available
  const key = cacheKey(characterId, emotion);
  const cached = avatarCache.get(key);
  if (cached) return cached;

  // Throttle new requests
  if (turnCount - lastEmotionUpdateTurn < MIN_TURNS_BETWEEN_UPDATES) {
    return null;
  }

  lastEmotionUpdateTurn = turnCount;
  return requestAvatar(characterId, lessonId, emotion);
}

// ─── Cache management ─────────────────────────────────────────────────

export function clearAvatarCache(): void {
  avatarCache.clear();
  lastEmotionUpdateTurn = 0;
}

/**
 * Pre-warm the cache for a character's default emotion at session start.
 */
export async function preloadAvatar(
  characterId: string,
  lessonId: string,
  defaultEmotion: NPCEmotion
): Promise<AvatarResult | null> {
  return requestAvatar(characterId, lessonId, defaultEmotion);
}
