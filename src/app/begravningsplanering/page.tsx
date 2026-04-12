'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
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
  { title: 'Typ av begravning', desc: 'Vilken typ av begravning?', titleEn: 'Type of funeral', descEn: 'What type of funeral?' },
  { title: 'Begravningsbyrå', desc: 'Värderingen och kostnader', titleEn: 'Funeral home', descEn: 'Pricing and costs' },
  { title: 'Ceremoni & plats', desc: 'Datum och ceremonidetaljer', titleEn: 'Ceremony & place', descEn: 'Date and ceremony details' },
  { title: 'Dödsannons & minnesstund', desc: 'Dödsannons och minnesstund', titleEn: 'Death notice & memorial', descEn: 'Death notice and memorial gathering' },
  { title: 'Sammanfattning', desc: 'Se över din plan', titleEn: 'Summary', descEn: 'Review your plan' },
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
  const { t } = useLanguage();
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
        <ArrowLeft className="w-4 h-4" /> {t('Dashboard', 'Dashboard')}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#EEF2EA' }}>
          <Flower2 className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">{t('Begravningsplanering', 'Funeral Planning')}</h1>
          <p className="text-xs text-muted">{t('Steg', 'Step')} {step + 1} {t('av', 'of')} {STEPS.length} — {t(STEPS[step].desc, STEPS[step].descEn)}</p>
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
          <MikeRossTip text={t('Det finns inga juridiska krav på vilken typ av begravning — det viktigaste är att respektera den avlidnes önskemål om sådana finns.', 'There are no legal requirements for the type of funeral — the most important thing is to respect the deceased\'s wishes if any exist.')} />

          {data.begravningstyp === 'islamisk' && (
            <MikeRossTip text={t('Vid islamisk begravning ska begravningen ske så snart som möjligt, helst inom 24 timmar. Kontakta en muslimsk begravningsbyrå direkt. I Sverige finns Islamic Burial Society och lokala moskéer som kan hjälpa. Kroppen ska tvättas (ghusl) och svepas i vitt tyg (kafan) enligt tradition.', 'In Islamic funeral, the burial should take place as soon as possible, preferably within 24 hours. Contact a Muslim funeral home directly. In Sweden, Islamic Burial Society and local mosques can help. The body must be washed (ghusl) and wrapped in white cloth (kafan) according to tradition.')} />
          )}

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-3">{t('Vilken typ av begravning?', 'What type of funeral?')}</label>
              <div className="space-y-3">
                {[
                  { id: 'jordbegravning', label: t('Jordbegravning', 'Burial') },
                  { id: 'islamisk', label: t('Islamisk begravning', 'Islamic funeral') },
                  { id: 'annan', label: t('Annan (naturlig begravning, etc.)', 'Other (natural burial, etc.)') },
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
              <label className="block text-sm font-medium text-primary mb-3">{t('Ceremonityp', 'Ceremony Type')}</label>
              <div className="space-y-3">
                {[
                  { id: 'svenska_kyrkan', label: t('Religiös (Svenska kyrkan)', 'Religious (Church of Sweden)') },
                  { id: 'annan_trossamfund', label: t('Religiös (annan trossamfund)', 'Religious (other faith community)') },
                  { id: 'borgerlig', label: t('Borgerlig', 'Civil') },
                  { id: 'islamisk_utan_kyrka', label: t('Islamisk (utan ceremoni i kyrka)', 'Islamic (without church ceremony)') },
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
          <MikeRossTip text={t('Du kan jämföra begravningsbyråer fritt. Be alltid om en skriftlig offert. Genomsnittskostnaden i Sverige är ca 25 000–45 000 kr. Alla har rätt till begravningshjälp via Försäkringskassan (halva prisbasbeloppet).', 'You can compare funeral homes freely. Always ask for a written quote. The average cost in Sweden is about 25,000–45,000 SEK. Everyone is entitled to funeral assistance from the Swedish Social Insurance Agency (half the price base amount).')} />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Namn på begravningsbyrå', 'Funeral home name')}</label>
              <input
                value={data.begravningsbyra}
                onChange={(e) => setData({ ...data, begravningsbyra: e.target.value })}
                placeholder={t('T.ex. Nordstöms begravningsbyrå', 'E.g. Smith\'s funeral home')}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Telefonnummer', 'Phone number')}</label>
              <input
                value={data.telefon}
                onChange={(e) => setData({ ...data, telefon: e.target.value })}
                placeholder="08-XXX XX XX"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Offert/kostnad (kr)', 'Quote/cost (SEK)')}</label>
              <input
                value={data.offert}
                onChange={(e) => setData({ ...data, offert: e.target.value })}
                placeholder={t('T.ex. 35000', 'E.g. 35000')}
                type="number"
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
          </div>

          {/* Info box about begravningshjälp */}
          <div className="flex gap-3 p-4 rounded-2xl mt-4 bg-blue-50 border border-blue-100">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900 mb-1">{t('Begravningshjälp från Försäkringskassan', 'Funeral assistance from Swedish Social Insurance Agency')}</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                {t('Du kan få begravningshjälp motsvarande halva prisbasbeloppet. År 2026 är det ca 24 000 kr. Du måste ansöka inom två år efter begravningen.', 'You can receive funeral assistance equal to half the price base amount. In 2026 it is approximately 24,000 SEK. You must apply within two years of the funeral.')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Ceremony & place ── */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <MikeRossTip text={t('Begravningen ska ske inom 30 dagar från dödsfallet (kan förlängas vid särskilda skäl). Kontakta församlingen i god tid. Du kan välja vilken musik du vill — det behöver inte vara psalmer.', 'The funeral must take place within 30 days of death (can be extended for special reasons). Contact the congregation in good time. You can choose any music you want — it doesn\'t have to be hymns.')} />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Datum för begravning', 'Funeral date')}</label>
              <input
                type="date"
                value={data.begravningsDatum}
                onChange={(e) => setData({ ...data, begravningsDatum: e.target.value })}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Plats (kyrka, kapell, annan plats)', 'Location (church, chapel, other venue)')}</label>
              <input
                value={data.plats}
                onChange={(e) => setData({ ...data, plats: e.target.value })}
                placeholder={t('T.ex. Storkyrkan, Stockholm', 'E.g. Stockholm Cathedral, Stockholm')}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Officiant (präst, borgerlig officiant, etc.)', 'Officiant (priest, civil officiant, etc.)')}</label>
              <input
                value={data.officiant}
                onChange={(e) => setData({ ...data, officiant: e.target.value })}
                placeholder={t('T.ex. Präst Maria Svensson', 'E.g. Rev. Mary Smith')}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Musik & psalmer', 'Music & hymns')}</label>
              <textarea
                value={data.musik}
                onChange={(e) => setData({ ...data, musik: e.target.value })}
                placeholder={t('T.ex. \'Psalm 23, musikstycke från Grieg\'', 'E.g. \'Psalm 23, piece by Grieg\'')}
                rows={3}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Blommor & dekoration', 'Flowers & decoration')}</label>
              <textarea
                value={data.blommor}
                onChange={(e) => setData({ ...data, blommor: e.target.value })}
                placeholder={t('T.ex. \'Vita rosor och liljor. En minneskrans från familjen.\'', 'E.g. \'White roses and lilies. A memorial wreath from the family.\'')}
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
          <MikeRossTip text={t('En dödsannons i en rikstäckande tidning kostar ca 3 000–8 000 kr. Du kan också publicera gratis digitalt via minnesida.se eller liknande tjänster.', 'A death notice in a national newspaper costs about 3,000–8,000 SEK. You can also publish for free digitally via minnesida.se or similar services.')} />

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Text till dödsannons', 'Death notice text')}</label>
              <textarea
                value={data.dodsannonsText}
                onChange={(e) => setData({ ...data, dodsannonsText: e.target.value })}
                placeholder={t('T.ex. \'Anna Andersson, 1940–2026, född i Värmland...\'', 'E.g. \'Anna Andersson, 1940–2026, born in Värmland...\'')}
                rows={4}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">{t('Tidning(ar) att publicera i', 'Newspaper(s) to publish in')}</label>
              <input
                value={data.tidningar}
                onChange={(e) => setData({ ...data, tidningar: e.target.value })}
                placeholder={t('T.ex. \'Dagens Nyheter, Stockholms-Tidningen\'', 'E.g. \'Dagens Nyheter, Stockholm Times\'')}
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
              <span className="text-sm font-medium text-primary">{t('Planera minnesstund efter begravningen?', 'Plan a memorial gathering after the funeral?')}</span>
            </label>

            {data.minnesStund && (
              <div className="space-y-3 pt-2 border-t border-[#E8E4DE]">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">{t('Plats för minnesstund', 'Location for memorial gathering')}</label>
                  <input
                    value={data.minnesStundPlats}
                    onChange={(e) => setData({ ...data, minnesStundPlats: e.target.value })}
                    placeholder={t('T.ex. Närby församlingshem', 'E.g. Local parish hall')}
                    className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">{t('Antal gäster (ungefär)', 'Number of guests (approximately)')}</label>
                  <input
                    value={data.minnesStundGaster}
                    onChange={(e) => setData({ ...data, minnesStundGaster: e.target.value })}
                    placeholder={t('T.ex. 40–50 personer', 'E.g. 40–50 people')}
                    className="w-full px-4 py-3 border border-[#E8E4DE] rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">{t('Mat & fika', 'Food & refreshments')}</label>
                  <input
                    value={data.minnesStundMat}
                    onChange={(e) => setData({ ...data, minnesStundMat: e.target.value })}
                    placeholder={t('T.ex. \'Enkla smörgåsar, kaffe och tårta\'', 'E.g. \'Simple sandwiches, coffee and cake\'')}
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
          <MikeRossTip text={t('Du är nästan klar! Här ser du en sammanfattning av din begravningsplan. Gå igenom checklistan för att se vad du behöver ordna.', 'You\'re almost done! Here you can see a summary of your funeral plan. Review the checklist to see what you need to arrange.')} />

          {/* Summary */}
          <div className="card mb-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">{t('Sammanfattning av din plan', 'Summary of your plan')}</p>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted uppercase mb-1">{t('Typ av begravning', 'Type of funeral')}</p>
                <p className="text-sm text-primary">
                  {data.begravningstyp === 'jordbegravning' && t('Jordbegravning', 'Burial')}
                  {data.begravningstyp === 'islamisk' && t('Islamisk begravning', 'Islamic funeral')}
                  {data.begravningstyp === 'annan' && t('Annan', 'Other')}
                  {data.ceremoniTyp && ` — ${
                    data.ceremoniTyp === 'svenska_kyrkan' ? t('Religiös (Svenska kyrkan)', 'Religious (Church of Sweden)') :
                    data.ceremoniTyp === 'annan_trossamfund' ? t('Religiös (annan trossamfund)', 'Religious (other faith community)') :
                    data.ceremoniTyp === 'borgerlig' ? t('Borgerlig ceremoni', 'Civil ceremony') :
                    data.ceremoniTyp === 'islamisk_utan_kyrka' ? t('Islamisk (utan ceremoni i kyrka)', 'Islamic (without church ceremony)') :
                    ''
                  }`}
                </p>
              </div>

              {data.begravningsbyra && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase mb-1">{t('Begravningsbyrå', 'Funeral home')}</p>
                    <p className="text-sm text-primary">{data.begravningsbyra}</p>
                    {data.offert && <p className="text-xs text-muted">{data.offert} {t('kr', 'SEK')}</p>}
                  </div>
                </>
              )}

              {data.begravningsDatum && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase mb-1">{t('Ceremoni', 'Ceremony')}</p>
                    <p className="text-sm text-primary">{data.begravningsDatum} {t('på', 'at')} {data.plats || t('TBD', 'TBD')}</p>
                    {data.officiant && <p className="text-xs text-muted">{data.officiant}</p>}
                  </div>
                </>
              )}

              {data.dodsannonsText && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase mb-1">{t('Dödsannons', 'Death notice')}</p>
                    <p className="text-xs text-muted">{data.dodsannonsText.slice(0, 60)}...</p>
                  </div>
                </>
              )}

              {data.minnesStund && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase mb-1">{t('Minnesstund', 'Memorial gathering')}</p>
                    <p className="text-sm text-primary">{data.minnesStundPlats}</p>
                    {data.minnesStundGaster && <p className="text-xs text-muted">{data.minnesStundGaster}</p>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="card mb-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">{t('Checklista', 'Checklist')}</p>
            <div className="space-y-3">
              {[
                { key: 'dodsbevisBegruning', label: t('Dödsbevis till begravningsbyrå', 'Death certificate to funeral home') },
                { key: 'kladerAvliden', label: t('Kläder till den avlidne', 'Clothes for the deceased') },
                { key: 'blommor2', label: t('Blommor beställda', 'Flowers ordered') },
                { key: 'minnesstund2', label: t('Minnesstund planerad', 'Memorial gathering planned') },
                { key: 'dodsannons2', label: t('Dödsannons publicerad', 'Death notice published') },
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
              {t('Spara plan', 'Save plan')}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-xl text-sm font-semibold bg-green-100 text-green-700 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> {t('Plan sparad!', 'Plan saved!')}
            </button>
          )}

          <p className="text-xs text-center text-muted mt-4 px-2">
            {t('Din begravningsplan sparas lokalt på din enhet.', 'Your funeral plan is saved locally on your device.')}
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={prev} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-[#E8E4DE] text-primary hover:bg-background transition-colors flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button onClick={next} className="flex-1 btn-primary flex items-center justify-center gap-1">
            {t('Nästa', 'Next')} <ChevronRight className="w-4 h-4" />
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
