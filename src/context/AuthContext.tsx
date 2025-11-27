'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GameUser } from '@/types';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  gameUser: GameUser | null;
  isAdmin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  gameUser: null,
  isAdmin: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [gameUser, setGameUser] = useState<GameUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // New user, create profile
          const newUser: Omit<GameUser, 'uid'> = {
            email: firebaseUser.email || '',
            createdAt: serverTimestamp(),
            role: 'user',
          };
          await setDoc(userRef, newUser);
          setGameUser({ uid: firebaseUser.uid, ...newUser });
        } else {
          setGameUser({ uid: firebaseUser.uid, ...userSnap.data() } as GameUser);
        }

        const idTokenResult = await firebaseUser.getIdTokenResult();
        setIsAdmin(idTokenResult.claims.admin === true);

        // Redirect from login page if user is already logged in
        if (pathname === '/login') {
            router.push('/');
        }
      } else {
        setUser(null);
        setGameUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const value = { user, gameUser, isAdmin, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
