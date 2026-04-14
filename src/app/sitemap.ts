import type { MetadataRoute } from 'next';

const BASE_URL = 'https://db-three-alpha.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // High-priority public/SEO pages
  const seoPages = [
    { route: '', priority: 1, changeFrequency: 'weekly' as const },
    { route: '/faq', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/ordlista', priority: 0.9, changeFrequency: 'monthly' as const },
    { route: '/om', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/integritetspolicy', priority: 0.3, changeFrequency: 'monthly' as const },
    { route: '/anvandarvillkor', priority: 0.3, changeFrequency: 'monthly' as const },
  ];

  // Guide/tool pages — great for SEO long-tail keywords
  const guidePages = [
    '/bouppteckning',
    '/testamente',
    '/arvskifteshandling',
    '/nodbroms',
    '/tidslinje',
    '/avsluta-konton',
    '/arvskifte',
    '/bodelning',
    '/dodsboanmalan',
    '/losore',
    '/konflikt',
    '/internationellt',
    '/foretag-i-dodsbo',
    '/forsakringar',
    '/bank-guide',
    '/arvskalkylator',
    '/kostnader',
    '/fullmakt',
    '/kallelse',
    '/dodsbo-fastighet',
    '/sarkullbarn',
    '/sambo-arv',
    '/dodsbo-skulder',
    '/deklarera-dodsbo',
    '/begravningsplanering',
    '/bankbrev',
    '/skatteverket-guide',
    '/minnesida',
    '/samarbete',
    '/dodsannons',
    '/digitala-tillgangar',
    '/krypto-guide',
    '/checklistor',
    '/vardering',
    '/priser',
  ].map((route) => ({
    route,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));

  // App pages — lower priority for SEO but still crawlable
  const appPages = [
    '/juridisk-hjalp',
    '/delagare',
    '/delagare-portal',
    '/tillgangar',
    '/uppgifter',
    '/dokument',
    '/skanner',
    '/exportera',
    '/paminelser',
    '/kalender',
    '/sammanfattning',
    '/boka-jurist',
  ].map((route) => ({
    route,
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  }));

  return [...seoPages, ...guidePages, ...appPages].map((page) => ({
    url: `${BASE_URL}${page.route}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
