import { LessonContent } from '@/types/learning';

export const sampleLessons: LessonContent[] = [
  // ── EXISTING ──────────────────────────────────
  {
    id: 'restaurant-basics',
    title: 'At the Restaurant',
    description: 'Learn essential vocabulary and phrases for ordering food and dining out.',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    contentVariants: {
      visual: {
        type: 'visual',
        images: [],
        infographics: [
          '"Could I have the menu, please?" → Polite request pattern',
          '"I would like the pasta" → Polite ordering',
          'Appetizer → Main Course → Dessert → Bill',
          '"What do you recommend?" → Asking for suggestions',
          'Formal: "I\'d like a table for two" → Informal: "Table for two, please"',
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
      { newWord: 'menu', definition: 'A list of food and drinks available at a restaurant', contextualImage: '/placeholder.svg', relatedConcepts: ['food', 'restaurant', 'order'], personalizedExample: 'When you go to your favorite local restaurant, the menu shows all the dishes you can choose from.' },
      { newWord: 'appetizer', definition: 'A small dish served before the main meal', contextualImage: '/placeholder.svg', relatedConcepts: ['food', 'starter', 'small plate'], personalizedExample: 'Before your main dinner, you might have an appetizer like soup or salad.' },
      { newWord: 'reservation', definition: 'An arrangement to have a table kept for you', contextualImage: '/placeholder.svg', relatedConcepts: ['booking', 'appointment', 'table'], personalizedExample: 'For popular restaurants, you call ahead to make a reservation so they save a table for you.' },
    ],
    assessmentQuestions: [
      { id: 'q1', question: 'How do you politely ask for the menu?', options: ['Give me menu', 'Menu please give', 'Could I have the menu, please?', 'Menu want'], correctAnswer: 2, explanation: 'We use "Could I have..." to make polite requests in English.', growthMindsetFeedback: { correct: 'Perfect! You\'ve mastered the polite request pattern.', incorrect: 'Not yet - remember, "Could I have..." is the polite way to ask. You\'re learning!' } },
      { id: 'q2', question: 'What is an appetizer?', options: ['The main meal', 'A small dish before the main course', 'The bill', 'A drink'], correctAnswer: 1, explanation: 'An appetizer is a small dish served before the main course to stimulate appetite.', growthMindsetFeedback: { correct: 'Excellent! Your vocabulary is growing!', incorrect: 'Think about the word "appetite" - an appetizer opens your appetite before the main meal.' } },
      { id: 'q3', question: 'Complete: "I _____ like the pasta, please."', options: ['want', 'would', 'am', 'have'], correctAnswer: 1, explanation: '"Would like" is the polite form of "want" in English.', growthMindsetFeedback: { correct: 'You\'re getting the hang of polite English!', incorrect: 'Close! "Would like" is more polite than "want". Keep practicing!' } },
      { id: 'q4', question: 'How do you ask for the bill at the end of a meal?', options: ['Bill now!', 'I want pay', 'Could I have the bill, please?', 'Money give'], correctAnswer: 2, explanation: 'Using "Could I have... please?" is the polite way to request something.', growthMindsetFeedback: { correct: 'Wonderful! You sound like a native speaker!', incorrect: 'Remember the pattern: "Could I have + [thing] + please?"' } },
    ],
  },
  {
    id: 'greetings-intro',
    title: 'Greetings & Introductions',
    description: 'Master the art of introducing yourself and greeting others in English.',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    contentVariants: {
      visual: { type: 'visual', images: [], infographics: ['Formal → "Good morning, how do you do?"', 'Informal → "Hey! What\'s up?"', '"My name is…" → "I\'m…" → "Call me…"', 'Response: "Nice to meet you!" → "Pleased to meet you" → "Great to meet you!"'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: { type: 'auditory', audioUrl: '/audio/greetings.mp3', transcriptHighlights: ['"Hello, my name is Sarah. Nice to meet you!"', '"Good morning! How are you today?"', '"Hi there! I\'m John. What\'s your name?"'], pronunciationGuide: ['hello /həˈloʊ/', 'nice /naɪs/', 'pleased /pliːzd/'] },
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
        grammarRules: ['Use "I\'m" as the short form of "I am"', 'Use possessive "my" for things that belong to you: "my name"'],
        exercises: ['Practice: "Hi, ____ name is [your name]."', 'Respond to: "Nice to meet you!"'],
      },
      kinesthetic: { type: 'kinesthetic', interactiveScenarioId: 'greeting-practice', rolePlayPrompts: ['You meet someone at a party. Introduce yourself.', 'You\'re starting a new job. Greet your colleagues formally.', 'You see a friend. Greet them casually.'], physicalActivities: ['Practice a handshake while saying "Nice to meet you"', 'Role-play different greeting scenarios'] },
    },
    semanticAnchors: [
      { newWord: 'greeting', definition: 'Words or actions used when meeting someone', relatedConcepts: ['hello', 'welcome', 'meeting'], personalizedExample: 'When you see a friend, your greeting might be "Hey!" or "Hi there!"' },
    ],
    assessmentQuestions: [
      { id: 'g1', question: 'Which is a formal greeting?', options: ['Hey!', 'What\'s up?', 'Good morning', 'Yo!'], correctAnswer: 2, explanation: '"Good morning" is appropriate in formal settings like offices or meetings.', growthMindsetFeedback: { correct: 'Excellent! You understand the difference between formal and informal.', incorrect: 'Think about what you\'d say to your boss vs. your friend.' } },
    ],
  },

  // ── NEW: GRAMMAR ─────────────────────────────
  {
    id: 'present-simple-vs-continuous',
    title: 'Present Simple vs. Present Continuous',
    description: 'Understand when to use "I work" versus "I am working" — one of the most common grammar challenges.',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    contentVariants: {
      visual: { type: 'visual', images: [], infographics: ['Present Simple: habits & routines → "I work every day"', 'Present Continuous: happening NOW → "I am working right now"', '"She plays tennis" → habit (every Saturday)', '"She is playing tennis" → right now (at this moment)', 'Signal words: always, usually, never → Present Simple', 'Signal words: now, currently, at the moment → Present Continuous', '❌ "I am liking this" → ✅ "I like this" (state verbs = no continuous)'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/present-tenses.mp3',
        transcriptHighlights: [
          '"I drink coffee every morning." (habit — Present Simple)',
          '"I am drinking coffee right now." (happening now — Present Continuous)',
          '"She works at a hospital." vs "She is working late tonight."',
        ],
        pronunciationGuide: ['usually /ˈjuːʒuəli/', 'always /ˈɔːlweɪz/', 'currently /ˈkʌrəntli/'],
      },
      reading: {
        type: 'reading',
        mainText: `**Present Simple vs. Present Continuous**

These two tenses confuse many learners — but the rule is simpler than you think!

**Present Simple** — for habits, routines, and facts:
- "I **work** from 9 to 5."
- "Water **boils** at 100°C."
- "She **plays** tennis every Saturday."

Signal words: always, usually, often, sometimes, never, every day/week/year

**Present Continuous** — for actions happening right now or temporary situations:
- "I **am working** on a project this week."
- "Look! It **is raining**."
- "They **are staying** with us until Friday."

Signal words: now, right now, at the moment, currently, today, this week

**Common Mistakes:**
❌ "I am liking this song." → ✅ "I **like** this song." (state verbs don't use continuous)
❌ "She work every day." → ✅ "She **works** every day." (don't forget the -s!)`,
        grammarRules: [
          'Present Simple: Subject + base verb (+s/es for he/she/it)',
          'Present Continuous: Subject + am/is/are + verb-ing',
          'State verbs (like, know, want, need) usually don\'t take the continuous form.',
        ],
        exercises: [
          'Fill in: "She _____ (go) to the gym every Monday."',
          'Fill in: "Right now, I _____ (study) English."',
          'Correct the error: "He is knowing the answer."',
          'Choose: "They (play / are playing) football at the moment."',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'tense-sorting',
        rolePlayPrompts: [
          'Describe your daily routine using Present Simple.',
          'Look around the room and describe what people are doing right now using Present Continuous.',
          'Tell your partner three things you always do and one thing you are doing this week.',
        ],
        physicalActivities: [
          'Sort sentence cards into "Present Simple" and "Present Continuous" piles',
          'Act out an action — your partner describes it in Present Continuous',
          'Write your weekly schedule using Present Simple',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'routine', definition: 'A regular series of actions you do every day or week', relatedConcepts: ['habit', 'schedule', 'daily'], personalizedExample: 'Your morning routine might be: wake up, shower, eat breakfast.' },
      { newWord: 'temporary', definition: 'Lasting for a limited time, not permanent', relatedConcepts: ['short-term', 'brief', 'current'], personalizedExample: 'A temporary job is one that lasts only a few weeks or months.' },
      { newWord: 'state verb', definition: 'A verb that describes a state rather than an action (e.g., know, like, believe)', relatedConcepts: ['non-action', 'mental', 'emotion'], personalizedExample: 'You say "I know the answer" — not "I am knowing the answer."' },
    ],
    assessmentQuestions: [
      { id: 'ps1', question: 'Which sentence is correct?', options: ['She is working every Monday.', 'She works every Monday.', 'She work every Monday.', 'She are working every Monday.'], correctAnswer: 1, explanation: '"Every Monday" is a routine, so we use Present Simple with -s for she.', growthMindsetFeedback: { correct: 'Great job spotting the signal word!', incorrect: '"Every Monday" tells you it\'s a routine — use Present Simple.' } },
      { id: 'ps2', question: 'Fill in: "Look! The baby _____."', options: ['sleeps', 'is sleeping', 'sleep', 'sleeping'], correctAnswer: 1, explanation: '"Look!" signals something happening right now — use Present Continuous.', growthMindsetFeedback: { correct: 'You nailed it!', incorrect: '"Look!" means it\'s happening now — that\'s Present Continuous.' } },
      { id: 'ps3', question: 'Which verb should NOT be used in the continuous form?', options: ['run', 'eat', 'know', 'write'], correctAnswer: 2, explanation: '"Know" is a state verb — we say "I know" not "I am knowing."', growthMindsetFeedback: { correct: 'Excellent — you understand state verbs!', incorrect: 'State verbs (know, like, believe) describe a state, not an action in progress.' } },
      { id: 'ps4', question: '"I _____ English at the moment."', options: ['study', 'am studying', 'studies', 'studying'], correctAnswer: 1, explanation: '"At the moment" signals Present Continuous: am/is/are + verb-ing.', growthMindsetFeedback: { correct: 'Perfect use of signal words!', incorrect: '"At the moment" = right now → Present Continuous.' } },
    ],
  },

  // ── NEW: PAST TENSES ─────────────────────────
  {
    id: 'past-simple-vs-present-perfect',
    title: 'Past Simple vs. Present Perfect',
    description: 'Learn when to say "I went" versus "I have been" — and never confuse them again.',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    contentVariants: {
      visual: { type: 'visual', images: [], infographics: ['Past Simple: finished action with a time → "I visited Paris last year"', 'Present Perfect: experience, no specific time → "I have visited Paris"', '"I ate breakfast" → finished, specific time (this morning)', '"I have eaten breakfast" → result matters now (I\'m not hungry)', 'Signal: yesterday, last week, in 2020 → Past Simple', 'Signal: ever, never, already, yet, just → Present Perfect', '"Did you see that movie?" → specific occasion', '"Have you ever seen that movie?" → any time in your life'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/past-tenses.mp3',
        transcriptHighlights: [
          '"I visited Paris last year." (finished — Past Simple)',
          '"I have visited Paris three times." (life experience — Present Perfect)',
          '"Did you see that movie?" vs "Have you ever seen that movie?"',
        ],
        pronunciationGuide: ['visited /ˈvɪzɪtɪd/', 'been /biːn/', 'already /ɔːlˈredi/', 'yesterday /ˈjestərdeɪ/'],
      },
      reading: {
        type: 'reading',
        mainText: `**Past Simple vs. Present Perfect**

**Past Simple** — for completed actions at a specific time in the past:
- "I **lived** in London **in 2019**."
- "She **graduated** **last June**."
- "We **didn't go** to the party **yesterday**."

Signal words: yesterday, last week/month/year, in 2020, ago, when I was young

**Present Perfect** — for experiences, changes, or actions connected to the present:
- "I **have lived** in three countries." (life experience — when doesn't matter)
- "She **has just finished** her homework." (recent action)
- "We **haven't seen** that movie **yet**."

Signal words: ever, never, already, yet, just, so far, recently, since, for

**Key Difference:**
- Past Simple = WHEN matters → "I ate breakfast **at 8 AM**."
- Present Perfect = EXPERIENCE matters → "I **have eaten** sushi before."`,
        grammarRules: [
          'Past Simple: Subject + verb-ed (regular) or irregular past form',
          'Present Perfect: Subject + have/has + past participle',
          'Use Past Simple when the time is specified; Present Perfect when the time is unspecified or irrelevant.',
        ],
        exercises: [
          'Fill in: "I _____ (visit) Japan in 2022."',
          'Fill in: "She _____ (never / try) Indian food."',
          'Choose: "We (went / have gone) there last weekend."',
          'Correct: "I have seen him yesterday."',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'past-tense-interview',
        rolePlayPrompts: [
          'Interview your partner about their life experiences using "Have you ever…?"',
          'Tell a story about what you did last weekend using Past Simple.',
          'Compare: tell one experience (Present Perfect) then give the details (Past Simple).',
        ],
        physicalActivities: [
          'Create a "life experience bingo" card and interview classmates',
          'Write a short diary entry about yesterday (Past Simple)',
          'Make a list of 5 things you have done this year (Present Perfect)',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'experience', definition: 'Something that has happened to you in your life', relatedConcepts: ['event', 'memory', 'life'], personalizedExample: '"Have you ever traveled abroad?" asks about your life experience.' },
      { newWord: 'past participle', definition: 'The third form of a verb (e.g., go → gone, eat → eaten)', relatedConcepts: ['verb form', 'grammar', 'irregular'], personalizedExample: 'In "I have eaten," the word "eaten" is the past participle.' },
    ],
    assessmentQuestions: [
      { id: 'pp1', question: '"I _____ to Rome last summer."', options: ['have been', 'went', 'have gone', 'go'], correctAnswer: 1, explanation: '"Last summer" specifies when — use Past Simple.', growthMindsetFeedback: { correct: 'You spotted the time signal!', incorrect: '"Last summer" = specific past time → Past Simple.' } },
      { id: 'pp2', question: '"She _____ sushi before."', options: ['never tried', 'has never tried', 'never tries', 'is never trying'], correctAnswer: 1, explanation: '"Before" + life experience → Present Perfect with "has never tried."', growthMindsetFeedback: { correct: 'Excellent use of Present Perfect!', incorrect: 'Life experiences without a specific time use Present Perfect.' } },
      { id: 'pp3', question: 'Which sentence is WRONG?', options: ['"I have visited Tokyo."', '"I visited Tokyo in 2021."', '"I have visited Tokyo yesterday."', '"I visited Tokyo last month."'], correctAnswer: 2, explanation: 'You can\'t use Present Perfect with "yesterday" — it specifies a time.', growthMindsetFeedback: { correct: 'Great eye for grammar!', incorrect: 'Present Perfect + specific time (yesterday) = incorrect. Use Past Simple instead.' } },
    ],
  },

  // ── NEW: VOCABULARY BUILDER ──────────────────
  {
    id: 'phrasal-verbs-daily',
    title: 'Essential Phrasal Verbs',
    description: 'Master the 20 most common phrasal verbs used in everyday English conversations.',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    contentVariants: {
      visual: { type: 'visual', images: [], infographics: ['"Pick up" → collect / lift → "I\'ll pick up the kids at 3"', '"Give up" → stop trying → "Don\'t give up!"', '"Look forward to" → anticipate with pleasure → "I look forward to meeting you"', '"Turn down" → refuse → "She turned down the offer"', '"Figure out" → solve / understand → "I can\'t figure out this puzzle"', 'Separable: "Turn the TV off" or "Turn off the TV" ✅', 'Inseparable: "Look after the baby" ✅ but NOT "Look the baby after" ❌'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/phrasal-verbs.mp3',
        transcriptHighlights: [
          '"I need to look up this word in the dictionary."',
          '"Can you pick me up at the airport?"',
          '"We ran out of milk."',
          '"I\'m looking forward to the weekend."',
        ],
        pronunciationGuide: ['look up /lʊk ʌp/', 'pick up /pɪk ʌp/', 'run out of /rʌn aʊt ɒv/', 'figure out /ˈfɪɡjər aʊt/'],
      },
      reading: {
        type: 'reading',
        mainText: `**Essential Phrasal Verbs**

Phrasal verbs are combinations of a verb + preposition/adverb that create a new meaning. They're everywhere in English!

**GET:**
- **get up** — to rise from bed → "I get up at 7 AM."
- **get along (with)** — to have a good relationship → "I get along with my neighbors."
- **get over** — to recover → "She got over the flu quickly."

**LOOK:**
- **look up** — to search for information → "Look up the word in a dictionary."
- **look after** — to take care of → "She looks after her little brother."
- **look forward to** — to anticipate with excitement → "I'm looking forward to the holiday."

**TAKE:**
- **take off** — to remove / to depart → "Take off your shoes." / "The plane takes off at 6."
- **take up** — to start a new hobby → "He took up painting last year."

**RUN / TURN / PICK:**
- **run out of** — to have no more → "We ran out of coffee."
- **turn on/off** — to start/stop a device → "Turn off the lights."
- **pick up** — to collect someone → "I'll pick you up at 5."
- **figure out** — to understand or solve → "I can't figure out this problem."

**Tip:** Phrasal verbs sound much more natural than formal alternatives in everyday speech!`,
        grammarRules: [
          'Separable phrasal verbs: the object can go between verb and particle → "Pick it up" or "Pick up the phone."',
          'Inseparable phrasal verbs: the object must come after → "Look after the kids" (NOT "Look the kids after").',
          'When using a pronoun, separable verbs MUST be separated → "Turn it off" (NOT "Turn off it").',
        ],
        exercises: [
          'Fill in: "We _____ _____ of sugar. Can you buy some?"',
          'Rewrite formally: "She looks after her grandmother." → "She _____ her grandmother."',
          'Choose: "I need to (figure out / figure it out) this problem."',
          'Match: "turn on" = ?, "get up" = ?, "look forward to" = ?',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'phrasal-verb-charades',
        rolePlayPrompts: [
          'Act out a morning routine using as many phrasal verbs as possible.',
          'Your friend calls — they ran out of gas. Help them using phrasal verbs.',
          'You\'re planning a trip. Use "look forward to," "pick up," and "take off."',
        ],
        physicalActivities: [
          'Phrasal verb charades — act it out and your partner guesses',
          'Create a comic strip story using 5 phrasal verbs',
          'Write a text message to a friend using at least 3 phrasal verbs',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'phrasal verb', definition: 'A verb combined with a preposition or adverb that creates a new meaning', relatedConcepts: ['idiom', 'expression', 'collocation'], personalizedExample: '"Look up" means to search — completely different from "look" alone!' },
      { newWord: 'separable', definition: 'A phrasal verb where the object can go between the two parts', relatedConcepts: ['grammar', 'word order', 'pronoun'], personalizedExample: '"Pick up the book" or "Pick the book up" — both are correct.' },
      { newWord: 'inseparable', definition: 'A phrasal verb where the parts must stay together', relatedConcepts: ['grammar', 'fixed phrase'], personalizedExample: '"Look after the baby" — you can\'t say "Look the baby after."' },
    ],
    assessmentQuestions: [
      { id: 'pv1', question: '"We _____ _____ milk. The fridge is empty."', options: ['ran out of', 'ran off', 'ran up', 'ran into'], correctAnswer: 0, explanation: '"Ran out of" means to have no more of something.', growthMindsetFeedback: { correct: 'Perfect! You\'re mastering phrasal verbs!', incorrect: '"Run out of" = to have none left. Think of a container running empty.' } },
      { id: 'pv2', question: 'Which is correct with a pronoun?', options: ['Turn off it.', 'Turn it off.', 'Turn it.', 'Off turn it.'], correctAnswer: 1, explanation: 'With pronouns, separable phrasal verbs MUST be separated.', growthMindsetFeedback: { correct: 'You know the pronoun rule!', incorrect: 'With pronouns, the pronoun goes BETWEEN the verb and particle.' } },
      { id: 'pv3', question: '"I\'m really _____ _____ _____ the concert next week!"', options: ['looking forward to', 'looking up to', 'looking after to', 'looking out to'], correctAnswer: 0, explanation: '"Look forward to" means to anticipate something with excitement.', growthMindsetFeedback: { correct: 'Wonderful — very natural English!', incorrect: '"Look forward to" = excited anticipation. You\'ll remember it next time!' } },
      { id: 'pv4', question: '"Can you _____ the word in the dictionary?"', options: ['look up', 'look after', 'look out', 'look into'], correctAnswer: 0, explanation: '"Look up" means to search for information.', growthMindsetFeedback: { correct: 'You\'ve got it!', incorrect: '"Look up" = search for information. Think: looking UP at a bookshelf.' } },
    ],
  },

  // ── NEW: WRITING SKILLS ──────────────────────
  {
    id: 'email-writing-basics',
    title: 'Writing Professional Emails',
    description: 'Learn how to write clear, polite emails for work — from subject lines to sign-offs.',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    contentVariants: {
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg'], infographics: ['Email structure diagram', 'Formal vs informal email comparison'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/email-writing.mp3',
        transcriptHighlights: [
          '"Dear Mr. Smith, I am writing to inquire about..."',
          '"Please find attached the report."',
          '"I look forward to hearing from you."',
          '"Best regards, [Your Name]"',
        ],
        pronunciationGuide: ['inquiry /ɪnˈkwaɪəri/', 'attached /əˈtætʃt/', 'regarding /rɪˈɡɑːrdɪŋ/', 'sincerely /sɪnˈsɪrli/'],
      },
      reading: {
        type: 'reading',
        mainText: `**Writing Professional Emails**

A well-written email makes you look professional and helps you get results.

**Structure:**
1. **Subject line** — Clear and specific: "Meeting rescheduled to Friday 3 PM"
2. **Greeting** — "Dear [Name]," (formal) or "Hi [Name]," (semi-formal)
3. **Opening** — State your purpose: "I am writing to…" / "I wanted to follow up on…"
4. **Body** — Keep it concise. One idea per paragraph.
5. **Closing** — "Please let me know if you have any questions."
6. **Sign-off** — "Best regards," / "Kind regards," / "Sincerely,"

**Useful Phrases:**
- Requesting: "Could you please send me…?" / "I would appreciate it if…"
- Apologizing: "I apologize for the delay." / "Sorry for any inconvenience."
- Attaching files: "Please find attached…" / "I have attached… for your reference."
- Following up: "I wanted to follow up on our conversation about…"

**Common Mistakes:**
❌ "Dear Sir" (too generic) → ✅ Use their name
❌ "URGENT!!!" in subject → ✅ Be specific and calm
❌ Very long paragraphs → ✅ Keep each paragraph to 2-3 sentences`,
        grammarRules: [
          'Use "I am writing to…" (not "I write to…") to open formal emails.',
          'Use "Could you…?" and "Would you mind…?" for polite requests.',
          '"Please find attached" is correct (not "Please find the attached").',
        ],
        exercises: [
          'Write a subject line for: You need to reschedule a meeting.',
          'Rewrite informally: "I am writing to inquire about the position."',
          'Choose the better closing: (a) "Send me the file." (b) "Could you please send me the file?"',
          'Write a 3-sentence follow-up email for a job application.',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'email-writing-practice',
        rolePlayPrompts: [
          'Write an email to your boss requesting a day off next Friday.',
          'Reply to a colleague who sent you the wrong file — politely ask for the correct one.',
          'Write a follow-up email after a job interview thanking the interviewer.',
        ],
        physicalActivities: [
          'Rewrite a poorly-written email to make it professional',
          'Exchange emails with a partner and reply to each other',
          'Create a "phrase bank" card with useful email expressions',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'subject line', definition: 'The title of your email that tells the reader what it\'s about', relatedConcepts: ['title', 'heading', 'topic'], personalizedExample: 'A good subject line: "Meeting agenda for March 5" — clear and specific.' },
      { newWord: 'follow up', definition: 'To continue or check on something that was discussed before', relatedConcepts: ['check', 'remind', 'continue'], personalizedExample: '"I wanted to follow up on our conversation" means you\'re continuing a previous discussion.' },
      { newWord: 'sign-off', definition: 'The closing words before your name at the end of an email', relatedConcepts: ['closing', 'goodbye', 'regards'], personalizedExample: '"Best regards" and "Kind regards" are safe sign-offs for professional emails.' },
    ],
    assessmentQuestions: [
      { id: 'em1', question: 'Which is the best email opening?', options: ['Hey what\'s up', 'I am writing to inquire about the open position.', 'Give me information about the job.', 'I want to know about this.'], correctAnswer: 1, explanation: '"I am writing to…" is the standard professional email opening.', growthMindsetFeedback: { correct: 'Professional and polished!', incorrect: '"I am writing to…" is the go-to opening for professional emails.' } },
      { id: 'em2', question: 'Which sign-off is appropriate for a work email?', options: ['Love,', 'Best regards,', 'See ya,', 'Cheers mate,'], correctAnswer: 1, explanation: '"Best regards" is universally accepted in professional emails.', growthMindsetFeedback: { correct: 'You know your email etiquette!', incorrect: '"Best regards" is the safest and most professional sign-off.' } },
      { id: 'em3', question: 'How do you politely ask for a file?', options: ['Send me the file.', 'I need the file now.', 'Could you please send me the file?', 'File please.'], correctAnswer: 2, explanation: '"Could you please…?" is the polite way to make requests.', growthMindsetFeedback: { correct: 'Perfectly polite!', incorrect: 'Adding "Could you please…?" makes any request sound professional.' } },
    ],
  },

  // ── NEW: PRONUNCIATION ───────────────────────
  {
    id: 'pronunciation-minimal-pairs',
    title: 'Tricky Sounds: Minimal Pairs',
    description: 'Train your ear and mouth with confusing sound pairs like ship/sheep, bat/bet, and more.',
    difficulty: 'beginner',
    estimatedMinutes: 6,
    contentVariants: {
      visual: { type: 'visual', images: [], infographics: ['ship /ɪ/ ↔ sheep /iː/ — short vs long vowel', 'bat /æ/ ↔ bet /e/ — open vs slightly open mouth', 'full /ʊ/ ↔ fool /uː/ — short rounded vs long rounded', '/ɪ/ → Short, relaxed mouth position', '/iː/ → Long, smile mouth position', 'Practice: "The ship carries sheep across the sea"'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/minimal-pairs.mp3',
        transcriptHighlights: [
          'ship /ʃɪp/ vs sheep /ʃiːp/',
          'bat /bæt/ vs bet /bet/',
          'full /fʊl/ vs fool /fuːl/',
          'live /lɪv/ vs leave /liːv/',
        ],
        pronunciationGuide: [
          '/ɪ/ as in "ship" — short, relaxed mouth',
          '/iː/ as in "sheep" — long, smile position',
          '/æ/ as in "bat" — mouth wide open',
          '/e/ as in "bet" — mouth slightly open',
        ],
      },
      reading: {
        type: 'reading',
        mainText: `**Minimal Pairs: Training Your Ear**

Minimal pairs are two words that differ by only one sound. Mastering them improves both your listening and speaking!

**Short /ɪ/ vs Long /iː/:**
- ship ↔ sheep
- sit ↔ seat  
- live ↔ leave
- bit ↔ beat

**Short /æ/ vs /e/:**
- bat ↔ bet
- bad ↔ bed
- man ↔ men
- pan ↔ pen

**Short /ʊ/ vs Long /uː/:**
- full ↔ fool
- pull ↔ pool
- look ↔ Luke

**Tips for Practice:**
1. Listen to the pair, then repeat each word 3 times
2. Record yourself and compare to native audio
3. Use Elsa Speak or Rachel's English for feedback
4. Practice in sentences: "The ship carries sheep."`,
        grammarRules: [
          'Short vowels are quick and relaxed; long vowels are stretched.',
          'Context helps listeners understand which word you mean, but clarity matters!',
          'The difference between /ɪ/ and /iː/ is length AND mouth position.',
        ],
        exercises: [
          'Listen and choose: Is it "ship" or "sheep"?',
          'Say these pairs 5 times each: sit/seat, live/leave, bit/beat',
          'Write a sentence using both words: "The man ordered for the men."',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'minimal-pair-drill',
        rolePlayPrompts: [
          'Your partner says a word — guess which one of the pair they said.',
          'Practice ordering at a café: "I\'d like to sit in that seat by the pool."',
          'Record yourself saying 5 pairs and play them back.',
        ],
        physicalActivities: [
          'Use a mirror to watch your mouth shape for each sound',
          'Hold your hand in front of your mouth — feel the air difference',
          'Tongue twisters: "She sells seashells by the seashore"',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'minimal pair', definition: 'Two words that differ by only one sound', relatedConcepts: ['pronunciation', 'phonetics', 'sound'], personalizedExample: '"Ship" and "sheep" are a minimal pair — only the vowel sound is different.' },
      { newWord: 'vowel', definition: 'A speech sound made without blocking airflow (a, e, i, o, u)', relatedConcepts: ['sound', 'letter', 'pronunciation'], personalizedExample: 'English has 5 vowel letters but about 15 vowel sounds!' },
    ],
    assessmentQuestions: [
      { id: 'mp1', question: 'Which two words are a minimal pair?', options: ['cat / car', 'ship / sheep', 'dog / fog', 'run / fun'], correctAnswer: 1, explanation: '"Ship" and "sheep" differ by only one vowel sound: /ɪ/ vs /iː/.', growthMindsetFeedback: { correct: 'You\'ve got a great ear!', incorrect: 'A minimal pair differs by exactly ONE sound — "ship" /ɪ/ vs "sheep" /iː/.' } },
      { id: 'mp2', question: 'The difference between /ɪ/ and /iː/ is:', options: ['Tone', 'Length and mouth position', 'Volume', 'Stress'], correctAnswer: 1, explanation: '/ɪ/ is short and relaxed; /iː/ is long with a smile shape.', growthMindsetFeedback: { correct: 'Spot on!', incorrect: 'Short /ɪ/ = relaxed; long /iː/ = stretched with a smile.' } },
      { id: 'mp3', question: '"Bat" and "bet" differ in:', options: ['Consonant sound', 'Vowel sound', 'Number of syllables', 'Stress pattern'], correctAnswer: 1, explanation: 'The vowel changes from /æ/ to /e/ — everything else stays the same.', growthMindsetFeedback: { correct: 'Your phonetic awareness is growing!', incorrect: 'Only the vowel changes: bat /æ/ → bet /e/.' } },
    ],
  },

  // ── NEW: IDIOMS & EXPRESSIONS ────────────────
  {
    id: 'common-idioms',
    title: 'Everyday Idioms & Expressions',
    description: 'Sound more natural with common English idioms — from "break the ice" to "under the weather."',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    contentVariants: {
      visual: { type: 'visual', images: [], infographics: ['"Break the ice" → Start a conversation in an awkward situation', '"Under the weather" → Feeling sick or unwell', '"A piece of cake" → Something very easy to do', '"Hit the books" → Study hard', '"Over the moon" → Extremely happy', '"Call it a day" → Stop working for today', '"Butterflies in my stomach" → Nervous excitement'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/idioms.mp3',
        transcriptHighlights: [
          '"Let\'s break the ice — tell me about yourself!"',
          '"I\'m feeling under the weather today."',
          '"It\'s a piece of cake — don\'t worry!"',
          '"We need to hit the books before the exam."',
        ],
        pronunciationGuide: ['piece of cake /piːs əv keɪk/', 'under the weather /ˈʌndər ðə ˈweðər/', 'break the ice /breɪk ðə aɪs/'],
      },
      reading: {
        type: 'reading',
        mainText: `**Everyday Idioms & Expressions**

Idioms are phrases where the meaning is different from the literal words. Native speakers use them ALL the time!

**Social Situations:**
- **Break the ice** — Start a conversation in an awkward situation → "Let me break the ice: where are you from?"
- **Hit it off** — Get along well from the start → "We hit it off immediately."
- **On the same page** — Agree or have the same understanding → "Let's make sure we're on the same page."

**Feelings & Health:**
- **Under the weather** — Feeling sick → "I'm feeling under the weather today."
- **Over the moon** — Extremely happy → "She was over the moon about the promotion!"
- **Butterflies in my stomach** — Nervous excitement → "I had butterflies before the interview."

**Difficulty & Ease:**
- **A piece of cake** — Very easy → "The test was a piece of cake!"
- **Hit the books** — Study hard → "I need to hit the books tonight."
- **A blessing in disguise** — Something bad that turns out good → "Losing that job was a blessing in disguise."

**Time & Action:**
- **Better late than never** — It's better to do something late than not at all
- **Call it a day** — Stop working → "Let's call it a day — we've done enough."
- **The ball is in your court** — It's your turn to decide or act`,
        grammarRules: [
          'Idioms are fixed phrases — don\'t change the words (e.g., "a piece of cake," NOT "a slice of cake").',
          'Most idioms are informal — use them in conversation, not in academic writing.',
          'Learn idioms in context, not just as definitions.',
        ],
        exercises: [
          'Match: "piece of cake" = (a) easy (b) dessert (c) small',
          'Fill in: "After the awkward silence, she tried to _____ the _____."',
          'Write a short dialogue using at least 3 idioms.',
          'Replace the idiom with a plain phrase: "He\'s feeling under the weather."',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'idiom-scenarios',
        rolePlayPrompts: [
          'You\'re at a party and don\'t know anyone. Break the ice!',
          'Call your boss and say you\'re feeling under the weather.',
          'Tell your friend the exam was a piece of cake.',
        ],
        physicalActivities: [
          'Draw the literal meaning of 5 idioms — guess each other\'s drawings',
          'Idiom bingo — listen to conversations and mark off idioms you hear',
          'Create flashcards with the idiom on one side and meaning + example on the other',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'idiom', definition: 'A phrase whose meaning is different from the individual words', relatedConcepts: ['expression', 'figurative', 'phrase'], personalizedExample: '"It\'s raining cats and dogs" doesn\'t mean animals are falling — it means it\'s raining very hard!' },
      { newWord: 'figurative', definition: 'Using words in a non-literal way to create a vivid image', relatedConcepts: ['metaphor', 'symbolic', 'creative'], personalizedExample: '"Break the ice" is figurative — you\'re not actually breaking any ice!' },
    ],
    assessmentQuestions: [
      { id: 'id1', question: '"Under the weather" means:', options: ['In the rain', 'Feeling sick', 'Very cold', 'Outdoors'], correctAnswer: 1, explanation: '"Under the weather" is an idiom meaning to feel ill or unwell.', growthMindsetFeedback: { correct: 'You\'re speaking like a native!', incorrect: 'This idiom = feeling sick. Remember: idioms aren\'t literal!' } },
      { id: 'id2', question: '"The exam was a piece of cake" means:', options: ['There was cake at the exam', 'The exam was very easy', 'The exam was short', 'The exam was delicious'], correctAnswer: 1, explanation: '"A piece of cake" = something very easy to do.', growthMindsetFeedback: { correct: 'Easy as pie! (Another idiom!)', incorrect: '"Piece of cake" = very easy. Nothing to do with actual cake!' } },
      { id: 'id3', question: 'When should you "hit the books"?', options: ['When you\'re angry', 'When you need to study', 'When you want to exercise', 'When you\'re cleaning'], correctAnswer: 1, explanation: '"Hit the books" means to study hard or intensively.', growthMindsetFeedback: { correct: 'Time to hit the books — oh wait, you already know this!', incorrect: '"Hit the books" = study hard. No books were harmed!' } },
      { id: 'id4', question: '"Let\'s call it a day" means:', options: ['Let\'s name this day', 'Let\'s stop working', 'Let\'s phone someone', 'Let\'s celebrate'], correctAnswer: 1, explanation: '"Call it a day" means to stop working and finish for the day.', growthMindsetFeedback: { correct: 'Perfect — you can call it a day on this lesson!', incorrect: '"Call it a day" = stop working. Time to rest!' } },
    ],
  },

  // ── NEW: LISTENING COMPREHENSION ─────────────
  {
    id: 'listening-strategies',
    title: 'Listening Like a Pro',
    description: 'Develop strategies for understanding fast native speakers — podcasts, news, and conversations.',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    contentVariants: {
      visual: { type: 'visual', images: [], infographics: ['"Want to" → "wanna"', '"Going to" → "gonna"', '"Got to" → "gotta"', '"Did you" → "didja"', '"Let me" → "lemme"', 'Strategy 1: Listen for KEY WORDS (nouns + verbs)', 'Strategy 2: Use CONTEXT to fill in gaps', 'Strategy 3: Listen MULTIPLE times — main idea → details → phrases'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/listening-strategies.mp3',
        transcriptHighlights: [
          '"Wanna" = "Want to" → "I wanna go home."',
          '"Gonna" = "Going to" → "I\'m gonna study tonight."',
          '"Gotta" = "Got to / Have to" → "I gotta leave now."',
          '"Didja" = "Did you" → "Didja see that?"',
        ],
        pronunciationGuide: ['wanna /ˈwɒnə/', 'gonna /ˈɡɒnə/', 'gotta /ˈɡɒtə/', 'lemme /ˈlemi/'],
      },
      reading: {
        type: 'reading',
        mainText: `**Listening Like a Pro**

Can't understand native speakers? You're not alone. Here's why — and how to fix it.

**Why Native Speakers Sound Fast:**
They use **connected speech** — blending words together:
- "Want to" → "wanna"
- "Going to" → "gonna"
- "Got to" → "gotta"
- "Did you" → "didja"
- "Let me" → "lemme"

**Strategy 1: Listen for Key Words**
You don't need every word. Focus on nouns, verbs, and question words:
"_____ you _____ go _____ cinema _____ Friday?"
→ You can guess: "Do you want to go to the cinema on Friday?"

**Strategy 2: Use Context**
If someone says "wanna grab a coffee?" in an office, you know it's an invitation.

**Strategy 3: Listen Multiple Times**
1st listen: Get the main idea
2nd listen: Catch details  
3rd listen: Notice specific phrases

**Recommended Resources:**
- BBC 6 Minute English (beginner)
- ESL Pod (beginner)
- All Ears English (intermediate)
- This American Life (advanced)`,
        grammarRules: [
          '"Wanna," "gonna," and "gotta" are informal contractions — understand them but use them carefully.',
          'Connected speech is normal in ALL English dialects — it\'s not "sloppy" speaking.',
          'Focus on understanding meaning, not catching every single word.',
        ],
        exercises: [
          'Listen to a 2-minute podcast clip. Write down the 5 most important words you hear.',
          'Transcribe 30 seconds of a podcast. Compare with the official transcript.',
          'Find 3 examples of connected speech in a TV show episode.',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'listening-drill',
        rolePlayPrompts: [
          'Listen to your partner speak quickly — summarize what they said.',
          'Practice saying "wanna," "gonna," and "gotta" in natural sentences.',
          'Shadow a podcast: repeat what you hear immediately after the speaker.',
        ],
        physicalActivities: [
          'Shadowing exercise: play audio and speak along in real time',
          'Dictation race: listen and write as fast as you can',
          'Listen to a song — fill in the missing lyrics',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'connected speech', definition: 'The natural way native speakers blend words together when talking', relatedConcepts: ['pronunciation', 'fluency', 'natural'], personalizedExample: '"Want to" becomes "wanna" in connected speech — it\'s faster and more natural.' },
      { newWord: 'shadowing', definition: 'A technique where you repeat audio immediately after hearing it', relatedConcepts: ['practice', 'listening', 'speaking'], personalizedExample: 'Play a podcast and repeat every sentence right after the speaker — that\'s shadowing!' },
    ],
    assessmentQuestions: [
      { id: 'ls1', question: '"Gonna" is the connected form of:', options: ['Got to', 'Going to', 'Want to', 'Let me'], correctAnswer: 1, explanation: '"Gonna" = "going to" → "I\'m gonna study tonight."', growthMindsetFeedback: { correct: 'You\'re gonna ace this!', incorrect: '"Gonna" = "going to." You\'ll hear it everywhere now!' } },
      { id: 'ls2', question: 'What should you focus on first when listening?', options: ['Every single word', 'Grammar rules', 'Key words (nouns, verbs)', 'The speaker\'s accent'], correctAnswer: 2, explanation: 'Key words carry the main meaning — you can fill in the rest from context.', growthMindsetFeedback: { correct: 'Smart listening strategy!', incorrect: 'Focus on key words first — nouns and verbs carry the meaning.' } },
      { id: 'ls3', question: 'What is "shadowing"?', options: ['Reading silently', 'Repeating audio immediately after hearing it', 'Translating in your head', 'Writing what you hear'], correctAnswer: 1, explanation: 'Shadowing means repeating what you hear right away, improving both listening and speaking.', growthMindsetFeedback: { correct: 'Now try it with a podcast!', incorrect: 'Shadowing = repeat immediately after the speaker. It\'s like being their echo!' } },
    ],
  },

  // ── NEW: CONDITIONALS ────────────────────────
  {
    id: 'conditionals-first-second',
    title: 'If Clauses: First & Second Conditional',
    description: 'Master "If I have time, I will…" vs "If I had time, I would…" — real vs imaginary situations.',
    difficulty: 'intermediate',
    estimatedMinutes: 9,
    contentVariants: {
      visual: { type: 'visual', images: [], infographics: ['1st Conditional: If + Present Simple → will + base verb', '2nd Conditional: If + Past Simple → would + base verb', '"If it rains, I will take an umbrella." → REAL possibility', '"If I won the lottery, I would travel." → IMAGINARY situation', '1st: "If I have time, I will help." → I might have time', '2nd: "If I had time, I would help." → I don\'t have time', 'Remember: "If I were you…" (not "was" in formal English)'], videoUrl: undefined, vrScenarioId: undefined },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/conditionals.mp3',
        transcriptHighlights: [
          '"If it rains, I will take an umbrella." (possible — First Conditional)',
          '"If I won the lottery, I would travel the world." (imaginary — Second Conditional)',
          '"If she studies, she will pass." vs "If she studied more, she would pass."',
        ],
        pronunciationGuide: ['would /wʊd/', 'will /wɪl/', 'if /ɪf/', 'could /kʊd/'],
      },
      reading: {
        type: 'reading',
        mainText: `**First & Second Conditional**

**First Conditional** — Real, possible situations (likely to happen):
Structure: If + Present Simple, will + base verb

- "If it **rains**, I **will take** an umbrella."
- "If you **study**, you **will pass** the test."
- "If we **leave** now, we **will arrive** on time."

Use for: real plans, warnings, promises, likely results.

**Second Conditional** — Imaginary, unlikely, or hypothetical situations:
Structure: If + Past Simple, would + base verb

- "If I **won** the lottery, I **would buy** a house."
- "If I **were** you, I **would accept** the offer." (Note: "were" for all subjects)
- "If she **had** more time, she **would learn** French."

Use for: dreams, advice, impossible/unlikely situations.

**Key Difference:**
- First: "If I **have** time, I **will** help." (I might have time — realistic)
- Second: "If I **had** time, I **would** help." (I don't have time — imaginary)

**Note:** In Second Conditional, we use "were" (not "was") for formal English:
- "If I **were** rich…" (not "If I was rich…" in formal contexts)`,
        grammarRules: [
          'First Conditional: If + Present Simple → will + base verb',
          'Second Conditional: If + Past Simple → would + base verb',
          'Use "were" (not "was") in formal Second Conditional: "If I were you…"',
        ],
        exercises: [
          'Complete (1st): "If it _____ (snow), we _____ (stay) home."',
          'Complete (2nd): "If I _____ (be) a bird, I _____ (fly) everywhere."',
          'Which conditional? "If I had a million dollars, I would donate half."',
          'Fix: "If I will see him, I will tell him." → ?',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'conditional-choices',
        rolePlayPrompts: [
          'Plan your weekend using First Conditional: "If the weather is nice, I will…"',
          'Dream big using Second Conditional: "If I could live anywhere, I would…"',
          'Give your partner advice: "If I were you, I would…"',
        ],
        physicalActivities: [
          'Chain game: each person adds an if-clause to continue the story',
          'Write 5 First Conditional sentences about tomorrow',
          'Write 5 Second Conditional sentences about impossible wishes',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'conditional', definition: 'A sentence structure that describes what happens IF something else happens', relatedConcepts: ['if-clause', 'result', 'condition'], personalizedExample: '"If you practice, you will improve" — the result depends on the condition.' },
      { newWord: 'hypothetical', definition: 'Imagined or not real — used for "what if" situations', relatedConcepts: ['imaginary', 'unreal', 'possible'], personalizedExample: '"If I were a millionaire…" is hypothetical — it\'s not real, just imagined.' },
    ],
    assessmentQuestions: [
      { id: 'cd1', question: '"If it rains, I _____ an umbrella."', options: ['would take', 'will take', 'took', 'taking'], correctAnswer: 1, explanation: 'Rain is possible today → First Conditional → will + base verb.', growthMindsetFeedback: { correct: 'Perfect conditional!', incorrect: 'Possible situations → First Conditional → "will + verb."' } },
      { id: 'cd2', question: '"If I _____ a bird, I would fly."', options: ['am', 'were', 'will be', 'being'], correctAnswer: 1, explanation: 'Imaginary situation → Second Conditional → Past Simple ("were" for all subjects).', growthMindsetFeedback: { correct: 'You mastered the Second Conditional!', incorrect: 'Imaginary = Second Conditional. Use "were" for formal English.' } },
      { id: 'cd3', question: 'Which is Second Conditional?', options: ['"If I study, I will pass."', '"If I studied, I would pass."', '"If I am studying, I pass."', '"If I will study, I pass."'], correctAnswer: 1, explanation: 'Second Conditional uses Past Simple + would: "If I studied, I would pass."', growthMindsetFeedback: { correct: 'You know the difference!', incorrect: 'Second Conditional = If + Past Simple, would + base verb.' } },
    ],
  },

  // ── ADVANCED: REPORTED SPEECH ─────────────────
  {
    id: 'reported-speech',
    title: 'Mastering Reported Speech',
    description: 'Transform direct speech into reported speech confidently. Cover tense backshift, reporting verbs, and common pitfalls in academic and professional contexts.',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    contentVariants: {
      visual: {
        type: 'visual',
        images: [],
        infographics: [
          '"I am leaving" → She said she was leaving (Present → Past)',
          '"We have finished" → They said they had finished (Perfect → Past Perfect)',
          '"I will help" → He said he would help (will → would)',
          'today → that day | tomorrow → the next day | yesterday → the day before',
          'here → there | this → that | now → then',
          '"Are you coming?" → She asked if I was coming (Question → Statement)',
          '"Sit down!" → He told me to sit down (Command → Infinitive)',
        ],
        videoUrl: undefined,
        vrScenarioId: undefined,
      },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/reported-speech.mp3',
        transcriptHighlights: [
          'Direct: "I am leaving tomorrow." → Reported: She said she was leaving the next day.',
          'Direct: "We have finished." → Reported: They said they had finished.',
          'Direct: "I will help you." → Reported: He promised he would help me.',
        ],
        pronunciationGuide: [
          'claimed /kleɪmd/',
          'insisted /ɪnˈsɪstɪd/',
          'denied /dɪˈnaɪd/',
          'acknowledged /əkˈnɒlɪdʒd/',
        ],
      },
      reading: {
        type: 'reading',
        mainText: `Reported speech (also called indirect speech) is used to tell someone what another person said without quoting them directly. It is essential for academic writing, journalism, and professional communication.

**Tense Backshift Rules:**
- Present Simple → Past Simple: "I work here" → He said he worked there.
- Present Continuous → Past Continuous: "I am studying" → She said she was studying.
- Present Perfect → Past Perfect: "I have seen it" → He said he had seen it.
- Will → Would: "I will come" → She said she would come.
- Can → Could: "I can help" → He said he could help.

**Time & Place Changes:**
- today → that day | tomorrow → the next day | yesterday → the day before
- here → there | this → that | now → then

**Advanced Reporting Verbs:**
Instead of always using "said," academic English uses richer verbs:
- **Argued** – presented a viewpoint with reasoning
- **Claimed** – stated something possibly controversial
- **Acknowledged** – admitted or recognized
- **Denied** – said something was not true
- **Insisted** – stated firmly`,
        grammarRules: [
          'Backshift tenses one step into the past when the reporting verb is past tense',
          'No backshift needed when reporting general truths: She said the Earth revolves around the Sun',
          'Questions become statements in reported speech: "Are you coming?" → She asked if I was coming',
          'Commands use infinitive: "Sit down!" → He told me to sit down',
        ],
        exercises: [
          'Convert: "I don\'t understand the homework." (she / complain)',
          'Convert: "We will submit the report on Friday." (they / promise)',
          'Convert: "Did you attend the meeting?" (he / ask)',
          'Convert: "Don\'t open that file!" (she / warn)',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'reported-speech-relay',
        rolePlayPrompts: [
          'Partner A whispers a sentence. Partner B reports it to Partner C using reported speech.',
          'Read a short news article and rewrite all direct quotes as reported speech.',
          'Role-play a meeting: one person takes notes and reports what each person said.',
        ],
        physicalActivities: [
          'Telephone game: pass a message through 4 people using reported speech',
          'Write a diary entry reporting conversations you had today',
          'Watch a 2-minute interview clip and report what was said',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'backshift', definition: 'Moving a tense one step further into the past when reporting speech', relatedConcepts: ['tense change', 'indirect speech', 'reporting'], personalizedExample: '"I am happy" becomes "She said she was happy" — present shifts to past.' },
      { newWord: 'reporting verb', definition: 'A verb used to introduce reported speech, such as said, claimed, argued, or denied', relatedConcepts: ['direct speech', 'quote', 'paraphrase'], personalizedExample: 'Instead of "He said," try "He insisted" or "He acknowledged" for more precise writing.' },
      { newWord: 'indirect question', definition: 'A question reported as a statement, without question mark or inversion', relatedConcepts: ['embedded question', 'if/whether', 'word order'], personalizedExample: '"Where is the station?" → She asked where the station was.' },
    ],
    assessmentQuestions: [
      { id: 'rs1', question: 'She said: "I am tired." → She said she _____ tired.', options: ['is', 'was', 'has been', 'will be'], correctAnswer: 1, explanation: 'Present Simple backshifts to Past Simple in reported speech.', growthMindsetFeedback: { correct: 'Perfect backshift!', incorrect: 'Remember: "am/is" → "was" when the reporting verb is past tense.' } },
      { id: 'rs2', question: 'He asked: "Will you come?" → He asked _____ I would come.', options: ['that', 'if', 'what', 'do'], correctAnswer: 1, explanation: 'Yes/No questions use "if" or "whether" in reported speech.', growthMindsetFeedback: { correct: 'Great — you handled reported questions!', incorrect: 'Yes/No questions → "if/whether" + statement word order.' } },
      { id: 'rs3', question: 'Which reporting verb means "stated something firmly"?', options: ['mentioned', 'insisted', 'suggested', 'whispered'], correctAnswer: 1, explanation: '"Insisted" conveys firmness and determination in reporting.', growthMindsetFeedback: { correct: 'You know your reporting verbs!', incorrect: '"Insisted" = said with force/determination. Build your reporting verb vocabulary!' } },
    ],
  },

  // ── ADVANCED: PASSIVE VOICE ───────────────────
  {
    id: 'passive-voice',
    title: 'The Passive Voice in Depth',
    description: 'Master all passive constructions from basic to advanced. Learn when and why to use the passive in academic, scientific, and journalistic writing.',
    difficulty: 'advanced',
    estimatedMinutes: 14,
    contentVariants: {
      visual: {
        type: 'visual',
        images: [],
        infographics: [
          'Active: "Scientists discovered the vaccine" → Passive: "The vaccine was discovered"',
          'Present: "Cars are made in Japan"',
          'Past: "The bridge was built in 1990"',
          'Perfect: "The report has been submitted"',
          'Continuous: "The road is being repaired"',
          'Modal: "It must be finished by Friday"',
          'Causative: "I had my car repaired" → arranged for someone to do it',
          'Use passive when: agent unknown, agent obvious, or to emphasize the result',
        ],
        videoUrl: undefined,
        vrScenarioId: undefined,
      },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/passive-voice.mp3',
        transcriptHighlights: [
          'Active: "Scientists discovered the vaccine." → Passive: "The vaccine was discovered by scientists."',
          '"The report has been submitted." (Present Perfect Passive)',
          '"The bridge is being repaired." (Present Continuous Passive)',
          '"The results will be published next week." (Future Passive)',
        ],
        pronunciationGuide: [
          'discovered /dɪˈskʌvərd/',
          'manufactured /ˌmænjʊˈfæktʃərd/',
          'established /ɪˈstæblɪʃt/',
          'administered /ədˈmɪnɪstərd/',
        ],
      },
      reading: {
        type: 'reading',
        mainText: `The passive voice shifts focus from WHO did something to WHAT was done. It is heavily used in academic papers, news reports, and formal writing.

**Formation: Subject + be (conjugated) + past participle**

**All Passive Tenses:**
| Tense | Active | Passive |
|-------|--------|---------|
| Present Simple | They make cars | Cars are made |
| Past Simple | They built the bridge | The bridge was built |
| Present Perfect | They have completed it | It has been completed |
| Past Perfect | They had signed it | It had been signed |
| Future Simple | They will announce it | It will be announced |
| Present Continuous | They are painting it | It is being painted |
| Past Continuous | They were repairing it | It was being repaired |
| Modal | They must finish it | It must be finished |

**When to Use Passive:**
1. The agent is unknown: "My car was stolen."
2. The agent is obvious: "The suspect was arrested." (by police — obvious)
3. Academic/scientific writing: "The experiment was conducted…"
4. To emphasize the action or result over the doer

**Causative Passive (Advanced):**
- "I had my car repaired." = I arranged for someone to repair it.
- "She got her hair cut." = Someone cut her hair (she arranged it).`,
        grammarRules: [
          'Passive = subject + BE (correct tense) + past participle',
          'Only transitive verbs (verbs with objects) can be made passive',
          'Use "by + agent" only when the agent adds important information',
          'Causative: have/get + object + past participle',
        ],
        exercises: [
          'Rewrite: "The committee approved the budget." (passive)',
          'Rewrite: "Someone is cleaning the office." (passive)',
          'Rewrite: "They had already sent the invitations." (passive)',
          'Causative: "I need someone to fix my laptop." → "I need to get…"',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'passive-transformations',
        rolePlayPrompts: [
          'Describe a manufacturing process using only passive voice: "First, the materials are selected…"',
          'Report a crime scene: use passive to describe what happened without knowing who did it.',
          'Rewrite a recipe in passive voice: "The onions are chopped. The butter is melted…"',
        ],
        physicalActivities: [
          'Write a short news report about a local event using at least 5 passive sentences',
          'Find 10 passive sentences in a real news article and identify the tense of each',
          'Transform an active paragraph into passive and compare the tone',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'passive voice', definition: 'A grammatical construction where the subject receives the action instead of performing it', relatedConcepts: ['active voice', 'be + past participle', 'agent'], personalizedExample: '"The email was sent" focuses on the email, not who sent it.' },
      { newWord: 'past participle', definition: 'The third form of a verb (e.g., written, eaten, discovered), used in passive and perfect tenses', relatedConcepts: ['irregular verbs', 'verb forms', '-ed endings'], personalizedExample: '"The book was written by Orwell." Written is the past participle of write.' },
      { newWord: 'causative', definition: 'A structure showing you arranged for someone else to do something for you', relatedConcepts: ['have something done', 'get something done', 'service'], personalizedExample: '"I had my teeth cleaned" = The dentist cleaned them; I arranged it.' },
    ],
    assessmentQuestions: [
      { id: 'pv1', question: '"The results _____ next Monday." (announce — Future Passive)', options: ['will announce', 'will be announced', 'are announcing', 'announced'], correctAnswer: 1, explanation: 'Future Passive = will + be + past participle.', growthMindsetFeedback: { correct: 'Excellent passive formation!', incorrect: 'Future Passive: will + be + past participle → "will be announced."' } },
      { id: 'pv2', question: '"The bridge _____ when we arrived." (repair — Past Continuous Passive)', options: ['was repairing', 'was being repaired', 'had repaired', 'repaired'], correctAnswer: 1, explanation: 'Past Continuous Passive = was/were + being + past participle.', growthMindsetFeedback: { correct: 'You nailed the continuous passive!', incorrect: 'Past Continuous Passive: was/were + being + past participle.' } },
      { id: 'pv3', question: '"I _____ my car serviced last week." (causative)', options: ['have', 'had', 'was', 'got being'], correctAnswer: 1, explanation: 'Causative past: "had + object + past participle."', growthMindsetFeedback: { correct: 'Causative mastered!', incorrect: 'Past causative = had + object + past participle: "I had my car serviced."' } },
    ],
  },

  // ── ADVANCED: ACADEMIC VOCABULARY ─────────────
  {
    id: 'academic-vocabulary',
    title: 'Academic Vocabulary Essentials',
    description: 'Build a strong academic word bank drawn from the Academic Word List (AWL). Learn high-frequency words used in essays, research papers, and university lectures.',
    difficulty: 'advanced',
    estimatedMinutes: 13,
    contentVariants: {
      visual: {
        type: 'visual',
        images: [],
        infographics: [
          'analyze → analysis → analytical → analytically (Word Family)',
          '"The study demonstrates…" → shows clearly with evidence',
          '"The results indicate…" → points to / suggests',
          '"Several factors contribute to…" → add to / help cause',
          'Hedging: "It appears that…" → cautious, academic tone',
          'Hedging: "The evidence suggests…" → avoids absolute claims',
          '❌ "This proves that…" → ✅ "This suggests that…"',
        ],
        videoUrl: undefined,
        vrScenarioId: undefined,
      },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/academic-vocab.mp3',
        transcriptHighlights: [
          '"The study demonstrates a significant correlation between sleep and academic performance."',
          '"Several factors contribute to climate change, including deforestation and industrial emissions."',
          '"The findings indicate that further research is required."',
        ],
        pronunciationGuide: [
          'analysis /əˈnæləsɪs/',
          'hypothesis /haɪˈpɒθəsɪs/',
          'phenomenon /fɪˈnɒmɪnən/',
          'significant /sɪɡˈnɪfɪkənt/',
          'subsequently /ˈsʌbsɪkwəntli/',
        ],
      },
      reading: {
        type: 'reading',
        mainText: `Academic vocabulary consists of words that appear frequently across all academic disciplines. The Academic Word List (AWL) by Averil Coxhead identifies 570 word families essential for university-level English.

**Core Academic Verbs:**
- **Analyze** – examine in detail: "The researchers analyzed the data."
- **Demonstrate** – show clearly: "The experiment demonstrates the effect."
- **Indicate** – point to / suggest: "The results indicate a trend."
- **Contribute** – add to / help cause: "Several factors contribute to…"
- **Establish** – set up or prove: "The theory was established in 1995."

**Core Academic Nouns:**
- **Hypothesis** – an educated guess to be tested
- **Methodology** – the system of methods used in research
- **Phenomenon** – an observable event or occurrence
- **Correlation** – a relationship between two variables
- **Implication** – a possible effect or consequence

**Core Academic Adjectives & Adverbs:**
- **Significant** – important or large enough to matter
- **Subsequently** – after that; as a result
- **Predominantly** – mainly; for the most part
- **Inherent** – existing as a natural part of something

**Hedging Language (Critical for Academic Writing):**
- "It appears that…" / "The evidence suggests…" / "It could be argued that…"
- Hedging shows caution and avoids overgeneralization.`,
        grammarRules: [
          'Learn words in families: analyze → analysis → analytical → analytically',
          'Use collocations: "conduct research" not "do research" (formal)',
          'Academic writing prefers nominal style: "The analysis of data" over "We analyzed data"',
          'Hedging is expected: avoid absolute claims in academic writing',
        ],
        exercises: [
          'Fill in: "The study _____ that regular exercise improves cognition." (demonstrate)',
          'Replace informal words: "This shows that…" → "This _____ that…"',
          'Write 3 sentences using hedging language about a topic you know',
          'Create word families for: establish, contribute, significant',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'academic-writing-lab',
        rolePlayPrompts: [
          'Present a research finding to a class using at least 5 academic words from this lesson.',
          'Debate a topic with your partner using formal academic language and hedging.',
          'Summarize a Wikipedia article using only academic vocabulary.',
        ],
        physicalActivities: [
          'Create flashcards for 20 AWL words with example sentences',
          'Read an academic abstract and highlight every AWL word you find',
          'Rewrite a casual blog post in formal academic style',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'hypothesis', definition: 'A proposed explanation or prediction that can be tested through research', relatedConcepts: ['theory', 'prediction', 'experiment'], personalizedExample: '"Our hypothesis is that sleep duration affects test scores" — this is what you plan to prove.' },
      { newWord: 'methodology', definition: 'The system of methods and principles used in a particular discipline or study', relatedConcepts: ['approach', 'procedure', 'framework'], personalizedExample: '"The methodology involved surveys and interviews" — it describes HOW the research was done.' },
      { newWord: 'correlation', definition: 'A mutual relationship or connection between two or more things', relatedConcepts: ['relationship', 'connection', 'variable'], personalizedExample: '"There is a correlation between exercise and mental health" — they are connected but one doesn\'t necessarily cause the other.' },
      { newWord: 'hedging', definition: 'Using cautious language to avoid making absolute claims in academic writing', relatedConcepts: ['may', 'suggests', 'appears', 'could'], personalizedExample: '"It appears that…" is safer than "It is obvious that…" in academic writing.' },
    ],
    assessmentQuestions: [
      { id: 'av1', question: '"The results _____ a strong link between diet and health."', options: ['show', 'indicate', 'tell', 'say'], correctAnswer: 1, explanation: '"Indicate" is the preferred academic verb for presenting evidence.', growthMindsetFeedback: { correct: 'Perfect academic register!', incorrect: 'In academic writing, "indicate" is more precise than "show" or "tell."' } },
      { id: 'av2', question: 'What is a hypothesis?', options: ['A proven fact', 'A testable prediction', 'A research method', 'A final conclusion'], correctAnswer: 1, explanation: 'A hypothesis is a prediction you test — it is not yet proven.', growthMindsetFeedback: { correct: 'You understand the scientific process!', incorrect: 'A hypothesis is proposed BEFORE research — it\'s what you aim to test.' } },
      { id: 'av3', question: 'Which sentence uses correct hedging?', options: ['"This proves that…"', '"It is obvious that…"', '"The evidence suggests that…"', '"Everyone knows that…"'], correctAnswer: 2, explanation: '"The evidence suggests" is appropriately cautious for academic writing.', growthMindsetFeedback: { correct: 'Excellent hedging awareness!', incorrect: 'Academic writing avoids absolute claims. "Suggests" is cautious and appropriate.' } },
    ],
  },

  // ── ADVANCED: RELATIVE CLAUSES ────────────────
  {
    id: 'relative-clauses',
    title: 'Defining & Non-Defining Relative Clauses',
    description: 'Distinguish between defining and non-defining relative clauses. Master who, which, that, whose, and where in complex sentence construction.',
    difficulty: 'advanced',
    estimatedMinutes: 11,
    contentVariants: {
      visual: {
        type: 'visual',
        images: [],
        infographics: [
          'Defining: "The woman who called is my manager" → identifies WHICH woman (no commas)',
          'Non-defining: "My sister, who lives in London, is visiting" → adds EXTRA info (commas)',
          '"that" → OK in defining clauses only',
          '"that" → NEVER in non-defining clauses',
          '"whose" → possession: "The author whose book won…"',
          '"where" → place: "The café where we met…"',
          'Reduced: "The man (who is) standing…" → drop pronoun + be verb',
        ],
        videoUrl: undefined,
        vrScenarioId: undefined,
      },
      auditory: {
        type: 'auditory',
        audioUrl: '/audio/relative-clauses.mp3',
        transcriptHighlights: [
          'Defining: "The woman who called you is my manager." (which woman? → essential info)',
          'Non-defining: "My sister, who lives in London, is visiting us." (extra info, commas needed)',
          '"The report, which was published yesterday, contains errors."',
        ],
        pronunciationGuide: [
          'whose /huːz/',
          'whom /huːm/',
          'clause /klɔːz/',
          'essential /ɪˈsenʃəl/',
        ],
      },
      reading: {
        type: 'reading',
        mainText: `Relative clauses add information about a noun. They are introduced by relative pronouns: who, which, that, whose, where, when.

**Defining Relative Clauses (No commas):**
These identify WHICH person/thing we mean. Without them, the sentence is incomplete.
- "The students **who passed** the exam will graduate." (which students?)
- "The book **that I borrowed** was excellent." (which book?)
- "That" can replace "who/which" in defining clauses.

**Non-Defining Relative Clauses (With commas):**
These add EXTRA information. The sentence is complete without them.
- "Dr. Smith, **who is 60**, plans to retire." (we already know who Dr. Smith is)
- "The Eiffel Tower, **which is in Paris**, attracts millions of visitors."
- "That" CANNOT be used in non-defining clauses.

**Reduced Relative Clauses (Advanced):**
- "The man **(who is) standing** at the door is my uncle." → participle clause
- "The report **(that was) submitted** yesterday had errors." → past participle

**Whose, Where, When:**
- **Whose** = possession: "The author whose book won the prize…"
- **Where** = place: "The café where we met…"
- **When** = time: "The year when everything changed…"`,
        grammarRules: [
          'Defining = essential info, no commas, "that" is allowed',
          'Non-defining = extra info, commas required, "that" is NOT allowed',
          'Reduced clauses drop the relative pronoun + be verb',
          '"Whose" replaces possessive pronouns (his/her/their) in relative clauses',
        ],
        exercises: [
          'Combine: "The hotel was expensive. We stayed there." (where)',
          'Add commas if needed: "My brother who is a doctor lives in Berlin."',
          'Reduce: "The woman who is wearing the red dress is the CEO."',
          'Fill in: "The company _____ products we use is based in Japan." (whose/which)',
        ],
      },
      kinesthetic: {
        type: 'kinesthetic',
        interactiveScenarioId: 'clause-builder',
        rolePlayPrompts: [
          'Describe 5 people in the room using defining relative clauses.',
          'Tell a story about your family adding non-defining clauses for extra detail.',
          'Play "Guess Who" using only relative clauses: "I\'m thinking of a person who…"',
        ],
        physicalActivities: [
          'Write 5 defining and 5 non-defining relative clauses about your city',
          'Find and correct 5 relative clause errors in a provided text',
          'Combine pairs of simple sentences using appropriate relative pronouns',
        ],
      },
    },
    semanticAnchors: [
      { newWord: 'defining clause', definition: 'A relative clause that identifies which person or thing is being talked about — essential to the meaning', relatedConcepts: ['restrictive', 'no commas', 'that/who/which'], personalizedExample: '"The car that I bought is red" — without the clause, we don\'t know which car.' },
      { newWord: 'non-defining clause', definition: 'A relative clause that adds extra information — not essential, set off by commas', relatedConcepts: ['non-restrictive', 'commas', 'extra info'], personalizedExample: '"My car, which is red, needs a wash" — we already know which car; the clause just adds detail.' },
    ],
    assessmentQuestions: [
      { id: 'rc1', question: 'Which sentence has a NON-defining relative clause?', options: ['"The man who called is here."', '"London, which is the capital, is busy."', '"Students that study hard pass."', '"The food that I ordered was cold."'], correctAnswer: 1, explanation: 'Non-defining clauses have commas and add extra (non-essential) info.', growthMindsetFeedback: { correct: 'You spotted the commas — key indicator!', incorrect: 'Look for commas! Non-defining = extra info = commas.' } },
      { id: 'rc2', question: '"The scientist _____ research changed medicine won a Nobel Prize."', options: ['who', 'which', 'whose', 'where'], correctAnswer: 2, explanation: '"Whose" shows possession: the scientist\'s research.', growthMindsetFeedback: { correct: 'Perfect use of "whose"!', incorrect: '"Whose" = belonging to. The research belongs to the scientist.' } },
      { id: 'rc3', question: 'Can you use "that" in a non-defining relative clause?', options: ['Yes, always', 'No, never', 'Only with people', 'Only in formal writing'], correctAnswer: 1, explanation: '"That" is NEVER used in non-defining (comma) clauses. Use "who" or "which."', growthMindsetFeedback: { correct: 'Important rule — well remembered!', incorrect: 'Key rule: Non-defining clauses → who/which only. Never "that."' } },
    ],
  },
];
