'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import { downloadDocumentPDF } from '@/lib/generate-document-pdf';
import {
  ArrowLeft,
  Mail,
  Copy,
  Download,
  CheckCircle2,
  Info,
  AlertTriangle,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';

function KallelseSkeleton() {
  return (
    <div className="min-h-dvh bg-background p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-8" />
      <div className="h-48 bg-gray-200 rounded-2xl mb-4" />
      <div className="h-64 bg-gray-200 rounded-2xl" />
    </div>
  );
}

function KallelseContent() {
  const { t } = useLanguage();
  const { state, loading } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form fields for the kallelse
  const [forrattningsDatum, setForrattningsDatum] = useState('');
  const [forrattningsTid, setForrattningsTid] = useState('14:00');
  const [forrattningsPlats, setForrattningsPlats] = useState('');
  const [kalleseDatum, setKallelseDatum] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (state.forrattningsdatum) {
      setForrattningsDatum(state.forrattningsdatum);
    }
  }, [state.forrattningsdatum]);

  if (!mounted || loading) return <KallelseSkeleton />;

  const deceasedName = state.deceasedName || '[den avlidnes namn]';
  const pnr = state.deceasedPersonnummer || '[personnummer]';
  const deathDate = state.deathDate
    ? new Date(state.deathDate).toLocaleDateString('sv-SE')
    : '[dödsdatum]';

  const delagareList = state.delagare.length > 0
    ? state.delagare
        .map((d) => `- ${d.name}${d.relation === 'make_maka' ? ' (efterlevande make/maka)' : ''}`)
        .join('\n')
    : '- [Dödsbodelägare 1]\n- [Dödsbodelägare 2]';

  const formatDatum = (d: string) => {
    if (!d) return '[datum]';
    return new Date(d).toLocaleDateString('sv-SE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const kallelseText = `KALLELSE TILL BOUPPTECKNINGSFÖRRÄTTNING

Dödsbo efter: ${deceasedName}
Personnummer: ${pnr}
Avliden: ${deathDate}

Ni kallas härmed till bouppteckningsförrättning.

Datum: ${formatDatum(forrattningsDatum)}
Tid: ${forrattningsTid || '[tid]'}
Plats: ${forrattningsPlats || '[adress]'}

Kallade dödsbodelägare:
${delagareList}

Förrättningsmän:
${state.forrattningsman.length > 0
  ? state.forrattningsman.map((f) => `- ${f.name}`).join('\n')
  : '- [Förrättningsman 1]\n- [Förrättningsman 2]'}

Bouppgivare: ${state.bouppgivare?.name || '[namn]'}

────────────────────────────────────────────

INFORMATION TILL KALLADE

1. Bouppteckningsförrättningen hålls enligt 20 kap. 2 § ärvdabalken.

2. Vid förrättningen ska dödsboets samtliga tillgångar och skulder
   per dödsdagen gås igenom och antecknas.

3. Du behöver inte närvara personligen — du kan skicka ombud med
   skriftlig fullmakt. Du kan också lämna skriftligt godkännande i förväg.

4. Om du inte kan närvara, meddela detta till kontaktpersonen nedan
   så snart som möjligt.

5. Ta med dig eventuella handlingar som rör den avlidnes tillgångar
   eller skulder (saldobesked, värdeintyg, lånehandlingar m.m.).

────────────────────────────────────────────

Kontaktperson:
Namn: ____________________
Telefon: ____________________
E-post: ____________________

Kallelsen skickad: ${formatDatum(kalleseDatum)}

Denna kallelse ska skickas ut i god tid före förrättningen (minst 2 veckor
rekommenderas). Kallelsen ska skickas till ALLA dödsbodelägare, även de
som inte förväntas ärva.`;

  // Check deadline: 3 months from death
  const deathDateObj = state.deathDate ? new Date(state.deathDate) : null;
  const deadlineDate = deathDateObj
    ? new Date(deathDateObj.getTime() + 90 * 24 * 60 * 60 * 1000)
    : null;
  const daysLeft = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(kallelseText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Mail className="w-7 h-7 text-accent" />
        <h1 className="text-2xl font-semibold text-primary">{t('Kallelse', 'Summons')}</h1>
      </div>
      <p className="text-muted mb-6">
        {t('Skapa kallelse till bouppteckningsförrättningen som ska skickas till alla dödsbodelägare.', 'Create a summons to the estate inventory procedure that should be sent to all estate heirs.')}
      </p>

      {/* Deadline warning */}
      {daysLeft !== null && daysLeft > 0 && daysLeft <= 30 && (
        <div className="warning-box mb-6 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warn">
              {t(`${daysLeft} dagar kvar till deadline`, `${daysLeft} days left until deadline`)}
            </p>
            <p className="text-sm text-primary/70">
              {t(`Bouppteckningsförrättningen ska hållas inom 3 månader från dödsfallet (${deadlineDate?.toLocaleDateString('sv-SE')}). Begär anstånd hos Skatteverket om du behöver mer tid.`, `The estate inventory procedure must be held within 3 months from the date of death (${deadlineDate?.toLocaleDateString('en-US')}). Request an extension from the Tax Agency if you need more time.`)}
            </p>
          </div>
        </div>
      )}

      <div className="info-box mb-6">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/80">
            {t('Alla dödsbodelägare ska kallas till förrättningen, även de som bor på annan ort. Kallelsen bör skickas minst 2 veckor i förväg. Den som inte kan närvara kan skicka ombud med fullmakt.', 'All estate heirs must be summoned to the procedure, even those living in other locations. The summons should be sent at least 2 weeks in advance. Those who cannot attend can send a representative with power of attorney.')}
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="card mb-6 space-y-4">
        <h2 className="font-semibold text-primary text-sm">{t('Förrättningsuppgifter', 'Procedure Details')}</h2>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
            <Calendar className="w-4 h-4 text-muted" /> {t('Datum', 'Date')}
          </label>
          <input
            type="date"
            value={forrattningsDatum}
            onChange={(e) => setForrattningsDatum(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DE] rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
            <Clock className="w-4 h-4 text-muted" /> {t('Tid', 'Time')}
          </label>
          <input
            type="time"
            value={forrattningsTid}
            onChange={(e) => setForrattningsTid(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DE] rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
            <MapPin className="w-4 h-4 text-muted" /> {t('Plats', 'Location')}
          </label>
          <input
            type="text"
            value={forrattningsPlats}
            onChange={(e) => setForrattningsPlats(e.target.value)}
            placeholder={t('T.ex. hemma hos efterlevande, juristbyrån...', 'E.g. at the surviving spouse\'s home, law firm...')}
            className="w-full px-3 py-2 border border-[#E8E4DE] rounded-card text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Preview */}
      <h2 className="font-semibold text-primary mb-2">{t('Förhandsvisning', 'Preview')}</h2>
      <pre className="bg-white rounded-card p-4 text-xs text-primary/80 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto max-h-80 overflow-y-auto mb-4">
        {kallelseText}
      </pre>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCopy}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {t('Kopierad!', 'Copied!')}
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              {t('Kopiera', 'Copy')}
            </>
          )}
        </button>
        <button
          onClick={() => downloadDocumentPDF(t('Kallelse till bouppteckningsförrättning', 'Summons to Estate Inventory Procedure'), kallelseText, 'kallelse-bouppteckning')}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          PDF
        </button>
        <button
          onClick={async () => {
            const { downloadKallelseDocx } = await import('@/lib/generate-kallelse-docx');
            downloadKallelseDocx({
              deceasedName,
              personnummer: pnr,
              deathDate,
              forrattningsDatum: formatDatum(forrattningsDatum),
              forrattningsTid: forrattningsTid || '[tid]',
              forrattningsPlats: forrattningsPlats || '[adress]',
              delagare: state.delagare,
              forrattningsman: state.forrattningsman,
              bouppgivare: state.bouppgivare?.name || '[namn]',
              kallelseDatum: formatDatum(kalleseDatum),
            });
          }}
          className="flex-1 py-3 px-4 rounded-xl bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors flex items-center justify-center gap-2"
        >
          <Mail className="w-5 h-5" />
          {t('Word', 'Word')}
        </button>
      </div>

      <div className="bg-primary-lighter/30 rounded-card p-4">
        <p className="text-xs text-muted leading-relaxed">
          {t('Skicka kallelsen med rekommenderat brev eller e-post. Spara bevis på att alla dödsbodelägare har fått kallelsen — det kan behövas vid registreringen hos Skatteverket.', 'Send the summons by registered mail or email. Keep proof that all estate heirs have received the summons — it may be needed when registering with the Tax Agency.')}
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

export default function KallelsePage() {
  return (
    <DodsboProvider>
      <KallelseContent />
    </DodsboProvider>
  );
}
