'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  Baby,
  ChevronRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { MikeRossTip } from '@/components/ui/MikeRossTip';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Vad är särkullbarn?',
    answer:
      'Särkullbarn är barn som endast en av föräldrarna är gemensam för. I en ny relation där en eller båda parter har barn från tidigare förhållanden, är dessa barn särkullbarn gentemot den nya partnerns andra barn.',
  },
  {
    question: 'Vilken arvsrätt har särkullbarn?',
    answer:
      'Särkullbarn ärver enligt samma arvsordning som vanliga barn, men de har särskilda rättigheter. De kan kräva ut sin arvslott (laglott) omedelbar när dödsboet är till och från, utan att behöva vänta på den efterlevande makens eller makans bortgång.',
  },
  {
    question: 'Vad är skillnaden mellan laglott och arvslott?',
    answer:
      'Arvslott är den del av arvet som utgör en arvings lagliga andel. Laglott är hälften av arvslotten, vilket är det minimibelopp en arvinge har rätt till även om testamentet fördelar arvet annorlunda. För särkullbarn är laglotten en viktig skyddsrätt.',
  },
  {
    question: 'Kan särkullbarn välja att inte ta ut sitt arv omedelbar?',
    answer:
      'Ja. Särkullbarn kan frivilligt välja att inte kräva ut sin laglott direkt. De kan då låta pengarna stanna i dödsboet för att stödja den återstående maken eller makan. Detta måste göras frivilligt och skriftligt.',
  },
  {
    question: 'Hur beräknas laglotten för särkullbarn?',
    answer:
      'Laglotten är hälften av arvslotten. Arvslotten beräknas genom att dödsboets nettoförmögenhet divideras med antal arvingar. För särkullbarn: laglott = (nettoförmögenhet ÷ antal arvingar) ÷ 2.',
  },
  {
    question: 'Kan den efterlevande maken/makan vägra särkullbarnets arv?',
    answer:
      'Nej. Den efterlevande maken/makan kan inte vägra särkullbarnets lagliga rätt till laglotten. Om särkullbarnet kräver sitt belopp, måste det betalas ut från dödsboet.',
  },
  {
    question: 'Vad händer om det inte finns tillräckligt med pengar för laglotten?',
    answer:
      'Om dödsboet inte har tillräckligt med likvida medel kan dödsboet behöva sälja tillgångar (fastigheter, värdepapper) eller ta lån för att betala ut laglotten.',
  },
  {
    question: 'Behöver särkullbarn godkänna arvskiftet?',
    answer:
      'Ja, alla arvingar, inklusive särkullbarn, måste godkänna arvskifteshandlingen. Om särkullbarnet inte är myndig måste deras förälder godkänna.',
  },
];

export default function SarkullbarnPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-background transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary">Särkullbarn och arv</h1>
          <p className="text-muted text-sm">Speciella rättigheter i arvskiftet</p>
        </div>
      </div>

      <MikeRossTip text="Särkullbarn är juridiskt skyddade — de kan kräva sin laglott (halva arvslotten) direkt vid dödsfallet, utan att vänta på att styvföräldern också dör. Det kan skapa ekonomisk press om bostad eller kapital är bundet. Planera detta tidigt." />

      {/* Intro info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Vad är särkullbarn?</p>
            <p className="text-sm text-primary/70 mt-1">
              Särkullbarn är barn från tidigare relationer i en ny familj. De har samma arvsrätt som andra barn,
              men med en viktig skillnad: de kan kräva ut sin laglott omedelbar utan att behöva vänta på
              den återstående makens eller makans död.
            </p>
          </div>
        </div>
      </div>

      {/* Key rights section */}
      <div className="card border-l-4 border-accent mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Baby className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-primary">Särkullbarns speciella rättigheter</h2>
        </div>

        <div className="space-y-4">
          <div className="border-l-2 border-accent pl-4">
            <p className="font-medium text-primary text-sm mb-1">1. Rätt till omedelbar utbetalning</p>
            <p className="text-sm text-primary/70">
              Till skillnad från andra barn kan särkullbarn kräva att få sin laglott utbetald direkt från dödsboet,
              utan att behöva vänta på den efterlevande makens eller makans bortgång.
            </p>
          </div>

          <div className="border-l-2 border-accent pl-4">
            <p className="font-medium text-primary text-sm mb-1">2. Laglott är ett säkrat belopp</p>
            <p className="text-sm text-primary/70">
              Laglotten är hälften av arvslotten och kan inte tas bort genom testamente. Detta är ett viktigt skydd
              för särkullbarn.
            </p>
          </div>

          <div className="border-l-2 border-accent pl-4">
            <p className="font-medium text-primary text-sm mb-1">3. Frivillig avstäelse möjlig</p>
            <p className="text-sm text-primary/70">
              Särkullbarn kan frivilligt välja att inte ta ut sin laglott omedelbar för att stödja den efterlevande
              maken eller makan, men detta måste göras skriftligt.
            </p>
          </div>
        </div>
      </div>

      {/* Warning about laglott calculation */}
      <div className="warning-box mb-6">
        <div className="flex gap-2">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warn text-sm mb-1">Laglotten är hälften av arvslotten</p>
            <p className="text-sm text-primary/70">
              Många förväxlar laglott med arvslott. Om det finns 100 000 kr att dela mellan två arvingar är arvslotten
              50 000 kr var, men laglotten är bara 25 000 kr. Detta är viktigt att förstå vid beräkningen av vad
              särkullbarnet har rätt till.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-step guide */}
      <div className="mb-6">
        <h2 className="font-semibold text-primary mb-3 text-sm">Praktiska steg för särkullbarn</h2>
        <div className="space-y-3">
          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Förstå arvsordningen</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Be någon från dödsboet förklara hur många som ärver och hur stor din andel blir.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Beräkna din laglott</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Laglotten = (dödsboets värde ÷ antal arvingar) ÷ 2. Fråga dödsboets skiftesman om du är osäker.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Besluta om du vill ha pengarna nu</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Du kan kräva utbetalning direkt eller frivilligt välja att låta pengarna stanna för den återstående makens/makans räkning.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Meddela ditt beslut skriftligt</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Berätta för dödsboets skiftesman eller de andra arvingarna vad du vill göra. Gör det skriftligt för dokumentering.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex-shrink-0">
                5
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Godkänn arvskifteshandlingen</p>
                <p className="text-sm text-primary/70 mt-0.5">
                  Alla arvingar, inklusive särkullbarn, måste underteckna arvskifteshandlingen för att arvskiftet är giltigt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips section */}
      <div className="card mb-6">
        <h3 className="font-semibold text-primary mb-3 text-sm">Tips för särkullbarn</h3>
        <ul className="space-y-2">
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Be om en klar skriftlig redovisning av dödsboets värde och din beräknade andel.</span>
          </li>
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Om du är ung eller omyndig kan din förälder göra ärenden på dina vägnar.</span>
          </li>
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Spara alla brev och mötes-anteckningar från dödsboet för din dokumentation.</span>
          </li>
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Du kan be att få en oberoende juridisk granskning om du misstänker något är fel.</span>
          </li>
          <li className="flex gap-2 text-sm text-primary/70">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span>Tala med båda dina föräldrar om du är osäker på vad som är rätt.</span>
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="mb-6">
        <h2 className="font-semibold text-primary mb-3 text-sm">Vanliga frågor</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              className="card text-left w-full"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-primary text-sm pr-3">{item.question}</p>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </div>
              {expandedFAQ === index && (
                <div className="mt-3 pt-3 border-t border-[#E8E4DE]">
                  <p className="text-sm text-primary/70">{item.answer}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CTA to legal help */}
      <Link href="/juridisk-hjalp" className="btn-primary flex items-center justify-center gap-2 mb-6">
        Juridisk hjälp
        <ChevronRight className="w-5 h-5" />
      </Link>

      {/* Legal disclaimer */}
      <div className="bg-primary-lighter/30 rounded-card p-4 mb-4">
        <p className="text-xs text-muted leading-relaxed">
          Denna information är allmän vägledning baserad på ärvdabalken. Särkullbarns rättigheter kan vara komplexa
          och varierar beroende på testamente, familjesituation och andra faktorer. För bindande juridisk rådgivning
          och specifika frågor om ditt enskilda fall, kontakta en jurist eller skiftesman.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
