import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, characterId, emotion } = await req.json();

    if (!text || !characterId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: text, characterId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Check for configured avatar backends (env secrets on the Edge Function side)
    const liveAvatarUrl = Deno.env.get("LIVEAVATAR_API_URL");
    const smplpixUrl = Deno.env.get("SMPLPIX_SERVICE_URL");

    // ── LiveAvatar backend ──────────────────────────────────────────
    if (liveAvatarUrl) {
      try {
        const resp = await fetch(`${liveAvatarUrl}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, character_id: characterId, emotion }),
        });
        if (resp.ok) {
          const data = await resp.json();
          return new Response(
            JSON.stringify({ videoUrl: data.video_url || data.videoUrl, transcript: text }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        console.error("LiveAvatar backend error:", resp.status);
      } catch (err) {
        console.error("LiveAvatar backend unreachable:", err);
      }
    }

    // ── SMPLpix backend ─────────────────────────────────────────────
    if (smplpixUrl) {
      try {
        const resp = await fetch(`${smplpixUrl}/api/avatar/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, characterId, emotion }),
        });
        if (resp.ok) {
          const data = await resp.json();
          return new Response(
            JSON.stringify({ videoUrl: data.videoUrl, transcript: text }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        console.error("SMPLpix backend error:", resp.status);
      } catch (err) {
        console.error("SMPLpix backend unreachable:", err);
      }
    }

    // ── No backend configured → 501 ─────────────────────────────────
    return new Response(
      JSON.stringify({
        error: "Avatar backend not configured; using text-only mode.",
        text,
      }),
      { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("avatar-generate error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
