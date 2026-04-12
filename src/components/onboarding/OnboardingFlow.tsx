'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
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
  const { t } = useLanguage();
  const { dispatch } = useDodsbo();
  const [step, setStep] = useState(0);

  // Onboarding state
  const [deceasedName, setDeceasedName] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [personnummer, setPersonnummer] = useState('');
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
      case 3: return true; // Banks are optional, can be skipped
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
            aria-label={t('Gå tillbaka', 'Go back')}
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
              {t('Vi finns här för dig', 'We are here for you')}
            </h1>
            <p className="text-muted mb-8">
              {t('Vi förstår att detta är en svår tid. Vi guidar dig steg för steg.', 'We understand this is a difficult time. We guide you step by step.')}
            </p>

            <label className="block mb-6">
              <span className="text-base font-medium text-primary mb-2 block">
                {t('Vad hette personen som avled?', 'What was the name of the deceased?')}
              </span>
              <input
                type="text"
                value={deceasedName}
                onChange={(e) => setDeceasedName(e.target.value)}
                placeholder={t('Förnamn Efternamn', 'First Name Last Name')}
                className="w-full min-h-touch px-4 py-3 text-lg border-2 border-gray-200 rounded-card
                           focus:border-accent focus:outline-none transition-colors"
                autoFocus
              />
            </label>

            <label className="block mb-6">
              <span className="text-base font-medium text-primary mb-2 block">
                {t('När inträffade dödsfallet?', 'When did the death occur?')}
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

            <label className="block">
              <span className="text-base font-medium text-primary mb-2 block">
                {t('Personnummer (valfritt)', 'Personal number (optional)')}
              </span>
              <input
                type="text"
                value={personnummer}
                onChange={(e) => setPersonnummer(e.target.value)}
                placeholder={t('YYYYMMDD-XXXX eller XXXXXX-XXXX', 'YYYYMMDD-XXXX or XXXXXX-XXXX')}
                className="w-full min-h-touch px-4 py-3 text-lg border-2 border-gray-200 rounded-card
                           focus:border-accent focus:outline-none transition-colors"
              />
              <p className="text-xs text-muted mt-1">
                {t('Exempel: 197512241234 eller 751224-1234', 'Example: 197512241234 or 751224-1234')}
              </p>
            </label>
          </div>
        )}

        {/* ── Step 1: Relation ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              {t('Vilken är din relation?', 'What is your relationship?')}
            </h1>
            <p className="text-muted mb-6">
              {t(`Din relation till ${deceasedName || 'den avlidne'} bestämmer vad du behöver göra och vilka rättigheter du har.`, `Your relationship to ${deceasedName || 'the deceased'} determines what you need to do and what rights you have.`)}
            </p>
            <div className="flex flex-col gap-3 stagger-children">
              {([
                { value: 'make_maka', label: t('Make/maka', 'Spouse'), desc: t('Gift med den avlidne', 'Married to the deceased') },
                { value: 'sambo', label: t('Sambo', 'Cohabiting partner'), desc: t('Sambor (ej gifta)', 'Cohabiting (not married)') },
                { value: 'barn', label: t('Barn', 'Child'), desc: t('Son eller dotter', 'Son or daughter') },
                { value: 'foralder', label: t('Förälder', 'Parent'), desc: t('Mamma eller pappa', 'Mother or father') },
                { value: 'syskon', label: t('Syskon', 'Sibling'), desc: t('Bror eller syster', 'Brother or sister') },
                { value: 'annan_slakting', label: t('Annan släkting', 'Other relative'), desc: t('Barnbarn, moster, kusin etc.', 'Grandchild, aunt, cousin, etc.') },
                { value: 'testamentstagare', label: t('Testamentstagare', 'Beneficiary'), desc: t('Omnämnd i testamente', 'Named in will') },
                { value: 'vardnadshavare', label: t('Vårdnadshavare för minderårigt barn', 'Guardian of minor child'), desc: t('Vårdnadshavare för barn', 'Guardian for child') },
                { value: 'foralder_avliden', label: t('Förälder till den avlidne', 'Parent of the deceased'), desc: t('Mamma eller pappa till den avlidne', 'Mother or father of the deceased') },
                { value: 'van_annan', label: t('Vän eller annan', 'Friend or other'), desc: t('Vän eller annan relation', 'Friend or other relationship') },
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
              {t('Om situationen', 'About your situation')}
            </h1>
            <p className="text-muted mb-8">
              {t('Dessa uppgifter bestämmer arvsordningen och vad som behöver göras.', 'This information determines the inheritance order and what needs to be done.')}
            </p>

            {/* Family situation — dropdown */}
            <label className="block mb-6">
              <span className="text-base font-medium text-primary mb-2 block">
                {t('Familjesituation', 'Family situation')}
              </span>
              <select
                value={familySituation}
                onChange={(e) => setFamilySituation(e.target.value as FamilySituation)}
                className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card
                           focus:border-accent focus:outline-none transition-colors appearance-none
                           bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7B75%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]
                           ${familySituation ? 'border-accent text-primary' : 'border-gray-200 text-muted'}`}
              >
                <option value="" disabled>{t('Välj familjesituation...', 'Choose family situation...')}</option>
                <option value="gift_med_gemensamma_barn">{t('Gift med gemensamma barn', 'Married with common children')}</option>
                <option value="gift_med_sarkullebarn">{t('Gift med särkullbarn', 'Married with separate children')}</option>
                <option value="gift_utan_barn">{t('Gift utan barn', 'Married without children')}</option>
                <option value="ogift_med_barn">{t('Ogift med barn', 'Unmarried with children')}</option>
                <option value="sambo_med_barn">{t('Sambo med barn', 'Cohabiting with children')}</option>
                <option value="sambo_utan_barn">{t('Sambo utan barn', 'Cohabiting without children')}</option>
                <option value="ensamstaende_utan_barn">{t('Ensamstående utan barn', 'Single without children')}</option>
              </select>
            </label>

            {/* Testamente */}
            <label className="block mb-6">
              <span className="text-base font-medium text-primary mb-2 block">
                {t('Finns det ett testamente?', 'Is there a will?')}
              </span>
              <div className="flex gap-2">
                {([
                  { val: true, label: t('Ja', 'Yes') },
                  { val: false, label: t('Nej', 'No') },
                  { val: null, label: t('Vet ej', 'Don\'t know') },
                ] as const).map((opt) => (
                  <button
                    key={String(opt.val)}
                    onClick={() => setHasTestamente(opt.val)}
                    className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${
                      hasTestamente === opt.val ? 'bg-accent text-white' : 'bg-gray-100 text-primary hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </label>

            {/* Housing type — dropdown */}
            <label className="block">
              <span className="text-base font-medium text-primary mb-2 block">
                {t('Boendetyp', 'Housing type')}
              </span>
              <select
                value={housingType}
                onChange={(e) => setHousingType(e.target.value as HousingType)}
                className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card
                           focus:border-accent focus:outline-none transition-colors appearance-none
                           bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7B75%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]
                           ${housingType ? 'border-accent text-primary' : 'border-gray-200 text-muted'}`}
              >
                <option value="" disabled>{t('Välj boendetyp...', 'Choose housing type...')}</option>
                <option value="hyresratt">{t('Hyresrätt', 'Rental apartment')}</option>
                <option value="bostadsratt">{t('Bostadsrätt', 'Condo')}</option>
                <option value="villa">{t('Villa/hus', 'House/villa')}</option>
                <option value="fritidshus">{t('Fritidshus', 'Vacation home')}</option>
                <option value="ingen_bostad">{t('Ingen egen bostad', 'No own residence')}</option>
              </select>
            </label>
          </div>
        )}

        {/* ── Step 3: Banker + Redan gjort (combined) ── */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              {t('Sista steget', 'Final step')}
            </h1>
            <p className="text-muted mb-6">
              {t('Vilka banker och vad har ni redan gjort?', 'Which banks and what have you already done?')}
            </p>

            {/* Banks */}
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              {t('Banker (valfritt)', 'Banks (optional)')}
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
              {t('Redan gjort (valfritt)', 'Already done (optional)')}
            </p>
            <div className="flex flex-col gap-2 stagger-children">
              {([
                { value: 'dodsbevis', label: t('Skaffat dödsbevis', 'Obtained death certificate') },
                { value: 'kontaktat_bank', label: t('Kontaktat banken', 'Contacted the bank') },
                { value: 'kontaktat_forsakring', label: t('Kontaktat försäkringsbolag', 'Contacted insurance company') },
                { value: 'kontaktat_hyresvard', label: t('Kontaktat hyresvärd/BRF', 'Contacted landlord/homeowners association') },
                { value: 'begravning_bestald', label: t('Beställt begravning', 'Arranged burial') },
                { value: 'bouppteckning_paborjad', label: t('Påbörjat bouppteckning', 'Started estate inventory') },
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
      <div className="pt-6 pb-2 flex gap-3">
        {step === 3 && (
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 rounded-xl font-medium text-base bg-gray-100 text-primary hover:bg-gray-200 transition-colors"
          >
            {t('Hoppa över', 'Skip')}
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`${step === 3 ? 'flex-1' : 'w-full'} btn-primary`}
        >
          {step === TOTAL_STEPS - 1 ? t('Visa min plan', 'Show my plan') : t('Fortsätt', 'Continue')}
        </button>
      </div>
    </div>
  );
}
