'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, Calculator, Info, Users, AlertTriangle } from 'lucide-react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { calculateInheritance } from '@/lib/arvskalkylator';
import type { FamilySituation } from '@/types';

function formatSEK(n: number): string {
  return n.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });
}

function ArvskalkylatorContent() {
  const { state } = useDodsbo();
  const { t } = useLanguage();

  const totalTillgangar = useMemo(() =>
    state.tillgangar.reduce((sum, t) => sum + (t.confirmedValue || t.estimatedValue || 0), 0),
    [state.tillgangar]
  );
  const totalSkulder = useMemo(() =>
    state.skulder.reduce((sum, s) => sum + (s.amount || 0), 0),
    [state.skulder]
  );
  const totalKostnader = useMemo(() =>
    state.kostnader.reduce((sum, k) => sum + (k.amount || 0), 0),
    [state.kostnader]
  );

  const [manualTillgangar, setManualTillgangar] = useState(totalTillgangar || 0);
  const [manualSkulder, setManualSkulder] = useState(totalSkulder || 0);
  const [manualKostnader, setManualKostnader] = useState(totalKostnader || 0);
  const [useManual, setUseManual] = useState(totalTillgangar === 0);

  const tillgangar = useManual ? manualTillgangar : totalTillgangar;
  const skulder = useManual ? manualSkulder : totalSkulder;
  const kostnader = useManual ? manualKostnader : totalKostnader;

  const delagareNames = state.delagare.map(d => ({ name: d.name, relation: d.relation }));
  const make = state.delagare.find(d => d.relation === 'make_maka');

  const result = useMemo(() =>
    calculateInheritance(
      state.onboarding.familySituation,
      tillgangar, skulder, kostnader,
      delagareNames,
      state.onboarding.hasTestamente,
      make?.name,
      t,
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.onboarding.familySituation, tillgangar, skulder, kostnader, delagareNames, state.onboarding.hasTestamente, make?.name, t]
  );

  const situationLabels: Record<FamilySituation, string> = {
    gift_med_gemensamma_barn: t('Gift med gemensamma barn', 'Married with shared children'),
    gift_med_sarkullebarn: t('Gift med särkullbarn', 'Married with separate children'),
    gift_utan_barn: t('Gift utan barn', 'Married without children'),
    ogift_med_barn: t('Ogift med barn', 'Unmarried with children'),
    sambo_med_barn: t('Sambo med barn', 'Cohabiting with children'),
    sambo_utan_barn: t('Sambo utan barn', 'Cohabiting without children'),
    ensamstaende_utan_barn: t('Ensamstående utan barn', 'Single without children'),
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="px-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> {t('Dashboard', 'Dashboard')}
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-display text-primary">{t('Arvskalkylator', 'Inheritance calculator')}</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          {t('Beräkna hur arvet fördelas baserat på familjesituation och tillgångar.', 'Calculate how the inheritance is distributed based on family situation and assets.')}
        </p>

        {/* Familjesituation */}
        <div className="card mb-4">
          <p className="text-xs text-muted mb-1">{t('Familjesituation', 'Family situation')}</p>
          <p className="font-semibold text-primary">
            {situationLabels[state.onboarding.familySituation]}
          </p>
          {state.delagare.length > 0 && (
            <p className="text-xs text-muted mt-1">
              {state.delagare.length} {t('dödsbodelägare registrerade', 'co-owners registered')}
            </p>
          )}
        </div>

        {/* Input: Tillgångar / Skulder */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-primary text-sm">{t('Ekonomisk översikt', 'Financial overview')}</p>
            {totalTillgangar > 0 && (
              <button
                onClick={() => setUseManual(!useManual)}
                className="text-xs text-accent hover:underline"
              >
                {useManual ? t('Använd registrerade värden', 'Use registered values') : t('Ange manuellt', 'Enter manually')}
              </button>
            )}
          </div>

          {useManual ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted">{t('Tillgångar (SEK)', 'Assets (SEK)')}</label>
                <input
                  type="number"
                  value={manualTillgangar || ''}
                  onChange={e => setManualTillgangar(Number(e.target.value) || 0)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-2xl text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-muted">{t('Skulder (SEK)', 'Debts (SEK)')}</label>
                <input
                  type="number"
                  value={manualSkulder || ''}
                  onChange={e => setManualSkulder(Number(e.target.value) || 0)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-2xl text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-muted">{t('Dödsbokostnader (SEK)', 'Estate costs (SEK)')}</label>
                <input
                  type="number"
                  value={manualKostnader || ''}
                  onChange={e => setManualKostnader(Number(e.target.value) || 0)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-2xl text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{t('Tillgångar', 'Assets')}</span>
                <span className="text-primary font-medium">{formatSEK(tillgangar)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{t('Skulder', 'Debts')}</span>
                <span className="text-warn font-medium">-{formatSEK(skulder)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{t('Kostnader', 'Costs')}</span>
                <span className="text-warn font-medium">-{formatSEK(kostnader)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
                <span className="text-primary">{t('Nettobehållning', 'Net value')}</span>
                <span className={result.nettoBehallning >= 0 ? 'text-success' : 'text-warn'}>
                  {formatSEK(result.nettoBehallning)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bodelning */}
        {result.bodelning && (
          <div className="card mb-4 rounded-2xl card-sage-gradient">
            <p className="font-display text-primary text-sm mb-2">{t('Bodelning (ÄktB 9-13 kap.)', 'Division of property (Marriage Code 9-13 ch.)')}</p>
            <p className="text-xs text-muted mb-3">
              {t('Giftorättsgods delas 50/50 mellan makarna innan arvet fördelas.', 'Community property is divided 50/50 between spouses before inheritance is distributed.')}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{t('Efterlevande makes andel', "Surviving spouse's share")}</span>
                <span className="text-primary font-medium">{formatSEK(result.bodelning.makeAndel)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{t('Dödsboets andel (att fördela)', 'Estate share (to distribute)')}</span>
                <span className="text-primary font-medium">{formatSEK(result.bodelning.dodsboAndel)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resultat: Arvsfördelning */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-accent" />
            <p className="font-display text-primary text-sm">{t('Arvsfördelning', 'Inheritance distribution')}</p>
          </div>

          <div className="space-y-3">
            {result.arvingar.map((a, i) => (
              <div key={i} className="border border-border rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-medium text-primary text-sm">{a.name}</p>
                    <p className="text-xs text-muted capitalize">{a.relation.replace('_', '/')}</p>
                  </div>
                  <div className="text-right">
                    {a.amount > 0 && (
                      <p className="font-semibold text-primary text-sm">{formatSEK(a.amount)}</p>
                    )}
                    {a.share > 0 && (
                      <p className="text-xs text-accent">{a.share}%</p>
                    )}
                  </div>
                </div>
                {a.note && (
                  <p className="text-xs text-muted mt-2 leading-relaxed bg-background rounded p-2">
                    {a.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Varningar */}
        {result.laglottWarning && (
          <div className="warning-box mb-4">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-warn shrink-0 mt-0.5" />
              <p className="text-xs text-primary leading-relaxed">{result.laglottWarning}</p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="info-box mb-6">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              {t('Kalkylatorn ger en uppskattning baserad på allmänna regler i ärvdabalken. Testamenten, äktenskapsförord och enskild egendom kan påverka fördelningen. Kontakta en jurist för bindande rådgivning.', 'The calculator provides an estimate based on general rules in the Inheritance Code. Wills, marriage agreements, and separate property can affect the distribution. Contact a lawyer for binding advice.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArvskalkylatorPage() {
  return (
    <DodsboProvider>
      <ArvskalkylatorContent />
    </DodsboProvider>
  );
}
