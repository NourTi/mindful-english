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
    const OPENROUTER_API_KEY = Deno.env.get("GAME_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("GAME_API_KEY is not configured");
    }
    
    console.log("Key check:", OPENROUTER_API_KEY.length, OPENROUTER_API_KEY.substring(0, 10));

    const { lessonTitle, lessonTopic, difficulty, existingCode, userRequest } = await req.json();

    let prompt: string;

    if (existingCode && userRequest) {
      // Improvement mode
      prompt = `Improve the following HTML5 educational English-learning game based on the user's request.

Request: "${userRequest}"

Only return a full, standalone HTML file (no explanations or markdown).
The game must be educational and help learners practice: ${lessonTopic}

Game code:
${existingCode}`;
    } else {
      // Creation mode
      prompt = `You're an expert HTML5 game developer specializing in educational language-learning games.

Generate a fun, visually appealing, and playable HTML5 game that helps English learners practice: "${lessonTopic}"

Lesson: "${lessonTitle}"
Difficulty: ${difficulty || "beginner"}

Requirements:
- Canvas-based game with colorful, engaging visuals
- The game MUST teach/reinforce English concepts related to the lesson topic
- Include vocabulary words, phrases, or grammar from the topic
- Show score and feedback in English
- Retry button after losing
- Brief instructions at the start
- Entire game in one standalone HTML file
- NO markdown (no triple backticks)
- Use modern CSS with gradients and animations
- Make it mobile-friendly (touch events + keyboard)
- The game should be completable in 2-3 minutes

Game ideas that work well for language learning:
- Word matching/memory games
- Typing/spelling challenges  
- Fill-in-the-blank with falling words
- Vocabulary quiz with a game mechanic (snake, breakout, etc.)
- Sentence building puzzles

Pick the most appropriate game type for the topic and make it engaging!`;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://psycholingo-path.lovable.app",
        "X-Title": "SEE Language Learning",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-coder",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please check your OpenRouter account." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    let gameHtml = data.choices?.[0]?.message?.content?.trim() || "";

    // Strip markdown code fences if present
    if (gameHtml.startsWith("```")) {
      gameHtml = gameHtml.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
    }

    // Validate it's actually HTML
    if (!gameHtml.toLowerCase().includes("<html")) {
      return new Response(
        JSON.stringify({ error: "AI did not generate valid HTML. Please try again." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ html: gameHtml }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-game error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
