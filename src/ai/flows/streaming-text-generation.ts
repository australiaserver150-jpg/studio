'use server';

/**
 * @fileOverview implements the streaming text generation flow.
 *
 * - streamingTextGeneration - A function that calls the text generation flow.
 * - StreamingTextGenerationInput - The input type for the streamingTextGeneration function.
 * - StreamingTextGenerationOutput - The return type for the streamingTextGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StreamingTextGenerationInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate text from.'),
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

const streamingTextGenerationPrompt = ai.definePrompt({
  name: 'streamingTextGenerationPrompt',
  input: {schema: StreamingTextGenerationInputSchema},
  output: {schema: StreamingTextGenerationOutputSchema},
  prompt: `Generate text from the following prompt: {{{prompt}}}`,
});

const streamingTextGenerationFlow = ai.defineFlow(
  {
    name: 'streamingTextGenerationFlow',
    inputSchema: StreamingTextGenerationInputSchema,
    outputSchema: StreamingTextGenerationOutputSchema,
  },
  async input => {
    const {output} = await streamingTextGenerationPrompt(input);
    return output!;
  }
);
