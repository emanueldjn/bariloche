'use client';

import { motion } from 'framer-motion';
import { Calendar, Phone, Plane } from 'lucide-react';
import ParticipantAvatar from '@/components/ParticipantAvatar';
import { participants } from '@/data/participants';
import { emergencyContacts, groupTips, tripMeta } from '@/data/trip';

export default function GrupoPage() {
  return (
    <main className="pb-safe">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
          👥 Nosso Grupo
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {tripMeta.groupSubtitle}
        </p>
      </div>

      <div className="px-4 space-y-5">
        <div className="space-y-2">
          {participants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="card p-4 flex items-center gap-4 overflow-hidden relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: participant.color }} />
              <ParticipantAvatar participant={participant} size={56} className="rounded-2xl shrink-0" />
              <div className="flex-1 pl-1">
                <h3 className="font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif', color: participant.color }}>
                  {participant.name}
                </h3>
                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  <Plane size={10} />
                  <span>Chegada: {participant.arrival}</span>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={10} />
                  <span>Volta: {participant.departure}</span>
                </div>
                {participant.phone && (
                  <a href={`tel:${participant.phone}`} className="flex items-center gap-1 text-xs font-semibold mt-0.5" style={{ color: participant.color }}>
                    <Phone size={10} /> {participant.phone}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-bold mb-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
            🆘 Emergencias
          </h2>
          <div className="card overflow-hidden">
            {emergencyContacts.map((contact, index) => (
              <div
                key={contact.label}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: index < emergencyContacts.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{contact.emoji}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {contact.label}
                  </span>
                </div>
                <a href={`tel:${contact.value}`} className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {contact.value}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold mb-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
            💡 Dicas da viagem
          </h2>
          <div className="space-y-2">
            {groupTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.035 }}
                className="flex items-start gap-3 p-3.5 rounded-2xl"
                style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
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
