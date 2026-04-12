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
    <div className="fixed z-40 bottom-0 left-0 right-0 mx-auto max-w-lg pointer-events-none">
      <Link
        href="/juridisk-hjalp"
        aria-label="Fråga Mike Ross"
        className="absolute flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group pointer-events-auto"
        style={{
          bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
          right: '16px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6B7F5E, #4F6145)',
          boxShadow: '0 4px 20px rgba(107,127,94,0.35), 0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Bot className="w-5 h-5 text-white" strokeWidth={1.8} />
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1.5 text-xs font-semibold text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ background: '#2A2622' }}>
          Fråga Mike Ross
        </span>
      </Link>
    </div>
  );
}
