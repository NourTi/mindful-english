/**
 * Avatar Backend Abstraction Layer
 *
 * Provides a pluggable interface for connecting SEE to any talking-avatar
 * service (LiveAvatar, SMPLpix, HeyGen, etc.).
 *
 * When no backend is configured the NullAvatarBackend is used and the UI
 * falls back to a text-only caption experience — no errors, no breakage.
 */

// ── Types ──────────────────────────────────────────────────────────────

export type AvatarStatus = 'idle' | 'listening' | 'generating' | 'error';

export interface AvatarRequest {
  /** NPC text the avatar should speak */
  text?: string;
  /** URL to pre-recorded audio (optional) */
  audioUrl?: string;
  /** Character / avatar ID (maps to lesson environment) */
  characterId: string;
  /** Current NPC emotion */
  emotion?: string;
}

export interface AvatarResponse {
  /** URL of the generated talking-head video */
  videoUrl: string;
  /** Transcript / subtitle text returned by the backend */
  transcript?: string;
}

// ── Interface ──────────────────────────────────────────────────────────

export interface AvatarBackend {
  /** Human-readable backend name (for debug panels) */
  readonly name: string;
  /** Whether the backend is configured and reachable */
  isEnabled(): boolean;
  /** Generate a talking-avatar video for the given request */
  generate(req: AvatarRequest): Promise<AvatarResponse | null>;
}

// ── NullAvatarBackend (text-only fallback) ─────────────────────────────

export class NullAvatarBackend implements AvatarBackend {
  readonly name = 'NullAvatarBackend';

  isEnabled(): boolean {
    return false;
  }

  async generate(_req: AvatarRequest): Promise<AvatarResponse | null> {
    return null;
  }
}

// ── Backend resolver ───────────────────────────────────────────────────

/**
 * Returns the currently active avatar backend based on env vars.
 *
 * Priority order:
 *  1. VITE_LIVEAVATAR_API_URL  → future LiveAvatar HTTP backend
 *  2. VITE_SMPLPIX_SERVICE_URL → future SMPLpix GPU backend
 *  3. (none configured)        → NullAvatarBackend (text-only)
 *
 * To add a new backend, implement `AvatarBackend` and add a check here.
 */
export function getActiveAvatarBackend(): AvatarBackend {
  // Future: check for LiveAvatar
  // const liveAvatarUrl = import.meta.env.VITE_LIVEAVATAR_API_URL;
  // if (liveAvatarUrl) return new LiveAvatarBackend(liveAvatarUrl);

  // Future: check for SMPLpix
  // const smplpixUrl = import.meta.env.VITE_SMPLPIX_SERVICE_URL;
  // if (smplpixUrl) return new SmplpixAvatarBackend(smplpixUrl);

  return new NullAvatarBackend();
}
