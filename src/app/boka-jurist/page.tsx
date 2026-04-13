'use client';

import Script from 'next/script';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { BottomNav } from '@/components/ui/BottomNav';
import { ArrowLeft, Scale, CheckCircle2 } from 'lucide-react';

export default function BokaJuristPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh pb-28" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <Link
          href="/juridisk-hjalp"
          className="inline-flex items-center gap-1 text-muted mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>

        {/* V\u00e5g-ikon som hero */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}
          >
            <Scale className="w-10 h-10 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-bold text-primary leading-tight">
            {t('Boka juristkonsultation', 'Book a lawyer consultation')}
          </h1>
          <p className="text-sm text-muted mt-2 leading-relaxed max-w-md">
            {t(
              'V\u00e4lj en tid som passar dig. En erfaren jurist g\u00e5r igenom d\u00f6dsboet med dig \u2014 digitalt via video.',
              'Choose a time that suits you. An experienced lawyer will review the estate with you \u2014 digitally via video.'
            )}
          </p>
        </div>
      </div>

      {/* What you get */}
      <div className="px-6 mb-6">
        <div
          className="rounded-2xl border p-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-semibold text-primary text-sm mb-3">
            {t('Vad ing\u00e5r i m\u00f6tet?', 'What\u2019s included?')}
          </h3>
          <ul className="space-y-2">
            {[
              t('Genomg\u00e5ng av bouppteckning och arvsordning', 'Review of estate inventory and inheritance order'),
              t('R\u00e5dgivning kring bodelning och s\u00e4rkullbarn', 'Advice on property division and stepchildren'),
              t('Fr\u00e5gor om testamente och fullmakter', 'Questions on wills and powers of attorney'),
              t('Vid behov: hj\u00e4lp med internationella arv och f\u00f6retag', 'If needed: help with international estates and businesses'),
              t('Sammanfattning och n\u00e4sta steg via mejl', 'Summary and next steps via email'),
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6B7F5E' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Elfsight booking widget */}
      <div className="px-6">
        <h2 className="text-lg font-bold text-primary mb-3">
          {t('V\u00e4lj en tid nedan', 'Pick a time below')}
        </h2>
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="p-2">
            {/* Elfsight platform script — loaded once on this page */}
            <Script
              src="https://static.elfsight.com/platform/platform.js"
              strategy="lazyOnload"
            />
            {/* Elfsight booking widget container */}
            <div
              className="elfsight-app-5b0d7d76-3025-4851-b668-95a83cd58a0e"
              data-elfsight-app-lazy
            />
          </div>
        </div>

        <p className="text-xs text-muted text-center mt-3 leading-relaxed">
          {t(
            'Bokningen hanteras av v\u00e5r juristpartner via Google Calendar. Du f\u00e5r en bekr\u00e4ftelse p\u00e5 mejl med l\u00e4nk till m\u00f6tet.',
            'Booking is handled by our lawyer partner via Google Calendar. You\u2019ll get a confirmation email with the meeting link.'
          )}
        </p>
      </div>

      <BottomNav />
    </main>
  );
}
