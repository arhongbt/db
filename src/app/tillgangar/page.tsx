'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
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
} from 'lucide-react';
import type { Tillgang, TillgangType, Skuld, SkuldType } from '@/types';

const TILLGANG_TYPES: { value: TillgangType; label: string; icon: typeof Wallet }[] = [
  { value: 'bankkonto', label: 'Bankkonto', icon: Landmark },
  { value: 'bostadsratt', label: 'Bostadsrätt', icon: Building2 },
  { value: 'villa', label: 'Villa/hus', icon: Home },
  { value: 'bil', label: 'Bil/fordon', icon: Car },
  { value: 'aktier_fonder', label: 'Aktier & fonder', icon: TrendingUp },
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
  const { state, dispatch } = useDodsbo();
  const [tab, setTab] = useState<'tillgangar' | 'skulder'>('tillgangar');
  const [showForm, setShowForm] = useState(false);

  // Tillgång form
  const [tType, setTType] = useState<TillgangType>('bankkonto');
  const [tDesc, setTDesc] = useState('');
  const [tValue, setTValue] = useState('');
  const [tBank, setTBank] = useState('');

  // Skuld form
  const [sType, setSType] = useState<SkuldType>('bolan');
  const [sCreditor, setSCreditor] = useState('');
  const [sAmount, setSAmount] = useState('');

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
    if (!tDesc.trim()) return;
    const tillgang: Tillgang = {
      id: crypto.randomUUID(),
      type: tType,
      description: tDesc.trim(),
      estimatedValue: tValue ? parseInt(tValue) : undefined,
      bank: tBank.trim() || undefined,
    };
    dispatch({ type: 'ADD_TILLGANG', payload: tillgang });
    setTDesc('');
    setTValue('');
    setTBank('');
    setShowForm(false);
  };

  const handleAddSkuld = () => {
    if (!sCreditor.trim()) return;
    const skuld: Skuld = {
      id: crypto.randomUUID(),
      type: sType,
      creditor: sCreditor.trim(),
      amount: sAmount ? parseInt(sAmount) : undefined,
    };
    dispatch({ type: 'ADD_SKULD', payload: skuld });
    setSCreditor('');
    setSAmount('');
    setShowForm(false);
  };

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-primary">Ekonomi</h1>
        <button
          onClick={() => { setShowForm(true); }}
          className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-light transition-colors"
          aria-label="Lägg till"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card text-center py-3">
          <p className="text-xs text-muted uppercase">Tillgångar</p>
          <p className="text-lg font-bold text-success">{formatSEK(totalTillgangar)}</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-xs text-muted uppercase">Skulder</p>
          <p className="text-lg font-bold text-warn">{formatSEK(totalSkulder)}</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-xs text-muted uppercase">Netto</p>
          <p className={`text-lg font-bold ${netto >= 0 ? 'text-success' : 'text-warn'}`}>
            {formatSEK(netto)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-card p-1 mb-4">
        <button
          onClick={() => { setTab('tillgangar'); setShowForm(false); }}
          className={`flex-1 py-2.5 rounded-card text-sm font-medium transition-colors ${
            tab === 'tillgangar' ? 'bg-white text-primary shadow-sm' : 'text-muted'
          }`}
        >
          Tillgångar ({state.tillgangar.length})
        </button>
        <button
          onClick={() => { setTab('skulder'); setShowForm(false); }}
          className={`flex-1 py-2.5 rounded-card text-sm font-medium transition-colors ${
            tab === 'skulder' ? 'bg-white text-primary shadow-sm' : 'text-muted'
          }`}
        >
          Skulder ({state.skulder.length})
        </button>
      </div>

      {/* Tillgångar list */}
      {tab === 'tillgangar' && !showForm && (
        <>
          {state.tillgangar.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-lg font-medium text-primary mb-2">
                Inga tillgångar ännu
              </h2>
              <p className="text-muted text-sm max-w-xs">
                Lägg till bankkonton, bostad, fordon, aktier och annat som ingår i dödsboet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {state.tillgangar.map((t) => {
                const typeInfo = TILLGANG_TYPES.find((tt) => tt.value === t.type);
                const Icon = typeInfo?.icon ?? Wallet;
                return (
                  <div key={t.id} className="card flex items-center gap-3">
                    <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-primary">{t.description}</p>
                      <p className="text-sm text-muted">{typeInfo?.label}</p>
                    </div>
                    {t.estimatedValue != null && (
                      <p className="font-semibold text-success">{formatSEK(t.estimatedValue)}</p>
                    )}
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
                Inga skulder registrerade
              </h2>
              <p className="text-muted text-sm max-w-xs">
                Lägg till bolån, konsumentlån, kreditkort och andra skulder.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {state.skulder.map((s) => (
                <div key={s.id} className="card flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-warn flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-primary">{s.creditor}</p>
                    <p className="text-sm text-muted">
                      {SKULD_TYPES.find((st) => st.value === s.type)?.label}
                    </p>
                  </div>
                  {s.amount != null && (
                    <p className="font-semibold text-warn">{formatSEK(s.amount)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add forms */}
      {showForm && tab === 'tillgangar' && (
        <div className="card border-2 border-accent">
          <h3 className="text-lg font-semibold text-primary mb-4">Ny tillgång</h3>

          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">Typ</span>
            <div className="grid grid-cols-2 gap-2">
              {TILLGANG_TYPES.map((tt) => (
                <button
                  key={tt.value}
                  onClick={() => setTType(tt.value)}
                  className={`py-2 px-3 rounded-card text-sm font-medium border-2 transition-colors ${
                    tType === tt.value
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-gray-200 text-muted'
                  }`}
                >
                  {tt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Beskrivning *</span>
            <input
              type="text"
              value={tDesc}
              onChange={(e) => setTDesc(e.target.value)}
              placeholder="T.ex. Sparkonto Swedbank"
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Uppskattat värde (kr)</span>
            <input
              type="number"
              value={tValue}
              onChange={(e) => setTValue(e.target.value)}
              placeholder="0"
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={handleAddTillgang} disabled={!tDesc.trim()} className="btn-primary flex-1">Lägg till</button>
          </div>
        </div>
      )}

      {showForm && tab === 'skulder' && (
        <div className="card border-2 border-accent">
          <h3 className="text-lg font-semibold text-primary mb-4">Ny skuld</h3>

          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">Typ</span>
            <div className="grid grid-cols-2 gap-2">
              {SKULD_TYPES.map((st) => (
                <button
                  key={st.value}
                  onClick={() => setSType(st.value)}
                  className={`py-2 px-3 rounded-card text-sm font-medium border-2 transition-colors ${
                    sType === st.value
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-gray-200 text-muted'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Fordringsägare *</span>
            <input
              type="text"
              value={sCreditor}
              onChange={(e) => setSCreditor(e.target.value)}
              placeholder="T.ex. Nordea (bolån)"
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Belopp (kr)</span>
            <input
              type="number"
              value={sAmount}
              onChange={(e) => setSAmount(e.target.value)}
              placeholder="0"
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
            />
          </label>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={handleAddSkuld} disabled={!sCreditor.trim()} className="btn-primary flex-1">Lägg till</button>
          </div>
        </div>
      )}

      <BottomNav />
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
