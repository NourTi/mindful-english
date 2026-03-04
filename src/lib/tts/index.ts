import { synthesizeToAudioBuffer } from './kokoroJsTTS';

export interface TTSProvider {
  isEnabled(): boolean;
  synthesize(text: string): Promise<AudioBuffer | null>;
}

class KokoroJsProvider implements TTSProvider {
  isEnabled(): boolean {
    return true;
  }

  async synthesize(text: string): Promise<AudioBuffer | null> {
    return synthesizeToAudioBuffer(text);
  }
}

const kokoroProvider = new KokoroJsProvider();

export function getActiveTTSProvider(): TTSProvider {
  return kokoroProvider;
}

/**
 * Utility: play an AudioBuffer through the default audio output.
 * Returns a promise that resolves when playback ends.
 */
export function playAudioBuffer(buffer: AudioBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => {
        resolve();
      };
      source.start(0);
    } catch (err) {
      reject(err);
    }
  });
}
