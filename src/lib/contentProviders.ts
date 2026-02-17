/**
 * Content Providers — Video search for ESL learning contexts.
 * 
 * Calls the search-videos edge function server-side.
 * Falls back to curated mock data if the API fails.
 * 
 * Inspired by scraping-apis-for-devs video API catalog.
 * Suitable free-tier APIs identified:
 * 1. Pexels Video API (free, good for ambient/contextual clips)
 * 2. Pixabay Video API (free, educational clips)
 * 3. YouTube Data API v3 (free tier, best for ESL content)
 * 4. Dailymotion Search (no auth needed for basic search)
 * 5. Vimeo Search (free tier available)
 */

export type ContextEnvironment = 'airport' | 'cafe' | 'job_interview' | 'flatshare' | 'hotel' | 'restaurant' | 'home_study';

export interface VideoResult {
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  source: string;
}

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-videos`;

/**
 * Search for contextual videos via edge function.
 * Falls back to curated mock data on error.
 */
export async function searchContextVideos(context: ContextEnvironment): Promise<VideoResult[]> {
  try {
    const resp = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ context }),
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    
    const data = await resp.json();
    if (data.videos && data.videos.length > 0) {
      return data.videos;
    }
  } catch (err) {
    console.warn('[ContentProviders] Edge function failed, using fallback:', err);
  }

  return getFallbackVideos(context);
}

/**
 * Curated fallback videos for each context when API is unavailable.
 */
function getFallbackVideos(context: ContextEnvironment): VideoResult[] {
  const fallbacks: Record<ContextEnvironment, VideoResult[]> = {
    airport: [
      {
        title: "English at the Airport – Real Conversations",
        thumbnailUrl: "https://img.youtube.com/vi/rLZ4zRHSNeg/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=rLZ4zRHSNeg",
        source: "YouTube",
      },
      {
        title: "Airport Vocabulary & Phrases for Travelers",
        thumbnailUrl: "https://img.youtube.com/vi/GD5BVbU-1oo/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=GD5BVbU-1oo",
        source: "YouTube",
      },
      {
        title: "How to Make Small Talk – Travel English",
        thumbnailUrl: "https://img.youtube.com/vi/Qm2x-RJcVXo/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Qm2x-RJcVXo",
        source: "YouTube",
      },
    ],
    cafe: [
      {
        title: "Ordering Coffee in English – Natural Phrases",
        thumbnailUrl: "https://img.youtube.com/vi/7NpoaDJFUNI/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=7NpoaDJFUNI",
        source: "YouTube",
      },
      {
        title: "Café English – Real-Life Ordering Dialogues",
        thumbnailUrl: "https://img.youtube.com/vi/UVU9jB4MYp8/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=UVU9jB4MYp8",
        source: "YouTube",
      },
    ],
    job_interview: [
      {
        title: "Job Interview in English – Top Questions & Answers",
        thumbnailUrl: "https://img.youtube.com/vi/1mHjMNZZvFo/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1mHjMNZZvFo",
        source: "YouTube",
      },
      {
        title: "Tell Me About Yourself – Perfect Answer",
        thumbnailUrl: "https://img.youtube.com/vi/es7XtrlsDIQ/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=es7XtrlsDIQ",
        source: "YouTube",
      },
    ],
    flatshare: [
      {
        title: "How to Talk to Flatmates in English",
        thumbnailUrl: "https://img.youtube.com/vi/PkLSLMrXrjE/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=PkLSLMrXrjE",
        source: "YouTube",
      },
    ],
    hotel: [
      {
        title: "Hotel Check-In English – Essential Phrases",
        thumbnailUrl: "https://img.youtube.com/vi/3a0FgMLVBQI/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=3a0FgMLVBQI",
        source: "YouTube",
      },
      {
        title: "Complaining at a Hotel – Polite English",
        thumbnailUrl: "https://img.youtube.com/vi/n7Q3BaWhYfQ/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=n7Q3BaWhYfQ",
        source: "YouTube",
      },
    ],
    restaurant: [
      {
        title: "Restaurant English – Full Dining Experience",
        thumbnailUrl: "https://img.youtube.com/vi/mvqCFGO5W6Y/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=mvqCFGO5W6Y",
        source: "YouTube",
      },
      {
        title: "How to Order Food in English – Real Examples",
        thumbnailUrl: "https://img.youtube.com/vi/HJDw-BL2a_w/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=HJDw-BL2a_w",
        source: "YouTube",
      },
    ],
    home_study: [
      {
        title: "English Listening Practice – Daily Conversations",
        thumbnailUrl: "https://img.youtube.com/vi/juKd26qkNAw/mqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=juKd26qkNAw",
        source: "YouTube",
      },
    ],
  };

  return fallbacks[context] || [];
}

/**
 * Log when a video suggestion is displayed (for research tracking).
 */
export function logVideoSuggestion(lessonId: string, context: string, source: string): void {
  console.log('[SEE:video_suggested]', JSON.stringify({
    lessonId,
    context,
    source,
    timestamp: new Date().toISOString(),
  }));
}
