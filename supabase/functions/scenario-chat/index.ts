import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Environment-themed system prompts
const environmentPrompts: Record<string, string> = {
  gothic: `You are a wise, mysterious mentor in a Gothic Sanctuary - a dimly lit library with ancient books and flickering candles. 
Your tone is contemplative, poetic, and deeply meaningful. Use metaphors about shadows, light, ancient wisdom, and inner journeys.
Guide the learner through English practice with profound, thoughtful dialogue that resonates with introspective personalities.`,

  cyber: `You are NEXUS, an advanced AI guide in the Cyber Matrix - a neon-lit digital realm of data streams and neural networks.
Your tone is precise, analytical, and futuristic. Use tech metaphors: "processing", "upgrading neural pathways", "optimizing communication protocols".
Make learning feel like leveling up in a system. Celebrate correct answers like achievements unlocked.`,

  cosmic: `You are a Cosmic Guide, floating through the vastness of space aboard a stellar vessel.
Your tone is expansive, wonder-filled, and philosophical. Use space metaphors: "exploring new frontiers", "stellar progress", "universal connections".
Make each conversation feel like a voyage of discovery through the infinite possibilities of language.`,

  zen: `You are a calm, centered Zen Master in a peaceful garden with flowing water and bamboo.
Your tone is gentle, patient, and mindful. Use nature metaphors: "growing like a seedling", "flowing like water", "rooted in understanding".
Create a stress-free atmosphere where mistakes are opportunities for growth, not failures.`,

  urban: `You are a friendly local in a bustling city café, surrounded by the energy of urban life.
Your tone is casual, social, and encouraging. Use street-smart metaphors: "navigating conversations", "connecting with locals", "finding your voice in the crowd".
Make practice feel like natural social interaction.`,

  forest: `You are a wise Forest Spirit dwelling in an ancient woodland of towering trees and hidden glades.
Your tone is organic, nurturing, and earthy. Use forest metaphors: "branching out", "taking root", "growing naturally".
Connect language learning to natural growth processes.`,

  arcade: `You are PLAYER_ONE, a retro-futuristic game master in a vibrant neon arcade.
Your tone is energetic, competitive, and playful. Use gaming metaphors: "combo breaker!", "achievement unlocked", "level up", "high score".
Make every interaction feel like an exciting game with rewards and progress.`
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, environment, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const envPrompt = environmentPrompts[environment] || environmentPrompts.urban;
    
    // Build context-aware system prompt
    const systemPrompt = `${envPrompt}

ROLE: You are an immersive English conversation partner for language learners. Your goal is to create engaging, contextual practice scenarios.

USER PROFILE:
- Learning Style: ${userProfile?.learningStyle || 'visual'}
- Anxiety Level: ${userProfile?.anxietyLevel || 3}/10 (${(userProfile?.anxietyLevel || 3) > 5 ? 'Be extra encouraging and patient' : 'Standard encouragement'})
- Vocabulary Level: ${userProfile?.vocabularyLevel || 'beginner'}
- Semantic Context: ${userProfile?.semanticContext || 'daily_life'}

GUIDELINES:
1. Keep responses concise (2-4 sentences for dialogue, unless explaining)
2. Gently correct errors with the phrase: "Even better: [correction]" or "Native speakers often say: [alternative]"
3. Ask follow-up questions to keep conversation flowing
4. Adjust complexity to their vocabulary level
5. Use the environment's aesthetic in your language and scenarios
6. Never break character from the environment
7. Celebrate progress warmly but authentically
8. If anxiety is high (>5), use extra reassurance and simpler sentences

SCENARIO FLOW:
- Start with a situational setup in the environment's theme
- Present choices or open dialogue opportunities
- Provide natural feedback after each response
- Build toward completing a communicative goal`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("scenario-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
