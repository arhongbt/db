'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import {
  Home, Users, Wallet, FileText, FolderOpen, MoreHorizontal, X,
  Calculator, Building2, Camera, Download, Bell, Scale, BookOpen,
  HelpCircle, Globe, Briefcase, AlertTriangle, Bot, PenTool, ScrollText, FileX,
  HomeIcon, Heart, CreditCard, FileCheck, Landmark, Newspaper, Flower2, Flame, Smartphone, Handshake, Baby,
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
      { href: '/begravningsplanering', label: 'Begravning', icon: Flower2 },
      { href: '/skatteverket-guide', label: 'Skatteverket', icon: FileCheck },
      { href: '/minnesida', label: 'Minnesida', icon: Heart },
      { href: '/samarbete', label: 'Samarbete', icon: Handshake },
      { href: '/juridisk-hjalp', label: 'Mike Ross', icon: Bot },
      { href: '/delagare', label: 'Delägare', icon: Users },
      { href: '/checklistor', label: 'Checklistor', icon: FileCheck },
      { href: '/skanner', label: 'Skanner', icon: Camera },
      { href: '/exportera', label: 'Exportera', icon: Download },
      { href: '/paminelser', label: 'Påminnelser', icon: Bell },
      { href: '/digitala-tillgangar', label: 'Digitalt', icon: Smartphone },
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

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMoreOpen(false); }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  const NAV_ITEMS = NAV_ITEMS_KEYS.map(item => ({
    ...item,
    label: t(item.labelKey),
  }));

  const isMoreActive = ALL_MORE_ITEMS.some((item) => pathname === item.href);

  return (
    <>
      {/* Overlay */}
      {moreOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={() => setMoreOpen(false)} />
      )}

      {/* Slide-up menu */}
      {moreOpen && (
        <div
          ref={menuRef}
          className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t max-h-[70vh] overflow-y-auto mx-auto max-w-[430px]"
          style={{ borderColor: '#F0EDE6' }}
        >
          <div className="px-5 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
            <h3 className="font-semibold text-primary text-sm">{t('nav.all_tools')}</h3>
            <button
              onClick={() => setMoreOpen(false)}
              className="p-2.5 -mr-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Stäng menyn"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>
          <p className="sr-only">{t('ui.close')}</p>
          <div className="px-3 pb-4">
            {MORE_CATEGORIES.map((category) => (
              <div key={category.title} className="mb-3 last:mb-0">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">{category.title}</p>
                <div className="grid grid-cols-4 gap-1">
                  {category.items.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-colors ${
                          isActive
                            ? 'bg-accent/10 text-accent'
                            : 'text-primary hover:bg-primary-lighter/50'
                        }`}
                        aria-label={label}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-accent/15' : 'bg-primary-lighter/50'
                        }`}>
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav bar — warm linen background */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t mx-auto max-w-[430px]" style={{ background: '#F7F5F0', borderColor: '#E8E4DE' }}>
        <div className="flex items-center justify-around px-2 py-1.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center justify-center transition-all duration-200"
                style={{
                  minWidth: isActive ? '100px' : '56px',
                  height: '44px',
                  borderRadius: '22px',
                  background: isActive ? '#6B7F5E' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#524B45',
                  gap: '6px',
                  padding: isActive ? '0 16px' : '0 8px',
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                {isActive && (
                  <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
                )}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            aria-label={t('nav.more')}
            aria-expanded={moreOpen}
            className="relative flex items-center justify-center transition-all duration-200"
            style={{
              minWidth: (moreOpen || isMoreActive) ? '90px' : '56px',
              height: '44px',
              borderRadius: '22px',
              background: (moreOpen || isMoreActive) ? '#6B7F5E' : 'transparent',
              color: (moreOpen || isMoreActive) ? '#FFFFFF' : '#524B45',
              gap: '6px',
              padding: (moreOpen || isMoreActive) ? '0 16px' : '0 8px',
            }}
          >
            <MoreHorizontal className="w-5 h-5 flex-shrink-0" strokeWidth={(moreOpen || isMoreActive) ? 2 : 1.5} />
            {(moreOpen || isMoreActive) && (
              <span className="text-xs font-semibold whitespace-nowrap">{t('nav.more')}</span>
            )}
          </button>
        </div>
        {/* Safe area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" style={{ background: '#F7F5F0' }} />
      </nav>
    </>
  );
}
