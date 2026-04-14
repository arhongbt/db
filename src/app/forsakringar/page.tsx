'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import {
  Plus,
  Shield,
  Phone,
  CheckCircle2,
  Circle,
  Info,
  Trash2,
} from 'lucide-react';
import type { Forsakring, ForsakringType } from '@/types';

const FORSAKRING_TYPES: { value: ForsakringType; label: string; tip: string }[] = [
  { value: 'livforsakring', label: 'Livförsäkring', tip: 'Kolla med banken och arbetsgivaren' },
  { value: 'grupplivforsakring', label: 'Grupplivförsäkring', tip: 'Via arbetsgivare eller fack — ofta 1-3 prisbasbelopp' },
  { value: 'tjanstepension', label: 'Tjänstepension', tip: 'Kontakta arbetsgivare eller pensionsbolag (Alecta, AMF, etc.)' },
  { value: 'privat_pension', label: 'Privat pension', tip: 'Kolla med bank och fondbolag' },
  { value: 'hemforsakring', label: 'Hemförsäkring', tip: 'Kan täcka dödsfall, rättshjälp, etc.' },
  { value: 'bilforsakring', label: 'Bilförsäkring', tip: 'Ska sägas upp eller ändras vid ägarbytet' },
  { value: 'olycksfallsforsakring', label: 'Olycksfallsförsäkring', tip: 'Kan ge utbetalning vid dödsfall genom olycka' },
  { value: 'sjukforsakring', label: 'Sjukförsäkring', tip: 'Privat sjukförsäkring — kontrollera villkoren' },
  { value: 'ovrigt', label: 'Övrigt', tip: '' },
];

function ForsakringarContent() {
  const { state, dispatch, loading } = useDodsbo();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [fType, setFType] = useState<ForsakringType>('livforsakring');
  const [company, setCompany] = useState('');
  const [policyNr, setPolicyNr] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [value, setValue] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const contacted = state.forsakringar.filter((f) => f.contacted).length;

  const handleAdd = () => {
    const errs: Record<string, string> = {};
    if (!company.trim()) errs.company = 'Bolagsnamn krävs';
    if (value && (isNaN(Number(value)) || Number(value) < 0)) errs.value = 'Ange ett giltigt belopp';
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const forsakring: Forsakring = {
      id: crypto.randomUUID(),
      type: fType,
      company: company.trim(),
      policyNumber: policyNr.trim() || undefined,
      beneficiary: beneficiary.trim() || undefined,
      estimatedValue: value ? parseInt(value) : undefined,
      contacted: false,
    };
    dispatch({ type: 'ADD_FORSAKRING', payload: forsakring });
    setCompany('');
    setPolicyNr('');
    setBeneficiary('');
    setValue('');
    setFormErrors({});
    setShowForm(false);
  };

  return (
    <div className="flex flex-col px-6 py-8 pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display text-primary">{t('Försäkringar', 'Insurances')}</h1>
          <p className="text-muted text-sm mt-1">
            {state.forsakringar.length > 0
              ? t(`${contacted}/${state.forsakringar.length} kontaktade`, `${contacted}/${state.forsakringar.length} contacted`)
              : t('Inventera alla försäkringar', 'Inventory all insurances')}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
          aria-label={t('Lägg till försäkring', 'Add insurance')}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Tip box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">{t('Var hittar jag försäkringarna?', 'Where do I find the insurances?')}</p>
            <p className="text-sm text-primary/70 mt-1">
              {t('Kontakta arbetsgivaren, fackförbundet, banken och kontrollera kontoutdrag för automatiska dragningar. Minpension.se visar tjänstepension.', 'Contact the employer, the union, the bank and check account statements for automatic deductions. Minpension.se shows occupational pensions.')}
            </p>
          </div>
        </div>
      </div>

      {/* Important tip about employer */}
      <div className="info-box mb-6" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
        <div className="flex gap-2">
          <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">{t('Mike Ross tips: Kontakta arbetsgivaren!', 'Mike Ross tip: Contact the employer!')}</p>
            <p className="text-sm text-primary/70 mt-1">
              {t('Många glömmer att fråga arbetsgivaren om grupplivförsäkring och tjänstepensionsförsäkring. Dessa kan tillsammans vara värda hundratusentals kronor och är mycket viktiga att inventera.', 'Many forget to ask the employer about group life insurance and occupational pension insurance. These together can be worth hundreds of thousands of kronor and are very important to inventory.')}
            </p>
          </div>
        </div>
      </div>

      {/* Insurance categories */}
      <div className="mb-6">
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-3">
          {t('Vilka försäkringar ingår i dödsboet?', 'Which insurances are part of the estate?')}
        </h2>
        <div className="space-y-3">
          <div className="card bg-success/5" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))', border: '1px solid rgba(34,197,94,0.15)' }}>
            <p className="text-sm font-display text-primary mb-2">✓ {t('Försäkringar som ingår i dödsboet', 'Insurances that are part of the estate')}</p>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• <strong>Hemförsäkring</strong> — täcker sakskador på huset/lägenheten</li>
              <li>• <strong>Bilförsäkring</strong> — för fordon i dödsboet</li>
              <li>• <strong>Kapitalförsäkring utan förmånstagare</strong> — blir en del av dödsboet</li>
            </ul>
          </div>
          <div className="card bg-warn/5" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}>
            <p className="text-sm font-display text-primary mb-2">✗ {t('Försäkringar som INTE ingår i dödsboet', 'Insurances that do NOT belong to the estate')}</p>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• <strong>Livförsäkring med förmånstagare</strong> — går direkt till förmånstagaren</li>
              <li>• <strong>Grupplivförsäkring (GFL)</strong> — från arbetsgivare, till förmånstagare</li>
              <li>• <strong>Tjänstepension med förmånstagare</strong> — går till namngiven förmånstagare</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Types checklist */}
      {!showForm && (
        <div className="mb-6">
          <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-3">
            {t('Checklista: Försäkringar att kolla', 'Checklist: Insurances to check')}
          </h2>
          <div className="flex flex-col gap-2">
            {FORSAKRING_TYPES.filter(ft => ft.value !== 'ovrigt').map((ft) => {
              const hasThis = state.forsakringar.some((f) => f.type === ft.value);
              return (
                <div key={ft.value} className="flex items-start gap-3 py-2">
                  {hasThis ? (
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-base ${hasThis ? 'text-primary' : 'text-muted'}`}>
                      {ft.label}
                    </p>
                    {ft.tip && (
                      <p className="text-xs text-muted">{ft.tip}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Begravningshjälp info */}
      {!showForm && (
        <div className="mb-6">
          <div className="info-box">
            <div className="flex gap-2">
              <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">{t('Begravningshjälp via Försäkringskassan', 'Burial assistance via the Social Insurance Agency')}</p>
                <p className="text-sm text-primary/70 mt-1">
                  {t('Alla har rätt till begravningshjälp från staten. År 2024 är det halva prisbasbeloppet, cirka', 'Everyone has the right to burial assistance from the state. In 2024, it is half the price base amount, approximately')} <strong>28 650 kr</strong>. {t('Ansök inom 6 månader efter begravningen.', 'Apply within 6 months after the funeral.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Added försäkringar */}
      {state.forsakringar.length > 0 && !showForm && (
        <div className="mb-6">
          <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-3">
            {t('Tillagda försäkringar', 'Added insurances')}
          </h2>
          <div className="flex flex-col gap-3">
            {state.forsakringar.map((f) => (
              <div key={f.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-primary">{f.company}</p>
                    <p className="text-sm text-muted">
                      {FORSAKRING_TYPES.find((ft) => ft.value === f.type)?.label}
                    </p>
                    {f.beneficiary && (
                      <p className="text-sm text-accent mt-1">
                        {t('Förmånstagare:', 'Beneficiary:')} {f.beneficiary}
                      </p>
                    )}
                  </div>
                  {f.estimatedValue != null && (
                    <p className="font-semibold text-success">
                      {new Intl.NumberFormat('sv-SE', {
                        style: 'currency', currency: 'SEK', maximumFractionDigits: 0,
                      }).format(f.estimatedValue)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E8E4DE]">
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_FORSAKRING_CONTACTED', payload: f.id })}
                    className="flex items-center gap-2"
                  >
                    {f.contacted ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                    <span className={`text-sm ${f.contacted ? 'text-success' : 'text-muted'}`}>
                      {f.contacted ? t('Kontaktad', 'Contacted') : t('Markera som kontaktad', 'Mark as contacted')}
                    </span>
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FORSAKRING', payload: f.id })}
                    className="p-1.5 text-muted hover:text-warn transition-colors"
                    aria-label={t(`Ta bort ${f.company}`, `Remove ${f.company}`)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="card" style={{ borderRadius: '28px' }}>
          <h3 className="text-lg font-display text-primary mb-4">{t('Ny försäkring', 'New insurance')}</h3>

          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">{t('Typ', 'Type')}</span>
            <div className="grid grid-cols-2 gap-2">
              {FORSAKRING_TYPES.map((ft) => (
                <button
                  key={ft.value}
                  onClick={() => setFType(ft.value)}
                  className={`py-2 px-3 rounded-full text-sm font-medium border-2 transition-colors ${
                    fType === ft.value
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-[#E8E4DE] text-muted'
                  }`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Bolag *', 'Company *')}</span>
            <input
              type="text"
              value={company}
              onChange={(e) => { setCompany(e.target.value); setFormErrors((p) => ({ ...p, company: '' })); }}
              placeholder={t('T.ex. Folksam, If, Trygg-Hansa', 'E.g. Folksam, If, Trygg-Hansa')}
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-[20px] focus:outline-none bg-white ${formErrors.company ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
              autoFocus
            />
            {formErrors.company && <span className="text-xs text-warn mt-1 block">{formErrors.company}</span>}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Försäkringsnummer', 'Policy number')}</span>
            <input
              type="text"
              value={policyNr}
              onChange={(e) => setPolicyNr(e.target.value)}
              placeholder="Valfritt"
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Förmånstagare', 'Beneficiary')}</span>
            <input
              type="text"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder={t('Dödsboet, make/maka, barn...', 'The estate, spouse, children...')}
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Uppskattat värde (kr)', 'Estimated value (SEK)')}</span>
            <input
              type="number"
              value={value}
              onChange={(e) => { setValue(e.target.value); setFormErrors((p) => ({ ...p, value: '' })); }}
              placeholder="0"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-[20px] focus:outline-none bg-white ${formErrors.value ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
            />
            {formErrors.value && <span className="text-xs text-warn mt-1 block">{formErrors.value}</span>}
          </label>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('Avbryt', 'Cancel')}</button>
            <button onClick={handleAdd} disabled={!company.trim()} className="btn-primary flex-1">{t('Lägg till', 'Add')}</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ForsakringarPage() {
  return (
    <DodsboProvider>
      <ForsakringarContent />
    </DodsboProvider>
  );
}
