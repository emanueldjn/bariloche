'use client';

import { motion } from 'framer-motion';
import { Plane, Calendar, Phone } from 'lucide-react';
import { participants } from '@/data/participants';
import ParticipantAvatar from '@/components/ParticipantAvatar';

const tips = [
    { icon: '💱', text: 'Melhor câmbio: Blue (paralelo). Evite casas de câmbio em aeroportos.' },
    { icon: '📱', text: 'Chip argentino: compre na chegada. Personal ou Claro Argentina funcionam bem.' },
    { icon: '🏦', text: 'Levar pesos argentinos e dólares. ATMs cobram taxa alta.' },
    { icon: '🧥', text: 'Agosto = inverno! 0°C a 18°C. Roupa de frio obrigatória, especialmente em Bariloche.' },
    { icon: '⚡', text: 'Argentina usa tomada Tipo I (dois pinos triangulares). Levar adaptador universal.' },
    { icon: '🌡️', text: 'Protetor solar mesmo no inverno! A neve reflete os raios UV intensamente em Bariloche.' },
    { icon: '⛴️', text: 'Ferry Buquebus BA–Colônia: comprar com antecedência. Passaporte obrigatório no Uruguai.' },
    { icon: '🚗', text: 'Aluguel de carro em Bariloche: reserve com antecedência! Necessário para o Circuito Chico.' },
    { icon: '🍫', text: 'Bariloche: não saia sem chocolates artesanais da Rua Mitre!' },
    { icon: '🛂', text: 'Uruguai: brasileiros com RG ou passaporte. Argentinos precisam de passaporte!' },
];

const emergencyContacts = [
    { label: 'Emergência Argentina', value: '911', emoji: '🚨' },
    { label: 'SAME (ambulância BA)', value: '107', emoji: '🏥' },
    { label: 'Pol. Turística BA', value: '0800-999-5000', emoji: '👮' },
    { label: 'Emergência Uruguai', value: '911', emoji: '🇺🇾' },
    { label: 'Aeroporto Bariloche', value: '+54 294 440-5016', emoji: '✈️' },
];

export default function GrupoPage() {
    return (
        <main className="pb-safe">
            <div className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    👥 Nosso Grupo
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    5 aventureiros • Buenos Aires, Uruguai & Bariloche
                </p>
            </div>

            <div className="px-4 space-y-5">
                {/* Participants */}
                <div className="space-y-2">
                    {participants.map((p, i) => (
                        <motion.div key={p.id}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="card p-4 flex items-center gap-4 overflow-hidden relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: p.color }} />
                            <ParticipantAvatar participant={p} size={56} className="rounded-2xl shrink-0" />
                            <div className="flex-1 pl-1">
                                <h3 className="font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif', color: p.color }}>
                                    {p.name}
                                </h3>
                                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    <Plane size={10} />
                                    <span>Chegada: {p.arrival}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                    <Calendar size={10} />
                                    <span>Volta: {p.departure}</span>
                                </div>
                                {p.phone && (
                                    <a href={`tel:${p.phone}`}
                                        className="flex items-center gap-1 text-xs font-semibold mt-0.5"
                                        style={{ color: p.color }}>
                                        <Phone size={10} /> {p.phone}
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Emergency contacts */}
                <div>
                    <h2 className="text-sm font-bold mb-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        🆘 Emergências
                    </h2>
                    <div className="card overflow-hidden">
                        {emergencyContacts.map((c, i) => (
                            <div key={c.label}
                                className="flex items-center justify-between px-4 py-3"
                                style={{ borderBottom: i < emergencyContacts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                <div className="flex items-center gap-3">
                                    <span className="text-base">{c.emoji}</span>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.label}</span>
                                </div>
                                <a href={`tel:${c.value}`} className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>
                                    {c.value}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div>
                    <h2 className="text-sm font-bold mb-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        💡 Dicas da viagem
                    </h2>
                    <div className="space-y-2">
                        {tips.map((tip, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.035 }}
                                className="flex items-start gap-3 p-3.5 rounded-2xl"
                                style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                                <span className="text-lg shrink-0 mt-0.5">{tip.icon}</span>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tip.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
