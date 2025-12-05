'use server';

/**
 * @fileOverview Generates an initial prompt for the Reena Chatbot using GenAI.
 *
 * This file defines a Genkit flow that suggests an initial prompt to the user,
 * helping them get started with the chatbot quickly.
 *
 * @interface GenerateInitialPromptInput - The input type for the generateInitialPrompt function (empty).
 * @interface GenerateInitialPromptOutput - The output type for the generateInitialPrompt function (string).
 * @function generateInitialPrompt - A function that calls the generateInitialPromptFlow to generate the initial prompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPromptInputSchema = z.object({});
export type GenerateInitialPromptInput = z.infer<typeof GenerateInitialPromptInputSchema>;

const GenerateInitialPromptOutputSchema = z.string();
export type GenerateInitialPromptOutput = z.infer<typeof GenerateInitialPromptOutputSchema>;

export async function generateInitialPrompt(
  _input: GenerateInitialPromptInput
): Promise<GenerateInitialPromptOutput> {
  return generateInitialPromptFlow({});
}

const initialPrompt = `You are Reena, a helpful and friendly chatbot.
  Suggest a single creative and engaging prompt that a user could use to start a conversation with you. The prompt should be something that sparks curiosity and encourages interaction.
  The prompt should be less than 20 words.
  Return just the prompt with no extra text or quotation marks.`;

const generateInitialPromptFlow = ai.defineFlow(
  {
    name: 'generateInitialPromptFlow',
    inputSchema: GenerateInitialPromptInputSchema,
    outputSchema: GenerateInitialPromptOutputSchema,
  },
  async () => {
    const {text} = await ai.generate({
      prompt: initialPrompt,
    });
    return text;
  }
);
