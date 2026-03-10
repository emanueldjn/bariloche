'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, CheckSquare, MapPin, Users, Route } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/roteiro', icon: Calendar, label: 'Roteiro' },
    { href: '/checklist', icon: CheckSquare, label: 'Checklist' },
    { href: '/lugares', icon: MapPin, label: 'Lugares' },
    { href: '/rota', icon: Route, label: 'Rota' },
    { href: '/grupo', icon: Users, label: 'Grupo' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 z-50"
            style={{
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
            }}
        >
            <div
                className="glass border-t"
                style={{
                    borderColor: 'rgba(0,0,0,0.08)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                <div className="flex items-center justify-around px-1 pt-2 pb-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href} className="flex-1">
                                <motion.div
                                    whileTap={{ scale: 0.82 }}
                                    className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl relative"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-bg"
                                            className="absolute inset-0 rounded-xl"
                                            style={{ background: 'rgba(59,130,246,0.1)' }}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                                        />
                                    )}
                                    <Icon
                                        size={20}
                                        strokeWidth={isActive ? 2.5 : 1.8}
                                        style={{
                                            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                            transition: 'color 0.2s',
                                        }}
                                    />
                                    <span
                                        className="text-[9px] font-semibold"
                                        style={{
                                            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
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
