'use client';

import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Activity } from '@/data/types';

// The single shared document for the whole group
const SHARED_DOC = 'viagem-2026/shared';

export interface SharedData {
    // Roteiro
    customActivities: Record<string, Activity[]>;   // date → activities[]
    deletedActivities: Record<string, string[]>;     // date → activity IDs

    // Accommodation
    accommodation: {
        ba: string;
        bariloche: string;
        phone: string;
        notes: string;
    };

    // Car routes
    savedRoutes: Array<{
        id: string;
        name: string;
        stops: Array<{ id: string; label: string; address: string }>;
    }>;
}

const defaultData: SharedData = {
    customActivities: {},
    deletedActivities: {},
    accommodation: { ba: '', bariloche: '', phone: '', notes: '' },
    savedRoutes: [],
};

export function useSharedData() {
    const [data, setData] = useState<SharedData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [online, setOnline] = useState(true);

    // Parse SHARED_DOC into collection/document
    const [col, docId] = SHARED_DOC.split('/');
    const docRef = doc(db, col, docId);

    useEffect(() => {
        // Real-time listener
        const unsub = onSnapshot(
            docRef,
            (snap) => {
                setLoading(false);
                setOnline(true);
                if (snap.exists()) {
                    setData({ ...defaultData, ...snap.data() } as SharedData);
                } else {
                    // First use — create the document with defaults
                    setDoc(docRef, defaultData);
                }
            },
            () => {
                setLoading(false);
                setOnline(false);
            }
        );
        return () => unsub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const update = useCallback(async (partial: Partial<SharedData>) => {
        try {
            await updateDoc(docRef, partial as Record<string, unknown>);
        } catch {
            // Document might not exist yet
            await setDoc(docRef, { ...defaultData, ...partial });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, online, update };
}
