# SMPLpix Avatar Service — Deployment & Integration Plan

## Overview

[SMPLpix](https://github.com/sergeyprokudin/smplpix) is a neural rendering pipeline that generates photo-realistic human avatars from SMPL body-model parameters. SEE treats it as an **external GPU micro-service** — the front-end never runs PyTorch; it only consumes URLs to generated frames / video.

---

## 1. Tech Stack (Backend Service)

| Layer | Choice |
|-------|--------|
| Language | Python 3.10+ |
| ML Framework | PyTorch 2.x (CUDA 12) |
| Body Model | SMPL-X (via `smplx` package) |
| Renderer | SMPLpix (clone from GitHub) |
| Web Server | FastAPI + Uvicorn |
| Object Storage | Supabase Storage / AWS S3 / local static folder |
| Container | Docker (NVIDIA base image) |
| GPU Host | RunPod Serverless · Lambda Cloud · any NVIDIA GPU VM |

---

## 2. REST API

### `POST /generate-avatar`

**Request** (`application/json`)

```jsonc
{
  "characterId": "airport_officer",       // maps to a stored SMPL shape preset
  "poseParams": [0.0, 0.1, ...],          // optional 72-dim SMPL pose vector
  "textPrompt": "supportive lean-in",     // optional — drives pose selection
  "emotion": "supportive",                // SEE emotion key
  "audioUrl": "https://…/utterance.wav"   // optional — for lip-sync (future)
}
```

**Response** (`application/json`)

```jsonc
{
  "videoUrl": "https://storage.example.com/avatars/airport_officer_supportive_abc123.mp4",
  "thumbnailUrl": "https://storage.example.com/avatars/airport_officer_supportive_abc123_thumb.jpg",
  "durationMs": 3000,
  "characterId": "airport_officer",
  "emotion": "supportive"
}
```

**Status codes**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Invalid body / unknown characterId |
| 503 | GPU busy — retry with exponential back-off |

### `GET /health`

Returns `{ "status": "ok", "gpu": true }`.

---

## 3. Service Architecture

```
┌──────────────┐      POST /generate-avatar       ┌──────────────────┐
│  SEE App     │  ──────────────────────────────►  │ SMPLpix Service  │
│  (Browser)   │  ◄──────────────────────────────  │ (FastAPI + GPU)  │
│              │       { videoUrl, thumbUrl }       │                  │
└──────────────┘                                   └───────┬──────────┘
                                                           │
                                                   ┌───────▼──────────┐
                                                   │  Object Storage  │
                                                   │  (S3 / Supabase) │
                                                   └──────────────────┘
```

All heavy ML work happens server-side. The SEE front-end only receives URLs and renders them as `<video>` textures in Three.js.

---

## 4. Character Presets

The service stores per-character SMPL shape parameters:

| characterId | Role | Default Pose Theme |
|---|---|---|
| `airport_officer` | Gate agent / security | Standing, authoritative |
| `barista` | Café staff | Leaning on counter |
| `interviewer` | HR / hiring manager | Seated, formal |
| `flatmate` | Potential roommate | Relaxed standing |
| `teacher` | Language tutor | Open gestures |

Emotion → pose mapping is handled via a lookup table inside the service:

- `calm` → neutral idle loop
- `supportive` → slight forward lean, open palms
- `pushing` → upright, hand-on-chin thinking
- `wrapping_up` → small nod / wave

---

## 5. Deployment Steps

### Option A — RunPod Serverless

1. Build Docker image:
   ```bash
   docker build -t smplpix-service:latest .
   ```
2. Push to Docker Hub / GHCR.
3. Create a RunPod Serverless endpoint with the image.
4. Set `SMPLPIX_SERVICE_URL` in SEE to the RunPod endpoint URL.

### Option B — Dedicated GPU VM

1. Provision an NVIDIA A10G or better (e.g. Lambda Cloud).
2. Clone repo, install deps:
   ```bash
   git clone https://github.com/sergeyprokudin/smplpix.git
   cd smplpix && pip install -e .
   pip install fastapi uvicorn boto3
   ```
3. Run server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```
4. Put behind HTTPS (Caddy / nginx).
5. Set `SMPLPIX_SERVICE_URL=https://gpu-host:8000` in SEE.

### Option C — Docker Compose (dev)

```yaml
services:
  smplpix:
    build: .
    runtime: nvidia
    ports:
      - "8000:8000"
    environment:
      - STORAGE_BACKEND=local
```

---

## 6. SEE-side Integration

- `SMPLPIX_SERVICE_URL` env var controls connectivity.
- If missing or unreachable, SEE falls back to the existing procedural 3D avatar or 2D emoji view — **no hard dependency**.
- The client (`lib/smplpixClient.ts`) caches URLs per `(characterId, emotion)` tuple within a session to avoid redundant GPU calls.
- Emotion-driven re-generation is throttled: max once every 3 NPC turns.

---

## 7. Security Notes

- The SMPLpix service should be behind an API key or IP allowlist.
- SEE calls the service via a Supabase Edge Function proxy to avoid exposing the GPU endpoint URL to the browser.
- Generated assets are stored in a public-read bucket with time-limited URLs if privacy is needed.

---

## 8. Future Enhancements

- **Lip sync**: Pass `audioUrl` from Kokoro TTS output to SMPLpix for mouth animation.
- **Real-time streaming**: WebSocket endpoint for frame-by-frame rendering.
- **Custom avatars**: Let learners upload a photo to create a personalized NPC appearance.
