import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bouppteckning — gör den själv steg för steg',
  description:
    'Gör bouppteckning själv med vår digitala guide. Samla underlag, fyll i uppgifter och generera juridiskt korrekt PDF. Baserat på Ärvdabalken och Skatteverkets regler.',
  keywords: [
    'bouppteckning',
    'bouppteckning själv',
    'gör bouppteckning',
    'bouppteckning mall',
    'bouppteckning pdf',
    'bouppteckning skatteverket',
    'bouppteckning steg för steg',
    'bouppteckning online',
  ],
  openGraph: {
    title: 'Bouppteckning — gör den själv steg för steg | Sista Resan',
    description:
      'Digital guide för att göra bouppteckning själv. Generera PDF automatiskt.',
  },
};

export default function BouppteckningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
