'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { OptionCard } from '@/components/ui/OptionCard';
import { useDodsbo } from '@/lib/context';
import { generateTasks } from '@/lib/tasks';
import { ChevronLeft } from 'lucide-react';
import type {
  Relation,
  FamilySituation,
  HousingType,
  AlreadyDoneStep,
  OnboardingData,
} from '@/types';
import { SWEDISH_BANKS } from '@/types';

// ============================================================
// Shortened onboarding — 4 steps instead of 7
// Step 0: Name + date
// Step 1: Relation
// Step 2: Family situation + testamente + housing (combined)
// Step 3: Banks + already done (combined)
// ============================================================

const TOTAL_STEPS = 4;

export function OnboardingFlow() {
  const router = useRouter();
  const { dispatch } = useDodsbo();
  const [step, setStep] = useState(0);

  // Onboarding state
  const [deceasedName, setDeceasedName] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [relation, setRelation] = useState<Relation | ''>('');
  const [familySituation, setFamilySituation] = useState<FamilySituation | ''>('');
  const [hasTestamente, setHasTestamente] = useState<boolean | null>(null);
  const [housingType, setHousingType] = useState<HousingType | ''>('');
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [alreadyDone, setAlreadyDone] = useState<AlreadyDoneStep[]>([]);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 0: return deceasedName.trim().length > 0 && deathDate.length > 0;
      case 1: return relation !== '';
      case 2: return familySituation !== '' && housingType !== '';
      case 3: return selectedBanks.length > 0;
      default: return false;
    }
  }, [step, deceasedName, deathDate, relation, familySituation, housingType, selectedBanks]);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // Final step — save and navigate
      const onboarding: OnboardingData = {
        relation: relation as Relation,
        familySituation: familySituation as FamilySituation,
        hasTestamente,
        housingType: housingType as HousingType,
        banks: selectedBanks,
        hasDebts: null,
        alreadyDone,
      };

      dispatch({ type: 'SET_DECEASED_INFO', payload: { name: deceasedName, deathDate } });
      dispatch({ type: 'SET_ONBOARDING', payload: onboarding });

      // Generate personalized task list and save to state
      const tasks = generateTasks(onboarding);
      dispatch({ type: 'SET_TASKS', payload: tasks });
      dispatch({ type: 'SET_STEP', payload: 'akut' });

      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleBank = (bankId: string) => {
    setSelectedBanks((prev) =>
      prev.includes(bankId) ? prev.filter((b) => b !== bankId) : [...prev, bankId]
    );
  };

  const toggleDone = (item: AlreadyDoneStep) => {
    setAlreadyDone((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Gå tillbaka"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
        )}
        <StepIndicator totalSteps={TOTAL_STEPS} currentStep={step} />
      </div>

      {/* Content — grows to fill space */}
      <div className="flex-1 flex flex-col">
        {/* ── Step 0: Vem har gått bort? ── */}
        {step === 0 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              Vi finns här för dig
            </h1>
            <p className="text-muted mb-8">
              Vi förstår att detta är en svår tid. Vi guidar dig steg för steg.
            </p>

            <label className="block mb-6">
              <span className="text-base font-medium text-primary mb-2 block">
                Vad hette personen som avled?
              </span>
              <input
                type="text"
                value={deceasedName}
                onChange={(e) => setDeceasedName(e.target.value)}
                placeholder="Förnamn Efternamn"
                className="w-full min-h-touch px-4 py-3 text-lg border-2 border-gray-200 rounded-card
                           focus:border-accent focus:outline-none transition-colors"
                autoFocus
              />
            </label>

            <label className="block">
              <span className="text-base font-medium text-primary mb-2 block">
                När inträffade dödsfallet?
              </span>
              <input
                type="date"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full min-h-touch px-4 py-3 text-lg border-2 border-gray-200 rounded-card
                           focus:border-accent focus:outline-none transition-colors"
              />
            </label>
          </div>
        )}

        {/* ── Step 1: Relation ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              Vilken är din relation?
            </h1>
            <p className="text-muted mb-6">
              Din relation till {deceasedName || 'den avlidne'} bestämmer vad du behöver göra och vilka rättigheter du har.
            </p>
            <div className="flex flex-col gap-3 stagger-children">
              {([
                { value: 'make_maka', label: 'Make/maka', desc: 'Gift med den avlidne' },
                { value: 'sambo', label: 'Sambo', desc: 'Sambor (ej gifta)' },
                { value: 'barn', label: 'Barn', desc: 'Son eller dotter' },
                { value: 'foralder', label: 'Förälder', desc: 'Mamma eller pappa' },
                { value: 'syskon', label: 'Syskon', desc: 'Bror eller syster' },
                { value: 'annan_slakting', label: 'Annan släkting', desc: 'Barnbarn, moster, kusin etc.' },
                { value: 'testamentstagare', label: 'Testamentstagare', desc: 'Omnämnd i testamente' },
              ] as const).map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  description={opt.desc}
                  selected={relation === opt.value}
                  onClick={() => setRelation(opt.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Familjesituation + Testamente + Bostad (combined) ── */}
        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              Om situationen
            </h1>
            <p className="text-muted mb-6">
              Dessa uppgifter bestämmer arvsordningen och vad som behöver göras.
            </p>

            {/* Family situation */}
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Familjesituation
            </p>
            <div className="flex flex-col gap-2 mb-6 stagger-children">
              {([
                { value: 'gift_med_gemensamma_barn', label: 'Gift med gemensamma barn' },
                { value: 'gift_med_sarkullebarn', label: 'Gift med särkullbarn', desc: 'Barn från tidigare förhållande' },
                { value: 'gift_utan_barn', label: 'Gift utan barn' },
                { value: 'ogift_med_barn', label: 'Ogift med barn' },
                { value: 'sambo_med_barn', label: 'Sambo med barn' },
                { value: 'sambo_utan_barn', label: 'Sambo utan barn' },
                { value: 'ensamstaende_utan_barn', label: 'Ensamstående utan barn' },
              ] as const).map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  description={'desc' in opt ? opt.desc : undefined}
                  selected={familySituation === opt.value}
                  onClick={() => setFamilySituation(opt.value)}
                />
              ))}
            </div>

            {/* Testamente */}
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Testamente
            </p>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setHasTestamente(true)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${
                  hasTestamente === true ? 'bg-accent text-white' : 'bg-gray-100 text-primary hover:bg-gray-200'
                }`}
              >
                Ja
              </button>
              <button
                onClick={() => setHasTestamente(false)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${
                  hasTestamente === false ? 'bg-accent text-white' : 'bg-gray-100 text-primary hover:bg-gray-200'
                }`}
              >
                Nej
              </button>
              <button
                onClick={() => setHasTestamente(null)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${
                  hasTestamente === null ? 'bg-accent text-white' : 'bg-gray-100 text-primary hover:bg-gray-200'
                }`}
              >
                Vet ej
              </button>
            </div>

            {/* Housing type */}
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Boendetyp
            </p>
            <div className="flex flex-col gap-2 stagger-children">
              {([
                { value: 'hyresratt', label: 'Hyresrätt' },
                { value: 'bostadsratt', label: 'Bostadsrätt' },
                { value: 'villa', label: 'Villa/hus' },
                { value: 'fritidshus', label: 'Fritidshus' },
                { value: 'ingen_bostad', label: 'Ingen egen bostad' },
              ] as const).map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={housingType === opt.value}
                  onClick={() => setHousingType(opt.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Banker + Redan gjort (combined) ── */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              Sista steget
            </h1>
            <p className="text-muted mb-6">
              Vilka banker och vad har ni redan gjort?
            </p>

            {/* Banks */}
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Banker (välj minst en)
            </p>
            <div className="flex flex-col gap-2 mb-6 stagger-children">
              {SWEDISH_BANKS.map((bank) => (
                <OptionCard
                  key={bank.id}
                  label={bank.name}
                  description={bank.phone ? `Tel: ${bank.phone}` : undefined}
                  selected={selectedBanks.includes(bank.id)}
                  onClick={() => toggleBank(bank.id)}
                  multi
                />
              ))}
            </div>

            {/* Already done */}
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Redan gjort (valfritt)
            </p>
            <div className="flex flex-col gap-2 stagger-children">
              {([
                { value: 'dodsbevis', label: 'Skaffat dödsbevis' },
                { value: 'kontaktat_bank', label: 'Kontaktat banken' },
                { value: 'kontaktat_forsakring', label: 'Kontaktat försäkringsbolag' },
                { value: 'kontaktat_hyresvard', label: 'Kontaktat hyresvärd/BRF' },
                { value: 'begravning_bestald', label: 'Beställt begravning' },
                { value: 'bouppteckning_paborjad', label: 'Påbörjat bouppteckning' },
              ] as const).map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={alreadyDone.includes(opt.value)}
                  onClick={() => toggleDone(opt.value)}
                  multi
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Button — always at bottom */}
      <div className="pt-6 pb-2">
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="btn-primary"
        >
          {step === TOTAL_STEPS - 1 ? 'Visa min plan' : 'Fortsätt'}
        </button>
      </div>
    </div>
  );
}
