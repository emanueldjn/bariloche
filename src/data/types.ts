export interface Participant {
  id: string;
  name: string;
  emoji: string;
  color: string;
  arrival: string;
  departure: string;
  phone?: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'transporte' | 'hospedagem' | 'passeio' | 'refeicao' | 'compras' | 'lazer';
  location?: string;
  coordinates?: [number, number];
  participants: string[]; // participant ids
  tips?: string;
}

export interface DaySchedule {
  date: string;
  dayLabel: string;
  shortDate: string;
  weekday: string;
  city?: string;
  activities: Activity[];
  weather?: { min: number; max: number; icon: string };
}

export interface ChecklistCategory {
  id: string;
  label: string;
  emoji: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  quantity?: string;
  important?: boolean;
}

export interface Place {
  id: string;
  name: string;
  category: 'hotel' | 'restaurante' | 'atracao' | 'compras' | 'bar' | 'transporte';
  description: string;
  address: string;
  coordinates: [number, number];
  rating?: number;
  priceRange?: '€' | '€€' | '€€€';
  website?: string;
  mapsUrl: string;
  tags: string[];
  mustVisit?: boolean;
}
