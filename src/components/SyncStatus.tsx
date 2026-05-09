'use client';

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export type SyncState = 'connecting' | 'syncing' | 'synced' | 'error';

interface SyncStatusProps {
  state: SyncState;
  message: string;
  compact?: boolean;
}

const styles: Record<SyncState, { bg: string; border: string; color: string; icon: typeof Loader2 }> = {
  connecting: {
    bg: '#f9fafb',
    border: '#e5e7eb',
    color: '#6b7280',
    icon: Loader2,
  },
  syncing: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#2563eb',
    icon: Loader2,
  },
  synced: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#059669',
    icon: CheckCircle2,
  },
  error: {
    bg: '#fef2f2',
    border: '#fecaca',
    color: '#dc2626',
    icon: AlertCircle,
  },
};

export default function SyncStatus({ state, message, compact = false }: SyncStatusProps) {
  const current = styles[state];
  const Icon = current.icon;
  const spinning = state === 'connecting' || state === 'syncing';

  return (
    <div
      className={compact ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full' : 'flex items-center gap-2 px-3 py-2 rounded-2xl'}
      style={{
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
      }}
    >
      <Icon size={compact ? 12 : 14} className={spinning ? 'animate-spin' : undefined} />
      <span className={compact ? 'text-[10px] font-bold' : 'text-xs font-semibold'}>{message}</span>
    </div>
  );
}
