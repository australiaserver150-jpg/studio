'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Settings, Trash2 } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { SettingsDialog } from './settings-dialog';
import { useChat } from '@/hooks/use-chat';

export function ChatHeader() {
  const { clear } = useChat();

  return (
    <div className="flex items-center justify-between w-full p-4 border-b h-14">
      <div className="text-lg font-semibold">Reena Chat</div>
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Clear history</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                chat history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => clear()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <SettingsDialog>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </SettingsDialog>
        <ThemeToggle />
      </div>
    </div>
  );
}
