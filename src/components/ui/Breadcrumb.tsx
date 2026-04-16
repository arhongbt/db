'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Route-to-breadcrumb mapping based on MORE_CATEGORIES + main nav
const ROUTE_MAP: Record<string, { label: string; parent?: string; parentLabel?: string }> = {
  // Main nav
  '/dashboard': { label: 'Hem' },
  '/uppgifter': { label: 'Uppgifter' },
  '/tillgangar': { label: 'Ekonomi' },
  '/dokument': { label: 'Dokument' },

  // Skapa dokument
  '/testamente': { label: 'Testamente', parent: '/dokument', parentLabel: 'Dokument' },
  '/arvskifteshandling': { label: 'Arvskifte', parent: '/dokument', parentLabel: 'Dokument' },
  '/dodsboanmalan': { label: 'Dödsboanmälan', parent: '/dokument', parentLabel: 'Dokument' },
  '/bankbrev': { label: 'Bankbrev', parent: '/dokument', parentLabel: 'Dokument' },
  '/dodsannons': { label: 'Dödsannons', parent: '/dokument', parentLabel: 'Dokument' },
  '/fullmakt': { label: 'Fullmakt', parent: '/dokument', parentLabel: 'Dokument' },
  '/bouppteckning': { label: 'Bouppteckning', parent: '/dokument', parentLabel: 'Dokument' },
  '/arvskifte': { label: 'Arvskifte', parent: '/dokument', parentLabel: 'Dokument' },
  '/kallelse': { label: 'Kallelse', parent: '/dokument', parentLabel: 'Dokument' },
  '/bodelning': { label: 'Bodelning', parent: '/dokument', parentLabel: 'Dokument' },

  // Verktyg & planering
  '/kalender': { label: 'Kalender', parent: '/dashboard', parentLabel: 'Hem' },
  '/begravningsplanering': { label: 'Begravning', parent: '/dashboard', parentLabel: 'Hem' },
  '/skatteverket-guide': { label: 'Skatteverket', parent: '/dashboard', parentLabel: 'Hem' },
  '/minnesida': { label: 'Minnesida', parent: '/dashboard', parentLabel: 'Hem' },
  '/samarbete': { label: 'Samarbete', parent: '/dashboard', parentLabel: 'Hem' },
  '/juridisk-hjalp': { label: 'Mike Ross', parent: '/dashboard', parentLabel: 'Hem' },
  '/boka-jurist': { label: 'Boka jurist', parent: '/dashboard', parentLabel: 'Hem' },
  '/delagare': { label: 'Delägare', parent: '/dashboard', parentLabel: 'Hem' },
  '/checklistor': { label: 'Checklistor', parent: '/dashboard', parentLabel: 'Hem' },
  '/skanner': { label: 'Skanner', parent: '/dashboard', parentLabel: 'Hem' },
  '/exportera': { label: 'Exportera', parent: '/dashboard', parentLabel: 'Hem' },
  '/paminelser': { label: 'Påminnelser', parent: '/dashboard', parentLabel: 'Hem' },
  '/digitala-tillgangar': { label: 'Digitalt', parent: '/dashboard', parentLabel: 'Hem' },
  '/vardering': { label: 'Värdering', parent: '/dashboard', parentLabel: 'Hem' },
  '/sammanfattning': { label: 'Sammanfattning', parent: '/dashboard', parentLabel: 'Hem' },
  '/arvskalkylator': { label: 'Arvskalkylator', parent: '/tillgangar', parentLabel: 'Ekonomi' },
  '/losore': { label: 'Lösöre', parent: '/tillgangar', parentLabel: 'Ekonomi' },
  '/kostnader': { label: 'Kostnader', parent: '/tillgangar', parentLabel: 'Ekonomi' },
  '/tidslinje': { label: 'Tidslinje', parent: '/dashboard', parentLabel: 'Hem' },

  // Guider
  '/dodsbo-fastighet': { label: 'Fastighet', parent: '/dashboard', parentLabel: 'Guider' },
  '/sarkullbarn': { label: 'Särkullbarn', parent: '/dashboard', parentLabel: 'Guider' },
  '/sambo-arv': { label: 'Sambo & arv', parent: '/dashboard', parentLabel: 'Guider' },
  '/dodsbo-skulder': { label: 'Skulder', parent: '/dashboard', parentLabel: 'Guider' },
  '/deklarera-dodsbo': { label: 'Deklaration', parent: '/dashboard', parentLabel: 'Guider' },
  '/bank-guide': { label: 'Bankguide', parent: '/dashboard', parentLabel: 'Guider' },
  '/nodbroms': { label: 'Nödbroms', parent: '/dashboard', parentLabel: 'Hem' },
  '/avsluta-konton': { label: 'Avsluta konton', parent: '/dashboard', parentLabel: 'Guider' },
  '/forsakringar': { label: 'Försäkringar', parent: '/dashboard', parentLabel: 'Guider' },
  '/konflikt': { label: 'Konflikter', parent: '/dashboard', parentLabel: 'Guider' },
  '/internationellt': { label: 'Internationellt', parent: '/dashboard', parentLabel: 'Guider' },
  '/krypto-guide': { label: 'Krypto', parent: '/dashboard', parentLabel: 'Guider' },
  '/foretag-i-dodsbo': { label: 'Företag', parent: '/dashboard', parentLabel: 'Guider' },

  // Hjälp & info
  '/priser': { label: 'Priser', parent: '/dashboard', parentLabel: 'Hem' },
  '/ordlista': { label: 'Ordlista', parent: '/dashboard', parentLabel: 'Hem' },
  '/faq': { label: 'Vanliga frågor', parent: '/dashboard', parentLabel: 'Hem' },
  '/installningar': { label: 'Inställningar', parent: '/dashboard', parentLabel: 'Hem' },

  // Samarbete
  '/delagare-portal': { label: 'Delägare-portal', parent: '/delagare', parentLabel: 'Delägare' },
};

interface BreadcrumbProps {
  /** Override the automatic route mapping */
  items?: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();

  // Build breadcrumb trail from route map
  const trail = items || (() => {
    const route = ROUTE_MAP[pathname];
    if (!route) return [];

    const crumbs: { label: string; href?: string }[] = [
      { label: 'Hem', href: '/dashboard' },
    ];

    if (route.parent && route.parent !== '/dashboard') {
      crumbs.push({
        label: route.parentLabel || route.parent,
        href: route.parent,
      });
    } else if (route.parentLabel && route.parentLabel !== 'Hem') {
      crumbs.push({ label: route.parentLabel });
    }

    crumbs.push({ label: route.label });
    return crumbs;
  })();

  if (trail.length <= 1) return null;

  return (
    <nav className="px-5 py-1.5" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span style={{ color: 'var(--border)', fontSize: '10px' }} aria-hidden="true">›</span>
              )}
              {isLast || !crumb.href ? (
                <span style={{ color: isLast ? 'var(--text)' : undefined }}>{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
