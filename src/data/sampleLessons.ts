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
        images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        infographics: ['Common restaurant phrases infographic', 'Menu vocabulary breakdown'],
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
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg'], infographics: ['Greeting flowchart', 'Formal vs informal greetings'], videoUrl: undefined, vrScenarioId: undefined },
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
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg'], infographics: ['Present Simple vs Continuous timeline', 'Signal words chart'], videoUrl: undefined, vrScenarioId: undefined },
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
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg'], infographics: ['Past Simple vs Present Perfect timeline', 'Signal words comparison'], videoUrl: undefined, vrScenarioId: undefined },
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
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'], infographics: ['Phrasal verbs with GET', 'Phrasal verbs with TAKE', 'Separable vs inseparable'], videoUrl: undefined, vrScenarioId: undefined },
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
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg'], infographics: ['Mouth position diagrams for /ɪ/ vs /iː/', 'Minimal pairs chart'], videoUrl: undefined, vrScenarioId: undefined },
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
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'], infographics: ['Idiom illustrations with literal vs figurative meaning', 'Top 10 idioms infographic'], videoUrl: undefined, vrScenarioId: undefined },
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
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg'], infographics: ['Active listening strategy flowchart', 'Connected speech patterns'], videoUrl: undefined, vrScenarioId: undefined },
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
      visual: { type: 'visual', images: ['/placeholder.svg', '/placeholder.svg'], infographics: ['First vs Second Conditional diagram', 'Real vs Imaginary situations'], videoUrl: undefined, vrScenarioId: undefined },
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
];
