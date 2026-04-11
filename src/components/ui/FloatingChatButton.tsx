'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

/** Floating round chatbot button — visible on every page except juridisk-hjalp itself */
export function FloatingChatButton() {
  const pathname = usePathname();

  // Hide on the chat page itself, auth page, onboarding, and landing
  const hiddenPaths = ['/juridisk-hjalp', '/auth', '/onboarding', '/'];
  if (hiddenPaths.some(p => pathname === p || pathname.startsWith('/onboarding'))) {
    return null;
  }

  return (
    <Link
      href="/juridisk-hjalp"
      aria-label="Öppna juridisk AI-assistent"
      className="fixed z-40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))',
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6E8BA4, #567A93)',
        boxShadow: '0 4px 20px rgba(110,139,164,0.3), 0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <MessageSquare className="w-6 h-6 text-white" strokeWidth={1.8} />
    </Link>
  );
}
