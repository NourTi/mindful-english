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
  // --- Task-Oriented Booking & Service Missions (MultiWOZ-style) ---
  // Hotel
  {
    id: 21,
    title: "Book a Hotel Room",
    difficulty: "Medium",
    desc: "Call a hotel to book a double room for 3 nights. Ask about breakfast, Wi-Fi, and parking. Confirm the total price.",
    target_role: "Hotel Receptionist",
    icon: "🛏️"
  },
  {
    id: 22,
    title: "Change Your Reservation",
    difficulty: "Hard",
    desc: "You need to extend your stay by 2 nights and switch to a room with a sea view. Negotiate a discount for the longer stay.",
    target_role: "Hotel Front Desk Manager",
    icon: "🔄"
  },
  {
    id: 23,
    title: "Hotel Complaint",
    difficulty: "Hard",
    desc: "The room is noisy, the shower doesn't work, and there are no clean towels. Complain politely and ask to be moved.",
    target_role: "Night Shift Manager",
    icon: "😤"
  },
  // Restaurant
  {
    id: 24,
    title: "Reserve a Table",
    difficulty: "Easy",
    desc: "Book a table for 4 at an Italian restaurant for Friday evening. Ask about dietary options and the dress code.",
    target_role: "Restaurant Host",
    icon: "🍽️"
  },
  {
    id: 25,
    title: "Order a Full Dinner",
    difficulty: "Medium",
    desc: "Order starters, mains, and desserts for your group. One friend is vegetarian, another has a nut allergy. Handle the details.",
    target_role: "Experienced Waiter",
    icon: "📋"
  },
  {
    id: 26,
    title: "Send It Back",
    difficulty: "Hard",
    desc: "Your steak is raw inside, the soup is cold, and you were charged for a dish you didn't order. Handle it diplomatically.",
    target_role: "Defensive Head Waiter",
    icon: "🥩"
  },
  // Train & Transport
  {
    id: 27,
    title: "Buy a Train Ticket",
    difficulty: "Easy",
    desc: "Buy a return ticket to Manchester. Ask about departure times, platforms, and whether you need to change trains.",
    target_role: "Ticket Office Clerk",
    icon: "🚆"
  },
  {
    id: 28,
    title: "Missed Connection",
    difficulty: "Medium",
    desc: "You missed your connecting train due to a delay. Find the next option, ask about compensation, and rebook.",
    target_role: "Station Information Agent",
    icon: "🕐"
  },
  {
    id: 29,
    title: "Book a Sleeper Train",
    difficulty: "Hard",
    desc: "Book an overnight sleeper cabin from Paris to Barcelona. Ask about meals, luggage, and border checks.",
    target_role: "International Rail Agent",
    icon: "🌙"
  },
  // Taxi & Rideshare
  {
    id: 30,
    title: "Call a Taxi",
    difficulty: "Easy",
    desc: "Call for a taxi to the airport. Give your address, ask the price, and confirm the pickup time.",
    target_role: "Taxi Dispatcher",
    icon: "🚕"
  },
  {
    id: 31,
    title: "Wrong Route Dispute",
    difficulty: "Hard",
    desc: "The driver took a longer route and the meter is too high. Challenge the fare and negotiate politely.",
    target_role: "Stubborn Taxi Driver",
    icon: "💸"
  },
  // Hospital & Health
  {
    id: 32,
    title: "ER Registration",
    difficulty: "Medium",
    desc: "You fell and injured your wrist. Register at the ER, describe the accident, and answer insurance questions.",
    target_role: "ER Intake Nurse",
    icon: "🏥"
  },
  {
    id: 33,
    title: "Pharmacy Visit",
    difficulty: "Easy",
    desc: "Ask the pharmacist for cold medicine. Describe your symptoms and ask about dosage and side effects.",
    target_role: "Pharmacist",
    icon: "💊"
  },
  {
    id: 34,
    title: "Schedule a Specialist",
    difficulty: "Medium",
    desc: "Call a clinic to schedule an appointment with a dermatologist. Discuss availability, referral letters, and costs.",
    target_role: "Medical Secretary",
    icon: "📅"
  },
  // Government & Admin
  {
    id: 35,
    title: "Visa Application",
    difficulty: "Hard",
    desc: "Apply for a student visa. Answer questions about your studies, finances, accommodation, and return plans.",
    target_role: "Immigration Officer",
    icon: "🛂"
  },
  {
    id: 36,
    title: "Register Your Address",
    difficulty: "Medium",
    desc: "Register at the town hall after moving. Bring your documents, answer questions, get your registration certificate.",
    target_role: "Municipal Clerk",
    icon: "🏛️"
  },
  // Real Estate
  {
    id: 37,
    title: "Flat Viewing",
    difficulty: "Medium",
    desc: "Visit a flat, ask about rent, deposit, contract length, utilities, and the neighborhood. Decide on the spot.",
    target_role: "Pushy Estate Agent",
    icon: "🏢"
  },
  {
    id: 38,
    title: "Report a Maintenance Issue",
    difficulty: "Medium",
    desc: "The heating is broken in your rented flat. Call the landlord, explain the problem, and arrange a repair visit.",
    target_role: "Busy Landlord",
    icon: "🔨"
  },
  // Travel Attractions
  {
    id: 39,
    title: "Museum Tour Booking",
    difficulty: "Easy",
    desc: "Book a guided tour at a museum. Ask about group discounts, available languages, and photography rules.",
    target_role: "Museum Ticket Agent",
    icon: "🎨"
  },
  {
    id: 40,
    title: "Lost Luggage Claim",
    difficulty: "Hard",
    desc: "Your suitcase didn't arrive at baggage claim. File a report, describe the bag, and arrange delivery to your hotel.",
    target_role: "Airline Baggage Agent",
    icon: "🧳"
  },
  // Expert Scenarios (original)
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
  },
  // Expert Task-Oriented
  {
    id: 41,
    title: "Insurance Claim Call",
    difficulty: "Expert",
    desc: "Your car was hit while parked. Call the insurance company, explain the situation, provide policy details, and negotiate the claim process.",
    target_role: "Insurance Claims Adjuster",
    icon: "📄"
  },
  {
    id: 42,
    title: "University Enrollment",
    difficulty: "Expert",
    desc: "Enroll in a foreign university program. Discuss credit transfers, tuition fees, scholarships, and accommodation options.",
    target_role: "University Admissions Officer",
    icon: "🎓"
  },
  {
    id: 43,
    title: "Legal Consultation",
    difficulty: "Expert",
    desc: "Consult a lawyer about a tenant rights dispute. Explain the issue, ask about your options, and discuss fees.",
    target_role: "Family Lawyer",
    icon: "⚖️"
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
