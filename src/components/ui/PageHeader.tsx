'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, showBack = true, action }: PageHeaderProps) {
  const router = useRouter();

  function handleBack() {
    // Smart back: if we came from within the app, go back; otherwise go to dashboard
    if (typeof window !== 'undefined' && document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        const currentUrl = new URL(window.location.href);
        if (referrerUrl.origin === currentUrl.origin) {
          router.back();
          return;
        }
      } catch {
        // Invalid URL, fall through to dashboard
      }
    }
    router.push('/dashboard');
  }

  return (
    <div className="px-5 pt-2 pb-3">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
            aria-label="Tillbaka"
          >
            <ArrowLeft className="w-[18px] h-[18px]" style={{ color: 'var(--text-secondary)' }} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-display truncate" style={{ color: 'var(--text)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
