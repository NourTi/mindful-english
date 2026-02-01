export interface ImmergoMission {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  desc: string;
  target_role: string;
  icon?: string;
}

export const immergoMissions: ImmergoMission[] = [
  // Easy Scenarios
  {
    id: 0,
    title: "Say Hello",
    difficulty: "Easy",
    desc: "Introduce yourself and ask how they are.",
    target_role: "Excited Neighbor",
    icon: "👋"
  },
  {
    id: 5,
    title: "Order a Coffee",
    difficulty: "Easy",
    desc: "Order a coffee and a pastry to go.",
    target_role: "Flustered Barista",
    icon: "☕"
  },
  {
    id: 10,
    title: "At the Bakery",
    difficulty: "Easy",
    desc: "Buy fresh bread and croissants for breakfast.",
    target_role: "Friendly Baker",
    icon: "🥐"
  },
  {
    id: 11,
    title: "Ask the Time",
    difficulty: "Easy",
    desc: "Your phone is dead, ask a stranger for the time.",
    target_role: "Busy Commuter",
    icon: "⌚"
  },
  // Medium Scenarios
  {
    id: 1,
    title: "Buy a Bus Ticket",
    difficulty: "Medium",
    desc: "You need to get to the city center.",
    target_role: "Impatient Bus Driver",
    icon: "🚌"
  },
  {
    id: 2,
    title: "Order Dinner with Jack",
    difficulty: "Medium",
    desc: "Your flatmate is hungry, find out what he wants.",
    target_role: "Indecisive Flatmate",
    icon: "🍕"
  },
  {
    id: 6,
    title: "Return a Shirt",
    difficulty: "Medium",
    desc: "The size is wrong, you want a refund.",
    target_role: "Helpful Shop Assistant",
    icon: "👕"
  },
  {
    id: 12,
    title: "Hotel Check-in",
    difficulty: "Medium",
    desc: "Check into your hotel and ask about amenities.",
    target_role: "Concierge",
    icon: "🏨"
  },
  {
    id: 13,
    title: "Doctor's Appointment",
    difficulty: "Medium",
    desc: "Describe your symptoms to the doctor.",
    target_role: "Patient Doctor",
    icon: "🩺"
  },
  {
    id: 14,
    title: "At the Bank",
    difficulty: "Medium",
    desc: "Open a new account and ask about services.",
    target_role: "Bank Teller",
    icon: "🏦"
  },
  // Hard Scenarios
  {
    id: 3,
    title: "Ask for Directions",
    difficulty: "Hard",
    desc: "You are lost in Paris.",
    target_role: "Local Parisian",
    icon: "🗺️"
  },
  {
    id: 8,
    title: "Market Bargaining",
    difficulty: "Hard",
    desc: "Buy a souvenir for a cheaper price.",
    target_role: "Loud Street Vendor",
    icon: "🍎"
  },
  {
    id: 15,
    title: "File a Complaint",
    difficulty: "Hard",
    desc: "Your order arrived damaged, you want compensation.",
    target_role: "Customer Service Rep",
    icon: "📞"
  },
  {
    id: 16,
    title: "The Car Mechanic",
    difficulty: "Hard",
    desc: "Your car broke down, explain the problem.",
    target_role: "Skeptical Mechanic",
    icon: "🔧"
  },
  {
    id: 17,
    title: "Airport Emergency",
    difficulty: "Hard",
    desc: "You missed your flight and need rebooking.",
    target_role: "Stressed Airline Agent",
    icon: "✈️"
  },
  // Expert Scenarios
  {
    id: 4,
    title: "Negotiate Rent",
    difficulty: "Expert",
    desc: "The landlord is raising the price.",
    target_role: "Strict Landlord",
    icon: "🏠"
  },
  {
    id: 9,
    title: "Job Interview",
    difficulty: "Expert",
    desc: "Explain your strengths and weaknesses.",
    target_role: "Company Recruiter",
    icon: "💼"
  },
  {
    id: 18,
    title: "Business Presentation",
    difficulty: "Expert",
    desc: "Present your quarterly results to stakeholders.",
    target_role: "CEO & Board Members",
    icon: "📊"
  },
  {
    id: 19,
    title: "The Debate",
    difficulty: "Expert",
    desc: "Defend your position on a controversial topic.",
    target_role: "Political Opponent",
    icon: "🎤"
  },
  {
    id: 20,
    title: "Medical Emergency",
    difficulty: "Expert",
    desc: "Translate for a patient who doesn't speak the language.",
    target_role: "ER Doctor & Patient",
    icon: "🚑"
  }
];

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇦🇪' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
];

export type LearningMode = 'teacher' | 'immersive';

export interface MissionSession {
  mission: ImmergoMission;
  targetLanguage: typeof supportedLanguages[number];
  nativeLanguage: typeof supportedLanguages[number];
  mode: LearningMode;
}

export interface SessionResult {
  score: 1 | 2 | 3;
  feedback: string[];
  level: 'Tiro' | 'Proficiens' | 'Peritus';
  incomplete?: boolean;
}
