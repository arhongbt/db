'use client';

import { useState, useEffect } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import { downloadDocumentPDF } from '@/lib/generate-document-pdf';
import {
  ArrowLeft,
  FileSignature,
  Download,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building2,
  Landmark,
  Shield,
  Mail,
  Info,
} from 'lucide-react';
import { MikeRossTip } from '@/components/ui/MikeRossTip';

// ── Template definitions ──

interface Template {
  id: string;
  title: string;
  category: 'fullmakt' | 'brev' | 'mall' | 'dina_banker';
  icon: typeof FileSignature;
  description: string;
  content: (ctx: TemplateContext) => string;
}

interface TemplateContext {
  deceasedName: string;
  deathDate: string;
  deceasedPersonnummer: string;
  userName: string;
  userRelation: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'fullmakt-dodsbo',
    title: 'Fullmakt för dödsbo',
    category: 'fullmakt',
    icon: FileSignature,
    description: 'Ger en person rätt att företräda dödsboet vid bank, myndigheter och andra ärenden.',
    content: (ctx) => `FULLMAKT

Härmed ger undertecknade dödsbodelägare i dödsboet efter

${ctx.deceasedName}
Personnummer: ${ctx.deceasedPersonnummer || '____________________'}
Avliden: ${ctx.deathDate || '____________________'}

fullmakt åt:

Namn: ${ctx.userName || '____________________'}
Personnummer: ____________________

att för dödsboets räkning:

☐ Företräda dödsboet gentemot banker och kreditinstitut
☐ Avsluta och flytta bankkonton
☐ Säga upp avtal och abonnemang
☐ Kontakta myndigheter (Skatteverket, Försäkringskassan m.fl.)
☐ Ta emot post och handlingar
☐ Annat: ____________________

Fullmakten gäller tills vidare / till och med ____________________

_______________________________________
Ort och datum

_______________________________________
Dödsbodelägare 1 (namnteckning)
Namnförtydligande: ____________________

_______________________________________
Dödsbodelägare 2 (namnteckning)
Namnförtydligande: ____________________

_______________________________________
Dödsbodelägare 3 (namnteckning)
Namnförtydligande: ____________________`,
  },
  {
    id: 'fullmakt-bank',
    title: 'Fullmakt för bank',
    category: 'fullmakt',
    icon: Landmark,
    description: 'Specifik fullmakt för att hantera den avlidnes bankkonton.',
    content: (ctx) => `FULLMAKT FÖR BANKÄRENDEN

Dödsbo efter: ${ctx.deceasedName}
Personnummer: ${ctx.deceasedPersonnummer || '____________________'}
Dödsdatum: ${ctx.deathDate || '____________________'}

Undertecknade dödsbodelägare ger härmed

Namn: ${ctx.userName || '____________________'}
Personnummer: ____________________

fullmakt att för dödsboets räkning:

1. Begära saldobesked per dödsdagen
2. Ta del av kontoutdrag och transaktioner
3. Avsluta bankkonton
4. Överföra medel till dödsboets gemensamma konto
5. Lösa in värdepapper och fonder
6. Avsluta bankfack
7. Avsluta autogiro och stående överföringar

Denna fullmakt gäller hos ____________________  (bankens namn)
och upphör när dödsboet är avslutat.

_______________________________________
Ort och datum

_______________________________________
Samtliga dödsbodelägares underskrift krävs

Namnförtydligande: ____________________
Namnförtydligande: ____________________
Namnförtydligande: ____________________`,
  },
  {
    id: 'brev-bank',
    title: 'Brev till bank — dödsanmälan',
    category: 'brev',
    icon: Building2,
    description: 'Meddela banken om dödsfallet och begär saldobesked per dödsdagen.',
    content: (ctx) => `${ctx.userName || '[Ditt namn]'}
[Din adress]
[Postnummer Ort]

Till: [Bankens namn]
Datum: ${new Date().toLocaleDateString('sv-SE')}

Ärende: Dödsanmälan och begäran om saldobesked

Härmed meddelas att ${ctx.deceasedName || '[den avlidnes namn]'}, personnummer ${ctx.deceasedPersonnummer || '[personnummer]'}, avled den ${ctx.deathDate || '[dödsdatum]'}.

Jag är ${ctx.userRelation || 'dödsbodelägare'} och ber er att:

1. Registrera dödsfallet i era system
2. Skicka saldobesked för samtliga konton per dödsdagen (${ctx.deathDate || '[dödsdatum]'})
3. Meddela om det finns bankfack, depåer eller andra engagemang
4. Stoppa autogiro och stående överföringar tills vidare
5. Informera om eventuella försäkringar kopplade till kontona

Bifogat: Kopia av dödsbevis / dödsfallsintyg

Vänligen skicka saldobesked och övrig information till ovanstående adress.

Med vänliga hälsningar,

_______________________________________
${ctx.userName || '[Underskrift]'}
Telefon: [Telefonnummer]
E-post: [E-postadress]`,
  },
  {
    id: 'brev-forsakring',
    title: 'Brev till försäkringsbolag',
    category: 'brev',
    icon: Shield,
    description: 'Anmäl dödsfallet och fråga om utbetalningar, förmånstagare och pågående försäkringar.',
    content: (ctx) => `${ctx.userName || '[Ditt namn]'}
[Din adress]
[Postnummer Ort]

Till: [Försäkringsbolagets namn]
Datum: ${new Date().toLocaleDateString('sv-SE')}

Ärende: Dödsanmälan — begäran om försäkringsbesked

Härmed anmäls att ${ctx.deceasedName || '[den avlidnes namn]'}, personnummer ${ctx.deceasedPersonnummer || '[personnummer]'}, avled den ${ctx.deathDate || '[dödsdatum]'}.

Jag är ${ctx.userRelation || 'dödsbodelägare'} och önskar information om:

1. Samtliga försäkringar registrerade på den avlidne
2. Livförsäkringar och grupplivförsäkringar — förmånstagare och belopp
3. Pensionsförsäkringar — efterlevandeskydd
4. Hem-, bil- och olycksfallsförsäkringar
5. Eventuella utbetalningar som dödsboet har rätt till

Bifogat: Kopia av dödsbevis

Vänligen bekräfta mottagandet och skicka besked om vilka försäkringar som berörs.

Med vänliga hälsningar,

_______________________________________
${ctx.userName || '[Underskrift]'}
Telefon: [Telefonnummer]`,
  },
  {
    id: 'brev-skatteverket',
    title: 'Brev till Skatteverket',
    category: 'brev',
    icon: Landmark,
    description: 'Begäran om anstånd med bouppteckning eller andra skattefrågor.',
    content: (ctx) => `${ctx.userName || '[Ditt namn]'}
[Din adress]
[Postnummer Ort]

Till: Skatteverket
Datum: ${new Date().toLocaleDateString('sv-SE')}

Ärende: Begäran om anstånd med bouppteckning

Avser dödsboet efter: ${ctx.deceasedName || '[den avlidnes namn]'}
Personnummer: ${ctx.deceasedPersonnummer || '[personnummer]'}
Dödsdatum: ${ctx.deathDate || '[dödsdatum]'}

Undertecknad, ${ctx.userRelation || 'dödsbodelägare'} i ovanstående dödsbo, begär härmed anstånd med att förrätta bouppteckning.

Skäl till begäran:
☐ Utredning av tillgångar och skulder pågår
☐ Dödsbodelägare bor utomlands
☐ Testamentstvist pågår
☐ Annat: ____________________

Bouppteckningen beräknas kunna förrättas senast: ____________________

Med vänliga hälsningar,

_______________________________________
${ctx.userName || '[Underskrift]'}
Telefon: [Telefonnummer]
E-post: [E-postadress]`,
  },
  {
    id: 'brev-hyresvard',
    title: 'Uppsägning av hyresrätt',
    category: 'brev',
    icon: Mail,
    description: 'Säg upp den avlidnes hyresrätt (dödsboet har 1 månads uppsägningstid istället för 3).',
    content: (ctx) => `${ctx.userName || '[Ditt namn]'}
[Din adress]
[Postnummer Ort]

Till: [Hyresvärdens namn]
[Hyresvärdens adress]
Datum: ${new Date().toLocaleDateString('sv-SE')}

Ärende: Uppsägning av hyresavtal — dödsbo

Dödsboet efter ${ctx.deceasedName || '[den avlidnes namn]'}, personnummer ${ctx.deceasedPersonnummer || '[personnummer]'}, som avled den ${ctx.deathDate || '[dödsdatum]'}, säger härmed upp hyresavtalet för:

Adress: [Lägenhetens adress]
Lägenhetsnummer: [Nummer]

Enligt 12 kap. 46 § jordabalken har dödsboet rätt att säga upp hyresavtalet
med en månads uppsägningstid, oavsett avtalad uppsägningstid.

Önskat avflyttningsdatum: ____________________

Kontaktperson för visning och nyckelåterlämning:
${ctx.userName || '[Namn]'}
Telefon: [Telefonnummer]
E-post: [E-postadress]

Med vänliga hälsningar,
För dödsboet efter ${ctx.deceasedName || '[den avlidnes namn]'}

_______________________________________
${ctx.userName || '[Underskrift]'}`,
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  dina_banker: 'Dina bankbrev (auto-genererade)',
  fullmakt: 'Fullmakter',
  brev: 'Brevmallar',
  mall: 'Övriga mallar',
};

// Bank-specific info for smart letters
const BANK_INFO: Record<string, { fullName: string; address: string; dept: string }> = {
  swedbank: { fullName: 'Swedbank AB', address: 'Dödsboavdelningen, 105 34 Stockholm', dept: 'Dödsbo & Arv' },
  handelsbanken: { fullName: 'Svenska Handelsbanken AB', address: '106 70 Stockholm', dept: 'Dödsboärenden' },
  seb: { fullName: 'Skandinaviska Enskilda Banken AB', address: '106 40 Stockholm', dept: 'Dödsboärenden' },
  nordea: { fullName: 'Nordea Bank Abp', address: '105 71 Stockholm', dept: 'Dödsbo' },
  lansforsakringar: { fullName: 'Länsförsäkringar Bank AB', address: '106 50 Stockholm', dept: 'Dödsboservice' },
  ica_banken: { fullName: 'ICA Banken AB', address: '504 82 Borås', dept: 'Kundtjänst — dödsbo' },
  skandiabanken: { fullName: 'Skandiabanken AB', address: '106 55 Stockholm', dept: 'Dödsboärenden' },
  sparbanken: { fullName: 'Sparbanken', address: '[Kontakta ditt lokala kontor]', dept: 'Dödsboärenden' },
};

function generateBankLetters(banks: string[], ctx: TemplateContext): Template[] {
  return banks.map((bankId) => {
    const info = BANK_INFO[bankId];
    const bankName = info?.fullName || bankId;
    return {
      id: `bank-${bankId}`,
      title: `Dödsanmälan — ${info?.fullName.split(' ')[0] || bankId}`,
      category: 'dina_banker' as const,
      icon: Building2,
      description: `Färdigt brev till ${bankName} med begäran om saldobesked och kontospärr.`,
      content: (_ctx: TemplateContext) => `${_ctx.userName || '[Ditt namn]'}
[Din adress]
[Postnummer Ort]

Till: ${bankName}
${info?.dept || 'Dödsboavdelningen'}
${info?.address || '[Bankens adress]'}

Datum: ${new Date().toLocaleDateString('sv-SE')}

Ärende: Dödsanmälan och begäran om saldobesked

Härmed meddelas att ${_ctx.deceasedName || '[den avlidnes namn]'}, personnummer ${_ctx.deceasedPersonnummer || '[personnummer]'}, avled den ${_ctx.deathDate || '[dödsdatum]'}.

Jag är ${_ctx.userRelation || 'dödsbodelägare'} i dödsboet och ber er att:

1. Registrera dödsfallet i era system
2. Spärra konton för uttag (förutom nödvändiga autogiro för bostad/el)
3. Skicka saldobesked för SAMTLIGA konton, depåer och engagemang per dödsdagen (${_ctx.deathDate || '[dödsdatum]'})
4. Meddela om det finns bankfack, borgensåtaganden eller andra engagemang
5. Stoppa stående överföringar och autogiro tills vidare
6. Informera om eventuella försäkringar kopplade till banken
7. Meddela om det finns kreditkort eller krediter

Bifogat:
☐ Kopia av dödsbevis / dödsfallsintyg med släktutredning
☐ Fullmakt från samtliga dödsbodelägare (om tillämpligt)

Vänligen skicka saldobesked och övrig information till ovanstående adress.

Med vänliga hälsningar,

_______________________________________
${_ctx.userName || '[Underskrift]'}
Telefon: [Telefonnummer]
E-post: [E-postadress]`,
    };
  });
}

function FullmaktSkeleton() {
  return (
    <div className="min-h-dvh bg-background p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-8" />
      <div className="space-y-4">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

function FullmaktContent() {
  const { state, loading } = useDodsbo();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || loading) return <FullmaktSkeleton />;

  const ctx: TemplateContext = {
    deceasedName: state.deceasedName || '',
    deathDate: state.deathDate ? new Date(state.deathDate).toLocaleDateString('sv-SE') : '',
    deceasedPersonnummer: state.deceasedPersonnummer || '',
    userName: '',
    userRelation: '',
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
    }
  };

  // Generate smart bank letters from onboarding
  const bankLetters = generateBankLetters(state.onboarding.banks, ctx);
  const allTemplates = [...bankLetters, ...TEMPLATES];
  const categories = ['dina_banker', 'fullmakt', 'brev', 'mall'] as const;

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <FileSignature className="w-7 h-7 text-accent" />
        <h1 className="text-2xl font-semibold text-primary">Fullmakter & mallar</h1>
      </div>
      <p className="text-muted mb-6">
        Färdiga dokument att kopiera, anpassa och skriva ut. Fyll i uppgifter om den avlidne på andra sidor så fylls mallarna i automatiskt.
      </p>

      {bankLetters.length > 0 && (
        <div className="card border-l-4 border-success mb-6">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary/80">
              <strong>{bankLetters.length} bankbrev</strong> har genererats automatiskt
              baserat på bankerna du angav vid registreringen.
            </p>
          </div>
        </div>
      )}

      <MikeRossTip text="En fullmakt ger någon rätt att agera i dödsboets namn — t.ex. tömma konton eller sälja egendom. Den måste vara skriftlig och undertecknad av alla delägare för att vara giltig. En generalfullmakt upphör automatiskt vid dödsfall, så ni behöver en ny dödsbo-specifik fullmakt." />

      <div className="info-box mb-6">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/80">
            Tryck på en mall för att expandera den. Kopiera texten, klistra in i ett
            dokument, fyll i de tomma fälten och skriv ut för underskrift.
          </p>
        </div>
      </div>

      {categories.map((cat) => {
        const items = allTemplates.filter((t) => t.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mb-6">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="space-y-3">
              {items.map((template) => {
                const isExpanded = expandedId === template.id;
                const Icon = template.icon;
                const generatedText = template.content(ctx);

                return (
                  <div key={template.id} className="card">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : template.id)}
                      className="w-full flex items-start gap-3 text-left"
                    >
                      <Icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-primary">{template.title}</p>
                        <p className="text-xs text-muted mt-0.5">{template.description}</p>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                        : <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-4">
                        <pre className="bg-gray-50 rounded-card p-4 text-xs text-primary/80 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
                          {generatedText}
                        </pre>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleCopy(template.id, generatedText)}
                            className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                          >
                            {copied === template.id ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-success" />
                                Kopierad!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Kopiera
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => downloadDocumentPDF(template.title, generatedText, template.title)}
                            className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            PDF
                          </button>
                          <button
                            onClick={async () => {
                              const { downloadDocumentDocx } = await import('@/lib/generate-document-docx');
                              downloadDocumentDocx(template.title, generatedText, template.title);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <FileSignature className="w-4 h-4" />
                            Word
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="bg-primary-lighter/30 rounded-card p-4">
        <p className="text-xs text-muted leading-relaxed">
          Mallarna ger en utgångspunkt och kan behöva anpassas efter din specifika situation.
          Banker kan ha egna blanketter — kontakta dem i förväg. Fullmakter ska undertecknas
          av samtliga dödsbodelägare.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

export default function FullmaktPage() {
  return (
    <DodsboProvider>
      <FullmaktContent />
    </DodsboProvider>
  );
}
