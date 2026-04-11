import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arvskifte — fördela arvet steg för steg',
  description:
    'Guide för arvskifte i Sverige. Hur tillgångarna fördelas, vad som krävs och hur du gör ett arvskiftesavtal. Baserat på Ärvdabalken.',
  keywords: [
    'arvskifte',
    'arvskifte hur',
    'arvskiftesavtal',
    'fördela arv',
    'arvskifte steg för steg',
    'arv fördelning',
  ],
};

export default function ArvskifteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
