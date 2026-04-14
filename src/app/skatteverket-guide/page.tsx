'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { ArrowLeft, CheckCircle2, Circle, Bot, FileCheck, AlertCircle, Info, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-4 p-5 mb-6" style={{
      background: 'linear-gradient(135deg, rgba(122,158,126,0.06), rgba(122,158,126,0.02))',
      borderRadius: '24px',
      border: '1.5px solid rgba(122,158,126,0.10)',
    }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>Mike Ross</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
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
      className="w-full flex items-center gap-4 p-4 transition-all duration-300 active:scale-[0.98] text-left"
      style={{
        borderRadius: '20px',
        border: checked ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
        background: checked ? 'linear-gradient(135deg, rgba(122,158,126,0.04), transparent)' : 'var(--bg-card)',
      }}
    >
      {checked ? (
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ border: '2px solid var(--border)' }} />
      )}
      <span className={`text-sm ${checked ? 'line-through' : ''}`} style={{ color: checked ? 'var(--text-secondary)' : 'var(--text)' }}>
        {useLanguage().t(label, label)}
      </span>
    </button>
  );
}

function ProgressCounter({ completed, total }: { completed: number; total: number }) {
  const { t } = useLanguage();
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {completed} {t('av', 'of')} {total} {t('klara', 'done')}
        </span>
        <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }} />
      </div>
    </div>
  );
}

function Step0Overview() {
  const { t } = useLanguage();
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

      <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>
        {t('Vad är bouppteckning?', 'What is an estate inventory?')}
      </h2>

      <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
        {t('Bouppteckningen är en officiell förteckning över den avlidnes alla tillgångar och skulder. Den upprättas av två oberoende förrättningsmän och måste skickas till Skatteverket för registrering.', 'The estate inventory is an official record of the deceased\'s all assets and liabilities. It is prepared by two independent estate administrators and must be submitted to the Swedish Tax Agency for registration.')}
      </p>

      {/* Timeline — Tiimo-style visual blocks */}
      <div className="mb-8 p-6" style={{ background: 'var(--bg-card)', borderRadius: '28px', border: '1px solid var(--border)' }}>
        <h3 className="font-display text-lg mb-5" style={{ color: 'var(--text)' }}>
          {t('Tidsplan för processen', 'Timeline for the process')}
        </h3>
        <div className="flex flex-col gap-3">
          {[
            {
              num: 1,
              title: t('Dödsdatum', 'Date of death'),
              sub: deathDate?.toLocaleDateString('sv-SE') || '',
              color: 'var(--accent)',
              bg: 'rgba(122,158,126,0.10)',
            },
            {
              num: 2,
              title: t('Förrättning', 'Probate'),
              sub: t('Inom 3 månader', 'Within 3 months'),
              deadline: förrättningDeadline?.toLocaleDateString('sv-SE'),
              color: 'var(--sora)',
              bg: 'rgba(139,164,184,0.10)',
            },
            {
              num: 3,
              title: t('Inlämning till Skatteverket', 'Submission to Swedish Tax Agency'),
              sub: t('1 månad efter förrättning', '1 month after probate'),
              deadline: inlämningDeadline?.toLocaleDateString('sv-SE'),
              color: 'var(--kohaku)',
              bg: 'rgba(196,149,106,0.10)',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4" style={{ borderRadius: '20px', background: item.bg }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                style={{ background: item.color }}>
                {item.num}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.sub}</p>
                {item.deadline && (
                  <p className="text-xs mt-1 font-medium" style={{ color: item.color }}>
                    Senast: {item.deadline}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deadline warnings */}
      {daysRemaining !== null && isPassed && (
        <div className="mb-6 p-5 flex gap-4" style={{
          background: 'linear-gradient(135deg, rgba(220,80,80,0.06), rgba(220,80,80,0.02))',
          borderRadius: '24px',
          border: '1.5px solid rgba(220,80,80,0.12)',
        }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(220,80,80,0.10)' }}>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-sm text-red-600">{t('Deadline har passerat', 'Deadline has passed')}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t('Du kan ansöka om förlängning hos Skatteverket.', 'You can apply for an extension from the Swedish Tax Agency.')}</p>
          </div>
        </div>
      )}

      {daysRemaining !== null && isApproaching && (
        <div className="mb-6 p-5 flex gap-4" style={{
          background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))',
          borderRadius: '24px',
          border: '1.5px solid rgba(196,149,106,0.12)',
        }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,149,106,0.10)' }}>
            <AlertCircle className="w-4 h-4" style={{ color: 'var(--kohaku)' }} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--kohaku)' }}>{daysRemaining} {t('dagar kvar', 'days remaining')}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t('Inlämningen måste vara hos Skatteverket innan deadline.', 'The submission must be with the Swedish Tax Agency before the deadline.')}</p>
          </div>
        </div>
      )}

      <MikeRossTip text={t('Bouppteckningen är en lista över den avlidnes alla tillgångar och skulder. Den måste förrättas inom 3 månader från dödsfallet och skickas till Skatteverket senast 1 månad efter förrättningen.', 'The estate inventory is a list of the deceased\'s all assets and liabilities. It must be completed within 3 months from the death and submitted to the Swedish Tax Agency no later than 1 month after the completion.')} />
    </div>
  );
}

function Step1Preparation() {
  const { t } = useLanguage();
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

      <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>
        {t('Förbered förrättningen', 'Prepare for probate')}
      </h2>

      <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
        {t('Innan förrättningen kan genomföras behöver du samla in dokument och utse förrättningsmän. Använd checklistan nedan för att hålla ordning.', 'Before the probate can take place, you need to gather documents and appoint estate administrators. Use the checklist below to keep track.')}
      </p>

      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <ChecklistItem key={idx} label={item} checked={checked[idx]}
            onChange={() => { const n = [...checked]; n[idx] = !n[idx]; setChecked(n); }} />
        ))}
      </div>

      <MikeRossTip text={t('Förrättningsmännen ansvarar för att bouppteckningen är korrekt. De behöver inte vara jurister — det räcker med att de är opartiska och förstår uppgiften. Dödsbodelägare och efterarvingar får INTE vara förrättningsmän.', 'The estate administrators are responsible for ensuring the estate inventory is correct. They don\'t need to be lawyers — it\'s enough that they are impartial and understand the task. Estate owners and heirs are NOT allowed to be estate administrators.')} />
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
      <ProgressCounter completed={completedCount} total={5} />

      <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>Genomför förrättningen</h2>

      <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
        Vid förrättningen granskas alla tillgångar och skulder. Använd checklistan för att se till att allt är på plats.
      </p>

      <div className="mb-8 p-5 flex gap-4" style={{
        background: 'linear-gradient(135deg, rgba(139,164,184,0.06), rgba(139,164,184,0.02))',
        borderRadius: '24px',
        border: '1.5px solid rgba(139,164,184,0.10)',
      }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,164,184,0.10)' }}>
          <Info className="w-4 h-4" style={{ color: 'var(--sora)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Alla dödsbodelägare måste kallas till förrättningen, men alla behöver inte närvara fysiskt. Det går att närvara digitalt eller genom fullmakt.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <ChecklistItem key={idx} label={item} checked={checked[idx]}
            onChange={() => { const n = [...checked]; n[idx] = !n[idx]; setChecked(n); }} />
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
      <ProgressCounter completed={completedCount} total={5} />

      <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>Skicka in till Skatteverket</h2>

      <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
        Bouppteckningen kan skickas in antingen digitalt eller per post. Kontrollera att alla dokument är med innan du skickar.
      </p>

      <div className="mb-8 p-6" style={{ background: 'var(--bg-card)', borderRadius: '28px', border: '1px solid var(--border)' }}>
        <h3 className="font-display text-base mb-3" style={{ color: 'var(--text)' }}>Postadress</h3>
        <div className="text-sm space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
          <p>Skatteverket</p>
          <p>Bouppteckningssektionen</p>
          <p>831 81 Östersund</p>
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>Du kan också skicka in digitalt via skatteverket.se</p>
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <ChecklistItem key={idx} label={item} checked={checked[idx]}
            onChange={() => { const n = [...checked]; n[idx] = !n[idx]; setChecked(n); }} />
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
      <h3 className="font-display text-base mb-4" style={{ color: 'var(--text)' }}>Ansök om förlängning</h3>

      <div className="mb-4">
        <textarea
          readOnly
          value={templateText}
          className="w-full p-5 font-mono text-xs resize-none"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
          }}
          rows={18}
        />
      </div>

      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold transition-all duration-300 active:scale-[0.97]"
        style={{
          background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)',
          borderRadius: '9999px',
        }}
      >
        <Copy className="w-4 h-4" />
        {copied ? 'Kopierad!' : 'Kopiera mall'}
      </button>
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
      <ProgressCounter completed={completedCount} total={4} />

      <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>Efter registrering</h2>

      <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
        När Skatteverket har registrerat bouppteckningen kan ni påbörja arvskiftet och andra administrativa åtgärder.
      </p>

      <div className="mb-8">
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Kan du inte hinna med deadline?</p>
        <ExtensionRequest />
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <ChecklistItem key={idx} label={item} checked={checked[idx]}
            onChange={() => { const n = [...checked]; n[idx] = !n[idx]; setChecked(n); }} />
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
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-32">
        {/* Back link */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors"
          style={{ color: 'var(--accent)' }}>
          <ArrowLeft className="w-4 h-4" />
          <span>Tillbaka</span>
        </Link>

        {/* Header — Tiimo display font */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}>
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display text-3xl" style={{ color: 'var(--text)' }}>Bouppteckningsguide</h1>
        </div>

        {/* Step tabs — pill style */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-1 px-1">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className="px-5 py-2.5 font-semibold text-sm whitespace-nowrap transition-all duration-300 flex-shrink-0 active:scale-[0.97]"
              style={{
                borderRadius: '9999px',
                background: currentStep === idx ? 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' : 'var(--bg-card)',
                color: currentStep === idx ? '#FFFFFF' : 'var(--text-secondary)',
                border: currentStep === idx ? 'none' : '1px solid var(--border)',
              }}
            >
              {idx + 1}. {step.title}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="p-7 mb-8" style={{
          background: 'var(--bg-card)',
          borderRadius: '28px',
          border: '1px solid var(--border)',
        }}>
          {steps[currentStep].component}
        </div>

        {/* Navigation — pill buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              borderRadius: '9999px',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              border: '1.5px solid var(--border)',
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Föregående
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)',
            }}
          >
            Nästa
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
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
