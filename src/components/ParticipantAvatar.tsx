'use client';

import { useState } from 'react';
import { Participant } from '@/data/types';

interface ParticipantAvatarProps {
    participant: Participant;
    size?: number; // px
    className?: string;
}

export default function ParticipantAvatar({ participant: p, size = 40, className = '' }: ParticipantAvatarProps) {
    const [imgError, setImgError] = useState(false);

    const showPhoto = p.photo && !imgError;

    return (
        <div
            className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden ${className}`}
            style={{
                width: size,
                height: size,
                background: showPhoto ? 'transparent' : `${p.color}18`,
                border: `2px solid ${p.color}40`,
                fontSize: size * 0.5,
            }}
        >
            {showPhoto ? (
                <img
                    src={p.photo}
                    alt={p.name}
                    onError={() => setImgError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <span role="img" aria-label={p.name}>{p.emoji}</span>
            )}
        </div>
    );
}
