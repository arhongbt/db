'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, Bot, Newspaper, Copy, CheckCircle2, Info } from 'lucide-react';
import { DodsboProvider, useDodsbo } from '@/lib/context';

function MikeRossTip({ text }: { text: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: '#E8F0E8' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">{t('Mike Ross', 'Mike Ross')}</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

type Template = 'klassisk' | 'enkel' | 'personlig';

interface AnnouncementData {
  namn: string;
  fdd: string;
  avliden: string;
  ort: string;
  template: Template;
  symbol: string;
  sorjande: string;
  begravning: string;
  blommorValgörenhet: boolean;
  valgörenhet: string;
}

const createSteps = (t: (sv: string, en: string) => string) => [
  { title: t('Uppgifter om den avlidne', 'Information about deceased'), id: 'info' },
  { title: t('Välj mall', 'Choose template'), id: 'template' },
  { title: t('Anpassa text', 'Customize text'), id: 'customize' },
  { title: t('Granska & kopiera', 'Review & copy'), id: 'review' },
];

const createTemplates = (t: (sv: string, en: string) => string) => ({
  klassisk: {
    label: t('Klassisk', 'Classic'),
    preview: '✝ [Namn]\n[Född]–[Avliden]\nhar stilla lämnat oss.\n[Sörjande]',
    description: t('Traditionell dödsannons med kors', 'Traditional obituary with cross'),
  },
  enkel: {
    label: t('Enkel', 'Simple'),
    preview: '[Namn]\n[Ort]\nhar somnat in.\n[Sörjande]',
    description: t('Enkel och direkt', 'Simple and direct'),
  },
  personlig: {
    label: t('Personlig', 'Personal'),
    preview: '[Namn]\n[Ort]\n[Fri text]\n[Sörjande]',
    description: t('Helt fritt utformad', 'Completely free format'),
  },
});

function Content() {
  const { state } = useDodsbo();
  const { t } = useLanguage();
  const STEPS = createSteps(t);
  const TEMPLATES = createTemplates(t);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AnnouncementData>({
    namn: state.deceasedName || '',
    fdd: '',
    avliden: state.deathDate || '',
    ort: '',
    template: 'klassisk',
    symbol: '✝',
    sorjande: '',
    begravning: '',
    blommorValgörenhet: false,
    valgörenhet: '',
  });
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof AnnouncementData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generateAnnouncementText = (): string => {
    const { namn, fdd, avliden, ort, template, symbol, sorjande, begravning, blommorValgörenhet, valgörenhet } = data;

    let text = '';

    if (template === 'klassisk') {
      text = `${symbol} ${namn}\n${fdd}–${avliden}\nhar stilla lämnat oss.\n\n${sorjande}`;
    } else if (template === 'enkel') {
      text = `${namn}\n${ort}\nhar somnat in.\n\n${sorjande}`;
    } else if (template === 'personlig') {
      text = `${namn}\n${ort}\n${data.sorjande}`;
    }

    if (begravning) {
      text += `\n\n${begravning}`;
    }

    if (blommorValgörenhet && valgörenhet) {
      text += `\n\nBlommor hänvisas till ${valgörenhet}.`;
    }

    return text;
  };

  const handleCopyText = async () => {
    const text = generateAnnouncementText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    const { downloadDocumentPDF } = await import('@/lib/generate-document-pdf');
    downloadDocumentPDF('Dödsannons', generateAnnouncementText(), `dodsannons-${data.namn || 'dokument'}`);
  };

  const canProceed = (): boolean => {
    if (step === 0) return !!(data.namn && data.fdd && data.avliden && data.ort);
    if (step === 1) return !!data.template;
    if (step === 2) return !!data.sorjande && (!data.blommorValgörenhet || !!data.valgörenhet);
    return true;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-background border-b" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Link>
            <Newspaper className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-display text-primary">{t('Dödsannons', 'Obituary')}</h1>
          </div>
          {/* Progress indicator */}
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => i <= step && setStep(i)}
                className={`text-xs font-medium px-3 py-1 rounded-full transition ${
                  i === step
                    ? 'text-white'
                    : i < step
                    ? 'bg-accent/20 text-accent'
                    : 'bg-gray-100 text-gray-500'
                }`}
                style={i === step ? { background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' } : {}}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step 0: Uppgifter om den avlidne */}
        {step === 0 && (
          <div className="card space-y-4">
            <h2 className="text-xl font-display text-primary">{t('Uppgifter om den avlidne', 'Information about deceased')}</h2>
            <MikeRossTip text={t('En dödsannons publiceras i tidningen för att informera om dödsfallet. Det finns inga krav på att publicera en, men det är vanligt och uppskattas av vänner och bekanta som kanske inte fått reda på det direkt.', 'An obituary is published in the newspaper to announce the death. There is no requirement to publish one, but it is common and appreciated by friends and acquaintances who may not have heard the news directly.')} />

            <div>
              <label className="block text-sm font-medium text-primary mb-2">{t('Namn', 'Name')} *</label>
              <input
                type="text"
                value={data.namn}
                onChange={e => handleInputChange('namn', e.target.value)}
                placeholder={t('Förnamn och efternamn', 'First and last name')}
                className="w-full px-4 py-3 border border-gray-200 rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">{t('Född', 'Born')} *</label>
              <input
                type="text"
                value={data.fdd}
                onChange={e => handleInputChange('fdd', e.target.value)}
                placeholder={t('t.ex. 15 januari 1940', 'e.g. January 15, 1940')}
                className="w-full px-4 py-3 border border-gray-200 rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">{t('Avliden', 'Died')} *</label>
              <input
                type="text"
                value={data.avliden}
                onChange={e => handleInputChange('avliden', e.target.value)}
                placeholder={t('t.ex. 8 april 2024', 'e.g. April 8, 2024')}
                className="w-full px-4 py-3 border border-gray-200 rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">{t('Ort', 'City')} *</label>
              <input
                type="text"
                value={data.ort}
                onChange={e => handleInputChange('ort', e.target.value)}
                placeholder={t('Där de bodde', 'Where they lived')}
                className="w-full px-4 py-3 border border-gray-200 rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>
          </div>
        )}

        {/* Step 1: Välj mall */}
        {step === 1 && (
          <div className="card space-y-4">
            <h2 className="text-xl font-display text-primary">{t('Välj mall', 'Choose template')}</h2>
            <MikeRossTip text={t('Den klassiska mallen passar de flesta. Om du väljer \'Personlig\' kan du skriva helt fritt. Kors (✝) är valfritt — det är vanligt men inte obligatoriskt.', 'The classic template works for most people. If you choose \'Personal\' you can write freely. Cross (✝) is optional — it\'s common but not required.')} />

            <div className="grid gap-3">
              {(Object.entries(TEMPLATES) as [Template, any][]).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => handleInputChange('template', key)}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    data.template === key
                      ? 'bg-accent/5'
                      : 'border-gray-200 bg-white hover:border-accent/50'
                  }`}
                  style={data.template === key ? { borderColor: '#7A9E7E', background: 'rgba(122,158,126,0.05)' } : {}}
                >
                  <h3 className="font-display text-primary mb-2">{template.label}</h3>
                  <p className="text-sm text-muted-light mb-2">{template.description}</p>
                  <p className="text-sm text-primary/70 whitespace-pre-line font-serif italic">{template.preview}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Anpassa text */}
        {step === 2 && (
          <div className="card space-y-4">
            <h2 className="text-xl font-display text-primary">{t('Anpassa text', 'Customize text')}</h2>
            <MikeRossTip text={t('Sörjande listas vanligtvis i ordningen: make/maka, barn, barnbarn. Du behöver inte använda efternamn. Det är vanligt att skriva \'Begravningen har ägt rum\' eller ange datum och plats.', 'Mourners are usually listed in order: spouse, children, grandchildren. You don\'t need to use surnames. It\'s common to write \'The funeral has taken place\' or specify date and location.')} />

            {data.template === 'klassisk' && (
              <div>
                <label className="block text-sm font-medium text-primary mb-3">{t('Symbol', 'Symbol')}</label>
                <div className="flex gap-4">
                  {['✝', '☆', '⚘'].map(sym => (
                    <label key={sym} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={data.symbol === sym}
                        onChange={() => handleInputChange('symbol', sym)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-lg">{sym}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                {t('Sörjande', 'Mourners')} *
              </label>
              <textarea
                value={data.sorjande}
                onChange={e => handleInputChange('sorjande', e.target.value)}
                placeholder={t('Make/Maka, barn, barnbarn&#10;t.ex. Anna&#10;Erik och Eva med familjer&#10;Barnbarnen', 'Spouse, children, grandchildren&#10;e.g. Anna&#10;Erik and Eva with families&#10;The grandchildren')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">{t('Begravningsinformation (valfritt)', 'Funeral information (optional)')}</label>
              <input
                type="text"
                value={data.begravning}
                onChange={e => handleInputChange('begravning', e.target.value)}
                placeholder={t('t.ex. Begravningen äger rum den 15 maj i Hedvig Eleonora kyrka', 'e.g. The funeral takes place on May 15 at Hedvig Eleonora Church')}
                className="w-full px-4 py-3 border border-gray-200 rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.blommorValgörenhet}
                  onChange={e => handleInputChange('blommorValgörenhet', e.target.checked)}
                  className="w-4 h-4 accent-accent rounded"
                />
                <span className="text-sm font-medium text-primary">{t('Hänvisa blommor till välgörenhet', 'Direct flowers to charity')}</span>
              </label>
              {data.blommorValgörenhet && (
                <input
                  type="text"
                  value={data.valgörenhet}
                  onChange={e => handleInputChange('valgörenhet', e.target.value)}
                  placeholder={t('t.ex. Röda Korset eller Cancerfonden', 'e.g. Red Cross or Cancer Foundation')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 3: Granska & kopiera */}
        {step === 3 && (
          <div className="card space-y-4">
            <h2 className="text-xl font-display text-primary">{t('Granska & kopiera', 'Review & copy')}</h2>
            <MikeRossTip text={t('En dödsannons i DN eller SvD kostar ca 3 000–8 000 kr beroende på storlek. Lokaltidningar är ofta billigare. Ring tidningens annonsavdelning — de hjälper dig med allt.', 'An obituary in DN or SvD costs approximately 3,000–8,000 SEK depending on size. Local newspapers are often cheaper. Call the newspaper\'s advertisement department — they help with everything.')} />

            {/* Preview */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 my-6">
              <p className="text-center whitespace-pre-line font-serif text-primary/80 leading-relaxed text-lg">
                {generateAnnouncementText()}
              </p>
            </div>

            {/* Info box */}
            <div className="flex gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">{t('Skicka texten till tidningens annonsavdelning. De hjälper dig med layout och typsnitt.', 'Send the text to the newspaper\'s advertisement department. They help with layout and typography.')}</p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleCopyText}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-medium hover:opacity-90 transition"
                style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {t('Kopierad!', 'Copied!')}
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    {t('Kopiera text', 'Copy text')}
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="w-full px-4 py-3 bg-gray-100 text-primary rounded-xl font-medium hover:bg-gray-200 transition"
              >
                {t('Ladda ner som PDF', 'Download as PDF')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-2xl mx-auto px-4 flex gap-3 mt-6 mb-4">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 px-4 rounded-2xl border-2 font-medium text-primary text-sm transition-colors"
            style={{ borderColor: '#E8E4DE' }}
          >
            ← {t('Tillbaka', 'Back')}
          </button>
        )}
        <button
          onClick={() => {
            if (step < 3) setStep(step + 1);
          }}
          disabled={step === 3}
          className="flex-1 btn-primary !rounded-2xl !py-3 !text-sm"
        >
          {step < 3 ? t('Nästa →', 'Next →') : t('✓ Klar', '✓ Done')}
        </button>
      </div>

    </div>
  );
}

export default function DodsannonsPage() {
  return (
    <DodsboProvider>
      <Content />
    </DodsboProvider>
  );
}
