'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import { JuridiskTooltip } from '@/components/ui/JuridiskTooltip';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Scale,
  Plus,
  Trash2,
  Home,
  Sofa,
  Download,
} from 'lucide-react';
import type {
  SamboEgendom,
  BodelningsData,
} from '@/lib/generate-bodelningsavtal';

function BodelningContent() {
  const { state } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [hasAktenskapsForord, setHasAktenskapsForord] = useState(false);
  const [enskildegenodom, setEnskildegenodom] = useState('');

  // Sambo state
  const [samboEgendom, setSamboEgendom] = useState<SamboEgendom[]>([]);
  const [samboName, setSamboName] = useState('');
  const [samboPnr, setSamboPnr] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    beskrivning: '',
    typ: 'bostad' as 'bostad' | 'bohag',
    varde: '',
    agareSambo: false,
  });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isMarried = state.onboarding.familySituation.startsWith('gift_');
  const isSambo = state.onboarding.familySituation.startsWith('sambo_');

  const totalTillgangar = state.tillgangar.reduce(
    (sum, t) => sum + (t.estimatedValue ?? 0), 0
  );
  const totalSkulder = state.skulder.reduce(
    (sum, s) => sum + (s.amount ?? 0), 0
  );
  const netto = totalTillgangar - totalSkulder;

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(amount);

  // Gift bodelning calculation
  let giftorattsgods = netto;
  let enskildegenodomBelopp = 0;
  if (hasAktenskapsForord && enskildegenodom) {
    enskildegenodomBelopp = parseFloat(enskildegenodom) || 0;
    giftorattsgods = netto - enskildegenodomBelopp;
  }
  const spouseShare = Math.max(0, giftorattsgods / 2);
  const estatePart = Math.max(0, giftorattsgods / 2);
  const totalToEstate = estatePart + enskildegenodomBelopp;

  // Sambo calculation
  const totalSamboEgendom = samboEgendom.reduce((s, e) => s + e.varde, 0);
  const samboAndel = Math.round(totalSamboEgendom / 2);
  const dodsboAndel = totalSamboEgendom - samboAndel;

  const addEgendom = () => {
    if (!newItem.beskrivning || !newItem.varde) return;
    setSamboEgendom((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        beskrivning: newItem.beskrivning,
        typ: newItem.typ,
        varde: parseFloat(newItem.varde) || 0,
        agareSambo: newItem.agareSambo,
      },
    ]);
    setNewItem({ beskrivning: '', typ: 'bostad', varde: '', agareSambo: false });
    setShowAddForm(false);
  };

  const removeEgendom = (id: string) => {
    setSamboEgendom((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDownloadAvtal = async () => {
    const data: BodelningsData = {
      deceasedName: state.deceasedName || '[Namn]',
      deceasedPersonnummer: state.deceasedPersonnummer || '[Personnummer]',
      samboName: samboName || '[Sambons namn]',
      samboPersonnummer: samboPnr || '[Personnummer]',
      egendom: samboEgendom,
      dödsdatum: state.deathDate
        ? new Date(state.deathDate).toLocaleDateString('sv-SE')
        : '[Dödsdatum]',
      avtalsDatum: new Date().toLocaleDateString('sv-SE'),
      typ: 'sambo',
    };
    const { downloadBodelningsavtal } = await import('@/lib/generate-bodelningsavtal');
    await downloadBodelningsavtal(data);
  };

  // Death date for deadline calculation
  const deadlineDate = state.deathDate
    ? new Date(new Date(state.deathDate).getTime() + 365 * 24 * 60 * 60 * 1000)
    : null;
  const daysUntilDeadline = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

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
          <h1 className="text-2xl font-semibold text-primary">Bodelning</h1>
          <p className="text-muted text-sm">
            {isSambo ? 'Delning av samboegendom' : 'Delning av giftorättsgods'}
          </p>
        </div>
      </div>

      {/* ═══════════ NEITHER MARRIED NOR SAMBO ═══════════ */}
      {!isMarried && !isSambo && (
        <div className="info-box mb-6">
          <div className="flex gap-2">
            <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Bodelning gäller för gifta par och sambor</p>
              <p className="text-sm text-primary/70 mt-1">
                Om den avlidne varken var gift eller sambo går man direkt till arvskifte.
              </p>
              <Link
                href="/arvskifte"
                className="inline-block mt-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Gå till arvskifte →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ SAMBO BODELNING ═══════════ */}
      {isSambo && (
        <>
          {/* Deadline warning */}
          {daysUntilDeadline !== null && daysUntilDeadline > 0 && daysUntilDeadline <= 180 && (
            <div className="warning-box mb-6">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warn">
                    {daysUntilDeadline} dagar kvar att begära bodelning
                  </p>
                  <p className="text-sm text-primary/70 mt-1">
                    Enligt Sambolagen 8 § måste bodelning begäras senast ett år efter
                    samboförhållandets upphörande.
                    {deadlineDate && (
                      <> Sista datum: <strong>{deadlineDate.toLocaleDateString('sv-SE')}</strong>.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {daysUntilDeadline !== null && daysUntilDeadline <= 0 && (
            <div className="warning-box mb-6 border-warn">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warn">Tidsfristen har passerat</p>
                  <p className="text-sm text-primary/70 mt-1">
                    Det har gått mer än ett år sedan dödsfallet. Rätten att begära
                    bodelning enligt Sambolagen kan ha gått förlorad. Kontakta en jurist.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Juridisk info */}
          <div className="info-box mb-6">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">
                  Vad är <JuridiskTooltip term="bodelning" /> vid samboförhållande?
                </p>
                <p className="text-sm text-primary/70 mt-1">
                  När en sambo avlider kan den efterlevande sambon begära bodelning av
                  <strong> samboegendom</strong>. Samboegendom är gemensam bostad och bohag
                  som förvärvats för gemensamt bruk (Sambolagen 3 §).
                </p>
                <p className="text-sm text-primary/70 mt-2">
                  <strong>Vad ingår:</strong> Bostad köpt för att bo i tillsammans, möbler,
                  hushållsapparater och annat bohag anskaffat för gemensamt bruk.
                </p>
                <p className="text-sm text-primary/70 mt-2">
                  <strong>Vad ingår INTE:</strong> Egendom som ägdes före förhållandet (om den
                  inte köptes för gemensamt bruk), arv, gåvor, bil, aktier, pensioner,
                  fritidshus.
                </p>
              </div>
            </div>
          </div>

          {/* Sambo info fields */}
          <div className="card mb-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
              Efterlevande sambons uppgifter
            </h2>
            <label className="block">
              <span className="text-sm font-medium text-primary mb-1 block">Namn</span>
              <input
                type="text"
                value={samboName}
                onChange={(e) => setSamboName(e.target.value)}
                placeholder="Förnamn Efternamn"
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-primary mb-1 block">Personnummer</span>
              <input
                type="text"
                value={samboPnr}
                onChange={(e) => setSamboPnr(e.target.value)}
                placeholder="ÅÅMMDD-XXXX"
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
              />
            </label>
          </div>

          {/* Samboegendom list */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
                Samboegendom
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Lägg till
              </button>
            </div>

            {samboEgendom.length === 0 && !showAddForm && (
              <p className="text-sm text-muted py-4 text-center">
                Lägg till gemensam bostad och bohag som förvärvats för gemensamt bruk.
              </p>
            )}

            {/* Existing items */}
            {samboEgendom.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {item.typ === 'bostad' ? (
                    <Home className="w-4 h-4 text-accent flex-shrink-0" />
                  ) : (
                    <Sofa className="w-4 h-4 text-accent flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-primary">{item.beskrivning}</p>
                    <p className="text-xs text-muted">
                      {item.typ === 'bostad' ? 'Bostad' : 'Bohag'} · {item.agareSambo ? 'Sambons' : 'Den avlidnes'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">{formatSEK(item.varde)}</span>
                  <button
                    onClick={() => removeEgendom(item.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-warn hover:bg-warn/10 transition-colors"
                    aria-label="Ta bort"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add form */}
            {showAddForm && (
              <div className="mt-4 p-4 bg-gray-50 rounded-card space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-primary mb-1 block">Beskrivning</span>
                  <input
                    type="text"
                    value={newItem.beskrivning}
                    onChange={(e) => setNewItem({ ...newItem, beskrivning: e.target.value })}
                    placeholder="T.ex. Lägenhet Storgatan 5 eller Soffa IKEA"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                  />
                </label>

                <div className="flex gap-3">
                  <label className="flex-1">
                    <span className="text-xs font-medium text-primary mb-1 block">Typ</span>
                    <select
                      value={newItem.typ}
                      onChange={(e) => setNewItem({ ...newItem, typ: e.target.value as 'bostad' | 'bohag' })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    >
                      <option value="bostad">Bostad</option>
                      <option value="bohag">Bohag</option>
                    </select>
                  </label>
                  <label className="flex-1">
                    <span className="text-xs font-medium text-primary mb-1 block">Värde (SEK)</span>
                    <input
                      type="number"
                      value={newItem.varde}
                      onChange={(e) => setNewItem({ ...newItem, varde: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    />
                  </label>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newItem.agareSambo}
                    onChange={(e) => setNewItem({ ...newItem, agareSambo: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-primary">Sambon äger denna egendom</span>
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 px-3 text-sm rounded-lg border border-gray-200 text-primary hover:bg-gray-100 transition-colors"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={addEgendom}
                    disabled={!newItem.beskrivning || !newItem.varde}
                    className="flex-1 py-2 px-3 text-sm rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
                  >
                    Lägg till
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sambo calculation result */}
          {samboEgendom.length > 0 && (
            <div className="card mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-primary">Bodelningsberäkning</h3>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Bostäder</span>
                  <span className="text-sm font-medium">
                    {formatSEK(samboEgendom.filter((e) => e.typ === 'bostad').reduce((s, e) => s + e.varde, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Bohag</span>
                  <span className="text-sm font-medium">
                    {formatSEK(samboEgendom.filter((e) => e.typ === 'bohag').reduce((s, e) => s + e.varde, 0))}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-primary">Total samboegendom</span>
                  <span className="font-bold text-lg text-primary">{formatSEK(totalSamboEgendom)}</span>
                </div>
              </div>

              <div className="bg-primary-lighter/20 rounded-card p-3 mb-2">
                <p className="text-xs text-muted uppercase font-semibold mb-2">Sambons andel (50 %)</p>
                <p className="text-lg font-bold text-primary">{formatSEK(samboAndel)}</p>
                <p className="text-xs text-muted mt-1">
                  Sambon får hälften av samboegendomen direkt.
                </p>
              </div>

              <div className="bg-accent/10 rounded-card p-3 mb-4">
                <p className="text-xs text-muted uppercase font-semibold mb-2">Till dödsboet (50 %)</p>
                <p className="text-lg font-bold text-accent">{formatSEK(dodsboAndel)}</p>
                <p className="text-xs text-muted mt-1">
                  Andra hälften går in i dödsboet för arvskifte.
                </p>
              </div>

              {/* Download bodelningsavtal */}
              <button
                onClick={handleDownloadAvtal}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Ladda ner bodelningsavtal (.docx)
              </button>
            </div>
          )}

          {/* Steps */}
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="card flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <span className="font-medium text-primary">Steg i sambo-bodelningen</span>
            </div>
            {showSteps ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
          </button>

          {showSteps && (
            <div className="space-y-3 mb-6">
              {[
                {
                  step: '1. Begär bodelning',
                  desc: 'Den efterlevande sambon måste aktivt begära bodelning. Det sker inte automatiskt. Tidsfristen är 1 år från dödsfallet.',
                },
                {
                  step: '2. Identifiera samboegendom',
                  desc: 'Bestäm vilken egendom som är samboegendom — gemensam bostad och bohag anskaffat för gemensamt bruk.',
                },
                {
                  step: '3. Värdera egendomen',
                  desc: 'Fastställ marknadsvärdet på bostaden och bohaget. Anlita mäklare för bostad vid behov.',
                },
                {
                  step: '4. Beräkna andelarna',
                  desc: 'Samboegendomen delas 50/50. Skulder kopplade till samboegendomen dras av först.',
                },
                {
                  step: '5. Upprätta bodelningsavtal',
                  desc: 'Skriv under ett skriftligt bodelningsavtal. Ladda ner Word-dokumentet ovan som mall.',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 ml-1">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-semibold text-muted">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-primary text-sm">{item.step}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legal references */}
          <div className="card mb-6 border-l-4 border-accent">
            <h3 className="text-sm font-semibold text-primary mb-3">Rättslig grund</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-muted">Sambolagen (2003:376)</p>
                <p className="text-xs text-primary/70">
                  <strong>3 §:</strong> Samboegendom = gemensam bostad och bohag anskaffat
                  för gemensamt bruk.
                </p>
                <p className="text-xs text-primary/70 mt-1">
                  <strong>8 §:</strong> Bodelning ska begäras senast ett år efter
                  samboförhållandets upphörande.
                </p>
                <p className="text-xs text-primary/70 mt-1">
                  <strong>14 §:</strong> Samboegendom fördelas lika (hälftendelning).
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mb-6">
            <Link href="/arvskifte" className="btn-primary flex items-center justify-center gap-2">
              Gå till arvskifte →
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="bg-primary-lighter/30 rounded-card p-4 mb-4">
            <p className="text-xs text-muted leading-relaxed">
              Denna beräkning ger en uppskattning. Faktisk bodelning kan påverkas av
              skulder kopplade till samboegendomen, samboavtal, och andra faktorer. En jurist
              kan hjälpa till med att fastställa exakt vad som utgör samboegendom i ert fall.
            </p>
          </div>
        </>
      )}

      {/* ═══════════ GIFT BODELNING (existing) ═══════════ */}
      {isMarried && (
        <>
          {/* Warning box */}
          <div className="warning-box mb-6">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warn">Bodelning MÅSTE göras före arvskifte</p>
                <p className="text-sm text-primary/70 mt-1">
                  Eftersom den avlidne var gift måste giftorättsgodset delas innan arven kan
                  fördelas. Detta är en rättslig förpliktelse enligt Äktenskapsbalken.
                </p>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="info-box mb-6">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">Vad är bodelning?</p>
                <p className="text-sm text-primary/70 mt-1">
                  <JuridiskTooltip term="bodelning" /> är delningen av giftorättsgodset som
                  maken/makan och den avlidne äger tillsammans. Den överlevande maken/makan
                  får hälften direkt, medan den andra hälften går in i dödsboet.
                </p>
                <p className="text-sm text-primary/70 mt-2">
                  <strong>Undantag:</strong> Om det finns äktenskapsförord kan viss egendom
                  vara &ldquo;enskild egendom&rdquo; och undantas från bodelning.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="card mb-6">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
              Bodelningsberäkning
            </h2>

            <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm text-muted">Tillgångar</span>
                <span className="text-sm font-medium text-success">{formatSEK(totalTillgangar)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted">Skulder</span>
                <span className="text-sm font-medium text-warn">{formatSEK(totalSkulder)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-semibold text-primary">Netto</span>
                <span className={`font-bold text-lg ${netto >= 0 ? 'text-success' : 'text-warn'}`}>
                  {formatSEK(netto)}
                </span>
              </div>
            </div>

            {/* Äktenskapsförord toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAktenskapsForord}
                  onChange={(e) => setHasAktenskapsForord(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-primary">Finns äktenskapsförord?</span>
              </label>
            </div>

            {hasAktenskapsForord && (
              <div className="mb-6">
                <label htmlFor="enskild" className="block text-sm font-medium text-primary mb-2">
                  Enskild egendom (SEK)
                </label>
                <input
                  id="enskild"
                  type="number"
                  value={enskildegenodom}
                  onChange={(e) => setEnskildegenodom(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-card text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            )}

            {/* Results */}
            <div className="space-y-3 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-primary">Bodelningsresultat</h3>
              </div>

              {hasAktenskapsForord && enskildegenodomBelopp > 0 && (
                <div className="bg-gray-50 rounded-card p-3 mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted">Enskild egendom</span>
                    <span className="text-sm font-medium text-primary">{formatSEK(enskildegenodomBelopp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Giftorättsgods att dela</span>
                    <span className="text-sm font-medium text-primary">{formatSEK(giftorattsgods)}</span>
                  </div>
                </div>
              )}

              <div className="bg-primary-lighter/20 rounded-card p-3 mb-2">
                <p className="text-xs text-muted uppercase font-semibold mb-2">Makes/makans andel</p>
                <p className="text-lg font-bold text-primary">{formatSEK(spouseShare)}</p>
                <p className="text-xs text-muted mt-1">Hälften av giftorättsgodset.</p>
              </div>

              <div className="bg-accent/10 rounded-card p-3">
                <p className="text-xs text-muted uppercase font-semibold mb-2">Till dödsboet</p>
                <p className="text-lg font-bold text-accent">{formatSEK(totalToEstate)}</p>
                <p className="text-xs text-muted mt-1">Andra hälften plus eventuell enskild egendom.</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="card flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <span className="font-medium text-primary">Steg i bodelningsprocessen</span>
            </div>
            {showSteps ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
          </button>

          {showSteps && (
            <div className="space-y-3 mb-6">
              {[
                { step: '1. Inventering', desc: 'Identifiera giftorättsgods. Kontrollera äktenskapsförord.' },
                { step: '2. Värdering', desc: 'Fastställ värdet. Alla tillgångar minus skulder.' },
                { step: '3. Bodelningshandling', desc: 'Skriftlig överenskommelse om 50/50-delning.' },
                { step: '4. Godkännande', desc: 'Alla parter godkänner. Domstol avgör vid oenighet.' },
                { step: '5. Överföring', desc: 'Makan/maken får sin andel. Resten till arvskifte.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 ml-1">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-semibold text-muted">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-primary text-sm">{item.step}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legal references */}
          <div className="card mb-6 border-l-4 border-accent">
            <h3 className="text-sm font-semibold text-primary mb-3">Rättslig grund</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-muted">Äktenskapsbalken (1987:230)</p>
                <p className="text-xs text-primary/70">
                  <strong>Kap 9-10:</strong> Bodelning vid dödsfall. Giftorättsgodset delas
                  50/50 om inte äktenskapsförord säger annat.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mb-6">
            <Link href="/arvskifte" className="btn-primary flex items-center justify-center gap-2">
              Gå till arvskifte →
            </Link>
            <Link href="/delagare" className="btn-secondary flex items-center justify-center gap-2">
              Lägg till dödsbodelägare
            </Link>
          </div>

          <div className="bg-primary-lighter/30 rounded-card p-4 mb-4">
            <p className="text-xs text-muted leading-relaxed">
              Denna kalkylator ger en uppskattning. Kontakta en jurist för bindande rådgivning.
            </p>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}

export default function BodelningPage() {
  return (
    <DodsboProvider>
      <BodelningContent />
    </DodsboProvider>
  );
}
