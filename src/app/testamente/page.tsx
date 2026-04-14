'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider } from '@/lib/context';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Bot,
  FileText,
  Download,
  Users,
  Heart,
  Info,
  CheckCircle2,
} from 'lucide-react';

// ── Types ──
interface Arvinge {
  id: string;
  namn: string;
  relation: string;
  andel: string; // e.g. "50%"
}

interface Villkor {
  id: string;
  type: string; // 'nyttjanderätt', 'enskild-egendom', 'åldersvillkor', 'förvaltare', 'sekundoförordnande'
  description: string;
  targetArvinge?: string; // optional: specific heir this applies to
}

interface TestamenteData {
  namn: string;
  personnummer: string;
  adress: string;
  ort: string;
  arvingar: Arvinge[];
  villkor: Villkor[];
  specialOnske: string;
  samtycke: boolean;
}

const INITIAL: TestamenteData = {
  namn: '',
  personnummer: '',
  adress: '',
  ort: '',
  arvingar: [],
  villkor: [],
  specialOnske: '',
  samtycke: false,
};

const STEPS = [
  { title: 'Dina uppgifter', desc: 'Vem skriver testamentet?' },
  { title: 'Arvingar', desc: 'Vem ska ärva?' },
  { title: 'Villkor', desc: 'Lägg till villkor för arvet' },
  { title: 'Särskilda önskemål', desc: 'Har du speciella önskemål?' },
  { title: 'Granska & ladda ner', desc: 'Se över och hämta ditt testamente' },
];

// ── Mike Ross tip component ──
function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: '#E8F0E8' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ── Villkor templates ──
const VILLKOR_TEMPLATES = [
  {
    type: 'nyttjanderätt',
    label: 'Nyttjanderätt',
    description: 'Min make/maka ska ha nyttjanderätt till bostaden',
    placeholder: 'T.ex. Min make ska ha nyttjanderätt till familjebostaden under sin livstid'
  },
  {
    type: 'enskild-egendom',
    label: 'Enskild egendom',
    description: 'Arvet är enskild egendom (skyddas vid skilsmässa)',
    placeholder: 'T.ex. Arvet ska klassificeras som enskild egendom'
  },
  {
    type: 'åldersvillkor',
    label: 'Åldersvillkor',
    description: 'Arvinge måste vara X år för att få sitt arv',
    placeholder: 'T.ex. Min son ska först få sitt arv när han fyllt 25 år'
  },
  {
    type: 'förvaltare',
    label: 'Förvaltare',
    description: 'Utse en förvaltare för minderårig arvinge',
    placeholder: 'T.ex. Min sambo ska förvalta arvet för mina barn tills de blir myndiga'
  },
  {
    type: 'sekundoförordnande',
    label: 'Sekundoförordnande',
    description: 'Alternativ arvinge om primär arvinge skulle dö',
    placeholder: 'T.ex. Om min son inte är vid liv vid min död, ska hans andel tillfalla hans barn'
  },
];

function TestamenteContent() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<TestamenteData>(INITIAL);
  const [newArvinge, setNewArvinge] = useState({ namn: '', relation: '', andel: '' });
  const [newVillkor, setNewVillkor] = useState({ type: '', description: '', targetArvinge: '' });
  const [selectedVillkorType, setSelectedVillkorType] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const addArvinge = () => {
    if (!newArvinge.namn.trim()) return;
    setData((d) => ({
      ...d,
      arvingar: [
        ...d.arvingar,
        { ...newArvinge, id: crypto.randomUUID() },
      ],
    }));
    setNewArvinge({ namn: '', relation: '', andel: '' });
  };

  const removeArvinge = (id: string) => {
    setData((d) => ({ ...d, arvingar: d.arvingar.filter((a) => a.id !== id) }));
  };

  const addVillkor = () => {
    if (!newVillkor.description.trim()) return;
    setData((d) => ({
      ...d,
      villkor: [
        ...d.villkor,
        { ...newVillkor, id: crypto.randomUUID() },
      ],
    }));
    setNewVillkor({ type: '', description: '', targetArvinge: '' });
    setSelectedVillkorType(null);
  };

  const removeVillkor = (id: string) => {
    setData((d) => ({ ...d, villkor: d.villkor.filter((v) => v.id !== id) }));
  };

  const selectVillkorTemplate = (template: typeof VILLKOR_TEMPLATES[0]) => {
    setSelectedVillkorType(template.type);
    setNewVillkor({ type: template.type, description: template.description, targetArvinge: '' });
  };

  // ── Generate document text ──
  const generateText = () => {
    const today = new Date().toLocaleDateString('sv-SE');
    const arvingeList = data.arvingar
      .map((a, i) => `${i + 1}. ${a.namn} (${a.relation}) — ${a.andel || 'lika del'}`)
      .join('\n');

    const villkorSection = data.villkor.length > 0
      ? `VILLKOR FÖR ARVET\n\n${data.villkor.map((v, i) => `${i + 1}. ${v.description}`).join('\n')}\n\n`
      : '';

    return `TESTAMENTE

Undertecknad, ${data.namn}, personnummer ${data.personnummer}, boende på ${data.adress}, ${data.ort}, förordnar härmed som min yttersta vilja följande:

FÖRDELNING AV KVARLÅTENSKAP

Min kvarlåtenskap ska fördelas enligt följande:

${arvingeList}

${villkorSection}${data.specialOnske ? `SÄRSKILDA ÖNSKEMÅL\n\n${data.specialOnske}\n` : ''}ÖVRIGT

Detta testamente ersätter alla eventuella tidigare testamenten.

Upprättat i ${data.ort || '_______________'}, den ${today}.

────────────────────────────

_____________________________________
${data.namn}
Personnummer: ${data.personnummer}


VITTNEN

Vi intygar att ${data.namn} vid fullt och sunt förstånd och av fri vilja undertecknat detta testamente i vår samtidiga närvaro.

_____________________________________
Vittne 1 — Namn

_____________________________________
Adress

_____________________________________
Personnummer


_____________________________________
Vittne 2 — Namn

_____________________________________
Adress

_____________________________________
Personnummer

────────────────────────────

VIKTIGT ATT TÄNKA PÅ
• Två vittnen krävs — de måste vara samtidigt närvarande
• Vittnena får INTE vara arvingar eller deras makar/sambor
• Vittnena måste vara minst 15 år och vid sina sinnens fulla bruk
• Förvara originalet säkert — ge en kopia till en betrodd person
• Du kan alltid ändra ditt testamente genom att skriva ett nytt

Skapat med Sista Resan — ${today}`;
  };

  const handleDownloadPDF = async () => {
    const { downloadDocumentPDF } = await import('@/lib/generate-document-pdf');
    downloadDocumentPDF('Testamente', generateText(), `testamente-${data.namn || 'dokument'}`);
  };

  const handleDownloadDocx = async () => {
    const { downloadDocumentDocx } = await import('@/lib/generate-document-docx');
    downloadDocumentDocx('Testamente', generateText(), `testamente-${data.namn || 'dokument'}`);
  };

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8 pb-28">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4 rounded-full">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#E8F0E8' }}>
          <FileText className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-display text-primary">Skriv testamente</h1>
          <p className="text-xs text-muted">Steg {step + 1} av {STEPS.length} — {STEPS[step].desc}</p>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-1.5 my-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= step ? '#7A9E7E' : '#E8E4DE' }}
          />
        ))}
      </div>

      {/* ── Step 0: Personal details ── */}
      {step === 0 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Här fyller du i dina uppgifter. Personnumret behövs för att testamentet ska vara juridiskt giltigt. Oroa dig inte — allt sparas bara på din enhet." />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Ditt fullständiga namn</label>
              <input
                value={data.namn}
                onChange={(e) => setData({ ...data, namn: e.target.value })}
                placeholder="Anna Andersson"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Personnummer</label>
              <input
                value={data.personnummer}
                onChange={(e) => setData({ ...data, personnummer: e.target.value })}
                placeholder="XXXXXX-XXXX"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Adress</label>
              <input
                value={data.adress}
                onChange={(e) => setData({ ...data, adress: e.target.value })}
                placeholder="Storgatan 1"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Ort</label>
              <input
                value={data.ort}
                onChange={(e) => setData({ ...data, ort: e.target.value })}
                placeholder="Stockholm"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Arvingar ── */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Lägg till de personer som ska ärva dig. Du kan ange en procentandel för varje person, eller lämna tomt så delas arvet lika. Kom ihåg: bröstarvingar (barn) har alltid rätt till sin laglott — halva arvet." />

          {data.arvingar.length > 0 && (
            <div className="space-y-2 mb-4">
              {data.arvingar.map((a) => (
                <div key={a.id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-medium text-primary text-sm">{a.namn}</p>
                    <p className="text-xs text-muted">{a.relation} — {a.andel || 'lika del'}</p>
                  </div>
                  <button onClick={() => removeArvinge(a.id)} className="text-warn text-xs font-medium">
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="card space-y-3">
            <p className="text-sm font-semibold text-primary">Lägg till arvinge</p>
            <input
              value={newArvinge.namn}
              onChange={(e) => setNewArvinge({ ...newArvinge, namn: e.target.value })}
              placeholder="Namn"
              className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={newArvinge.relation}
                onChange={(e) => setNewArvinge({ ...newArvinge, relation: e.target.value })}
                placeholder="Relation (t.ex. dotter)"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-sm"
              />
              <input
                value={newArvinge.andel}
                onChange={(e) => setNewArvinge({ ...newArvinge, andel: e.target.value })}
                placeholder="Andel (t.ex. 50%)"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-sm"
              />
            </div>
            <button
              onClick={addArvinge}
              disabled={!newArvinge.namn.trim()}
              className="w-full py-3 rounded-[20px] text-sm font-semibold transition-colors"
              style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}
            >
              + Lägg till
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Villkor ── */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Villkor är speciella förutsättningar för arvet. Du kan till exempel bestämma att en arvinge måste vara 25 år för att få sitt arv, eller att arvet är enskild egendom som skyddas vid skilsmässa." />

          {data.villkor.length > 0 && (
            <div className="space-y-2 mb-4">
              {data.villkor.map((v) => (
                <div key={v.id} className="card flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-primary text-sm">{v.description}</p>
                    {v.targetArvinge && <p className="text-xs text-muted">Gäller: {v.targetArvinge}</p>}
                  </div>
                  <button onClick={() => removeVillkor(v.id)} className="text-warn text-xs font-medium flex-shrink-0">
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="card space-y-4">
            <p className="text-sm font-semibold text-primary">Välj villkorstyp</p>

            <div className="grid grid-cols-1 gap-2">
              {VILLKOR_TEMPLATES.map((template) => (
                <button
                  key={template.type}
                  onClick={() => selectVillkorTemplate(template)}
                  className={`p-3 rounded-[20px] text-left border transition-all ${
                    selectedVillkorType === template.type
                      ? 'border-none'
                      : 'border border-[#E8E4DE] hover:border-accent/30'
                  }`}
                  style={selectedVillkorType === template.type ? { background: 'linear-gradient(135deg, rgba(122,158,126,0.06), rgba(122,158,126,0.02))', border: '1px solid rgba(122,158,126,0.15)' } : {}}
                >
                  <p className="font-medium text-sm text-primary">{template.label}</p>
                  <p className="text-xs text-muted mt-0.5">{template.description}</p>
                </button>
              ))}
            </div>

            {selectedVillkorType && (
              <div className="space-y-3 pt-3 border-t border-[#E8E4DE]">
                <p className="text-sm font-semibold text-primary">Beskriv villkoret</p>
                <textarea
                  value={newVillkor.description}
                  onChange={(e) => setNewVillkor({ ...newVillkor, description: e.target.value })}
                  placeholder={VILLKOR_TEMPLATES.find(t => t.type === selectedVillkorType)?.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm"
                />

                {data.arvingar.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Gäller specifik arvinge <span className="text-muted font-normal">(valfritt)</span>
                    </label>
                    <select
                      value={newVillkor.targetArvinge}
                      onChange={(e) => setNewVillkor({ ...newVillkor, targetArvinge: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-sm"
                    >
                      <option value="">— Alla arvingar</option>
                      {data.arvingar.map((a) => (
                        <option key={a.id} value={a.namn}>{a.namn}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={addVillkor}
                  disabled={!newVillkor.description.trim()}
                  className="w-full py-3 rounded-[20px] text-sm font-semibold transition-colors disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}
                >
                  + Lägg till villkor
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Step 3: Special wishes ── */}
      {step === 3 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Här kan du skriva särskilda önskemål. Till exempel: vem som ska ta hand om husdjur, om du vill att en viss person ska få ett specifikt föremål, eller andra speciella instruktioner." />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Särskilda önskemål <span className="text-muted font-normal">(valfritt)</span>
              </label>
              <textarea
                value={data.specialOnske}
                onChange={(e) => setData({ ...data, specialOnske: e.target.value })}
                placeholder="T.ex. 'Min samling tavlor ska tillfalla min dotter Eva. Arvet ska vara enskild egendom.'"
                rows={5}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm"
              />
            </div>

            <div className="flex gap-3 p-3 rounded-[20px]" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(122,158,126,0.06), rgba(122,158,126,0.02))', border: '1px solid rgba(122,158,126,0.15)' }}>
              <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted leading-relaxed">
                Vanliga önskemål: enskild egendom (arvet skyddas vid skilsmässa),
                specifika föremål till viss person, önskemål om begravning,
                eller att sambo ska ärva framför släktingar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Review & download ── */}
      {step === 4 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Här ser du en sammanfattning. Ladda ner som PDF eller Word, skriv ut och signera med två vittnen. Vittnena måste vara närvarande samtidigt och får inte vara arvingar." />

          {/* Summary */}
          <div className="card mb-4">
            <p className="text-xs font-display text-muted mb-3">Sammanfattning</p>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">{data.namn || 'Ej ifyllt'}</p>
                  <p className="text-xs text-muted">{data.personnummer} — {data.ort}</p>
                </div>
              </div>

              <div className="h-px bg-white" />

              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">{data.arvingar.length} arvingar</p>
                  {data.arvingar.map((a) => (
                    <p key={a.id} className="text-xs text-muted">{a.namn} ({a.relation}) — {a.andel || 'lika del'}</p>
                  ))}
                  {data.arvingar.length === 0 && <p className="text-xs text-warn">Inga arvingar tillagda</p>}
                </div>
              </div>

              {data.villkor.length > 0 && (
                <>
                  <div className="h-px bg-white" />
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary">{data.villkor.length} villkor</p>
                      {data.villkor.map((v) => (
                        <p key={v.id} className="text-xs text-muted">{v.description.slice(0, 80)}{v.description.length > 80 ? '...' : ''}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {data.specialOnske && (
                <>
                  <div className="h-px bg-white" />
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary">Särskilda önskemål</p>
                      <p className="text-xs text-muted">{data.specialOnske.slice(0, 100)}...</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Important note */}
          <div className="mb-4" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}>
            <div className="flex items-start gap-2 p-3">
              <Info className="w-4 h-4 text-warn flex-shrink-0 mt-0.5" />
              <p className="text-xs text-primary/80 leading-relaxed">
                <strong>Viktigt:</strong> Testamentet måste skrivas ut och signeras
                med två vittnen som är samtidigt närvarande. Utan vittnen är det ogiltigt.
              </p>
            </div>
          </div>

          {/* Download buttons */}
          <div className="flex flex-col gap-2">
            <button onClick={handleDownloadPDF} className="w-full py-3 rounded-[20px] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors" style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}>
              <Download className="w-4 h-4" /> Ladda ner som PDF
            </button>
            <button onClick={handleDownloadDocx} className="w-full py-3 rounded-[20px] text-sm font-semibold border-2 border-accent text-accent hover:bg-accent/5 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Ladda ner som Word
            </button>
          </div>

          {/* Legal disclaimer */}
          <p className="text-xs text-center text-muted mt-4 px-2">
            Denna mall ger allmän vägledning. Konsultera en jurist vid komplexa situationer.
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={prev} className="flex-1 py-3 rounded-[20px] text-sm font-semibold border-2 border-[#E8E4DE] text-primary hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Tillbaka
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button onClick={next} className="flex-1 py-3 rounded-[20px] text-sm font-semibold text-white flex items-center justify-center gap-1" style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}>
            Nästa <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}

export default function TestamentePage() {
  return (
    <DodsboProvider>
      <TestamenteContent />
    </DodsboProvider>
  );
}
