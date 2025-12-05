'use client';

import {FirebaseApp, initializeApp} from 'firebase/app';
import {Auth, getAuth} from 'firebase/auth';
import {Firestore, getFirestore} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {firebaseConfig} from './config';
import {FirebaseProvider} from './provider';

interface FirebaseClientProviderProps {
  children: React.ReactNode;
}

export function FirebaseClientProvider({children}: FirebaseClientProviderProps) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    setFirebaseApp(app);
    setFirestore(getFirestore(app));
    setAuth(getAuth(app));
  }, []);

  if (!firebaseApp || !firestore || !auth) {
    return null; // or a loading indicator
  }

  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
