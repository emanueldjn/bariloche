'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/data/types';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const categoryEmoji: Record<string, string> = {
  hotel: '🏨',
  restaurante: '🍽️',
  atracao: '🏛️',
  compras: '🛍️',
  bar: '🍺',
  transporte: '✈️',
};

export interface MapViewProps {
  places: Place[];
}

function FitToPlaces({ places }: MapViewProps) {
  const map = useMap();

  useEffect(() => {
    const validPlaces = places.filter((place) => place.coordinates);

    if (validPlaces.length === 0) {
      return;
    }

    if (validPlaces.length === 1) {
      map.setView(validPlaces[0].coordinates, 12);
      return;
    }

    map.fitBounds(validPlaces.map((place) => place.coordinates), {
      padding: [24, 24],
    });
  }, [map, places]);

  return null;
}

export default function MapView({ places }: MapViewProps) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ height: '65vh', border: '1px solid var(--border)' }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <FitToPlaces places={places} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
        {places.map((place) => (
          <Marker key={place.id} position={place.coordinates}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>
                  {categoryEmoji[place.category]} {place.name}
                </p>
                <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{place.city}</p>
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
