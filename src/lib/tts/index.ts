import { synthesizeToAudioBuffer, onModelStateChange, getModelLoadingState, preloadModel } from './kokoroJsTTS';

export { onModelStateChange, getModelLoadingState, preloadModel };

export interface TTSProvider {
  isEnabled(): boolean;
  synthesize(text: string, voice?: string): Promise<AudioBuffer | null>;
}

class KokoroJsProvider implements TTSProvider {
  isEnabled(): boolean {
    return true;
  }

  async synthesize(text: string, voice?: string): Promise<AudioBuffer | null> {
    return synthesizeToAudioBuffer(text, voice);
  }
}

const kokoroProvider = new KokoroJsProvider();

export function getActiveTTSProvider(): TTSProvider {
  return kokoroProvider;
}

/**
 * Available kokoro-js voices with metadata for UI display.
 */
export interface VoiceOption {
  id: string;
  label: string;
  gender: 'female' | 'male';
  accent: 'american' | 'british';
  tone: string; // short descriptor
}

export const KOKORO_VOICES: VoiceOption[] = [
  { id: 'af_heart',   label: 'Heart',    gender: 'female', accent: 'american', tone: 'Warm & caring' },
  { id: 'af_bella',   label: 'Bella',    gender: 'female', accent: 'american', tone: 'Friendly & clear' },
  { id: 'af_sky',     label: 'Sky',      gender: 'female', accent: 'american', tone: 'Bright & upbeat' },
  { id: 'af_nicole',  label: 'Nicole',   gender: 'female', accent: 'american', tone: 'Calm & soothing' },
  { id: 'af_sarah',   label: 'Sarah',    gender: 'female', accent: 'american', tone: 'Confident' },
  { id: 'am_adam',    label: 'Adam',     gender: 'male',   accent: 'american', tone: 'Strong & confident' },
  { id: 'am_michael', label: 'Michael',  gender: 'male',   accent: 'american', tone: 'Steady & neutral' },
  { id: 'am_echo',    label: 'Echo',     gender: 'male',   accent: 'american', tone: 'Resonant & clear' },
  { id: 'bf_emma',    label: 'Emma',     gender: 'female', accent: 'british',  tone: 'Polished & elegant' },
  { id: 'bf_isabella',label: 'Isabella', gender: 'female', accent: 'british',  tone: 'Professional' },
  { id: 'bm_george',  label: 'George',   gender: 'male',   accent: 'british',  tone: 'Warm British' },
  { id: 'bm_lewis',   label: 'Lewis',    gender: 'male',   accent: 'british',  tone: 'Friendly British' },
];

/**
 * Suggest a default voice based on mission context / target_role.
 */
export function suggestVoiceForMission(targetRole: string): string {
  const role = targetRole.toLowerCase();

  // Medical / formal → calm female
  if (role.includes('doctor') || role.includes('nurse') || role.includes('pharmacist'))
    return 'af_nicole';
  // Authority figures → confident male
  if (role.includes('officer') || role.includes('judge') || role.includes('inspector') || role.includes('immigration'))
    return 'am_adam';
  // Service / hospitality → warm female
  if (role.includes('barista') || role.includes('waiter') || role.includes('baker') || role.includes('receptionist') || role.includes('concierge'))
    return 'af_heart';
  // Formal / professional → british
  if (role.includes('bank') || role.includes('solicitor') || role.includes('consultant') || role.includes('professor'))
    return 'bf_emma';
  // Friendly / casual → bright
  if (role.includes('neighbor') || role.includes('flatmate') || role.includes('friend'))
    return 'af_sky';
  // Vendor / loud → strong male
  if (role.includes('vendor') || role.includes('mechanic') || role.includes('driver'))
    return 'am_michael';

  return 'af_bella'; // default
}

/**
 * Utility: play an AudioBuffer through the default audio output.
 */
export function playAudioBuffer(buffer: AudioBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => resolve();
      source.start(0);
    } catch (err) {
      reject(err);
    }
  });
}
