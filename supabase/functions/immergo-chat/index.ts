import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  mission: {
    title: string;
    desc: string;
    target_role: string;
  };
  targetLanguage: string;
  nativeLanguage: string;
  mode: 'teacher' | 'immersive';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mission, targetLanguage, nativeLanguage, mode } = await req.json() as ChatRequest;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build system prompt based on mode
    let systemPrompt = '';
    
    if (mode === 'teacher') {
      systemPrompt = `You are a language teacher helping a ${nativeLanguage} speaker practice ${targetLanguage} in a realistic roleplay scenario.

SCENARIO: ${mission.title}
SITUATION: ${mission.desc}
YOUR ROLE: ${mission.target_role}

TEACHING MODE INSTRUCTIONS:
- Adopt the persona of "${mission.target_role}" and speak primarily in ${targetLanguage}
- When the user struggles, you may provide translations or explanations in ${nativeLanguage}
- If they ask "How do I say...?" or request help, explain in ${nativeLanguage} then continue in ${targetLanguage}
- Offer encouragement and gentle corrections
- If they make grammar/vocabulary errors, acknowledge their attempt and model the correct form
- Keep the conversation flowing naturally while being supportive
- Use a warm, patient tone appropriate for a teacher

Start in character immediately. Do not break character unless providing explicit teaching moments.`;
    } else {
      systemPrompt = `You are conducting IMMERSIVE language roleplay. You speak ONLY ${targetLanguage} - no exceptions.

SCENARIO: ${mission.title}
SITUATION: ${mission.desc}
YOUR ROLE: ${mission.target_role}

STRICT IMMERSIVE MODE RULES:
- You are "${mission.target_role}" - stay completely in character
- Speak ONLY in ${targetLanguage} - never switch to any other language
- If the user speaks ${nativeLanguage}, respond in ${targetLanguage} only, perhaps looking confused
- Do not provide translations or explanations
- React naturally to what they say, keeping appropriate to your character's personality
- If they struggle, you may slow down, simplify, or repeat - but always in ${targetLanguage}
- Your character has their own personality traits implied by the role description

When the mission objective is achieved, you MUST call the complete_mission function with:
- score: 1 (Tiro - struggled, needed help), 2 (Proficiens - good with some errors), or 3 (Peritus - excellent/fluent)
- feedback_pointers: Array of 3 constructive points in English

Start the conversation in character immediately.`;
    }

    // Add tool for mission completion in immersive mode
    const tools = mode === 'immersive' ? [
      {
        type: "function",
        function: {
          name: "complete_mission",
          description: "Call this when the user has successfully completed the mission objective. Provide performance assessment.",
          parameters: {
            type: "object",
            properties: {
              score: {
                type: "integer",
                description: "Rating 1-3: 1=Tiro (struggled), 2=Proficiens (good), 3=Peritus (excellent)"
              },
              feedback_pointers: {
                type: "array",
                items: { type: "string" },
                description: "3 constructive feedback points in English"
              }
            },
            required: ["score", "feedback_pointers"]
          }
        }
      }
    ] : undefined;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
        ...(tools && { tools, tool_choice: 'auto' }),
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limits exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Immergo chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
