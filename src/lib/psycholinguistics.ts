import { CognitiveProfile, LearningStyle, EmotionalFeedback } from '@/types/learning';

// Growth mindset feedback messages - NLP-informed
export const growthMindsetResponses = {
  correct: [
    "Brilliant! Your brain just made a new connection. 🧠",
    "You're building neural pathways with every correct answer!",
    "That's the growth mindset in action - you're learning!",
    "Notice how practice is making this easier?",
    "Your effort is literally changing your brain. Amazing!",
  ],
  incorrect: [
    "Not yet - but you're getting closer. Let's try focusing on the verb ending.",
    "This is a tricky one. Let's break it down together.",
    "Your brain is working on this - that's exactly how learning happens.",
    "Every mistake is teaching your brain something new.",
    "Let's approach this from a different angle.",
  ],
  encouragement: [
    "You're doing great. Take your time.",
    "Learning a language is a journey, not a race.",
    "Every expert was once a beginner.",
    "Your dedication is inspiring!",
  ],
};

// Anxiety reset protocol messages
export const anxietyResetMessages = [
  "This is challenging, and that's okay. Let's pause and take a breath.",
  "Let's step back for a moment. Your brain works best when relaxed.",
  "I notice this might be frustrating. Let's try something simpler first.",
  "Take a deep breath. Learning happens best when we're calm.",
];

// Breathing exercise prompts
export const breathingExercise = {
  intro: "Let's do a quick breathing exercise together.",
  inhale: "Breathe in slowly... 1... 2... 3... 4...",
  hold: "Hold gently... 1... 2...",
  exhale: "Now breathe out slowly... 1... 2... 3... 4... 5... 6...",
  outro: "Feel better? Let's continue when you're ready.",
};

// Get random message from category
export const getRandomMessage = (category: keyof typeof growthMindsetResponses): string => {
  const messages = growthMindsetResponses[category];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Determine emotional feedback based on user state
export const determineEmotionalFeedback = (
  consecutiveErrors: number,
  isCorrect: boolean
): EmotionalFeedback | null => {
  if (consecutiveErrors >= 3) {
    return {
      type: 'reset',
      message: anxietyResetMessages[Math.floor(Math.random() * anxietyResetMessages.length)],
      action: 'simplify',
    };
  }

  if (isCorrect) {
    return {
      type: 'encouragement',
      message: getRandomMessage('correct'),
      action: 'continue',
    };
  }

  return {
    type: 'encouragement',
    message: getRandomMessage('incorrect'),
    action: 'continue',
  };
};

// Calculate optimal chunk duration based on cognitive profile
export const calculateChunkDuration = (profile: CognitiveProfile): number => {
  const baseMinutes = 5;
  const anxietyModifier = (6 - profile.anxietyLevel) * 0.5; // Lower anxiety = longer focus
  const confidenceModifier = profile.confidenceLevel * 0.3;
  
  return Math.min(Math.max(baseMinutes + anxietyModifier + confidenceModifier, 3), 10);
};

// Get content priority based on learning style
export const getContentPriority = (style: LearningStyle): string[] => {
  const priorities: Record<LearningStyle, string[]> = {
    visual: ['images', 'infographics', 'video', 'vr', 'text'],
    auditory: ['audio', 'pronunciation', 'video', 'text', 'images'],
    reading: ['text', 'grammar', 'exercises', 'images', 'audio'],
    kinesthetic: ['interactive', 'roleplay', 'vr', 'video', 'text'],
  };
  
  return priorities[style];
};

// Semantic anchoring - connect new concepts to known ones
export const findSemanticConnections = (
  newConcept: string,
  knownConcepts: string[]
): string[] => {
  // In a real app, this would use NLP/embeddings
  // For now, return conceptually related terms
  return knownConcepts.filter(known => 
    newConcept.toLowerCase().includes(known.toLowerCase().substring(0, 3)) ||
    known.toLowerCase().includes(newConcept.toLowerCase().substring(0, 3))
  );
};
