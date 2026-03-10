'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
    targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isTripOver, setIsTripOver] = useState(false);
    const [isTripActive, setIsTripActive] = useState(false);

    useEffect(() => {
        const compute = () => {
            const now = new Date();
            const target = new Date(targetDate);
            const endDate = new Date('2026-08-31T23:59:59');

            if (now > endDate) {
                setIsTripOver(true);
                return;
            }
            if (now >= target && now <= endDate) {
                setIsTripActive(true);
                return;
            }

            const diff = target.getTime() - now.getTime();
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };

        compute();
        const interval = setInterval(compute, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (isTripOver) {
        return (
            <div className="text-center py-4">
                <p className="text-3xl">🎉</p>
                <p className="gradient-text text-xl font-bold mt-1">Viagem concluída!</p>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Que saudades de Bariloche!</p>
            </div>
        );
    }

    if (isTripActive) {
        return (
            <div className="text-center py-4">
                <motion.p
                    className="text-4xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    🏔️
                </motion.p>
                <p className="gradient-text text-xl font-bold mt-1">Estamos em Bariloche!</p>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Aproveitem cada momento!</p>
            </div>
        );
    }

    const units = [
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds },
    ];

    return (
        <div className="flex items-center justify-center gap-3">
            {units.map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                        <motion.div
                            key={unit.value}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl px-3 py-2 min-w-[52px] text-center"
                            style={{
                                background: 'rgba(99,102,241,0.15)',
                                border: '1px solid rgba(99,102,241,0.3)',
                            }}
                        >
                            <span
                                className="font-bold text-2xl"
                                style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--accent-primary)' }}
                            >
                                {String(unit.value).padStart(2, '0')}
                            </span>
                        </motion.div>
                        <span
                            className="text-[10px] mt-1 font-medium uppercase tracking-wider"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {unit.label}
                        </span>
                    </div>
                    {i < 3 && (
                        <span
                            className="text-xl font-bold pb-4"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            :
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
