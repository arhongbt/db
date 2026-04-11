import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sambo och arv — regler, testamente & bodelning',
  description:
    'Lär dig om arv mellan sambor i Sverige. Sambor ärver inte automatiskt varandra. Läs om reglerna, testamentet, bodelning och skillnaden mot gifta par.',
  keywords: [
    'sambo arv',
    'sambo dödsbo',
    'sambo ärver inte',
    'sambolagen arv',
    'testamente sambo',
    'sambo bodelning',
    'arv mellan sambor',
    'samboarv Sverige',
  ],
  openGraph: {
    title: 'Sambo och arv — regler, testamente & bodelning',
    description:
      'Sambo är inte gift när det gäller arv. Läs om reglerna för samboarv, testamente och bodelning i Sverige.',
    type: 'website',
  },
};

export default function SamboArvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
