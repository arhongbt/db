'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Home, Users, Wallet, FileText, FolderOpen, MoreHorizontal, X,
  Calculator, Building2, Camera, Download, Bell, Scale, BookOpen,
  HelpCircle, Globe, Briefcase, AlertTriangle, MessageSquare,
  HomeIcon, Heart, CreditCard, FileCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Hem', icon: Home },
  { href: '/uppgifter', label: 'Att göra', icon: FileText },
  { href: '/tillgangar', label: 'Ekonomi', icon: Wallet },
  { href: '/dokument', label: 'Dokument', icon: FolderOpen },
];

const MORE_CATEGORIES = [
  {
    title: 'Hantera dödsboet',
    items: [
      { href: '/delagare', label: 'Delägare', icon: Users },
      { href: '/delagare-portal', label: 'Delägare-portal', icon: Scale },
      { href: '/arvskalkylator', label: 'Arvskalkylator', icon: Calculator },
      { href: '/bank-guide', label: 'Bank-guide', icon: Building2 },
    ],
  },
  {
    title: 'Verktyg',
    items: [
      { href: '/juridisk-hjalp', label: 'Juridisk AI', icon: MessageSquare },
      { href: '/skanner', label: 'Skanner', icon: Camera },
      { href: '/exportera', label: 'Exportera', icon: Download },
      { href: '/paminelser', label: 'Påminnelser', icon: Bell },
    ],
  },
  {
    title: 'Guider',
    items: [
      { href: '/dodsbo-fastighet', label: 'Fastighet', icon: HomeIcon },
      { href: '/sarkullbarn', label: 'Särkullbarn', icon: Users },
      { href: '/sambo-arv', label: 'Sambo & arv', icon: Heart },
      { href: '/dodsbo-skulder', label: 'Skulder', icon: CreditCard },
      { href: '/deklarera-dodsbo', label: 'Deklaration', icon: FileCheck },
    ],
  },
  {
    title: 'Hjälp & info',
    items: [
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
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Close on outside click
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
          className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom"
        >
          <div className="px-5 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-white">
            <h3 className="font-semibold text-primary text-sm">Alla verktyg</h3>
            <button
              onClick={() => setMoreOpen(false)}
              className="p-2.5 -mr-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Stäng menyn"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>
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
                        className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-accent/10 text-accent'
                            : 'text-primary hover:bg-gray-50'
                        }`}
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
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

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="mx-auto max-w-lg flex items-center justify-around">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center py-2 px-3 min-w-[4rem] transition-colors ${
                  isActive
                    ? 'text-accent'
                    : 'text-muted hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            aria-label="Mer verktyg"
            aria-expanded={moreOpen}
            className={`flex flex-col items-center py-2 px-3 min-w-[4rem] transition-colors ${
              moreOpen || isMoreActive
                ? 'text-accent'
                : 'text-muted hover:text-primary'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" strokeWidth={moreOpen || isMoreActive ? 2.5 : 1.5} />
            <span className="text-xs font-medium">Mer</span>
          </button>
        </div>
        {/* Safe area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
