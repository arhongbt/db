'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
  Scale,
} from 'lucide-react';

function BodelningContent() {
  const { state } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [hasAktenskapsForord, setHasAktenskapsForord] = useState(false);
  const [enskildegenodom, setEnskildegenodom] = useState('');

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isMarried = state.onboarding.familySituation.startsWith('gift_');

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

  // Bodelning calculation
  let giftorattsgods = netto;
  let enskildegenodomBelopp = 0;

  if (hasAktenskapsForord && enskildegenodom) {
    enskildegenodomBelopp = parseFloat(enskildegenodom) || 0;
    giftorattsgods = netto - enskildegenodomBelopp;
  }

  const spouseShare = Math.max(0, giftorattsgods / 2);
  const estatePart = Math.max(0, giftorattsgods / 2);
  const totalToEstate = estatePart + enskildegenodomBelopp;

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
          <p className="text-muted text-sm">Delning av giftorättsgods</p>
        </div>
      </div>

      {!isMarried && (
        <>
          {/* Not married message */}
          <div className="info-box mb-6">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">Bodelning gäller bara gifta par</p>
                <p className="text-sm text-primary/70 mt-1">
                  Bodelning är bara relevant när den avlidne var gift. För samboförhållanden,
                  ensamstående eller föräldrar utan make/maka går man direkt till arvskifte.
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
        </>
      )}

      {isMarried && (
        <>
          {/* Warning box */}
          <div className="warning-box mb-6">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warn">Bodelning MÅSTE göras före arvskifte</p>
                <p className="text-sm text-primary/70 mt-1">
                  Eftersom den avlidne var gift måste giftorättsgodset (den gift egendom som
                  tillhör båda makarna gemensamt) delas innan arven kan fördelas. Detta är
                  en rättslig förpliktelse enligt Äktenskapsbalken.
                </p>
              </div>
            </div>
          </div>

          {/* Info box explaining bodelning */}
          <div className="info-box mb-6">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">Vad är bodelning?</p>
                <p className="text-sm text-primary/70 mt-1">
                  Bodelning är delningen av den giftorättsgods (gemensam egendom) som maken/makan
                  och den avlidne äger tillsammans. Vid bodelningen får den överlevande maken/makan
                  hälften av giftorättsgodset direkt, medan den andra hälften går in i dödsboet
                  för arvskifte.
                </p>
                <p className="text-sm text-primary/70 mt-2">
                  <strong>Undantag:</strong> Om det finns ett äktenskapsförord kan viss egendom
                  vara märkt som &ldquo;enskild egendom&rdquo; och inte omfattas av bodelning.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="card mb-6">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
              Bodelningsberäkning
            </h2>

            {/* Estate summary */}
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
                <span className="font-semibold text-primary">Netto (giftorättsgods före eventuell enskild egendom)</span>
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
                <span className="text-sm font-medium text-primary">
                  Finns äktenskapsförord?
                </span>
              </label>
              <p className="text-xs text-muted mt-1 ml-7">
                Om ja, kan viss egendom vara märkt som &ldquo;enskild egendom&rdquo; som inte fördelas.
              </p>
            </div>

            {/* Enskild egendom input */}
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
                <p className="text-xs text-muted mt-1">
                  Belopp som enligt äktenskapsförord tillhör bara den avlidne eller bara efterlevande maken/makan.
                </p>
              </div>
            )}

            {/* Calculation breakdown */}
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
                <p className="text-xs text-muted mt-1">
                  Hälften av giftorättsgodset. Makan/maken får detta belopp direkt.
                </p>
              </div>

              <div className="bg-accent/10 rounded-card p-3">
                <p className="text-xs text-muted uppercase font-semibold mb-2">Till dödsboet (arvskifte)</p>
                <p className="text-lg font-bold text-accent">{formatSEK(totalToEstate)}</p>
                <p className="text-xs text-muted mt-1">
                  Andra hälften av giftorättsgodset plus eventuell enskild egendom som går till arvskifte.
                </p>
              </div>
            </div>
          </div>

          {/* Steps section */}
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
                {
                  step: '1. Inventering av giftorättsgods',
                  desc: 'Identifiera vilken egendom som är giftorättsgods. Kontrollera om det finns äktenskapsförord som markerar något som "enskild egendom".',
                },
                {
                  step: '2. Värdering',
                  desc: 'Fastställ värdet på giftorättsgodset. Giftorättsgodset är alla tillgångar minus alla skulder.',
                },
                {
                  step: '3. Upprättande av bodelningshandling',
                  desc: 'En skriftlig överenskommelse upprättas som visar hur giftorättsgodset delas 50/50. Båda makarna (eller deras representanter) måste godkänna.',
                },
                {
                  step: '4. Underrättelse och godkännande',
                  desc: 'Alla parter måste godkänna bodelningshandlingen. Om ingen kan uppnå överenskommelse kan domstol avgöra.',
                },
                {
                  step: '5. Överföring av egendom',
                  desc: 'Makan/maken får sin andel direkt. Resten går in i dödsboet för arvskifte.',
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
                <p className="text-xs font-medium text-muted">Äktenskapsbalken (1987:230)</p>
                <p className="text-xs text-primary/70">
                  <strong>Kapitel 9-10:</strong> Reglerar bodelning vid dödsfall och äktenskapets upplösning.
                  Giftorättsgodset (den egendom som båda makarna äger) delas 50/50 såvida inte
                  äktenskapsförord säger något annat.
                </p>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-muted">Tvangsfullbordingsbalken (1981:774)</p>
                <p className="text-xs text-primary/70">
                  <strong>Kapitel 1-2:</strong> Innehåller regler om hur bodelning genomförs när
                  parterna inte kan enas.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mb-6">
            <Link href="/arvskifte" className="btn-primary flex items-center justify-center gap-2">
              Gå till arvskifte
              <ChevronUp className="w-5 h-5" style={{ transform: 'rotate(90deg)' }} />
            </Link>
            <Link href="/delagare" className="btn-secondary flex items-center justify-center gap-2">
              Lägg till dödsbodelägare
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="bg-primary-lighter/30 rounded-card p-4 mb-4">
            <p className="text-xs text-muted leading-relaxed">
              Denna bodelningskalkylator ger en uppskattning baserad på dina inmatade värden. Faktisk bodelning
              kan påverkas av äktenskapsförord, gåvor, skulder tillhörande enskild egendom, och andra faktorer.
              Vi rekommenderar att du kontaktar en jurist eller dödsboförrättare för bindande rådgivning om
              bodelning. Bodelning MÅSTE genomföras innan arvskifte kan ske om den avlidne var gift.
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
