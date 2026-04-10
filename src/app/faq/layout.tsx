import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vanliga frågor om dödsbo — Dödsbo',
  description: 'Svar på vanliga frågor om dödsbo, arv, bouppteckning och arvskifte i Sverige.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
