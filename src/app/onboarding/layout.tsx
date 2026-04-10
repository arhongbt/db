import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kom igång — Dödsbo',
  description: 'Berätta om din situation så skapar vi en personlig plan för dödsbohanteringen.',
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
