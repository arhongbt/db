'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import { getArvsordning } from '@/lib/arvsordning';
import Link from 'next/link';
import {
  ArrowLeft,
  Scale,
  Users,
  AlertTriangle,
  Info,
  PieChart,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
} from 'lucide-react';

function ArvskifteContent() {
  const { state } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const arvsinfo = getArvsordning(
    state.onboarding.familySituation,
    state.onboarding.hasTestamente
  );

  const totalTillgangar = state.tillgangar.reduce(
    (sum, t) => sum + (t.estimatedValue ?? 0), 0
  );
  const totalSkulder = state.skulder.reduce(
    (sum, s) => sum + (s.amount ?? 0), 0
  );
  const netto = totalTillgangar - totalSkulder;

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', {
      style: 'currency', currency: 'SEK', maximumFractionDigits: 0,
    }).format(amount);

  // Simple share calculation based on situation
  const delagareCount = state.delagare.filter((d) => d.isDelagare).length;
  const equalShare = delagareCount > 0 ? netto / delagareCount : 0;

  // Determine if spouse takes all (common scenarios)
  const spouseTakesAll = ['gift_med_gemensamma_barn', 'gift_utan_barn'].includes(
    state.onboarding.familySituation
  );
  const spouse = state.delagare.find((d) => d.relation === 'make_maka');
  const children = state.delagare.filter((d) => d.relation === 'barn');
  const sarkullebarn = state.onboarding.familySituation === 'gift_med_sarkullebarn';

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary">Arvskifte</h1>
          <p className="text-muted text-sm">Fördelning av arvet</p>
        </div>
      </div>

      {/* Info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Vad är arvskifte?</p>
            <p className="text-sm text-primary/70 mt-1">
              Ett arvskifte är ett avtal mellan alla dödsbodelägare om hur tillgångarna
              ska fördelas. Det görs efter att bouppteckningen är registrerad hos Skatteverket.
              Om det bara finns en dödsbodelägare behövs inget arvskifte.
            </p>
          </div>
        </div>
      </div>

      {/* Net estate */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Dödsboets behållning
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted">Tillgångar</span>
            <span className="text-sm font-medium text-success">{formatSEK(totalTillgangar)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Skulder</span>
            <span className="text-sm font-medium text-warn">{formatSEK(totalSkulder)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold text-primary">Att fördela</span>
            <span className={`font-bold text-lg ${netto >= 0 ? 'text-success' : 'text-warn'}`}>
              {formatSEK(netto)}
            </span>
          </div>
        </div>
      </div>

      {/* Arvsordning summary */}
      <div className="card border-l-4 border-accent mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-primary">Arvsordning</h2>
        </div>
        <p className="text-sm text-primary/80 mb-3">{arvsinfo.summary}</p>
        <div className="bg-primary-lighter/20 rounded-card p-3">
          {arvsinfo.heirs.map((h, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-gray-200/50 last:border-0">
              <span className="text-sm font-medium text-primary">{h.relation}</span>
              <span className="text-sm text-muted">{h.share}</span>
            </div>
          ))}
        </div>
        {arvsinfo.warnings.length > 0 && (
          <div className="mt-3">
            {arvsinfo.warnings.map((w, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <AlertTriangle className="w-4 h-4 text-warn flex-shrink-0 mt-0.5" />
                <p className="text-xs text-primary/70">{w}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Distribution estimate */}
      {netto > 0 && state.delagare.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-primary">Uppskattad fördelning</h2>
          </div>

          <p className="text-xs text-muted mb-4">
            Förenklad beräkning. Faktisk fördelning beror på testamente, äktenskapsförord och bodelning.
          </p>

          {spouseTakesAll && spouse ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary-lighter/20 rounded-card">
                <div>
                  <p className="font-medium text-primary">{spouse.name}</p>
                  <p className="text-xs text-muted">Make/maka — fri förfoganderätt</p>
                </div>
                <p className="font-bold text-primary">{formatSEK(netto)}</p>
              </div>
              {children.length > 0 && (
                <div className="info-box">
                  <p className="text-sm">
                    <strong>{children.length} barn</strong> har efterarvsrätt och ärver
                    sin del ({formatSEK(netto / children.length)} var) vid den
                    efterlevande makens/makans bortgång.
                  </p>
                </div>
              )}
            </div>
          ) : sarkullebarn && spouse ? (
            <div className="space-y-3">
              {children.map((child) => (
                <div key={child.id} className="flex items-center justify-between p-3 bg-accent/5 rounded-card">
                  <div>
                    <p className="font-medium text-primary">{child.name}</p>
                    <p className="text-xs text-muted">Särkullbarn — rätt att få ut direkt</p>
                  </div>
                  <p className="font-bold text-accent">
                    {formatSEK(children.length > 0 ? netto / (children.length + 1) : 0)}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-primary-lighter/20 rounded-card">
                <div>
                  <p className="font-medium text-primary">{spouse.name}</p>
                  <p className="text-xs text-muted">Make/maka — fri förfoganderätt</p>
                </div>
                <p className="font-bold text-primary">
                  {formatSEK(children.length > 0 ? netto / (children.length + 1) : netto)}
                </p>
              </div>
              <div className="warning-box">
                <p className="text-sm">
                  Särkullbarn kan begära sin arvslott direkt. De kan också frivilligt avstå
                  till förmån för den efterlevande maken/makan.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {state.delagare.filter((d) => d.isDelagare).map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-card">
                  <div>
                    <p className="font-medium text-primary">{d.name}</p>
                    <p className="text-xs text-muted">Lika del</p>
                  </div>
                  <p className="font-bold text-primary">{formatSEK(equalShare)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {netto < 0 && (
        <div className="warning-box mb-6">
          <div className="flex gap-2">
            <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0" />
            <div>
              <p className="font-medium text-warn">Dödsboet har underskott</p>
              <p className="text-sm text-primary/70 mt-1">
                Skulderna överstiger tillgångarna med {formatSEK(Math.abs(netto))}.
                Arvingar ärver aldrig skulder i Sverige. Kontakta Kronofogden om
                dödsboet inte kan betala sina skulder.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Steps in arvskifte */}
      <button
        onClick={() => setShowSteps(!showSteps)}
        className="card flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          <span className="font-medium text-primary">Steg i arvskiftet</span>
        </div>
        {showSteps ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
      </button>

      {showSteps && (
        <div className="space-y-3 mb-6">
          {[
            { step: '1. Bouppteckning registrerad', desc: 'Bouppteckningen måste vara registrerad hos Skatteverket innan arvskifte kan ske.', done: state.currentStep === 'arvskifte' || state.currentStep === 'avslutat' },
            { step: '2. Skulder betalda', desc: 'Alla kända skulder ska betalas från dödsboets medel innan arvet fördelas.', done: false },
            { step: '3. Arvskifteshandling upprättas', desc: 'Skriftlig handling som visar hur arvet fördelas. Alla delägare ska godkänna.', done: false },
            { step: '4. Alla delägare undertecknar', desc: 'Samtliga dödsbodelägare skriver under arvskifteshandlingen.', done: false },
            { step: '5. Tillgångar fördelas', desc: 'Bankkonton överförs, fastigheter lagfares om, lösöre delas ut.', done: false },
            { step: '6. Dödsboet avslutas', desc: 'Konton avslutas, slutlig skattedeklaration lämnas, dödsboet upphör.', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 ml-1">
              {item.done
                ? <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                : <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="font-medium text-primary text-sm">{item.step}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bodelning warning for married */}
      {(state.onboarding.familySituation.startsWith('gift_')) && (
        <Link href="/bodelning" className="warning-box mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warn">Bodelning krävs först</p>
              <p className="text-sm text-primary/70">Gift par måste göra bodelning innan arvskifte.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-warn flex-shrink-0" />
        </Link>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 mb-6">
        {state.onboarding.familySituation.startsWith('gift_') && (
          <Link href="/bodelning" className="btn-primary flex items-center justify-center gap-2">
            Bodelning
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
        <Link href="/bouppteckning" className={`${state.onboarding.familySituation.startsWith('gift_') ? 'btn-secondary' : 'btn-primary'} flex items-center justify-center gap-2`}>
          Bouppteckning
          <ChevronRight className="w-5 h-5" />
        </Link>
        <Link href="/fullmakt" className="btn-secondary flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          Fullmakter & mallar
        </Link>
        {state.delagare.length === 0 && (
          <Link href="/delagare" className="btn-secondary flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            Lägg till dödsbodelägare först
          </Link>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-primary-lighter/30 rounded-card p-4 mb-4">
        <p className="text-xs text-muted leading-relaxed">
          Beräkningen baseras på ärvdabalken och ger en uppskattning. Vid testamente,
          särkullbarn, samboförhållanden eller internationella förhållanden kan arvsordningen
          vara annorlunda. Kontakta en jurist för bindande rådgivning.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

export default function ArvskiftePage() {
  return (
    <DodsboProvider>
      <ArvskifteContent />
    </DodsboProvider>
  );
}
