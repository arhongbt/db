'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
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
    <div className="flex flex-col px-5 py-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Försäkringar</h1>
          <p className="text-muted text-sm mt-1">
            {state.forsakringar.length > 0
              ? `${contacted}/${state.forsakringar.length} kontaktade`
              : 'Inventera alla försäkringar'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-md"
          aria-label="Lägg till försäkring"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Tip box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Var hittar jag försäkringarna?</p>
            <p className="text-sm text-primary/70 mt-1">
              Kontakta arbetsgivaren, fackförbundet, banken och kontrollera kontoutdrag för
              automatiska dragningar. Minpension.se visar tjänstepension.
            </p>
          </div>
        </div>
      </div>

      {/* Types checklist */}
      {!showForm && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
            Vanliga försäkringstyper att kolla
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

      {/* Added försäkringar */}
      {state.forsakringar.length > 0 && !showForm && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
            Tillagda försäkringar
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
                        Förmånstagare: {f.beneficiary}
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
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
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
                      {f.contacted ? 'Kontaktad' : 'Markera som kontaktad'}
                    </span>
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FORSAKRING', payload: f.id })}
                    className="p-1.5 text-muted hover:text-warn transition-colors"
                    aria-label={`Ta bort ${f.company}`}
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
        <div className="card border-2 border-accent">
          <h3 className="text-lg font-semibold text-primary mb-4">Ny försäkring</h3>

          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">Typ</span>
            <div className="grid grid-cols-2 gap-2">
              {FORSAKRING_TYPES.map((ft) => (
                <button
                  key={ft.value}
                  onClick={() => setFType(ft.value)}
                  className={`py-2 px-3 rounded-card text-sm font-medium border-2 transition-colors ${
                    fType === ft.value
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-gray-200 text-muted'
                  }`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Bolag *</span>
            <input
              type="text"
              value={company}
              onChange={(e) => { setCompany(e.target.value); setFormErrors((p) => ({ ...p, company: '' })); }}
              placeholder="T.ex. Folksam, If, Trygg-Hansa"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none ${formErrors.company ? 'border-warn' : 'border-gray-200 focus:border-accent'}`}
              autoFocus
            />
            {formErrors.company && <span className="text-xs text-warn mt-1 block">{formErrors.company}</span>}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Försäkringsnummer</span>
            <input
              type="text"
              value={policyNr}
              onChange={(e) => setPolicyNr(e.target.value)}
              placeholder="Valfritt"
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Förmånstagare</span>
            <input
              type="text"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="Dödsboet, make/maka, barn..."
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-primary mb-1 block">Uppskattat värde (kr)</span>
            <input
              type="number"
              value={value}
              onChange={(e) => { setValue(e.target.value); setFormErrors((p) => ({ ...p, value: '' })); }}
              placeholder="0"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none ${formErrors.value ? 'border-warn' : 'border-gray-200 focus:border-accent'}`}
            />
            {formErrors.value && <span className="text-xs text-warn mt-1 block">{formErrors.value}</span>}
          </label>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={handleAdd} disabled={!company.trim()} className="btn-primary flex-1">Lägg till</button>
          </div>
        </div>
      )}

      <BottomNav />
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
