'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  CheckCircle,
  Circle,
  Phone,
  Scale,
} from 'lucide-react';

type BusinessType = 'aktiebolag' | 'enskild-firma' | 'handelsbolag' | 'kommanditbolag' | null;

interface CompanySection {
  id: BusinessType;
  title: string;
  subtitle: string;
  icon: typeof Building2;
  intro: string;
  sections: {
    title: string;
    points: { label: string; text: string }[];
  }[];
  urgentActions: string[];
  checklist: string[];
  legalNotes: string[];
}

const COMPANY_SECTIONS: CompanySection[] = [
  {
    id: 'aktiebolag',
    title: 'Aktiebolag (AB)',
    subtitle: 'Registrerat på Bolagsverket',
    icon: Building2,
    intro: 'Om den avlidne ägde aktier i ett eller flera aktiebolag ingår dessa i dödsboet. Företaget är en juridisk person och fortsätter normalt medan arvskiftet pågår.',
    sections: [
      {
        title: 'Dödsboet blir aktieägare',
        points: [
          {
            label: 'Vad innebär det?',
            text: 'Aktierna värderas och ingår i dödsboet som en tillgång. Dödsboet blir aktieägare tills arvskiftet avslutas.',
          },
          {
            label: 'Värderingsmetoder',
            text: 'Använd bokfört värde, marknadsvärde eller substansvärdering (tillgångar minus skulder). För värderingar över 100 000 kr rekommenderas professionell värdering.',
          },
          {
            label: 'Arvskiftet påverkar',
            text: 'Om flera dödsbodelägare är överens kan någon behålla företaget, andra får motsvarande värde från dödsboet.',
          },
        ],
      },
      {
        title: 'Styrelseansvar & ändringar',
        points: [
          {
            label: 'Måste ny styrelse utses?',
            text: 'Om den avlidne var styrelseledamot måste denna ersättas inom 2 månader. Dödsbodelägare eller utomstående kan utses.',
          },
          {
            label: 'Anmälan till Bolagsverket',
            text: 'Styrelseskifte måste anmälas till Bolagsverket inom 2 månader från dödsfallet. Använd formulär SKV 408.',
          },
          {
            label: 'Teckningsrätt & firma',
            text: 'Uppdatera firmateckning om behov. Se till att nya styrelseledamöter registreras korrekt.',
          },
        ],
      },
      {
        title: 'Räkenskaper & skatter',
        points: [
          {
            label: 'Årsredovisning måste göras',
            text: 'Även under arvskiftet måste bolaget uppfylla alla juridiska skyldigheter: årsredovisning, revisorsgranskning (om aktuellt).',
          },
          {
            label: 'Skatteverkets anmälan',
            text: 'Informera Skatteverket om ägarskifte. Dödsboet blir skattesubjekt för sin ägarandel.',
          },
          {
            label: 'Årligt presentationspaket',
            text: 'Håll reda på årlig deklaration, balansräkning och resultaträkning. Lagring i 7 år.',
          },
        ],
      },
      {
        title: 'Sälja eller avveckla bolaget',
        points: [
          {
            label: 'Försäljning av aktierna',
            text: 'Dödsbodelägarna kan besluta att sälja bolaget. Då säljs aktierna, inte de underliggande tillgångarna.',
          },
          {
            label: 'Due diligence & köparkontrakt',
            text: 'Köparen kräver granskning av bokföring, kontrakt, skulder och långivningsavtal. Budgetera för revisor.',
          },
          {
            label: 'Avveckling av bolaget',
            text: 'Om ingen köpare finns kan bolaget lösas upp. Då måste tillgångar säljas, skulder betalas och kvarva delas.',
          },
        ],
      },
    ],
    urgentActions: [
      'Anmäl styrelseskifte till Bolagsverket (0771-670 670) inom 2 månader — formulär SKV 408',
      'Kontrollera företagets bank- och lönekonton omedelbar',
      'Inventera företagets tillgångar, skulder och kontrakt',
      'Informera kunder och leverantörer om situationen',
      'Se till att löner och leverantörsbetalningar fortsätter',
      'Boka revisor för årsredovisning och granskning',
      'Informera Skatteverket om ägarskifte',
      'Samla in alla styrelseprotokoll och bolagsdokument',
    ],
    checklist: [
      '□ Kontrollera aktiebok och ägarandel',
      '□ Identifiera tidigare styrelseledamöter',
      '□ Säkerställ att nya styrelseledamöter är godkända juridiskt',
      '□ Anmäl styrelseskifte till Bolagsverket (SKV 408)',
      '□ Samla senaste årsredovisning och revisorrapport',
      '□ Inventera alla kontrakt (leverantörer, kunder, lån)',
      '□ Kontrollera lånevillkor — kan banken säga upp lånet?',
      '□ Värdera bolaget (bokfört, substans eller marknadsvärde)',
      '□ Undersök försäljningsmöjligheter',
      '□ Planera arkivering av bokföring i 7 år',
    ],
    legalNotes: [
      'Aktiebolagslagen (2005:551) — styr alla aktiebolag',
      'Bolagsverkets anmälan SKV 408 — styrelseskifte måste göras',
      'Dödsboet kan agera som juridisk person för sina aktieägare',
      'Skatteverkets instruktioner för ägarskifte',
      'Revisorslagens krav på årsredovisning',
    ],
  },
  {
    id: 'enskild-firma',
    title: 'Enskild firma',
    subtitle: 'F-skattenummer eller växelkassa',
    icon: Briefcase,
    intro: 'Om den avlidne drev enskild firma är situationen komplex. Enskild firma är inte en juridisk person — firman är direkt kopplad till individen.',
    sections: [
      {
        title: 'Vad händer när ägaren dör?',
        points: [
          {
            label: 'Firman upphör vid dödsfall',
            text: 'En enskild firma kan inte fortsätta när ägaren dör. Dödsboet eller någon annan måste antingen överta firman eller avsluta den helt.',
          },
          {
            label: 'F-skattenumret blir ogiltigt',
            text: 'Det ursprungliga F-skattenumret förfaller automatiskt. Dödsboet kan ansöka om eget F-skattenummer för att driva verksamheten under avvecklingsperioden.',
          },
          {
            label: 'Handelsregistret',
            text: 'Firman måste strykas från handelsregistret inom rimlig tid. Meddela Patent- och registreringsverket.',
          },
        ],
      },
      {
        title: 'Anställda & arbetsgivaransvar',
        points: [
          {
            label: 'Löner är företrädesrätt',
            text: 'Anställdas löner måste betalas före andra skulder. Löneavgifter och skatter är personliga skulder.',
          },
          {
            label: 'Uppsägningstid gäller',
            text: 'Anställda kan inte sägas upp omedelbar. Uppsägningstiden (ofta 1-2 månader) måste respekteras och löner betalas ut.',
          },
          {
            label: 'Dödsboet blir arbetsgivare',
            text: 'Under avvecklingsperioden blir dödsboet arbetsgivare och ansvarar för F-skattemomenten, löneutbetalning och anmälningar.',
          },
          {
            label: 'Informera arbetsgivare & fack',
            text: 'Kontakta a-kassorna, försäkringskassan och fackföreningar för alla anställda. Skatteverket måste meddelas om dödsfallet.',
          },
        ],
      },
      {
        title: 'Moms & skattefrågor',
        points: [
          {
            label: 'Moms måste hanteras',
            text: 'Momsskulder från verksamheten måste betalas av dödsboet. Eventuella återkrav kan komma att utgå.',
          },
          {
            label: 'Avsluta momsregistrering',
            text: 'Om verksamheten avslutas måste momsregistreringen avslutats hos Skatteverket. Sista moms-rapport måste skickas in.',
          },
          {
            label: 'Slutdeklaration',
            text: 'Skatteverket kräver slutdeklaration för året då dödsfallet inträffade. Använd samma personnummer eller dödsbo-ID.',
          },
          {
            label: 'Källskatt & preliminär skatt',
            text: 'Se till att källskatt för anställda betalas och preliminär skatt för enskild firma regleras.',
          },
        ],
      },
      {
        title: 'Avtal, kunder & kontrakt',
        points: [
          {
            label: 'Kontakta alla kunder',
            text: 'Informera kunder om situationen. Många kontrakt kan sägas upp eller omförhandlas.',
          },
          {
            label: 'Leverantörskontrakt',
            text: 'Kontrollera avtalen — vilka kan sägas upp omedelbar? Vilka har långa uppsägningstider?',
          },
          {
            label: 'Hyresavtal för lokaler',
            text: 'Hyresvärd måste meddelas. Ofta kan ett kommersiellt hyresavtal sägas upp med kortare uppsägningstid vid dödsfall.',
          },
          {
            label: 'Försäkringar',
            text: 'Lista alla företagsförsäkringar. Många kan avslutats eller övertas av dödsboet.',
          },
        ],
      },
      {
        title: 'Inventarier & egendom',
        points: [
          {
            label: 'Inventarier blir dödsboet',
            text: 'All egendom som användes i verksamheten (verktyg, maskiner, möbler, fordon) är del av dödsboet.',
          },
          {
            label: 'Värdering vid dödsfall',
            text: 'Inventarier värderas ofta lägre än på öppen marknad. Använd taxeringsvärdena eller skatta värdet selv.',
          },
          {
            label: 'Lagerbehållning',
            text: 'Om det finns varor i lager måste dessa värderas och inventeras. Ofta kan de säljas snabbt.',
          },
          {
            label: 'Intellektuell egendom',
            text: 'Märken, namn, domäner och rättigheter kan vara värdefulla. Överväg att behålla eller sälja dessa.',
          },
        ],
      },
    ],
    urgentActions: [
      'Kontakta Skatteverket (0771-567 567) omedelbar — meddela dödsfall för F-skattenumret',
      'Informera alla anställda omedelbar — uppsägningstiden börjar räknas',
      'Betala nästa löneutbetalning — detta är högsta prioritet',
      'Kontakta Arbetsmiljöverket och arbetsförmedlingen om uppsägning planeras',
      'Kontakta alla kunder och informera om situationen',
      'Inventera all egendom: inventarier, maskiner, fordon, lager,IT-utrustning',
      'Samla in all dokumentation om skulder och bindande kontrakt',
      'Öppna dödsbo-bankkonto och överför medel från firmans konto',
      'Ansöka om eget F-skattenummer för dödsboet (om verksamheten fortsätter tillfälligt)',
      'Kontakta hyresvärd för lokaler — informera om dödsfall',
    ],
    checklist: [
      '□ Meddela Skatteverket om dödsfallet och F-skattenummer',
      '□ Identifiera alla anställda och kontrollera anställningsavtal',
      '□ Beräkna uppsägningstider för varje anställd',
      '□ Planera löneutbetalningar under avvecklingsperioden',
      '□ Samla in listor på alla leverantörer och kunder',
      '□ Inventera all egendom — möbler, maskiner, fordon, IT',
      '□ Kontrollera momsregistrering och senaste momsdeklaration',
      '□ Samla in bokföring från föregående år (för revisorn)',
      '□ Kontrollera hyresavtal och kontakta hyresvärd',
      '□ Lista alla försäkringar (brand, ansvar, egendom)',
      '□ Identifiera om det finns intellektuell egendom eller märken',
      '□ Planera säljning eller avveckling av inventarier',
    ],
    legalNotes: [
      'Handelsregisterlagen (1890:1313) — styr firma och registrering',
      'Mervärdeskattelagen (1994:200) — moms-hantering',
      'Arbetsrättslagen — anställda har starka rättigheter vid dödsfall',
      'Arbetsmiljölagen — arbetsgivarens skyldigheter vid avveckling',
      'Arbetslöshetsförsäkringslagen — a-kassan måste meddelas',
      'Dödsboet blir arbetsgivare under avvecklingsperioden',
    ],
  },
  {
    id: 'handelsbolag',
    title: 'Handelsbolag (HB)',
    subtitle: 'Flera delägare i gemensam verksamhet',
    icon: Users,
    intro: 'Handelsbolag är en juridisk person som ägs av två eller flera delägare (fysiska eller juridiska personer). Vid dödsfall bör bolagsavtalet avgöra vad som händer.',
    sections: [
      {
        title: 'Bolagsavtalet är avgörande',
        points: [
          {
            label: 'Finns det ett bolagsavtal?',
            text: 'Det måste finnas ett skriftligt eller muntligt bolagsavtal. Detta styr vad som händer vid en delägarens dödsfall.',
          },
          {
            label: 'Typiska scenarier',
            text: 'Avtalets kan säga: dödsboet kan sälja sin andel, övriga bolagsmän får först rättighet att köpa, eller bolaget löses upp.',
          },
          {
            label: 'Utan avtal gäller lagstiftningen',
            text: 'Utan skriftligt avtal tillämpas Handelsbalken (1734:1123). Övriga bolagsmän kan då köpa eller bolaget upplöses.',
          },
        ],
      },
      {
        title: 'De övriga bolagsdelägarna',
        points: [
          {
            label: 'De måste involveras',
            text: 'Övriga bolagsmän har intresse i vad som händer. De måste meddelas omedelbar och kan ha rätt att köpa andelen.',
          },
          {
            label: 'Värdering av andelen',
            text: 'Andelen värderas enligt bolagsavtalet eller enligt marknadsvärde. Ofta sker en bokslutsvärdering.',
          },
          {
            label: 'Öppen försäljning?',
            text: 'Dødsboet kan vilja sälja andelen utanför bolaget — men ofta förbjuds detta av bolagsavtalet.',
          },
        ],
      },
      {
        title: 'Fortsatt drift eller utträde?',
        points: [
          {
            label: 'Kan bolaget fortsätta?',
            text: 'Om övriga bolagsmän vill kan bolaget fortsätta. Dödsboet är då stillestånde delägare eller säljer sin andel.',
          },
          {
            label: 'Utträde från bolaget',
            text: 'Dödsboet kan välja att träda ur bolaget. Då måste andelen värderas och säljas eller övrias av andra delägare.',
          },
          {
            label: 'Upplösning av bolaget',
            text: 'Om ingen enighet finns kan bolaget upplösas. Då måste tillgångar säljas, skulder betalas och andelen delas.',
          },
        ],
      },
      {
        title: 'Hantering av skulder & skatter',
        points: [
          {
            label: 'Delägarens personliga ansvar',
            text: 'Vid handelsbolag är delägare personligt ansvarig för bolagets skulder (solidariskt ansvar).',
          },
          {
            label: 'Dödsboet blir delägare',
            text: 'Dödsboet ärver delägarens personliga ansvar för bolagets skulder. Detta kan påverka arvet.',
          },
          {
            label: 'Skattedeklaration',
            text: 'Bolaget måste lämna årlig deklaration. Dödsboet måste betala sin del av skatter och avgifter.',
          },
        ],
      },
    ],
    urgentActions: [
      'Kontakta övriga bolagsmän omedelbar — meddela dödsfallet',
      'Hämta bolagsavtalet — det styr nästa steg',
      'Kontrollera bokföring och senaste årsredovisning',
      'Inventera bolagets tillgångar och skulder',
      'Få värdering av dödsboets andel i bolaget',
      'Undersök vad bolagsavtalet säger om dödsfall och utträde',
      'Besluta: fortsatt ägande, försäljning av andelen, eller upplösning',
      'Informera Skatteverket om ägarskifte',
    ],
    checklist: [
      '□ Inhämta och läs bolagsavtalet noga',
      '□ Identifiera alla övriga bolagsmän och kontakta dem',
      '□ Samla senaste årsredovisning och bokföring',
      '□ Värdera dödsboets andel i bolaget',
      '□ Kontrollera om övriga bolagsmän har köprättighet',
      '□ Undersök bolagets skulder och bindande kontrakt',
      '□ Planera scenarier: fortsätta, sälja eller upplösa',
      '□ Informera Skatteverket om ägarskifte',
      '□ Håll möte med övriga bolagsmän för gemensamt beslut',
      '□ Dokumentera beslut och gör eventuella överföringar',
    ],
    legalNotes: [
      'Handelsbalken (1734:1123) — huvudlagstiftningen för handelsbolag',
      'Bolagsavtalet styr vad som händer vid dödsfall',
      'Solidariskt ansvar — dödsboet blir ansvarigt för all skuld',
      'Skatteverkets deklarationskrav',
      'Patent- och registreringsverkets registrering',
    ],
  },
  {
    id: 'kommanditbolag',
    title: 'Kommanditbolag (KB)',
    subtitle: 'Blandat ansvar och stöldande',
    icon: Scale,
    intro: 'Kommanditbolag är en blandning av handelsbolag och aktiebolag. Det har både komplementärer (fullt ansvar) och kommanditister (begränsat ansvar).',
    sections: [
      {
        title: 'Två typer av delägare',
        points: [
          {
            label: 'Komplementärer (fullt ansvar)',
            text: 'Är personligt ansvarig för all bolagsskuld. Vid dödsfall kan detta bli ett stort problem för dödsboet.',
          },
          {
            label: 'Kommanditister (begränsat ansvar)',
            text: 'Ansvarar endast för sitt insatskapital. Dödsboet kan övertas av en arv utan personligt ansvar.',
          },
          {
            label: 'Vilken roll hade den avlidne?',
            text: 'Kontrollera registreringen — denna avgör både ansvar och vad som händer vid dödsfall.',
          },
        ],
      },
      {
        title: 'Bolagsavtalet är kritiskt',
        points: [
          {
            label: 'Vad säger avtalet?',
            text: 'Det måste finnas ett skriftligt bolagsavtal. Det specificerar vad som händer vid dödsfall för både komplementärer och kommanditister.',
          },
          {
            label: 'Typiska regler',
            text: 'Ofta kan kommanditister övergå till dödsboet, men komplementärer måste ersättas av en ny person.',
          },
          {
            label: 'Utan avtal är det problematiskt',
            text: 'Utan skriftligt avtal kan bolaget behöva upplösas vid dödsfall.',
          },
        ],
      },
      {
        title: 'Om det var komplementär',
        points: [
          {
            label: 'Högsta risk — dödsboet arver fullständigt ansvar',
            text: 'Dödsboet blir personligt ansvarigt för all bolagsskuld. Detta kan helt förinta arvet.',
          },
          {
            label: 'Måste ersättas eller bolaget upplöses',
            text: 'En ny komplementär måste utses omedelbar, eller bolaget måste upplösas för att begränsa risken.',
          },
          {
            label: 'Konsultera jurist omedelbar',
            text: 'En jurist måste granska avtalet och skuldsituationen — detta är ett högriskscenario.',
          },
        ],
      },
      {
        title: 'Om det var kommanditist',
        points: [
          {
            label: 'Begränsat ansvar — enklare situation',
            text: 'Dödsboet äger en andel med begränsat ansvar. Motsvarar ungefär aktiebolag.',
          },
          {
            label: 'Kan fortsätta som ägare eller sälja',
            text: 'Dödsboet kan fortsätta ägandet eller sälja andelen enligt bolagsavtal.',
          },
          {
            label: 'Avtal styr överföring',
            text: 'Se bolagsavtalet — det kan ge övriga delägare köprättighet eller förbjuda försäljning utanför bolaget.',
          },
        ],
      },
    ],
    urgentActions: [
      'ÖPP PRIORITET: Kontrollera om den avlidne var komplementär eller kommanditist',
      'Inhämta bolagsavtalet omedelbar',
      'Konsultera en affärsjurist — detta är komplext',
      'Kontakta övriga delägare och meddela situationen',
      'Inventera bolagets skulder och tillgångar',
      'Få värdering av dödsboets andel',
      'Planera nästa steg baserat på roll och bolagsavtal',
    ],
    checklist: [
      '□ Kontrollera registreringen på Patent- och registreringsverket',
      '□ Identifiera: var dödsboet komplementär eller kommanditist?',
      '□ Inhämta och tolka bolagsavtalet grundligt',
      '□ Identifiera alla övriga delägare (både komplementärer och kommanditister)',
      '□ Bedöm bolagets ekonomi och skuldsituation',
      '□ Värdera dödsboets andel',
      '□ Kontakta övriga delägare för möte',
      '□ Planera: ersätta, sälja andel, eller upplösa bolaget',
      '□ Konsultera jurist före alla större beslut',
      '□ Dokumentera allt och uppdatera registreringen',
    ],
    legalNotes: [
      'Handelsbalken (1734:1123) — lagstiftning för kommanditbolag',
      'Komplementär = fullständigt ansvar, kommanditist = begränsat ansvar',
      'Bolagsavtalet är kritiskt för dödsfall-scenariot',
      'Dödsboet kan bli personligt ansvarigt om komplementär',
      'Patent- och registreringsverkets registrering måste uppdateras',
    ],
  },
];

function ForetagContent() {
  const { t } = useLanguage();
  const { state } = useDodsbo();
  const [selectedType, setSelectedType] = useState<BusinessType>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const currentSection = COMPANY_SECTIONS.find((s) => s.id === selectedType);

  const toggleCheckbox = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="flex flex-col px-4 py-5 pb-24">
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
          <h1 className="text-xl font-display text-primary">Företag i dödsbo</h1>
          <p className="text-muted text-sm">Vägledning för alla företagstyper</p>
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-warn/10 border border-warn/30 rounded-2xl p-4 mb-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary">Företag i dödsbo är ofta komplicerat</p>
            <p className="text-xs text-primary/70 mt-1">
              Det finns juridiska skyldigheter gentemot myndigheter, anställda och borgenärer. Vi rekommenderar starkt att rådgöra med en jurist eller revisor.
            </p>
            <Link
              href="/juridisk-hjalp"
              className="inline-block text-xs text-accent font-medium hover:underline mt-2"
            >
              Hitta juridisk hjälp →
            </Link>
          </div>
        </div>
      </div>

      {!selectedType ? (
        <>
          {/* Step 1: Select company type */}
          <div className="mb-8">
            <h2 className="text-lg font-display text-primary mb-4">
              Steg 1: Välj företagstyp
            </h2>
            <p className="text-sm text-primary/70 mb-4">
              Vilken typ av företag är det? Det här avgör vilka regler och skyldigheter som gäller.
            </p>

            <div className="grid gap-3">
              {COMPANY_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setSelectedType(section.id);
                      setCheckedItems(new Set());
                      setExpandedSection(null);
                    }}
                    className="card hover:border-accent/50 hover:bg-primary-lighter/20 transition-all text-left"
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-primary">{section.title}</p>
                        <p className="text-xs text-muted mt-0.5">{section.subtitle}</p>
                        <p className="text-sm text-primary/70 mt-2 line-clamp-2">
                          {section.intro}
                        </p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-muted flex-shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Back button and title */}
          <button
            onClick={() => {
              setSelectedType(null);
              setExpandedSection(null);
              setCheckedItems(new Set());
            }}
            className="flex items-center gap-2 text-accent text-sm font-medium mb-6 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till företagstyper
          </button>

          {currentSection && (
            <>
              {/* Section title */}
              <div className="mb-6 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl p-4 border border-accent/20">
                <div className="flex items-start gap-3">
                  {(() => {
                    const Icon = currentSection.icon;
                    return <Icon className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />;
                  })()}
                  <div className="flex-1">
                    <h2 className="text-xl font-display text-primary">
                      {currentSection.title}
                    </h2>
                    <p className="text-sm text-primary/70 mt-1">
                      {currentSection.subtitle}
                    </p>
                    <p className="text-sm text-primary/80 mt-3 leading-relaxed">
                      {currentSection.intro}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-primary-lighter/30 border border-primary/10 rounded-2xl p-4 mb-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-primary/80">
                    <strong>Tips:</strong> Läs genom hela guiden för din företagstyp, använd sedan checklistan för att hålla ordning på vad som behöver göras.
                  </p>
                </div>
              </div>

              {/* Expandable sections */}
              <div className="space-y-3 mb-8">
                {currentSection.sections.map((sec, idx) => {
                  const secId = `sec-${idx}`;
                  const isExpanded = expandedSection === secId;
                  return (
                    <button
                      key={secId}
                      onClick={() =>
                        setExpandedSection(isExpanded ? null : secId)
                      }
                      className="card w-full text-left hover:border-accent/50 transition-all"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-primary text-sm flex-1">
                          {sec.title}
                        </h3>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                        )}
                      </div>

                      {isExpanded && (
                        <div className="mt-4 ml-0 pt-4 border-t border-[#E8E4DE] space-y-3">
                          {sec.points.map((point, pidx) => (
                            <div key={pidx}>
                              <p className="font-medium text-primary/80 text-sm">
                                {point.label}
                              </p>
                              <p className="text-sm text-primary/70 mt-1">
                                {point.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Brådskande åtgärder */}
              <div className="card mb-6" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}>
                <h3 className="font-display text-primary text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warn" />
                  Brådskande åtgärder (gör först)
                </h3>
                <ul className="space-y-2">
                  {currentSection.urgentActions.map((action, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-primary/80">
                      <span className="text-warn font-bold flex-shrink-0">
                        {idx + 1}.
                      </span>
                      <span>
                        {action.split(/(\d[\d\s-]{6,})/).map((part, j) => {
                          const digits = part.replace(/[^0-9]/g, '');
                          return digits.length >= 8 ? (
                            <a
                              key={j}
                              href={`tel:${digits}`}
                              className="text-accent hover:underline font-medium"
                            >
                              {part}
                            </a>
                          ) : (
                            part
                          );
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive checklist */}
              <div className="card mb-6">
                <h3 className="font-display text-primary text-sm mb-3">
                  Interaktiv checklista
                </h3>
                <div className="space-y-2">
                  {currentSection.checklist.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleCheckbox(item)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors text-left group"
                    >
                      <div className="mt-1">
                        {checkedItems.has(item) ? (
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-primary/30 flex-shrink-0 group-hover:text-primary/50" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          checkedItems.has(item)
                            ? 'text-primary/50 line-through'
                            : 'text-primary/80'
                        }`}
                      >
                        {item.replace('□ ', '')}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-xs text-primary/70">
                  Klarat: {checkedItems.size} av {currentSection.checklist.length}
                </div>
              </div>

              {/* Legal references */}
              <div className="card mb-6">
                <h3 className="font-display text-primary text-sm mb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary/60" />
                  Juridiska referenser
                </h3>
                <ul className="space-y-1">
                  {currentSection.legalNotes.map((note, idx) => (
                    <li key={idx} className="text-xs text-primary/70">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </>
      )}

      {/* Contact section - always visible */}
      <div className="card mb-6">
        <h3 className="font-display text-primary text-sm mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-accent" />
          Kontakta myndigheter
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-primary">Bolagsverket (AB)</p>
            <a
              href="tel:0771670670"
              className="text-sm text-accent hover:underline font-medium"
            >
              0771-670 670
            </a>
            <p className="text-xs text-muted mt-0.5">
              Styrelseskifte, ägarändringar, registrering
            </p>
          </div>
          <div className="border-t border-[#E8E4DE] pt-4">
            <p className="text-sm font-medium text-primary">Skatteverket</p>
            <a
              href="tel:0771567567"
              className="text-sm text-accent hover:underline font-medium"
            >
              0771-567 567
            </a>
            <p className="text-xs text-muted mt-0.5">
              F-skatt, moms, dödsfall, slutdeklaration
            </p>
          </div>
          <div className="border-t border-[#E8E4DE] pt-4">
            <p className="text-sm font-medium text-primary">Arbetsmiljöverket</p>
            <a
              href="tel:0771892892"
              className="text-sm text-accent hover:underline font-medium"
            >
              0771-892 892
            </a>
            <p className="text-xs text-muted mt-0.5">
              Anställda, uppsägning, arbetsrätt
            </p>
          </div>
          <div className="border-t border-[#E8E4DE] pt-4">
            <p className="text-sm font-medium text-primary">Patent- och registreringsverket</p>
            <a
              href="tel:0771-225 400"
              className="text-sm text-accent hover:underline font-medium"
            >
              0771-225 400
            </a>
            <p className="text-xs text-muted mt-0.5">
              Handelsbolag (HB), kommanditbolag (KB)
            </p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="card mb-6">
        <h3 className="font-display text-primary text-sm mb-4">Användbara resurser</h3>
        <div className="space-y-2">
          <a
            href="https://www.bolagsverket.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Bolagsverket.se — Aktiebolag & KB
          </a>
          <a
            href="https://www.skatteverket.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Skatteverket.se — F-skatt, moms, dödsfall
          </a>
          <a
            href="https://www.av.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Arbetsmiljöverket.se — Anställdafrågor
          </a>
          <a
            href="https://www.prv.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            PRV.se — Handelsbolag & kommanditbolag
          </a>
        </div>
      </div>

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
