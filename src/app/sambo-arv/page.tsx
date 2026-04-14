'use client';

import Link from 'next/link';
import { ArrowLeft, Users, ChevronRight, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function SamboArvPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-8 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <h1 className="text-xl font-display text-primary">{t('Sambo och arv', 'Cohabiting Partner and Inheritance')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Warning Box */}
        <div className="border rounded-lg p-4 flex gap-3" style={{ background: 'var(--accent-soft)', borderColor: 'var(--border)' }}>
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-primary mb-1">{t('Viktigt att veta', 'Important to Know')}</p>
            <p className="text-sm text-primary">
              {t('Sambor ärver inte varandra automatiskt. Utan testamente får den överlevande sambons partner ingenting från dödsboet.', 'Cohabiting partners do not inherit from each other automatically. Without a will, the surviving partner gets nothing from the estate.')}
            </p>
          </div>
        </div>

        {/* Introduction Card */}
        <div className="border border-border rounded-[28px] p-5 space-y-3" style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-primary mb-2">Sambo är inte gift</h2>
              <p className="text-sm text-muted mb-3">
                Sambolagen reglerar inte arv mellan sambor. Till skillnad från gifta par, som automatiskt ärver varandra enligt ärvdabalken, måste sambor genomföra särskilda åtgärder för att den överlevande ska få något från dödsboet.
              </p>
            </div>
          </div>
        </div>

        {/* Key Points Card */}
        <div className="border border-border rounded-[28px] overflow-hidden" style={{ background: 'var(--bg-card)' }}>
          <div className="bg-secondary px-5 py-3 border-b border-border">
            <h3 className="font-display text-primary">De viktigaste reglerna</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-accent">1</span>
              </div>
              <div>
                <p className="font-medium text-primary mb-1">Sambolagen omfattar begränsat</p>
                <p className="text-sm text-muted">
                  Sambolagen reglerar endast det gemensamma hemmet och hushållens möbler och inventarier. Allt annat är helt oreglerat.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-accent">2</span>
              </div>
              <div>
                <p className="font-medium text-primary mb-1">Testamente är nödvändigt</p>
                <p className="text-sm text-muted">
                  För att en sambo ska kunna ärva från en annan sambo krävs ett giltigt testamente. Utan testamente följs ärvdabalkens regler, vilket innebär att endast lagliga arvingar (barn, föräldrar, syskon) kan ärva.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-accent">3</span>
              </div>
              <div>
                <p className="font-medium text-primary mb-1">Bodelning är möjlig</p>
                <p className="text-sm text-muted">
                  En sambo kan begära bodelning av det gemensamma hemmet och gemensamma möbler. Detta är oftast en viktig rättighet för den överlevande.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Without Will */}
        <div className="border rounded-[28px] p-5 space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h3 className="font-display text-primary flex items-center gap-2">
            <span>Utan testamente</span>
            <ChevronRight className="w-4 h-4 text-muted" />
          </h3>
          <div className="rounded p-4 space-y-3 text-sm" style={{ background: 'var(--bg)' }}>
            <p className="text-muted">
              Om en sambo dör utan testamente gäller ärvdabalkens regler:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="text-muted">
                • Den andre sambos partner får ingenting från dödsboet
              </li>
              <li className="text-muted">
                • Barnen (oavsett om de är gemensamma) ärver i första hand
              </li>
              <li className="text-muted">
                • Utan barn ärver föräldrarna, och sedan syskon
              </li>
              <li className="text-muted">
                • Bodelning kan krävas för det gemensamma hemmet
              </li>
            </ul>
          </div>
        </div>

        {/* What Happens With Will */}
        <div className="border rounded-[28px] p-5 space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h3 className="font-display text-primary flex items-center gap-2">
            <span>Med testamente</span>
            <ChevronRight className="w-4 h-4 text-muted" />
          </h3>
          <div className="rounded p-4 space-y-3 text-sm" style={{ background: 'var(--bg)' }}>
            <p className="text-muted">
              Med ett korrekt upprättat testamente kan sambor:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="text-muted">
                • Bestämma att den andra sambos partner får hela eller del av dödsboet
              </li>
              <li className="text-muted">
                • Skipa över lagliga arvingar (så långt som möjligt)
              </li>
              <li className="text-muted">
                • Förordna båtnavern för att försvara testamentet
              </li>
              <li className="text-muted">
                • Säkerställa att önskemål om begravning fullföljds
              </li>
            </ul>
          </div>
        </div>

        {/* Bodelning Card */}
        <div className="border rounded-[28px] p-5 space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h3 className="font-display text-primary">Sambors rätt till bodelning</h3>
          <p className="text-sm text-muted">
            Även utan testamente har en sambo rätt att kräva bodelning av:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded p-3" style={{ background: 'var(--bg)' }}>
              <p className="font-medium text-sm text-primary mb-1">Det gemensamma hemmet</p>
              <p className="text-xs text-muted">Fastighet eller lägenhet som ägs gemensamt</p>
            </div>
            <div className="rounded p-3" style={{ background: 'var(--bg)' }}>
              <p className="font-medium text-sm text-primary mb-1">Möbler & inredning</p>
              <p className="text-xs text-muted">Hushållets möbler och inventarier</p>
            </div>
          </div>
          <p className="text-xs text-muted border rounded p-3" style={{ background: 'var(--accent-soft)', borderColor: 'var(--border)' }}>
            Bodelning måste påkrävas senast tre år efter dödfallet. Därefter förlorar den överlevande rättigheten.
          </p>
        </div>

        {/* Difference from Married */}
        <div className="border rounded-[28px] p-5 space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h3 className="font-display text-primary">Sambo vs. Gift — skillnaden</h3>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded p-3" style={{ background: 'var(--bg)' }}>
                <p className="font-semibold text-primary mb-2">Gifta</p>
                <ul className="space-y-1 text-muted">
                  <li>✓ Ärvningsrätt automatisk</li>
                  <li>✓ Ärvningsrätt utan testamente</li>
                  <li>✓ Jämkningsrätt</li>
                  <li>✓ Försörjningsrätt</li>
                </ul>
              </div>
              <div className="rounded p-3" style={{ background: 'var(--bg)' }}>
                <p className="font-semibold text-primary mb-2">Sambor</p>
                <ul className="space-y-1 text-muted">
                  <li>✗ Ingen automatisk ärvningsrätt</li>
                  <li>✗ Testamente är obligatoriskt</li>
                  <li>✗ Ingen jämkningsrätt</li>
                  <li>✓ Rätt till bodelning (begränsad)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="border border-border rounded-[28px] overflow-hidden" style={{ background: 'var(--bg-card)' }}>
          <div className="bg-secondary px-5 py-3 border-b border-border">
            <h3 className="font-display text-primary">Vanliga frågor</h3>
          </div>
          <div className="divide-y divide-border">
            <div className="p-5 space-y-2">
              <p className="font-medium text-primary text-sm">Kan vi skriva ett gemensamt testamente?</p>
              <p className="text-sm text-muted">
                Ja, sambor kan skriva ett ömsesidigt testamente där båda åtar sig att göra varandra sina huvudarvingar. Detta är mycket vanligt och rekommenderas starkt.
              </p>
            </div>
            <div className="p-5 space-y-2">
              <p className="font-medium text-primary text-sm">Vad kostar det att göra testamente?</p>
              <p className="text-sm text-muted">
                Ett enkelt handskrivet testamente kostar inget, men det måste vara korrekt utformat för att vara giltigt. Vi rekommenderar att kontakta en jurist för att säkerställa att testamentet är juridiskt korrekt.
              </p>
            </div>
            <div className="p-5 space-y-2">
              <p className="font-medium text-primary text-sm">Kan vi ändra testamentet senare?</p>
              <p className="text-sm text-muted">
                Ja, ett testamente kan alltid ändras eller återkallas. Det är viktigt att uppdatera testamentet om livsomständigheterna förändras, till exempel om ni får barn eller separeras.
              </p>
            </div>
            <div className="p-5 space-y-2">
              <p className="font-medium text-primary text-sm">Vad händer med vår gemensamma bostad?</p>
              <p className="text-sm text-muted">
                Om den gemensamma bostaden ägs gemensamt kan den överlevande begära bodelning. Om den ägs av den avlidne gäller testamentet — utan testamente får den överlevande inte automatiskt huset.
              </p>
            </div>
            <div className="p-5 space-y-2">
              <p className="font-medium text-primary text-sm">Ska vi gifta oss istället?</p>
              <p className="text-sm text-muted">
                Det är helt upp till er. Om ni vill ha samma juridiska skydd kring arv och försörjning är äktenskap ett alternativ. Men ett väl utformat testamente löser många av sambor-problemerna.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <Link href="/juridisk-hjalp" className="block">
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-5 hover:border-accent/40 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary mb-1">Behöver du juridisk hjälp?</h3>
                <p className="text-sm text-muted">Vi hjälper dig att göra testamente och planera för framtiden</p>
              </div>
              <ChevronRight className="w-5 h-5 text-accent flex-shrink-0" />
            </div>
          </div>
        </Link>

        {/* Legal Disclaimer */}
        <div className="text-xs text-muted rounded-[20px] p-4 border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
          <p className="font-medium mb-1">Juridisk ansvarsfriskrivning</p>
          <p>
            Denna information är endast för allmän vägledning och utgör inte juridisk rådgivning. Reglerna kring samboarv kan vara komplexa och individuell situation spelar stor roll. Vi rekommenderar att du kontaktar en jurist för personlig rådgivning angående ditt specifika fall.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
    </div>
  );
}
