'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bot, X } from 'lucide-react';

/** Mike Ross floating button — peeks from edge, expands on tap */
export function FloatingChatButton() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const hiddenPaths = ['/juridisk-hjalp', '/auth', '/onboarding', '/'];
  if (hiddenPaths.some(p => pathname === p || pathname.startsWith('/onboarding'))) {
    return null;
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        aria-label="Öppna Mike Ross"
        className="fixed z-40 flex items-center gap-1.5 pointer-events-auto transition-all duration-300 active:scale-95"
        style={{
          bottom: 'calc(7.5rem + env(safe-area-inset-bottom, 0px))',
          right: '-6px',
          height: '40px',
          paddingLeft: '10px',
          paddingRight: '14px',
          borderRadius: '20px 0 0 20px',
          background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)',
          boxShadow: '-2px 2px 12px rgba(122,158,126,0.25)',
        }}
      >
        <Bot className="w-4 h-4 text-white" strokeWidth={2} />
        <span className="text-xs font-semibold text-white/90">Mike</span>
      </button>
    );
  }

  return (
    <div
      className="fixed z-40 flex items-center gap-2 pointer-events-auto animate-in slide-in-from-right duration-200"
      style={{
        bottom: 'calc(7.5rem + env(safe-area-inset-bottom, 0px))',
        right: '12px',
      }}
    >
      <button
        onClick={() => setExpanded(false)}
        aria-label="Stäng"
        className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
        style={{ background: 'rgba(0,0,0,0.15)' }}
      >
        <X className="w-3.5 h-3.5 text-white" strokeWidth={2} />
      </button>
      <Link
        href="/juridisk-hjalp"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)',
          boxShadow: '0 4px 20px rgba(107,127,94,0.35), 0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Bot className="w-5 h-5 text-white" strokeWidth={1.8} />
        <span className="text-sm font-semibold text-white">Fråga Mike Ross</span>
      </Link>
    </div>
  );
}
