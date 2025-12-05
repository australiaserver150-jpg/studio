'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/hooks/use-chat';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload } from 'lucide-react';
import React, { useRef } from 'react';
import type { Message } from '@/lib/types';

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const {
    apiKey,
    setApiKey,
    saveApiKey,
    setSaveApiKey,
    systemPrompt,
    setSystemPrompt,
    exportChat,
    importChat,
  } = useChat();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          // Basic validation
          if (Array.isArray(json) && json.every(msg => 'role' in msg && 'content' in msg)) {
            importChat(json as Message[]);
            toast({
              title: 'Success',
              description: 'Chat history imported successfully.',
            });
          } else {
            throw new Error('Invalid file format.');
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to import chat history. Invalid file.',
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure API settings and manage your chat data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="save-api-key"
                checked={saveApiKey}
                onCheckedChange={setSaveApiKey}
              />
              <Label htmlFor="save-api-key" className="text-xs text-muted-foreground">
                Save to localStorage (not recommended)
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="Set the behavior of the assistant..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Chat History</Label>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportChat} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
