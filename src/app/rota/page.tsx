'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Plus, Trash2 } from 'lucide-react';
import SyncStatus from '@/components/SyncStatus';
import { routePresets } from '@/data/trip';
import { RouteStop, SavedRoute } from '@/data/types';
import { useSharedData } from '@/hooks/useSharedData';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function RotaPage() {
  const { data, syncMessage, syncState, update } = useSharedData();
  const stops = data.routeDraft;
  const savedRoutes = data.savedRoutes;
  const presetCities = Object.keys(routePresets) as Array<keyof typeof routePresets>;
  const [routeName, setRouteName] = useState('');
  const [selectedCity, setSelectedCity] = useState<keyof typeof routePresets>('Tokyo');
  const [newStopLabel, setNewStopLabel] = useState('');
  const [newStopAddress, setNewStopAddress] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const saving = syncState === 'connecting' || syncState === 'syncing';

  const setStops = async (nextStops: RouteStop[]) => {
    await update({ routeDraft: nextStops });
  };

  const createStopId = (label: string, address: string) => {
    const base = slugify(`${label}-${address || 'sem-endereco'}`) || 'parada';
    const existingCount = stops.filter((stop) => stop.id.startsWith(`s-${base}`)).length + 1;

    return `s-${base}-${existingCount}`;
  };

  const createRouteId = (name: string) => {
    const base = slugify(name) || 'rota';
    const existingCount = savedRoutes.filter((route) => route.id.startsWith(`r-${base}`)).length + 1;

    return `r-${base}-${existingCount}`;
  };

  const addPreset = async (preset: { label: string; address: string }) => {
    const stop: RouteStop = {
      id: createStopId(preset.label, preset.address),
      label: preset.label,
      address: preset.address,
    };
    await setStops([...stops, stop]);
  };

  const removeStop = async (id: string) => {
    await setStops(stops.filter((stop) => stop.id !== id));
  };

  const addCustom = async () => {
    if (!newStopLabel.trim()) {
      return;
    }

    const saved = await update({
      routeDraft: [
        ...stops,
        {
          id: createStopId(newStopLabel, newStopAddress),
          label: newStopLabel,
          address: newStopAddress,
        },
      ],
    });

    if (saved) {
      setNewStopLabel('');
      setNewStopAddress('');
      setShowCustomForm(false);
    }
  };

  const openInMaps = () => {
    const validStops = stops.filter((stop) => stop.address.trim());

    if (validStops.length === 0) {
      return;
    }

    if (validStops.length === 1) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(validStops[0].address)}`, '_blank');
      return;
    }

    const origin = encodeURIComponent(validStops[0].address);
    const destination = encodeURIComponent(validStops[validStops.length - 1].address);
    const waypoints = validStops.slice(1, -1).map((stop) => encodeURIComponent(stop.address)).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`;

    window.open(url, '_blank');
  };

  const saveRoute = async () => {
    if (!routeName.trim() || stops.length === 0) {
      return;
    }

    const route: SavedRoute = {
      id: createRouteId(routeName),
      name: routeName,
      stops: [...stops],
    };
    const saved = await update({ savedRoutes: [...savedRoutes, route] });
    if (saved) {
      setRouteName('');
    }
  };

  const loadRoute = async (route: SavedRoute) => {
    await setStops([...route.stops]);
  };

  const deleteRoute = async (id: string) => {
    await update({ savedRoutes: savedRoutes.filter((route) => route.id !== id) });
  };

  return (
    <main className="pb-safe">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
          🗺️ Rotas
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Monte um trajeto e compartilhe o mesmo rascunho com o grupo
        </p>
      </div>

      <div className="px-4 pb-4">
        <SyncStatus state={syncState} message={syncMessage} />
      </div>

      <div className="px-4 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              📍 Paradas da rota atual
            </h2>
            {stops.length > 0 && (
              <button onClick={() => void setStops([])} className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: '#fef2f2', color: 'var(--accent-red)' }}>
                Limpar tudo
              </button>
            )}
          </div>

          {stops.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-3xl mb-2">🗺️</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Adicione paradas abaixo para montar a rota compartilhada
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {stops.map((stop, index) => (
                <motion.div
                  key={stop.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-3.5 flex items-center gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: index === 0 ? '#059669' : index === stops.length - 1 ? '#dc2626' : '#3b82f6' }}
                  >
                    {index === 0 ? 'A' : index === stops.length - 1 ? 'B' : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{stop.label}</p>
                    {stop.address && (
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {stop.address}
                      </p>
                    )}
                  </div>
                  {stop.address && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(stop.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg"
                      style={{ background: '#eff6ff' }}
                    >
                      <MapPin size={13} style={{ color: '#2563eb' }} />
                    </a>
                  )}
                  <button onClick={() => void removeStop(stop.id)} className="p-1.5 rounded-lg" style={{ background: '#fef2f2' }}>
                    <Trash2 size={13} style={{ color: '#dc2626' }} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {stops.filter((stop) => stop.address).length >= 1 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={openInMaps}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #059669, #0891b2)', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}
          >
            <Navigation size={18} /> Abrir rota no Google Maps
          </motion.button>
        )}

        {stops.length >= 2 && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome desta rota (ex: Tokyo dia 1)"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm"
              style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: 'var(--text-primary)' }}
            />
            <button
              onClick={() => void saveRoute()}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'var(--accent-primary)', opacity: saving ? 0.8 : 1 }}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        )}

        {savedRoutes.length > 0 && (
          <div>
            <h2 className="text-sm font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              💾 Rotas salvas
            </h2>
            <div className="space-y-2">
              {savedRoutes.map((route) => (
                <div key={route.id} className="card p-3.5 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{route.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {route.stops.length} paradas
                    </p>
                  </div>
                  <button onClick={() => void loadRoute(route)} className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    Carregar
                  </button>
                  <button onClick={() => void deleteRoute(route.id)} className="p-1.5 rounded-lg" style={{ background: '#fef2f2' }}>
                    <Trash2 size={13} style={{ color: '#dc2626' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ⭐ Lugares pre-cadastrados
          </h2>
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {presetCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0"
                style={selectedCity === city ? { background: 'var(--accent-primary)', color: '#fff' } : { background: '#f3f4f6', color: 'var(--text-secondary)' }}
              >
                {city}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {routePresets[selectedCity].map((preset) => {
              const alreadyAdded = stops.some((stop) => stop.label === preset.label);

              return (
                <motion.button
                  key={preset.label}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (!alreadyAdded) {
                      void addPreset(preset);
                    }
                  }}
                  className="w-full card p-3 flex items-center justify-between"
                  style={alreadyAdded ? { opacity: 0.5 } : {}}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium">{preset.label}</p>
                    {preset.address && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {preset.address}
                      </p>
                    )}
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-lg"
                    style={{ background: alreadyAdded ? '#f3f4f6' : '#eff6ff', color: alreadyAdded ? 'var(--text-muted)' : '#2563eb' }}
                  >
                    {alreadyAdded ? 'Adicionada' : '+ Adicionar'}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {showCustomForm ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 space-y-3">
            <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
              ✏️ Parada personalizada
            </p>
            <input
              type="text"
              placeholder="Nome da parada"
              value={newStopLabel}
              onChange={(e) => setNewStopLabel(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm"
              style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: 'var(--text-primary)' }}
            />
            <input
              type="text"
              placeholder="Endereco completo para o Maps"
              value={newStopAddress}
              onChange={(e) => setNewStopAddress(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm"
              style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: 'var(--text-primary)' }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => void addCustom()}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: 'var(--accent-primary)', opacity: saving ? 0.8 : 1 }}
              >
                {saving ? 'Salvando...' : 'Adicionar'}
              </button>
              <button onClick={() => setShowCustomForm(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: '#f3f4f6', color: 'var(--text-secondary)' }}>
                Cancelar
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowCustomForm(true)}
            className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: '#f9fafb', border: '1.5px dashed #d1d5db', color: 'var(--text-secondary)' }}
          >
            <Plus size={16} /> Parada personalizada
          </button>
        )}
      </div>
    </main>
  );
}
