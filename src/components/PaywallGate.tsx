'use client';

import Link from 'next/link';
import { Lock, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/lib/subscription/context';
import { useLanguage } from '@/lib/i18n';
import type { PremiumFeature } from '@/types/dodsbo';

const FEATURE_LABELS: Record<PremiumFeature, { sv: string; en: string }> = {
  mikeRoss: { sv: 'AI-juristen Mike Ross', en: 'AI Lawyer Mike Ross' },
  bodelning: { sv: 'Bodelningsguiden', en: 'Property Division Wizard' },
  documentGeneration: { sv: 'Dokumentgenerering', en: 'Document Generation' },
  scanner: { sv: 'Dokumentskanner', en: 'Document Scanner' },
  bouppteckningPDF: { sv: 'Bouppteckning som PDF', en: 'Estate Inventory PDF' },
  arvskifteshandling: { sv: 'Arvskifteshandling', en: 'Inheritance Settlement' },
  exportera: { sv: 'Exportera dokument', en: 'Export Documents' },
  advancedGuides: { sv: 'Avancerade guider', en: 'Advanced Guides' },
};

interface PaywallGateProps {
  feature: PremiumFeature;
  children: React.ReactNode;
  /** If true, show a compact inline lock instead of full-page paywall */
  inline?: boolean;
}

export function PaywallGate({ feature, children, inline = false }: PaywallGateProps) {
  const { canAccess, tier, trialDaysLeft, isTrialExpired } = useSubscription();
  const { t } = useLanguage();

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  const label = FEATURE_LABELS[feature];
  const featureName = t(label.sv, label.en);

  if (inline) {
    return (
      <div
        className="relative rounded-2xl p-4 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(107,127,94,0.04), rgba(107,127,94,0.08))',
          border: '1px solid rgba(107,127,94,0.15)',
        }}
      >
        <Lock className="w-5 h-5 text-accent mx-auto mb-2" />
        <p className="font-display text-sm text-primary mb-1">
          {t('Pro-funktion', 'Pro Feature')}
        </p>
        <p className="text-xs text-muted mb-3">
          {t(`Uppgradera till Pro för att använda ${featureName}.`, `Upgrade to Pro to use ${featureName}.`)}
        </p>
        <Link
          href="/priser"
          className="inline-flex items-center gap-1.5 text-xs font-display text-accent hover:text-accent-dark transition-colors"
        >
          {t('Se planer', 'See plans')}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  // Full-page paywall
  return (
    <div className="min-h-dvh bg-background pb-28">
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-12rem)] px-6">
        <div
          className="w-full max-w-sm text-center"
        >
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(107,127,94,0.08), rgba(107,127,94,0.15))',
            }}
          >
            {isTrialExpired ? (
              <Clock className="w-9 h-9 text-accent" />
            ) : (
              <Lock className="w-9 h-9 text-accent" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-display text-primary mb-3">
            {isTrialExpired
              ? t('Din provperiod har gått ut', 'Your trial has expired')
              : t('Pro-funktion', 'Pro Feature')}
          </h1>

          {/* Description */}
          <p className="text-muted text-sm mb-2 leading-relaxed">
            {isTrialExpired
              ? t(
                  `${featureName} ingår i Pro-planen. Din 7-dagars provperiod har avslutats.`,
                  `${featureName} is included in the Pro plan. Your 7-day trial has ended.`
                )
              : t(
                  `${featureName} är en Pro-funktion. Uppgradera för att låsa upp.`,
                  `${featureName} is a Pro feature. Upgrade to unlock.`
                )}
          </p>

          {tier === 'standard' && (
            <p className="text-xs text-muted mb-6">
              {t(
                'Du har Standard-planen. Uppgradera till Pro för full tillgång.',
                'You have the Standard plan. Upgrade to Pro for full access.'
              )}
            </p>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3 mt-6">
            <Link
              href="/priser"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-white font-display text-sm transition-all active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)',
                boxShadow: '0 4px 16px rgba(107,127,94,0.3)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              {t('Uppgradera till Pro', 'Upgrade to Pro')}
            </Link>

            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              {t('Tillbaka till dashboard', 'Back to dashboard')}
            </Link>
          </div>

          {/* Feature highlights */}
          <div
            className="mt-8 p-4 rounded-2xl text-left"
            style={{
              background: 'rgba(107,127,94,0.04)',
              border: '1px solid rgba(107,127,94,0.1)',
            }}
          >
            <p className="font-display text-xs text-accent mb-3 uppercase tracking-wide">
              {t('Pro inkluderar', 'Pro includes')}
            </p>
            <ul className="space-y-2">
              {[
                t('AI-juristen Mike Ross (obegränsat)', 'AI Lawyer Mike Ross (unlimited)'),
                t('Bodelningsguiden', 'Property Division Wizard'),
                t('Generera bouppteckning som PDF', 'Generate estate inventory as PDF'),
                t('Dokumentskanner med OCR', 'Document scanner with OCR'),
                t('Exportera alla dokument', 'Export all documents'),
                t('Arvskifteshandling', 'Inheritance settlement document'),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-primary">
                  <Sparkles className="w-3 h-3 text-accent flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
