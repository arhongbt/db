import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dödsbo och fastighet — sälja hus, värdering & lagfart',
  description:
    'Så hanterar du fastighet i dödsbo. Värdering, försäljning, kapitalvinstskatt, lagfart och överlåtelse. Steg-för-steg guide baserad på svensk lag.',
  keywords: [
    'dödsbo fastighet',
    'sälja hus dödsbo',
    'dödsbo bostad',
    'lagfart dödsbo',
    'värdera fastighet dödsbo',
    'kapitalvinstskatt dödsbo',
    'ärva hus',
    'överlåta fastighet arv',
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
