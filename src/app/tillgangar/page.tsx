'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
// Decorations removed — caused z-index/visibility bugs on mobile
import {
  Plus,
  X,
  Wallet,
  Building2,
  Car,
  TrendingUp,
  Home,
  CreditCard,
  Landmark,
  Package,
  Trash2,
  Info,
  CheckCircle2,
  Bitcoin,
} from 'lucide-react';
import type { Tillgang, TillgangType, Skuld, SkuldType } from '@/types';

const TILLGANG_TYPES: { value: TillgangType; label: string; icon: typeof Wallet }[] = [
  { value: 'bankkonto', label: 'Bankkonto', icon: Landmark },
  { value: 'bostadsratt', label: 'Bostadsrätt', icon: Building2 },
  { value: 'villa', label: 'Villa/Småhus', icon: Home },
  { value: 'jordbruksfastighet', label: 'Jordbruk/Skog', icon: Home },
  { value: 'fritidshus', label: 'Fritidshus/Sommarstuga', icon: Home },
  { value: 'bil', label: 'Bil/fordon', icon: Car },
  { value: 'aktier_fonder', label: 'Aktier & fonder', icon: TrendingUp },
  { value: 'kryptovalutor', label: 'Kryptovalutor', icon: Bitcoin },
  { value: 'forsakring', label: 'Försäkring', icon: Package },
  { value: 'losore', label: 'Lösöre', icon: Package },
  { value: 'ovrigt', label: 'Övrigt', icon: Wallet },
];

const SKULD_TYPES: { value: SkuldType; label: string }[] = [
  { value: 'bolan', label: 'Bolån' },
  { value: 'konsumentlan', label: 'Konsumentlån' },
  { value: 'kreditkort', label: 'Kreditkort' },
  { value: 'skatteskuld', label: 'Skatteskuld' },
  { value: 'begravningskostnad', label: 'Begravningskostnad' },
  { value: 'ovrigt', label: 'Övrigt' },
];

function TillgangarContent() {
  const { state, dispatch, loading } = useDodsbo();
  const { t } = useLanguage();
  const [tab, setTab] = useState<'tillgangar' | 'skulder'>('tillgangar');
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Tillgång form
  const [tType, setTType] = useState<TillgangType>('bankkonto');
  const [tDesc, setTDesc] = useState('');
  const [tValue, setTValue] = useState('');
  const [tBank, setTBank] = useState('');
  const [tTaxeringsvarde, setTTaxeringsvarde] = useState('');

  // Skuld form
  const [sType, setSType] = useState<SkuldType>('bolan');
  const [sCreditor, setSCreditor] = useState('');
  const [sAmount, setSAmount] = useState('');

  if (loading) {
    return (
      <div className="min-h-dvh bg-background p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const totalTillgangar = state.tillgangar.reduce(
    (sum, t) => sum + (t.estimatedValue ?? 0),
    0
  );
  const totalSkulder = state.skulder.reduce(
    (sum, s) => sum + (s.amount ?? 0),
    0
  );
  const netto = totalTillgangar - totalSkulder;

  const handleAddTillgang = () => {
    const errs: Record<string, string> = {};
    if (!tDesc.trim()) errs.tDesc = 'Beskrivning krävs';
    if (tValue && (isNaN(Number(tValue)) || Number(tValue) < 0)) errs.tValue = 'Ange ett giltigt belopp';
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const tillgang: Tillgang = {
      id: crypto.randomUUID(),
      type: tType,
      description: tDesc.trim(),
      estimatedValue: tValue ? parseInt(tValue) : undefined,
      taxeringsvarde: tTaxeringsvarde ? parseInt(tTaxeringsvarde) : undefined,
      bank: tBank.trim() || undefined,
    };
    dispatch({ type: 'ADD_TILLGANG', payload: tillgang });
    setTDesc('');
    setTValue('');
    setTBank('');
    setTTaxeringsvarde('');
    setFormErrors({});
    setShowForm(false);
  };

  const handleAddSkuld = () => {
    const errs: Record<string, string> = {};
    if (!sCreditor.trim()) errs.sCreditor = 'Fordringsägare krävs';
    if (sAmount && (isNaN(Number(sAmount)) || Number(sAmount) < 0)) errs.sAmount = 'Ange ett giltigt belopp';
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const skuld: Skuld = {
      id: crypto.randomUUID(),
      type: sType,
      creditor: sCreditor.trim(),
      amount: sAmount ? parseInt(sAmount) : undefined,
    };
    dispatch({ type: 'ADD_SKULD', payload: skuld });
    setSCreditor('');
    setSAmount('');
    setFormErrors({});
    setShowForm(false);
  };

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex flex-col px-5 py-6 pb-24">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-primary">{t('Ekonomi', 'Finances')}</h1>
        <button
          onClick={() => { setShowForm(true); }}
          className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-light transition-colors"
          aria-label={t('Lägg till', 'Add')}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Disclaimer */}
      <div className="info-box mb-4">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/70">
            {t('Ange uppskattade värden per dödsdagen. Bankerna skickar saldobesked — exakta belopp kan uppdateras senare.', 'Enter estimated values as of the date of death. Banks will send account statements — exact amounts can be updated later.')}
          </p>
        </div>
      </div>

      {/* Crypto guide link if crypto assets present */}
      {state.tillgangar.some((t) => t.type === 'kryptovalutor') && (
        <div className="card border-l-4 border-accent mb-6 bg-accent/5">
          <div className="flex gap-3">
            <Bitcoin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-primary font-medium mb-2">
                Du har kryptovalutor registrerade
              </p>
              <p className="text-xs text-primary/70 mb-3">
                Kryptohantering kräver teknisk kunskap. Läs vår guide för att hitta privata nycklar, säker överflytt och skatteregler.
              </p>
              <a
                href="/krypto-guide"
                className="text-accent font-medium text-sm hover:underline inline-block"
              >
                Läs vår kryptoguide →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6" role="group" aria-label={t('Ekonomisk sammanfattning', 'Financial summary')}>
        <div className="card text-center py-3" aria-label={t(`Totala tillgångar: ${formatSEK(totalTillgangar)}`, `Total assets: ${formatSEK(totalTillgangar)}`)}>
          <p className="text-xs text-muted uppercase">{t('Tillgångar', 'Assets')}</p>
          <p className="text-lg font-bold text-success">{formatSEK(totalTillgangar)}</p>
        </div>
        <div className="card text-center py-3" aria-label={t(`Totala skulder: ${formatSEK(totalSkulder)}`, `Total debts: ${formatSEK(totalSkulder)}`)}>
          <p className="text-xs text-muted uppercase">{t('Skulder', 'Debts')}</p>
          <p className="text-lg font-bold text-warn">{formatSEK(totalSkulder)}</p>
        </div>
        <div className="card text-center py-3" aria-label={t(`Nettovärde: ${formatSEK(netto)}`, `Net value: ${formatSEK(netto)}`)}>
          <p className="text-xs text-muted uppercase">{t('Netto', 'Net')}</p>
          <p className={`text-lg font-bold ${netto >= 0 ? 'text-success' : 'text-warn'}`}>
            {formatSEK(netto)}
          </p>
        </div>
      </div>

      {/* Reassurance banner when netto < 0 */}
      {netto < 0 && (
        <div className="card border-l-4 border-success mb-6 bg-success/5">
          <div className="flex gap-3">
            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-primary mb-3">{t('Du ärver INTE skulder', 'You do NOT inherit debts')}</h3>
              <p className="text-sm text-primary/80 mb-3">
                {t('I Sverige ärver man aldrig skulder. Dödsboets skulder betalas med dödsboets tillgångar. Om skulderna överstiger tillgångarna försvinner resten — du behöver inte betala ur egen ficka.', 'In Sweden, you never inherit debts. The estate\'s debts are paid from the estate\'s assets. If the debts exceed the assets, the remainder disappears — you don\'t need to pay from your own pocket.')}
              </p>
              <p className="text-sm text-primary/80 mb-4">
                {t('Om dödsboet saknar tillgångar kan du göra en dödsboanmälan istället för bouppteckning.', 'If the estate lacks assets, you can file an estate notification instead of an inventory.')}
              </p>
              <a
                href="/dodsboanmalan"
                className="text-accent font-medium text-sm hover:underline inline-block mb-4"
              >
                {t('Gå till dödsboanmälan →', 'Go to estate notification →')}
              </a>
              <div className="pt-3 border-t border-[#E8E4DE]">
                <p className="text-xs text-muted">
                  <span className="font-medium">Vid frågor om skulder:</span> Kronofogden <br />
                  <a href="tel:0771737300" className="text-accent hover:underline">0771-73 73 00</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-background rounded-card p-1 mb-4">
        <button
          onClick={() => { setTab('tillgangar'); setShowForm(false); }}
          className={`flex-1 py-2.5 rounded-card text-sm font-medium transition-colors ${
            tab === 'tillgangar' ? 'bg-white text-primary shadow-sm' : 'text-muted'
          }`}
        >
          {t('Tillgångar', 'Assets')} ({state.tillgangar.length})
        </button>
        <button
          onClick={() => { setTab('skulder'); setShowForm(false); }}
          className={`flex-1 py-2.5 rounded-card text-sm font-medium transition-colors ${
            tab === 'skulder' ? 'bg-white text-primary shadow-sm' : 'text-muted'
          }`}
        >
          {t('Skulder', 'Debts')} ({state.skulder.length})
        </button>
      </div>

      {/* Tillgångar list */}
      {tab === 'tillgangar' && !showForm && (
        <>
          {state.tillgangar.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-lg font-medium text-primary mb-2">
                {t('Inga tillgångar ännu', 'No assets yet')}
              </h2>
              <p className="text-muted text-sm max-w-xs">
                {t('Du kan lägga till bankkonton, bostad och annat när du har fått översikt. Det behöver inte ske på en gång.', 'You can add bank accounts, properties and more when you have an overview. It doesn\'t have to happen all at once.')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3" role="list">
              {state.tillgangar.map((t) => {
                const typeInfo = TILLGANG_TYPES.find((tt) => tt.value === t.type);
                const Icon = typeInfo?.icon ?? Wallet;
                return (
                  <div key={t.id} className="card flex items-center gap-3" role="listitem" aria-label={`${t.description}, ${typeInfo?.label}${t.estimatedValue ? `, värde: ${formatSEK(t.estimatedValue)}` : ''}`}>
                    <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-primary">{t.description}</p>
                      <p className="text-sm text-muted">{typeInfo?.label}</p>
                    </div>
                    {t.estimatedValue != null && (
                      <p className="font-semibold text-success text-sm">{formatSEK(t.estimatedValue)}</p>
                    )}
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_TILLGANG', payload: t.id })}
                      className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-warn transition-colors"
                      aria-label={`Ta bort ${t.description}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Skulder list */}
      {tab === 'skulder' && !showForm && (
        <>
          {state.skulder.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-lg font-medium text-primary mb-2">
                {t('Inga skulder registrerade', 'No debts registered')}
              </h2>
              <p className="text-muted text-sm max-w-xs">
                {t('Lägg till bolån, konsumentlån, kreditkort och andra skulder.', 'Add mortgages, consumer loans, credit cards and other debts.')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3" role="list">
              {state.skulder.map((s) => (
                <div key={s.id} className="card flex items-center gap-3" role="listitem" aria-label={`${s.creditor}, ${SKULD_TYPES.find((st) => st.value === s.type)?.label}${s.amount ? `, belopp: ${formatSEK(s.amount)}` : ''}`}>
                  <CreditCard className="w-5 h-5 text-warn flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary">{s.creditor}</p>
                    <p className="text-sm text-muted truncate">
                      {SKULD_TYPES.find((st) => st.value === s.type)?.label}
                    </p>
                  </div>
                  {s.amount != null && (
                    <p className="font-semibold text-warn text-sm">{formatSEK(s.amount)}</p>
                  )}
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_SKULD', payload: s.id })}
                    className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-warn transition-colors"
                    aria-label={`Ta bort ${s.creditor}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add forms */}
      {showForm && tab === 'tillgangar' && (
        <div className="card border-2 border-accent">
          <h3 className="text-lg font-semibold text-primary mb-4">{t('Ny tillgång', 'New asset')}</h3>

          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">{t('Typ', 'Type')}</span>
            <div className="grid grid-cols-2 gap-2">
              {TILLGANG_TYPES.map((tt) => (
                <button
                  key={tt.value}
                  onClick={() => setTType(tt.value)}
                  className={`py-2 px-3 rounded-card text-sm font-medium border-2 transition-colors ${
                    tType === tt.value
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-[#E8E4DE] text-muted'
                  }`}
                >
                  {tt.label}
                </button>
              ))}
            </div>
            {tType === 'forsakring' && (
              <p className="text-xs text-muted mt-2 bg-background p-2 rounded border border-[#E8E4DE]">
                {t('Försäkringar med namngiven förmånstagare ingår oftast INTE i dödsboet. Kontrollera med försäkringsbolaget.', 'Insurances with a named beneficiary usually do NOT belong to the estate. Check with the insurance company.')}
              </p>
            )}
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Beskrivning *', 'Description *')}</span>
            <input
              type="text"
              value={tDesc}
              onChange={(e) => { setTDesc(e.target.value); setFormErrors((p) => ({ ...p, tDesc: '' })); }}
              placeholder={t('T.ex. Sparkonto Swedbank', 'E.g. Savings account Swedbank')}
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none bg-white ${formErrors.tDesc ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
            />
            {formErrors.tDesc && <span className="text-xs text-warn mt-1 block">{formErrors.tDesc}</span>}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Uppskattat värde (kr)', 'Estimated value (SEK)')}</span>
            <input
              type="number"
              value={tValue}
              onChange={(e) => { setTValue(e.target.value); setFormErrors((p) => ({ ...p, tValue: '' })); }}
              placeholder="0"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none bg-white ${formErrors.tValue ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
            />
            {formErrors.tValue && <span className="text-xs text-warn mt-1 block">{formErrors.tValue}</span>}
          </label>

          {['bostadsratt', 'villa', 'jordbruksfastighet', 'fritidshus'].includes(tType) && (
            <label className="block mb-4">
              <span className="text-sm font-medium text-primary mb-1 block">{t('Taxeringsvärde (kr)', 'Assessed value (SEK)')}</span>
              <input
                type="number"
                value={tTaxeringsvarde}
                onChange={(e) => { setTTaxeringsvarde(e.target.value); }}
                placeholder="0"
                className="w-full min-h-touch px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-card focus:outline-none focus:border-accent"
              />
              <p className="text-xs text-muted mt-1">{t('Taxeringsvärdet finns på Skatteverket.se eller senaste fastighetstaxeringen.', 'The assessed value is found on Skatteverket.se or the latest property valuation.')}</p>
            </label>
          )}

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('Avbryt', 'Cancel')}</button>
            <button onClick={handleAddTillgang} disabled={!tDesc.trim()} className="btn-primary flex-1">{t('Lägg till', 'Add')}</button>
          </div>
        </div>
      )}

      {showForm && tab === 'skulder' && (
        <div className="card border-2 border-accent">
          <h3 className="text-lg font-semibold text-primary mb-4">{t('Ny skuld', 'New debt')}</h3>

          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">{t('Typ', 'Type')}</span>
            <div className="grid grid-cols-2 gap-2">
              {SKULD_TYPES.map((st) => (
                <button
                  key={st.value}
                  onClick={() => setSType(st.value)}
                  className={`py-2 px-3 rounded-card text-sm font-medium border-2 transition-colors ${
                    sType === st.value
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-[#E8E4DE] text-muted'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Fordringsägare *', 'Creditor *')}</span>
            <input
              type="text"
              value={sCreditor}
              onChange={(e) => { setSCreditor(e.target.value); setFormErrors((p) => ({ ...p, sCreditor: '' })); }}
              placeholder={t('T.ex. Nordea (bolån)', 'E.g. Nordea (mortgage)')}
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none bg-white ${formErrors.sCreditor ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
            />
            {formErrors.sCreditor && <span className="text-xs text-warn mt-1 block">{formErrors.sCreditor}</span>}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Belopp (kr)', 'Amount (SEK)')}</span>
            <input
              type="number"
              value={sAmount}
              onChange={(e) => { setSAmount(e.target.value); setFormErrors((p) => ({ ...p, sAmount: '' })); }}
              placeholder="0"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none bg-white ${formErrors.sAmount ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
            />
            {formErrors.sAmount && <span className="text-xs text-warn mt-1 block">{formErrors.sAmount}</span>}
          </label>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('Avbryt', 'Cancel')}</button>
            <button onClick={handleAddSkuld} disabled={!sCreditor.trim()} className="btn-primary flex-1">{t('Lägg till', 'Add')}</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function TillgangarPage() {
  return (
    <DodsboProvider>
      <TillgangarContent />
    </DodsboProvider>
  );
}
