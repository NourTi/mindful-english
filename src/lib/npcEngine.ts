/**
 * NPC State Machine Engine for Immersive VR Simulations
 * Drives NPC conversation phases, emotion, and anxiety-aware pacing.
 */

import type { LearnerProfile } from '@/types/onboarding';

// ─── Types ────────────────────────────────────────────────────────────

export type NPCPhase = 'greeting' | 'info_exchange' | 'challenge' | 'closure';
export type NPCEmotion = 'calm' | 'supportive' | 'pushing' | 'wrapping_up';

export interface NPCState {
  phase: NPCPhase;
  emotion: NPCEmotion;
  userAnxietyLevel: number; // 1–5
  npcUtterance: string;
  npcEmotion: NPCEmotion;
  turnCount: number;
  phaseHistory: NPCPhase[];
}

export interface NPCTransitionResult {
  state: NPCState;
  systemPrompt: string;
}

// ─── Phase ordering & logic ───────────────────────────────────────────

const PHASE_ORDER: NPCPhase[] = ['greeting', 'info_exchange', 'challenge', 'closure'];

const PHASE_EMOTION_MAP: Record<NPCPhase, NPCEmotion> = {
  greeting: 'calm',
  info_exchange: 'supportive',
  challenge: 'pushing',
  closure: 'wrapping_up',
};

/** How many turns to stay in each phase. High-anxiety learners get more turns. */
function turnsForPhase(phase: NPCPhase, anxietyLevel: number): number {
  const base: Record<NPCPhase, number> = {
    greeting: 2,
    info_exchange: 3,
    challenge: 3,
    closure: 2,
  };
  // If anxiety >= 4, double greeting/info turns to let the learner settle
  const extra = anxietyLevel >= 4 ? (phase === 'greeting' || phase === 'info_exchange' ? 2 : 1) : 0;
  return base[phase] + extra;
}

// ─── Initial state factory ────────────────────────────────────────────

export function createInitialNPCState(profile: LearnerProfile | null): NPCState {
  const anxiety = profile?.socialAnxiety ?? 3;
  return {
    phase: 'greeting',
    emotion: 'calm',
    userAnxietyLevel: anxiety,
    npcUtterance: '',
    npcEmotion: 'calm',
    turnCount: 0,
    phaseHistory: ['greeting'],
  };
}

// ─── Deterministic phase transition (no LLM needed) ───────────────────

export function computeNextPhase(state: NPCState): { phase: NPCPhase; emotion: NPCEmotion } {
  const currentIdx = PHASE_ORDER.indexOf(state.phase);
  const turnsNeeded = turnsForPhase(state.phase, state.userAnxietyLevel);

  // Count how many turns we've been in the current phase
  let turnsInPhase = 0;
  for (let i = state.phaseHistory.length - 1; i >= 0; i--) {
    if (state.phaseHistory[i] === state.phase) turnsInPhase++;
    else break;
  }

  if (turnsInPhase >= turnsNeeded && currentIdx < PHASE_ORDER.length - 1) {
    const nextPhase = PHASE_ORDER[currentIdx + 1];
    return { phase: nextPhase, emotion: PHASE_EMOTION_MAP[nextPhase] };
  }

  // Override emotion for high-anxiety learners
  if (state.userAnxietyLevel >= 4 && state.phase === 'challenge') {
    return { phase: state.phase, emotion: 'supportive' };
  }

  return { phase: state.phase, emotion: PHASE_EMOTION_MAP[state.phase] };
}

// ─── Build the system prompt for the LLM call ─────────────────────────

export function buildNPCSystemPrompt(
  state: NPCState,
  lessonTitle: string,
  environment: string,
  profile: LearnerProfile | null
): string {
  const anxietyDesc =
    state.userAnxietyLevel >= 4 ? 'very anxious — be extra gentle and encouraging' :
    state.userAnxietyLevel >= 3 ? 'moderately anxious — be patient and supportive' :
    'relatively calm — you can be natural and slightly challenging';

  const emotionInstruction: Record<NPCEmotion, string> = {
    calm: 'Speak in a calm, relaxed, welcoming tone.',
    supportive: 'Be warm, encouraging, lean in emotionally, validate their efforts.',
    pushing: 'Gently challenge them — ask follow-up questions or introduce a small complication.',
    wrapping_up: 'Start wrapping up the conversation naturally, summarize what was discussed, be warm.',
  };

  return `You are an NPC character in a "${environment}" simulation helping an ESL learner practice "${lessonTitle}".

CURRENT PHASE: ${state.phase}
LEARNER ANXIETY LEVEL: ${state.userAnxietyLevel}/5 (${anxietyDesc})
YOUR EMOTION: ${state.npcEmotion}
TURN: ${state.turnCount + 1}

EMOTION INSTRUCTION: ${emotionInstruction[state.npcEmotion]}

${profile ? `LEARNER CONTEXT:
- Speaking level: ${profile.speakingLevel}/5
- Self-efficacy: ${profile.selfEfficacy}/5
- Labels: ${profile.labels.join(', ')}` : ''}

RULES:
- Reply with ONE short, natural line the NPC speaks now (1-2 sentences max).
- Stay in character for the ${environment} setting.
- Do NOT break character or mention you are an AI.
- Match your language complexity to the learner's speaking level.
- If the learner seems stuck, offer a gentle prompt or rephrase.`;
}

// ─── Main transition function (async — calls LLM) ─────────────────────

export async function nextNPCState(
  previousState: NPCState,
  userMessage: string,
  learnerProfile: LearnerProfile | null,
  lessonTitle: string,
  environment: string,
  chatEndpoint: string,
  apiKey: string
): Promise<NPCState> {
  // 1. Compute deterministic phase/emotion transition
  const { phase, emotion } = computeNextPhase(previousState);

  const newState: NPCState = {
    ...previousState,
    phase,
    emotion,
    npcEmotion: emotion,
    turnCount: previousState.turnCount + 1,
    phaseHistory: [...previousState.phaseHistory, phase],
    npcUtterance: '', // will be filled by LLM
  };

  // Update anxiety from profile if available
  if (learnerProfile) {
    newState.userAnxietyLevel = learnerProfile.socialAnxiety;
  }

  // 2. Build system prompt and call LLM
  const systemPrompt = buildNPCSystemPrompt(newState, lessonTitle, environment, learnerProfile);

  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  // Add conversation context (last few turns)
  if (previousState.npcUtterance) {
    messages.push({ role: 'assistant', content: previousState.npcUtterance });
  }
  if (userMessage) {
    messages.push({ role: 'user', content: userMessage });
  }

  try {
    const resp = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages,
        lesson: {
          id: 'npc-sim',
          title: lessonTitle,
          environment,
          modules: [],
          difficulty: newState.userAnxietyLevel >= 4 ? 'easy' : 'medium',
          psyTargets: learnerProfile?.labels || [],
        },
        learnerProfile: learnerProfile ? {
          socialAnxiety: learnerProfile.socialAnxiety,
          speakingLevel: learnerProfile.speakingLevel,
          selfEfficacy: learnerProfile.selfEfficacy,
          labels: learnerProfile.labels,
        } : undefined,
      }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error(`LLM error: ${resp.status}`);
    }

    // Parse SSE stream to get full utterance
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let utterance = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) utterance += content;
        } catch {
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    newState.npcUtterance = utterance.trim() || getFallbackUtterance(newState.phase, environment);
  } catch (error) {
    console.error('[NPC Engine] LLM call failed:', error);
    newState.npcUtterance = getFallbackUtterance(newState.phase, environment);
  }

  return newState;
}

// ─── Fallback utterances ──────────────────────────────────────────────

function getFallbackUtterance(phase: NPCPhase, environment: string): string {
  const fallbacks: Record<NPCPhase, Record<string, string>> = {
    greeting: {
      airport: "Hi there! Waiting for your flight too? Where are you headed?",
      cafe: "Hey! Is this seat taken? The coffee here is really good.",
      job_interview: "Good morning! Thanks for coming in today. Please, have a seat.",
      flatshare: "Hi! You must be here about the room. Come on in!",
      default: "Hello! Nice to meet you. How are you doing today?",
    },
    info_exchange: {
      airport: "My flight's been delayed an hour. Do you know if there's a good café near the gate?",
      cafe: "I come here every morning before work. What do you usually order?",
      job_interview: "So, tell me a bit about yourself and why you're interested in this position.",
      flatshare: "The room is just down the hall. The rent includes water and internet.",
      default: "That's interesting! Can you tell me more about that?",
    },
    challenge: {
      airport: "Oh no, I think they just changed our gate! Can you check the board for me?",
      cafe: "Actually, I'm trying to find a conversation partner for English practice. Would you be interested?",
      job_interview: "Can you describe a time when you had to solve a difficult problem at work?",
      flatshare: "There's one thing — we have a house meeting every Sunday. How do you feel about that?",
      default: "Here's something a bit tricky — what would you do in this situation?",
    },
    closure: {
      airport: "Looks like they're starting to board. It was really nice chatting with you!",
      cafe: "I should get going, but this was a lovely chat. Maybe we'll run into each other again!",
      job_interview: "Thank you so much for your time. We'll be in touch soon. Do you have any questions for me?",
      flatshare: "Well, I think you'd be a great fit! Let me know what you decide.",
      default: "It was great talking with you. Have a wonderful day!",
    },
  };

  return fallbacks[phase][environment] || fallbacks[phase].default;
}

// ─── Check if conversation is complete ────────────────────────────────

export function isConversationComplete(state: NPCState): boolean {
  return state.phase === 'closure' && state.turnCount >= 2 &&
    state.phaseHistory.filter(p => p === 'closure').length >= 2;
}
