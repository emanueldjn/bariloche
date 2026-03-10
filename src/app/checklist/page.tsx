'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { checklist } from '@/data/checklist';
import { ChecklistItem } from '@/data/types';

type CheckedMap = Record<string, boolean>;

const STORAGE_KEY = 'bariloche-checklist';

export default function ChecklistPage() {
    const [checked, setChecked] = useState<CheckedMap>({});
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
        Object.fromEntries(checklist.map((c) => [c.id, true]))
    );

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setChecked(JSON.parse(stored));
        } catch { }
    }, []);

    const toggle = (itemId: string) => {
        setChecked((prev) => {
            const next = { ...prev, [itemId]: !prev[itemId] };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
            return next;
        });
    };

    const toggleCategory = (catId: string) => {
        setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
    };

    const totalItems = checklist.reduce((acc, cat) => acc + cat.items.length, 0);
    const checkedCount = Object.values(checked).filter(Boolean).length;
    const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

    return (
        <main className="pb-safe">
            {/* Header */}
            <div className="px-4 pt-6 pb-3">
                <h1 className="text-2xl font-extrabold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    ✅ Checklist
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Tudo que você precisa levar para Bariloche
                </p>
            </div>

            {/* Progress */}
            <div className="px-4 pb-4">
                <div
                    className="card p-4"
                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.06))' }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Progresso
                        </span>
                        <span className="text-sm font-bold" style={{ color: 'var(--accent-green)' }}>
                            {checkedCount}/{totalItems}
                        </span>
                    </div>
                    <div
                        className="h-2.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                    {progress === 100 && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center text-xs font-bold mt-2"
                            style={{ color: 'var(--accent-green)' }}
                        >
                            🎉 Tudo pronto! Vai Bariloche!
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Categories */}
            <div className="px-4 space-y-3">
                {checklist.map((category) => {
                    const catChecked = category.items.filter((i) => checked[i.id]).length;
                    const catTotal = category.items.length;
                    const isOpen = openCategories[category.id];

                    return (
                        <div key={category.id} className="card overflow-hidden">
                            {/* Category header */}
                            <button
                                className="w-full p-4 flex items-center justify-between"
                                onClick={() => toggleCategory(category.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{category.emoji}</span>
                                    <div className="text-left">
                                        <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            {category.label}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            {catChecked}/{catTotal} itens
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {catChecked === catTotal ? (
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-green)' }}>
                                            ✓ Completo
                                        </span>
                                    ) : null}
                                    {isOpen ? (
                                        <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} />
                                    ) : (
                                        <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
                                    )}
                                </div>
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-3 px-3 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>
                                            {category.items.map((item: ChecklistItem, idx) => {
                                                const isChecked = !!checked[item.id];
                                                return (
                                                    <motion.button
                                                        key={item.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.02 }}
                                                        onClick={() => toggle(item.id)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                                                        style={{
                                                            background: isChecked ? 'rgba(16,185,129,0.08)' : 'transparent',
                                                        }}
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: isChecked ? 360 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            {isChecked ? (
                                                                <CheckCircle size={20} style={{ color: 'var(--accent-green)' }} />
                                                            ) : (
                                                                <Circle size={20} style={{ color: 'var(--text-muted)' }} />
                                                            )}
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
                                                        {item.important && !isChecked && (
                                                            <AlertCircle size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                                                        )}
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
