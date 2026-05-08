import type { Metadata, Viewport } from 'next';
import BottomNav from '@/components/BottomNav';
import { tripMeta } from '@/data/trip';
import './globals.css';

export const metadata: Metadata = {
  title: tripMeta.title,
  description: tripMeta.description,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: tripMeta.shortTitle,
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f8f7f4',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <div className="max-w-[480px] mx-auto min-h-dvh relative">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
