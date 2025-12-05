'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';
import type { Message } from '@/lib/types';
import { CHAT_CONFIG } from '@/lib/chat-config';

const initialMessages: Message[] = [
  {
    id: 'init',
    role: 'assistant',
    content: `Hello! I'm Reena, your friendly AI assistant. How can I help you today?`,
    createdAt: new Date(),
  },
];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saveApiKey, setSaveApiKey] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful and friendly AI assistant named Reena.'
  );

  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chat_messages');
      if (savedMessages) {
        setMessages(
          (JSON.parse(savedMessages) as any[]).map((msg) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          }))
        );
      } else {
        setMessages(initialMessages);
      }

      const savedSystemPrompt = localStorage.getItem('chat_system_prompt');
      if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt);

      const shouldSaveKey = localStorage.getItem('chat_save_api_key') === 'true';
      setSaveApiKey(shouldSaveKey);

      if (shouldSaveKey) {
        const savedApiKey = localStorage.getItem('chat_api_key');
        if (savedApiKey) setApiKey(savedApiKey);
      }
    } catch (error) {
      console.error('Failed to load from localStorage', error);
      setMessages(initialMessages);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages to localStorage', error);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('chat_system_prompt', systemPrompt);
    } catch (error) {
      console.error('Failed to save system prompt to localStorage', error);
    }
  }, [systemPrompt]);

  useEffect(() => {
    try {
      localStorage.setItem('chat_save_api_key', String(saveApiKey));
      if (saveApiKey) {
        localStorage.setItem('chat_api_key', apiKey);
      } else {
        localStorage.removeItem('chat_api_key');
      }
    } catch (error) {
      console.error('Failed to save API key settings to localStorage', error);
    }
  }, [apiKey, saveApiKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(CHAT_CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          systemPrompt,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      if (!res.body) {
        throw new Error('Response body is empty');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      const assistantMessageId = Date.now().toString();

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          createdAt: new Date(),
        },
      ]);
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantResponse += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: assistantResponse }
              : msg
          )
        );
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({
          variant: 'destructive',
          title: 'An error occurred.',
          description: error.message || 'Please try again.',
        });
        // Remove empty assistant message on error
        setMessages(prev => prev.filter(m => m.role !== 'assistant' || m.content !== ''));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const clear = () => {
    setMessages(initialMessages);
  };

  const exportChat = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reena-chat-history-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Success',
      description: 'Chat history exported.'
    });
  };

  const importChat = (newMessages: Message[]) => {
    setMessages(newMessages.map(m => ({ ...m, createdAt: new Date(m.createdAt) })));
  };


  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    clear,
    setInput: useCallback(setInput, []),
    apiKey,
    setApiKey,
    saveApiKey,
    setSaveApiKey,
    systemPrompt,
    setSystemPrompt,
    exportChat,
    importChat
  };
}
