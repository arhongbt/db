'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { JuridiskTooltip } from '@/components/ui/JuridiskTooltip';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Scale,
  Plus,
  Trash2,
  Home,
  Sofa,
  Download,
  HelpCircle,
  Check,
  ArrowRight,
} from 'lucide-react';
import { MikeRossTip } from '@/components/ui/MikeRossTip';
import type {
  SamboEgendom,
  BodelningsData,
} from '@/lib/generate-bodelningsavtal';

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface AktenskapsForordData {
  exists: boolean | null;
  summary: string;
}

interface GiftorattsgodsItem {
  id: string;
  description: string;
  spouse1Value: number;
  spouse2Value: number;
  type: 'asset' | 'debt';
}

interface EnskildeEgendomItem {
  id: string;
  description: string;
  owner: 'spouse1' | 'spouse2';
  value: number;
}

function BodelningContent() {
  const { t } = useLanguage();
  const { state } = useDodsbo();
  const [mounted, setMounted] = useState(false);

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);

  // Step 1: Äktenskapsförord
  const [aktenskapsForord, setAktenskapsForord] = useState<AktenskapsForordData>({
    exists: null,
    summary: '',
  });

  // Step 2: Giftorättsgods
  const [giftorattsgodsList, setGiftorattsgodsList] = useState<GiftorattsgodsItem[]>([]);
  const [showAddGiftorattsgods, setShowAddGiftorattsgods] = useState(false);
  const [newGiftorattsgods, setNewGiftorattsgods] = useState({
    description: '',
    spouse1Value: '',
    spouse2Value: '',
    type: 'asset' as 'asset' | 'debt',
  });

  // Step 3: Enskild egendom
  const [enskildeEgendomList, setEnskildeEgendomList] = useState<EnskildeEgendomItem[]>([]);
  const [showAddEnskildEgendom, setShowAddEnskildEgendom] = useState(false);
  const [newEnskildEgendom, setNewEnskildEgendom] = useState({
    description: '',
    owner: 'spouse1' as 'spouse1' | 'spouse2',
    value: '',
  });

  // Sambo state (kept for backward compatibility)
  const [samboEgendom, setSamboEgendom] = useState<SamboEgendom[]>([]);
  const [samboName, setSamboName] = useState('');
  const [samboPnr, setSamboPnr] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    beskrivning: '',
    typ: 'bostad' as 'bostad' | 'bohag',
    varde: '',
    agareSambo: false,
  });

  // Legacy state (for gift bodelning non-wizard)
  const [hasAktenskapsForord, setHasAktenskapsForord] = useState(false);
  const [enskildegenodom, setEnskildegenodom] = useState('');

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isMarried = state.onboarding.familySituation.startsWith('gift_');
  const isSambo = state.onboarding.familySituation.startsWith('sambo_');

  const totalTillgangar = state.tillgangar.reduce(
    (sum, t) => sum + (t.estimatedValue ?? 0), 0
  );
  const totalSkulder = state.skulder.reduce(
    (sum, s) => sum + (s.amount ?? 0), 0
  );
  const netto = totalTillgangar - totalSkulder;

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(amount);

  // ═══════════════════════════════════════════════════════════════════════════
  // GIFT BODELNING WIZARD FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const canProceedStep1 = () => aktenskapsForord.exists !== null;

  const canProceedStep2 = () => giftorattsgodsList.length > 0;

  const canProceedStep3 = () => !aktenskapsForord.exists || enskildeEgendomList.length > 0 || aktenskapsForord.exists;

  const addGiftorattsgods = () => {
    if (!newGiftorattsgods.description) return;
    const spouse1Val = parseFloat(newGiftorattsgods.spouse1Value) || 0;
    const spouse2Val = parseFloat(newGiftorattsgods.spouse2Value) || 0;

    setGiftorattsgodsList((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: newGiftorattsgods.description,
        spouse1Value: spouse1Val,
        spouse2Value: spouse2Val,
        type: newGiftorattsgods.type,
      },
    ]);

    setNewGiftorattsgods({
      description: '',
      spouse1Value: '',
      spouse2Value: '',
      type: 'asset',
    });
    setShowAddGiftorattsgods(false);
  };

  const removeGiftorattsgods = (id: string) => {
    setGiftorattsgodsList((prev) => prev.filter((item) => item.id !== id));
  };

  const addEnskildEgendom = () => {
    if (!newEnskildEgendom.description || !newEnskildEgendom.value) return;

    setEnskildeEgendomList((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: newEnskildEgendom.description,
        owner: newEnskildEgendom.owner,
        value: parseFloat(newEnskildEgendom.value) || 0,
      },
    ]);

    setNewEnskildEgendom({
      description: '',
      owner: 'spouse1',
      value: '',
    });
    setShowAddEnskildEgendom(false);
  };

  const removeEnskildEgendom = (id: string) => {
    setEnskildeEgendomList((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate giftorättsgods totals
  const giftorattsgodsTotals = giftorattsgodsList.reduce(
    (acc, item) => {
      if (item.type === 'asset') {
        acc.assets1 += item.spouse1Value;
        acc.assets2 += item.spouse2Value;
      } else {
        acc.debts1 += item.spouse1Value;
        acc.debts2 += item.spouse2Value;
      }
      return acc;
    },
    { assets1: 0, assets2: 0, debts1: 0, debts2: 0 }
  );

  const netGiftorattsgods1 = giftorattsgodsTotals.assets1 - giftorattsgodsTotals.debts1;
  const netGiftorattsgods2 = giftorattsgodsTotals.assets2 - giftorattsgodsTotals.debts2;
  const totalNetGiftorattsgods = netGiftorattsgods1 + netGiftorattsgods2;

  // Calculate enskild egendom totals
  const enskildeEgendomTotals = enskildeEgendomList.reduce(
    (acc, item) => {
      if (item.owner === 'spouse1') {
        acc.spouse1 += item.value;
      } else {
        acc.spouse2 += item.value;
      }
      return acc;
    },
    { spouse1: 0, spouse2: 0 }
  );

  // Final calculations (Step 4)
  const spouse1Share = netGiftorattsgods1 / 2 + enskildeEgendomTotals.spouse1;
  const spouse2Share = netGiftorattsgods2 / 2 + enskildeEgendomTotals.spouse2;
  const totalToEstate = totalNetGiftorattsgods / 2;

  // Sambo functions (unchanged)
  const addEgendom = () => {
    if (!newItem.beskrivning || !newItem.varde) return;
    setSamboEgendom((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        beskrivning: newItem.beskrivning,
        typ: newItem.typ,
        varde: parseFloat(newItem.varde) || 0,
        agareSambo: newItem.agareSambo,
      },
    ]);
    setNewItem({ beskrivning: '', typ: 'bostad', varde: '', agareSambo: false });
    setShowAddForm(false);
  };

  const removeEgendom = (id: string) => {
    setSamboEgendom((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDownloadAvtal = async () => {
    const data: BodelningsData = {
      deceasedName: state.deceasedName || '[Namn]',
      deceasedPersonnummer: state.deceasedPersonnummer || '[Personnummer]',
      samboName: samboName || '[Sambons namn]',
      samboPersonnummer: samboPnr || '[Personnummer]',
      egendom: samboEgendom,
      dödsdatum: state.deathDate
        ? new Date(state.deathDate).toLocaleDateString('sv-SE')
        : '[Dödsdatum]',
      avtalsDatum: new Date().toLocaleDateString('sv-SE'),
      typ: 'sambo',
    };
    const { downloadBodelningsavtal } = await import('@/lib/generate-bodelningsavtal');
    await downloadBodelningsavtal(data);
  };

  // Death date for deadline calculation
  const deadlineDate = state.deathDate
    ? new Date(new Date(state.deathDate).getTime() + 365 * 24 * 60 * 60 * 1000)
    : null;
  const daysUntilDeadline = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: STEP-BY-STEP WIZARD FOR GIFT BODELNING
  // ═══════════════════════════════════════════════════════════════════════════

  if (isMarried) {
    return (
      <div className="flex flex-col px-6 py-8 pb-28" style={{ backgroundColor: '#F7F5F0' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white transition-colors"
            aria-label={t('Tillbaka', 'Back')}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#6B7F5E' }} />
          </Link>
          <div>
            <h1 className="text-2xl font-display" style={{ color: '#2C3E3A' }}>
              {t('Bodelning', 'Marital Property Division')}
            </h1>
            <p className="text-sm" style={{ color: '#8B8680' }}>
              {t('Steg-för-steg guide för delning av giftorättsgods', 'Step-by-step guide for dividing marital property')}
            </p>
          </div>
        </div>

        {/* Mike Ross info */}
        <MikeRossTip
          text={t('Vid bodelning delas giftorättsgodset lika mellan makarna. Enskild egendom (genom äktenskapsförord, gåva eller arv) hålls utanför. Efter bodelningen fördelas resten genom arvskifte.', 'In marital property division, marital property is divided equally between spouses. Separate property (through prenuptial agreements, gifts, or inheritance) is excluded. After division, the remainder is distributed through estate distribution.')}
          className="mb-5"
        />

        {/* Warning: Must do before arvskifte */}
        <div
          className="flex gap-3 p-4 mb-6"
          style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
          <div>
            <p className="font-medium text-sm" style={{ color: '#D97706' }}>
              {t('Bodelning MÅSTE göras före arvskifte', 'Marital property division MUST be done before estate distribution')}
            </p>
            <p className="text-sm mt-1" style={{ color: '#6B5D55' }}>
              {t('Enligt Äktenskapsbalken måste giftorättsgodset delas innan arven fördelas.', 'According to the Marriage Code, marital property must be divided before inheritance is distributed.')}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <button
                  onClick={() => {
                    if (completedSteps.includes(step as WizardStep)) {
                      setCurrentStep(step as WizardStep);
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    currentStep === step
                      ? 'scale-110'
                      : completedSteps.includes(step as WizardStep)
                      ? 'cursor-pointer hover:scale-105'
                      : 'cursor-default'
                  }`}
                  style={{
                    backgroundColor:
                      currentStep === step
                        ? '#6B7F5E'
                        : completedSteps.includes(step as WizardStep)
                        ? '#6B7F5E'
                        : '#E8E4DE',
                    color:
                      currentStep === step || completedSteps.includes(step as WizardStep)
                        ? 'white'
                        : '#8B8680',
                  }}
                >
                  {completedSteps.includes(step as WizardStep) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </button>
                <span className="text-xs text-center" style={{ color: '#8B8680' }}>
                  {[t('Förord', 'Agreement'), t('Giftogds', 'Marital Prop'), t('Enskild', 'Separate'), t('Beräkning', 'Calculate'), t('Samm.', 'Summary')][step - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ STEP 1: ÄKTENSKAPSFÖRORD ═══════ */}
        {currentStep === 1 && (
          <div className="space-y-6 mb-6">
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'white', borderColor: '#E8E4DE', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3 mb-4">
                <HelpCircle className="w-5 h-5 mt-0.5" style={{ color: '#6B7F5E' }} />
                <div className="flex-1">
                  <h2 className="font-display text-base" style={{ color: '#2C3E3A' }}>
                    {t('Fanns det ett äktenskapsförord?', 'Was there a prenuptial agreement?')}
                  </h2>
                  <p className="text-sm mt-2" style={{ color: '#6B5D55' }}>
                    {t('Ett äktenskapsförord är ett skriftligt avtal mellan makarna som kan utesluta viss egendom från bodelning. Den egendom som nämns i förorden är enskild egendom och delas inte.', 'A prenuptial agreement is a written contract between spouses that can exclude certain property from division. Property mentioned in the agreement is separate property and is not divided.')}
                  </p>
                </div>
              </div>

              {/* Tooltip about äktenskapsförord */}
              <div
                className="rounded-[20px] p-3 mb-5"
                style={{ backgroundColor: '#F7F5F0' }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: '#8B8680' }}>
                  {t('JURIDISK INFO: Äktenskapsförord', 'LEGAL INFO: Prenuptial Agreement')}
                </p>
                <ul className="text-xs space-y-1" style={{ color: '#6B5D55' }}>
                  <li>
                    <strong>{t('Kan innehålla:', 'Can contain:')}</strong> {t('Gåvor från före äktenskapet, arv, fritidshus, sparande', 'Pre-marriage gifts, inheritance, vacation homes, savings')}
                  </li>
                  <li>
                    <strong>{t('Måste vara:', 'Must be:')}</strong> {t('Skriftligt och undertecknat av båda makarna', 'Written and signed by both spouses')}
                  </li>
                  <li>
                    <strong>{t('Effekt:', 'Effect:')}</strong> {t('Den egendom som nämns är enskild egendom och delas ej', 'Property mentioned is separate property and is not divided')}
                  </li>
                </ul>
              </div>

              {/* Yes/No buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAktenskapsForord({ exists: false, summary: '' });
                  }}
                  className={`flex-1 py-3 px-4 rounded-[20px] font-medium text-base transition-all ${
                    aktenskapsForord.exists === false
                      ? 'text-white'
                      : 'border-2'
                  }`}
                  style={{
                    backgroundColor: aktenskapsForord.exists === false ? '#6B7F5E' : 'white',
                    borderColor: aktenskapsForord.exists === false ? '#6B7F5E' : '#E8E4DE',
                    color: aktenskapsForord.exists === false ? 'white' : '#2C3E3A',
                  }}
                >
                  {t('Nej, inget förord', 'No, no agreement')}
                </button>
                <button
                  onClick={() => {
                    setAktenskapsForord({ ...aktenskapsForord, exists: true });
                  }}
                  className={`flex-1 py-3 px-4 rounded-[20px] font-medium text-base transition-all ${
                    aktenskapsForord.exists === true
                      ? 'text-white'
                      : 'border-2'
                  }`}
                  style={{
                    backgroundColor: aktenskapsForord.exists === true ? '#6B7F5E' : 'white',
                    borderColor: aktenskapsForord.exists === true ? '#6B7F5E' : '#E8E4DE',
                    color: aktenskapsForord.exists === true ? 'white' : '#2C3E3A',
                  }}
                >
                  {t('Ja, det finns förord', 'Yes, there is an agreement')}
                </button>
              </div>

              {/* Summary text if yes */}
              {aktenskapsForord.exists === true && (
                <div className="mt-5 pt-5 border-t" style={{ borderColor: '#E8E4DE' }}>
                  <label className="block">
                    <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                      Sammanfattning av förorden (valfritt)
                    </span>
                    <p className="text-xs mt-1" style={{ color: '#8B8680' }}>
                      Beskriv kort vad förorden säger, t.ex. &quot;Fritidshus på Öland är enskild egendom&quot;
                    </p>
                    <textarea
                      value={aktenskapsForord.summary}
                      onChange={(e) =>
                        setAktenskapsForord({ ...aktenskapsForord, summary: e.target.value })
                      }
                      placeholder="T.ex. 'Sparande på 500 000 kr är enskild egendom' eller 'Fritidshus ärvt från släkt'"
                      className="w-full px-3 py-2 text-sm border-2 rounded-[20px] mt-2 resize-none focus:outline-none"
                      style={{
                        borderColor: '#E8E4DE',
                        backgroundColor: 'white',
                        color: '#2C3E3A',
                      }}
                      rows={3}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                disabled
                className="flex-1 py-3 rounded-xl text-white font-medium opacity-50 cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
              >
                Tillbaka
              </button>
              <button
                onClick={() => {
                  if (canProceedStep1()) {
                    setCompletedSteps([...completedSteps, 1]);
                    setCurrentStep(2);
                  }
                }}
                disabled={!canProceedStep1()}
                className={`flex-1 py-3 rounded-[20px] text-white font-medium flex items-center justify-center gap-2 transition-all ${
                  !canProceedStep1() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
                style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
              >
                Nästa <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 2: GIFTORÄTTSGODS ═══════ */}
        {currentStep === 2 && (
          <div className="space-y-6 mb-6">
            <div
              className="rounded-[24px] p-5"
              style={{ backgroundColor: 'white', borderColor: '#E8E4DE', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3 mb-4">
                <HelpCircle className="w-5 h-5 mt-0.5" style={{ color: '#6B7F5E' }} />
                <div className="flex-1">
                  <h2 className="font-display text-base" style={{ color: '#2C3E3A' }}>
                    Giftorättsgods
                  </h2>
                  <p className="text-sm mt-2" style={{ color: '#6B5D55' }}>
                    Giftorättsgods är egendom som makarna äger tillsammans under äktenskapet. Det omfattar både tillgångar och skulder.
                  </p>
                </div>
              </div>

              {/* Info tooltip */}
              <div
                className="rounded-[20px] p-3 mb-5"
                style={{ backgroundColor: '#F7F5F0' }}
              >
                <p className="text-xs font-display mb-2" style={{ color: '#8B8680' }}>
                  JURIDISK INFO: Giftorättsgods
                </p>
                <ul className="text-xs space-y-1" style={{ color: '#6B5D55' }}>
                  <li>
                    <strong>Tillgångar:</strong> Gemensam bostad, sparkonton, aktier, möbler, bil (om inte enskild egendom)
                  </li>
                  <li>
                    <strong>Skulder:</strong> Bolån, lån, kreditkort
                  </li>
                  <li>
                    <strong>Delas:</strong> 50/50 mellan makarna
                  </li>
                </ul>
              </div>

              {/* List existing items */}
              {giftorattsgodsList.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C3E3A' }}>
                    Registrerad giftorättsgods:
                  </h3>
                  <div className="space-y-2">
                    {giftorattsgodsList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-[20px]"
                        style={{ backgroundColor: '#F7F5F0' }}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                            {item.description}
                          </p>
                          <p className="text-xs mt-1" style={{ color: '#8B8680' }}>
                            {item.type === 'asset' ? 'Tillgång' : 'Skuld'} · Maka/make 1: {formatSEK(item.spouse1Value)}, Maka/make 2: {formatSEK(item.spouse2Value)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeGiftorattsgods(item.id)}
                          className="p-1.5 rounded-[20px] transition-colors"
                          style={{ color: '#8B8680' }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = '#FFE8E8';
                            (e.currentTarget as HTMLElement).style.color = '#D97706';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#8B8680';
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add form */}
              {!showAddGiftorattsgods ? (
                <button
                  onClick={() => setShowAddGiftorattsgods(true)}
                  className="w-full py-3 px-4 rounded-[20px] font-medium text-base flex items-center justify-center gap-2 border-2 transition-all"
                  style={{
                    borderColor: '#E8E4DE',
                    color: '#6B7F5E',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F5F0';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Lägg till giftorättsgods
                </button>
              ) : (
                <div
                  className="p-4 rounded-[20px] space-y-3 mb-4"
                  style={{ backgroundColor: '#F7F5F0' }}
                >
                  <label className="block">
                    <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                      Beskrivning
                    </span>
                    <input
                      type="text"
                      value={newGiftorattsgods.description}
                      onChange={(e) =>
                        setNewGiftorattsgods({ ...newGiftorattsgods, description: e.target.value })
                      }
                      placeholder="T.ex. Lägenhet på Storgatan, Sparkonto, Bolån"
                      className="w-full px-3 py-2 text-sm border rounded-[20px] mt-1 focus:outline-none"
                      style={{
                        borderColor: '#E8E4DE',
                        backgroundColor: 'white',
                        color: '#2C3E3A',
                      }}
                    />
                  </label>

                  <div className="flex gap-3">
                    <label className="flex-1">
                      <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                        Typ
                      </span>
                      <select
                        value={newGiftorattsgods.type}
                        onChange={(e) =>
                          setNewGiftorattsgods({
                            ...newGiftorattsgods,
                            type: e.target.value as 'asset' | 'debt',
                          })
                        }
                        className="w-full px-3 py-2 text-sm border rounded-[20px] mt-1 focus:outline-none"
                        style={{
                          borderColor: '#E8E4DE',
                          backgroundColor: 'white',
                          color: '#2C3E3A',
                        }}
                      >
                        <option value="asset">Tillgång</option>
                        <option value="debt">Skuld</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                        Maka/Make 1 (SEK)
                      </span>
                      <input
                        type="number"
                        value={newGiftorattsgods.spouse1Value}
                        onChange={(e) =>
                          setNewGiftorattsgods({
                            ...newGiftorattsgods,
                            spouse1Value: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 text-sm border rounded-[20px] mt-1 focus:outline-none"
                        style={{
                          borderColor: '#E8E4DE',
                          backgroundColor: 'white',
                          color: '#2C3E3A',
                        }}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                        Maka/Make 2 (SEK)
                      </span>
                      <input
                        type="number"
                        value={newGiftorattsgods.spouse2Value}
                        onChange={(e) =>
                          setNewGiftorattsgods({
                            ...newGiftorattsgods,
                            spouse2Value: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 text-sm border rounded-[20px] mt-1 focus:outline-none"
                        style={{
                          borderColor: '#E8E4DE',
                          backgroundColor: 'white',
                          color: '#2C3E3A',
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => {
                        setShowAddGiftorattsgods(false);
                        setNewGiftorattsgods({
                          description: '',
                          spouse1Value: '',
                          spouse2Value: '',
                          type: 'asset',
                        });
                      }}
                      className="flex-1 py-2 px-3 text-sm rounded-[20px] border transition-all"
                      style={{
                        borderColor: '#E8E4DE',
                        color: '#2C3E3A',
                      }}
                    >
                      Avbryt
                    </button>
                    <button
                      onClick={addGiftorattsgods}
                      disabled={!newGiftorattsgods.description}
                      className={`flex-1 py-2 px-3 text-sm rounded-[20px] text-white font-medium transition-all ${
                        !newGiftorattsgods.description ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
                    >
                      Lägg till
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentStep(1);
                }}
                className="flex-1 py-3 rounded-[20px] border-2 text-base font-medium transition-all"
                style={{
                  borderColor: '#E8E4DE',
                  color: '#2C3E3A',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F5F0';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                Tillbaka
              </button>
              <button
                onClick={() => {
                  if (canProceedStep2()) {
                    setCompletedSteps([...completedSteps, 2]);
                    setCurrentStep(3);
                  }
                }}
                disabled={!canProceedStep2()}
                className={`flex-1 py-3 rounded-[20px] text-white font-medium flex items-center justify-center gap-2 transition-all ${
                  !canProceedStep2() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
                style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
              >
                Nästa <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 3: ENSKILD EGENDOM ═══════ */}
        {currentStep === 3 && (
          <div className="space-y-6 mb-6">
            <div
              className="rounded-[24px] p-5"
              style={{ backgroundColor: 'white', borderColor: '#E8E4DE', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3 mb-4">
                <HelpCircle className="w-5 h-5 mt-0.5" style={{ color: '#6B7F5E' }} />
                <div className="flex-1">
                  <h2 className="font-display text-base" style={{ color: '#2C3E3A' }}>
                    Enskild egendom
                  </h2>
                  <p className="text-sm mt-2" style={{ color: '#6B5D55' }}>
                    Enskild egendom ingår inte i bodelningen. Detta kan vara egendom som omnämns i äktenskapsförord, arv eller gåvor.
                  </p>
                </div>
              </div>

              {/* Info tooltip */}
              <div
                className="rounded-[20px] p-3 mb-5"
                style={{ backgroundColor: '#F7F5F0' }}
              >
                <p className="text-xs font-display mb-2" style={{ color: '#8B8680' }}>
                  JURIDISK INFO: Enskild egendom
                </p>
                <ul className="text-xs space-y-1" style={{ color: '#6B5D55' }}>
                  <li>
                    <strong>Från förord:</strong> Egendom specifikt nämnd i äktenskapsförorden
                  </li>
                  <li>
                    <strong>Arv/gåva:</strong> Med villkor om att det ska vara enskild egendom
                  </li>
                  <li>
                    <strong>Undantag:</strong> Även utan förord kan vissa saker vara enskild egendom
                  </li>
                </ul>
              </div>

              {/* Show if no äktenskapsförord */}
              {aktenskapsForord.exists === false && (
                <div
                  className="rounded-[20px] p-3 mb-5"
                  style={{ backgroundColor: '#E8F5E9' }}
                >
                  <p className="text-sm" style={{ color: '#2E7D32' }}>
                    Eftersom det inte finns något äktenskapsförord är all egendom giftorättsgods. Du kan hoppa över detta steg.
                  </p>
                </div>
              )}

              {/* List existing items */}
              {aktenskapsForord.exists === true && enskildeEgendomList.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C3E3A' }}>
                    Registrerad enskild egendom:
                  </h3>
                  <div className="space-y-2">
                    {enskildeEgendomList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-[20px]"
                        style={{ backgroundColor: '#F7F5F0' }}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                            {item.description}
                          </p>
                          <p className="text-xs mt-1" style={{ color: '#8B8680' }}>
                            {item.owner === 'spouse1' ? 'Maka/Make 1' : 'Maka/Make 2'} · {formatSEK(item.value)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeEnskildEgendom(item.id)}
                          className="p-1.5 rounded-[20px] transition-colors"
                          style={{ color: '#8B8680' }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = '#FFE8E8';
                            (e.currentTarget as HTMLElement).style.color = '#D97706';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#8B8680';
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add form */}
              {aktenskapsForord.exists === true && (
                <>
                  {!showAddEnskildEgendom ? (
                    <button
                      onClick={() => setShowAddEnskildEgendom(true)}
                      className="w-full py-3 px-4 rounded-[20px] font-medium text-base flex items-center justify-center gap-2 border-2 transition-all"
                      style={{
                        borderColor: '#E8E4DE',
                        color: '#6B7F5E',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F5F0';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Lägg till enskild egendom
                    </button>
                  ) : (
                    <div
                      className="p-4 rounded-[20px] space-y-3 mb-4"
                      style={{ backgroundColor: '#F7F5F0' }}
                    >
                      <label className="block">
                        <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                          Beskrivning
                        </span>
                        <input
                          type="text"
                          value={newEnskildEgendom.description}
                          onChange={(e) =>
                            setNewEnskildEgendom({ ...newEnskildEgendom, description: e.target.value })
                          }
                          placeholder="T.ex. Fritidshus på Öland, Arv från mormor"
                          className="w-full px-3 py-2 text-sm border rounded-[20px] mt-1 focus:outline-none"
                          style={{
                            borderColor: '#E8E4DE',
                            backgroundColor: 'white',
                            color: '#2C3E3A',
                          }}
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                          Ägare
                        </span>
                        <select
                          value={newEnskildEgendom.owner}
                          onChange={(e) =>
                            setNewEnskildEgendom({
                              ...newEnskildEgendom,
                              owner: e.target.value as 'spouse1' | 'spouse2',
                            })
                          }
                          className="w-full px-3 py-2 text-sm border rounded-[20px] mt-1 focus:outline-none"
                          style={{
                            borderColor: '#E8E4DE',
                            backgroundColor: 'white',
                            color: '#2C3E3A',
                          }}
                        >
                          <option value="spouse1">Maka/Make 1</option>
                          <option value="spouse2">Maka/Make 2</option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                          Värde (SEK)
                        </span>
                        <input
                          type="number"
                          value={newEnskildEgendom.value}
                          onChange={(e) =>
                            setNewEnskildEgendom({ ...newEnskildEgendom, value: e.target.value })
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 text-sm border rounded-[20px] mt-1 focus:outline-none"
                          style={{
                            borderColor: '#E8E4DE',
                            backgroundColor: 'white',
                            color: '#2C3E3A',
                          }}
                        />
                      </label>

                      <div className="flex gap-2 pt-3">
                        <button
                          onClick={() => {
                            setShowAddEnskildEgendom(false);
                            setNewEnskildEgendom({
                              description: '',
                              owner: 'spouse1',
                              value: '',
                            });
                          }}
                          className="flex-1 py-2 px-3 text-sm rounded-[20px] border transition-all"
                          style={{
                            borderColor: '#E8E4DE',
                            color: '#2C3E3A',
                          }}
                        >
                          Avbryt
                        </button>
                        <button
                          onClick={addEnskildEgendom}
                          disabled={!newEnskildEgendom.description || !newEnskildEgendom.value}
                          className={`flex-1 py-2 px-3 text-sm rounded-[20px] text-white font-medium transition-all ${
                            !newEnskildEgendom.description || !newEnskildEgendom.value
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
                        >
                          Lägg till
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentStep(2);
                }}
                className="flex-1 py-3 rounded-[20px] border-2 text-base font-medium transition-all"
                style={{
                  borderColor: '#E8E4DE',
                  color: '#2C3E3A',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F5F0';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                Tillbaka
              </button>
              <button
                onClick={() => {
                  if (canProceedStep3()) {
                    setCompletedSteps([...completedSteps, 3]);
                    setCurrentStep(4);
                  }
                }}
                disabled={!canProceedStep3()}
                className={`flex-1 py-3 rounded-[20px] text-white font-medium flex items-center justify-center gap-2 transition-all ${
                  !canProceedStep3() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
                style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
              >
                Nästa <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 4: BERÄKNING ═══════ */}
        {currentStep === 4 && (
          <div className="space-y-6 mb-6">
            <div
              className="rounded-[24px] p-5"
              style={{ backgroundColor: 'white', borderColor: '#E8E4DE', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3 mb-4">
                <Scale className="w-5 h-5 mt-0.5" style={{ color: '#6B7F5E' }} />
                <div className="flex-1">
                  <h2 className="font-display text-base" style={{ color: '#2C3E3A' }}>
                    Bodelningsberäkning
                  </h2>
                  <p className="text-sm mt-2" style={{ color: '#6B5D55' }}>
                    Här visas hur giftorättsgodset delas. Enskild egendom följer med ägaren.
                  </p>
                </div>
              </div>

              {/* Giftorättsgods summary */}
              <div className="mb-5 pb-5 border-b" style={{ borderColor: '#E8E4DE' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C3E3A' }}>
                  Giftorättsgods
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: '#6B5D55' }}>Tillgångar (Maka/Make 1)</span>
                    <span style={{ color: '#2E7D32' }} className="font-medium">
                      {formatSEK(giftorattsgodsTotals.assets1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#6B5D55' }}>Tillgångar (Maka/Make 2)</span>
                    <span style={{ color: '#2E7D32' }} className="font-medium">
                      {formatSEK(giftorattsgodsTotals.assets2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#6B5D55' }}>Skulder (Maka/Make 1)</span>
                    <span style={{ color: '#D97706' }} className="font-medium">
                      {formatSEK(giftorattsgodsTotals.debts1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#6B5D55' }}>Skulder (Maka/Make 2)</span>
                    <span style={{ color: '#D97706' }} className="font-medium">
                      {formatSEK(giftorattsgodsTotals.debts2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: '#E8E4DE' }}>
                    <span style={{ color: '#2C3E3A' }} className="font-semibold">
                      Netto Giftorättsgods (M1)
                    </span>
                    <span style={{ color: '#2C3E3A' }} className="font-bold text-base">
                      {formatSEK(netGiftorattsgods1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2C3E3A' }} className="font-semibold">
                      Netto Giftorättsgods (M2)
                    </span>
                    <span style={{ color: '#2C3E3A' }} className="font-bold text-base">
                      {formatSEK(netGiftorattsgods2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2C3E3A' }} className="font-semibold">
                      Totalt Giftorättsgods
                    </span>
                    <span style={{ color: '#2C3E3A' }} className="font-bold text-lg">
                      {formatSEK(totalNetGiftorattsgods)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 50/50 split result */}
              <div
                className="rounded-lg p-4 mb-5"
                style={{ backgroundColor: '#E8F5E9' }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: '#2E7D32' }}>
                  GIFTORÄTTSGODS DELAS 50/50
                </p>
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span style={{ color: '#2C3E3A' }}>Maka/Make 1 får</span>
                    <span style={{ color: '#2E7D32' }} className="font-bold">
                      {formatSEK(totalNetGiftorattsgods / 2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2C3E3A' }}>Maka/Make 2 får</span>
                    <span style={{ color: '#2E7D32' }} className="font-bold">
                      {formatSEK(totalNetGiftorattsgods / 2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enskild egendom summary */}
              {aktenskapsForord.exists === true && (
                <div className="mb-5 pb-5 border-b" style={{ borderColor: '#E8E4DE' }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C3E3A' }}>
                    Enskild egendom
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: '#6B5D55' }}>Maka/Make 1</span>
                      <span style={{ color: '#2C3E3A' }} className="font-medium">
                        {formatSEK(enskildeEgendomTotals.spouse1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#6B5D55' }}>Maka/Make 2</span>
                      <span style={{ color: '#2C3E3A' }} className="font-medium">
                        {formatSEK(enskildeEgendomTotals.spouse2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Final result */}
              <div className="space-y-3">
                <p className="text-sm font-semibold" style={{ color: '#2C3E3A' }}>
                  Slutresultat:
                </p>
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#F3E5F5' }}
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: '#6A1B9A' }}>
                    MAKA/MAKE 1 FÅR
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#2C3E3A' }}>
                    {formatSEK(spouse1Share)}
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#6B5D55' }}>
                    {formatSEK(totalNetGiftorattsgods / 2)} från giftorättsgods + {formatSEK(enskildeEgendomTotals.spouse1)} enskild egendom
                  </p>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#E3F2FD' }}
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: '#1565C0' }}>
                    MAKA/MAKE 2 FÅR
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#2C3E3A' }}>
                    {formatSEK(spouse2Share)}
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#6B5D55' }}>
                    {formatSEK(totalNetGiftorattsgods / 2)} från giftorättsgods + {formatSEK(enskildeEgendomTotals.spouse2)} enskild egendom
                  </p>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#FFF3E0' }}
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: '#E65100' }}>
                    TILL DÖDSBOET (för arvskifte)
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#2C3E3A' }}>
                    {formatSEK(totalToEstate)}
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#6B5D55' }}>
                    Den andra hälften av giftorättsgodset
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentStep(3);
                }}
                className="flex-1 py-3 rounded-xl border-2 text-base font-medium transition-all"
                style={{
                  borderColor: '#E8E4DE',
                  color: '#2C3E3A',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F5F0';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                Tillbaka
              </button>
              <button
                onClick={() => {
                  setCompletedSteps([...completedSteps, 4]);
                  setCurrentStep(5);
                }}
                className="flex-1 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
              >
                Nästa <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 5: SAMMANFATTNING ═══════ */}
        {currentStep === 5 && (
          <div className="space-y-6 mb-6">
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'white', borderColor: '#E8E4DE', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-5 h-5 mt-0.5" style={{ color: '#6B7F5E' }} />
                <div className="flex-1">
                  <h2 className="font-semibold text-base" style={{ color: '#2C3E3A' }}>
                    Sammanfattning
                  </h2>
                  <p className="text-sm mt-2" style={{ color: '#6B5D55' }}>
                    Här är en överblick av bodelningen. Du kan nu fortsätta till arvskiftet.
                  </p>
                </div>
              </div>

              {/* Summary info */}
              <div className="space-y-4">
                {/* Äktenskapsförord */}
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#F7F5F0' }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: '#2C3E3A' }}>
                    Äktenskapsförord
                  </p>
                  <p className="text-sm" style={{ color: '#6B5D55' }}>
                    {aktenskapsForord.exists === true
                      ? `Ja, förorden finns. ${
                          aktenskapsForord.summary ? `Sammanfattning: "${aktenskapsForord.summary}"` : ''
                        }`
                      : 'Nej, inget äktenskapsförord'}
                  </p>
                </div>

                {/* Total summary */}
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#F7F5F0' }}
                >
                  <p className="text-sm font-semibold mb-3" style={{ color: '#2C3E3A' }}>
                    Bodelningsresultat
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: '#6B5D55' }}>Giftorättsgods totalt</span>
                      <span style={{ color: '#2C3E3A' }} className="font-medium">
                        {formatSEK(totalNetGiftorattsgods)}
                      </span>
                    </div>
                    {aktenskapsForord.exists === true && (
                      <div className="flex justify-between">
                        <span style={{ color: '#6B5D55' }}>Enskild egendom</span>
                        <span style={{ color: '#2C3E3A' }} className="font-medium">
                          {formatSEK(enskildeEgendomTotals.spouse1 + enskildeEgendomTotals.spouse2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final shares */}
                <div className="grid grid-cols-1 gap-3">
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#E8F5E9' }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: '#2E7D32' }}>
                      MAKA/MAKE 1
                    </p>
                    <p className="text-xl font-bold" style={{ color: '#2C3E3A' }}>
                      {formatSEK(spouse1Share)}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#E3F2FD' }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: '#1565C0' }}>
                      MAKA/MAKE 2
                    </p>
                    <p className="text-xl font-bold" style={{ color: '#2C3E3A' }}>
                      {formatSEK(spouse2Share)}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#FFF3E0' }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: '#E65100' }}>
                      TILL DÖDSBOET
                    </p>
                    <p className="text-xl font-bold" style={{ color: '#2C3E3A' }}>
                      {formatSEK(totalToEstate)}
                    </p>
                  </div>
                </div>

                {/* Next steps */}
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#F3E5F5' }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: '#6A1B9A' }}>
                    Nästa steg
                  </p>
                  <ol className="text-sm space-y-1" style={{ color: '#6B5D55' }}>
                    <li>1. Upprätta en skriftlig bodelningshandling</li>
                    <li>2. Båda makarna skriver under</li>
                    <li>3. Gå till arvskiftet för resten av dödsboet</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentStep(4);
                }}
                className="flex-1 py-3 rounded-xl border-2 text-base font-medium transition-all"
                style={{
                  borderColor: '#E8E4DE',
                  color: '#2C3E3A',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F5F0';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                Tillbaka
              </button>
              <Link
                href="/arvskifte"
                className="flex-1 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
              >
                Gå till arvskifte <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SAMBO BODELNING (unchanged, preserved)
  // ═══════════════════════════════════════════════════════════════════════════

  if (isSambo) {
    const totalSamboEgendom = samboEgendom.reduce((s, e) => s + e.varde, 0);
    const samboAndel = Math.round(totalSamboEgendom / 2);
    const dodsboAndel = totalSamboEgendom - samboAndel;

    return (
      <div className="flex flex-col px-6 py-8 pb-28" style={{ backgroundColor: '#F7F5F0' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white transition-colors"
            aria-label={t('Tillbaka', 'Back')}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#6B7F5E' }} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: '#2C3E3A' }}>
              Bodelning
            </h1>
            <p className="text-sm" style={{ color: '#8B8680' }}>
              Delning av samboegendom
            </p>
          </div>
        </div>

        {/* Mike Ross förklarar */}
        <MikeRossTip
          text="Sambor delar bara på samboegendom — det vill säga bostad och bohag som skaffades för gemensamt bruk. Övriga tillgångar som aktier, bilar eller sparande ingår inte i bodelningen enligt Sambolagen."
          className="mb-5"
        />

        {/* Deadline warning */}
        {daysUntilDeadline !== null && daysUntilDeadline > 0 && daysUntilDeadline <= 180 && (
          <div
            className="flex gap-2 rounded-2xl p-4 mb-6"
            style={{ backgroundColor: '#FFF4E6', borderLeft: '4px solid #D97706' }}
          >
            <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
            <div>
              <p className="font-medium text-sm" style={{ color: '#D97706' }}>
                {daysUntilDeadline} dagar kvar att begära bodelning
              </p>
              <p className="text-sm mt-1" style={{ color: '#6B5D55' }}>
                Enligt Sambolagen 8 § måste bodelning begäras senast ett år efter samboförhållandets upphörande.
                {deadlineDate && (
                  <> Sista datum: <strong>{deadlineDate.toLocaleDateString('sv-SE')}</strong>.</>
                )}
              </p>
            </div>
          </div>
        )}

        {daysUntilDeadline !== null && daysUntilDeadline <= 0 && (
          <div
            className="flex gap-2 rounded-2xl p-4 mb-6"
            style={{ backgroundColor: '#FFF4E6', borderLeft: '4px solid #D97706' }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
            <div>
              <p className="font-medium text-sm" style={{ color: '#D97706' }}>
                Tidsfristen har passerat
              </p>
              <p className="text-sm mt-1" style={{ color: '#6B5D55' }}>
                Det har gått mer än ett år sedan dödsfallet. Rätten att begära bodelning enligt Sambolagen kan ha
                gått förlorad. Kontakta en jurist.
              </p>
            </div>
          </div>
        )}

        {/* Juridisk info */}
        <div
          className="flex gap-3 rounded-2xl p-4 mb-6"
          style={{ backgroundColor: '#E8F5E9' }}
        >
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2E7D32' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
              Vad är <JuridiskTooltip term="bodelning" /> vid samboförhållande?
            </p>
            <p className="text-sm mt-1" style={{ color: '#6B5D55' }}>
              När en sambo avlider kan den efterlevande sambon begära bodelning av <strong>samboegendom</strong>.
              Samboegendom är gemensam bostad och bohag som förvärvats för gemensamt bruk (Sambolagen 3 §).
            </p>
            <p className="text-sm mt-2" style={{ color: '#6B5D55' }}>
              <strong>Vad ingår:</strong> Bostad köpt för att bo i tillsammans, möbler, hushållsapparater och annat
              bohag anskaffat för gemensamt bruk.
            </p>
            <p className="text-sm mt-2" style={{ color: '#6B5D55' }}>
              <strong>Vad ingår INTE:</strong> Egendom som ägdes före förhållandet (om den inte köptes för gemensamt
              bruk), arv, gåvor, bil, aktier, pensioner, fritidshus.
            </p>
          </div>
        </div>

        {/* Sambo info fields */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: 'white', borderColor: '#E8E4DE', borderWidth: '1px' }}
        >
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#8B8680' }}>
            EFTERLEVANDE SAMBONS UPPGIFTER
          </h2>
          <label className="block mb-4">
            <span className="text-sm font-medium mb-1 block" style={{ color: '#2C3E3A' }}>
              Namn
            </span>
            <input
              type="text"
              value={samboName}
              onChange={(e) => setSamboName(e.target.value)}
              placeholder="Förnamn Efternamn"
              className="w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: '#E8E4DE',
                backgroundColor: 'white',
                color: '#2C3E3A',
              }}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium mb-1 block" style={{ color: '#2C3E3A' }}>
              Personnummer
            </span>
            <input
              type="text"
              value={samboPnr}
              onChange={(e) => setSamboPnr(e.target.value)}
              placeholder="ÅÅMMDD-XXXX"
              className="w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: '#E8E4DE',
                backgroundColor: 'white',
                color: '#2C3E3A',
              }}
            />
          </label>
        </div>

        {/* Samboegendom list */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: 'white', borderColor: '#E8E4DE', borderWidth: '1px' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: '#8B8680' }}>
              SAMBOEGENDOM
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ color: '#6B7F5E' }}
            >
              <Plus className="w-4 h-4" />
              Lägg till
            </button>
          </div>

          {samboEgendom.length === 0 && !showAddForm && (
            <p className="text-sm py-4 text-center" style={{ color: '#8B8680' }}>
              Lägg till gemensam bostad och bohag som förvärvats för gemensamt bruk.
            </p>
          )}

          {/* Existing items */}
          {samboEgendom.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 border-b"
              style={{ borderColor: '#E8E4DE' }}
            >
              <div className="flex items-center gap-3">
                {item.typ === 'bostad' ? (
                  <Home className="w-4 h-4 flex-shrink-0" style={{ color: '#6B7F5E' }} />
                ) : (
                  <Sofa className="w-4 h-4 flex-shrink-0" style={{ color: '#6B7F5E' }} />
                )}
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                    {item.beskrivning}
                  </p>
                  <p className="text-xs" style={{ color: '#8B8680' }}>
                    {item.typ === 'bostad' ? 'Bostad' : 'Bohag'} · {item.agareSambo ? 'Sambons' : 'Den avlidnes'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                  {formatSEK(item.varde)}
                </span>
                <button
                  onClick={() => removeEgendom(item.id)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: '#8B8680' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#FFE8E8';
                    (e.currentTarget as HTMLElement).style.color = '#D97706';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#8B8680';
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add form */}
          {showAddForm && (
            <div className="mt-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: '#F7F5F0' }}>
              <label className="block">
                <span className="text-xs font-medium mb-1 block" style={{ color: '#2C3E3A' }}>
                  Beskrivning
                </span>
                <input
                  type="text"
                  value={newItem.beskrivning}
                  onChange={(e) => setNewItem({ ...newItem, beskrivning: e.target.value })}
                  placeholder="T.ex. Lägenhet Storgatan 5 eller Soffa IKEA"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none"
                  style={{
                    borderColor: '#E8E4DE',
                    backgroundColor: 'white',
                    color: '#2C3E3A',
                  }}
                />
              </label>

              <div className="flex gap-3">
                <label className="flex-1">
                  <span className="text-xs font-medium mb-1 block" style={{ color: '#2C3E3A' }}>
                    Typ
                  </span>
                  <select
                    value={newItem.typ}
                    onChange={(e) => setNewItem({ ...newItem, typ: e.target.value as 'bostad' | 'bohag' })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none"
                    style={{
                      borderColor: '#E8E4DE',
                      backgroundColor: 'white',
                      color: '#2C3E3A',
                    }}
                  >
                    <option value="bostad">Bostad</option>
                    <option value="bohag">Bohag</option>
                  </select>
                </label>
                <label className="flex-1">
                  <span className="text-xs font-medium mb-1 block" style={{ color: '#2C3E3A' }}>
                    Värde (SEK)
                  </span>
                  <input
                    type="number"
                    value={newItem.varde}
                    onChange={(e) => setNewItem({ ...newItem, varde: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none"
                    style={{
                      borderColor: '#E8E4DE',
                      backgroundColor: 'white',
                      color: '#2C3E3A',
                    }}
                  />
                </label>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newItem.agareSambo}
                  onChange={(e) => setNewItem({ ...newItem, agareSambo: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ borderColor: '#E8E4DE' }}
                />
                <span className="text-sm" style={{ color: '#2C3E3A' }}>
                  Sambon äger denna egendom
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 px-3 text-sm rounded-lg border transition-colors"
                  style={{
                    borderColor: '#E8E4DE',
                    color: '#2C3E3A',
                  }}
                >
                  Avbryt
                </button>
                <button
                  onClick={addEgendom}
                  disabled={!newItem.beskrivning || !newItem.varde}
                  className={`flex-1 py-2 px-3 text-sm rounded-lg text-white font-medium transition-colors ${
                    !newItem.beskrivning || !newItem.varde ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
                >
                  Lägg till
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sambo calculation result */}
        {samboEgendom.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: 'white', borderColor: '#E8E4DE', borderWidth: '1px' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5" style={{ color: '#6B7F5E' }} />
              <h3 className="font-semibold" style={{ color: '#2C3E3A' }}>
                Bodelningsberäkning
              </h3>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b" style={{ borderColor: '#E8E4DE' }}>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#8B8680' }}>
                  Bostäder
                </span>
                <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                  {formatSEK(samboEgendom.filter((e) => e.typ === 'bostad').reduce((s, e) => s + e.varde, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#8B8680' }}>
                  Bohag
                </span>
                <span className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
                  {formatSEK(samboEgendom.filter((e) => e.typ === 'bohag').reduce((s, e) => s + e.varde, 0))}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: '#E8E4DE' }}>
                <span className="font-semibold" style={{ color: '#2C3E3A' }}>
                  Total samboegendom
                </span>
                <span className="font-bold text-lg" style={{ color: '#2C3E3A' }}>
                  {formatSEK(totalSamboEgendom)}
                </span>
              </div>
            </div>

            <div className="rounded-lg p-3 mb-2" style={{ backgroundColor: '#E8F5E9' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#2E7D32' }}>
                SAMBONS ANDEL (50 %)
              </p>
              <p className="text-lg font-bold" style={{ color: '#2C3E3A' }}>
                {formatSEK(samboAndel)}
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B5D55' }}>
                Sambon får hälften av samboegendomen direkt.
              </p>
            </div>

            <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#FFF3E0' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#E65100' }}>
                TILL DÖDSBOET (50 %)
              </p>
              <p className="text-lg font-bold" style={{ color: '#2C3E3A' }}>
                {formatSEK(dodsboAndel)}
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B5D55' }}>
                Andra hälften går in i dödsboet för arvskifte.
              </p>
            </div>

            {/* Download bodelningsavtal */}
            <button
              onClick={handleDownloadAvtal}
              className="w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
            >
              <Download className="w-4 h-4" />
              Ladda ner bodelningsavtal (.docx)
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 mb-6">
          <Link
            href="/arvskifte"
            className="w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
          >
            Gå till arvskifte <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg p-4" style={{ backgroundColor: '#F3E5F5' }}>
          <p className="text-xs" style={{ color: '#6B5D55' }}>
            Denna beräkning ger en uppskattning. Faktisk bodelning kan påverkas av skulder kopplade till
            samboegendomen, samboavtal, och andra faktorer. En jurist kan hjälpa till med att fastställa exakt vad
            som utgör samboegendom i ert fall.
          </p>
        </div>

      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NOT MARRIED NOR SAMBO
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex flex-col px-5 py-6 pb-24" style={{ backgroundColor: '#F7F5F0' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#6B7F5E' }} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#2C3E3A' }}>
            Bodelning
          </h1>
          <p className="text-sm" style={{ color: '#8B8680' }}>
            Inte aktuell i detta fall
          </p>
        </div>
      </div>

      {/* Mike Ross info */}
      <MikeRossTip
        text="Bodelning görs när den avlidne var gift eller sambo. Eftersom det inte verkar vara aktuellt i det här fallet kan du gå direkt till arvskiftet."
        className="mb-5"
      />

      {/* Info box */}
      <div
        className="flex gap-3 rounded-2xl p-4 mb-6"
        style={{ backgroundColor: '#E8F5E9' }}
      >
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2E7D32' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: '#2C3E3A' }}>
            Bodelning gäller för gifta par och sambor
          </p>
          <p className="text-sm mt-1" style={{ color: '#6B5D55' }}>
            Om den avlidne varken var gift eller sambo går man direkt till arvskifte.
          </p>
          <Link
            href="/arvskifte"
            className="inline-block mt-2 text-sm font-medium transition-colors"
            style={{ color: '#6B7F5E' }}
          >
            Gå till arvskifte →
          </Link>
        </div>
      </div>

    </div>
  );
}

export default function BodelningPage() {
  return (
    <DodsboProvider>
      <BodelningContent />
    </DodsboProvider>
  );
}
