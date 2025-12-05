'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop
}: ChatInputProps) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Safe to cast as we are in a form
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Textarea
        id="chat-input"
        placeholder="Ask me anything..."
        className="min-h-[40px] w-full resize-none pr-16"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      {isLoading ? (
        <Button
          size="icon"
          variant="ghost"
          className="absolute transform -translate-y-1/2 top-1/2 right-2"
          onClick={() => stop()}
        >
          <Square className="w-5 h-5" />
          <span className="sr-only">Stop</span>
        </Button>
      ) : (
        <Button
          size="icon"
          type="submit"
          variant="ghost"
          className="absolute transform -translate-y-1/2 top-1/2 right-2"
          disabled={!input}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </Button>
      )}
    </form>
  );
}
