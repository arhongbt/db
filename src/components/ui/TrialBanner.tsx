'use client';

import Link from 'next/link';
import { Clock, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '@/lib/subscription/context';
import { useLanguage } from '@/lib/i18n';

export function TrialBanner() {
  const { tier, trialDaysLeft, isTrialActive, isTrialExpired, isPaid } = useSubscription();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // Don't show for paid users or if dismissed
  if (isPaid || dismissed) return null;

  // Don't show if trial has plenty of time left (> 5 days)
  if (isTrialActive && trialDaysLeft > 5) return null;

  const isUrgent = isTrialExpired || trialDaysLeft <= 2;

  return (
    <div
      className="relative rounded-2xl p-4 mb-5 animate-fadeIn"
      style={{
        background: isUrgent
          ? 'linear-gradient(135deg, rgba(217,119,87,0.08), rgba(217,119,87,0.04))'
          : 'linear-gradient(135deg, rgba(107,127,94,0.08), rgba(107,127,94,0.04))',
        border: `1px solid ${isUrgent ? 'rgba(217,119,87,0.2)' : 'rgba(107,127,94,0.15)'}`,
      }}
    >
      {!isTrialExpired && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 transition-colors"
          aria-label={t('Stäng', 'Close')}
        >
          <X className="w-3.5 h-3.5 text-muted" />
        </button>
      )}

      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isUrgent
              ? 'rgba(217,119,87,0.12)'
              : 'rgba(107,127,94,0.12)',
          }}
        >
          {isTrialExpired ? (
            <Clock className="w-5 h-5" style={{ color: '#D97757' }} />
          ) : (
            <Sparkles className="w-5 h-5 text-accent" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display text-sm text-primary mb-1">
            {isTrialExpired
              ? t('Provperioden har gått ut', 'Trial has expired')
              : trialDaysLeft === 1
                ? t('1 dag kvar av provperioden', '1 day left of trial')
                : t(`${trialDaysLeft} dagar kvar av provperioden`, `${trialDaysLeft} days left of trial`)}
          </p>
          <p className="text-xs text-muted mb-3 leading-relaxed">
            {isTrialExpired
              ? t(
                  'Uppgradera för att fortsätta använda alla funktioner.',
                  'Upgrade to continue using all features.'
                )
              : t(
                  'Lås upp allt med Standard eller Pro när provperioden tar slut.',
                  'Unlock everything with Standard or Pro when your trial ends.'
                )}
          </p>
          <Link
            href="/priser"
            className="inline-flex items-center gap-1.5 text-xs font-display text-white px-4 py-2 rounded-full transition-all active:scale-[0.97]"
            style={{
              background: isUrgent
                ? 'linear-gradient(135deg, #D97757, #C4623E)'
                : 'linear-gradient(135deg, #6B7F5E, #5A6E4E)',
            }}
          >
            <Sparkles className="w-3 h-3" />
            {t('Se planer', 'See plans')}
          </Link>
        </div>
      </div>
    </div>
  );
}
