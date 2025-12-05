'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const assistantAvatar = PlaceHolderImages.find((img) => img.id === 'assistant-avatar');

  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-in fade-in',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="w-8 h-8">
          {assistantAvatar ? (
            <AvatarImage src={assistantAvatar.imageUrl} alt="Reena" />
          ) : null}
          <AvatarFallback>
            <Bot />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none text-current">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          {userAvatar ? (
            <AvatarImage src={userAvatar.imageUrl} alt="User" />
          ) : null}
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
