import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Dödsbo',
  description: 'Överblick över dödsboet med tidsfrister, uppgifter och nästa steg.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
