'use client';

import { useCallback, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AccommodationInfo, Activity, RouteStop, SavedRoute } from '@/data/types';
import { defaultAccommodation } from '@/data/trip';

const SHARED_DOC = 'viagens/ferias-maio-2026';

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

export function useSharedData() {
  const [data, setData] = useState<SharedData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);

  const [collectionName, docId] = SHARED_DOC.split('/');
  const docRef = doc(db, collectionName, docId);

  useEffect(() => {
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        setLoading(false);
        setOnline(true);

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
          return;
        }

        setDoc(docRef, defaultData);
      },
      () => {
        setLoading(false);
        setOnline(false);
      }
    );

    return () => unsub();
  }, [docRef]);

  const update = useCallback(
    async (partial: Partial<SharedData>) => {
      try {
        await setDoc(docRef, partial, { merge: true });
      } catch (err) {
        console.error('[Firebase] Failed to save shared data:', err);
      }
    },
    [docRef]
  );

  return { data, loading, online, update };
}
