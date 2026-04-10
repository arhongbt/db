import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logga in — Dödsbo',
  description: 'Logga in eller skapa ett konto för att komma igång.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
