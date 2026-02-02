import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface LessonModule {
  id: string;
  type: string;
  title: string;
  content: string;
}

interface LessonChatRequest {
  messages: ChatMessage[];
  lesson: {
    id: string;
    title: string;
    environment: string;
    modules: LessonModule[];
    difficulty: string;
    psyProfileTarget: string[];
  };
  evaluate?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, lesson, evaluate } = await req.json() as LessonChatRequest;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // If evaluating, use a different prompt
    if (evaluate) {
      const evaluationPrompt = `You are an expert English language assessor. Analyze the following conversation and provide CEFR-level feedback.

LESSON CONTEXT:
- Title: ${lesson.title}
- Environment: ${lesson.environment}
- Difficulty: ${lesson.difficulty}
- Learning Focus: ${lesson.modules.map(m => m.title).join(', ')}

CONVERSATION TO EVALUATE:
${messages.filter(m => m.role !== 'system').map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

Provide your assessment using the evaluate_conversation function.`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'user', content: evaluationPrompt }
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "evaluate_conversation",
                description: "Provide CEFR-level assessment of the conversation",
                parameters: {
                  type: "object",
                  properties: {
                    cefr_level: {
                      type: "string",
                      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
                      description: "The CEFR level demonstrated in this conversation"
                    },
                    score: {
                      type: "integer",
                      minimum: 1,
                      maximum: 100,
                      description: "Overall score out of 100"
                    },
                    strengths: {
                      type: "array",
                      items: { type: "string" },
                      description: "2-3 specific strengths observed"
                    },
                    areas_to_improve: {
                      type: "array",
                      items: { type: "string" },
                      description: "2-3 areas that need improvement"
                    },
                    vocabulary_used: {
                      type: "array",
                      items: { type: "string" },
                      description: "Notable vocabulary words used correctly"
                    },
                    grammar_feedback: {
                      type: "string",
                      description: "Brief feedback on grammar usage"
                    },
                    fluency_rating: {
                      type: "string",
                      enum: ["developing", "functional", "proficient", "advanced"],
                      description: "Overall fluency rating"
                    },
                    xp_earned: {
                      type: "integer",
                      description: "XP points earned (10-50 based on performance)"
                    }
                  },
                  required: ["cefr_level", "score", "strengths", "areas_to_improve", "fluency_rating", "xp_earned"]
                }
              }
            }
          ],
          tool_choice: { type: "function", function: { name: "evaluate_conversation" } }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI gateway error:', response.status, errorText);
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the tool call result
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall && toolCall.function?.arguments) {
        const evaluation = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify({ evaluation }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error('Failed to get evaluation from AI');
    }

    // Build the lesson system prompt
    const modulesContext = lesson.modules.map(m => 
      `[${m.type.toUpperCase()}] ${m.title}: ${m.content}`
    ).join('\n');

    const systemPrompt = `You are conducting an English learning conversation in the context of: "${lesson.title}".

ENVIRONMENT: ${lesson.environment}
DIFFICULTY: ${lesson.difficulty}
LEARNER PROFILE: ${lesson.psyProfileTarget.join(', ')}

LESSON MODULES TO GUIDE THE CONVERSATION:
${modulesContext}

YOUR ROLE:
- You are a friendly, patient conversation partner simulating real-world scenarios
- Start with the psychological preparation context to help the learner feel comfortable
- Guide them through realistic dialogue related to the lesson topic
- Adjust your language complexity based on the difficulty level (${lesson.difficulty})
- Be encouraging and gently correct mistakes by modeling correct usage
- Keep responses conversational and appropriate for the ${lesson.environment} setting
- If the learner seems anxious (based on their profile: ${lesson.psyProfileTarget.join(', ')}), be extra supportive

Start the conversation naturally, staying in character for the ${lesson.environment} scenario.`;

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
    console.error('Lesson chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
