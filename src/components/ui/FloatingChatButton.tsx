'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bot } from 'lucide-react';

/** Mike Ross floating button — visible on every page except juridisk-hjalp itself */
export function FloatingChatButton() {
  const pathname = usePathname();

  const hiddenPaths = ['/juridisk-hjalp', '/auth', '/onboarding', '/'];
  if (hiddenPaths.some(p => pathname === p || pathname.startsWith('/onboarding'))) {
    return null;
  }

  return (
    <Link
      href="/juridisk-hjalp"
      aria-label="Fråga Mike Ross"
      className="fixed z-40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
      style={{
        bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
        right: '20px',
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6B7F5E, #4F6145)',
        boxShadow: '0 4px 20px rgba(107,127,94,0.35), 0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Bot className="w-6 h-6 text-white" strokeWidth={1.8} />
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 text-xs font-semibold text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: '#2A2622' }}>
        Fråga Mike Ross
      </span>
    </Link>
  );
}
