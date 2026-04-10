'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Wallet, Shield, FileText } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Hem', icon: Home },
  { href: '/delagare', label: 'Delägare', icon: Users },
  { href: '/tillgangar', label: 'Ekonomi', icon: Wallet },
  { href: '/forsakringar', label: 'Försäkring', icon: Shield },
  { href: '/uppgifter', label: 'Att göra', icon: FileText },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
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
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
