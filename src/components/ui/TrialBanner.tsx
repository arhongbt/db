'use client';

import Link from 'next/link';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSubscription } from '@/lib/subscription/context';
import { useLanguage } from '@/lib/i18n';

const DISMISS_KEY = 'sr_premium_banner_dismissed';
const FIRST_VISIT_KEY = 'sr_first_visit';

export function TrialBanner() {
  const { isFree, isPremium } = useSubscription();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Track first visit time so we only show after the user has used the app a bit
    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
    if (!firstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
      setDismissed(true);
      setReady(true);
      return;
    }

    // Show only after 2+ days of using the app
    const firstVisitDate = new Date(firstVisit);
    const daysSinceFirst = (Date.now() - firstVisitDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceFirst < 2) {
      setDismissed(true);
      setReady(true);
      return;
    }

    // Check if user already dismissed this session
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    setDismissed(wasDismissed);
    setReady(true);
  }, []);

  // Don't show for premium users, if dismissed, or not ready
  if (!ready || isPremium || dismissed || !isFree) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, 'true');
  };

  return (
    <div
      className="relative rounded-2xl p-4 mb-5 animate-fadeIn"
      style={{
        background: 'linear-gradient(135deg, rgba(107,127,94,0.08), rgba(107,127,94,0.04))',
        border: '1px solid rgba(107,127,94,0.15)',
      }}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label={t('Stäng', 'Close')}
      >
        <X className="w-3.5 h-3.5 text-muted" />
      </button>

      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(107,127,94,0.12)' }}
        >
          <Sparkles className="w-5 h-5 text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display text-sm text-primary mb-1">
            {t('Lås upp fler funktioner', 'Unlock more features')}
          </p>
          <p className="text-xs text-muted mb-3 leading-relaxed">
            {t(
              'Uppgradera till Premium när du är redo — AI-jurist, dokumentgenerering, PDF-export och mycket mer.',
              'Upgrade to Premium when you\'re ready — AI lawyer, document generation, PDF export and much more.'
            )}
          </p>
          <Link
            href="/priser"
            className="inline-flex items-center gap-1.5 text-xs font-display text-white px-4 py-2 rounded-full transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)',
            }}
          >
            <Sparkles className="w-3 h-3" />
            {t('Utforska Premium — 799 kr', 'Explore Premium — 799 kr')}
          </Link>
        </div>
      </div>
    </div>
  );
}
