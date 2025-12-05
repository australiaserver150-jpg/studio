'use client';

import {
  collection,
  onSnapshot,
  query,
  Query,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {useFirestore} from '../provider';

export function useCollection<T>(path: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    const q: Query<DocumentData> = query(collection(firestore, path));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map(
          (doc) => ({...doc.data(), id: doc.id} as T)
        );
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path]);

  return {data, loading, error};
}
