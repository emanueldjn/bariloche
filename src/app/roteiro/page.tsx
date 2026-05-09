'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Clock, Lightbulb, MapPin, Plus, Trash2, X } from 'lucide-react';
import SyncStatus from '@/components/SyncStatus';
import { itinerary as defaultItinerary } from '@/data/itinerary';
import { cityColorMap, tripCityGroups, tripMeta } from '@/data/trip';
import { Activity } from '@/data/types';
import { useSharedData } from '@/hooks/useSharedData';

const categoryConfig: Record<string, { label: string; emoji: string; cls: string }> = {
  transporte: { label: 'Transporte', emoji: '✈️', cls: 'cat-transporte' },
  hospedagem: { label: 'Hospedagem', emoji: '🏨', cls: 'cat-hospedagem' },
  passeio: { label: 'Passeio', emoji: '🗺️', cls: 'cat-passeio' },
  refeicao: { label: 'Refeicao', emoji: '🍽️', cls: 'cat-refeicao' },
  compras: { label: 'Compras', emoji: '🛍️', cls: 'cat-compras' },
  lazer: { label: 'Lazer', emoji: '🎟️', cls: 'cat-lazer' },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getGroupMeta(city?: string) {
  if (!city) {
    return undefined;
  }

  return tripCityGroups.find((group) => city.includes(group.match));
}

function ActivityCard({ activity, onDelete }: { activity: Activity; onDelete?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = categoryConfig[activity.category] || categoryConfig.lazer;

  return (
    <motion.div layout className="card overflow-hidden" onClick={() => setExpanded(!expanded)}>
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: '#f0f4ff', border: '1px solid #e0e7ff' }}>
            {cfg.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Clock size={10} /> {activity.time}
              </span>
              <span className={`pill ${cfg.cls}`}>{cfg.label}</span>
            </div>
            <p className="font-bold text-sm leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {activity.title}
            </p>
            {activity.location && (
              <p className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={10} /> {activity.location}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onDelete && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-lg"
                style={{ background: '#fef2f2' }}
              >
                <Trash2 size={13} style={{ color: 'var(--accent-red)' }} />
              </button>
            )}
            {expanded ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-4 pb-4 space-y-2.5" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-sm pt-3" style={{ color: 'var(--text-secondary)' }}>
                {activity.description}
              </p>
              {activity.tips && (
                <div className="flex items-start gap-2 rounded-xl p-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <Lightbulb size={13} style={{ color: '#d97706', marginTop: 1 }} />
                  <p className="text-xs" style={{ color: '#92400e' }}>
                    {activity.tips}
                  </p>
                </div>
              )}
              {activity.coordinates && (
                <a
                  href={`https://maps.google.com/?q=${activity.coordinates[0]},${activity.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb' }}
                >
                  <MapPin size={11} /> Ver no Maps
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    time: '10:00',
    category: 'passeio',
    location: '',
    description: '',
    tips: '',
  });
  const { data, syncMessage, syncState, update } = useSharedData();
  const saving = syncState === 'connecting' || syncState === 'syncing';

  const day = defaultItinerary[activeDay];
  const cityColor = day.city ? cityColorMap[day.city] || '#3b82f6' : '#3b82f6';

  const baseActivities = day.activities.filter((activity) => !(data.deletedActivities[day.date] || []).includes(activity.id));
  const extras = data.customActivities[day.date] || [];
  const allActivities = [...baseActivities, ...extras].sort((a, b) => a.time.localeCompare(b.time));

  const deleteBase = async (id: string) => {
    const prev = data.deletedActivities[day.date] || [];
    await update({ deletedActivities: { ...data.deletedActivities, [day.date]: [...prev, id] } });
  };

  const deleteCustom = async (id: string) => {
    const prev = data.customActivities[day.date] || [];
    await update({ customActivities: { ...data.customActivities, [day.date]: prev.filter((activity) => activity.id !== id) } });
  };

  const createCustomActivityId = () => {
    const base = slugify(`${day.date}-${newActivity.time}-${newActivity.title}`) || 'atividade';
    const existingCount = (data.customActivities[day.date] || []).filter((activity) => activity.id.startsWith(`custom-${base}`)).length + 1;

    return `custom-${base}-${existingCount}`;
  };

  const addActivity = async () => {
    if (!newActivity.title.trim()) {
      return;
    }

    const activity: Activity = {
      id: createCustomActivityId(),
      time: newActivity.time,
      title: newActivity.title,
      description: newActivity.description || '',
      category: newActivity.category as Activity['category'],
      participants: ['emanuel', 'esteffany', 'fernanda', 'juan', 'netinha'],
    };

    if (newActivity.location.trim()) {
      activity.location = newActivity.location;
    }

    if (newActivity.tips.trim()) {
      activity.tips = newActivity.tips;
    }

    const prev = data.customActivities[day.date] || [];
    const saved = await update({ customActivities: { ...data.customActivities, [day.date]: [...prev, activity] } });

    if (saved) {
      setNewActivity({
        title: '',
        time: '10:00',
        category: 'passeio',
        location: '',
        description: '',
        tips: '',
      });
      setShowAddForm(false);
    }
  };

  const daysByCityGroup: { city: string; days: Array<(typeof defaultItinerary)[number] & { _idx: number }> }[] = [];

  defaultItinerary.forEach((itineraryDay, index) => {
    const city = itineraryDay.city || 'Outros';
    const last = daysByCityGroup[daysByCityGroup.length - 1];

    if (!last || last.city !== city) {
      daysByCityGroup.push({ city, days: [{ ...itineraryDay, _idx: index }] });
      return;
    }

    last.days.push({ ...itineraryDay, _idx: index });
  });

  return (
    <main className="pb-safe">
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              📅 Roteiro
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {tripMeta.dateRangeLabel} - {tripCityGroups.filter((group) => defaultItinerary.some((dayItem) => dayItem.city?.includes(group.match))).length} destinos - {defaultItinerary.length} dias
            </p>
          </div>
          <SyncStatus state={syncState} message={syncMessage} compact />
        </div>
      </div>

      <div className="px-4 pb-3">
        {daysByCityGroup.map((group) => (
          <div key={group.city} className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: cityColorMap[group.city] || '#6b7280' }}>
              {group.city}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {group.days.map((groupDay) => {
                const idx = groupDay._idx;
                const isActive = activeDay === idx;
                const col = cityColorMap[groupDay.city || ''] || '#3b82f6';
                const groupMeta = getGroupMeta(groupDay.city);

                return (
                  <motion.button
                    key={groupDay.date}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveDay(idx)}
                    className="shrink-0 flex flex-col items-center px-3.5 py-2 rounded-2xl transition-all"
                    style={
                      isActive
                        ? { background: col, color: '#fff', boxShadow: `0 4px 16px ${col}44` }
                        : { background: '#f3f4f6', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                    }
                  >
                    <span className="text-sm leading-none">{groupDay.weather?.icon || groupMeta?.emoji || '📍'}</span>
                    <span className="text-xs font-bold mt-0.5">{groupDay.shortDate}</span>
                    <span className="text-[9px] opacity-80">{groupDay.weekday.slice(0, 3)}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={day.date}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.2 }}
          className="px-4 space-y-3"
        >
          <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: `${cityColor}10`, border: `1px solid ${cityColor}25` }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: cityColor }}>
                {day.dayLabel} - {day.weekday} - {day.shortDate}
              </p>
              <p className="text-sm font-semibold mt-0.5">{day.city}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {allActivities.length} atividade{allActivities.length !== 1 ? 's' : ''}
              </p>
            </div>
            {day.weather && (
              <div className="text-right">
                <span className="text-3xl">{day.weather.icon}</span>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {day.weather.min}° - {day.weather.max}°C
                </p>
              </div>
            )}
          </div>

          {allActivities.map((activity, index) => {
            const isCustom = activity.id.startsWith('custom-');

            return (
              <motion.div key={activity.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <ActivityCard activity={activity} onDelete={isCustom ? () => deleteCustom(activity.id) : () => deleteBase(activity.id)} />
              </motion.div>
            );
          })}

          {showAddForm ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-4 space-y-3">
              <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                ➕ Nova atividade - <span style={{ color: cityColor }}>{day.shortDate}</span>
              </p>
              {[
                { label: 'Titulo *', key: 'title', placeholder: 'Ex: Visita a uma loja ou cafe' },
                { label: 'Horario', key: 'time', placeholder: '10:00' },
                { label: 'Local', key: 'location', placeholder: 'Ex: bairro, rua ou atracao' },
                { label: 'Descricao', key: 'description', placeholder: 'Detalhes...' },
                { label: 'Dica', key: 'tips', placeholder: 'Informacao util para o grupo...' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={(newActivity as Record<string, string>)[field.key]}
                    onChange={(event) => setNewActivity({ ...newActivity, [field.key]: event.target.value })}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                    style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: 'var(--text-primary)' }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                  Categoria
                </label>
                <select
                  value={newActivity.category}
                  onChange={(event) => setNewActivity({ ...newActivity, category: event.target.value })}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                  style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: 'var(--text-primary)' }}
                >
                  {Object.entries(categoryConfig).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.emoji} {value.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addActivity}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    opacity: saving ? 0.8 : 1,
                  }}
                >
                  <Check size={14} /> {saving ? 'Salvando...' : 'Salvar para o grupo'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: '#f3f4f6', color: 'var(--text-secondary)' }}
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: '#eff6ff', border: '1.5px dashed #bfdbfe', color: '#2563eb' }}
            >
              <Plus size={16} /> Adicionar atividade - todos vao ver
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
