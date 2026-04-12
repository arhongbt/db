'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/ui/BottomNav';
import {
  ArrowLeft,
  Wallet,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function DodsboSkulderContent() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqItems = [
    {
      id: 'inherit-debt',
      question: 'Ärver man ALDRIG skulder i Sverige?',
      answer:
        'Rätt. I Sverige ärver man inte skulder. Du är aldrig personligen ansvarig för den avlidnes skulder. Dock är dödsboet (som juridisk enhet) skyldigt att betala skulder från dess tillgångar. Om dödsboet inte har pengar för att betala skulderna kan dödsboet bli "insolvent" — då får borgenärer inte full betalning.',
    },
    {
      id: 'estate-debts',
      question: 'Hur betalas skulder från dödsboet?',
      answer:
        'Dödsboets skulder betalas från dödsboets tillgångar innan arvet fördelas. Först dras kostnader (begravning, bouppteckning, etc.), sedan betalas skulderna i en viss ordning (se prioritet nedan). Återstoden (nettot) delas sedan mellan arvingarna enligt arvsordningen.',
    },
    {
      id: 'insolvent-estate',
      question: 'Vad händer om dödsboet är insolvent (för många skulder)?',
      answer:
        'Om skulderna är större än tillgångarna kallas dödsboet "insolvent" eller ett "dödsbo minus". I det fallet betalas skulderna i en strikt prioritetsordning (se prioritering nedan). Vissa borgenärer får bara partiell betalning eller ingenting. Arvingarna blir INTE personligt ansvariga för det underskuddet.',
    },
    {
      id: 'dodsboannmalan',
      question: 'Vad är dödsboanmälan och när använder man den?',
      answer:
        'Dödsboanmälan är ett sätt att slippa personligt ansvar för dödsboets skulder. Den kan lämnas in för att formellt anmäla dödsboet till domstolen, vilket ger extra juridisk skydd. Det är särskilt viktigt vid misstanke om stora skulder eller komplicerade situationer. Se mer på sidan "Dödsboanmälan".',
    },
    {
      id: 'shared-loan',
      question: 'Vad händer om den avlidne hade ett lån tillsammans med någon (solidarisk skuld)?',
      answer:
        'Om lånet var solidariskt (t.ex. bolån tillsammans med en make eller sambo) är den andra personen fortfarande ansvarig för sin del. Dödsboet måste betala sin andel. Den andra personen kan inte låta dödsboet betala hela utan måste reglera sin del enligt låneavtalet.',
    },
    {
      id: 'borgen',
      question: 'Vad händer med borgen (när man är borgen för någon)?',
      answer:
        'Om den avlidne var borgen för någon annan (t.ex. borgen för ett barn) kan borgen försäljas eller eftergivas när den avlidne dör. Dödsboet är inte personligt ansvarigt för borgen, men borgen kan påverka dödsboets värde. En borgenär kan söka dödsboet för full betalning enligt borgen.',
    },
    {
      id: 'priority-order',
      question: 'I vilken ordning betalas skulderna?',
      answer:
        'Skulderna betalas i denna ordning: 1) Begravningskostnader (högst prioritet), 2) Dödsboets administrationskostnader (advokat, bouppteckning etc.), 3) Arbetslöne- och pensionsskulder, 4) Skatteskulder, 5) Övriga fordringar (privatpersoner, företag, bolån etc.). Finns inte pengar når senare prioriteter inte.',
    },
    {
      id: 'credit-card',
      question: 'Vad händer med kreditkort och andra konsumentkrediter?',
      answer:
        'Kreditkorts- och konsumentkrediter är vanliga skulder och betalas från dödsboet. Om dödsboet inte har pengar kan borgenärerna göra anspråk men få ingen full betalning. Arvingarna är INTE personligt ansvariga för dessa skulder.',
    },
  ];

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Wallet className="w-7 h-7 text-accent" />
        <h1 className="text-2xl font-semibold text-primary">Dödsbo och skulder</h1>
      </div>
      <p className="text-muted mb-6">
        Allt om hur skulder hanteras när någon dör. I Sverige ärver du aldrig personligt ansvar för skulder.
      </p>

      {/* Key reassurance message */}
      <div className="card mb-6 border-2 border-accent/20 bg-accent/5">
        <div className="flex gap-3">
          <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-primary mb-1">
              Man ärver ALDRIG skulder i Sverige
            </p>
            <p className="text-sm text-primary">
              Du är aldrig personligt ansvarig för den avlidnes skulder. Dödsboet är ansvarigt,
              men om det inte finns pengar kan skulder lämnas obetald. Du förlorar bara det arv
              du hade räknats få.
            </p>
          </div>
        </div>
      </div>

      {/* How debts are paid */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Så hanteras skulder från dödsboet
        </h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 flex-shrink-0 text-xs font-bold text-accent">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Börja med tillgångarna</p>
              <p className="text-xs text-muted mt-0.5">
                Dödsboet har pengar, fastigheter, aktier, försäkringar etc.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 flex-shrink-0 text-xs font-bold text-accent">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Dra av kostnader</p>
              <p className="text-xs text-muted mt-0.5">
                Begravning, juridik, bouppteckning, värdering — detta betalas först
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 flex-shrink-0 text-xs font-bold text-accent">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Betala skulder</p>
              <p className="text-xs text-muted mt-0.5">
                Lån, kreditkort, skatter, buskehållsskulder betalas i prioriteringsordning
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 flex-shrink-0 text-xs font-bold text-accent">
              4
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Dela resten</p>
              <p className="text-xs text-muted mt-0.5">
                Vad som blir över (nettot) fördelas mellan arvingarna
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insolvent estate explanation */}
      <div className="card mb-6 bg-[#FDF6EA] border border-warn/20">
        <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warn" />
          Vad är ett insolvent dödsbo?
        </h3>
        <p className="text-sm text-primary mb-3">
          Om skulderna är större än tillgångarna kallas det &quot;dödsbo minus&quot; eller ett insolvent dödsbo.
          Då räcker pengarna inte för att betala alla skulder.
        </p>
        <div className="space-y-2 text-sm text-primary">
          <p>
            <strong>Vad händer då?</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-1">
            <li>Skulderna betalas i strikt prioriteringsordning</li>
            <li>Senare fordringar får bara partiell betalning eller ingenting</li>
            <li>Arvingarna förlorar sitt arv men är INTE personligt ansvariga</li>
            <li>En dödsboanmälan kan lämnas in för att formalisera situationen</li>
          </ul>
        </div>
      </div>

      {/* Prioritization of debts */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Prioritering av skuldbetalning
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-[#E8E4DE] last:border-0">
            <span className="text-sm text-primary">
              <strong>1. Begravning &amp; ceremoni</strong>
            </span>
            <span className="text-xs font-semibold text-accent">Högst prio</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#E8E4DE]">
            <span className="text-sm text-primary">2. Dödsboets administrationskostnader</span>
            <span className="text-xs text-muted">(juridik, bouppteckning)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#E8E4DE]">
            <span className="text-sm text-primary">3. Arbetslöne- &amp; pensionsskulder</span>
            <span></span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#E8E4DE]">
            <span className="text-sm text-primary">4. Skatteskulder</span>
            <span></span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-primary">
              <strong>5. Övriga skulder</strong>
            </span>
            <span className="text-xs font-semibold text-warn">Lägst prio</span>
          </div>
        </div>
        <p className="text-xs text-muted mt-3 p-2 bg-white rounded">
          Om dödsboet är insolvent kan låga prioriteter få mindre eller ingenting.
        </p>
      </div>

      {/* FAQ */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Vanliga frågor
        </h2>
        <div className="space-y-2">
          {faqItems.map((item) => (
            <div key={item.id} className="card">
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === item.id ? null : item.id)
                }
                className="w-full flex items-center justify-between py-1"
              >
                <p className="text-sm font-medium text-primary text-left">
                  {item.question}
                </p>
                {expandedFaq === item.id ? (
                  <ChevronUp className="w-4 h-4 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
                )}
              </button>
              {expandedFaq === item.id && (
                <div className="mt-2 pt-2 border-t border-[#E8E4DE]">
                  <p className="text-sm text-primary/80 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Important concept - Borgen */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary mb-1">
              Viktigt: Borgen är inte arv
            </p>
            <p className="text-sm text-primary/80">
              Om den avlidne var borgen för någon kan dödsboet behöva betala detta.
              Men borgen påverkar inte arvningen — det är en skuld från dödsboet.
            </p>
          </div>
        </div>
      </div>

      {/* Related links */}
      <div className="space-y-2 mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
          Läs mer
        </h2>
        <Link
          href="/dodsboanmalan"
          className="card flex items-center justify-between hover:bg-white transition-colors"
        >
          <span className="text-sm font-medium text-primary">Dödsboanmälan</span>
          <ChevronRight className="w-4 h-4 text-muted" />
        </Link>
        <Link
          href="/juridisk-hjalp"
          className="card flex items-center justify-between hover:bg-white transition-colors"
        >
          <span className="text-sm font-medium text-primary">
            Juridisk AI-assistent
          </span>
          <ChevronRight className="w-4 h-4 text-muted" />
        </Link>
        <Link
          href="/arvskifte"
          className="card flex items-center justify-between hover:bg-white transition-colors"
        >
          <span className="text-sm font-medium text-primary">Arvskifte</span>
          <ChevronRight className="w-4 h-4 text-muted" />
        </Link>
      </div>

      {/* Legal disclaimer */}
      <div className="bg-primary-lighter/30 rounded-card p-4 mb-6">
        <p className="text-xs text-muted leading-relaxed">
          Denna information är baserad på svensk lag (Ärvdabalken). Det är inte juridisk
          rådgivning. Vid komplicerade situationer eller osäkerhet rekommenderas juridisk
          konsultation. Borgenärer kan alltid välja att göra anspråk på dödsboet för sina
          fordringar.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

export default function DodsboSkulderPage() {
  return <DodsboSkulderContent />;
}
