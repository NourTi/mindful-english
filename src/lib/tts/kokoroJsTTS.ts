import { KokoroTTS } from 'kokoro-js';

let ttsInstance: KokoroTTS | null = null;
let loadingPromise: Promise<KokoroTTS | null> | null = null;

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';

async function loadModel(): Promise<KokoroTTS | null> {
  if (ttsInstance) return ttsInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      console.log('[KokoroJS] Loading TTS model...');
      const instance = await KokoroTTS.from_pretrained(MODEL_ID, {
        dtype: 'q8',
        device: 'wasm',
      });
      ttsInstance = instance;
      console.log('[KokoroJS] Model loaded successfully');
      return instance;
    } catch (error) {
      console.error('[KokoroJS] Failed to load model:', error);
      loadingPromise = null;
      return null;
    }
  })();

  return loadingPromise;
}

export async function synthesizeToAudioBuffer(text: string): Promise<AudioBuffer | null> {
  const tts = await loadModel();
  if (!tts) return null;

  try {
    const result = await tts.generate(text, { voice: 'af_bella' });
    // result.toAudioBuffer() or result.audio is a Float32Array with sample rate
    // Convert to Web Audio API AudioBuffer
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioData = result.audio;
    const sampleRate = result.sampling_rate ?? 24000;
    const buffer = ctx.createBuffer(1, audioData.length, sampleRate);
    buffer.copyToChannel(audioData, 0);
    return buffer;
  } catch (error) {
    console.error('[KokoroJS] Synthesis failed:', error);
    return null;
  }
}
