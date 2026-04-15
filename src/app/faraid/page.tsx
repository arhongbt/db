'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import {
  ArrowLeft, Calculator, Info, Users, AlertTriangle, ChevronDown, ChevronUp,
  Scale, BookOpen, Plus, Minus, Sparkles, Check, X,
} from 'lucide-react';
import {
  calculateFaraid, HEIR_DEFINITIONS, formatFraction,
  type HeirId, type HeirInput, type FaraidInput, type FaraidResult, type HeirCategory,
} from '@/lib/faraid';

// ─── Heir category config ──────────────────────────────────

interface CategoryConfig {
  key: HeirCategory;
  sv: string;
  en: string;
  heirs: HeirId[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'spouse',
    sv: 'Make/Maka',
    en: 'Spouse',
    heirs: ['husband', 'wife'],
  },
  {
    key: 'children',
    sv: 'Barn',
    en: 'Children',
    heirs: ['son', 'daughter'],
  },
  {
    key: 'grandchildren',
    sv: 'Barnbarn',
    en: 'Grandchildren',
    heirs: ['sonsSon', 'sonsDaughter'],
  },
  {
    key: 'parents',
    sv: 'Föräldrar',
    en: 'Parents',
    heirs: ['father', 'mother'],
  },
  {
    key: 'grandparents',
    sv: 'Far-/Morföräldrar',
    en: 'Grandparents',
    heirs: ['grandfather', 'grandmotherMaternal', 'grandmotherPaternal'],
  },
  {
    key: 'fullSiblings',
    sv: 'Helsyskon',
    en: 'Full Siblings',
    heirs: ['fullBrother', 'fullSister'],
  },
  {
    key: 'paternalHalfSiblings',
    sv: 'Halvsyskon (far)',
    en: 'Paternal Half-Siblings',
    heirs: ['paternalBrother', 'paternalSister'],
  },
  {
    key: 'maternalHalfSiblings',
    sv: 'Halvsyskon (mor)',
    en: 'Maternal Half-Siblings',
    heirs: ['maternalBrother', 'maternalSister'],
  },
];

// ─── Main Component ────────────────────────────────────────

export default function FaraidPage() {
  const { t, language } = useLanguage();

  // Form state
  const [heirCounts, setHeirCounts] = useState<Partial<Record<HeirId, number>>>({});
  const [estateValue, setEstateValue] = useState<string>('');
  const [debts, setDebts] = useState<string>('');
  const [wasiyyah, setWasiyyah] = useState<string>('');
  const [showSteps, setShowSteps] = useState(false);
  const [calculated, setCalculated] = useState(false);

  // Derived
  const activeHeirs: HeirInput[] = useMemo(() => {
    return Object.entries(heirCounts)
      .filter(([, count]) => count && count > 0)
      .map(([id, count]) => ({ id: id as HeirId, count: count! }));
  }, [heirCounts]);

  const result: FaraidResult | null = useMemo(() => {
    if (!calculated || activeHeirs.length === 0) return null;
    const input: FaraidInput = {
      heirs: activeHeirs,
      estateValue: parseFloat(estateValue) || 0,
      debts: parseFloat(debts) || 0,
      waspiqa: parseFloat(wasiyyah) || 0,
    };
    return calculateFaraid(input);
  }, [calculated, activeHeirs, estateValue, debts, wasiyyah]);

  // Handlers
  const updateCount = (id: HeirId, delta: number) => {
    setHeirCounts(prev => {
      const current = prev[id] || 0;
      const max = HEIR_DEFINITIONS[id].maxCount;
      const next = Math.max(0, Math.min(max, current + delta));
      const copy = { ...prev };
      if (next === 0) {
        delete copy[id];
      } else {
        copy[id] = next;
      }
      return copy;
    });
    setCalculated(false);
  };

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleReset = () => {
    setHeirCounts({});
    setEstateValue('');
    setDebts('');
    setWasiyyah('');
    setCalculated(false);
    setShowSteps(false);
  };

  const hasAnyHeirs = activeHeirs.length > 0;
  const hasEstateValue = parseFloat(estateValue) > 0;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.08), rgba(107,127,94,0.15))' }}
            >
              <Scale className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-primary">
                {t('Islamisk Arvsrätt', 'Islamic Inheritance')}
              </h1>
              <p className="text-xs text-muted mt-0.5">
                {t('حساب الفرائض — Faraid-kalkylator', 'حساب الفرائض — Faraid Calculator')}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            {t(
              'Beräkna arvsfördelning enligt islamisk lag (Shariah). Baserad på det saudiska officiella systemet (hanbali madhab, jumhur-positioner).',
              'Calculate inheritance distribution according to Islamic law (Shariah). Based on the Saudi Arabian official system (Hanbali madhab, jumhur positions).',
            )}
          </p>
        </div>

        {/* ─── Step 1: Heir Selection ────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display text-primary">
              {t('1. Välj arvingar', '1. Select Heirs')}
            </h2>
          </div>

          <div className="space-y-4">
            {CATEGORIES.map(cat => (
              <div
                key={cat.key}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(107,127,94,0.03)',
                  border: '1px solid rgba(107,127,94,0.1)',
                }}
              >
                <div className="px-4 py-2.5">
                  <p className="text-xs font-display text-accent uppercase tracking-wide">
                    {language === 'sv' ? cat.sv : cat.en}
                  </p>
                </div>
                <div className="px-4 pb-3 space-y-2">
                  {cat.heirs.map(heirId => {
                    const def = HEIR_DEFINITIONS[heirId];
                    const count = heirCounts[heirId] || 0;
                    return (
                      <div key={heirId} className="flex items-center justify-between py-1.5">
                        <div>
                          <span className="text-sm text-primary">
                            {language === 'sv' ? def.swedish : def.english}
                          </span>
                          <span className="text-xs text-muted ml-2">{def.arabic}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCount(heirId, -1)}
                            disabled={count === 0}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-accent disabled:opacity-30 transition-opacity"
                            style={{ background: 'rgba(107,127,94,0.1)' }}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-display text-primary">
                            {count}
                          </span>
                          <button
                            onClick={() => updateCount(heirId, 1)}
                            disabled={count >= def.maxCount}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-accent disabled:opacity-30 transition-opacity"
                            style={{ background: 'rgba(107,127,94,0.1)' }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Step 2: Estate Value ──────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display text-primary">
              {t('2. Kvarlåtenskap', '2. Estate Value')}
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted mb-1 block">
                {t('Total kvarlåtenskap (kr)', 'Total estate value (SEK)')}
              </label>
              <input
                type="number"
                value={estateValue}
                onChange={e => { setEstateValue(e.target.value); setCalculated(false); }}
                placeholder="1 000 000"
                className="w-full px-4 py-3 rounded-xl text-sm bg-white text-primary placeholder:text-muted/50"
                style={{ border: '1px solid rgba(107,127,94,0.15)' }}
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">
                {t('Skulder (kr)', 'Debts (SEK)')}
              </label>
              <input
                type="number"
                value={debts}
                onChange={e => { setDebts(e.target.value); setCalculated(false); }}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl text-sm bg-white text-primary placeholder:text-muted/50"
                style={{ border: '1px solid rgba(107,127,94,0.15)' }}
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">
                {t('Testamente / Wasiyyah (max 1/3)', 'Bequest / Wasiyyah (max 1/3)')}
              </label>
              <input
                type="number"
                value={wasiyyah}
                onChange={e => { setWasiyyah(e.target.value); setCalculated(false); }}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl text-sm bg-white text-primary placeholder:text-muted/50"
                style={{ border: '1px solid rgba(107,127,94,0.15)' }}
              />
            </div>
          </div>

          {/* Info box */}
          <div
            className="mt-3 p-3 rounded-xl flex gap-2"
            style={{ background: 'rgba(107,127,94,0.05)', border: '1px solid rgba(107,127,94,0.08)' }}
          >
            <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              {t(
                'Skulder (inklusive obetalad zakat) och testamente dras av före arvsfördelningen. Testamente begränsas till 1/3 av kvarlåtenskapen (إجماع).',
                'Debts (including unpaid zakat) and bequests are deducted before inheritance distribution. Bequests are limited to 1/3 of the estate (ijma\').',
              )}
            </p>
          </div>
        </section>

        {/* ─── Calculate Button ──────────────────────────── */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleCalculate}
            disabled={!hasAnyHeirs || !hasEstateValue}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-display text-sm transition-all active:scale-[0.97] disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)',
              boxShadow: '0 4px 16px rgba(107,127,94,0.3)',
            }}
          >
            <Calculator className="w-4 h-4" />
            {t('Beräkna arv', 'Calculate Inheritance')}
          </button>
          {(hasAnyHeirs || estateValue) && (
            <button
              onClick={handleReset}
              className="px-4 py-3.5 rounded-full text-sm text-muted hover:text-primary transition-colors"
              style={{ border: '1px solid rgba(107,127,94,0.15)' }}
            >
              {t('Rensa', 'Reset')}
            </button>
          )}
        </div>

        {/* ─── Results ───────────────────────────────────── */}
        {result && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-display text-primary">
                {t('Arvsfördelning', 'Inheritance Distribution')}
              </h2>
            </div>

            {/* Warnings */}
            {result.warnings.map((w, i) => (
              <div
                key={i}
                className="mb-3 p-3 rounded-xl flex gap-2"
                style={{
                  background: w.type === 'info'
                    ? 'rgba(107,127,94,0.05)'
                    : 'rgba(234,179,8,0.08)',
                  border: `1px solid ${w.type === 'info' ? 'rgba(107,127,94,0.1)' : 'rgba(234,179,8,0.2)'}`,
                }}
              >
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80 leading-relaxed">
                  {language === 'sv' ? w.messageSv : w.messageEn}
                </p>
              </div>
            ))}

            {/* Estate summary */}
            <div
              className="mb-4 p-4 rounded-2xl"
              style={{ background: 'rgba(107,127,94,0.04)', border: '1px solid rgba(107,127,94,0.1)' }}
            >
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted">
                  <span>{t('Total kvarlåtenskap', 'Total estate')}</span>
                  <span>{(parseFloat(estateValue) || 0).toLocaleString('sv-SE')} kr</span>
                </div>
                {(parseFloat(debts) || 0) > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>− {t('Skulder', 'Debts')}</span>
                    <span>{(parseFloat(debts) || 0).toLocaleString('sv-SE')} kr</span>
                  </div>
                )}
                {result.wasiyyahPaid > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>− {t('Testamente', 'Bequest')}</span>
                    <span>{result.wasiyyahPaid.toLocaleString('sv-SE')} kr</span>
                  </div>
                )}
                <div className="border-t pt-1.5 flex justify-between font-display text-primary" style={{ borderColor: 'rgba(107,127,94,0.15)' }}>
                  <span>{t('Arvbar kvarlåtenskap', 'Inheritable estate')}</span>
                  <span>{result.inheritableEstate.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>
            </div>

            {/* Distribution table */}
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{ border: '1px solid rgba(107,127,94,0.12)' }}
            >
              {result.heirs
                .filter(h => h.basis !== 'excluded')
                .sort((a, b) => b.sharePercentage - a.sharePercentage)
                .map((heir, i) => {
                  const def = HEIR_DEFINITIONS[heir.id];
                  return (
                    <div
                      key={heir.id}
                      className="px-4 py-3 flex items-center justify-between"
                      style={{
                        background: i % 2 === 0 ? 'white' : 'rgba(107,127,94,0.02)',
                        borderBottom: '1px solid rgba(107,127,94,0.06)',
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-display text-primary">
                            {language === 'sv' ? def.swedish : def.english}
                            {heir.count > 1 && (
                              <span className="text-muted ml-1">×{heir.count}</span>
                            )}
                          </span>
                          <span className="text-[10px] text-muted/60">{def.arabic}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-accent font-display">
                            {formatFraction(heir.shareFraction)}
                          </span>
                          <span className="text-[10px] text-muted">
                            ({heir.sharePercentage.toFixed(1)}%)
                          </span>
                          {heir.basis === 'fard' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">فرض</span>
                          )}
                          {heir.basis === 'asaba' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">عصبة</span>
                          )}
                          {heir.basis === 'fard+asaba' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600">فرض+عصبة</span>
                          )}
                          {heir.basis === 'radd' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600">رد</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-display text-primary">
                          {heir.totalAmount.toLocaleString('sv-SE')} kr
                        </p>
                        {heir.count > 1 && (
                          <p className="text-[10px] text-muted">
                            {heir.perPersonAmount.toLocaleString('sv-SE')} kr/{t('person', 'person')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* Excluded heirs */}
              {result.heirs.filter(h => h.basis === 'excluded').length > 0 && (
                <div className="px-4 py-2.5" style={{ background: 'rgba(239,68,68,0.03)' }}>
                  <p className="text-[10px] font-display text-red-400 uppercase tracking-wide mb-1">
                    {t('Uteslutna (حجب)', 'Excluded (Hajb)')}
                  </p>
                  {result.heirs
                    .filter(h => h.basis === 'excluded')
                    .map(heir => {
                      const def = HEIR_DEFINITIONS[heir.id];
                      const excluderDef = heir.excludedBy ? HEIR_DEFINITIONS[heir.excludedBy] : null;
                      return (
                        <div key={heir.id} className="flex items-center gap-2 py-0.5">
                          <X className="w-3 h-3 text-red-400" />
                          <span className="text-xs text-muted line-through">
                            {language === 'sv' ? def.swedish : def.english}
                          </span>
                          {excluderDef && (
                            <span className="text-[10px] text-muted">
                              {t('av', 'by')} {language === 'sv' ? excluderDef.swedish : excluderDef.english}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Total */}
              <div
                className="px-4 py-3 flex justify-between font-display"
                style={{ background: 'rgba(107,127,94,0.06)' }}
              >
                <span className="text-sm text-primary">{t('Totalt fördelat', 'Total distributed')}</span>
                <span className="text-sm text-primary">
                  {result.totalDistributed.toLocaleString('sv-SE')} kr
                </span>
              </div>
            </div>

            {/* Calculation steps (collapsible) */}
            {result.steps.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center gap-2 text-xs text-accent hover:text-accent-dark transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {t('Visa beräkningssteg', 'Show calculation steps')}
                  {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showSteps && (
                  <div
                    className="mt-2 p-3 rounded-xl space-y-1.5"
                    style={{ background: 'rgba(107,127,94,0.03)', border: '1px solid rgba(107,127,94,0.08)' }}
                  >
                    {result.steps.map((step, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-display whitespace-nowrap h-fit">
                          {step.phase}
                        </span>
                        <p className="text-xs text-muted leading-relaxed">
                          {language === 'sv' ? step.descriptionSv : step.descriptionEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Awl/Radd indicators */}
            {result.awlApplied && result.awlFactor && (
              <div
                className="mb-3 p-3 rounded-xl flex gap-2"
                style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}
              >
                <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-display text-primary mb-1">
                    {t('عول (Awl) tillämpat', '\'Awl Applied')}
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    {t(
                      `De fasta andelarna översteg kvarlåtenskapen. Nämnaren ökades från ${result.awlFactor[0]} till ${result.awlFactor[1]} — alla andelar minskades proportionellt.`,
                      `Fixed shares exceeded the estate. Denominator increased from ${result.awlFactor[0]} to ${result.awlFactor[1]} — all shares reduced proportionally.`,
                    )}
                  </p>
                </div>
              </div>
            )}

            {result.raddApplied && (
              <div
                className="mb-3 p-3 rounded-xl flex gap-2"
                style={{ background: 'rgba(107,127,94,0.05)', border: '1px solid rgba(107,127,94,0.1)' }}
              >
                <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-display text-primary mb-1">
                    {t('رد (Radd) tillämpat', 'Radd Applied')}
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    {t(
                      'Det fanns överskott efter fasta andelar. Överskottet har omfördelats till fard-arvingar (ej make/maka).',
                      'There was surplus after fixed shares. The surplus has been redistributed to fard heirs (except spouse).',
                    )}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ─── Disclaimer ────────────────────────────────── */}
        <div
          className="mt-8 p-4 rounded-2xl"
          style={{ background: 'rgba(107,127,94,0.04)', border: '1px solid rgba(107,127,94,0.1)' }}
        >
          <p className="text-xs font-display text-accent mb-2">
            {t('Viktig information', 'Important Notice')}
          </p>
          <p className="text-xs text-muted leading-relaxed">
            {t(
              'Denna kalkylator följer det saudiska officiella systemet (hanbali madhab, jumhur-positioner). Resultaten är vägledande — för bindande arvskifte, konsultera en islamisk rättslärd (عالم). Kalkylatorn hanterar inte alla extremt sällsynta specialfall.',
              'This calculator follows the Saudi Arabian official system (Hanbali madhab, jumhur positions). Results are for guidance — for binding inheritance settlements, consult an Islamic scholar (\'alim). The calculator may not handle all extremely rare edge cases.',
            )}
          </p>
        </div>

        {/* Method badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted/60">
          <Check className="w-3 h-3" />
          <span>
            {t('Saudiskt officiellt system • Hanbali madhab • Jumhur', 'Saudi official system • Hanbali madhab • Jumhur')}
          </span>
        </div>
      </div>
    </div>
  );
}
