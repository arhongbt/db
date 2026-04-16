'use client';

import Script from 'next/script';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ArrowLeft, Scale, CheckCircle2 } from 'lucide-react';

export default function BokaJuristPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-[calc(100dvh-5rem)] pb-28" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <Link
          href="/juridisk-hjalp"
          className="inline-flex items-center gap-1 text-muted mb-6 text-sm rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>

        {/* Vår egen våg-hero (ersätter widgetens bild + rubrik) */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
          >
            <Scale className="w-10 h-10 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-xl font-display text-primary leading-tight">
            {t('Boka juristkonsultation', 'Book a lawyer consultation')}
          </h1>
          <p className="text-sm text-muted mt-2 leading-relaxed max-w-md">
            {t(
              'Välj en tid som passar dig. En erfaren jurist går igenom dödsboet med dig — digitalt via video.',
              'Choose a time that suits you. An experienced lawyer will review the estate with you — digitally via video.'
            )}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted">
            <span className="font-semibold" style={{ color: '#6B7F5E' }}>
              {t('Gratis', 'Free')}
            </span>
            <span>·</span>
            <span>{t('1 timme', '1 hour')}</span>
            <span>·</span>
            <span>{t('Digitalt', 'Online')}</span>
          </div>
        </div>
      </div>

      {/* Vad ingår */}
      <div className="px-6 mb-6">
        <div
          className="rounded-2xl border p-4"
          style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}
        >
          <h3 className="font-display text-primary text-sm mb-3">
            {t('Vad ingår i mötet?', 'What\u2019s included?')}
          </h3>
          <ul className="space-y-2">
            {[
              t('Genomgång av bouppteckning och arvsordning', 'Review of estate inventory and inheritance order'),
              t('Rådgivning kring bodelning och särkullbarn', 'Advice on property division and stepchildren'),
              t('Frågor om testamente och fullmakter', 'Questions on wills and powers of attorney'),
              t('Vid behov: hjälp med internationella arv och företag', 'If needed: help with international estates and businesses'),
              t('Sammanfattning och nästa steg via mejl', 'Summary and next steps via email'),
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6B7F5E' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Elfsight widget — visar juristens riktiga kalender */}
      <div className="px-6">
        <h2 className="text-lg font-display text-primary mb-3">
          {t('Välj en tid nedan', 'Pick a time below')}
        </h2>

        <div
          className="rounded-2xl border overflow-hidden p-2"
          style={{ borderRadius: '28px', background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <Script
            src="https://static.elfsight.com/platform/platform.js"
            strategy="lazyOnload"
          />
          <div
            className="elfsight-app-5b0d7d76-3025-4851-b668-95a83cd58a0e"
            data-elfsight-app-lazy
          />
        </div>

        <p className="text-xs text-muted text-center mt-3 leading-relaxed">
          {t(
            'Bokningen synkas direkt med juristens kalender. Du får en bekräftelse på mejl med möteslänk.',
            'Booking syncs directly with the lawyer\u2019s calendar. You\u2019ll receive a confirmation email with the meeting link.'
          )}
        </p>
      </div>

    </main>
  );
}
