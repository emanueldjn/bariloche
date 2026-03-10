'use client';

import { motion } from 'framer-motion';
import { Plane, Mountain, Heart } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import { participants } from '@/data/participants';
import { itinerary } from '@/data/itinerary';
import Link from 'next/link';

const categoryIcons: Record<string, string> = {
  transporte: '✈️',
  hospedagem: '🏨',
  passeio: '🎿',
  refeicao: '🍽️',
  compras: '🛍️',
  lazer: '🍺',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function HomePage() {
  const tripStart = new Date('2025-08-27T00:00:00');
  const now = new Date();
  const diffDays = Math.ceil((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <main className="pb-safe px-4 pt-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center pt-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Mountain size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
              27–31 de Agosto, 2025
            </span>
            <Mountain size={18} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <h1 className="text-4xl font-extrabold gradient-text pb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Bariloche 🏔️
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            5 amigos. 5 dias. Uma aventura inesquecível.
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          variants={itemVariants}
          className="card p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 70%)',
            }}
          />
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            {diffDays > 0 ? '⏳ Conta regressiva' : '🎉 É agora!'}
          </p>
          <CountdownTimer targetDate="2025-08-27T00:00:00" />
        </motion.div>

        {/* Participants */}
        <motion.div variants={itemVariants}>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Heart size={16} style={{ color: 'var(--accent-pink)' }} />
            Nossa galera
          </h2>
          <div className="flex justify-between gap-2">
            {participants.map((p) => (
              <motion.div
                key={p.id}
                whileTap={{ scale: 0.92 }}
                className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl"
                style={{
                  background: `linear-gradient(145deg, ${p.color}15, ${p.color}08)`,
                  border: `1px solid ${p.color}25`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${p.color}20`, border: `2px solid ${p.color}40` }}
                >
                  {p.emoji}
                </div>
                <span className="text-[11px] font-semibold text-center leading-tight" style={{ color: p.color }}>
                  {p.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Days */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <Plane size={16} style={{ color: 'var(--accent-primary)' }} />
              Roteiro rápido
            </h2>
            <Link href="/roteiro">
              <span className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                Ver tudo →
              </span>
            </Link>
          </div>
          <div className="space-y-3">
            {itinerary.map((day) => (
              <Link href="/roteiro" key={day.date}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="card p-4 flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
                  >
                    <span className="text-lg leading-none">{day.weather?.icon}</span>
                    <span className="text-[10px] font-bold mt-0.5" style={{ color: 'var(--accent-primary)' }}>
                      {day.shortDate}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {day.dayLabel}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {day.weekday}
                      </span>
                      {day.weather && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {day.weather.min}°–{day.weather.max}°C
                        </span>
                      )}
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {day.activities.slice(0, 3).map((a) => `${categoryIcons[a.category]} ${a.title}`).join(' · ')}
                    </p>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>›</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 pb-2">
          {[
            { href: '/checklist', icon: '✅', label: 'Checklist', color: 'var(--accent-green)' },
            { href: '/lugares', icon: '🗺️', label: 'Lugares', color: 'var(--accent-cyan)' },
            { href: '/grupo', icon: '👥', label: 'Grupo', color: 'var(--accent-pink)' },
          ].map((item) => (
            <Link href={item.href} key={item.href}>
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="card p-4 flex flex-col items-center gap-2 text-center"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-semibold" style={{ color: item.color }}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>

      </motion.div>
    </main>
  );
}
