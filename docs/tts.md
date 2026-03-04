# Text-to-Speech in SEE

SEE now uses **kokoro-js** for TTS — a pure JavaScript/WASM implementation that runs entirely in the browser. No Python server or third-party API keys are required.

## How it works

- Model: `onnx-community/Kokoro-82M-v1.0-ONNX` (quantised q8, WASM backend)
- The model is lazily loaded on first TTS request and cached for the session.
- If the model fails to load or synthesis fails, the UI falls back to the browser-native Web Speech API. If that is also unavailable, speech is silently skipped (text-only).

## Architecture

```
src/lib/tts/
├── index.ts          # TTSProvider interface, getActiveTTSProvider(), playAudioBuffer()
└── kokoroJsTTS.ts    # kokoro-js wrapper: load model + synthesizeToAudioBuffer()
```

All consumers (Immergo chat, VR simulation, scenario player) call `getActiveTTSProvider().synthesize(text)` and play the returned `AudioBuffer` via `playAudioBuffer()`.

## Removed

- ElevenLabs edge function (`elevenlabs-tts`) — required paid API key
- Python-based Kokoro TTS edge function (`kokoro-tts`) — required self-hosted server
- Related environment variables: `ELEVENLABS_API_KEY`, `KOKORO_TTS_URL`
