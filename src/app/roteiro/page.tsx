'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MapPin, Clock, Lightbulb } from 'lucide-react';
import { itinerary } from '@/data/itinerary';
import { Activity } from '@/data/types';

const categoryConfig: Record<string, { label: string; emoji: string; cls: string }> = {
    transporte: { label: 'Transporte', emoji: '✈️', cls: 'cat-transporte' },
    hospedagem: { label: 'Hospedagem', emoji: '🏨', cls: 'cat-hospedagem' },
    passeio: { label: 'Passeio', emoji: '🎿', cls: 'cat-passeio' },
    refeicao: { label: 'Refeição', emoji: '🍽️', cls: 'cat-refeicao' },
    compras: { label: 'Compras', emoji: '🛍️', cls: 'cat-compras' },
    lazer: { label: 'Lazer', emoji: '🍺', cls: 'cat-lazer' },
};

function ActivityCard({ activity }: { activity: Activity }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = categoryConfig[activity.category];

    return (
        <motion.div
            layout
            className="card overflow-hidden"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                        >
                            {cfg.emoji}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span
                                className="flex items-center gap-1 text-xs font-semibold"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <Clock size={11} />
                                {activity.time}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                                {cfg.label}
                            </span>
                        </div>
                        <p className="font-bold text-sm leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {activity.title}
                        </p>
                        {activity.location && (
                            <p className="flex items-center gap-1 text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                <MapPin size={11} />
                                {activity.location}
                            </p>
                        )}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div
                            className="px-4 pb-4 space-y-2"
                            style={{ borderTop: '1px solid var(--border)' }}
                        >
                            <p className="text-sm pt-3" style={{ color: 'var(--text-secondary)' }}>
                                {activity.description}
                            </p>
                            {activity.tips && (
                                <div
                                    className="flex items-start gap-2 rounded-xl p-3"
                                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                                >
                                    <Lightbulb size={14} style={{ color: 'var(--accent-amber)', marginTop: 1 }} />
                                    <p className="text-xs" style={{ color: 'var(--accent-amber)' }}>
                                        {activity.tips}
                                    </p>
                                </div>
                            )}
                            {activity.coordinates && (
                                <a
                                    href={`https://maps.google.com/?q=${activity.coordinates[0]},${activity.coordinates[1]}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                                    style={{
                                        background: 'rgba(6,182,212,0.1)',
                                        border: '1px solid rgba(6,182,212,0.25)',
                                        color: 'var(--accent-cyan)',
                                    }}
                                >
                                    <MapPin size={12} />
                                    Ver no Maps
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function RoteiroPage() {
    const [activeDay, setActiveDay] = useState(0);
    const day = itinerary[activeDay];

    return (
        <main className="pb-safe">
            {/* Header */}
            <div className="px-4 pt-6 pb-3">
                <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    📅 Roteiro
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Bariloche — 27 a 31 de Agosto
                </p>
            </div>

            {/* Day tabs */}
            <div className="flex gap-2 px-4 pb-4 overflow-x-auto hide-scrollbar">
                {itinerary.map((d, i) => (
                    <motion.button
                        key={d.date}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setActiveDay(i)}
                        className="shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl transition-all"
                        style={
                            activeDay === i
                                ? {
                                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                    color: '#fff',
                                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                                }
                                : {
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                }
                        }
                    >
                        <span className="text-base leading-none">{d.weather?.icon}</span>
                        <span className="text-xs font-bold mt-1">{d.shortDate}</span>
                        <span className="text-[10px] font-medium opacity-80">{d.weekday}</span>
                    </motion.button>
                ))}
            </div>

            {/* Day header */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="px-4 space-y-3"
                >
                    <div
                        className="flex items-center justify-between p-4 rounded-2xl mb-2"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))' }}
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                {day.dayLabel} · {day.weekday} · {day.shortDate}
                            </p>
                            <p className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                                {day.activities.length} atividades planejadas
                            </p>
                        </div>
                        {day.weather && (
                            <div className="text-right">
                                <span className="text-2xl">{day.weather.icon}</span>
                                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                    {day.weather.min}° – {day.weather.max}°C
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Activities */}
                    <div className="space-y-3">
                        {day.activities.map((activity, i) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <ActivityCard activity={activity} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
