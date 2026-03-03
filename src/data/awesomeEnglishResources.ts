/**
 * Curated English learning resources from awesome-english (CC0)
 * https://github.com/yvoronoy/awesome-english
 * Enriched with categories, levels, and skill tags for SEE integration.
 */

export type ResourceCategory =
  | 'listening'
  | 'speaking'
  | 'watching'
  | 'reading'
  | 'writing'
  | 'grammar'
  | 'vocabulary'
  | 'tools'
  | 'exercises'
  | 'classes';

export type ResourceLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

export type ResourceSubcategory = string;

export interface EnglishResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: ResourceCategory;
  subcategory: ResourceSubcategory;
  level: ResourceLevel;
  icon: string; // emoji
  isFeatured?: boolean;
}

export const resourceCategories: { id: ResourceCategory; label: string; icon: string; color: string }[] = [
  { id: 'listening', label: 'Listening', icon: '🎧', color: 'text-cognitive-auditory' },
  { id: 'speaking', label: 'Speaking', icon: '🗣️', color: 'text-primary' },
  { id: 'watching', label: 'Watching', icon: '📺', color: 'text-cognitive-visual' },
  { id: 'reading', label: 'Reading', icon: '📖', color: 'text-cognitive-reading' },
  { id: 'writing', label: 'Writing', icon: '✍️', color: 'text-accent' },
  { id: 'grammar', label: 'Grammar', icon: '📐', color: 'text-warning' },
  { id: 'vocabulary', label: 'Vocabulary', icon: '📚', color: 'text-success' },
  { id: 'tools', label: 'Tools', icon: '🛠️', color: 'text-cognitive-kinesthetic' },
  { id: 'exercises', label: 'Exercises & Tests', icon: '📝', color: 'text-destructive' },
  { id: 'classes', label: 'Online Classes', icon: '🎓', color: 'text-primary' },
];

export const awesomeEnglishResources: EnglishResource[] = [
  // ═══════════════════════════════════════════
  //  TOP PICKS (featured)
  // ═══════════════════════════════════════════
  { id: 'anki', title: 'Anki', description: 'Effective flashcard app for vocabulary expansion through daily review using spaced repetition.', url: 'https://apps.ankiweb.net/', category: 'vocabulary', subcategory: 'Flashcard Apps', level: 'all', icon: '🃏', isFeatured: true },
  { id: 'npr', title: 'NPR', description: 'National Public Radio with transcripts available, ideal for daily listening practice.', url: 'https://www.npr.org/', category: 'listening', subcategory: 'National Broadcasters', level: 'intermediate', icon: '📻', isFeatured: true },
  { id: 'murphy-grammar', title: 'English Grammar in Use (Murphy)', description: 'Best-selling grammar book for learners of English at all levels.', url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-grammar-use-5th-edition', category: 'grammar', subcategory: 'Learning Resources', level: 'all', icon: '📕', isFeatured: true },

  // ═══════════════════════════════════════════
  //  LISTENING — Podcasts
  // ═══════════════════════════════════════════
  // Beginner
  { id: '6min-english', title: '6 Minute English (BBC)', description: 'Short BBC episodes teaching useful English for everyday situations.', url: 'http://www.bbc.co.uk/programmes/p02pc9tn/episodes/downloads', category: 'listening', subcategory: 'Beginner Podcasts', level: 'beginner', icon: '🎧' },
  { id: 'esl-podcasts', title: 'ESL Podcasts', description: 'Ideal for improving English speaking and listening skills at a gentle pace.', url: 'https://www.eslpod.com/', category: 'listening', subcategory: 'Beginner Podcasts', level: 'beginner', icon: '🎧' },
  // Intermediate
  { id: 'all-ears', title: 'All Ears English', description: 'Focuses on advanced conversational American English with real-world topics.', url: 'https://allearsenglish.com/', category: 'listening', subcategory: 'Intermediate Podcasts', level: 'intermediate', icon: '🎧' },
  { id: 'culips', title: 'Culips Podcast', description: 'Conversational English for everyday use by native speakers.', url: 'https://esl.culips.com/', category: 'listening', subcategory: 'Intermediate Podcasts', level: 'intermediate', icon: '🎧' },
  { id: 'luke-english', title: "Luke's English Podcast", description: 'Hosted by a qualified teacher and comedian — engaging and educational.', url: 'https://teacherluke.co.uk/', category: 'listening', subcategory: 'Intermediate Podcasts', level: 'intermediate', icon: '🎧' },
  { id: 'cnn10', title: 'CNN 10', description: 'Ten-minute digital news show explaining global news to a worldwide audience.', url: 'http://edition.cnn.com/cnn10', category: 'listening', subcategory: 'Intermediate Podcasts', level: 'intermediate', icon: '📰' },
  // Advanced
  { id: 'way-words', title: 'A Way with Words', description: 'Explores language through history, culture, and family.', url: 'https://www.waywordradio.org/category/episodes/', category: 'listening', subcategory: 'Advanced Podcasts', level: 'advanced', icon: '🎧' },
  { id: 'this-american-life', title: 'This American Life', description: 'Popular podcast featuring journalism, comedy, and essays.', url: 'https://www.thisamericanlife.org/radio-archives', category: 'listening', subcategory: 'Advanced Podcasts', level: 'advanced', icon: '🎧' },
  { id: 'curious-minds', title: 'English Learning for Curious Minds', description: 'Episodes on history, politics, unusual stories with transcripts and vocabulary aids.', url: 'https://www.leonardoenglish.com/podcasts', category: 'listening', subcategory: 'Advanced Podcasts', level: 'advanced', icon: '🧠' },

  // Tech Podcasts
  { id: 'hard-fork', title: 'Hard Fork (NYT)', description: 'Weekly exploration of the latest in the rapidly changing world of tech.', url: 'https://open.spotify.com/show/44fllCS2FTFr2x2kjP9xeT', category: 'listening', subcategory: 'Tech Podcasts', level: 'intermediate', icon: '💻', isFeatured: true },
  { id: 'bloomberg-tech', title: 'Bloomberg Technology', description: 'In-depth coverage of technology industry news and innovations.', url: 'https://www.youtube.com/channel/UCrM7B7SL_g1edFOnmj-SDKg', category: 'listening', subcategory: 'Tech Podcasts', level: 'advanced', icon: '💻' },
  { id: 'talk-python', title: 'Talk Python To Me', description: 'Podcast covering Python and related technologies.', url: 'https://talkpython.fm/', category: 'listening', subcategory: 'Tech Podcasts', level: 'advanced', icon: '🐍' },

  // Interview Podcasts
  { id: 'lex-fridman', title: 'Lex Fridman Podcast', description: 'Deep conversations about intelligence, consciousness, love, and power.', url: 'https://lexfridman.com/podcast/', category: 'listening', subcategory: 'Interview Podcasts', level: 'advanced', icon: '🎤' },
  { id: 'knowledge-project', title: 'The Knowledge Project', description: 'Interviews with world-class thinkers, packed with lessons and insights.', url: 'https://fs.blog/knowledge-project-podcast/', category: 'listening', subcategory: 'Interview Podcasts', level: 'advanced', icon: '🧠' },
  { id: 'tim-ferriss', title: 'The Tim Ferriss Show', description: 'Deconstructing world-class performers to extract actionable tactics.', url: 'https://tim.blog/podcast/', category: 'listening', subcategory: 'Interview Podcasts', level: 'advanced', icon: '🎤' },
  { id: 'joe-rogan', title: 'Joe Rogan Experience', description: 'Wide-ranging conversations with diverse guests for extended listening practice.', url: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk', category: 'listening', subcategory: 'Interview Podcasts', level: 'advanced', icon: '🎤' },
  { id: 'fresh-air', title: 'Fresh Air with Terry Gross', description: 'Respected interview program on arts, culture, and politics with clear speaking.', url: 'https://www.npr.org/programs/fresh-air/', category: 'listening', subcategory: 'Interview Podcasts', level: 'advanced', icon: '🎤' },
  { id: 'how-built-this', title: 'How I Built This', description: 'Entrepreneurs share stories behind their companies — great for business English.', url: 'https://www.npr.org/series/490248027/how-i-built-this', category: 'listening', subcategory: 'Interview Podcasts', level: 'intermediate', icon: '💼' },

  // Radio Stations
  { id: 'bbc-london', title: 'BBC London', description: 'News and talk radio station from London with British English.', url: 'https://www.bbc.co.uk/bbclondon', category: 'listening', subcategory: 'Live Radio', level: 'intermediate', icon: '📻' },
  { id: 'bloomberg-radio', title: 'Bloomberg Radio', description: 'Financial markets and business news radio.', url: 'https://www.bloomberg.com/audio', category: 'listening', subcategory: 'Live Radio', level: 'advanced', icon: '📻' },
  { id: 'wnyc', title: 'WNYC', description: 'Public radio stations located in New York City.', url: 'https://www.wnyc.org/', category: 'listening', subcategory: 'Live Radio', level: 'intermediate', icon: '📻' },

  // Listening Sites
  { id: 'spotlight', title: 'Spotlight', description: 'Daily 15-minute radio program for learning English.', url: 'http://spotlightenglish.com/', category: 'listening', subcategory: 'Sites', level: 'beginner', icon: '📻' },
  { id: 'esl-lab', title: 'ESL Lab', description: 'English listening comprehension exercises with conversations at various levels.', url: 'http://www.esl-lab.com/', category: 'listening', subcategory: 'Sites', level: 'all', icon: '🔬' },
  { id: 'engvid', title: 'EngVid', description: 'Free English video lessons on grammar, vocabulary, pronunciation, and more.', url: 'https://www.engvid.com/', category: 'listening', subcategory: 'Sites', level: 'all', icon: '🎬' },

  // ═══════════════════════════════════════════
  //  SPEAKING
  // ═══════════════════════════════════════════
  { id: 'tandem', title: 'Tandem', description: 'Language exchange app connecting users with native speakers for text, voice, and video chats.', url: 'https://www.tandem.net/', category: 'speaking', subcategory: 'Language Exchange', level: 'all', icon: '🤝' },
  { id: 'hellotalk', title: 'HelloTalk', description: 'App linking you with native speakers for language exchange through text and voice.', url: 'https://www.hellotalk.com/', category: 'speaking', subcategory: 'Language Exchange', level: 'all', icon: '💬' },
  { id: 'reddit-lang-exchange', title: "Reddit r/Language_Exchange", description: 'Community where users find language exchange partners to practice speaking.', url: 'https://www.reddit.com/r/language_exchange/', category: 'speaking', subcategory: 'Language Exchange', level: 'all', icon: '🤝' },
  { id: 'elsa-speak', title: 'Elsa Speak', description: 'AI-driven app for improving pronunciation with detailed feedback on speaking.', url: 'https://www.elsaspeak.com/', category: 'speaking', subcategory: 'Pronunciation', level: 'all', icon: '🗣️' },
  { id: 'talk-english', title: 'TalkEnglish', description: 'Speaking exercises and conversation topics to improve fluency through practice.', url: 'https://www.talkenglish.com/', category: 'speaking', subcategory: 'Practice', level: 'all', icon: '🗣️' },
  { id: 'rachels-english', title: "Rachel's English", description: 'YouTube channel focusing on pronunciation and clear speaking in American English.', url: 'https://www.youtube.com/user/rachelsenglish', category: 'speaking', subcategory: 'Pronunciation', level: 'intermediate', icon: '🎬' },

  // ═══════════════════════════════════════════
  //  WATCHING — YouTube
  // ═══════════════════════════════════════════
  { id: 'ronnie', title: 'Learn English with Ronnie', description: 'Humorous English video lessons with host Ronnie.', url: 'https://www.youtube.com/user/EnglishLessons4U', category: 'watching', subcategory: 'YouTube', level: 'beginner', icon: '🎬' },
  { id: 'bbc-grammar-yt', title: 'BBC English Grammar', description: 'Short BBC videos explaining English grammar concepts.', url: 'https://www.youtube.com/playlist?list=PLcetZ6gSk96_zHuVg6Ecy2F7j4Aq4valQ', category: 'watching', subcategory: 'YouTube', level: 'intermediate', icon: '🎬' },
  { id: 'bbc-howto', title: 'BBC English HowTo', description: 'Useful English phrases for immediate application in daily conversations.', url: 'https://www.youtube.com/playlist?list=PLcetZ6gSk9692RVJgFx4JXwFG4mWK0XGj', category: 'watching', subcategory: 'YouTube', level: 'beginner', icon: '🎬' },
  { id: 'anglo-link', title: 'Anglo-Link', description: 'A variety of English grammar lessons and explanations.', url: 'https://www.youtube.com/user/MinooAngloLink/', category: 'watching', subcategory: 'YouTube', level: 'intermediate', icon: '🎬' },
  { id: 'daily-dictation', title: 'Daily Dictation', description: 'Daily dictation for improving listening comprehension skills.', url: 'https://www.youtube.com/user/dailydictation', category: 'watching', subcategory: 'YouTube', level: 'intermediate', icon: '✏️' },
  { id: 'lets-talk', title: 'Learn English with Let\'s Talk', description: 'How to handle daily situations and what phrases to use.', url: 'https://www.youtube.com/user/learnexmumbai', category: 'watching', subcategory: 'YouTube', level: 'beginner', icon: '🎬' },
  { id: 'tv-series', title: 'Learn English With TV Series', description: 'Enhance listening comprehension using TV shows, movies, and talk shows.', url: 'https://www.youtube.com/@LearnEnglishWithTVSeries', category: 'watching', subcategory: 'YouTube', level: 'intermediate', icon: '📺' },
  { id: 'reallife', title: 'RealLife English', description: 'Learning methods and mindset for your English learning journey.', url: 'https://www.youtube.com/@RealLifeEnglish1', category: 'watching', subcategory: 'YouTube', level: 'intermediate', icon: '🌎' },

  // Live TV
  { id: 'abc-news', title: 'ABC News Live', description: 'ABC News TV channel with live streaming.', url: 'http://abcnews.go.com/Live', category: 'watching', subcategory: 'Live TV', level: 'advanced', icon: '📺' },
  { id: 'bloomberg-tv', title: 'Bloomberg TV', description: 'Bloomberg Business TV channel for financial English.', url: 'http://www.bloomberg.com/live/us', category: 'watching', subcategory: 'Live TV', level: 'advanced', icon: '📺' },
  { id: 'cbs-news', title: 'CBS News Live', description: 'News division of the American TV and radio network CBS.', url: 'http://www.cbsnews.com/live/', category: 'watching', subcategory: 'Live TV', level: 'advanced', icon: '📺' },

  // Talk Shows
  { id: 'jimmy-kimmel', title: 'Jimmy Kimmel Live!', description: 'Popular American late-night talk show with celebrity interviews.', url: 'https://www.youtube.com/user/JimmyKimmelLive', category: 'watching', subcategory: 'Talk Shows', level: 'intermediate', icon: '🎭' },
  { id: 'jimmy-fallon', title: 'The Tonight Show (Fallon)', description: 'American late-night talk show hosted by Jimmy Fallon on NBC.', url: 'https://www.youtube.com/user/latenight', category: 'watching', subcategory: 'Talk Shows', level: 'intermediate', icon: '🎭' },
  { id: 'seth-meyers', title: 'Late Night with Seth Meyers', description: 'American late-night talk show hosted by Seth Meyers on NBC.', url: 'https://www.youtube.com/user/LateNightSeth', category: 'watching', subcategory: 'Talk Shows', level: 'intermediate', icon: '🎭' },
  { id: 'colbert', title: 'The Late Show (Colbert)', description: 'American late-night talk show by Stephen Colbert on CBS.', url: 'https://www.youtube.com/channel/UCMtFAi84ehTSYSE9XoHefig', category: 'watching', subcategory: 'Talk Shows', level: 'intermediate', icon: '🎭' },

  // Tech Shows
  { id: 'mkbhd', title: 'MKBHD', description: 'In-depth tech reviews in clear English, great for tech vocabulary.', url: 'https://www.youtube.com/user/marquesbrownlee', category: 'watching', subcategory: 'Tech Shows', level: 'intermediate', icon: '📱' },
  { id: 'linus-tech', title: 'Linus Tech Tips', description: 'Tech reviews and build guides in straightforward language.', url: 'https://www.youtube.com/user/LinusTechTips', category: 'watching', subcategory: 'Tech Shows', level: 'intermediate', icon: '💻' },
  { id: 'bbc-click', title: 'BBC Click', description: "The BBC's flagship technology program.', url: 'https://www.youtube.com/user/ClickBBC", category: 'watching', subcategory: 'Tech Shows', level: 'intermediate', icon: '💻' },

  // ═══════════════════════════════════════════
  //  READING
  // ═══════════════════════════════════════════
  { id: 'breaking-news', title: 'Breaking News English', description: 'Listen to, read, and write about breaking news with exercises.', url: 'http://www.breakingnewsenglish.com/', category: 'reading', subcategory: 'News', level: 'intermediate', icon: '📰' },
  { id: 'short-stories', title: 'Short Stories', description: 'Short stories for everyday reading practice.', url: 'http://www.short-stories.co.uk/', category: 'reading', subcategory: 'Stories', level: 'beginner', icon: '📖' },
  { id: 'reading-comprehension', title: 'Reading Comprehension Exercises', description: 'Texts with exercises at three difficulty levels.', url: 'http://www.usingenglish.com/comprehension/', category: 'reading', subcategory: 'Exercises', level: 'all', icon: '📝' },
  { id: 'imdb-scripts', title: 'IMDB Scripts', description: 'The Internet movie script database — read real movie dialogues.', url: 'http://www.imsdb.com/', category: 'reading', subcategory: 'Scripts', level: 'intermediate', icon: '🎬' },
  { id: 'today-found-out', title: 'Today I Found Out', description: 'Daily interesting fact articles from various authors.', url: 'http://www.todayifoundout.com/', category: 'reading', subcategory: 'Articles', level: 'intermediate', icon: '💡' },
  { id: 'engoo-news', title: 'Engoo Daily News', description: 'Daily news articles specifically designed for English learners.', url: 'https://engoo.com/app/daily-news', category: 'reading', subcategory: 'News', level: 'beginner', icon: '📰' },
  // Books
  { id: 'harry-potter', title: 'Harry Potter Series', description: 'Popular book series with gradually increasing language complexity.', url: 'https://a.co/d/9vYXQ2B', category: 'reading', subcategory: 'Books', level: 'beginner', icon: '📚', isFeatured: true },
  { id: 'pride-prejudice', title: 'Pride and Prejudice', description: 'Classic novel offering rich insights into English literature and culture.', url: 'https://www.goodreads.com/book/show/1885.Pride_and_Prejudice', category: 'reading', subcategory: 'Books', level: 'advanced', icon: '📚' },
  { id: 'animal-farm', title: 'Animal Farm', description: 'Short allegorical novella using simple language to convey complex themes.', url: 'https://www.goodreads.com/book/show/170448.Animal_Farm', category: 'reading', subcategory: 'Books', level: 'intermediate', icon: '📚' },

  // ═══════════════════════════════════════════
  //  WRITING
  // ═══════════════════════════════════════════
  { id: '750words', title: '750 Words', description: 'Encourages daily private writing through gamification and statistics.', url: 'https://750words.com/', category: 'writing', subcategory: 'Practice Platforms', level: 'all', icon: '✍️' },
  { id: 'write-improve', title: 'Write & Improve (Cambridge)', description: 'Daily writing tasks with automated feedback at various proficiency levels.', url: 'https://writeandimprove.com/', category: 'writing', subcategory: 'Practice Platforms', level: 'all', icon: '✍️' },
  { id: 'thoughtco-writing', title: 'ThoughtCo ESL Writing', description: 'Various writing prompts and structured exercises for ESL learners.', url: 'https://www.thoughtco.com/esl-writing-skills-4133091', category: 'writing', subcategory: 'Exercises', level: 'all', icon: '📝' },
  { id: 'hemingway', title: 'Hemingway Editor', description: 'Simplify and clarify your writing by identifying complex sentences and errors.', url: 'http://www.hemingwayapp.com/', category: 'writing', subcategory: 'AI Assistants', level: 'all', icon: '🤖' },

  // ═══════════════════════════════════════════
  //  GRAMMAR
  // ═══════════════════════════════════════════
  { id: 'ego4u', title: 'Ego4u', description: 'Comprehensive grammar lessons and interactive tests.', url: 'https://www.ego4u.com/', category: 'grammar', subcategory: 'Learning Resources', level: 'all', icon: '📐' },
  { id: 'my-english-pages', title: 'My English Pages', description: 'Detailed grammar reference guide with examples and exercises.', url: 'https://www.myenglishpages.com/grammar/', category: 'grammar', subcategory: 'Learning Resources', level: 'all', icon: '📐' },
  { id: 'english-club-grammar', title: 'English Club Grammar', description: 'Clear explanations of English grammar rules with practice activities.', url: 'https://www.englishclub.com/grammar/', category: 'grammar', subcategory: 'Learning Resources', level: 'all', icon: '📐' },

  // ═══════════════════════════════════════════
  //  VOCABULARY
  // ═══════════════════════════════════════════
  { id: 'ogden-basic', title: "Ogden's Basic English", description: '850 essential English words forming the foundation of the language.', url: 'https://zbenglish.net/sites/basic/basiceng.html', category: 'vocabulary', subcategory: 'Word Lists', level: 'beginner', icon: '📋' },
  { id: 'verbal-advantage', title: 'Verbal Advantage', description: 'Advanced vocabulary building with detailed explanations and examples.', url: 'https://www.academia.edu/27879831/Verbal_Advantage_by_Charles_Harrington_Elster', category: 'vocabulary', subcategory: 'Word Lists', level: 'advanced', icon: '📕' },
  { id: 'memrise', title: 'Memrise', description: 'User-created vocabulary lists with mnemonics and spaced repetition.', url: 'https://www.memrise.com/', category: 'vocabulary', subcategory: 'Flashcard Apps', level: 'all', icon: '🧠' },
  { id: 'quizlet', title: 'Quizlet', description: 'Create and study flashcard sets with various learning modes.', url: 'https://quizlet.com/', category: 'vocabulary', subcategory: 'Flashcard Apps', level: 'all', icon: '🃏' },
  { id: 'forvo', title: 'Forvo', description: 'Native speaker pronunciations of words from different English-speaking regions.', url: 'https://forvo.com/', category: 'vocabulary', subcategory: 'Dictionaries', level: 'all', icon: '🔊' },
  { id: 'dictionary-com', title: 'Dictionary.com', description: 'Comprehensive dictionary with definitions, pronunciations, and examples.', url: 'https://www.dictionary.com/', category: 'vocabulary', subcategory: 'Dictionaries', level: 'all', icon: '📖' },
  { id: 'thesaurus', title: 'Thesaurus.com', description: 'Find synonyms and antonyms to expand your vocabulary.', url: 'https://www.thesaurus.com/', category: 'vocabulary', subcategory: 'Dictionaries', level: 'all', icon: '📖' },
  { id: 'oxford-learners', title: "Oxford Learner's Dictionaries", description: 'Learner-friendly definitions with clear examples and pronunciations.', url: 'https://www.oxfordlearnersdictionaries.com/', category: 'vocabulary', subcategory: 'Dictionaries', level: 'all', icon: '📖' },
  { id: 'linguee', title: 'Linguee', description: 'Context-rich dictionary with real-world usage examples.', url: 'https://www.linguee.com/', category: 'vocabulary', subcategory: 'Dictionaries', level: 'intermediate', icon: '🌐' },
  { id: 'reverso', title: 'ReversoContext', description: 'See words and phrases used in authentic contexts.', url: 'https://context.reverso.net/translation', category: 'vocabulary', subcategory: 'Dictionaries', level: 'intermediate', icon: '🌐' },

  // ═══════════════════════════════════════════
  //  TOOLS
  // ═══════════════════════════════════════════
  { id: 'play-phrase', title: 'Play Phrase', description: 'Search and play specific phrases from movies to learn natural usage.', url: 'https://playphrase.me/', category: 'tools', subcategory: 'Learning Enhancement', level: 'all', icon: '🎬' },
  { id: 'lyrics-training', title: 'Lyrics Training', description: 'Learn English through music and song lyrics with interactive exercises.', url: 'https://lyricstraining.com/', category: 'tools', subcategory: 'Learning Enhancement', level: 'all', icon: '🎵' },
  { id: 'grammarly', title: 'Grammarly', description: 'Writing assistant for checking grammar, spelling, and style in real-time.', url: 'https://grammarly.com/', category: 'tools', subcategory: 'Writing Tools', level: 'all', icon: '✅' },
  { id: 'youglish', title: 'YouGlish', description: 'Learn word pronunciation from real-world YouTube videos.', url: 'https://youglish.com/', category: 'tools', subcategory: 'Pronunciation', level: 'all', icon: '🔊' },
  { id: 'visuwords', title: 'Visuwords', description: 'Visual dictionary showing word relationships and connections.', url: 'https://visuwords.com/', category: 'tools', subcategory: 'Vocabulary', level: 'all', icon: '🕸️' },
  { id: 'test-vocab', title: 'Test Your Vocab', description: 'Estimate your English vocabulary size with a quick test.', url: 'http://testyourvocab.com/', category: 'tools', subcategory: 'Assessment', level: 'all', icon: '📊' },

  // ═══════════════════════════════════════════
  //  EXERCISES & TESTS
  // ═══════════════════════════════════════════
  { id: 'english-test-store', title: 'English Test Store', description: 'Comprehensive collection of English proficiency tests.', url: 'http://englishteststore.net/', category: 'exercises', subcategory: 'Practice', level: 'all', icon: '📝' },
  { id: 'duolingo', title: 'Duolingo', description: 'Gamified language learning platform with daily exercises and progress tracking.', url: 'https://www.duolingo.com/', category: 'exercises', subcategory: 'Practice', level: 'beginner', icon: '🦉' },
  { id: 'lingorank', title: 'LingoRank', description: 'Improve listening comprehension through TED talks with interactive exercises.', url: 'http://lingorank.com/', category: 'exercises', subcategory: 'Practice', level: 'intermediate', icon: '🎤' },
  { id: 'cambridge-test', title: 'Cambridge English Tests', description: 'Official practice tests for various Cambridge English qualifications.', url: 'https://www.cambridgeenglish.org/test-your-english/', category: 'exercises', subcategory: 'Test Prep', level: 'all', icon: '🏅' },
  { id: 'ielts-practice', title: 'IELTS Practice', description: 'Free IELTS practice materials from the official source.', url: 'https://www.ielts.org/usa/ielts-for-test-takers/ielts-practice-test', category: 'exercises', subcategory: 'Test Prep', level: 'intermediate', icon: '🏅' },
  { id: 'toefl-resources', title: 'TOEFL Resources', description: 'Official TOEFL iBT preparation resources.', url: 'https://www.ets.org/toefl/test-takers/ibt/prepare', category: 'exercises', subcategory: 'Test Prep', level: 'intermediate', icon: '🏅' },

  // ═══════════════════════════════════════════
  //  ONLINE CLASSES
  // ═══════════════════════════════════════════
  { id: 'preply', title: 'Preply', description: 'Connect with professional tutors for personalized English lessons.', url: 'https://preply.com/', category: 'classes', subcategory: 'One-on-One Tutoring', level: 'all', icon: '👤' },
  { id: 'italki', title: 'iTalki', description: 'Find language exchange partners and professional teachers for one-on-one lessons.', url: 'https://www.italki.com/', category: 'classes', subcategory: 'One-on-One Tutoring', level: 'all', icon: '👤' },
  { id: 'verbling', title: 'Verbling', description: 'Book lessons with experienced teachers with integrated video chat.', url: 'https://www.verbling.com/', category: 'classes', subcategory: 'One-on-One Tutoring', level: 'all', icon: '👤' },
  { id: 'lingoda', title: 'Lingoda', description: 'Live group classes with native speakers, flexible scheduling.', url: 'https://lingoda.com/', category: 'classes', subcategory: 'Group Classes', level: 'all', icon: '👥' },
  { id: 'english-central', title: 'English Central', description: 'Video-based English lessons with pronunciation feedback.', url: 'https://www.englishcentral.com/', category: 'classes', subcategory: 'Group Classes', level: 'all', icon: '🎬' },
];

// Writing tips from the repo
export const writingTips = [
  'Practice writing for at least 15 minutes every day',
  'Start with simple topics and gradually increase complexity',
  'Read your writing aloud to catch errors and improve flow',
  'Use AI tools for immediate feedback, but don\'t rely on them exclusively',
  'Keep a journal in English to track your progress',
  'Join writing communities or find a writing partner for feedback',
];

// AI practical applications from the repo
export const aiLearningTips = [
  { title: 'Interactive Dialogue & Role-Play', description: 'Simulate specific scenarios like job interviews, client meetings, or daily tasks with AI personas.' },
  { title: 'Targeted Writing Feedback', description: 'Paste your written English to get feedback on grammar, clarity, and tone.' },
  { title: 'Applied Grammar Exploration', description: 'Request example sentences for specific grammar structures.' },
  { title: 'Reading Comprehension Help', description: 'Simplify complex texts by requesting summaries or explanations of difficult parts.' },
  { title: 'Custom Pronunciation Texts', description: 'Generate tongue twisters focusing on challenging sounds like "th" or "r" vs "l".' },
  { title: 'Personalized Study Plans', description: 'Outline a weekly study schedule tailored to your goals and proficiency level.' },
];
