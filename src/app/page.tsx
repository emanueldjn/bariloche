'use client';

import { motion } from 'framer-motion';
import { Edit3, Heart, MapPin, Plane } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import ParticipantAvatar from '@/components/ParticipantAvatar';
import { itinerary } from '@/data/itinerary';
import { participants } from '@/data/participants';
import { accommodationFields, defaultAccommodation, tripCityGroups, tripMeta } from '@/data/trip';
import { AccommodationInfo } from '@/data/types';
import { useSharedData } from '@/hooks/useSharedData';

const stayFields = accommodationFields.filter((field) => !['phone', 'notes'].includes(field.key));

export default function HomePage() {
  const { data, update } = useSharedData();
  const accom = data.accommodation || defaultAccommodation;
  const [editingAccom, setEditingAccom] = useState(false);
  const [draft, setDraft] = useState<AccommodationInfo>(accom);

  const summaryGroups = tripCityGroups
    .map((group) => ({
      ...group,
      days: itinerary.filter((day) => day.city?.includes(group.match)),
    }))
    .filter((group) => group.days.length > 0);

  const openEdit = () => {
    setDraft(accom);
    setEditingAccom(true);
  };

  const saveAccom = async () => {
    await update({ accommodation: draft });
    setEditingAccom(false);
  };

  return (
    <main className="pb-safe px-4 pt-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        className="space-y-5"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          className="relative overflow-hidden rounded-3xl p-6 text-white"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #059669 100%)' }}
        >
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20" style={{ background: '#fff' }} />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10" style={{ background: '#fff' }} />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">{tripMeta.dateRangeLabel}</p>
            <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {tripMeta.heroLines.slice(0, 3).join(' · ')}
            </h1>
            <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {tripMeta.heroLines.slice(3).join(' · ')}
            </h1>
            <p className="text-sm opacity-80 mt-2">{tripMeta.heroSubtitle}</p>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="card p-4">
          <p className="text-center text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            {tripMeta.countdownLabel}
          </p>
          <CountdownTimer
            targetDate={tripMeta.countdownTarget}
            endDate={tripMeta.countdownEnd}
            activeTitle={tripMeta.activeTitle}
            activeSubtitle={tripMeta.activeSubtitle}
            completedTitle={tripMeta.completedTitle}
            completedSubtitle={tripMeta.completedSubtitle}
            activeEmoji="🌍"
          />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold flex items-center gap-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <MapPin size={15} style={{ color: 'var(--accent-primary)' }} />
              Onde vamos ficar
            </h2>
            <button
              onClick={openEdit}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-primary)' }}
            >
              <Edit3 size={12} /> Editar
            </button>
          </div>
          <div className="card p-4 space-y-3">
            {stayFields.map((item) => (
              <div key={item.key}>
                <span className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                  {item.label}
                </span>
                {accom[item.key] ? (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(accom[item.key])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    <MapPin size={13} /> {accom[item.key]}
                  </a>
                ) : (
                  <button onClick={openEdit} className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {item.placeholder}
                  </button>
                )}
              </div>
            ))}
            {accom.phone && (
              <div>
                <span className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                  Contato
                </span>
                <a href={`tel:${accom.phone}`} className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                  {accom.phone}
                </a>
              </div>
            )}
            {accom.notes && (
              <div>
                <span className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                  Notas
                </span>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {accom.notes}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
          <h2 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Heart size={15} style={{ color: 'var(--accent-pink)' }} /> Nossa galera
          </h2>
          <div className="flex gap-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex-1 flex flex-col items-center gap-2 py-3 px-1 rounded-2xl card">
                <ParticipantAvatar participant={participant} size={44} />
                <span className="text-[10px] font-bold text-center" style={{ color: participant.color }}>
                  {participant.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold flex items-center gap-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <Plane size={15} style={{ color: 'var(--accent-primary)' }} /> Roteiro resumido
            </h2>
            <Link href="/roteiro">
              <span className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                Ver tudo →
              </span>
            </Link>
          </div>
          <div className="space-y-2">
            {summaryGroups.map((group) => (
              <Link href="/roteiro" key={group.label}>
                <motion.div whileTap={{ scale: 0.98 }} className="card p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${group.color}12` }}>
                    {group.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: group.color }}>
                      {group.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {group.days.length} dia{group.days.length > 1 ? 's' : ''} · {group.days[0]?.shortDate}-{group.days[group.days.length - 1]?.shortDate}
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {group.days.reduce((total, day) => total + day.activities.length, 0)} atividades
                  </p>
                  <span style={{ color: 'var(--text-muted)' }}>›</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-3 gap-3 pb-2">
          {[
            { href: '/checklist', icon: '✅', label: 'Checklist', color: 'var(--accent-green)' },
            { href: '/rota', icon: '🗺️', label: 'Rotas', color: 'var(--accent-orange)' },
            { href: '/lugares', icon: '📍', label: 'Lugares', color: 'var(--accent-cyan)' },
          ].map((item) => (
            <Link href={item.href} key={item.href}>
              <motion.div whileTap={{ scale: 0.92 }} className="card p-4 flex flex-col items-center gap-2 text-center">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>

      {editingAccom && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="modal-overlay" onClick={() => setEditingAccom(false)}>
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Hospedagem
              </h3>
              <button
                onClick={() => setEditingAccom(false)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ background: '#f3f4f6', color: 'var(--text-secondary)' }}
              >
                Fechar
              </button>
            </div>
            <div className="space-y-4">
              {accommodationFields.map((field) => (
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
                      background: '#f9fafb',
                      border: '1.5px solid #e5e7eb',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              ))}
              <button
                onClick={saveAccom}
                className="w-full py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
              >
                Salvar hospedagem · todos vao ver
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
