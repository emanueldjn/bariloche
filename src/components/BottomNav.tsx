'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, CheckSquare, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/roteiro', icon: Calendar, label: 'Roteiro' },
    { href: '/checklist', icon: CheckSquare, label: 'Checklist' },
    { href: '/lugares', icon: MapPin, label: 'Lugares' },
    { href: '/grupo', icon: Users, label: 'Grupo' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 inset-x-0 z-50"
            style={{ maxWidth: '480px', left: '50%', transform: 'translateX(-50%)' }}
        >
            <div
                className="glass border-t"
                style={{
                    borderColor: 'var(--border)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                <div className="flex items-center justify-around px-2 pt-2 pb-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href} className="flex-1">
                                <motion.div
                                    whileTap={{ scale: 0.85 }}
                                    className="flex flex-col items-center gap-1 py-1 rounded-xl relative"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute inset-0 rounded-xl"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                                            }}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                    <Icon
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 1.8}
                                        style={{
                                            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                            transition: 'color 0.2s',
                                        }}
                                    />
                                    <span
                                        className="text-[10px] font-medium"
                                        style={{
                                            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                            fontFamily: 'Inter, sans-serif',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
