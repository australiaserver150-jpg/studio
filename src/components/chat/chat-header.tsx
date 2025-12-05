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
import { Settings, Trash2, LogIn, LogOut } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { SettingsDialog } from './settings-dialog';
import { useChat } from '@/hooks/use-chat';
import { useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export function ChatHeader() {
  const { clear } = useChat();
  const { user, loading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Logged In',
        description: 'You have successfully signed in.',
      });
    } catch (error) {
      console.error('Login failed', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have successfully signed out.',
      });
    } catch (error) {
      console.error('Logout failed', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Could not sign out. Please try again.',
      });
    }
  };

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
        {loading ? null : user ? (
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            <span className="sr-only">Logout</span>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleLogin}>
            <LogIn className="w-4 h-4" />
            <span className="sr-only">Login</span>
          </Button>
        )}
      </div>
    </div>
  );
}
