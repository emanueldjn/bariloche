'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Navigation, MapPin, GripVertical, ExternalLink } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Stop {
    id: string;
    label: string;
    address: string;
}

interface SavedRoute {
    id: string;
    name: string;
    stops: Stop[];
}

const PRESET_STOPS = {
    'Buenos Aires': [
        { label: '🏨 Hospedagem BA', address: '' },
        { label: '🦁 La Boca / Caminito', address: 'Caminito, La Boca, Buenos Aires' },
        { label: '🏛️ Plaza de Mayo', address: 'Plaza de Mayo, Buenos Aires' },
        { label: '🌿 Palermo Soho', address: 'Palermo Soho, Buenos Aires' },
        { label: '⚓ Puerto Madero', address: 'Puerto Madero, Buenos Aires' },
        { label: '🪦 Recoleta', address: 'Cemitério da Recoleta, Buenos Aires' },
        { label: '⛴️ Terminal Buquebus', address: 'Terminal Buquebus, Av. Antartida Argentina, Buenos Aires' },
        { label: '✈️ Aeroparque (AEP)', address: 'Aeroparque Jorge Newbery, Buenos Aires' },
    ],
    'Bariloche': [
        { label: '🏨 Hospedagem Bariloche', address: '' },
        { label: '🎿 Cerro Catedral', address: 'Cerro Catedral, Av. Pioneros km 8, Bariloche' },
        { label: '🏔️ Cerro Campanario', address: 'Cerro Campanario, Bariloche' },
        { label: '🏰 Hotel Llao Llao', address: 'Hotel Llao Llao, Av. Bustillo km 25, Bariloche' },
        { label: '🏞️ Parque Nacional', address: 'Parque Nacional Nahuel Huapi, Bariloche' },
        { label: '🍫 Rua Mitre', address: 'Calle Mitre, San Carlos de Bariloche' },
        { label: '🍺 Cervecería Blest', address: 'Cerveceria Blest, Av. Bustillo km 11.6, Bariloche' },
        { label: '✈️ Aeroporto Bariloche', address: 'Aeroporto BRC, RP 80, Bariloche' },
    ],
    'Uruguai': [
        { label: '⛴️ Porto de Colônia', address: 'Porto de Colonia del Sacramento, Uruguay' },
        { label: '🏛️ Bairro Histórico', address: 'Barrio Histórico, Colonia del Sacramento, Uruguay' },
        { label: '🗼 Farol de Colônia', address: 'Faro de Colonia del Sacramento, Uruguay' },
        { label: '🌊 Vista Rio da Prata', address: 'Rambla Costanera, Colonia del Sacramento, Uruguay' },
    ],
};

export default function RotaPage() {
    const [stops, setStops] = useLocalStorage<Stop[]>('car-route-stops', []);
    const [savedRoutes, setSavedRoutes] = useLocalStorage<SavedRoute[]>('car-saved-routes', []);
    const [routeName, setRouteName] = useState('');
    const [selectedCity, setSelectedCity] = useState<keyof typeof PRESET_STOPS>('Bariloche');
    const [newStopLabel, setNewStopLabel] = useState('');
    const [newStopAddress, setNewStopAddress] = useState('');
    const [showCustomForm, setShowCustomForm] = useState(false);

    const addPreset = (preset: { label: string; address: string }) => {
        const stop: Stop = { id: `s-${Date.now()}`, label: preset.label, address: preset.address };
        setStops([...stops, stop]);
    };

    const removeStop = (id: string) => setStops(stops.filter(s => s.id !== id));

    const addCustom = () => {
        if (!newStopLabel.trim()) return;
        setStops([...stops, { id: `s-${Date.now()}`, label: newStopLabel, address: newStopAddress }]);
        setNewStopLabel(''); setNewStopAddress(''); setShowCustomForm(false);
    };

    const openInMaps = () => {
        const validStops = stops.filter(s => s.address.trim());
        if (validStops.length === 0) return;
        if (validStops.length === 1) {
            window.open(`https://maps.google.com/?q=${encodeURIComponent(validStops[0].address)}`, '_blank');
            return;
        }
        const origin = encodeURIComponent(validStops[0].address);
        const destination = encodeURIComponent(validStops[validStops.length - 1].address);
        const waypoints = validStops.slice(1, -1).map(s => encodeURIComponent(s.address)).join('|');
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`;
        window.open(url, '_blank');
    };

    const saveRoute = () => {
        if (!routeName.trim() || stops.length === 0) return;
        const route: SavedRoute = { id: `r-${Date.now()}`, name: routeName, stops: [...stops] };
        setSavedRoutes([...savedRoutes, route]);
        setRouteName('');
    };

    const loadRoute = (route: SavedRoute) => setStops([...route.stops]);
    const deleteRoute = (id: string) => setSavedRoutes(savedRoutes.filter(r => r.id !== id));

    return (
        <main className="pb-safe">
            <div className="px-4 pt-6 pb-3">
                <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    🚗 Rota de Carro
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Monte sua rota e abra direto no Google Maps
                </p>
            </div>

            <div className="px-4 space-y-5">
                {/* Current route */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            📍 Paradas desta rota
                        </h2>
                        {stops.length > 0 && (
                            <button onClick={() => setStops([])}
                                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                                style={{ background: '#fef2f2', color: 'var(--accent-red)' }}>
                                Limpar tudo
                            </button>
                        )}
                    </div>

                    {stops.length === 0 ? (
                        <div className="card p-6 text-center">
                            <p className="text-3xl mb-2">🗺️</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                                Adicione paradas abaixo para montar sua rota
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {stops.map((stop, i) => (
                                <motion.div key={stop.id} layout
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    className="card p-3.5 flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                        style={{ background: i === 0 ? '#059669' : i === stops.length - 1 ? '#dc2626' : '#3b82f6' }}>
                                        {i === 0 ? 'A' : i === stops.length - 1 ? 'B' : i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm">{stop.label}</p>
                                        {stop.address && (
                                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{stop.address}</p>
                                        )}
                                    </div>
                                    {stop.address && (
                                        <a href={`https://maps.google.com/?q=${encodeURIComponent(stop.address)}`}
                                            target="_blank" rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1.5 rounded-lg"
                                            style={{ background: '#eff6ff' }}>
                                            <MapPin size={13} style={{ color: '#2563eb' }} />
                                        </a>
                                    )}
                                    <button onClick={() => removeStop(stop.id)}
                                        className="p-1.5 rounded-lg"
                                        style={{ background: '#fef2f2' }}>
                                        <Trash2 size={13} style={{ color: '#dc2626' }} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Open in Maps button */}
                {stops.filter(s => s.address).length >= 1 && (
                    <motion.button whileTap={{ scale: 0.97 }} onClick={openInMaps}
                        className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #059669, #0891b2)', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}>
                        <Navigation size={18} /> Abrir rota no Google Maps
                    </motion.button>
                )}

                {/* Save route */}
                {stops.length >= 2 && (
                    <div className="flex gap-2">
                        <input type="text" placeholder="Nome desta rota (ex: Circuito Chico)"
                            value={routeName} onChange={(e) => setRouteName(e.target.value)}
                            className="flex-1 rounded-xl px-3.5 py-2.5 text-sm"
                            style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: 'var(--text-primary)' }}
                        />
                        <button onClick={saveRoute}
                            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                            style={{ background: 'var(--accent-primary)' }}>
                            Salvar
                        </button>
                    </div>
                )}

                {/* Saved routes */}
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
                                    <button onClick={() => loadRoute(route)}
                                        className="text-xs font-bold px-3 py-1.5 rounded-lg"
                                        style={{ background: '#eff6ff', color: '#2563eb' }}>
                                        Carregar
                                    </button>
                                    <button onClick={() => deleteRoute(route.id)}
                                        className="p-1.5 rounded-lg"
                                        style={{ background: '#fef2f2' }}>
                                        <Trash2 size={13} style={{ color: '#dc2626' }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Preset stops by city */}
                <div>
                    <h2 className="text-sm font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ⭐ Lugares pré-cadastrados
                    </h2>
                    <div className="flex gap-2 mb-3">
                        {(Object.keys(PRESET_STOPS) as (keyof typeof PRESET_STOPS)[]).map((city) => (
                            <button key={city}
                                onClick={() => setSelectedCity(city)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                style={selectedCity === city
                                    ? { background: 'var(--accent-primary)', color: '#fff' }
                                    : { background: '#f3f4f6', color: 'var(--text-secondary)' }}>
                                {city}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-2">
                        {PRESET_STOPS[selectedCity].map((preset, i) => {
                            const alreadyAdded = stops.some(s => s.label === preset.label);
                            return (
                                <motion.button key={i} whileTap={{ scale: 0.97 }}
                                    onClick={() => !alreadyAdded && addPreset(preset)}
                                    className="w-full card p-3 flex items-center justify-between"
                                    style={alreadyAdded ? { opacity: 0.5 } : {}}>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">{preset.label}</p>
                                        {preset.address && (
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{preset.address}</p>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold px-3 py-1 rounded-lg"
                                        style={{ background: alreadyAdded ? '#f3f4f6' : '#eff6ff', color: alreadyAdded ? 'var(--text-muted)' : '#2563eb' }}>
                                        {alreadyAdded ? 'Adicionada' : '+ Adicionar'}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Custom stop */}
                {showCustomForm ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="card p-4 space-y-3">
                        <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>✏️ Parada personalizada</p>
                        <input type="text" placeholder="Nome da parada (ex: Restaurante Kandahar)"
                            value={newStopLabel} onChange={(e) => setNewStopLabel(e.target.value)}
                            className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                            style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: 'var(--text-primary)' }} />
                        <input type="text" placeholder="Endereço completo (para o Maps)"
                            value={newStopAddress} onChange={(e) => setNewStopAddress(e.target.value)}
                            className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                            style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: 'var(--text-primary)' }} />
                        <div className="flex gap-2">
                            <button onClick={addCustom}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                                style={{ background: 'var(--accent-primary)' }}>
                                Adicionar
                            </button>
                            <button onClick={() => setShowCustomForm(false)}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold"
                                style={{ background: '#f3f4f6', color: 'var(--text-secondary)' }}>
                                Cancelar
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <button onClick={() => setShowCustomForm(true)}
                        className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
                        style={{ background: '#f9fafb', border: '1.5px dashed #d1d5db', color: 'var(--text-secondary)' }}>
                        <Plus size={16} /> Parada personalizada
                    </button>
                )}
            </div>
        </main>
    );
}
