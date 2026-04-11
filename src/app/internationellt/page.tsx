'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  Globe,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: string;
  details: string[];
}

const SECTIONS: Section[] = [
  {
    id: 'eu-forordning',
    title: 'EU:s arvsförordning (650/2012)',
    content:
      'EU:s arvsförordning tillämpas sedan 2015 och gäller för flesta medlemsstater. Den förenklar process när dödsboet omfattar flera länder.',
    details: [
      'Standardregeln: Arvslagen i det land där den avlidne hade sin hemvist (vanligast bosättningsland) tillämpas.',
      'Undantag: Testator kan välja att sin nationella arvslag ska tillämpas istället (genom explicit testamente).',
      'Europeiskt arvsintyg: Kan utfärdas för att bevisa arvsrätter i andra EU-länder.',
      'Gäller för både dödsbodelägare och juridiska relationer mellan länder.',
    ],
  },
  {
    id: 'nordisk-konvention',
    title: 'Nordisk konvention',
    content:
      'Sverige har särskilda arvsöverenskommelser med Danmark, Finland, Island och Norge. Dessa kan ge enklare regler än EU-förordningen.',
    details: [
      'Gäller mellan Sverige, Danmark, Finland, Island och Norge.',
      'Kan ofta ge mer fördelaktiga villkor än EU-förordningen.',
      'Hemvist i nordiskt land kan förenkla arvskiftet.',
      'Reglerna är ofta mer flexibla än EU-standard.',
    ],
  },
  {
    id: 'tillgangar-utomlands',
    title: 'Tillgångar utomlands',
    content:
      'Fastigheter, bankkonton och värdepapper utomlands regleras ofta av det lokala landets lag, inte svensk lag.',
    details: [
      'Fastigheter utomlands: Ofta måste man följa det landet arvsrätt och egendomsrätt.',
      'Bankkonton utomland: Kontakta banken direkt. De kan kräva lokalt dödsbevis eller arvintyg.',
      'Värdepapper (aktier, obligationer): Kan kräva lokal registrering eller överföring via lokalt bolag.',
      'Försäkringar utomland: Förmånstagare kan behöva registreras lokalt.',
      'Möjligt att behöva anställa lokal advokat för att realisera tillgångarna.',
    ],
  },
  {
    id: 'utlandsk-medborgarskap',
    title: 'Utländskt medborgarskap',
    content:
      'Om den avlidne hade utländskt medborgarskap (eller dubbelt medborgarskap) kan det påverka vilken arvslag som tillämpas.',
    details: [
      'Nationell hemvist: Om den avlidne hade hemvist i Sverige men utländskt medborgarskap kan komplicerat.',
      'Dubbelt medborgarskap: Kan ibland välja mellan två länders arvsregler.',
      'Hemvist-konceptet: Rätten definieras ofta av hemvist, inte medborgarskap.',
      'Testamente är ofta det säkraste sättet att klargöra önskemål.',
    ],
  },
  {
    id: 'dubbelbeskattning',
    title: 'Dubbelbeskattning',
    content:
      'Sverige har ingen arvsskatt, men många andra länder gör. Risken för dubbelbeskattning på samma tillgångar kan uppstå.',
    details: [
      'Sverige: Ingen arvsskatt sedan 2005. Endast kapitalvinstskatt kan aktuell.',
      'USA: Kan ta arvsskatt på amerikanska tillgångar (gäller ibland även för icke-medborgare).',
      'Övriga länder: Många EU-länder och andra länder har arvsskatt (5-60%).',
      'Dubbelbeskattningsavtal: Sverige har avtal med vissa länder, men inte alla.',
      'Dokumentation kritisk: Spara alla kvitton och värderingar för att bevisa skatter betalade utomland.',
    ],
  },
];

const INTERNATIONAL_CHECKLIST = [
  'Identifiera alla länder där den avlidne hade hemvist, tillgångar eller medborgarskap',
  'Samla in dödsbevis (kanske flera versioner för olika länder)',
  'Kontakta alla utländska banker och försäkringsbolag direkt',
  'Klassificera fastigheter och övriga tillgångar per land',
  'Utreda vilka arvsregler som gäller (hemvist, medborgarskap, testamente)',
  'Överväg Europeiska arvsintyget om många EU-länder är inblandade',
  'Inventera eventuella skatter i andra länder',
  'Dokumentera alla värden och omvandlingar till SEK',
  'Rådgör med utländsk advokat för väsentliga tillgångar',
  'Informera alla dödsbodelägare om vilka regler som gäller',
];

function InternationelltContent() {
  const { state } = useDodsbo();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const hasInternationalAssets = state.deceasedMedborgarskap && state.deceasedMedborgarskap !== 'Svenska' && state.deceasedMedborgarskap !== 'Sverige';

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
          <h1 className="text-2xl font-semibold text-primary">Internationella arv</h1>
          <p className="text-muted text-sm">Utländsk hemvist, tillgångar & medborgarskap</p>
        </div>
      </div>

      {/* Auto-detect banner */}
      {hasInternationalAssets && (
        <div className="info-box mb-4">
          <div className="flex gap-2">
            <Globe className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                Utländskt medborgarskap upptäckt
              </p>
              <p className="text-xs text-primary/70">
                Den avlidne hade medborgarskap i {state.deceasedMedborgarskap}. Denna guide kan vara särskilt relevant.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warning box */}
      <div className="warning-box mb-6">
        <div className="flex gap-2">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary">
            <strong>Internationella arv är komplexa.</strong> Denna guide ger en översikt men ersätter inte juridisk rådgivning. Vi rekommenderar starkt att rådgöra med en advokat för alla utländska tillgångar.
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/70">
            Vilken arvslag som gäller beror oftast på den avlidnes <strong>hemvist</strong> (där de faktiskt bodde), inte medborgarskap. En testator kan dock välja sin nationella lag.
          </p>
        </div>
      </div>

      {/* Expandable sections */}
      <div className="flex flex-col gap-2 mb-8">
        {SECTIONS.map((section) => {
          const isExpanded = expandedId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setExpandedId(isExpanded ? null : section.id)}
              className="card w-full text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-primary">{section.title}</p>
                  {!isExpanded && (
                    <p className="text-xs text-muted mt-1 line-clamp-1">{section.content}</p>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-primary/80 mb-3 leading-relaxed">{section.content}</p>
                  <ul className="space-y-2">
                    {section.details.map((detail, i) => (
                      <li key={i} className="flex gap-2 text-sm text-primary/70">
                        <span className="text-accent mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Practical checklist */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Praktisk checklista</h2>
        <ul className="space-y-3">
          {INTERNATIONAL_CHECKLIST.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0 text-sm">{i + 1}.</span>
              <span className="text-sm text-primary/80">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* When to hire a lawyer */}
      <div className="card border-2 border-warn mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warn" />
          När ska du anställa advokat?
        </h2>
        <div className="space-y-2 text-sm text-primary/80">
          <p>
            <strong className="text-warn">Vi rekommenderar starkt juridisk rådgivning</strong> om dödsboet omfattar:
          </p>
          <ul className="space-y-1.5 ml-2">
            <li>• Fastigheter utomlands (även liten hyresrätt)</li>
            <li>• Väsentliga bankkonton eller värdepapper utomland</li>
            <li>• Företag eller affärsverksamhet i annat land</li>
            <li>• Dubbelt eller flera medborgarskap</li>
            <li>• Arv från USA eller andra länder med arvsskatt</li>
            <li>• Tvister mellan dödsbodelägare om internationell tillämpning</li>
            <li>• Oklar hemvist eller komplicerad familjesituation</li>
          </ul>
        </div>
      </div>

      {/* Useful links */}
      <div className="card">
        <h2 className="text-lg font-semibold text-primary mb-4">Användbara resurser</h2>
        <div className="space-y-2">
          <a
            href="https://ec.europa.eu/info/law/better-regulation/have-your-say/initiatives/12627-European-Succession-Certificate-ESC_en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Europeiskt arvsintyg
          </a>
          <a
            href="https://www.skatteverket.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Skatteverkets webbplats
          </a>
          <a
            href="https://www.domstolverket.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Domstolsverket — information om arvskifte
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function InternationelltPage() {
  return (
    <DodsboProvider>
      <InternationelltContent />
    </DodsboProvider>
  );
}
