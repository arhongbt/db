'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  Phone,
  Building2,
  Heart,
  ShieldCheck,
  Mail,
  Landmark,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

interface NodbromsStep {
  id: string;
  day: string;
  title: string;
  icon: typeof Phone;
  urgency: 'akut' | 'viktig' | 'bra_att_veta';
  description: string;
  details: string[];
  tips?: string;
  phone?: string;
  url?: string;
}

const NODBROMS_STEPS: NodbromsStep[] = [
  {
    id: 'lugn',
    day: 'Dag 1',
    title: 'Andas. Du behöver inte göra allt idag.',
    icon: Heart,
    urgency: 'bra_att_veta',
    description: 'Det enda du måste göra dag 1 är att ta hand om dig själv. Allt annat kan vänta.',
    details: [
      'Det finns inga juridiska krav de allra första dagarna.',
      'Dödsbeviset utfärdas automatiskt av läkaren.',
      'Skatteverket underrättas automatiskt.',
      'Kontakta närstående i din egen takt.',
    ],
    tips: 'Om du behöver prata med någon: Jourhavande medmänniska 08-702 16 80 (kvällar/nätter).',
  },
  {
    id: 'begravning',
    day: 'Dag 1–3',
    title: 'Kontakta begravningsbyrå',
    icon: Heart,
    urgency: 'viktig',
    description: 'De kan hjälpa med transport, planering och praktiska detaljer. Många erbjuder kostnadsfri rådgivning.',
    details: [
      'Du behöver inte välja byrå direkt — de flesta ger gratis offert.',
      'Begravning ska ske inom 30 dagar (kan förlängas).',
      'Kremering ska ske inom 30 dagar efter dödsfallet.',
      'Alla i Sverige har rätt till begravning — begravningsavgiften ingår i skatten.',
      'Kostnaden varierar 15 000 – 50 000 kr beroende på önskemål.',
    ],
    tips: 'Fråga om den avlidne hade önskemål nedskrivna. Kolla med nära anhöriga och eventuellt testamente.',
  },
  {
    id: 'bank',
    day: 'Dag 2–5',
    title: 'Kontakta banken',
    icon: Landmark,
    urgency: 'akut',
    description: 'Meddela banken om dödsfallet så att konton hanteras korrekt. Ta med dödsbevis.',
    details: [
      'Konton spärras inte automatiskt — du måste meddela banken.',
      'Autogiro och stående överföringar fortsätter tills banken meddelas.',
      'Hyra, el och andra nödvändiga räkningar kan ofta betalas av dödsboet.',
      'Banken kan ge kontoutdrag per dödsdagen (behövs för bouppteckning).',
      'Du behöver: dödsbevis, legitimation, ev. fullmakt från andra delägare.',
    ],
    tips: 'Be banken stoppa autogiro för onödiga abonnemang (gym, streaming) men behåll hyra och el.',
  },
  {
    id: 'forsakring',
    day: 'Dag 3–7',
    title: 'Kontrollera försäkringar',
    icon: ShieldCheck,
    urgency: 'akut',
    description: 'Livförsäkringar och grupplivförsäkringar kan ge utbetalning. Kontakta arbetsgivare och försäkringsbolag.',
    details: [
      'Arbetsgivarens grupplivförsäkring — ofta 1–3 prisbasbelopp (ca 57 000–171 000 kr).',
      'Fackförbundets grupplivförsäkring — fråga facket.',
      'Privat livförsäkring via bank eller försäkringsbolag.',
      'Kontrollera hemförsäkringen — kan ha dödsfallsskydd.',
      'Tjänstepension — kontakta Alecta, AMF eller arbetsgivarens pensionsbolag.',
      'Anmälningsfrist varierar: oftast 6 månader, ibland kortare.',
    ],
    tips: 'Kolla minpension.se för att se alla pensioner. Ring försäkringsbolagen — de guidar dig.',
    url: 'https://www.minpension.se',
  },
  {
    id: 'bostad',
    day: 'Dag 3–7',
    title: 'Kontakta hyresvärd eller BRF',
    icon: Building2,
    urgency: 'viktig',
    description: 'Meddela hyresvärden/BRF om dödsfallet. Dödsboet har särskild uppsägningstid.',
    details: [
      'Hyresrätt: Dödsboet kan säga upp med bara 1 månads uppsägningstid (istf normalt 3).',
      'Bostadsrätt: Behöver inte säljas omedelbart, men bör värderas.',
      'Hyran måste fortsätta betalas så länge kontraktet löper.',
      'Make/maka eller sambo kan ha rätt att överta bostaden.',
    ],
    tips: 'Ingen brådska att tömma bostaden — gör det i din egen takt.',
  },
  {
    id: 'post',
    day: 'Dag 5–7',
    title: 'Eftersänd post',
    icon: Mail,
    urgency: 'viktig',
    description: 'Anmäl eftersändning av den avlidnes post till din adress via PostNord.',
    details: [
      'Viktigt för att inte missa räkningar, brev från myndigheter, försäkringsutbetalningar.',
      'Kostar ca 200 kr för 3 månader.',
      'Kan göras online på postnord.se eller via telefon.',
    ],
    tips: 'Gör detta tidigt — brev med frister kan annars missas.',
    url: 'https://www.postnord.se/ta-emot/eftersandning',
  },
];

function NodbromsContent() {
  const { state } = useDodsbo();
  const [expandedId, setExpandedId] = useState<string | null>('lugn');
  const [doneSteps, setDoneSteps] = useState<Set<string>>(new Set());

  const toggleDone = (id: string) => {
    setDoneSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const urgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'akut':
        return <span className="px-2 py-0.5 bg-red-100 text-warn text-xs font-semibold rounded-full">Akut</span>;
      case 'viktig':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">Viktigt</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary">Nödbroms</h1>
          <p className="text-muted text-sm">De första 7 dagarna</p>
        </div>
      </div>

      {/* Reassurance box */}
      <div className="info-box mb-6 mt-4">
        <p className="text-sm">
          <strong>Du klarar det här.</strong> Det finns inga krav på att allt ska ske på en gång.
          Gör en sak i taget, i din egen takt. Denna lista är en guide — inte en deadline.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-success rounded-full transition-all duration-500"
            style={{ width: `${(doneSteps.size / NODBROMS_STEPS.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted">
          {doneSteps.size}/{NODBROMS_STEPS.length}
        </span>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {NODBROMS_STEPS.map((step) => {
          const isDone = doneSteps.has(step.id);
          const isExpanded = expandedId === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`card transition-all ${isDone ? 'opacity-60' : ''}`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : step.id)}
                className="w-full flex items-start gap-3 text-left"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDone(step.id);
                  }}
                  className="mt-0.5 flex-shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-accent">{step.day}</span>
                    {urgencyBadge(step.urgency)}
                  </div>
                  <p className={`font-medium ${isDone ? 'line-through text-muted' : 'text-primary'}`}>
                    {step.title}
                  </p>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="mt-4 ml-9">
                  <p className="text-sm text-primary/80 mb-3">{step.description}</p>

                  <ul className="space-y-2 mb-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex gap-2 text-sm text-primary/70">
                        <span className="text-accent mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {step.tips && (
                    <div className="bg-primary-lighter/30 rounded-card p-3 text-sm">
                      <strong className="text-primary">Tips:</strong>{' '}
                      <span className="text-primary/80">{step.tips.split(/(\d[\d\s-]{6,})/).map((part: string, j: number) => {
                        const digits = part.replace(/[^0-9]/g, '');
                        return digits.length >= 8 ? (
                          <a key={j} href={`tel:${digits}`} className="text-accent hover:underline">{part}</a>
                        ) : part;
                      })}</span>
                    </div>
                  )}

                  {step.url && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-sm text-accent font-medium">
                        <ExternalLink className="w-4 h-4" />
                        {step.url.replace('https://', '').replace('www.', '')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}

export default function NodbromsPage() {
  return (
    <DodsboProvider>
      <NodbromsContent />
    </DodsboProvider>
  );
}
