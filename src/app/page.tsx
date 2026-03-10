'use client';

import { motion } from 'framer-motion';
import { Plane, Mountain, Heart, MapPin, Edit3 } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import { participants } from '@/data/participants';
import { itinerary } from '@/data/itinerary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Link from 'next/link';
import { useState } from 'react';

const categoryIcons: Record<string, string> = {
  transporte: '✈️', hospedagem: '🏨', passeio: '🏔️',
  refeicao: '🍽️', compras: '🛍️', lazer: '🍺',
};

const cityGroups = [
  { label: 'Buenos Aires', emoji: '🇦🇷', color: '#3b82f6', days: itinerary.filter(d => d.city?.includes('Buenos Aires')) },
  { label: 'Uruguai', emoji: '🇺🇾', color: '#059669', days: itinerary.filter(d => d.city?.includes('Uruguai')) },
  { label: 'Bariloche', emoji: '🏔️', color: '#6366f1', days: itinerary.filter(d => d.city?.includes('Bariloche')) },
];

interface AccommodationInfo {
  ba: string;
  bariloche: string;
  phone: string;
  notes: string;
}

const defaultAccom: AccommodationInfo = { ba: '', bariloche: '', phone: '', notes: '' };

export default function HomePage() {
  const [accom, setAccom] = useLocalStorage<AccommodationInfo>('trip-accommodation', defaultAccom);
  const [editingAccom, setEditingAccom] = useState(false);
  const [draft, setDraft] = useState<AccommodationInfo>(defaultAccom);

  const openEdit = () => { setDraft(accom); setEditingAccom(true); };

  return (
    <main className="pb-safe px-4 pt-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        className="space-y-5"
      >
        {/* Hero Header */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          className="relative overflow-hidden rounded-3xl p-6 text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #0891b2 100%)' }}
        >
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20" style={{ background: '#fff' }} />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10" style={{ background: '#fff' }} />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">21 ago – 31 ago 2025</p>
            <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Buenos Aires <span className="opacity-70">+</span> Uruguai <span className="opacity-70">+</span>
            </h1>
            <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Bariloche 🏔️
            </h1>
            <p className="text-sm opacity-75 mt-2">5 amigos • 11 dias • 3 países!</p>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          className="card p-4"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-muted)' }}>
            ⏳ Contagem regressiva — começa 21/08
          </p>
          <CountdownTimer targetDate="2025-08-21T00:00:00" />
        </motion.div>

        {/* Accommodation - Editable */}
        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold flex items-center gap-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <MapPin size={15} style={{ color: 'var(--accent-primary)' }} />
              Onde vamos ficar
            </h2>
            <button onClick={openEdit}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-primary)' }}>
              <Edit3 size={12} /> Editar
            </button>
          </div>
          <div className="card p-4 space-y-3">
            {[
              { label: '🇦🇷 Buenos Aires', value: accom.ba, placeholder: 'Adicionar endereço ou nome do hotel...' },
              { label: '🏔️ Bariloche', value: accom.bariloche, placeholder: 'Adicionar endereço ou nome do hotel...' },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                {item.value ? (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(item.value)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    <MapPin size={13} /> {item.value}
                  </a>
                ) : (
                  <button onClick={openEdit}
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}>
                    {item.placeholder}
                  </button>
                )}
              </div>
            ))}
            {accom.phone && (
              <div>
                <span className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>📞 Contato hospedagem</span>
                <a href={`tel:${accom.phone}`} className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                  {accom.phone}
                </a>
              </div>
            )}
            {accom.notes && (
              <div>
                <span className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>📝 Notas</span>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{accom.notes}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Participants */}
        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
          <h2 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Heart size={15} style={{ color: 'var(--accent-pink)' }} /> Nossa galera
          </h2>
          <div className="flex gap-2">
            {participants.map((p) => (
              <div key={p.id} className="flex-1 flex flex-col items-center gap-2 py-3 px-1 rounded-2xl card">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${p.color}18`, border: `2px solid ${p.color}35` }}>
                  {p.emoji}
                </div>
                <span className="text-[10px] font-bold text-center" style={{ color: p.color }}>{p.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trip overview by city */}
        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold flex items-center gap-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <Plane size={15} style={{ color: 'var(--accent-primary)' }} /> Roteiro resumido
            </h2>
            <Link href="/roteiro">
              <span className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>Ver tudo →</span>
            </Link>
          </div>
          <div className="space-y-2">
            {cityGroups.map((group) => (
              <Link href="/roteiro" key={group.label}>
                <motion.div whileTap={{ scale: 0.98 }} className="card p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${group.color}12` }}>
                    {group.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: group.color }}>
                      {group.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {group.days.length} dia{group.days.length > 1 ? 's' : ''} •{' '}
                      {group.days[0]?.shortDate}–{group.days[group.days.length - 1]?.shortDate}
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {group.days.reduce((acc, d) => acc + d.activities.length, 0)} atividades
                  </p>
                  <span style={{ color: 'var(--text-muted)' }}>›</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          className="grid grid-cols-3 gap-3 pb-2">
          {[
            { href: '/checklist', icon: '✅', label: 'Checklist', color: 'var(--accent-green)' },
            { href: '/rota', icon: '🚗', label: 'Rota Car', color: 'var(--accent-orange)' },
            { href: '/lugares', icon: '🗺️', label: 'Lugares', color: 'var(--accent-cyan)' },
          ].map((item) => (
            <Link href={item.href} key={item.href}>
              <motion.div whileTap={{ scale: 0.92 }} className="card p-4 flex flex-col items-center gap-2 text-center">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>

      {/* Accommodation Edit Modal */}
      {editingAccom && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="modal-overlay" onClick={() => setEditingAccom(false)}>
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="modal-sheet"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>🏨 Hospedagem</h3>
              <button onClick={() => setEditingAccom(false)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ background: '#f3f4f6', color: 'var(--text-secondary)' }}>
                Fechar
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: '🇦🇷 Endereço em Buenos Aires', key: 'ba' as keyof AccommodationInfo, placeholder: 'ex: Hotel NH Buenos Aires, Av. Corrientes 1234' },
                { label: '🏔️ Endereço em Bariloche', key: 'bariloche' as keyof AccommodationInfo, placeholder: 'ex: Apart Hotel Bariloche, San Martín 456' },
                { label: '📞 Telefone da hospedagem', key: 'phone' as keyof AccommodationInfo, placeholder: '+54 11 1234-5678' },
                { label: '📝 Notas extras', key: 'notes' as keyof AccommodationInfo, placeholder: 'Check-in às 14h, check-out às 11h...' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={draft[field.key]}
                    onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                    style={{
                      background: '#f9fafb', border: '1.5px solid #e5e7eb',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => { setAccom(draft); setEditingAccom(false); }}
                className="w-full py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
              >
                Salvar hospedagem
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
