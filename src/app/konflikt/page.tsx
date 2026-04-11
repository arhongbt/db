'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Users,
  Gavel,
  FileText,
} from 'lucide-react';

interface ConflictScenario {
  title: string;
  description: string;
}

const CONFLICT_SCENARIOS: ConflictScenario[] = [
  {
    title: 'Vem ska ha bostaden?',
    description: 'Om dödsboet innehåller ett hem kan det bli konflikt om flera arvingar vill ha det. Lösningar: En person köper ut övriga, bostaden säljs och intäkten fördelas, eller en person får bostaden men övriga får motsvarande värde från andra tillgångar.',
  },
  {
    title: 'Oenighet om lösöre (möbler, smycken)',
    description: 'Ofta emotionellt känsliga föremål. Försök dokumentera vad den avlidne önskade. Om ingen önskemål finns kan ni göra en enkel auktion mellan arvingarna, eller en person köper ut övriga.',
  },
  {
    title: 'Misstanke om dold tillgång',
    description: 'Om en arving misstänker att tillgångar dolts kan en rättegång bli nödvändig. Det är dyrare än medling. Börja med att fråga rakt på om det finns dolda tillgångar, och be att få se alla relevanta handlingar.',
  },
  {
    title: 'Särkullbarn vs make/maka',
    description: 'Särkullbarn (barn från annan relation) har rätt att få sin arvslott direkt. Den efterlevande maken/makan kan inte förhindra det. Kan lösas genom att den efterlevande får del av bostaden och särkullbarnet får annat, eller genom avtal.',
  },
  {
    title: 'Klander av testamente',
    description: 'En arving kan klandra (ifrågasätta) testamentet om det är gjort under påtryckningar, bedrägerier eller av någon som inte var testamentsför. Det är ett formellt juridiskt förfarande som kan bli mycket dyrt.',
  },
];

interface EscalationLevel {
  id: string;
  title: string;
  icon: typeof Users;
  description: string;
  details: string[];
  legalRef?: string;
  costs?: string;
}

const ESCALATION_LEVELS: EscalationLevel[] = [
  {
    id: 'level1',
    title: 'Nivå 1: Samtal & medling',
    icon: Users,
    description: 'Försöka lösa det genom dialog innan juridiska instanser blir involverade.',
    details: [
      'Sätt upp ett planerat familjesamtal där alla kan uttrycka sina åsikter.',
      'Överväg att ta med en neutral familjemedlem som moderator.',
      'Läs på om frivillig medling — en neutral tredje part kan guida processen.',
      'Dokumentera vad ni kommer överens om skriftligt, även om det är informellt.',
      'Många kommuner erbjuder gratis eller billig familjemedling.',
    ],
    costs: 'Gratis eller låg kostnad för kommunal medling',
  },
  {
    id: 'level2',
    title: 'Nivå 2: Boutredningsman',
    icon: FileText,
    description: 'En neutral person utses för att administrera dödsboet om arvingarna inte kan komma överens.',
    details: [
      'Boutredningsmannen kan utses av tingsrätten enligt Ärvdabalken 19 kap.',
      'Boutredningsmannen tar över administrationen av dödsboet och försöker lösa konflikter.',
      'Kostnaderna för boutredningsmannen betalas av dödsboet själv.',
      'Lämpligt när det är mindre tvister men ändå behövs professionell hjälp.',
      'Snabbare än domstolsprocess men mer formell än frivillig medling.',
      'Boutredningsmannen kan vara jurist, revisor eller annan kompetent person.',
    ],
    legalRef: 'Ärvdabalken 19 kap.',
    costs: 'Betalas av dödsboet, vanligen 5 000–15 000 kr',
  },
  {
    id: 'level3',
    title: 'Nivå 3: Skiftesman',
    icon: Gavel,
    description: 'Tvångsskifte då tingsrätten utser en skiftesman för att genomdriva fördelningen.',
    details: [
      'Skiftesman kan utses av tingsrätten för tvångsskifte enligt Ärvdabalken 23 kap. 5 §.',
      'Detta är sista utvägen när frivilligt arvskifte är omöjligt.',
      'Skiftesmannen kan tvinga fram försäljning av gemensam egendom för att få medel att fördela.',
      'Mycket dyrt och tidskrävande — kan ta 1–3 år eller längre.',
      'Arvingarna kan få betala hela processen själva, eller kostnaden delas mellan dem.',
      'Domstolen är involverad, vilket gör processen långsam och kostsam.',
    ],
    legalRef: 'Ärvdabalken 23 kap. 5 §',
    costs: 'Ofta 30 000–100 000+ kr beroende på komplexitet. Uppdelat mellan arvingarna eller helt kostnad för den som initierar.',
  },
];

function KonfliktContent() {
  const { state } = useDodsbo();
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(
    new Set(['level1'])
  );

  const toggleLevel = (id: string) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Oenighet i dödsboet
          </h1>
          <p className="text-muted text-sm">Vad du kan göra</p>
        </div>
      </div>

      {/* Info box */}
      <div className="info-box mb-6">
        <p className="text-sm">
          <strong>När dödsbodelägarna inte kan komma överens om fördelningen
          finns det hjälp att få.</strong> Du behöver inte låsa dig fast i
          konflikten — det finns flera vägar framåt, från samtal till juridisk
          hjälp.
        </p>
      </div>

      {/* Escalation levels */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Eskaleringsmöjligheter
        </h2>
        <div className="flex flex-col gap-3">
          {ESCALATION_LEVELS.map((level) => {
            const isExpanded = expandedLevels.has(level.id);
            const Icon = level.icon;

            return (
              <button
                key={level.id}
                onClick={() => toggleLevel(level.id)}
                className="card w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary">{level.title}</p>
                    <p className="text-sm text-primary/70 mt-1">
                      {level.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <ul className="space-y-2 mb-3">
                      {level.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-primary/70"
                        >
                          <span className="text-accent mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {level.legalRef && (
                      <p className="text-xs text-muted mb-2">
                        <strong>Lagstöd:</strong> {level.legalRef}
                      </p>
                    )}

                    {level.costs && (
                      <div className="bg-accent/10 rounded-card px-3 py-2">
                        <p className="text-xs text-primary/80">
                          <strong>Kostnad:</strong> {level.costs}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Common scenarios */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Vanliga tvister
        </h2>
        <div className="flex flex-col gap-3">
          {CONFLICT_SCENARIOS.map((scenario, i) => (
            <div key={i} className="card">
              <p className="font-medium text-primary mb-2">{scenario.title}</p>
              <p className="text-sm text-primary/70">{scenario.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to apply */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Att ansöka till tingsrätten
        </h2>
        <div className="card">
          <h3 className="font-medium text-primary mb-3">Formulär & process</h3>
          <ul className="space-y-2 mb-4">
            <li className="flex gap-2 text-sm text-primary/70">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>Blankett:</strong> Ansökan kan lämnas skriftligt till
                länsrätten eller tingsrätten. Kolla din lokala tingsrätts hemsida.
              </span>
            </li>
            <li className="flex gap-2 text-sm text-primary/70">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>Ansökningsavgift:</strong> Cirka 900 kr (aktuell avgift)
              </span>
            </li>
            <li className="flex gap-2 text-sm text-primary/70">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>Information att bifoga:</strong> Dödsbevis, bouppteckning
                (eller skiss), personuppgifter på alla arvingar, beskrivning av
                tvisten
              </span>
            </li>
            <li className="flex gap-2 text-sm text-primary/70">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>Tid:</strong> Tingsrätten fattar beslut inom 4-8 veckor
                normalt
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Warning box */}
      <div className="warning-box mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">
            Juridisk tvist kan bli dyrt. Försök alltid prata först.
          </p>
          <p className="text-xs text-primary/80">
            En domstolsprocess kan kosta tiotusentals kronor. Innan du söker
            juridisk hjälp, gör ett seriöst försök att lösa det genom dialog
            eller medling.
          </p>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="bg-gray-50 rounded-card px-4 py-3 mb-6">
        <p className="text-xs text-muted leading-relaxed">
          <strong>Juridisk varning:</strong> Denna sida ger endast allmän
          information om möjligheter vid konflikter i dödsbo. Det är inte
          juridisk rådgivning. Vid allvarliga tvister bör du kontakta en jurist
          för personlig vägledning. Du kan kontakta Sveriges Advokatsamfund för
          rekommendation av domstolsprövad advokat.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

export default function KonfliktPage() {
  return (
    <DodsboProvider>
      <KonfliktContent />
    </DodsboProvider>
  );
}
