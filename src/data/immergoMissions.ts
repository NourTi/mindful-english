export interface ImmergoMission {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  desc: string;
  target_role: string;
  icon?: string;
}

export const immergoMissions: ImmergoMission[] = [
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
