'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AccommodationInfo, Activity, RouteStop, SavedRoute } from '@/data/types';
import { defaultAccommodation } from '@/data/trip';
import { SyncState } from '@/components/SyncStatus';

const COLLECTION_NAME = 'viagens';
const DOC_ID = 'ferias-maio-2026';

export interface SharedData {
  customActivities: Record<string, Activity[]>;
  deletedActivities: Record<string, string[]>;
  accommodation: AccommodationInfo;
  routeDraft: RouteStop[];
  savedRoutes: SavedRoute[];
  checklistState: Record<string, boolean>;
}

const defaultData: SharedData = {
  customActivities: {},
  deletedActivities: {},
  accommodation: defaultAccommodation,
  routeDraft: [],
  savedRoutes: [],
  checklistState: {},
};

function getFirebaseErrorMessage(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: string }).code) : '';

  switch (code) {
    case 'permission-denied':
      return 'O Firebase recusou a gravacao. Verifique as regras do Firestore.';
    case 'unavailable':
      return 'Sem conexao com o Firebase agora. Tente novamente.';
    case 'failed-precondition':
      return 'O Firestore nao parece configurado corretamente.';
    default:
      return 'Nao foi possivel salvar no Firebase.';
  }
}

export function useSharedData() {
  const [data, setData] = useState<SharedData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState<SyncState>('connecting');
  const [syncMessage, setSyncMessage] = useState('Conectando com o grupo...');
  const successHoldRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSuccessTimer = useCallback(() => {
    if (successHoldRef.current) {
      clearTimeout(successHoldRef.current);
      successHoldRef.current = null;
    }
  }, []);

  const holdSuccessMessage = useCallback(
    (message: string) => {
      clearSuccessTimer();
      setSyncState('synced');
      setSyncMessage(message);
      successHoldRef.current = setTimeout(() => {
        setSyncMessage('Sincronizado com o grupo');
        successHoldRef.current = null;
      }, 2500);
    },
    [clearSuccessTimer]
  );

  useEffect(() => {
    let unsub = () => {};
    let cancelled = false;

    const start = async () => {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.warn('[Firebase] Anonymous auth not available:', error);
      }

      if (cancelled) {
        return;
      }

      const docRef = doc(db, COLLECTION_NAME, DOC_ID);

      unsub = onSnapshot(
        docRef,
        { includeMetadataChanges: true },
        (snap) => {
          setLoading(false);

          if (snap.exists()) {
            const incoming = snap.data() as Partial<SharedData>;

            setData({
              ...defaultData,
              ...incoming,
              accommodation: {
                ...defaultData.accommodation,
                ...(incoming.accommodation || {}),
              },
              routeDraft: incoming.routeDraft || defaultData.routeDraft,
              savedRoutes: incoming.savedRoutes || defaultData.savedRoutes,
              checklistState: incoming.checklistState || defaultData.checklistState,
            });
          } else {
            clearSuccessTimer();
            setSyncState('syncing');
            setSyncMessage('Criando espaco compartilhado no Firebase...');

            void setDoc(docRef, defaultData).catch((error) => {
              clearSuccessTimer();
              setSyncState('error');
              setSyncMessage(getFirebaseErrorMessage(error));
            });
            return;
          }

          if (snap.metadata.hasPendingWrites) {
            clearSuccessTimer();
            setSyncState('syncing');
            setSyncMessage('Salvando para o grupo...');
            return;
          }

          setSyncState('synced');
          setSyncMessage((previous) => (previous.startsWith('Salvo') ? previous : 'Sincronizado com o grupo'));
        },
        (error) => {
          setLoading(false);
          clearSuccessTimer();
          setSyncState('error');
          setSyncMessage(getFirebaseErrorMessage(error));
        }
      );
    };

    void start();

    return () => {
      cancelled = true;
      clearSuccessTimer();
      unsub();
    };
  }, [clearSuccessTimer]);

  const update = useCallback(
    async (partial: Partial<SharedData>) => {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);

      try {
        clearSuccessTimer();
        setSyncState('syncing');
        setSyncMessage('Salvando para o grupo...');
        await setDoc(docRef, partial, { merge: true });
        holdSuccessMessage('Salvo para o grupo');
        return true;
      } catch (error) {
        clearSuccessTimer();
        setSyncState('error');
        setSyncMessage(getFirebaseErrorMessage(error));
        console.error('[Firebase] Failed to save shared data:', error);
        return false;
      }
    },
    [clearSuccessTimer, holdSuccessMessage]
  );

  return { data, loading, syncState, syncMessage, update };
}
