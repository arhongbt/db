import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Första dagarna efter dödsfall — vad göra?',
  description:
    'Steg-för-steg guide för de första 7 dagarna efter ett dödsfall. Dödsbevis, begravningsbyrå, bank, försäkring — allt i rätt ordning.',
  keywords: [
    'dödsfall vad göra',
    'första dagarna dödsfall',
    'efter dödsfall checklista',
    'dödsbevis hur',
    'anmäla dödsfall bank',
    'dödsfall försäkring',
  ],
  openGraph: {
    title: 'Första dagarna efter dödsfall — steg för steg | Sista Resan',
    description: 'Vad du behöver göra de första 7 dagarna efter ett dödsfall.',
  },
};

export default function NodbromsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
