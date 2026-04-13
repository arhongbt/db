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

        {/* Vår egen våg-hero (ersätter widgetens bild + rubrik) */}
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
              'Välj en tid som passar dig. En erfaren jurist går igenom dödsboet med dig — digitalt via video.',
              'Choose a time that suits you. An experienced lawyer will review the estate with you — digitally via video.'
            )}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted">
            <span className="font-semibold" style={{ color: '#6B7F5E' }}>
              {t('Gratis', 'Free')}
            </span>
            <span>·</span>
            <span>{t('30 minuter', '30 minutes')}</span>
            <span>·</span>
            <span>{t('Digitalt', 'Online')}</span>
          </div>
        </div>
      </div>

      {/* Vad ingår */}
      <div className="px-6 mb-6">
        <div
          className="rounded-2xl border p-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-semibold text-primary text-sm mb-3">
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

      {/* Elfsight widget — rubrik och bild dolda via CSS-klippning */}
      <div className="px-6">
        <h2 className="text-lg font-bold text-primary mb-3">
          {t('Välj en tid nedan', 'Pick a time below')}
        </h2>

        {/*
          CSS-trick: vi sveper widgeten i en wrapper med overflow:hidden,
          och pushar widgeten uppåt med negativ margin-top så att
          Elfsights eget service-card-header (bild + "Gratis Juridisk rådgivning")
          klipps bort. Justera --crop-top om Elfsight ändrar sin layout.
        */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="elfsight-crop-wrapper">
            <Script
              src="https://static.elfsight.com/platform/platform.js"
              strategy="lazyOnload"
            />
            <div
              className="elfsight-app-5b0d7d76-3025-4851-b668-95a83cd58a0e"
              data-elfsight-app-lazy
            />
          </div>
        </div>

        <p className="text-xs text-muted text-center mt-3 leading-relaxed">
          {t(
            'Bokningen synkas direkt med juristens kalender. Du får en bekräftelse på mejl med möteslänk.',
            'Booking syncs directly with the lawyer\u2019s calendar. You\u2019ll receive a confirmation email with the meeting link.'
          )}
        </p>
      </div>

      {/* Inline-styles för CSS-klippning av Elfsight-headern */}
      <style jsx global>{`
        .elfsight-crop-wrapper {
          --crop-top: 150px;
          position: relative;
          overflow: hidden;
          padding-top: 8px;
        }
        .elfsight-crop-wrapper > .elfsight-app-5b0d7d76-3025-4851-b668-95a83cd58a0e {
          margin-top: calc(var(--crop-top) * -1);
          padding-top: var(--crop-top);
        }
        /* På små skärmar — mindre crop eftersom layouten är kompaktare */
        @media (max-width: 640px) {
          .elfsight-crop-wrapper {
            --crop-top: 120px;
          }
        }
      `}</style>

      <BottomNav />
    </main>
  );
}
