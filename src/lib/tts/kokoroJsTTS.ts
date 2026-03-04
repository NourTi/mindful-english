import { KokoroTTS } from 'kokoro-js';

let ttsInstance: KokoroTTS | null = null;
let loadingPromise: Promise<KokoroTTS | null> | null = null;
let modelLoadingState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';

type LoadingCallback = (state: typeof modelLoadingState) => void;
const listeners = new Set<LoadingCallback>();

export function onModelStateChange(cb: LoadingCallback) {
  listeners.add(cb);
  cb(modelLoadingState); // immediate current state
  return () => { listeners.delete(cb); };
}

function setLoadState(state: typeof modelLoadingState) {
  modelLoadingState = state;
  listeners.forEach(cb => cb(state));
}

export function getModelLoadingState() {
  return modelLoadingState;
}

async function loadModel(): Promise<KokoroTTS | null> {
  if (ttsInstance) return ttsInstance;
  if (loadingPromise) return loadingPromise;

  setLoadState('loading');

  loadingPromise = (async () => {
    try {
      console.log('[KokoroJS] Loading TTS model...');
      const instance = await KokoroTTS.from_pretrained(MODEL_ID, {
        dtype: 'q8',
        device: 'wasm',
      });
      ttsInstance = instance;
      setLoadState('ready');
      console.log('[KokoroJS] Model loaded successfully');
      return instance;
    } catch (error) {
      console.error('[KokoroJS] Failed to load model:', error);
      setLoadState('error');
      loadingPromise = null;
      return null;
    }
  })();

  return loadingPromise;
}

/** Preload model without synthesizing */
export function preloadModel() {
  loadModel();
}

export async function synthesizeToAudioBuffer(
  text: string,
  voice: string = 'af_bella'
): Promise<AudioBuffer | null> {
  const tts = await loadModel();
  if (!tts) return null;

  try {
    const result = await tts.generate(text, { voice });
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
