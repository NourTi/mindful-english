# Avatar Backends — Integration Guide

SEE uses a pluggable **AvatarBackend** interface (`src/lib/avatarBackend.ts`) so you can swap in any talking-avatar service without touching UI code.

## Architecture

```
┌────────────────────┐      POST /avatar-generate       ┌──────────────────────┐
│  TalkingAvatarPanel │  ─────────────────────────────►  │  Edge Function       │
│  (React component)  │  ◄── { videoUrl, transcript } ── │  avatar-generate     │
└────────────────────┘                                   └──────────┬───────────┘
                                                                    │
                                            ┌───────────────────────┼───────────────────┐
                                            ▼                       ▼                   ▼
                                     LiveAvatar API          SMPLpix Service       SaaS (HeyGen…)
                                   (LIVEAVATAR_API_URL)   (SMPLPIX_SERVICE_URL)  (HEYGEN_API_KEY)
```

When **no** backend is configured the edge function returns `501` and the UI shows captions only — zero errors.

## Adding a new backend

### 1. LiveAvatar (self-hosted GPU or managed)

Set the secret on Lovable Cloud:

```
LIVEAVATAR_API_URL=https://your-gpu-server:8000
```

The edge function already contains a LiveAvatar code path. The expected API contract:

```
POST /generate
Body: { text, character_id, emotion }
Response: { video_url: "https://…" }
```

### 2. SMPLpix Service

```
SMPLPIX_SERVICE_URL=https://your-smplpix-server:7860
```

Expected API:

```
POST /api/avatar/generate
Body: { text, characterId, emotion }
Response: { videoUrl: "https://…" }
```

### 3. Third-party SaaS (e.g. HeyGen)

1. Add a secret `HEYGEN_API_KEY`.
2. Add a code path in `supabase/functions/avatar-generate/index.ts`:

```typescript
const heygenKey = Deno.env.get("HEYGEN_API_KEY");
if (heygenKey) {
  const resp = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: {
      "X-Api-Key": heygenKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ /* HeyGen payload */ }),
  });
  // …return { videoUrl, transcript }
}
```

### 4. Client-side integration (optional)

For backends that return video URLs directly from the browser (e.g. WebRTC streams), implement the `AvatarBackend` interface in `src/lib/avatarBackend.ts`:

```typescript
export class LiveAvatarBackend implements AvatarBackend {
  readonly name = 'LiveAvatar';
  constructor(private url: string) {}

  isEnabled() { return true; }

  async generate(req: AvatarRequest): Promise<AvatarResponse | null> {
    const resp = await fetch(`${this.url}/generate`, { /* … */ });
    const data = await resp.json();
    return { videoUrl: data.video_url };
  }
}
```

Then update `getActiveAvatarBackend()` to return it when the env var is set.

## Design decisions

- **Edge function as proxy**: Keeps API keys server-side; one URL for the client.
- **501 = text-only**: A clear, non-error signal that the UI handles gracefully.
- **NullAvatarBackend**: Default; the app always works without any avatar service.
