'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { PaymentFlow } from '@/components/PaymentFlow';
import Link from 'next/link';
import {
  ArrowLeft,
  Receipt,
  Plus,
  Trash2,
  Info,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from 'lucide-react';

import type { Kostnad, KostnadCategory } from '@/types';

const CATEGORY_LABELS: Record<KostnadCategory, string> = {
  begravning: 'Begravning & ceremoni',
  juridik: 'Juridik & bouppteckning',
  vardering: 'Värdering & mäklare',
  stadning: 'Städning & tömning',
  transport: 'Transport & flyttning',
  forvaring: 'Förvaring & magasin',
  fastighet: 'Fastighet & underhåll',
  ovrigt: 'Övrigt',
};

const CATEGORY_ORDER: KostnadCategory[] = [
  'begravning', 'juridik', 'vardering', 'stadning',
  'transport', 'forvaring', 'fastighet', 'ovrigt',
];

const STORAGE_KEY = 'dodsbo_kostnader';

function formatSEK(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency', currency: 'SEK',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}

function KostnaderSkeleton() {
  return (
    <div className="min-h-dvh bg-background p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-8" />
      <div className="h-32 bg-gray-200 rounded-2xl mb-4" />
      <div className="h-24 bg-gray-200 rounded-2xl mb-4" />
      <div className="h-24 bg-gray-200 rounded-2xl" />
    </div>
  );
}

function KostnaderContent() {
  const { state, dispatch, loading } = useDodsbo();
  const { t } = useLanguage();
  const kostnader = state.kostnader || [];
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [expandedCat, setExpandedCat] = useState<KostnadCategory | null>(null);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);

  // Form state
  const [formCategory, setFormCategory] = useState<KostnadCategory>('begravning');
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPaidBy, setFormPaidBy] = useState('');

  // Migrate from localStorage on first load
  useEffect(() => {
    if (!loading && kostnader.length === 0) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Kostnad[];
          if (parsed.length > 0) {
            dispatch({ type: 'SET_KOSTNADER', payload: parsed });
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch { /* ignore */ }
    }
    setMounted(true);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || loading) return <KostnaderSkeleton />;

  const addKostnad = () => {
    if (!formDescription.trim() || !formAmount) return;

    const newItem: Kostnad = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      category: formCategory,
      description: formDescription.trim(),
      amount: parseFloat(formAmount) || 0,
      date: formDate,
      paidBy: formPaidBy.trim() || undefined,
    };

    dispatch({ type: 'ADD_KOSTNAD', payload: newItem });

    // Reset form
    setFormDescription('');
    setFormAmount('');
    setFormPaidBy('');
    setShowForm(false);
  };

  const removeKostnad = (id: string) => {
    dispatch({ type: 'REMOVE_KOSTNAD', payload: id });
  };

  const totalKostnad = kostnader.reduce((sum, k) => sum + k.amount, 0);

  const byCategory = CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      items: kostnader.filter((k) => k.category === cat),
      total: kostnader.filter((k) => k.category === cat).reduce((s, k) => s + k.amount, 0),
    }))
    .filter((g) => g.items.length > 0);

  // Who paid what
  const payers = kostnader.reduce<Record<string, number>>((acc, k) => {
    const payer = k.paidBy || 'Dödsboet';
    acc[payer] = (acc[payer] || 0) + k.amount;
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-dvh px-4 py-5 pb-24">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> {t('Dashboard', 'Dashboard')}
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Receipt className="w-7 h-7 text-accent" />
        <h1 className="text-xl font-display text-primary">{t('Dödsbokostnader', 'Estate costs')}</h1>
      </div>
      <p className="text-muted mb-6">
        {t('Håll koll på alla utgifter som dödsboet har. Dessa dras av före arvskiftet.', 'Keep track of all estate expenses. These are deducted before the distribution of the estate.')}
      </p>

      {showInfo && (
        <div className="info-box mb-6 relative">
          <button onClick={() => setShowInfo(false)} className="absolute top-2 right-2 text-muted hover:text-primary text-xs">✕</button>
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-primary/80">
              <p className="font-medium mb-1">{t('Varför spåra kostnader?', 'Why track expenses?')}</p>
              <p>
                {t('Dödsboets kostnader (begravning, juridik, värdering, städning m.m.) dras av från tillgångarna innan arvet fördelas. Om en dödsbodelägare har lagt ut pengar ska de ersättas av dödsboet. Spara alla kvitton!', 'Estate expenses (funeral, legal, appraisal, cleaning, etc.) are deducted from the assets before the inheritance is distributed. If a co-owner has advanced money, it should be reimbursed from the estate. Keep all receipts!')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Total summary */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">{t('Totala dödsbokostnader', 'Total estate costs')}</p>
            <p className="text-2xl font-bold text-primary">{formatSEK(totalKostnad)}</p>
          </div>
          <p className="text-xs text-muted">{kostnader.length} {t('poster', 'items')}</p>
        </div>
      </div>

      {/* Payment option */}
      {totalKostnad > 0 && (
        <button
          onClick={() => setShowPaymentFlow(true)}
          className="card bg-accent/5 mb-6 flex items-center justify-between hover:bg-accent/10 transition-colors" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}
        >
          <div>
            <p className="font-medium text-accent text-sm">{t('Betala dödsbo kostnader', 'Pay estate costs')}</p>
            <p className="text-xs text-primary/70">{formatSEK(totalKostnad)} {t('via Swish eller kort', 'via Swish or card')}</p>
          </div>
          <Smartphone className="w-5 h-5 text-accent flex-shrink-0" />
        </button>
      )}

      {/* Who paid breakdown */}
      {Object.keys(payers).length > 1 && (
        <div className="card mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-display mb-2">{t('Vem har betalat', 'Who has paid')}</p>
          {Object.entries(payers).map(([name, amount]) => (
            <div key={name} className="flex justify-between py-1 border-b border-[#E8E4DE] last:border-0">
              <span className="text-sm text-primary">{name}</span>
              <span className="text-sm font-medium text-primary">{formatSEK(amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Category breakdown */}
      {byCategory.map((group) => (
        <div key={group.category} className="mb-3">
          <button
            onClick={() => setExpandedCat(expandedCat === group.category ? null : group.category)}
            className="card w-full flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-primary text-sm">{CATEGORY_LABELS[group.category]}</p>
              <p className="text-xs text-muted">{group.items.length} poster</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">{formatSEK(group.total)}</span>
              {expandedCat === group.category
                ? <ChevronUp className="w-4 h-4 text-muted" />
                : <ChevronDown className="w-4 h-4 text-muted" />}
            </div>
          </button>

          {expandedCat === group.category && (
            <div className="mt-1 space-y-1">
              {group.items.map((item) => (
                <div key={item.id} className="card flex items-center justify-between py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary truncate">{item.description}</p>
                    <p className="text-xs text-muted">
                      {new Date(item.date).toLocaleDateString('sv-SE')}
                      {item.paidBy ? ` — ${item.paidBy}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-sm font-medium text-primary whitespace-nowrap">{formatSEK(item.amount)}</span>
                    <button onClick={() => removeKostnad(item.id)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-warn" aria-label={`Ta bort ${item.description}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add form */}
      {showForm ? (
        <div className="card mb-6 space-y-3">
          <h3 className="font-display text-primary text-sm">{t('Lägg till kostnad', 'Add expense')}</h3>

          <div>
            <label className="text-xs text-muted font-medium">{t('Kategori', 'Category')}</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as KostnadCategory)}
              className="w-full px-3 py-2 border border-[#E8E4DE] rounded-2xl text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {CATEGORY_ORDER.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted font-medium">{t('Beskrivning', 'Description')}</label>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder={t('T.ex. Begravningsbyrå Fonus', 'E.g. Funeral home Fonus')}
              className="w-full px-3 py-2 border border-[#E8E4DE] rounded-2xl text-sm mt-1 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted font-medium">{t('Belopp (kr)', 'Amount (SEK)')}</label>
              <input
                type="number"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-[#E8E4DE] rounded-2xl text-sm mt-1 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="text-xs text-muted font-medium">{t('Datum', 'Date')}</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8E4DE] rounded-2xl text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted font-medium">{t('Utlagt av (valfritt)', 'Paid by (optional)')}</label>
            <input
              type="text"
              value={formPaidBy}
              onChange={(e) => setFormPaidBy(e.target.value)}
              placeholder={t('T.ex. Anna Svensson', 'E.g. Anna Svensson')}
              className="w-full px-3 py-2 border border-[#E8E4DE] rounded-2xl text-sm mt-1 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted mt-1">{t('Om en delägare har lagt ut — ska ersättas av dödsboet', 'If a co-owner has advanced money — it should be reimbursed by the estate')}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={addKostnad} className="flex-1 btn-primary text-sm">
              {t('Spara', 'Save')}
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 btn-secondary text-sm">
              {t('Avbryt', 'Cancel')}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 mb-6"
        >
          <Plus className="w-5 h-5" />
          {t('Lägg till kostnad', 'Add expense')}
        </button>
      )}

      <div className="bg-primary-lighter/30 rounded-2xl p-4">
        <p className="text-xs text-muted leading-relaxed">
          {t('Dödsbokostnader dras av från behållningen innan arvet fördelas (ÄB 18 kap.). Begravningskostnader har företräde framför andra skulder. Spara alla kvitton för redovisning i bouppteckningen och arvskiftet.', 'Estate costs are deducted from the assets before the inheritance is distributed (AB Chapter 18). Funeral expenses take precedence over other debts. Keep all receipts for reporting in the estate inventory and distribution.')}
        </p>
      </div>


      {/* Payment Flow Modal */}
      {showPaymentFlow && (
        <PaymentFlow
          amount={totalKostnad}
          description="Dödsbokostnader"
          onComplete={() => {
            setShowPaymentFlow(false);
            alert('Betalningen är genomförd. Tack!');
          }}
          onCancel={() => setShowPaymentFlow(false)}
        />
      )}
    </div>
  );
}

export default function KostnaderPage() {
  return (
    <DodsboProvider>
      <KostnaderContent />
    </DodsboProvider>
  );
}
