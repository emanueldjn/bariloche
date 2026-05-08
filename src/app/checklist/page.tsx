'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Circle } from 'lucide-react';
import { checklist } from '@/data/checklist';
import { ChecklistItem } from '@/data/types';
import { useSharedData } from '@/hooks/useSharedData';

export default function ChecklistPage() {
  const { data, update } = useSharedData();
  const checked = data.checklistState;
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(Object.fromEntries(checklist.map((category) => [category.id, true])));

  const toggle = async (itemId: string) => {
    await update({
      checklistState: {
        ...checked,
        [itemId]: !checked[itemId],
      },
    });
  };

  const totalItems = checklist.reduce((total, category) => total + category.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <main className="pb-safe">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
          ✅ Checklist
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Tudo que o grupo marcar aqui aparece nos outros celulares
        </p>
      </div>

      <div className="px-4 pb-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Progresso</span>
            <span className="text-sm font-bold" style={{ color: 'var(--accent-green)' }}>
              {checkedCount}/{totalItems} itens
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #059669, #0891b2)' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' as const }} />
          </div>
          {progress === 100 && (
            <motion.p initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="text-center text-xs font-bold mt-2" style={{ color: 'var(--accent-green)' }}>
              🎉 Tudo pronto! Pode embarcar.
            </motion.p>
          )}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {checklist.map((category) => {
          const catChecked = category.items.filter((item) => checked[item.id]).length;
          const isOpen = openCats[category.id];
          const isComplete = catChecked === category.items.length;

          return (
            <div key={category.id} className="card overflow-hidden">
              <button className="w-full p-4 flex items-center gap-3" onClick={() => setOpenCats({ ...openCats, [category.id]: !isOpen })}>
                <span className="text-xl">{category.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {category.label}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(catChecked / category.items.length) * 100}%`,
                          background: isComplete ? '#059669' : '#3b82f6',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {catChecked}/{category.items.length}
                    </span>
                    {isComplete && (
                      <span className="text-xs font-bold" style={{ color: 'var(--accent-green)' }}>
                        ✓
                      </span>
                    )}
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="pb-3 px-2 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
                      {category.items.map((item: ChecklistItem, index) => {
                        const isChecked = !!checked[item.id];

                        return (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.015 }}
                            onClick={() => void toggle(item.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                            style={{ background: isChecked ? '#f0fdf4' : 'transparent' }}
                          >
                            <motion.div animate={{ scale: isChecked ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.2 }}>
                              {isChecked ? <CheckCircle size={19} style={{ color: 'var(--accent-green)' }} /> : <Circle size={19} style={{ color: '#d1d5db' }} />}
                            </motion.div>
                            <span
                              className="text-sm flex-1"
                              style={{
                                color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                                textDecoration: isChecked ? 'line-through' : 'none',
                                transition: 'all 0.2s',
                              }}
                            >
                              {item.label}
                            </span>
                            {item.important && !isChecked && <AlertCircle size={13} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </main>
  );
}
