'use server';

/**
 * @fileOverview implements the streaming text generation flow.
 *
 * - streamingTextGeneration - A function that calls the text generation flow.
 * - StreamingTextGenerationInput - The input type for the streamingTextGeneration function.
 * - StreamingTextGenerationOutput - The return type for the streamingTextGeneration function.
 */

import {ai} from '@/ai/genkit';
import {Message, roleToModelRole} from 'genkit';
import {z} from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const StreamingTextGenerationInputSchema = z.object({
  messages: z.array(MessageSchema).describe('The history of the conversation.'),
  systemPrompt: z.string().optional().describe('An optional system prompt.'),
});

export type StreamingTextGenerationInput = z.infer<
  typeof StreamingTextGenerationInputSchema
>;

const StreamingTextGenerationOutputSchema = z.object({
  text: z.string().describe('The generated text.'),
});

export type StreamingTextGenerationOutput = z.infer<
  typeof StreamingTextGenerationOutputSchema
>;

export async function streamingTextGeneration(
  input: StreamingTextGenerationInput
): Promise<StreamingTextGenerationOutput> {
  return streamingTextGenerationFlow(input);
}

const streamingTextGenerationFlow = ai.defineFlow(
  {
    name: 'streamingTextGenerationFlow',
    inputSchema: StreamingTextGenerationInputSchema,
    outputSchema: StreamingTextGenerationOutputSchema,
  },
  async ({messages, systemPrompt}) => {
    const history: Message[] = messages.map((message) => ({
      role: roleToModelRole(message.role),
      content: [{text: message.content}],
    }));

    if (systemPrompt) {
      history.unshift({
        role: 'system',
        content: [{text: systemPrompt}],
      });
    }

    const {text} = await ai.generate({
      history,
    });
    return {text};
  }
);
