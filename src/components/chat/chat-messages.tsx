'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { ChatMessage } from './chat-message';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <Bot />
              </AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-0"></span>
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
