'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Bot,
  FileText,
  Download,
  Users,
  Coins,
  Info,
  Plus,
  Trash2,
} from 'lucide-react';

// ── Types ──
interface Delagare {
  id: string;
  namn: string;
  personnummer: string;
  andel: string;
}

interface Tillgang {
  id: string;
  beskrivning: string;
  varde: string;
}

interface ArvskifteData {
  deceasedNamn: string;
  deceasedPnr: string;
  dodsdag: string;
  bouppteckningDatum: string;
  delagare: Delagare[];
  tillgangar: Tillgang[];
  skulder: string;
  fordelning: string;
}

const INITIAL: ArvskifteData = {
  deceasedNamn: '',
  deceasedPnr: '',
  dodsdag: '',
  bouppteckningDatum: '',
  delagare: [],
  tillgangar: [],
  skulder: '',
  fordelning: '',
};

const STEPS = [
  { title: 'Den avlidne', desc: 'Uppgifter om den som gått bort' },
  { title: 'Dödsbodelägare', desc: 'Vilka delar på arvet?' },
  { title: 'Tillgångar & skulder', desc: 'Vad finns i dödsboet?' },
  { title: 'Fördelning', desc: 'Hur ska arvet fördelas?' },
  { title: 'Granska & ladda ner', desc: 'Se över och hämta handlingen' },
];

function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: 'rgba(107,127,94,0.08)' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function ArvskifteContent() {
  const { t } = useLanguage();
  const { state } = useDodsbo();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ArvskifteData>(() => ({
    ...INITIAL,
    deceasedNamn: state.deceasedName || '',
    deceasedPnr: '',
    dodsdag: state.deathDate || '',
    delagare: state.delagare?.map((d) => ({
      id: crypto.randomUUID(),
      namn: d.name,
      personnummer: d.personnummer || '',
      andel: '',
    })) || [],
    tillgangar: state.tillgangar?.map((t) => ({
      id: crypto.randomUUID(),
      beskrivning: t.description || t.type,
      varde: (t.estimatedValue ?? t.confirmedValue)?.toString() || '',
    })) || [],
  }));
  const [newDelagare, setNewDelagare] = useState({ namn: '', personnummer: '', andel: '' });
  const [newTillgang, setNewTillgang] = useState({ beskrivning: '', varde: '' });

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const addDelagare = () => {
    if (!newDelagare.namn.trim()) return;
    setData((d) => ({ ...d, delagare: [...d.delagare, { ...newDelagare, id: crypto.randomUUID() }] }));
    setNewDelagare({ namn: '', personnummer: '', andel: '' });
  };

  const addTillgang = () => {
    if (!newTillgang.beskrivning.trim()) return;
    setData((d) => ({ ...d, tillgangar: [...d.tillgangar, { ...newTillgang, id: crypto.randomUUID() }] }));
    setNewTillgang({ beskrivning: '', varde: '' });
  };

  const generateText = () => {
    const today = new Date().toLocaleDateString('sv-SE');

    const delagareList = data.delagare
      .map((d, i) => `${i + 1}. ${d.namn}, personnummer ${d.personnummer || '____________'}${d.andel ? `, andel: ${d.andel}` : ''}`)
      .join('\n');

    const tillgangarList = data.tillgangar
      .map((t, i) => `${i + 1}. ${t.beskrivning}: ${t.varde ? `${t.varde} kr` : '____________ kr'}`)
      .join('\n');

    const totalVarde = data.tillgangar.reduce((sum, t) => {
      const val = parseFloat(t.varde.replace(/\s/g, ''));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    return `ARVSKIFTESHANDLING

AVSEENDE DÖDSBOET EFTER

${data.deceasedNamn || '_______________'}, personnummer ${data.deceasedPnr || '_______________'}
Avliden: ${data.dodsdag || '_______________'}
${data.bouppteckningDatum ? `Bouppteckning registrerad: ${data.bouppteckningDatum}` : 'Bouppteckning registrerad: _______________'}

────────────────────────────

DÖDSBODELÄGARE

Följande dödsbodelägare är överens om att fördela kvarlåtenskapen enligt nedan:

${delagareList || '(Inga delägare angivna)'}

────────────────────────────

TILLGÅNGAR

Följande tillgångar ingår i dödsboet:

${tillgangarList || '(Inga tillgångar angivna)'}

${data.skulder ? `\nSKULDER OCH AVDRAG\n\n${data.skulder}\n` : ''}
Nettovärde: ${totalVarde > 0 ? totalVarde.toLocaleString('sv-SE') + ' kr' : '____________ kr'}

────────────────────────────

FÖRDELNING

${data.fordelning || 'Dödsbodelägarna är överens om att fördela kvarlåtenskapen lika, varvid var och en erhåller sin arvslott enligt lag.'}

────────────────────────────

UNDERSKRIFTER

Samtliga dödsbodelägare godkänner härmed denna arvskifteshandling.

Datum: ${today}

${data.delagare.map((d) => `
_____________________________________
${d.namn}
Personnummer: ${d.personnummer || '____________'}
`).join('\n')}

────────────────────────────

VIKTIGT ATT TÄNKA PÅ
• Alla dödsbodelägare måste signera handlingen
• Bouppteckningen måste vara registrerad hos Skatteverket först
• Om det finns en bodelning (gifta) ska den göras INNAN arvskiftet
• Behåll originalet och ge kopior till alla delägare
• Om ni inte är överens kan tingsrätten utse en skiftesman

Skapat med Sista Resan — ${today}`;
  };

  const handleDownloadPDF = async () => {
    const { downloadDocumentPDF } = await import('@/lib/generate-document-pdf');
    downloadDocumentPDF('Arvskifteshandling', generateText(), `arvskifteshandling-${data.deceasedNamn || 'dokument'}`);
  };

  const handleDownloadDocx = async () => {
    const { downloadDocumentDocx } = await import('@/lib/generate-document-docx');
    downloadDocumentDocx('Arvskifteshandling', generateText(), `arvskifteshandling-${data.deceasedNamn || 'dokument'}`);
  };

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8 pb-28">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4 rounded-full hover:bg-gray-50 px-3 py-2">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(107,127,94,0.08)' }}>
          <FileText className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-display text-primary">Arvskifteshandling</h1>
          <p className="text-xs text-muted">Steg {step + 1} av {STEPS.length} — {STEPS[step].desc}</p>
        </div>
      </div>

      <div className="flex gap-1.5 my-4">
        {STEPS.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= step ? '#6B7F5E' : '#E8E4DE' }} />
        ))}
      </div>

      {/* ── Step 0: Deceased info ── */}
      {step === 0 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Arvskifteshandlingen är det dokument som fördelar arvet mellan alla dödsbodelägare. Det görs EFTER att bouppteckningen registrerats hos Skatteverket. Börja med att fylla i uppgifter om den avlidne." />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Den avlidnes namn</label>
              <input value={data.deceasedNamn} onChange={(e) => setData({ ...data, deceasedNamn: e.target.value })}
                placeholder="Förnamn Efternamn"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Personnummer</label>
              <input value={data.deceasedPnr} onChange={(e) => setData({ ...data, deceasedPnr: e.target.value })}
                placeholder="XXXXXX-XXXX"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Dödsdag</label>
              <input type="date" value={data.dodsdag} onChange={(e) => setData({ ...data, dodsdag: e.target.value })}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Bouppteckning registrerad <span className="text-muted font-normal">(datum)</span></label>
              <input type="date" value={data.bouppteckningDatum} onChange={(e) => setData({ ...data, bouppteckningDatum: e.target.value })}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background" />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Delagare ── */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Alla dödsbodelägare måste vara med och godkänna arvskiftet. Dödsbodelägare är vanligtvis barn, make/maka, eller den som nämns i testamentet. Om du redan lagt till delägare i appen så har jag fyllt i dem åt dig." />

          {data.delagare.length > 0 && (
            <div className="space-y-2 mb-4">
              {data.delagare.map((d) => (
                <div key={d.id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-medium text-primary text-sm">{d.namn}</p>
                    <p className="text-xs text-muted">{d.personnummer || 'Personnummer ej ifyllt'}{d.andel ? ` — ${d.andel}` : ''}</p>
                  </div>
                  <button onClick={() => setData((prev) => ({ ...prev, delagare: prev.delagare.filter((x) => x.id !== d.id) }))}
                    className="p-2 text-warn"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}

          <div className="card space-y-3">
            <p className="text-sm font-display text-primary">Lägg till dödsbodelägare</p>
            <input value={newDelagare.namn} onChange={(e) => setNewDelagare({ ...newDelagare, namn: e.target.value })}
              placeholder="Namn"
              className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background" />
            <div className="grid grid-cols-2 gap-3">
              <input value={newDelagare.personnummer} onChange={(e) => setNewDelagare({ ...newDelagare, personnummer: e.target.value })}
                placeholder="Personnummer"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-sm" />
              <input value={newDelagare.andel} onChange={(e) => setNewDelagare({ ...newDelagare, andel: e.target.value })}
                placeholder="Andel (t.ex. 1/3)"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-sm" />
            </div>
            <button onClick={addDelagare} disabled={!newDelagare.namn.trim()}
              className="w-full py-3 rounded-[20px] text-sm font-semibold transition-colors bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-40">
              + Lägg till
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Tillgångar & skulder ── */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Lista dödsboets tillgångar — bankkonton, fastigheter, fordon, värdepapper osv. Uppgifterna finns i bouppteckningen. Ange även eventuella skulder som ska dras av innan arvet fördelas." />

          {data.tillgangar.length > 0 && (
            <div className="space-y-2 mb-4">
              {data.tillgangar.map((t) => (
                <div key={t.id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-medium text-primary text-sm">{t.beskrivning}</p>
                    <p className="text-xs text-muted">{t.varde ? `${t.varde} kr` : 'Värde ej angivet'}</p>
                  </div>
                  <button onClick={() => setData((prev) => ({ ...prev, tillgangar: prev.tillgangar.filter((x) => x.id !== t.id) }))}
                    className="p-2 text-warn"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}

          <div className="card space-y-3 mb-4">
            <p className="text-sm font-display text-primary">Lägg till tillgång</p>
            <input value={newTillgang.beskrivning} onChange={(e) => setNewTillgang({ ...newTillgang, beskrivning: e.target.value })}
              placeholder="T.ex. Bankkonto Swedbank"
              className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background" />
            <input value={newTillgang.varde} onChange={(e) => setNewTillgang({ ...newTillgang, varde: e.target.value })}
              placeholder="Värde i kronor"
              className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background" />
            <button onClick={addTillgang} disabled={!newTillgang.beskrivning.trim()}
              className="w-full py-3 rounded-[20px] text-sm font-semibold transition-colors bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-40">
              + Lägg till
            </button>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-primary mb-1.5">Skulder & avdrag <span className="text-muted font-normal">(valfritt)</span></label>
            <textarea value={data.skulder} onChange={(e) => setData({ ...data, skulder: e.target.value })}
              placeholder="T.ex. Bolån Nordea: 500 000 kr, Begravningskostnader: 25 000 kr"
              rows={3}
              className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm" />
          </div>
        </div>
      )}

      {/* ── Step 3: Fördelning ── */}
      {step === 3 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Beskriv hur arvet ska fördelas. Vanligast är att dela lika, men det kan variera om det finns testamente eller om en make/maka ska ha bodelning först. Om ni delar lika kan du lämna fältet tomt." />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Hur ska arvet fördelas?
              </label>
              <textarea value={data.fordelning} onChange={(e) => setData({ ...data, fordelning: e.target.value })}
                placeholder="Lämna tomt för lika fördelning, eller beskriv hur varje delägare ska få sin del. T.ex. 'Erik erhåller fastigheten. Maria erhåller bankmedel motsvarande fastighetens värde.'"
                rows={5}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm" />
            </div>

            <div className="flex gap-3 p-3 rounded-[20px] bg-background">
              <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted leading-relaxed">
                Om en delägare ska ta över en fastighet eller bostad behöver värdet
                kompenseras till övriga. Ni bestämmer själva hur — det viktiga är att
                alla är överens och signerar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Review & download ── */}
      {step === 4 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Granska allt innan du laddar ner. Alla dödsbodelägare måste signera handlingen. Om ni inte kan komma överens kan tingsrätten utse en skiftesman som hjälper till." />

          <div className="card mb-4">
            <p className="text-xs font-display text-muted uppercase tracking-wide mb-3">Sammanfattning</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">Dödsboet efter {data.deceasedNamn || '(ej ifyllt)'}</p>
                  <p className="text-xs text-muted">Avliden {data.dodsdag || '(ej ifyllt)'}</p>
                </div>
              </div>
              <div className="h-px bg-white" />
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">{data.delagare.length} dödsbodelägare</p>
                  {data.delagare.map((d) => (
                    <p key={d.id} className="text-xs text-muted">{d.namn}</p>
                  ))}
                </div>
              </div>
              <div className="h-px bg-white" />
              <div className="flex items-start gap-2">
                <Coins className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">{data.tillgangar.length} tillgångar</p>
                  <p className="text-xs text-muted">
                    Totalt: {data.tillgangar.reduce((s, t) => s + (parseFloat(t.varde.replace(/\s/g, '')) || 0), 0).toLocaleString('sv-SE')} kr
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={handleDownloadPDF} className="btn-primary flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Ladda ner som PDF
            </button>
            <button onClick={handleDownloadDocx} className="w-full py-3 rounded-[20px] text-sm font-semibold border-2 border-accent text-accent hover:bg-accent/5 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Ladda ner som Word
            </button>
          </div>

          <p className="text-xs text-center text-muted mt-4 px-2">
            Denna mall ger allmän vägledning. Konsultera en jurist vid komplexa situationer.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={prev} className="flex-1 py-3 rounded-[20px] text-sm font-semibold border-2 border-[#E8E4DE] text-primary hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Tillbaka
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button onClick={next} className="flex-1 btn-primary flex items-center justify-center gap-1">
            Nästa <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}

export default function ArvskifteshandlingPage() {
  return (
    <DodsboProvider>
      <ArvskifteContent />
    </DodsboProvider>
  );
}
