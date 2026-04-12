'use client';

import { useState } from 'react';
import { DodsboProvider } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Bot,
  Flower2,
  Info,
  CheckCircle2,
  Radio,
} from 'lucide-react';

// ── Types ──
interface BegravningsplanerData {
  // Step 0: Type of funeral
  begravningstyp: 'jordbegravning' | 'islamisk' | 'annan' | '';
  ceremoniTyp: 'svenska_kyrkan' | 'annan_trossamfund' | 'borgerlig' | 'islamisk_utan_kyrka' | '';

  // Step 1: Funeral home
  begravningsbyra: string;
  telefon: string;
  offert: string;

  // Step 2: Ceremony & place
  begravningsDatum: string;
  plats: string;
  officiant: string;
  musik: string;
  blommor: string;

  // Step 3: Death notice & memorial
  dodsannonsText: string;
  tidningar: string;
  minnesStund: boolean;
  minnesStundPlats: string;
  minnesStundGaster: string;
  minnesStundMat: string;

  // Step 4: Summary
  checklista: {
    dodsbevisBegruning: boolean;
    kladerAvliden: boolean;
    blommor2: boolean;
    minnesstund2: boolean;
    dodsannons2: boolean;
  };
}

const INITIAL: BegravningsplanerData = {
  begravningstyp: '',
  ceremoniTyp: '',
  begravningsbyra: '',
  telefon: '',
  offert: '',
  begravningsDatum: '',
  plats: '',
  officiant: '',
  musik: '',
  blommor: '',
  dodsannonsText: '',
  tidningar: '',
  minnesStund: false,
  minnesStundPlats: '',
  minnesStundGaster: '',
  minnesStundMat: '',
  checklista: {
    dodsbevisBegruning: false,
    kladerAvliden: false,
    blommor2: false,
    minnesstund2: false,
    dodsannons2: false,
  },
};

const STEPS = [
  { title: 'Typ av begravning', desc: 'Vilken typ av begravning?' },
  { title: 'Begravningsbyrå', desc: 'Värderingen och kostnader' },
  { title: 'Ceremoni & plats', desc: 'Datum och ceremonidetaljer' },
  { title: 'Dödsannons & minnesstund', desc: 'Dödsannons och minnesstund' },
  { title: 'Sammanfattning', desc: 'Se över din plan' },
];

// ── Mike Ross tip component ──
function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: '#EEF2EA' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function BegravningsplaneringContent() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BegravningsplanerData>(INITIAL);
  const [saved, setSaved] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSavePlan = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#EEF2EA' }}>
          <Flower2 className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">Begravningsplanering</h1>
          <p className="text-xs text-muted">Steg {step + 1} av {STEPS.length} — {STEPS[step].desc}</p>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-1.5 my-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= step ? '#6B7F5E' : '#E8E4DE' }}
          />
        ))}
      </div>

      {/* ── Step 0: Type of funeral ── */}
      {step === 0 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Det finns inga juridiska krav på vilken typ av begravning — det viktigaste är att respektera den avlidnes önskemål om sådana finns." />

          {data.begravningstyp === 'islamisk' && (
            <MikeRossTip text="Vid islamisk begravning ska begravningen ske så snart som möjligt, helst inom 24 timmar. Kontakta en muslimsk begravningsbyrå direkt. I Sverige finns Islamic Burial Society och lokala moskéer som kan hjälpa. Kroppen ska tvättas (ghusl) och svepas i vitt tyg (kafan) enligt tradition." />
          )}

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-3">Vilken typ av begravning?</label>
              <div className="space-y-3">
                {[
                  { id: 'jordbegravning', label: 'Jordbegravning' },
                  { id: 'islamisk', label: 'Islamisk begravning' },
                  { id: 'annan', label: 'Annan (naturlig begravning, etc.)' },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-background transition-colors border-2"
                    style={{ borderColor: data.begravningstyp === option.id ? '#6B7F5E' : '#E8E4DE' }}>
                    <input
                      type="radio"
                      name="begravningstyp"
                      value={option.id}
                      checked={data.begravningstyp === option.id}
                      onChange={(e) => setData({ ...data, begravningstyp: e.target.value as any })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div>
              <label className="block text-sm font-medium text-primary mb-3">Ceremonityp</label>
              <div className="space-y-3">
                {[
                  { id: 'svenska_kyrkan', label: 'Religiös (Svenska kyrkan)' },
                  { id: 'annan_trossamfund', label: 'Religiös (annan trossamfund)' },
                  { id: 'borgerlig', label: 'Borgerlig' },
                  { id: 'islamisk_utan_kyrka', label: 'Islamisk (utan ceremoni i kyrka)' },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-background transition-colors">
                    <input
                      type="radio"
                      name="ceremoniTyp"
                      value={option.id}
                      checked={data.ceremoniTyp === option.id}
                      onChange={(e) => setData({ ...data, ceremoniTyp: e.target.value as any })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Funeral home ── */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Du kan jämföra begravningsbyråer fritt. Be alltid om en skriftlig offert. Genomsnittskostnaden i Sverige är ca 25 000–45 000 kr. Alla har rätt till begravningshjälp via Försäkringskassan (halva prisbasbeloppet)." />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Namn på begravningsbyrå</label>
              <input
                value={data.begravningsbyra}
                onChange={(e) => setData({ ...data, begravningsbyra: e.target.value })}
                placeholder="T.ex. Nordstöms begravningsbyrå"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Telefonnummer</label>
              <input
                value={data.telefon}
                onChange={(e) => setData({ ...data, telefon: e.target.value })}
                placeholder="08-XXX XX XX"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Offert/kostnad (kr)</label>
              <input
                value={data.offert}
                onChange={(e) => setData({ ...data, offert: e.target.value })}
                placeholder="T.ex. 35000"
                type="number"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
          </div>

          {/* Info box about begravningshjälp */}
          <div className="flex gap-3 p-4 rounded-2xl mt-4 bg-blue-50 border border-blue-100">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900 mb-1">Begravningshjälp från Försäkringskassan</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                Du kan få begravningshjälp motsvarande halva prisbasbeloppet. År 2026 är det ca 24 000 kr. Du måste ansöka inom två år efter begravningen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Ceremony & place ── */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Begravningen ska ske inom 30 dagar från dödsfallet (kan förlängas vid särskilda skäl). Kontakta församlingen i god tid. Du kan välja vilken musik du vill — det behöver inte vara psalmer." />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Datum för begravning</label>
              <input
                type="date"
                value={data.begravningsDatum}
                onChange={(e) => setData({ ...data, begravningsDatum: e.target.value })}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Plats (kyrka, kapell, annan plats)</label>
              <input
                value={data.plats}
                onChange={(e) => setData({ ...data, plats: e.target.value })}
                placeholder="T.ex. Storkyrkan, Stockholm"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Officiant (präst, borgerlig officiant, etc.)</label>
              <input
                value={data.officiant}
                onChange={(e) => setData({ ...data, officiant: e.target.value })}
                placeholder="T.ex. Präst Maria Svensson"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Musik & psalmer</label>
              <textarea
                value={data.musik}
                onChange={(e) => setData({ ...data, musik: e.target.value })}
                placeholder="T.ex. 'Psalm 23, musikstycke från Grieg'"
                rows={3}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Blommor & dekoration</label>
              <textarea
                value={data.blommor}
                onChange={(e) => setData({ ...data, blommor: e.target.value })}
                placeholder="T.ex. 'Vita rosor och liljor. En minneskrans från familjen.'"
                rows={3}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Death notice & memorial ── */}
      {step === 3 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="En dödsannons i en rikstäckande tidning kostar ca 3 000–8 000 kr. Du kan också publicera gratis digitalt via minnesida.se eller liknande tjänster." />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Text till dödsannons</label>
              <textarea
                value={data.dodsannonsText}
                onChange={(e) => setData({ ...data, dodsannonsText: e.target.value })}
                placeholder="T.ex. 'Anna Andersson, 1940–2026, född i Värmland...'"
                rows={4}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Tidning(ar) att publicera i</label>
              <input
                value={data.tidningar}
                onChange={(e) => setData({ ...data, tidningar: e.target.value })}
                placeholder="T.ex. 'Dagens Nyheter, Stockholms-Tidningen'"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>

            <div className="h-px bg-gray-100" />

            <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-background transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={data.minnesStund}
                onChange={(e) => setData({ ...data, minnesStund: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-primary">Planera minnesstund efter begravningen?</span>
            </label>

            {data.minnesStund && (
              <div className="space-y-3 pt-2 border-t border-[#E8E4DE]">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Plats för minnesstund</label>
                  <input
                    value={data.minnesStundPlats}
                    onChange={(e) => setData({ ...data, minnesStundPlats: e.target.value })}
                    placeholder="T.ex. Närby församlingshem"
                    className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Antal gäster (ungefär)</label>
                  <input
                    value={data.minnesStundGaster}
                    onChange={(e) => setData({ ...data, minnesStundGaster: e.target.value })}
                    placeholder="T.ex. 40–50 personer"
                    className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Mat & fika</label>
                  <input
                    value={data.minnesStundMat}
                    onChange={(e) => setData({ ...data, minnesStundMat: e.target.value })}
                    placeholder="T.ex. 'Enkla smörgåsar, kaffe och tårta'"
                    className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Step 4: Summary & checklist ── */}
      {step === 4 && (
        <div className="animate-fadeIn">
          <MikeRossTip text="Du är nästan klar! Här ser du en sammanfattning av din begravningsplan. Gå igenom checklistan för att se vad du behöver ordna." />

          {/* Summary */}
          <div className="card mb-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">Sammanfattning av din plan</p>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted uppercase mb-1">Typ av begravning</p>
                <p className="text-sm text-primary">
                  {data.begravningstyp === 'jordbegravning' && 'Jordbegravning'}
                  {data.begravningstyp === 'islamisk' && 'Islamisk begravning'}
                  {data.begravningstyp === 'annan' && 'Annan'}
                  {data.ceremoniTyp && ` — ${
                    data.ceremoniTyp === 'svenska_kyrkan' ? 'Religiös (Svenska kyrkan)' :
                    data.ceremoniTyp === 'annan_trossamfund' ? 'Religiös (annan trossamfund)' :
                    data.ceremoniTyp === 'borgerlig' ? 'Borgerlig ceremoni' :
                    data.ceremoniTyp === 'islamisk_utan_kyrka' ? 'Islamisk (utan ceremoni i kyrka)' :
                    ''
                  }`}
                </p>
              </div>

              {data.begravningsbyra && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase mb-1">Begravningsbyrå</p>
                    <p className="text-sm text-primary">{data.begravningsbyra}</p>
                    {data.offert && <p className="text-xs text-muted">{data.offert} kr</p>}
                  </div>
                </>
              )}

              {data.begravningsDatum && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase mb-1">Ceremoni</p>
                    <p className="text-sm text-primary">{data.begravningsDatum} på {data.plats || 'TBD'}</p>
                    {data.officiant && <p className="text-xs text-muted">{data.officiant}</p>}
                  </div>
                </>
              )}

              {data.dodsannonsText && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase mb-1">Dödsannons</p>
                    <p className="text-xs text-muted">{data.dodsannonsText.slice(0, 60)}...</p>
                  </div>
                </>
              )}

              {data.minnesStund && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase mb-1">Minnesstund</p>
                    <p className="text-sm text-primary">{data.minnesStundPlats}</p>
                    {data.minnesStundGaster && <p className="text-xs text-muted">{data.minnesStundGaster}</p>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="card mb-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">Checklista</p>
            <div className="space-y-3">
              {[
                { key: 'dodsbevisBegruning', label: 'Dödsbevis till begravningsbyrå' },
                { key: 'kladerAvliden', label: 'Kläder till den avlidne' },
                { key: 'blommor2', label: 'Blommor beställda' },
                { key: 'minnesstund2', label: 'Minnesstund planerad' },
                { key: 'dodsannons2', label: 'Dödsannons publicerad' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-background transition-colors">
                  <input
                    type="checkbox"
                    checked={data.checklista[item.key as keyof typeof data.checklista]}
                    onChange={(e) => setData({
                      ...data,
                      checklista: {
                        ...data.checklista,
                        [item.key]: e.target.checked
                      }
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-primary">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save button */}
          {!saved ? (
            <button
              onClick={handleSavePlan}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              Spara plan
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-xl text-sm font-semibold bg-green-100 text-green-700 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Plan sparad!
            </button>
          )}

          <p className="text-xs text-center text-muted mt-4 px-2">
            Din begravningsplan sparas lokalt på din enhet.
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={prev} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-[#E8E4DE] text-primary hover:bg-background transition-colors flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Tillbaka
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button onClick={next} className="flex-1 btn-primary flex items-center justify-center gap-1">
            Nästa <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function BegravningsplaneringPage() {
  return (
    <DodsboProvider>
      <BegravningsplaneringContent />
    </DodsboProvider>
  );
}
