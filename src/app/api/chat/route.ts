import { type NextRequest } from 'next/server';
import { streamingTextGeneration } from '@/ai/flows/streaming-text-generation';
import { CHAT_CONFIG } from '@/lib/chat-config';
import type { Message } from '@/lib/types';
import { GenkitError } from 'genkit';

export async function POST(request: NextRequest) {
  const { messages, systemPrompt }: { messages: Message[], systemPrompt?: string } = await request.json();

  if (!messages || messages.length === 0) {
    return new Response('No messages found', { status: 400 });
  }

  if (CHAT_CONFIG.USE_MOCK_MODE) {
    const mockResponse = "This is a mock response from Reena. To connect to a real AI, please configure your API key in the settings and disable mock mode in `src/lib/chat-config.ts`.";
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of mockResponse.split(' ')) {
          const encoded = new TextEncoder().encode(chunk + ' ');
          controller.enqueue(encoded);
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
        controller.close();
      },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  try {
    const response = await streamingTextGeneration({ messages, systemPrompt });
    const text = response.text;
    
    if (CHAT_CONFIG.USE_STREAMING) {
      const stream = new ReadableStream({
        async start(controller) {
          for (const char of text.split('')) {
            const encoded = new TextEncoder().encode(char);
            controller.enqueue(encoded);
            await new Promise((resolve) => setTimeout(resolve, 5));
          }
          controller.close();
        },
      });
      return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    } else {
      return new Response(JSON.stringify({ text }), { headers: { 'Content-Type': 'application/json' } });
    }
  } catch (e) {
    const error = e as GenkitError;
    let errorMessage = 'An unexpected error occurred.';
    let errorStatus = 500;

    if (error.name === 'GenkitError') {
      switch (error.reason) {
        case 'INVALID_ARGUMENT':
          errorMessage =
            'There was an issue with the request to the AI. Please check the data being sent.';
          errorStatus = 400;
          break;
        case 'UNAUTHENTICATED':
          errorMessage =
            'The API key is missing or invalid. Please check your environment variables.';
          errorStatus = 401;
          break;
        case 'PERMISSION_DENIED':
          errorMessage =
            'You do not have permission to access this resource. Check your API key and permissions.';
          errorStatus = 403;
          break;
        case 'UNAVAILABLE':
          errorMessage = 'The AI service is currently unavailable. Please try again later.';
          errorStatus = 503;
          break;
        default:
          errorMessage = error.message;
      }
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }

    console.error(e);
    return new Response(errorMessage, { status: errorStatus });
  }
}
