import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';
import { LanguageProvider } from '@/lib/i18n';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { CookieBanner } from '@/components/CookieBanner';
import { FloatingChatButton } from '@/components/ui/FloatingChatButton';
import { TextScaleLoader } from '@/components/TextScaleLoader';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const SITE_URL = 'https://db-three-alpha.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sista Resan — Hantera dödsboet steg för steg',
    template: '%s | Sista Resan',
  },
  description:
    'Sveriges första digitala dödsbohjälp. Bouppteckning, tidslinje, AI-jurist och alla verktyg du behöver — från första dagen till arvskifte. Gratis att börja.',
  keywords: [
    'dödsbo',
    'bouppteckning',
    'dödsbohjälp',
    'hantera dödsbo',
    'arvskifte',
    'dödsbodelägare',
    'bouppteckning själv',
    'dödsbo steg för steg',
    'arvsrätt',
    'dödsbo guide',
    'dödsbo checklista',
    'skatteverket bouppteckning',
    'dödsboanmälan',
    'ärvdabalken',
    'dödsbo bank',
    'dödsbo fastighet',
    'sälja hus dödsbo',
    'särkullbarn arv',
    'sambo arv',
    'sambo dödsbo',
    'dödsbo skulder',
    'ärver man skulder',
    'deklarera dödsbo',
    'dödsbo deklaration',
    'laglott',
    'arvslott',
    'testamente dödsbo',
    'boutredningsman',
    'tömma dödsbo',
    'dödsbo bil',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sista Resan',
  },
  openGraph: {
    title: 'Sista Resan — Hantera dödsboet steg för steg',
    description:
      'Sveriges första digitala dödsbohjälp. Bouppteckning, AI-jurist, tidslinje och 30+ verktyg. Gratis att börja.',
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Sista Resan',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sista Resan — Hantera dödsboet steg för steg',
    description:
      'Sveriges första digitala dödsbohjälp. Gratis att börja.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6B7F5E',
};

// JSON-LD structured data for SEO
function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Sista Resan',
    description: 'Sveriges första digitala dödsbohjälp. Hantera dödsboet steg för steg.',
    url: SITE_URL,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'SEK',
      description: 'Gratis grundversion',
    },
    featureList: [
      'Personlig tidslinje för dödsbohantering',
      'Automatisk bouppteckning som PDF',
      'AI-driven juridisk assistent',
      'Bank-guide för alla 8 storbanker',
      'Delägare-portal för samarbete',
      'Push-notiser för tidsfrister',
    ],
    inLanguage: 'sv',
    author: {
      '@type': 'Organization',
      name: 'Sista Resan',
    },
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Vad kostar Sista Resan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Grundversionen är helt gratis. Premium-funktioner som PDF-generering och AI-assistenten kostar en engångsavgift.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hur lång tid tar en bouppteckning?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En bouppteckning ska vara klar inom 3 månader efter dödsfallet och skickas till Skatteverket inom 1 månad efter förrättningen.',
        },
      },
      {
        '@type': 'Question',
        name: 'Ärver man skulder i Sverige?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nej, man ärver aldrig skulder i Sverige. Om den avlidnes skulder överstiger tillgångarna blir dödsboet insolvent, men arvingarna blir aldrig personligt ansvariga.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <JsonLd />
      </head>
      <body className="min-h-dvh">
        <TextScaleLoader />
        {/* Skip navigation link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
        >
          Hoppa till innehål
        </a>
        <AuthProvider>
          <LanguageProvider>
            <ServiceWorkerRegistration />
            <main className="min-h-dvh relative" id="main-content">
              {children}
              <FloatingChatButton />
            </main>
          </LanguageProvider>
        </AuthProvider>
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
