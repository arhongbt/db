import type { MetadataRoute } from 'next';

const BASE_URL = 'https://db-three-alpha.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    '',
    '/uppgifter',
    '/delagare',
    '/dokument',
    '/fullmakt',
    '/kallelse',
    '/avsluta-konton',
    '/arvskifte',
    '/kostnader',
    '/tidslinje',
    '/nodbroms',
    '/faq',
    '/bodelning',
    '/dodsboanmalan',
    '/losore',
    '/konflikt',
    '/ordlista',
    '/internationellt',
    '/foretag-i-dodsbo',
    '/juridisk-hjalp',
    '/bouppteckning',
    '/tillgangar',
    '/forsakringar',
  ];

  return publicPages.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
