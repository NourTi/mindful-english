import { LessonContent } from '@/types/learning';

export const sampleLessons: LessonContent[] = [
  {
    id: 'restaurant-basics',
    title: 'At the Restaurant',
    description: 'Learn essential vocabulary and phrases for ordering food and dining out.',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    contentVariants: {
      visual: {
        type: 'visual',
        images: [
          '/placeholder.svg', // Menu image
          '/placeholder.svg', // Waiter serving
          '/placeholder.svg', // Food items
        ],
        infographics: [
          'Common restaurant phrases infographic',
          'Menu vocabulary breakdown',
        ],
        videoUrl: undefined,
        vrScenarioId: undefined,
      },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/restaurant-dialogue.mp3',
        transcriptHighlights: [
          '"Good evening, table for two please."',
          '"May I see the menu?"',
          '"I would like to order the pasta."',
          '"Could I have the bill, please?"',
        ],
        pronunciationGuide: [
          'menu /ˈmenjuː/',
          'waiter /ˈweɪtər/',
          'reservation /ˌrezərˈveɪʃən/',
          'appetizer /ˈæpɪtaɪzər/',
        ],
      },
      reading: {
        type: 'reading',
        mainText: `Welcome to restaurant English! In this lesson, we'll learn the essential vocabulary and phrases you need to confidently order food and interact with restaurant staff.

**Key Vocabulary:**
- **Menu** - A list of food and drinks available
- **Appetizer** - A small dish before the main course
- **Main course** - The primary dish of a meal
- **Dessert** - Sweet food eaten after the main course
- **Bill/Check** - The paper showing what you need to pay

**Essential Phrases:**
When you arrive: "Good evening, I have a reservation under [name]."
To get attention: "Excuse me, could I please..."
To order: "I would like..." or "I'll have..."
To ask about food: "What do you recommend?"
When finished: "Could I have the bill, please?"

**Cultural Tip:**
In English-speaking countries, it's polite to wait to be seated and to say "please" and "thank you" when interacting with staff.`,
        grammarRules: [
          'Use "would like" for polite requests: "I would like a coffee."',
          'Use "could" for polite questions: "Could I have the menu?"',
          'Use "please" at the end: "The pasta, please."',
        ],
        exercises: [
          'Fill in: "_____ I have the menu, please?"',
          'Choose: I (would like / want) a table for two.',
          'Reorder: please / bill / the / I / have / could',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'restaurant-roleplay',
        rolePlayPrompts: [
          'You enter a restaurant. Greet the host and ask for a table.',
          'The waiter brings the menu. Ask about today\'s special.',
          'Order your meal, including a drink and main course.',
          'You finished eating. Ask for the bill politely.',
        ],
        physicalActivities: [
          'Practice saying "Could I have..." with hand gestures',
          'Role-play with a partner taking turns as customer and waiter',
          'Create a mock menu and practice ordering from it',
        ],
      },
    },
    semanticAnchors: [
      {
        newWord: 'menu',
        definition: 'A list of food and drinks available at a restaurant',
        contextualImage: '/placeholder.svg',
        relatedConcepts: ['food', 'restaurant', 'order'],
        personalizedExample: 'When you go to your favorite local restaurant, the menu shows all the dishes you can choose from.',
      },
      {
        newWord: 'appetizer',
        definition: 'A small dish served before the main meal',
        contextualImage: '/placeholder.svg',
        relatedConcepts: ['food', 'starter', 'small plate'],
        personalizedExample: 'Before your main dinner, you might have an appetizer like soup or salad.',
      },
      {
        newWord: 'reservation',
        definition: 'An arrangement to have a table kept for you',
        contextualImage: '/placeholder.svg',
        relatedConcepts: ['booking', 'appointment', 'table'],
        personalizedExample: 'For popular restaurants, you call ahead to make a reservation so they save a table for you.',
      },
    ],
    assessmentQuestions: [
      {
        id: 'q1',
        question: 'How do you politely ask for the menu?',
        options: ['Give me menu', 'Menu please give', 'Could I have the menu, please?', 'Menu want'],
        correctAnswer: 2,
        explanation: 'We use "Could I have..." to make polite requests in English.',
        growthMindsetFeedback: {
          correct: 'Perfect! You\'ve mastered the polite request pattern.',
          incorrect: 'Not yet - remember, "Could I have..." is the polite way to ask. You\'re learning!',
        },
      },
      {
        id: 'q2',
        question: 'What is an appetizer?',
        options: ['The main meal', 'A small dish before the main course', 'The bill', 'A drink'],
        correctAnswer: 1,
        explanation: 'An appetizer is a small dish served before the main course to stimulate appetite.',
        growthMindsetFeedback: {
          correct: 'Excellent! Your vocabulary is growing!',
          incorrect: 'Think about the word "appetite" - an appetizer opens your appetite before the main meal.',
        },
      },
      {
        id: 'q3',
        question: 'Complete: "I _____ like the pasta, please."',
        options: ['want', 'would', 'am', 'have'],
        correctAnswer: 1,
        explanation: '"Would like" is the polite form of "want" in English.',
        growthMindsetFeedback: {
          correct: 'You\'re getting the hang of polite English!',
          incorrect: 'Close! "Would like" is more polite than "want". Keep practicing!',
        },
      },
      {
        id: 'q4',
        question: 'How do you ask for the bill at the end of a meal?',
        options: ['Bill now!', 'I want pay', 'Could I have the bill, please?', 'Money give'],
        correctAnswer: 2,
        explanation: 'Using "Could I have... please?" is the polite way to request something.',
        growthMindsetFeedback: {
          correct: 'Wonderful! You sound like a native speaker!',
          incorrect: 'Remember the pattern: "Could I have + [thing] + please?"',
        },
      },
    ],
  },
  {
    id: 'greetings-intro',
    title: 'Greetings & Introductions',
    description: 'Master the art of introducing yourself and greeting others in English.',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    contentVariants: {
      visual: {
        type: 'visual',
        images: [
          '/placeholder.svg',
          '/placeholder.svg',
        ],
        infographics: ['Greeting flowchart', 'Formal vs informal greetings'],
        videoUrl: undefined,
        vrScenarioId: undefined,
      },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/greetings.mp3',
        transcriptHighlights: [
          '"Hello, my name is Sarah. Nice to meet you!"',
          '"Good morning! How are you today?"',
          '"Hi there! I\'m John. What\'s your name?"',
        ],
        pronunciationGuide: [
          'hello /həˈloʊ/',
          'nice /naɪs/',
          'pleased /pliːzd/',
        ],
      },
      reading: {
        type: 'reading',
        mainText: `**Greetings & Introductions**

Meeting new people is an essential part of life. Let's learn how to do it confidently in English!

**Formal Greetings:**
- "Good morning/afternoon/evening"
- "How do you do?"
- "It's a pleasure to meet you"

**Informal Greetings:**
- "Hi!" or "Hey!"
- "What's up?"
- "Nice to meet you!"

**Introducing Yourself:**
- "My name is [name]"
- "I'm [name]"
- "Call me [nickname]"

**Responding to Introductions:**
- "Nice to meet you too!"
- "Pleased to meet you"
- "Great to meet you!"`,
        grammarRules: [
          'Use "I\'m" as the short form of "I am"',
          'Use possessive "my" for things that belong to you: "my name"',
        ],
        exercises: [
          'Practice: "Hi, ____ name is [your name]."',
          'Respond to: "Nice to meet you!"',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'greeting-practice',
        rolePlayPrompts: [
          'You meet someone at a party. Introduce yourself.',
          'You\'re starting a new job. Greet your colleagues formally.',
          'You see a friend. Greet them casually.',
        ],
        physicalActivities: [
          'Practice a handshake while saying "Nice to meet you"',
          'Role-play different greeting scenarios',
        ],
      },
    },
    semanticAnchors: [
      {
        newWord: 'greeting',
        definition: 'Words or actions used when meeting someone',
        relatedConcepts: ['hello', 'welcome', 'meeting'],
        personalizedExample: 'When you see a friend, your greeting might be "Hey!" or "Hi there!"',
      },
    ],
    assessmentQuestions: [
      {
        id: 'g1',
        question: 'Which is a formal greeting?',
        options: ['Hey!', 'What\'s up?', 'Good morning', 'Yo!'],
        correctAnswer: 2,
        explanation: '"Good morning" is appropriate in formal settings like offices or meetings.',
        growthMindsetFeedback: {
          correct: 'Excellent! You understand the difference between formal and informal.',
          incorrect: 'Think about what you\'d say to your boss vs. your friend.',
        },
      },
    ],
  },
];
