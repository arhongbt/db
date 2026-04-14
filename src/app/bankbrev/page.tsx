'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { SWEDISH_BANKS } from '@/types';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Bot,
  Landmark,
  Download,
  CheckCircle2,
  Info,
} from 'lucide-react';

function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: '#E8F0E8' }}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}
      >
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function BankbrevContent() {
  const { t } = useLanguage();
  const { state } = useDodsbo();
  const [currentStep, setCurrentStep] = useState(0);
  const [customBanks, setCustomBanks] = useState<string[]>([]);
  const [customBankInput, setCustomBankInput] = useState('');

  const [data, setData] = useState({
    avlidenNamn: state.deceasedName || '',
    avlidenPersonnummer: state.deceasedPersonnummer || '',
    dödsdatum: state.deathDate || '',
    anmälarNamn: '',
    anmälarPersonnummer: '',
    relation: '',
    telefon: '',
    adress: '',
    valdebanker: (state.onboarding?.banks || []).slice(),
  });

  const handleAddCustomBank = () => {
    if (customBankInput.trim()) {
      setCustomBanks([...customBanks, customBankInput.trim()]);
      setCustomBankInput('');
    }
  };

  const toggleBank = (bankId: string) => {
    setData((prev) => ({
      ...prev,
      valdebanker: prev.valdebanker.includes(bankId)
        ? prev.valdebanker.filter((id) => id !== bankId)
        : [...prev.valdebanker, bankId],
    }));
  };

  const generateLetterForBank = (bankName: string, bankPhone?: string): string => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('sv-SE');

    return `${bankName}
${dateStr}

Ang. dödsfall — ${data.avlidenNamn}, ${data.avlidenPersonnummer}

Till ${bankName},

Jag skriver för att meddela att ${data.avlidenNamn}, personnummer ${data.avlidenPersonnummer}, avled den ${data.dödsdatum}.

Jag är ${data.relation} till den avlidne och dödsbodelägare. Jag ber er vänligen att:

1. Spärra den avlidnes konton för att förhindra obehöriga uttag
2. Skicka en förteckning över den avlidnes samtliga konton, saldon och eventuella skulder per dödsdagen till nedanstående adress
3. Meddela om det finns några autogiro eller stående överföringar kopplade till kontona

Bifogat finner ni dödsbevis.

Vänligen kontakta mig vid frågor.

Med vänliga hälsningar,

_____________________________________
${data.anmälarNamn}
Personnummer: ${data.anmälarPersonnummer}
Telefon: ${data.telefon}
Adress: ${data.adress}`;
  };

  const generateAllLetters = (): { bankName: string; content: string }[] => {
    const letters: { bankName: string; content: string }[] = [];

    // Add letters for selected Swedish banks
    data.valdebanker.forEach((bankId) => {
      const bank = SWEDISH_BANKS.find((b) => b.id === bankId);
      if (bank) {
        letters.push({
          bankName: bank.name,
          content: generateLetterForBank(bank.name, bank.phone),
        });
      }
    });

    // Add letters for custom banks
    customBanks.forEach((customBankName) => {
      letters.push({
        bankName: customBankName,
        content: generateLetterForBank(customBankName),
      });
    });

    return letters;
  };

  const handleDownloadPDF = async () => {
    const { downloadDocumentPDF } = await import('@/lib/generate-document-pdf');
    const letters = generateAllLetters();
    const content = letters.map((l) => l.content).join('\n\n---\n\n');
    downloadDocumentPDF(
      'Bankbrev',
      content,
      `bankbrev-${data.avlidenNamn || 'dokument'}`
    );
  };

  const handleDownloadDocx = async () => {
    const { downloadDocumentDocx } = await import('@/lib/generate-document-docx');
    const letters = generateAllLetters();
    const content = letters.map((l) => l.content).join('\n\n---\n\n');
    downloadDocumentDocx(
      'Bankbrev',
      content,
      `bankbrev-${data.avlidenNamn || 'dokument'}`
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          data.avlidenNamn.trim() &&
          data.avlidenPersonnummer.trim() &&
          data.dödsdatum.trim()
        );
      case 1:
        return (
          data.anmälarNamn.trim() &&
          data.anmälarPersonnummer.trim() &&
          data.relation.trim() &&
          data.telefon.trim() &&
          data.adress.trim()
        );
      case 2:
        return (
          data.valdebanker.length > 0 || customBanks.length > 0
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => (currentStep > 0 ? setCurrentStep(currentStep - 1) : window.history.back())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold text-primary">{t('Bankbrev', 'Bank Letter')}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Step 0: Uppgifter om den avlidne */}
        {currentStep === 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">{t('Uppgifter om den avlidne', 'Information about the deceased')}</h2>
              <p className="text-sm text-muted">{t('Steg 1 av 4', 'Step 1 of 4')}</p>
            </div>

            <MikeRossTip text={t('Banken behöver namn, personnummer och dödsdatum för att kunna identifiera den avlidnes konton. Ha dödsbeviset redo — banken kräver det som bilaga.', 'The bank needs name, personal number, and date of death to identify the deceased\'s accounts. Have the death certificate ready — the bank requires it as an attachment.')} />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">{t('Namn', 'Name')}</label>
                <input
                  type="text"
                  value={data.avlidenNamn}
                  onChange={(e) => setData({ ...data, avlidenNamn: e.target.value })}
                  placeholder={t('Förnamn Efternamn', 'First name Last name')}
                  className="w-full px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  {t('Personnummer', 'Personal number')}
                </label>
                <input
                  type="text"
                  value={data.avlidenPersonnummer}
                  onChange={(e) => setData({ ...data, avlidenPersonnummer: e.target.value })}
                  placeholder="YYMMDDNNNN"
                  className="w-full px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">{t('Dödsdatum', 'Date of death')}</label>
                <input
                  type="date"
                  value={data.dödsdatum}
                  onChange={(e) => setData({ ...data, dödsdatum: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Dina uppgifter */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">Dina uppgifter (anmälare)</h2>
              <p className="text-sm text-muted">Steg 2 av 4</p>
            </div>

            <MikeRossTip text="Du som anmäler måste vara dödsbodelägare eller ha en fullmakt. Banken kommer att kontakta dig för att gå igenom kontona." />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Ditt namn</label>
                <input
                  type="text"
                  value={data.anmälarNamn}
                  onChange={(e) => setData({ ...data, anmälarNamn: e.target.value })}
                  placeholder="Förnamn Efternamn"
                  className="w-full px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Personnummer
                </label>
                <input
                  type="text"
                  value={data.anmälarPersonnummer}
                  onChange={(e) => setData({ ...data, anmälarPersonnummer: e.target.value })}
                  placeholder="YYMMDDNNNN"
                  className="w-full px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Relation till den avlidne
                </label>
                <input
                  type="text"
                  value={data.relation}
                  onChange={(e) => setData({ ...data, relation: e.target.value })}
                  placeholder="t.ex. Son/dotter, Make/Maka"
                  className="w-full px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  value={data.telefon}
                  onChange={(e) => setData({ ...data, telefon: e.target.value })}
                  placeholder="070-1234567"
                  className="w-full px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Adress</label>
                <input
                  type="text"
                  value={data.adress}
                  onChange={(e) => setData({ ...data, adress: e.target.value })}
                  placeholder="Gatunamn och husnummer, Postnummer, Stad"
                  className="w-full px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Välj banker */}
        {currentStep === 2 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">Välj banker</h2>
              <p className="text-sm text-muted">Steg 3 av 4</p>
            </div>

            <MikeRossTip text="Markera alla banker som den avlidne kan ha haft konton i. Det är bättre att kontakta en bank för mycket — de meddelar dig om det inte finns några konton." />

            <div className="space-y-3 mb-6">
              {SWEDISH_BANKS.map((bank) => (
                <label
                  key={bank.id}
                  className="flex items-center gap-3 p-3 border rounded-2xl hover:bg-background cursor-pointer transition-colors bg-white" style={{ borderColor: '#E8E4DE' }}
                >
                  <input
                    type="checkbox"
                    checked={data.valdebanker.includes(bank.id)}
                    onChange={() => toggleBank(bank.id)}
                    className="w-5 h-5 rounded accent-accent cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-primary text-sm">{bank.name}</p>
                    {bank.phone && <p className="text-xs text-muted">{bank.phone}</p>}
                  </div>
                </label>
              ))}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-primary mb-3 text-sm">Lägg till egen bank</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={customBankInput}
                  onChange={(e) => setCustomBankInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddCustomBank();
                  }}
                  placeholder="Bankens namn"
                  className="flex-1 px-4 py-3 border rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white" style={{ borderColor: '#E8E4DE' }}
                />
                <button
                  onClick={handleAddCustomBank}
                  className="px-4 py-3 bg-accent text-white rounded-xl font-semibold transition-colors hover:bg-accent/90"
                >
                  Lägg till
                </button>
              </div>

              {customBanks.length > 0 && (
                <div className="space-y-2">
                  {customBanks.map((customBank, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-2xl bg-white" style={{ borderColor: '#E8E4DE' }}
                    >
                      <p className="text-sm text-primary font-semibold">{customBank}</p>
                      <button
                        onClick={() => setCustomBanks(customBanks.filter((_, i) => i !== idx))}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold"
                      >
                        Ta bort
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Granska & ladda ner */}
        {currentStep === 3 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">Granska & ladda ner</h2>
              <p className="text-sm text-muted">Steg 4 av 4</p>
            </div>

            <MikeRossTip text="Skriv ut brevet, bifoga dödsbevis (kopia räcker) och skicka med post eller lämna in på bankkontoret. De flesta banker behandlar ärendet inom 1–2 veckor." />

            {/* Preview of letters */}
            <div className="space-y-6 mb-8">
              {generateAllLetters().map((letter, idx) => (
                <div
                  key={idx}
                  className="border rounded-2xl p-4 bg-white" style={{ borderColor: '#E8E4DE' }}
                >
                  <h3 className="font-bold text-primary mb-3 text-sm">{letter.bankName}</h3>
                  <pre className="text-xs text-primary/70 whitespace-pre-wrap font-mono overflow-auto max-h-64 p-3 bg-background rounded-xl">
                    {letter.content}
                  </pre>
                </div>
              ))}
            </div>

            {/* Download buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-xl font-semibold transition-colors hover:bg-accent/90"
              >
                <Download className="w-5 h-5" />
                Ladda ner alla som PDF
              </button>
              <button
                onClick={handleDownloadDocx}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold transition-colors hover:bg-blue-700"
              >
                <Download className="w-5 h-5" />
                Ladda ner alla som Word
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6 mb-4">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 py-3 px-4 rounded-2xl border-2 font-medium text-primary text-sm transition-colors"
              style={{ borderColor: '#E8E4DE' }}
            >
              ← Tillbaka
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex-1 btn-primary !rounded-2xl !py-3 !text-sm"
            >
              Nästa →
            </button>
          ) : (
            <button
              onClick={() => alert('Breven är klara att skrivas ut!')}
              disabled={false}
              className="flex-1 btn-primary !rounded-2xl !py-3 !text-sm"
            >
              ✓ Skapa bankbrev
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

export default function BankbrevPage() {
  return (
    <DodsboProvider>
      <BankbrevContent />
    </DodsboProvider>
  );
}
