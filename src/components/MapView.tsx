'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/data/types';

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const categoryEmoji: Record<string, string> = {
    hotel: '🏨',
    restaurante: '🍽️',
    atracao: '🏔️',
    compras: '🛍️',
    bar: '🍺',
    transporte: '✈️',
};

export interface MapViewProps {
    places: Place[];
}

export default function MapView({ places }: MapViewProps) {
    // Center on Bariloche
    const center: [number, number] = [-41.1333, -71.3069];

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{ height: '65vh', border: '1px solid var(--border)' }}
        >
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />
                {places
                    .filter((p) => p.coordinates)
                    .map((place) => (
                        <Marker key={place.id} position={place.coordinates}>
                            <Popup>
                                <div style={{ minWidth: 160 }}>
                                    <p style={{ fontWeight: 700, marginBottom: 4 }}>
                                        {categoryEmoji[place.category]} {place.name}
                                    </p>
                                    <p style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>{place.description}</p>
                                    <a
                                        href={place.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}
                                    >
                                        Ver no Google Maps →
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
}
