'use client';

import { useChat } from '@/hooks/use-chat';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';
import { ChatHeader } from './chat-header';
import { ChatSuggestions } from './chat-suggestions';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function ChatLayout() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    stop,
  } = useChat();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const inputElement = document.querySelector(
          '#chat-input'
        ) as HTMLTextAreaElement | null;
        inputElement?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative flex h-full w-full max-w-4xl flex-col rounded-lg border bg-card text-card-foreground shadow-lg">
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
        />
      </div>
      <div className="w-full p-4 pt-2 shrink-0">
        <div className={cn('mx-auto sm:max-w-2xl', 'space-y-4')}>
          <ChatSuggestions setInput={setInput} />
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
          />
        </div>
      </div>
    </div>
  );
}
