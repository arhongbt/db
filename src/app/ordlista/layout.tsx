import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ordlista — juridiska termer vid dödsbo',
  description:
    'Förklaring av vanliga juridiska termer vid dödsbo och arv. Bouppteckning, arvslott, laglott, testamente, bodelning och mer — på enkel svenska.',
  keywords: [
    'dödsbo ordlista',
    'juridiska termer arv',
    'bouppteckning termer',
    'arvslott förklaring',
    'laglott betydelse',
    'bodelning förklaring',
    'dödsbo termer',
  ],
  openGraph: {
    title: 'Ordlista — juridiska termer vid dödsbo | Sista Resan',
    description: 'Enkla förklaringar av juridiska termer vid dödsbo och arv.',
  },
};

export default function OrdlistaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
