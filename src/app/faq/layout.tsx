import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vanliga frågor om dödsbo & bouppteckning',
  description:
    'Svar på vanliga frågor om dödsbo, bouppteckning, arvskifte, arvsrätt och skulder. Ärver man skulder? Hur lång tid tar bouppteckning? Allt du behöver veta.',
  keywords: [
    'dödsbo frågor',
    'bouppteckning frågor',
    'ärver man skulder',
    'arvskifte hur lång tid',
    'dödsbo guide',
    'bouppteckning tid',
    'dödsbodelägare rättigheter',
  ],
  openGraph: {
    title: 'Vanliga frågor om dödsbo & bouppteckning | Sista Resan',
    description:
      'Svar på de vanligaste frågorna om dödsbo, bouppteckning, arvskifte och arvsrätt i Sverige.',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
