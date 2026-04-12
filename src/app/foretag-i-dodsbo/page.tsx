'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
} from 'lucide-react';

interface CompanySection {
  id: string;
  title: string;
  icon: typeof Building2;
  intro: string;
  keyPoints: { label: string; text: string }[];
  urgentActions: string[];
  legalNotes: string[];
}

const COMPANY_SECTIONS: CompanySection[] = [
  {
    id: 'aktiebolag',
    title: 'Aktiebolag (AB)',
    icon: Building2,
    intro:
      'Om den avlidne ägde aktier i ett eller flera aktiebolag ingår dessa i dödsboet. Företaget fortsätter normalt att fungera medan arvskiftet pågår.',
    keyPoints: [
      {
        label: 'Aktier är tillgångar i dödsboet',
        text: 'Aktierna värderas och delas enligt arvskiftet. Om flera dödsbodelägare är överens kan någon behålla företaget, andra får motsvarande värde.',
      },
      {
        label: 'Bolagsstyrelsen måste meddelas',
        text: 'Styrelsens ordförande och sekreterare måste anmälas till Bolagsverket inom 2 månader från dödsfallet.',
      },
      {
        label: 'Årsredovisning måste göras',
        text: 'Även under arvskiftet måste bolaget uppfylla alla juridiska skyldigheter: årsredovisning, revisorsgranskning (om aktuellt), skatteanmälan.',
      },
      {
        label: 'Eventuell ny styrelse',
        text: 'Om den avlidne var styrelseledamot måste denna ersättas. En dödsbodelägare kan ta över eller utse någon annan.',
      },
      {
        label: 'Bolaget kan säljas',
        text: 'Under arvskiftet kan dödsbodelägarna besluta att sälja bolaget. Då säljs aktierna, inte tillgångarna.',
      },
    ],
    urgentActions: [
      'Anmäl styrelseskifte till Bolagsverket (0771-670 670) inom 2 månader',
      'Kontrollera företagets bank- och lönekonton',
      'Inventera företagets tillgångar, skulder och kontrakt',
      'Informera kunder och leverantörer om situationen',
      'Se till att löner betalas ut korrekt',
      'Boka revision och upprättande av årsredovisning',
    ],
    legalNotes: [
      'Aktiebolagslagen (2005:551) — styr alla aktiebolag',
      'Dödsboet kan agera som juridisk person men måste uppdatera styrelseskifte',
      'Arvsrätt gäller endast aktieägaren, inte styrelseledamöter eller anställda',
      'Skatteverket måste informeras om ändringar i ägarskapet',
    ],
  },
  {
    id: 'enskild-firma',
    title: 'Enskild firma (F-skatt)',
    icon: Users,
    intro:
      'Om den avlidne drev enskild firma är situationen mer komplex. Enskild firma är inte en juridisk person — firman är direkt kopplad till personen.',
    keyPoints: [
      {
        label: 'Firman upphör vid dödsfall',
        text: 'En enskild firma kan inte fortsätta när ägaren dör. Dödsboet eller någon annan måste antingen överta firman eller avsluta den.',
      },
      {
        label: 'F-skattenummer blir ogiltigt',
        text: 'Det ursprungliga F-skattenumret förfaller. Dödsboet får eget F-skattenummer för att driva verksamheten under avvecklingsperioden.',
      },
      {
        label: 'Moms måste hanteras',
        text: 'Momsskulder från verksamheten måste betalas av dödsboet. Även eventuella återkrav kan komma att utgå.',
      },
      {
        label: 'Anställda får särskild skydd',
        text: 'Anställdas löner är företrädesrätt i dödsboet (betalas före andra skulder). Skatteverket och a-kassan måste meddelas.',
      },
      {
        label: 'Personlig skuld',
        text: 'Vid enskild firma är ägaren personligt ansvarig för all skuld. Detta kan begränsa dödsbodelägares arv.',
      },
      {
        label: 'Avveckling kan ta tid',
        text: 'Det kan ta veckor eller månader att avsluta en enskild firma korrekt, speciellt om det finns anställda.',
      },
    ],
    urgentActions: [
      'Kontakta Skatteverket (0771-567 567) och meddela dödsfall för F-skattenumret',
      'Informera alla anställda omedelbar — löner måste fortsätta betalas',
      'Kontakta Arbetsmiljöverket och arbetsförmedlingen om uppsägning planeras',
      'Inventera all egendom: inventarier, maskiner, fordon, lager',
      'Kontakta alla kundkontrakt och leverantörer',
      'Samla in all dokumentation om skulder och tillgångar',
      'Öppna dödsbo-bankkonto för verksamheten',
      'Planera avveckling eller överlåtelse',
    ],
    legalNotes: [
      'Handelsregisterlagen (1890:1313) — styr firma och äganderätter',
      'Arbetsförmedlingens regler — gäller uppsägning och löneavgift',
      'Mervärdesskattelagen (1994:200) — moms-hantering',
      'Allmän försäkringsplikt för arbetsgivare — löner och sociala avgifter',
      'Dödsboet blir arbetsgivare under avvecklingen',
    ],
  },
];

const BUSINESS_ASSET_CHECKLIST = [
  'Dokumentera alla verksamhetstillgångar (inventarier, maskiner, fordon)',
  'Värdera verksamhetsrelaterad egendom (ofta lägre än privatmarknad)',
  'Särskilj verksamhetstillgångar från personliga tillgångar',
  'Kontrollera alla kundkontrakt — vilka kan sägas upp?',
  'Inventera leverantörskontrakt och åtaganden',
  'Kontrollera hyresavtal för lokaler',
  'Lista eventuell försäkring specifik för verksamheten',
  'Inventera allt intellektuell egendom (märken, patent, domäner)',
];

const CLOSURE_CHECKLIST = [
  'Avisera alla kunder och samarbetspartners',
  'Säg upp kontrakt (beakta uppsägningstider)',
  'Stäng bankkonto (när verksamheten är helt avslutad)',
  'Avsluta försäkringar',
  'Avsluta all registrering hos myndigheter',
  'Arkivera bokföring (måste sparas 7 år)',
  'Skicka slutdeklaration till Skatteverket',
];

function ForetagContent() {
  const { state } = useDodsbo();
  const [expandedId, setExpandedId] = useState<string | null>('aktiebolag');

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary">Företag i dödsbo</h1>
          <p className="text-muted text-sm">AB, enskild firma eller eget företag</p>
        </div>
      </div>

      {/* Warning box */}
      <div className="warning-box mb-6">
        <div className="flex gap-2">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary">
            <strong>Företag i dödsbo är alltid komplicerat.</strong> Det finns juridiska skyldigheter gentemot myndigheter, anställda och borgenärer. Vi rekommenderar att rådgöra med en jurist eller revisor.
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/70">
            Huruvida det är ett <strong>aktiebolag</strong> eller <strong>enskild firma</strong> påverkar väsentligt hur processen fungerar. Kolla registreringsbeviset eller F-skattsedeln.
          </p>
        </div>
      </div>

      {/* Company type sections */}
      <div className="flex flex-col gap-2 mb-8">
        {COMPANY_SECTIONS.map((section) => {
          const isExpanded = expandedId === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setExpandedId(isExpanded ? null : section.id)}
              className="card w-full text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-primary">{section.title}</p>
                    {!isExpanded && (
                      <p className="text-xs text-muted mt-1 line-clamp-2">{section.intro}</p>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 ml-8">
                  <p className="text-sm text-primary/80 mb-4 leading-relaxed">{section.intro}</p>

                  {/* Key points */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-primary mb-3">
                      Viktiga punkter:
                    </h3>
                    <ul className="space-y-3">
                      {section.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm">
                          <p className="font-medium text-primary/80 mb-1">{point.label}</p>
                          <p className="text-primary/70">{point.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Urgent actions */}
                  <div className="mb-4 bg-warn/10 rounded-card p-3">
                    <h3 className="text-sm font-semibold text-warn mb-2">
                      Brådskande åtgärder:
                    </h3>
                    <ul className="space-y-1.5">
                      {section.urgentActions.map((action, i) => (
                        <li key={i} className="flex gap-2 text-sm text-primary/80">
                          <span className="text-warn flex-shrink-0">→</span>
                          <span>{action.split(/(\d[\d\s-]{6,})/).map((part, j) => {
                            const digits = part.replace(/[^0-9]/g, '');
                            return digits.length >= 8 ? (
                              <a key={j} href={`tel:${digits}`} className="text-accent hover:underline">{part}</a>
                            ) : part;
                          })}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legal notes */}
                  <div className="bg-primary-lighter/30 rounded-card p-3">
                    <h3 className="text-sm font-semibold text-primary mb-2">
                      Juridiska referenser:
                    </h3>
                    <ul className="space-y-1">
                      {section.legalNotes.map((note, i) => (
                        <li key={i} className="text-xs text-primary/70">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Contact info card */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Viktiga telefonnnummer</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-primary">Bolagsverket (AB)</p>
            <a href="tel:0771670670" className="text-sm text-accent hover:underline">0771-670 670</a>
            <p className="text-xs text-muted mt-0.5">Styrelseskifte, ägarändringar</p>
          </div>
          <div className="border-t border-[#E8E4DE] pt-3">
            <p className="text-sm font-medium text-primary">Skatteverket (F-skatt, moms)</p>
            <a href="tel:0771567567" className="text-sm text-accent hover:underline">0771-567 567</a>
            <p className="text-xs text-muted mt-0.5">Dödsfall, avslutning, deklaration</p>
          </div>
          <div className="border-t border-[#E8E4DE] pt-3">
            <p className="text-sm font-medium text-primary">Arbetsmiljöverket (anställda)</p>
            <a href="tel:0771892892" className="text-sm text-accent hover:underline">0771-892 892</a>
            <p className="text-xs text-muted mt-0.5">Uppsägning, lönefrågor</p>
          </div>
        </div>
      </div>

      {/* Asset checklist */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Checklista för verksamhetstillgångar</h2>
        <ul className="space-y-2">
          {BUSINESS_ASSET_CHECKLIST.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0 text-sm">{i + 1}.</span>
              <span className="text-sm text-primary/80">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Closure checklist */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Checklista för avveckling</h2>
        <ul className="space-y-2">
          {CLOSURE_CHECKLIST.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0 text-sm">{i + 1}.</span>
              <span className="text-sm text-primary/80">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Personal liability warning */}
      <div className="card border-2 border-warn mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warn" />
          Personligt ansvar (enskild firma)
        </h2>
        <div className="space-y-2 text-sm text-primary/80">
          <p>
            Vid enskild firma är den avlidne personligt ansvarig för <strong>all skuld</strong> — både verksamhetsskulder och privata. Det betyder:
          </p>
          <ul className="space-y-1.5 ml-2">
            <li>• Borgenärer kan kräva betalning av dödsboet</li>
            <li>• Löner är företrädesrätt före andra skulder</li>
            <li>• Arvet kan helt försvinna om skulderna är större än tillgångarna</li>
            <li>• Dödsbodelägarna blir aldrig personligt ansvariga för skulderna</li>
            <li>• Men arvet delas då mellan dödsbodelägare först sedan det betalats ned</li>
          </ul>
        </div>
      </div>

      {/* Resources */}
      <div className="card">
        <h2 className="text-lg font-semibold text-primary mb-4">Användbara resurser</h2>
        <div className="space-y-2">
          <a
            href="https://www.bolagsverket.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Bolagsverket — Aktiebolag
          </a>
          <a
            href="https://www.skatteverket.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Skatteverket — F-skatt & moms
          </a>
          <a
            href="https://www.av.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Arbetsmiljöverket — Anställda
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function ForetagPage() {
  return (
    <DodsboProvider>
      <ForetagContent />
    </DodsboProvider>
  );
}
