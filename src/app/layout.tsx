import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: 'Dödsbo — Hantera dödsboet steg för steg',
  description:
    'Sveriges första digitala dödsbohjälp. Vi guidar dig genom hela processen — från första dagen till arvskifte.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dödsbo',
  },
  openGraph: {
    title: 'Dödsbo — Hantera dödsboet steg för steg',
    description:
      'Sveriges första digitala dödsbohjälp. Vi guidar dig genom hela processen.',
    type: 'website',
    locale: 'sv_SE',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A3C5E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-dvh">
        <AuthProvider>
          <ServiceWorkerRegistration />
          <main className="mx-auto max-w-lg">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
