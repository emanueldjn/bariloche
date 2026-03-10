'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
    const [stored, setStored] = useState<T>(initialValue);

    useEffect(() => {
        try {
            const item = localStorage.getItem(key);
            if (item) setStored(JSON.parse(item));
        } catch { }
    }, [key]);

    const setValue = (value: T) => {
        try {
            setStored(value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch { }
    };

    return [stored, setValue];
}
