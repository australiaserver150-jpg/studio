'use client';

import { Button } from '@/components/ui/button';
import { generateInitialPrompt } from '@/ai/flows/generate-initial-prompt';
import { useEffect, useState } from 'react';

interface ChatSuggestionsProps {
  setInput: (input: string) => void;
}

const staticSuggestions = [
  'What are you?',
  'Explain quantum computing.',
  'Write a poem about the ocean.',
];

export function ChatSuggestions({ setInput }: ChatSuggestionsProps) {
  const [aiSuggestion, setAiSuggestion] = useState('');

  useEffect(() => {
    async function getInitialPrompt() {
      try {
        const prompt = await generateInitialPrompt({});
        setAiSuggestion(prompt);
      } catch (error) {
        console.error('Failed to get initial prompt:', error);
      }
    }
    getInitialPrompt();
  }, []);

  const suggestions = aiSuggestion ? [aiSuggestion, ...staticSuggestions.slice(0, 2)] : staticSuggestions;

  return (
    <div className="flex flex-wrap items-center justify-start gap-2">
      {suggestions.map((s, i) => (
        <Button key={i} variant="outline" size="sm" onClick={() => setInput(s)}>
          {s}
        </Button>
      ))}
    </div>
  );
}
