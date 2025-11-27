'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserButton } from '../auth/UserButton';
import { Loader2 } from 'lucide-react';
import { Gamepad2 } from 'lucide-react';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Go to Homepage">
            <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">
            GameTopUp Zone
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1" aria-label="Main navigation">
            {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading user information" />
            ) : user ? (
              <UserButton />
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
