import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-prompt.ts';
import '@/ai/flows/streaming-text-generation.ts';
import '@/ai/flows/summarize-conversation.ts';