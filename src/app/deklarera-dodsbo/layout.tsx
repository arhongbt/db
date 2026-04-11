import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deklarera dödsbo — så gör du steg för steg',
  description:
    'Guide till hur dödsboet deklarerar sin inkomst för Skatteverket. Lär dig om deklarationsfristen, K-blankett för fastigheter, och vad som ingår i inkomstdeklarationen för dödsbo.',
  keywords: [
    'deklarera dödsbo',
    'dödsbo deklaration',
    'dödsbo skatt',
    'inkomstdeklaration dödsbo',
    'dödsbo skatteverket',
    'K-blankett fastigheter',
    'deklarationsfrist dödsbo',
    'dödsbo inkomster',
    'dödsboförrättare deklaration',
    'arvingarnas skatt',
  ],
  openGraph: {
    title: 'Deklarera dödsbo — så gör du steg för steg',
    description:
      'Guide till hur dödsboet deklarerar sin inkomst för Skatteverket. Lär dig om deklarationsfristen, K-blankett för fastigheter, och vad som ingår i inkomstdeklarationen för dödsbo.',
    type: 'article',
  },
};

export default function DeklararaDodsboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
