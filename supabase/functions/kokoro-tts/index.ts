import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voice = 'af_bella', language = 'en-us', speed = 1.0 } = await req.json();
    const KOKORO_TTS_URL = Deno.env.get('KOKORO_TTS_URL');

    if (!KOKORO_TTS_URL) {
      throw new Error('KOKORO_TTS_URL is not configured. Please set your self-hosted Kokoro TTS server URL.');
    }

    if (!text || text.trim() === '') {
      throw new Error('Text is required');
    }

    console.log(`Generating Kokoro TTS for: "${text.substring(0, 50)}..." voice: ${voice}, lang: ${language}, speed: ${speed}`);

    // Call the Kokoro TTS Gradio API
    // The Gradio API typically accepts POST to /api/predict or /run/predict
    const apiUrl = KOKORO_TTS_URL.replace(/\/$/, '');
    
    // Try the Gradio API format
    const response = await fetch(`${apiUrl}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [text, voice, language, speed],
        fn_index: 0,
      }),
    });

    if (!response.ok) {
      // Try alternate endpoint format
      console.log('Trying alternate Gradio endpoint...');
      const altResponse = await fetch(`${apiUrl}/run/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [text, voice, language, speed],
        }),
      });

      if (!altResponse.ok) {
        const errorText = await altResponse.text();
        console.error('Kokoro TTS API error:', altResponse.status, errorText);
        throw new Error(`Kokoro TTS API error: ${altResponse.status}`);
      }

      const altResult = await altResponse.json();
      console.log('Kokoro TTS response:', JSON.stringify(altResult).substring(0, 200));
      
      // Extract audio data from Gradio response
      const audioData = extractAudioFromGradioResponse(altResult, apiUrl);
      return createAudioResponse(audioData, corsHeaders);
    }

    const result = await response.json();
    console.log('Kokoro TTS response:', JSON.stringify(result).substring(0, 200));

    // Extract audio data from Gradio response
    const audioData = extractAudioFromGradioResponse(result, apiUrl);
    return createAudioResponse(audioData, corsHeaders);

  } catch (error) {
    console.error('Kokoro TTS error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Make sure your Kokoro TTS server is running and accessible'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Extract audio from Gradio response format
function extractAudioFromGradioResponse(result: any, baseUrl: string): { type: 'url' | 'base64', data: string } {
  // Gradio can return audio as:
  // 1. A file path/URL in result.data[0]
  // 2. A base64 encoded audio in result.data[0]
  // 3. An object with path/url/data property
  
  const audioOutput = result.data?.[0];
  
  if (!audioOutput) {
    throw new Error('No audio data in Kokoro response');
  }

  // If it's a string that looks like a URL or path
  if (typeof audioOutput === 'string') {
    if (audioOutput.startsWith('data:audio')) {
      // It's a base64 data URL
      const base64Data = audioOutput.split(',')[1];
      return { type: 'base64', data: base64Data };
    } else if (audioOutput.startsWith('http')) {
      // It's a full URL
      return { type: 'url', data: audioOutput };
    } else if (audioOutput.startsWith('/file=')) {
      // Gradio file path format
      return { type: 'url', data: `${baseUrl}${audioOutput}` };
    } else {
      // Assume it's a relative path
      return { type: 'url', data: `${baseUrl}/file=${audioOutput}` };
    }
  }

  // If it's an object (newer Gradio format)
  if (typeof audioOutput === 'object') {
    if (audioOutput.url) {
      return { type: 'url', data: audioOutput.url };
    }
    if (audioOutput.path) {
      return { type: 'url', data: `${baseUrl}/file=${audioOutput.path}` };
    }
    if (audioOutput.data) {
      return { type: 'base64', data: audioOutput.data };
    }
  }

  throw new Error('Unable to parse Kokoro audio response format');
}

async function createAudioResponse(
  audioData: { type: 'url' | 'base64', data: string },
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (audioData.type === 'url') {
    // Fetch the audio file and return it
    const audioResponse = await fetch(audioData.data);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio file: ${audioResponse.status}`);
    }
    const audioBuffer = await audioResponse.arrayBuffer();
    console.log(`Fetched audio: ${audioBuffer.byteLength} bytes`);
    
    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/wav',
      },
    });
  } else {
    // Decode base64 and return
    const binaryString = atob(audioData.data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    console.log(`Decoded base64 audio: ${bytes.length} bytes`);
    
    return new Response(bytes.buffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/wav',
      },
    });
  }
}
