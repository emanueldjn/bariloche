'use client';

import { motion } from 'framer-motion';
import { Plane, Calendar, Phone } from 'lucide-react';
import { participants } from '@/data/participants';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const tips = [
    { icon: '💱', text: 'Melhor câmbio: Blue (paralelo). Evite casas de câmbio em aeroportos.' },
    { icon: '📱', text: 'Chip argentino: compre na chegada em Bariloche (Personal ou Claro Argentina).' },
    { icon: '🏦', text: 'Levar pesos argentinos e dólares. ATMs cobram taxa alta.' },
    { icon: '🧥', text: 'Agosto = inverno! Temperaturas de 0°C a 12°C. Roupa de frio obrigatória.' },
    { icon: '🚌', text: 'Ônibus urbano (Bus Urbano) para se locomover. Pagar com cartão sube.' },
    { icon: '🍫', text: 'Passeio obrigatório: Rua Mitre com as chocolaterias artesanais!' },
    { icon: '⚡', text: 'Tomadas: tipo I (dois pinos triangulares). Levar adaptador universal.' },
    { icon: '🌡️', text: 'Protetor solar mesmo no inverno! A neve reflete os raios UV intensamente.' },
];

const contacts = [
    { label: 'Emergência Argentina', value: '911', emoji: '🚨' },
    { label: 'Bombeiros', value: '100', emoji: '🔥' },
    { label: 'Polícia Bariloche', value: '101', emoji: '👮' },
    { label: 'SAMU Argentina', value: '107', emoji: '🏥' },
    { label: 'Aeroporto Bariloche', value: '+54 294 440-5016', emoji: '✈️' },
];

export default function GrupoPage() {
    return (
        <main className="pb-safe">
            {/* Header */}
            <div className="px-4 pt-6 pb-3">
                <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    👥 Nosso Grupo
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    5 aventureiros rumo à Patagônia!
                </p>
            </div>

            <div className="px-4 space-y-6">
                {/* Participants */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                    {participants.map((p) => (
                        <motion.div
                            key={p.id}
                            variants={itemVariants}
                            className="card p-4 overflow-hidden relative"
                        >
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                                style={{ background: p.color }}
                            />
                            <div className="flex items-center gap-4 pl-2">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                                    style={{
                                        background: `linear-gradient(135deg, ${p.color}20, ${p.color}10)`,
                                        border: `2px solid ${p.color}35`,
                                    }}
                                >
                                    {p.emoji}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif', color: p.color }}>
                                        {p.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Plane size={11} style={{ color: 'var(--text-muted)' }} />
                                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            Chegada: {p.arrival}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={11} style={{ color: 'var(--text-muted)' }} />
                                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            Volta: {p.departure}
                                        </span>
                                    </div>
                                    {p.phone && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Phone size={11} style={{ color: 'var(--text-muted)' }} />
                                            <a
                                                href={`tel:${p.phone}`}
                                                className="text-xs font-medium"
                                                style={{ color: p.color }}
                                            >
                                                {p.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Emergency Contacts */}
                <div>
                    <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        🆘 Contatos de Emergência
                    </h2>
                    <div className="card overflow-hidden">
                        {contacts.map((c, i) => (
                            <div
                                key={c.label}
                                className="flex items-center justify-between px-4 py-3"
                                style={{ borderBottom: i < contacts.length - 1 ? '1px solid var(--border)' : 'none' }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{c.emoji}</span>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        {c.label}
                                    </span>
                                </div>
                                <a
                                    href={`tel:${c.value}`}
                                    className="text-sm font-bold"
                                    style={{ color: 'var(--accent-primary)' }}
                                >
                                    {c.value}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div>
                    <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        💡 Dicas Importantes
                    </h2>
                    <div className="space-y-2">
                        {tips.map((tip, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex items-start gap-3 p-3 rounded-2xl"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                            >
                                <span className="text-lg shrink-0 mt-0.5">{tip.icon}</span>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {tip.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
