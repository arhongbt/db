import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Särkullbarn och arv — rättigheter & laglott',
  description:
    'Guide om särkullbarns arvsrätt i Sverige. Förstå laglott, arvslott och hur särkullbarn kan få ut sin andel direkt från dödsboet utan att vänta på efterlevande make/maka.',
  keywords: [
    'särkullbarn arv',
    'särkullbarn laglott',
    'särkullbarn rättigheter',
    'arv särkullbarn',
    'laglott särkullbarn',
    'särkullbarn arvskifte',
    'särkullbarn arvslott',
    'särkullbarn dödsbo',
    'barns arvsrätt',
    'styvbarn arv',
  ],
};

export default function SarkullbarnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
