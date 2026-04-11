'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Info, Users, AlertTriangle } from 'lucide-react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import type { FamilySituation } from '@/types';

interface Arvinge {
  name: string;
  relation: string;
  share: number; // procent
  amount: number;
  note?: string;
}

interface CalcResult {
  arvingar: Arvinge[];
  bodelning?: { makeAndel: number; dodsboAndel: number };
  laglottWarning?: string;
  totalTillgangar: number;
  totalSkulder: number;
  totalKostnader: number;
  nettoBehallning: number;
}

function calculateInheritance(
  familySituation: FamilySituation,
  tillgangar: number,
  skulder: number,
  kostnader: number,
  delagareNames: { name: string; relation: string }[],
  hasTestamente: boolean | null,
  makeNamn?: string,
): CalcResult {
  const netto = tillgangar - skulder - kostnader;
  const result: CalcResult = {
    arvingar: [],
    totalTillgangar: tillgangar,
    totalSkulder: skulder,
    totalKostnader: kostnader,
    nettoBehallning: netto,
  };

  if (netto <= 0) {
    result.arvingar = [{ name: 'Dödsboet', relation: 'insolvent', share: 0, amount: 0, note: 'Dödsboet saknar tillgångar att fördela. Arvingar ärver aldrig skulder.' }];
    return result;
  }

  const barn = delagareNames.filter(d => d.relation === 'barn' || d.relation === 'barnbarn');
  const PRISBASBELOPP = 57300;

  switch (familySituation) {
    case 'gift_med_gemensamma_barn': {
      // Bodelning: 50/50 giftorättsgods
      const makeAndel = netto / 2;
      const dodsboAndel = netto / 2;
      result.bodelning = { makeAndel, dodsboAndel };

      // Make ärver med fri förfoganderätt, barnen har efterarvsrätt
      result.arvingar.push({
        name: makeNamn || 'Efterlevande make/maka',
        relation: 'make_maka',
        share: 100,
        amount: dodsboAndel,
        note: 'Ärver med fri förfoganderätt (ÄB 3:1). Barnen har efterarvsrätt.',
      });
      barn.forEach(b => {
        result.arvingar.push({
          name: b.name || 'Barn',
          relation: 'barn',
          share: 0,
          amount: 0,
          note: `Efterarvsrätt: Får sin del (${barn.length > 0 ? Math.round(100 / barn.length) : 0}%) när efterlevande make avlider.`,
        });
      });
      break;
    }

    case 'gift_med_sarkullebarn': {
      const makeAndel = netto / 2;
      const dodsboAndel = netto / 2;
      result.bodelning = { makeAndel, dodsboAndel };

      const sarkullebarn = barn.filter(b => b.relation === 'barn');
      if (sarkullebarn.length > 0) {
        const perBarn = dodsboAndel / sarkullebarn.length;
        sarkullebarn.forEach(b => {
          result.arvingar.push({
            name: b.name || 'Särkullbarn',
            relation: 'barn',
            share: Math.round((perBarn / dodsboAndel) * 100),
            amount: perBarn,
            note: 'Särkullbarn har rätt att få ut sin arvslott direkt (ÄB 3:1 2st). Kan frivilligt avstå.',
          });
        });
        result.arvingar.push({
          name: makeNamn || 'Efterlevande make/maka',
          relation: 'make_maka',
          share: 0,
          amount: makeAndel,
          note: `Behåller sin bodelningsandel (${formatSEK(makeAndel)}). Ärver inte den avlidnes andel om särkullbarn kräver sin del.`,
        });
      }
      result.laglottWarning = 'Särkullbarn har alltid rätt till sin laglott (halva arvslotten). De kan inte göras arvlösa genom testamente.';
      break;
    }

    case 'gift_utan_barn': {
      const makeAndel = netto / 2;
      const dodsboAndel = netto / 2;
      result.bodelning = { makeAndel, dodsboAndel };

      result.arvingar.push({
        name: makeNamn || 'Efterlevande make/maka',
        relation: 'make_maka',
        share: 100,
        amount: dodsboAndel,
        note: 'Ärver allt med fri förfoganderätt (ÄB 3:1). Föräldrar/syskon har efterarvsrätt.',
      });
      break;
    }

    case 'ogift_med_barn':
    case 'sambo_med_barn': {
      let arvsmassan = netto;

      // Sambo kan begära bodelning av samboegendom
      if (familySituation === 'sambo_med_barn') {
        const samboNote = 'Efterlevande sambo kan begära bodelning av samboegendom (bostad + bohag köpt för gemensamt bruk). Lilla basbeloppsregeln: rätt till minst 2 prisbasbelopp.';
        result.arvingar.push({
          name: 'Efterlevande sambo',
          relation: 'sambo',
          share: 0,
          amount: 0,
          note: samboNote,
        });
      }

      if (barn.length > 0) {
        const perBarn = arvsmassan / barn.length;
        barn.forEach(b => {
          result.arvingar.push({
            name: b.name || 'Barn',
            relation: 'barn',
            share: Math.round(100 / barn.length),
            amount: perBarn,
            note: 'Ärver lika del enligt arvsordningen (ÄB 2:1).',
          });
        });
      }
      break;
    }

    case 'sambo_utan_barn': {
      // Sambor ärver inte varandra
      const parents = delagareNames.filter(d => d.relation === 'foralder');
      const syskon = delagareNames.filter(d => d.relation === 'syskon');
      const others = delagareNames.filter(d => !['barn', 'barnbarn', 'foralder', 'syskon', 'sambo', 'make_maka'].includes(d.relation));

      result.arvingar.push({
        name: 'Efterlevande sambo',
        relation: 'sambo',
        share: 0,
        amount: 0,
        note: 'Sambor ärver INTE varandra utan testamente. Kan begära bodelning av samboegendom.',
      });

      if (parents.length > 0) {
        const perParent = netto / parents.length;
        parents.forEach(p => {
          result.arvingar.push({
            name: p.name || 'Förälder',
            relation: 'foralder',
            share: Math.round(100 / parents.length),
            amount: perParent,
            note: '2:a arvsklassen (ÄB 2:2).',
          });
        });
      } else if (syskon.length > 0) {
        const perSyskon = netto / syskon.length;
        syskon.forEach(s => {
          result.arvingar.push({
            name: s.name || 'Syskon',
            relation: 'syskon',
            share: Math.round(100 / syskon.length),
            amount: perSyskon,
            note: 'Ärver i föräldrarnas ställe (ÄB 2:2 2st).',
          });
        });
      } else {
        result.arvingar.push({
          name: 'Allmänna arvsfonden',
          relation: 'annan_slakting',
          share: 100,
          amount: netto,
          note: 'Utan arvingar tillfaller arvet Allmänna arvsfonden.',
        });
      }
      break;
    }

    case 'ensamstaende_utan_barn': {
      const parents = delagareNames.filter(d => d.relation === 'foralder');
      const syskon = delagareNames.filter(d => d.relation === 'syskon');

      if (parents.length > 0) {
        const perParent = netto / parents.length;
        parents.forEach(p => {
          result.arvingar.push({
            name: p.name || 'Förälder',
            relation: 'foralder',
            share: Math.round(100 / parents.length),
            amount: perParent,
          });
        });
      } else if (syskon.length > 0) {
        const perSyskon = netto / syskon.length;
        syskon.forEach(s => {
          result.arvingar.push({
            name: s.name || 'Syskon',
            relation: 'syskon',
            share: Math.round(100 / syskon.length),
            amount: perSyskon,
          });
        });
      } else {
        result.arvingar.push({
          name: 'Allmänna arvsfonden',
          relation: 'annan_slakting',
          share: 100,
          amount: netto,
          note: 'Utan arvingar tillfaller arvet Allmänna arvsfonden.',
        });
      }
      break;
    }
  }

  if (hasTestamente) {
    result.laglottWarning = (result.laglottWarning || '') +
      ' OBS: Testamente kan påverka fördelningen. Bröstarvingar har alltid rätt till laglott (halva arvslotten, ÄB 7:1). Testamentet måste klandras inom 6 månader.';
  }

  return result;
}

function formatSEK(n: number): string {
  return n.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });
}

function ArvskalkylatorContent() {
  const { state } = useDodsbo();

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
    ),
    [state.onboarding.familySituation, tillgangar, skulder, kostnader, delagareNames, state.onboarding.hasTestamente, make?.name]
  );

  const situationLabels: Record<FamilySituation, string> = {
    gift_med_gemensamma_barn: 'Gift med gemensamma barn',
    gift_med_sarkullebarn: 'Gift med särkullbarn',
    gift_utan_barn: 'Gift utan barn',
    ogift_med_barn: 'Ogift med barn',
    sambo_med_barn: 'Sambo med barn',
    sambo_utan_barn: 'Sambo utan barn',
    ensamstaende_utan_barn: 'Ensamstående utan barn',
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="px-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">Arvskalkylator</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          Beräkna hur arvet fördelas baserat på familjesituation och tillgångar.
        </p>

        {/* Familjesituation */}
        <div className="card mb-4">
          <p className="text-xs text-muted mb-1">Familjesituation</p>
          <p className="font-semibold text-primary">
            {situationLabels[state.onboarding.familySituation]}
          </p>
          {state.delagare.length > 0 && (
            <p className="text-xs text-muted mt-1">
              {state.delagare.length} dödsbodelägare registrerade
            </p>
          )}
        </div>

        {/* Input: Tillgångar / Skulder */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-primary text-sm">Ekonomisk översikt</p>
            {totalTillgangar > 0 && (
              <button
                onClick={() => setUseManual(!useManual)}
                className="text-xs text-accent hover:underline"
              >
                {useManual ? 'Använd registrerade värden' : 'Ange manuellt'}
              </button>
            )}
          </div>

          {useManual ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted">Tillgångar (SEK)</label>
                <input
                  type="number"
                  value={manualTillgangar || ''}
                  onChange={e => setManualTillgangar(Number(e.target.value) || 0)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Skulder (SEK)</label>
                <input
                  type="number"
                  value={manualSkulder || ''}
                  onChange={e => setManualSkulder(Number(e.target.value) || 0)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Dödsbokostnader (SEK)</label>
                <input
                  type="number"
                  value={manualKostnader || ''}
                  onChange={e => setManualKostnader(Number(e.target.value) || 0)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tillgångar</span>
                <span className="text-primary font-medium">{formatSEK(tillgangar)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Skulder</span>
                <span className="text-warn font-medium">-{formatSEK(skulder)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Kostnader</span>
                <span className="text-warn font-medium">-{formatSEK(kostnader)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
                <span className="text-primary">Nettobehållning</span>
                <span className={result.nettoBehallning >= 0 ? 'text-success' : 'text-warn'}>
                  {formatSEK(result.nettoBehallning)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bodelning */}
        {result.bodelning && (
          <div className="card mb-4 border-l-4 border-accent">
            <p className="font-semibold text-primary text-sm mb-2">Bodelning (ÄktB 9-13 kap.)</p>
            <p className="text-xs text-muted mb-3">
              Giftorättsgods delas 50/50 mellan makarna innan arvet fördelas.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Efterlevande makes andel</span>
                <span className="text-primary font-medium">{formatSEK(result.bodelning.makeAndel)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Dödsboets andel (att fördela)</span>
                <span className="text-primary font-medium">{formatSEK(result.bodelning.dodsboAndel)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resultat: Arvsfördelning */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-accent" />
            <p className="font-semibold text-primary text-sm">Arvsfördelning</p>
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
              Kalkylatorn ger en uppskattning baserad på allmänna regler i ärvdabalken.
              Testamenten, äktenskapsförord och enskild egendom kan påverka fördelningen.
              Kontakta en jurist för bindande rådgivning.
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
