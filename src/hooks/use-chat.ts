'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';
import type { Message } from '@/lib/types';
import { CHAT_CONFIG } from '@/lib/chat-config';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

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
  
  const { user } = useUser();
  const firestore = useFirestore();

  const getChatCollectionPath = useCallback(() => {
    if (!user) return null;
    return `users/${user.uid}/chats`;
  }, [user]);

  // Load state from localStorage/Firestore on initial render
  useEffect(() => {
    if (user) {
      const chatCollectionPath = getChatCollectionPath();
      if (!chatCollectionPath) return;

      const q = query(collection(firestore, chatCollectionPath), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          setMessages(initialMessages);
          return;
        }
        const newMessages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: (data.createdAt as any)?.toDate() || new Date(),
          } as Message;
        });
        setMessages(newMessages);
      });
      return () => unsubscribe();
    } else {
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
      } catch (error) {
        console.error('Failed to load from localStorage', error);
        setMessages(initialMessages);
      }
    }
  }, [user, firestore, getChatCollectionPath]);


  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSystemPrompt = localStorage.getItem('chat_system_prompt');
      if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt);

      const shouldSaveKey = localStorage.getItem('chat_save_api_key') === 'true';
      setSaveApiKey(shouldSaveKey);

      if (shouldSaveKey) {
        const savedApiKey = localStorage.getItem('chat_api_key');
        if (savedApiKey) setApiKey(savedApiKey);
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage', error);
    }
  }, []);

  // Save messages to localStorage for guests
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages to localStorage', error);
      }
    }
  }, [messages, user]);

  // Save settings to localStorage
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

  const addMessageToDb = async (message: Omit<Message, 'id' | 'createdAt'>) => {
    const chatCollectionPath = getChatCollectionPath();
    if (!chatCollectionPath) return;

    await addDoc(collection(firestore, chatCollectionPath), {
      ...message,
      createdAt: serverTimestamp(),
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };
    
    if (user) {
      addMessageToDb(newUserMessage);
    } else {
      setMessages((prev) => [...prev, newUserMessage]);
    }

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

      if (user) {
        // This is a bit of a trick. We add the message with an empty content
        // so it gets an ID and a timestamp, then we'll stream update it.
        const assistantMessageRef = await addDoc(collection(firestore, getChatCollectionPath()!), {
          role: 'assistant',
          content: '',
          createdAt: serverTimestamp(),
        });
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantResponse += decoder.decode(value, { stream: true });
        }
        // Final update is done outside the loop when user is logged in
        // to avoid too many writes to firestore. We will just update the final message.
        // For a better UX we could update the doc every few seconds.
      } else {
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
      }

       const assistantFinalMessage: Omit<Message, 'id' | 'createdAt'> = {
          role: 'assistant',
          content: assistantResponse,
        };

      if (user) {
         addMessageToDb(assistantFinalMessage)
      }

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({
          variant: 'destructive',
          title: 'An error occurred.',
          description: error.message || 'Please try again.',
        });
        // For logged in users, we don't remove messages optimistically
        if(!user) {
          setMessages(prev => prev.filter(m => m.role !== 'assistant' || m.content !== ''));
        }
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

  const clear = async () => {
    if (user) {
      const chatCollectionPath = getChatCollectionPath();
      if (!chatCollectionPath) return;

      const q = query(collection(firestore, chatCollectionPath));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }
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

  const importChat = async (newMessages: Message[]) => {
    if (user) {
      await clear(); // Clear existing messages
      const chatCollectionPath = getChatCollectionPath();
      if (!chatCollectionPath) return;
      
      const addPromises = newMessages.map(msg => addDoc(collection(firestore, chatCollectionPath), {
        role: msg.role,
        content: msg.content,
        createdAt: new Date(msg.createdAt),
      }));
      await Promise.all(addPromises);

    } else {
      setMessages(newMessages.map(m => ({ ...m, createdAt: new Date(m.createdAt) })));
    }
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
