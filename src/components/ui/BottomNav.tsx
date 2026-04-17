'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useSeniorMode } from '@/lib/senior-mode';
import {
  Home, Users, Wallet, FileText, FolderOpen, MoreHorizontal, X, Search,
  Calculator, Building2, Camera, Download, Bell, Scale, BookOpen,
  HelpCircle, Globe, Briefcase, AlertTriangle, Bot, PenTool, ScrollText, FileX,
  HomeIcon, Heart, CreditCard, FileCheck, Landmark, Newspaper, Flower2, Flame, Smartphone, Handshake, Baby, Calendar, FileDown, Gem,
} from 'lucide-react';

const NAV_ITEMS_KEYS = [
  { href: '/dashboard', labelKey: 'nav.home', icon: Home },
  { href: '/uppgifter', labelKey: 'nav.tasks', icon: FileText },
  { href: '/tillgangar', labelKey: 'nav.economy', icon: Wallet },
  { href: '/dokument', labelKey: 'nav.documents', icon: FolderOpen },
];

const MORE_CATEGORIES = [
  {
    title: 'Skapa dokument',
    items: [
      { href: '/testamente', label: 'Testamente', icon: PenTool },
      { href: '/arvskifteshandling', label: 'Arvskifte', icon: ScrollText },
      { href: '/dodsboanmalan', label: 'Dödsboanmälan', icon: FileX },
      { href: '/bankbrev', label: 'Bankbrev', icon: Landmark },
      { href: '/dodsannons', label: 'Dödsannons', icon: Newspaper },
      { href: '/fullmakt', label: 'Fullmakt', icon: FileText },
    ],
  },
  {
    title: 'Verktyg & planering',
    items: [
      { href: '/kalender', label: 'Kalender', icon: Calendar },
      { href: '/begravningsplanering', label: 'Begravning', icon: Flower2 },
      { href: '/skatteverket-guide', label: 'Skatteverket', icon: FileCheck },
      { href: '/minnesida', label: 'Minnesida', icon: Heart },
      { href: '/samarbete', label: 'Samarbete', icon: Handshake },
      { href: '/juridisk-hjalp', label: 'Mike Ross', icon: Bot },
      { href: '/boka-jurist', label: 'Boka jurist', icon: Scale },
      { href: '/delagare', label: 'Delägare', icon: Users },
      { href: '/checklistor', label: 'Checklistor', icon: FileCheck },
      { href: '/skanner', label: 'Skanner', icon: Camera },
      { href: '/exportera', label: 'Exportera', icon: Download },
      { href: '/paminelser', label: 'Påminnelser', icon: Bell },
      { href: '/digitala-tillgangar', label: 'Digitalt', icon: Smartphone },
      { href: '/vardering', label: 'Värdering', icon: Gem },
      { href: '/sammanfattning', label: 'Sammanfattning', icon: FileDown },
    ],
  },
  {
    title: 'Guider',
    items: [
      { href: '/dodsbo-fastighet', label: 'Fastighet', icon: HomeIcon },
      { href: '/sarkullbarn', label: 'Särkullbarn', icon: Baby },
      { href: '/sambo-arv', label: 'Sambo & arv', icon: Users },
      { href: '/dodsbo-skulder', label: 'Skulder', icon: CreditCard },
      { href: '/deklarera-dodsbo', label: 'Deklaration', icon: FileCheck },
    ],
  },
  {
    title: 'Hjälp & info',
    items: [
      { href: '/priser', label: 'Priser', icon: CreditCard },
      { href: '/ordlista', label: 'Ordlista', icon: BookOpen },
      { href: '/faq', label: 'Vanliga frågor', icon: HelpCircle },
      { href: '/konflikt', label: 'Konflikter', icon: AlertTriangle },
      { href: '/internationellt', label: 'Internationellt', icon: Globe },
      { href: '/foretag-i-dodsbo', label: 'Företag i dödsbo', icon: Briefcase },
    ],
  },
];

const ALL_MORE_ITEMS = MORE_CATEGORIES.flatMap((c) => c.items);

const HIDDEN_PATHS = ['/', '/auth', '/onboarding'];

// Senior mode: only 3 nav items, no More menu
const SENIOR_NAV_ITEMS_KEYS = [
  { href: '/dashboard', labelKey: 'nav.home', icon: Home },
  { href: '/uppgifter', labelKey: 'nav.tasks', icon: FileText },
  { href: '/faq', labelKey: '_senior_help', icon: HelpCircle },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { seniorMode } = useSeniorMode();
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuFilter, setMenuFilter] = useState('');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);

  // Track recently used items from More menu
  useEffect(() => {
    const moreHref = ALL_MORE_ITEMS.find((item) => pathname === item.href);
    if (moreHref) {
      setRecentlyUsed((prev) => {
        const updated = [moreHref.href, ...prev.filter((h) => h !== moreHref.href)].slice(0, 4);
        return updated;
      });
    }
  }, [pathname]);

  useEffect(() => {
    setMoreOpen(false);
    setMenuFilter('');
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [moreOpen]);

  // No auto-focus on filter input — prevents mobile keyboard from popping up

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!menuFilter.trim()) return MORE_CATEGORIES;
    const q = menuFilter.toLowerCase();
    return MORE_CATEGORIES
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [menuFilter]);

  // Get recently used items with their full data
  const recentItems = useMemo(() => {
    return recentlyUsed
      .map((href) => ALL_MORE_ITEMS.find((item) => item.href === href))
      .filter(Boolean) as typeof ALL_MORE_ITEMS;
  }, [recentlyUsed]);

  const NAV_ITEMS = NAV_ITEMS_KEYS.map(item => ({
    ...item,
    label: t(item.labelKey),
  }));

  const SENIOR_NAV_ITEMS = SENIOR_NAV_ITEMS_KEYS.map(item => ({
    ...item,
    label: item.labelKey === '_senior_help' ? t('Hjälp', 'Help') : t(item.labelKey),
  }));

  const activeNavItems = seniorMode ? SENIOR_NAV_ITEMS : NAV_ITEMS;

  const isMoreActive = ALL_MORE_ITEMS.some((item) => pathname === item.href);

  if (HIDDEN_PATHS.includes(pathname)) return null;

  // Senior mode: simplified nav only
  if (seniorMode) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-2" style={{ background: 'transparent' }} aria-label={t('Huvudnavigation', 'Main navigation')}>
        <div
          className="mx-auto max-w-[420px] flex items-center justify-around px-4 py-2"
          style={{
            background: 'var(--bottom-nav-bg, rgba(255,255,255,0.92))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            boxShadow: '0 4px 20px var(--shadow-color, rgba(26,26,46,0.08)), 0 1px 3px var(--shadow-color, rgba(26,26,46,0.04))',
            border: '1px solid var(--border)',
          }}
        >
          {SENIOR_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`relative flex flex-col items-center justify-center gap-1 py-2 px-4 transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-[var(--text-secondary)]'
                }`}
                style={{ minWidth: '72px' }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(107,127,94,0.12)' : 'transparent',
                  }}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.2 : 1.5} />
                </div>
                <span className={`text-sm leading-tight ${isActive ? 'font-semibold' : 'font-medium opacity-70'}`}>{label}</span>
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" style={{ background: 'transparent' }} />
      </nav>
    );
  }

  return (
    <>
      {/* Overlay */}
      {moreOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={() => setMoreOpen(false)} />
      )}

      {/* Slide-up menu — Tiimo-inspired rounded panel */}
      {moreOpen && (
        <div
          ref={menuRef}
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-2 right-2 z-50 max-h-[70vh] overflow-y-auto"
          style={{
            borderRadius: '28px',
            background: 'var(--bg-card)',
            boxShadow: '0 8px 40px rgba(26,26,46,0.12), 0 2px 8px rgba(26,26,46,0.04)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="px-5 pt-5 pb-2 flex items-center justify-between sticky top-0 z-10" style={{ background: 'var(--bg-card)', borderRadius: '28px 28px 0 0' }}>
            <h3 className="font-display text-primary text-sm">{t('nav.all_tools')}</h3>
            <button
              onClick={() => setMoreOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--border-light)' }}
              aria-label="Stäng menyn"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          </div>
          <p className="sr-only">{t('ui.close')}</p>

          {/* Search filter */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'var(--border-light)', border: '1px solid var(--border)' }}>
              <Search className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <input
                ref={filterInputRef}
                type="text"
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                placeholder={t('Filtrera verktyg...', 'Filter tools...')}
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: 'var(--text)' }}
              />
              {menuFilter && (
                <button onClick={() => setMenuFilter('')} className="p-0.5" style={{ color: 'var(--text-secondary)' }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Recently used */}
          {recentItems.length > 0 && !menuFilter.trim() && (
            <div className="px-4 pb-3">
              <div className="rounded-2xl p-3" style={{ background: 'var(--accent-soft, rgba(107,127,94,0.06))' }}>
                <p className="text-[10px] uppercase tracking-wider mb-2.5 px-1" style={{ color: 'var(--accent)' }}>
                  {t('Senast använda', 'Recently used')}
                </p>
                <div className="flex gap-2">
                  {recentItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex flex-col items-center gap-1.5 py-2 px-2 flex-1 rounded-xl transition-all duration-200"
                      style={{ background: 'transparent' }}
                      aria-label={label}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(107,127,94,0.12)' }}
                      >
                        <Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight" style={{ color: 'var(--text)' }}>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="px-3 pb-5">
            {filteredCategories.map((category, catIdx) => (
              <div key={category.title} className="mb-4 last:mb-0">
                {/* Gradient divider between categories */}
                {catIdx > 0 && (
                  <div className="h-px mx-2 mb-3" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
                )}
                <p className="text-xs font-display text-muted uppercase tracking-wider px-2 mb-2">{category.title}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {category.items.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center gap-1.5 py-3 px-1 transition-all duration-200 ${
                          isActive
                            ? 'text-accent'
                            : 'text-primary'
                        }`}
                        style={{ borderRadius: '20px', background: isActive ? 'rgba(122,158,126,0.08)' : 'transparent' }}
                        aria-label={label}
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center"
                          style={{ background: isActive ? 'rgba(122,158,126,0.12)' : 'var(--border-light)' }}
                        >
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-medium text-center leading-tight">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && menuFilter.trim() && (
              <p className="text-sm text-center py-6" style={{ color: 'var(--text-secondary)' }}>
                {t('Inga träffar', 'No matches')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bottom nav bar — Tiimo-inspired floating pill */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-2" style={{ background: 'transparent' }} aria-label={t('Huvudnavigation', 'Main navigation')}>
        <div
          className="mx-auto max-w-[420px] flex items-center justify-around px-2 py-1.5"
          style={{
            background: 'var(--bottom-nav-bg, rgba(255,255,255,0.92))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            boxShadow: '0 4px 20px var(--shadow-color, rgba(26,26,46,0.08)), 0 1px 3px var(--shadow-color, rgba(26,26,46,0.04))',
            border: '1px solid var(--border)',
          }}
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-[var(--text-secondary)]'
                }`}
                style={{ minWidth: '52px' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(107,127,94,0.12)' : 'transparent',
                  }}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.5} />
                </div>
                <span className={`text-[10px] leading-tight ${isActive ? 'font-semibold' : 'font-medium opacity-70'}`}>{label}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            aria-label={t('nav.more')}
            aria-expanded={moreOpen}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 transition-all duration-200 ${
              (moreOpen || isMoreActive) ? 'text-accent' : 'text-[var(--text-secondary)]'
            }`}
            style={{ minWidth: '52px' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: (moreOpen || isMoreActive) ? 'rgba(107,127,94,0.12)' : 'transparent',
              }}
            >
              <MoreHorizontal className="w-[18px] h-[18px]" strokeWidth={(moreOpen || isMoreActive) ? 2.2 : 1.5} />
            </div>
            <span className={`text-[10px] leading-tight ${(moreOpen || isMoreActive) ? 'font-semibold' : 'font-medium opacity-70'}`}>{t('nav.more')}</span>
          </button>
        </div>
        {/* Safe area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" style={{ background: 'transparent' }} />
      </nav>
    </>
  );
}
