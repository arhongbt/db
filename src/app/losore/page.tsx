'use client';

import { useState, useEffect } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Info,
  AlertCircle,
} from 'lucide-react';

import type { LosoreItem, LosoreCategory } from '@/types';

const CATEGORY_LABELS: Record<LosoreCategory, string> = {
  mobler: 'Möbler',
  smycken: 'Smycken & klockor',
  konst: 'Konst & tavlor',
  elektronik: 'Elektronik',
  fordon: 'Fordon',
  samlarobj: 'Samlarobjekt',
  klader: 'Kläder & textilier',
  ovrigt: 'Övrigt',
};

const CATEGORY_ORDER: LosoreCategory[] = [
  'mobler',
  'smycken',
  'konst',
  'elektronik',
  'fordon',
  'samlarobj',
  'klader',
  'ovrigt',
];

function LosoreContent() {
  const { state, dispatch, loading } = useDodsbo();
  const items = state.losore || [];
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<LosoreCategory>('mobler');
  const [formValue, setFormValue] = useState('');
  const [formAssignedTo, setFormAssignedTo] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Migrate from localStorage on first load
  useEffect(() => {
    if (!loading && items.length === 0) {
      try {
        const stored = localStorage.getItem('dodsbo_losore');
        if (stored) {
          const parsed = JSON.parse(stored) as LosoreItem[];
          if (parsed.length > 0) {
            dispatch({ type: 'SET_LOSORE', payload: parsed });
            localStorage.removeItem('dodsbo_losore');
          }
        }
      } catch { /* ignore */ }
    }
    setMounted(true);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || loading) {
    return (
      <div className="min-h-dvh bg-background p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(amount);

  const totalValue = items.reduce((sum, item) => sum + item.estimatedValue, 0);
  const assignedCount = items.filter(item => item.assignedTo).length;
  const unassignedCount = items.length - assignedCount;

  // Calculate per-delägare breakdown
  const delagareBreakdown = new Map<string, number>();
  items.forEach(item => {
    if (item.assignedTo) {
      const current = delagareBreakdown.get(item.assignedTo) || 0;
      delagareBreakdown.set(item.assignedTo, current + item.estimatedValue);
    }
  });

  // Check fairness
  const assignedValues = Array.from(delagareBreakdown.values());
  const maxValue = assignedValues.length > 0 ? Math.max(...assignedValues) : 0;
  const minValue = assignedValues.length > 0 ? Math.min(...assignedValues) : 0;
  const isFair = assignedValues.length <= 1 || (maxValue > 0 && minValue / maxValue > 0.7);

  const handleAddItem = () => {
    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.formName = 'Namn på föremål krävs';
    if (!formValue || isNaN(Number(formValue)) || Number(formValue) < 0) errs.formValue = 'Ange ett giltigt värde';
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newItem: LosoreItem = {
      id: crypto.randomUUID(),
      name: formName.trim(),
      category: formCategory,
      estimatedValue: parseInt(formValue),
      assignedTo: formAssignedTo || undefined,
      notes: formNotes.trim() || undefined,
    };

    dispatch({ type: 'ADD_LOSORE', payload: newItem });
    setFormName('');
    setFormValue('');
    setFormAssignedTo('');
    setFormNotes('');
    setFormErrors({});
    setShowForm(false);
  };

  const handleDeleteItem = (id: string) => {
    dispatch({ type: 'REMOVE_LOSORE', payload: id });
  };

  const handleUpdateAssignment = (id: string, assignedTo: string | '') => {
    const item = items.find(i => i.id === id);
    if (item) {
      dispatch({ type: 'UPDATE_LOSORE', payload: { ...item, assignedTo: assignedTo || undefined } });
    }
  };

  // Get delagare names
  const delagareNames = state.delagare.map(d => d.name);

  // Group items by category
  const itemsByCategory = new Map<LosoreCategory, LosoreItem[]>();
  CATEGORY_ORDER.forEach(cat => {
    itemsByCategory.set(cat, items.filter(item => item.category === cat));
  });

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-accent mb-4 hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Tillbaka</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-primary">Lösöre</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-light transition-colors"
          aria-label="Lägg till"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/70">
            Lösöre är personliga tillhörigheter som inte är fast egendom. Det kan vara möbler, smycken, konst, bilar, och andra fysiska föremål.
          </p>
        </div>
      </div>

      {/* Summary card */}
      {items.length > 0 && (
        <div className="card mb-6">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-xs text-muted uppercase mb-1">Föremål</p>
              <p className="text-lg font-bold text-primary">{items.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted uppercase mb-1">Totalt värde</p>
              <p className="text-lg font-bold text-success">{formatSEK(totalValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted uppercase mb-1">Tilldelad</p>
              <p className="text-lg font-bold text-primary">{assignedCount}/{items.length}</p>
            </div>
          </div>

          {/* Fairness indicator */}
          {assignedCount > 0 && delagareNames.length > 1 && (
            <div className={`flex items-center gap-2 p-3 rounded-card ${
              isFair ? 'bg-success/10' : 'bg-yellow-50'
            }`}>
              <AlertCircle className={`w-4 h-4 flex-shrink-0 ${
                isFair ? 'text-success' : 'text-yellow-600'
              }`} />
              <p className={`text-xs font-medium ${
                isFair ? 'text-success' : 'text-yellow-700'
              }`}>
                {isFair
                  ? 'Fördelningen verkar rättvis'
                  : 'Ojämn fördelning — några får mycket mer än andra'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Per-delägare breakdown */}
      {delagareBreakdown.size > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-primary mb-3">Tilldelning per delägare</h3>
          <div className="space-y-2">
            {delagareNames.map(name => {
              const value = delagareBreakdown.get(name) ?? 0;
              const itemCount = items.filter(i => i.assignedTo === name).length;
              return (
                <div key={name} className="flex items-center justify-between p-2 bg-white rounded-card">
                  <span className="text-sm text-primary font-medium">{name}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{formatSEK(value)}</p>
                    <p className="text-xs text-muted">{itemCount} föremål</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="card border-2 border-accent mb-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Lägg till föremål</h3>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Namn på föremål *</span>
            <input
              type="text"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                setFormErrors(p => ({ ...p, formName: '' }));
              }}
              placeholder="T.ex. Soffa, Guldring, Tavla"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors bg-white ${
                formErrors.formName ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'
              }`}
            />
            {formErrors.formName && <span className="text-xs text-warn mt-1 block">{formErrors.formName}</span>}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Kategori *</span>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as LosoreItem['category'])}
              className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-xl focus:border-accent focus:outline-none transition-colors"
            >
              {CATEGORY_ORDER.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Uppskattat värde (kr) *</span>
            <input
              type="number"
              value={formValue}
              onChange={(e) => {
                setFormValue(e.target.value);
                setFormErrors(p => ({ ...p, formValue: '' }));
              }}
              placeholder="0"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors bg-white ${
                formErrors.formValue ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'
              }`}
            />
            {formErrors.formValue && <span className="text-xs text-warn mt-1 block">{formErrors.formValue}</span>}
          </label>

          {delagareNames.length > 0 && (
            <label className="block mb-4">
              <span className="text-sm font-medium text-primary mb-1 block">Tilldelad till (valfritt)</span>
              <select
                value={formAssignedTo}
                onChange={(e) => setFormAssignedTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-xl focus:border-accent focus:outline-none transition-colors"
              >
                <option value="">— Ej tilldelad —</option>
                {delagareNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
          )}

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Anteckningar (valfritt)</span>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="T.ex. Märkning, skick, särskilda instruktioner..."
              className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-xl focus:border-accent focus:outline-none transition-colors min-h-[80px]"
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setFormErrors({});
              }}
              className="btn-secondary flex-1"
            >
              Avbryt
            </button>
            <button
              onClick={handleAddItem}
              disabled={!formName.trim() || !formValue}
              className="btn-primary flex-1"
            >
              Lägg till
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-medium text-primary mb-2">
            Inga föremål ännu
          </h2>
          <p className="text-muted text-sm max-w-xs">
            Det är okej att ta det i din takt. Lägg till föremål när du känner dig redo.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORY_ORDER.map(category => {
            const categoryItems = itemsByCategory.get(category) || [];
            if (categoryItems.length === 0) return null;

            const categoryTotal = categoryItems.reduce((sum, item) => sum + item.estimatedValue, 0);

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-primary">{CATEGORY_LABELS[category]}</h3>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success">{formatSEK(categoryTotal)}</p>
                    <p className="text-xs text-muted">{categoryItems.length} st</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {categoryItems.map(item => (
                    <div key={item.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-primary">{item.name}</p>
                          {item.notes && <p className="text-xs text-muted mt-1">{item.notes}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-warn transition-colors flex-shrink-0"
                          aria-label={`Ta bort ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-success">{formatSEK(item.estimatedValue)}</p>
                      </div>

                      {delagareNames.length > 0 && (
                        <select
                          value={item.assignedTo || ''}
                          onChange={(e) => handleUpdateAssignment(item.id, e.target.value)}
                          className="w-full px-3 py-2 border border-[#E8E4DE] rounded-lg text-sm focus:border-accent focus:outline-none transition-colors"
                        >
                          <option value="">— Ej tilldelad —</option>
                          {delagareNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      )}

                      {item.assignedTo && (
                        <p className="text-xs text-primary/70 mt-2">
                          Tilldelad: <span className="font-medium">{item.assignedTo}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legal note */}
      <div className="info-box mt-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-primary/70">
            <span className="font-semibold">Juridisk anmärkning:</span> Lösöre ska tas upp i bouppteckningen (ÄB 20 kap. 4 §). Värdet uppskattas till försäljningsvärdet.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function LosoreePage() {
  return (
    <DodsboProvider>
      <LosoreContent />
    </DodsboProvider>
  );
}
