import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dödsbo och skulder — ärver man skulder i Sverige?',
  description:
    'Allt om skulder i dödsbo. I Sverige ärver man aldrig personligt ansvar för skulder. Lär dig hur skulder betalas från dödsboet, vad ett insolvent dödsbo är, och när du behöver dödsboanmälan.',
  keywords: [
    'dödsbo skulder',
    'ärver man skulder',
    'skulder dödsbo',
    'dödsbo minus',
    'insolvent dödsbo',
    'borgenärer dödsbo',
    'lån dödsbo',
    'prioritering skuldbetalning',
    'dödsboanmälan',
  ],
};

export default function DodsboSkulderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
