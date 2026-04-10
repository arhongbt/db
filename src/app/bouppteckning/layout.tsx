import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bouppteckning — Dödsbo',
  description: 'Samla underlag och generera bouppteckning steg för steg.',
};

export default function BouppteckningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
