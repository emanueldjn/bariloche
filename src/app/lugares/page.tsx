'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, MapPin } from 'lucide-react';
import { places } from '@/data/places';
import { Place } from '@/data/types';
import dynamic from 'next/dynamic';
import type { MapViewProps } from '@/components/MapView';
const MapView = dynamic<MapViewProps>(() => import('@/components/MapView'), { ssr: false });

const categoryConfig: Record<string, { label: string; emoji: string; color: string }> = {
    hotel: { label: 'Hotel', emoji: '🏨', color: 'var(--accent-secondary)' },
    restaurante: { label: 'Restaurante', emoji: '🍽️', color: 'var(--accent-amber)' },
    atracao: { label: 'Atração', emoji: '🏔️', color: 'var(--accent-cyan)' },
    compras: { label: 'Compras', emoji: '🛍️', color: 'var(--accent-pink)' },
    bar: { label: 'Bar/Cervejaria', emoji: '🍺', color: 'var(--accent-orange)' },
    transporte: { label: 'Transporte', emoji: '✈️', color: 'var(--text-secondary)' },
};

const filterTabs = [
    { id: 'todos', label: 'Todos', emoji: '🌟' },
    { id: 'atracao', label: 'Atrações', emoji: '🏔️' },
    { id: 'restaurante', label: 'Comida', emoji: '🍽️' },
    { id: 'compras', label: 'Compras', emoji: '🛍️' },
    { id: 'bar', label: 'Bares', emoji: '🍺' },
    { id: 'hotel', label: 'Hotel', emoji: '🏨' },
];

function PlaceCard({ place }: { place: Place }) {
    const cfg = categoryConfig[place.category];

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            className="card p-4 relative overflow-hidden"
        >
            {place.mustVisit && (
                <div
                    className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245,158,11,0.25)' }}
                >
                    ⭐ Must Visit
                </div>
            )}
            <div className="flex items-start gap-3 pr-16">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                    {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {place.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                            {cfg.label}
                        </span>
                        {place.rating && (
                            <span className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent-amber)' }}>
                                <Star size={10} fill="currentColor" />
                                {place.rating}
                            </span>
                        )}
                        {place.priceRange && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {place.priceRange}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-xs mt-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
                {place.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
                {place.tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex gap-2 mt-3">
                <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl"
                    style={{
                        background: 'rgba(6,182,212,0.1)',
                        border: '1px solid rgba(6,182,212,0.2)',
                        color: 'var(--accent-cyan)',
                    }}
                >
                    <MapPin size={12} />
                    Google Maps
                </a>
                <a
                    href={`https://maps.google.com/?q=${place.coordinates[0]},${place.coordinates[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl"
                    style={{
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        color: 'var(--accent-primary)',
                    }}
                >
                    <ExternalLink size={12} />
                    Abrir
                </a>
            </div>
        </motion.div>
    );
}

export default function LugaresPage() {
    const [activeFilter, setActiveFilter] = useState('todos');
    const [showMap, setShowMap] = useState(false);

    const filtered = activeFilter === 'todos'
        ? places
        : places.filter((p) => p.category === activeFilter);

    return (
        <main className="pb-safe">
            {/* Header */}
            <div className="px-4 pt-6 pb-3">
                <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    🗺️ Lugares
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Hotéis, atrações, restaurantes e mais
                </p>
            </div>

            {/* Map toggle */}
            <div className="px-4 mb-3">
                <div
                    className="flex rounded-2xl overflow-hidden p-1"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                    <button
                        onClick={() => setShowMap(false)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={
                            !showMap
                                ? { background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: '#fff' }
                                : { color: 'var(--text-muted)' }
                        }
                    >
                        📋 Lista
                    </button>
                    <button
                        onClick={() => setShowMap(true)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={
                            showMap
                                ? { background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: '#fff' }
                                : { color: 'var(--text-muted)' }
                        }
                    >
                        🗺️ Mapa
                    </button>
                </div>
            </div>

            {showMap ? (
                <div className="px-4">
                    <MapView places={places} />
                </div>
            ) : (
                <>
                    {/* Filter tabs */}
                    <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
                        {filterTabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => setActiveFilter(tab.id)}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                style={
                                    activeFilter === tab.id
                                        ? {
                                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                            color: '#fff',
                                            boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
                                        }
                                        : {
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-secondary)',
                                        }
                                }
                            >
                                <span>{tab.emoji}</span>
                                <span>{tab.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    <div className="px-4 space-y-3">
                        {filtered.map((place, i) => (
                            <motion.div
                                key={place.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <PlaceCard place={place} />
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}
