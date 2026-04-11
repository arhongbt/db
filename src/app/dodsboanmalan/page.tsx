'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  ChevronRight,
  Building2,
  Home,
} from 'lucide-react';

function DodsboanmalanContent() {
  const { state } = useDodsbo();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Calculate totals
  const totalTillgangar = state.tillgangar.reduce(
    (sum, t) => sum + (t.estimatedValue ?? 0), 0
  );
  const totalSkulder = state.skulder.reduce(
    (sum, s) => sum + (s.amount ?? 0), 0
  );

  // Begravningskostnad estimate (if not explicitly set, estimate 25000 kr)
  const begravningskostnad = state.skulder
    .filter((s) => s.type === 'begravningskostnad')
    .reduce((sum, s) => sum + (s.amount ?? 0), 0) || 25000;

  const nettotillgangar = totalTillgangar - begravningskostnad;

  const PRISBASBELOPP = 57300; // 2025/2026
  const hasRealEstate = state.tillgangar.some((t) =>
    ['villa', 'bostadsratt', 'fritidshus'].includes(t.type)
  );

  // Qualification criteria
  const qualifies = {
    assetsUnderLimit: nettotillgangar <= PRISBASBELOPP,
    noRealEstate: !hasRealEstate,
    simple: true, // User will determine this
  };

  const allQualified = qualifies.assetsUnderLimit && qualifies.noRealEstate;

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(amount);

  const CriterionRow = ({
    label,
    met,
    value,
  }: {
    label: string;
    met: boolean;
    value?: string;
  }) => (
    <div className="flex items-center gap-3 py-3 px-4 rounded-card border-2 border-gray-200 mb-3">
      {met ? (
        <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
      ) : (
        <XCircle className="w-6 h-6 text-warn flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${met ? 'text-primary' : 'text-primary'}`}>
          {label}
        </p>
        {value && <p className="text-xs text-muted mt-0.5">{value}</p>}
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-semibold text-primary">Dödsboanmälan</h1>
          <p className="text-muted text-sm">
            Enklare alternativ för mindre dödsbon
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Vad är dödsboanmälan?</p>
            <p className="text-sm text-primary/70 mt-1">
              För små dödsbon utan fastighet kan du göra en enklare dödsboanmälan direkt
              till kommunens socialförvaltning istället för att upprätta en formell
              bouppteckning till Skatteverket. Socialnämnden hanterar sedan anmälan åt
              dödsboet.
            </p>
          </div>
        </div>
      </div>

      {/* Assessment based on state data */}
      {(state.tillgangar.length > 0 || totalSkulder > 0) && (
        <div className="card mb-6">
          <h2 className="text-base font-semibold text-primary mb-4">
            Är dödsboanmälan möjligt?
          </h2>

          <CriterionRow
            label="Tillgångar (minus begravningskostnad) understiger prisbasbeloppet"
            met={qualifies.assetsUnderLimit}
            value={`${formatSEK(nettotillgangar)} / ${formatSEK(PRISBASBELOPP)}`}
          />

          <CriterionRow
            label="Ingen fastighet eller bostadsrätt ägs"
            met={qualifies.noRealEstate}
            value={
              hasRealEstate
                ? `Fastighet/bostadsrätt funnen: ${state.tillgangar
                    .filter((t) =>
                      ['villa', 'bostadsratt', 'fritidshus'].includes(t.type)
                    )
                    .map((t) => t.description)
                    .join(', ')}`
                : 'Ingen fastighet registrerad'
            }
          />

          {allQualified && (
            <div className="mt-4 p-4 bg-success/10 border-l-4 border-success rounded-card">
              <p className="text-sm font-medium text-success">
                ✓ Dödsbon verkar kvalificera för dödsboanmälan
              </p>
              <p className="text-xs text-primary/70 mt-1">
                Slutlig bedömning gör kommunen när du ansöker.
              </p>
            </div>
          )}

          {!allQualified && (
            <div className="mt-4 p-4 bg-warn/10 border-l-4 border-warn rounded-card">
              <p className="text-sm font-medium text-warn">
                Dödsbon verkar inte kvalificera för dödsboanmälan
              </p>
              <p className="text-xs text-primary/70 mt-1">
                En full bouppteckning behövs troligen. Du kan kontakta kommunen för
                bedömning.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Criteria checklist */}
      <div className="card mb-6">
        <h2 className="text-base font-semibold text-primary mb-4">
          Krav för dödsboanmälan
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex gap-3 pb-3 border-b border-gray-200">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-primary">
                Tillgångar (minus begravningskostnad) understiger prisbasbeloppet
              </p>
              <p className="text-xs text-muted mt-1">
                För 2025/2026: högst {formatSEK(PRISBASBELOPP)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pb-3 border-b border-gray-200">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-primary">
                Ingen fastighet eller tomträtt ägs
              </p>
              <p className="text-xs text-muted mt-1">
                Villa, bostadsrätt eller fritidshus är inte tillåtet
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-primary">
                Dödsboet har inga komplicerade förhållanden
              </p>
              <p className="text-xs text-muted mt-1">
                T.ex. inga tvister, komplexa skulder eller testamentskomplexitet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process steps */}
      <div className="card mb-6">
        <h2 className="text-base font-semibold text-primary mb-4">Processen</h2>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0">
              1
            </div>
            <div className="pt-0.5">
              <p className="font-medium text-primary">Kontakta kommunens socialförvaltning</p>
              <p className="text-xs text-muted mt-1">
                Ring eller besök kommunens socialkontor och presentera dödsboet
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0">
              2
            </div>
            <div className="pt-0.5">
              <p className="font-medium text-primary">Socialnämnden bedömer</p>
              <p className="text-xs text-muted mt-1">
                Kommunen kontrollerar att kraven är uppfyllda
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0">
              3
            </div>
            <div className="pt-0.5">
              <p className="font-medium text-primary">Socialnämnden gör dödsboanmälan</p>
              <p className="text-xs text-muted mt-1">
                Kommunen anmäler dödsboet till Skatteverket åt dig
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-success/20 text-success font-semibold text-sm flex-shrink-0">
              ✓
            </div>
            <div className="pt-0.5">
              <p className="font-medium text-primary">Mycket enklare än bouppteckning</p>
              <p className="text-xs text-muted mt-1">
                Ingen förrättning behövs, inga förrättningsmän krävs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="card mb-6">
        <h2 className="text-base font-semibold text-primary mb-4">
          Dödsboanmälan vs Bouppteckning
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 px-2 font-semibold text-primary">
                  Aspekt
                </th>
                <th className="text-left py-2 px-2 font-semibold text-accent">
                  Dödsboanmälan
                </th>
                <th className="text-left py-2 px-2 font-semibold text-primary/70">
                  Bouppteckning
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-2 font-medium text-primary">Vem gör det?</td>
                <td className="py-2 px-2 text-primary">Kommunen</td>
                <td className="py-2 px-2 text-primary/70">Dödsbodelägare</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-primary">Förrättningsmän</td>
                <td className="py-2 px-2 text-success">Ej behövligt</td>
                <td className="py-2 px-2 text-warn">2 krävs</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-primary">Omfattning</td>
                <td className="py-2 px-2 text-primary">Snabb anmälan</td>
                <td className="py-2 px-2 text-primary/70">Detaljerat dokument</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-primary">Kostnad</td>
                <td className="py-2 px-2 text-success">Gratis</td>
                <td className="py-2 px-2 text-warn">Kan vara dyr</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-primary">Tidsram</td>
                <td className="py-2 px-2 text-success">Veckor</td>
                <td className="py-2 px-2 text-primary/70">3-4 månader</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning box */}
      <div className="warning-box mb-6">
        <div className="flex gap-2">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-primary text-sm">Viktigt</p>
            <p className="text-sm text-primary/70 mt-1">
              Om du är osäker på vilken väg som passar bäst för dödsboet — gör
              bouppteckning. Det är alltid rätt och säkert, och det finns ingen risk
              för misstag.
            </p>
          </div>
        </div>
      </div>

      {/* Links to related pages */}
      <div className="flex flex-col gap-3 mb-6">
        <Link
          href="/bouppteckning"
          className="card flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-muted" />
            <div>
              <p className="font-medium text-primary">Läs om bouppteckning</p>
              <p className="text-xs text-muted">Formell väg för större dödsbon</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted flex-shrink-0" />
        </Link>

        <a
          href="#kontakt-kommun"
          className="card flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-muted" />
            <div>
              <p className="font-medium text-primary">Hitta din kommun</p>
              <p className="text-xs text-muted">
                Sök kontaktuppgifter till lokalsamhällets socialförvaltning
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted flex-shrink-0" />
        </a>
      </div>

      {/* Legal reference */}
      <div className="card mb-6 bg-primary-lighter/10">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Juridisk grund
        </p>
        <p className="text-sm text-primary/70">
          Ärvdabalken 20 kap. 8a § — Dödsboanmälan för små dödsbon utan fastighet
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

export default function DodsboanmalanPage() {
  return (
    <DodsboProvider>
      <DodsboanmalanContent />
    </DodsboProvider>
  );
}
