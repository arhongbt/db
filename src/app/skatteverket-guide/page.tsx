'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import { ArrowLeft, CheckCircle2, Circle, Bot, FileCheck, AlertCircle, Info, Copy } from 'lucide-react';
import Link from 'next/link';

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

function ChecklistItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center gap-3 p-4 border border-[#E8E4DE] rounded-xl hover:bg-background transition-colors text-left"
    >
      {checked ? (
        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
      ) : (
        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
      )}
      <span className={checked ? 'line-through text-gray-400' : 'text-primary'}>{label}</span>
    </button>
  );
}

function ProgressCounter({ completed, total }: { completed: number; total: number }) {
  return (
    <div className="text-sm text-muted mb-6">
      {completed} av {total} klara
    </div>
  );
}

function Step0Overview() {
  const { state } = useDodsbo();
  const deathDate = state.deathDate ? new Date(state.deathDate) : null;

  let daysRemaining = null;
  let förrättningDeadline = null;
  let inlämningDeadline = null;
  let isApproaching = false;
  let isPassed = false;

  if (deathDate) {
    förrättningDeadline = new Date(deathDate);
    förrättningDeadline.setMonth(förrättningDeadline.getMonth() + 3);

    inlämningDeadline = new Date(förrättningDeadline);
    inlämningDeadline.setMonth(inlämningDeadline.getMonth() + 1);

    const now = new Date();
    const timeDiff = inlämningDeadline.getTime() - now.getTime();
    daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    isApproaching = daysRemaining > 0 && daysRemaining < 30;
    isPassed = daysRemaining < 0;
  }

  return (
    <div>
      <ProgressCounter completed={0} total={6} />

      <h2 className="text-2xl font-bold text-primary mb-4">Vad är bouppteckning?</h2>

      <p className="text-primary/80 mb-6">
        Bouppteckningen är en officiell förteckning över den avlidnes alla tillgångar och skulder. Den upprättas av två oberoende förrättningsmän och måste skickas till Skatteverket för registrering.
      </p>

      <div className="mb-8 p-6 bg-background rounded-2xl border border-[#E8E4DE]">
        <h3 className="font-semibold text-primary mb-4">Tidsplan för processen</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">1</div>
            <div>
              <p className="font-semibold text-primary">Dödsdatum</p>
              <p className="text-sm text-primary/60">{deathDate?.toLocaleDateString('sv-SE')}</p>
            </div>
          </div>
          <div className="h-4 border-l-2 border-gray-300 ml-3"></div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">2</div>
            <div>
              <p className="font-semibold text-primary">Förrättning</p>
              <p className="text-sm text-primary/60">Inom 3 månader</p>
              {förrättningDeadline && (
                <p className="text-xs text-accent mt-1">
                  Senast: {förrättningDeadline.toLocaleDateString('sv-SE')}
                </p>
              )}
            </div>
          </div>
          <div className="h-4 border-l-2 border-gray-300 ml-3"></div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">3</div>
            <div>
              <p className="font-semibold text-primary">Inlämning till Skatteverket</p>
              <p className="text-sm text-primary/60">1 månad efter förrättning</p>
              {inlämningDeadline && (
                <p className="text-xs text-accent mt-1">
                  Senast: {inlämningDeadline.toLocaleDateString('sv-SE')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {daysRemaining !== null && (
        <div className={`mb-6 p-4 rounded-2xl flex gap-3 ${isPassed ? 'bg-red-50 border border-red-200' : isApproaching ? 'bg-yellow-50 border border-yellow-200' : ''}`}>
          {isPassed ? (
            <>
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Deadline har passerat</p>
                <p className="text-sm text-red-800">Du kan ansöka om förlängning hos Skatteverket.</p>
              </div>
            </>
          ) : isApproaching ? (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">{daysRemaining} dagar kvar</p>
                <p className="text-sm text-yellow-800">Inlämningen måste vara hos Skatteverket innan deadline.</p>
              </div>
            </>
          ) : null}
        </div>
      )}

      <MikeRossTip text="Bouppteckningen är en lista över den avlidnes alla tillgångar och skulder. Den måste förrättas inom 3 månader från dödsfallet och skickas till Skatteverket senast 1 månad efter förrättningen." />
    </div>
  );
}

function Step1Preparation() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false, false, false]);

  const items = [
    'Utse förrättningsman (2 st krävs — de får inte vara dödsbodelägare)',
    'Kalla alla dödsbodelägare till förrättningen',
    'Samla in kontoutdrag per dödsdagen',
    'Samla in taxeringsvärden / värderingar',
    'Kontrollera om det finns testamente',
    'Samla försäkringsbrev',
  ];

  const completedCount = checked.filter(Boolean).length;

  return (
    <div>
      <ProgressCounter completed={completedCount} total={6} />

      <h2 className="text-2xl font-bold text-primary mb-4">Förbered förrättningen</h2>

      <p className="text-primary/80 mb-6">
        Innan förrättningen kan genomföras behöver du samla in dokument och utse förrättningsmän. Använd checklistan nedan för att hålla ordning.
      </p>

      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <ChecklistItem
            key={idx}
            label={item}
            checked={checked[idx]}
            onChange={() => {
              const newChecked = [...checked];
              newChecked[idx] = !newChecked[idx];
              setChecked(newChecked);
            }}
          />
        ))}
      </div>

      <MikeRossTip text="Förrättningsmännen ansvarar för att bouppteckningen är korrekt. De behöver inte vara jurister — det räcker med att de är opartiska och förstår uppgiften. Dödsbodelägare och efterarvingar får INTE vara förrättningsmän." />
    </div>
  );
}

function Step2Execute() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false, false]);

  const items = [
    'Alla tillgångar redovisade',
    'Alla skulder redovisade',
    'Bouppgivare utsedd och har intygat',
    'Förrättningsmän har granskat och skrivit under',
    'Alla dödsbodelägare kallade',
  ];

  const completedCount = checked.filter(Boolean).length;

  return (
    <div>
      <ProgressCounter completed={completedCount} total={6} />

      <h2 className="text-2xl font-bold text-primary mb-4">Genomför förrättningen</h2>

      <p className="text-primary/80 mb-6">
        Vid förrättningen granskas alla tillgångar och skulder. Använd checklistan för att se till att allt är på plats.
      </p>

      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900">
            Alla dödsbodelägare måste kallas till förrättningen, men alla behöver inte närvara fysiskt. Det går att närvara digitalt eller genom fullmakt.
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <ChecklistItem
            key={idx}
            label={item}
            checked={checked[idx]}
            onChange={() => {
              const newChecked = [...checked];
              newChecked[idx] = !newChecked[idx];
              setChecked(newChecked);
            }}
          />
        ))}
      </div>

      <MikeRossTip text="Vid förrättningen går man igenom alla tillgångar och skulder. Bouppgivaren (oftast den som bäst känner till ekonomin) intygar att uppgifterna stämmer. Alla dödsbodelägare ska kallas men alla behöver inte vara närvarande." />
    </div>
  );
}

function Step3Submit() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false, false]);

  const items = [
    'Bouppteckning original + 1 bestyrkt kopia',
    'Testamente (kopia, om det finns)',
    'Kallelsebevis',
    'Eventuella fullmakter',
    'Arvsavståenden (om tillämpligt)',
  ];

  const completedCount = checked.filter(Boolean).length;

  return (
    <div>
      <ProgressCounter completed={completedCount} total={6} />

      <h2 className="text-2xl font-bold text-primary mb-4">Skicka in till Skatteverket</h2>

      <p className="text-primary/80 mb-6">
        Bouppteckningen kan skickas in antingen digitalt eller per post. Kontrollera att alla dokument är med innan du skickar.
      </p>

      <div className="mb-8 p-6 bg-background rounded-2xl border border-[#E8E4DE]">
        <h3 className="font-semibold text-primary mb-3">Postadress (om du skickar per post)</h3>
        <div className="text-sm text-primary/80 space-y-1">
          <p>Skatteverket</p>
          <p>Bouppteckningssektionen</p>
          <p>831 81 Östersund</p>
        </div>
        <p className="text-xs text-primary/60 mt-4">Du kan också skicka in digitalt via skatteverket.se</p>
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <ChecklistItem
            key={idx}
            label={item}
            checked={checked[idx]}
            onChange={() => {
              const newChecked = [...checked];
              newChecked[idx] = !newChecked[idx];
              setChecked(newChecked);
            }}
          />
        ))}
      </div>

      <MikeRossTip text="Skicka originalet + en bestyrkt kopia. Skatteverket registrerar bouppteckningen och skickar tillbaka originalet — det tar normalt 4–8 veckor. Du kan följa ärendet på skatteverket.se." />
    </div>
  );
}

function ExtensionRequest() {
  const [copied, setCopied] = useState(false);

  const templateText = `Till Skatteverket
Bouppteckningssektionen
831 81 Östersund

Ang. ansökan om förlängd tid för bouppteckning

Dödsboet efter [NAMN], personnummer [PNR], avliden [DATUM].

Undertecknad ansöker härmed om förlängd tid för att förrätta bouppteckning.

Anledning till förseningen:
[FYLL I — t.ex. "Svårigheter att samla in uppgifter om den avlidnes tillgångar" eller "Behov av fastighetsvärdering" eller "Dödsbodelägare bosatt utomlands"]

Bouppteckningen beräknas kunna förrättas senast: [DATUM]

Med vänliga hälsningar,

_____________________________________
[DITT NAMN]
Telefon: [TELEFONNUMMER]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(templateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8">
      <h3 className="font-semibold text-primary mb-4">Ansök om förlängning</h3>

      <div className="mb-4">
        <textarea
          readOnly
          value={templateText}
          className="w-full p-4 border border-gray-300 rounded-xl font-mono text-xs bg-background text-primary/80 resize-none"
          rows={18}
        />
      </div>

      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors mb-4"
      >
        <Copy className="w-4 h-4" />
        {copied ? 'Kopierad!' : 'Kopiera mall'}
      </button>

      <MikeRossTip text="Skatteverket beviljar nästan alltid förlängning om du ansöker i tid. Skicka ansökan INNAN fristen går ut om möjligt. Ange en konkret anledning och ett realistiskt nytt datum." />
    </div>
  );
}

function Step4After() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false]);

  const items = [
    'Fått tillbaka registrerad bouppteckning',
    'Visat registrerad bouppteckning för banker',
    'Påbörjat arvskifte',
    'Deklarerat dödsboet (om tillämpligt)',
  ];

  const completedCount = checked.filter(Boolean).length;

  return (
    <div>
      <ProgressCounter completed={completedCount} total={6} />

      <h2 className="text-2xl font-bold text-primary mb-4">Efter registrering</h2>

      <p className="text-primary/80 mb-6">
        När Skatteverket har registrerat bouppteckningen kan ni påbörja arvskiftet och andra administrativa åtgärder.
      </p>

      <div className="mb-8">
        <p className="text-sm text-primary/80 font-semibold mb-4">Kan du inte hinna med deadline?</p>
        <ExtensionRequest />
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <ChecklistItem
            key={idx}
            label={item}
            checked={checked[idx]}
            onChange={() => {
              const newChecked = [...checked];
              newChecked[idx] = !newChecked[idx];
              setChecked(newChecked);
            }}
          />
        ))}
      </div>

      <MikeRossTip text="När bouppteckningen är registrerad kan ni börja med arvskiftet. Bankerna kräver den registrerade bouppteckningen innan de släpper pengarna. Spara originalet — det är ett viktigt dokument." />
    </div>
  );
}

function Content() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Översikt', component: <Step0Overview /> },
    { title: 'Förbered', component: <Step1Preparation /> },
    { title: 'Genomför', component: <Step2Execute /> },
    { title: 'Skicka in', component: <Step3Submit /> },
    { title: 'Efter', component: <Step4After /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-32">
        <Link href="/dashboard" className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Tillbaka</span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Bouppteckningsguide</h1>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                currentStep === idx
                  ? 'bg-accent text-white'
                  : 'bg-white text-primary hover:bg-white'
              }`}
            >
              {idx + 1}. {step.title}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8E4DE] mb-8">
          {steps[currentStep].component}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1 px-4 py-3 border border-[#E8E4DE] rounded-xl font-semibold text-primary hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Föregående
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex-1 px-4 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Nästa
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function SkatteverketGuidePage() {
  return (
    <DodsboProvider>
      <Content />
    </DodsboProvider>
  );
}
