'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import {
  Plus,
  X,
  Trash2,
  Info,
  Download,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import type { Dodsbo } from '@/types';

// Category types and metadata
type VarderingCategory =
  | 'mobler'
  | 'smycken'
  | 'konst'
  | 'elektronik'
  | 'fordon'
  | 'samlarobj'
  | 'klader'
  | 'ovrigt';

type ConditionLevel = 'mint' | 'good' | 'used' | 'worn';

interface VarderingItem {
  id: string;
  description: string;
  category: VarderingCategory;
  purchasePrice?: number;
  purchaseYear?: number;
  condition: ConditionLevel;
  suggestedValue: number;
  overrideValue?: number;
  photoReference?: string;
  notes?: string;
}

const CATEGORY_INFO: Record<
  VarderingCategory,
  {
    label: string;
    depreciation: string;
    minValue: number;
    guidance: string;
  }
> = {
  mobler: {
    label: 'Möbler',
    depreciation: '~10% per år, min 10% av inköpspris',
    minValue: 0.1,
    guidance:
      'Möbler värderas baserat på ålder, skick och marknadsvärde. Gamla möbler kan ha antikvärde.',
  },
  smycken: {
    label: 'Smycken & klockor',
    depreciation: 'Håller ofta värde, kan stiga',
    minValue: 0,
    guidance:
      'Värderas efter material, vikt och märke. Rekommenderas att få värdering från guldsmed vid värde >2000 kr.',
  },
  konst: {
    label: 'Konst & antikviteter',
    depreciation: 'Mycket varierande, kan stiga kraftigt',
    minValue: 0,
    guidance:
      'Konstens värde är svåruppskattad. Rekommenderas professionell värdering om värde >10 000 kr.',
  },
  elektronik: {
    label: 'Elektronik',
    depreciation: '~25% per år, min 5% av inköpspris',
    minValue: 0.05,
    guidance:
      'Elektronik deprecieras snabbt. Är ofta värd mycket mindre än inköpspriset. Sällan värd >5% efter 5 år.',
  },
  fordon: {
    label: 'Fordon',
    depreciation: 'Se Skatteverkets prislistor eller bilpriser.se',
    minValue: 0.05,
    guidance:
      'Använd Skatteverkets eller BilpriserSE för aktuell marknadsvärde. Viktigt att ha rätt värde för skattedeklaration.',
  },
  samlarobj: {
    label: 'Samlingar (frimärken, mynt, böcker)',
    depreciation: 'Mycket varierande',
    minValue: 0,
    guidance:
      'Värde beror på sällanhet och tillstånd. Många samlingar värd mycket mindre än vad samlaren trodde.',
  },
  klader: {
    label: 'Kläder & textil',
    depreciation: 'Ofta minimal värde',
    minValue: 0,
    guidance:
      'Kläder värderas mycket lågt på andrahandsmarknaden. Oftast bara värda 5-10% av inköpspriset.',
  },
  ovrigt: {
    label: 'Övrigt',
    depreciation: 'Varierande',
    minValue: 0,
    guidance: 'Värderas efter marknadsvärde — vad en annan privatperson rimligen skulle betala.',
  },
};

const CONDITION_MODIFIERS: Record<ConditionLevel, number> = {
  mint: 1.0,
  good: 0.75,
  used: 0.5,
  worn: 0.25,
};

const CONDITION_LABELS: Record<ConditionLevel, string> = {
  mint: 'Nyskick',
  good: 'Bra skick',
  used: 'Använt',
  worn: 'Slitet',
};

// Depreciation calculator
function calculateSuggestedValue(
  category: VarderingCategory,
  purchasePrice: number | undefined,
  purchaseYear: number | undefined,
  condition: ConditionLevel
): number {
  // If no purchase info, return 0
  if (!purchasePrice || !purchaseYear) {
    return 0;
  }

  const currentYear = new Date().getFullYear();
  const ageYears = currentYear - purchaseYear;

  let depreciationRate = 0.1; // Default 10%
  let minValue = 0.1; // 10% minimum

  if (category === 'elektronik') {
    depreciationRate = 0.25;
    minValue = 0.05;
  } else if (category === 'fordon') {
    depreciationRate = 0.15;
    minValue = 0.05;
  } else if (
    category === 'smycken' ||
    category === 'konst' ||
    category === 'samlarobj'
  ) {
    // These may appreciate or hold value
    depreciationRate = 0;
    minValue = 0;
  }

  let value = purchasePrice;

  // Apply annual depreciation
  for (let i = 0; i < ageYears; i++) {
    value *= 1 - depreciationRate;
  }

  // Apply minimum value floor
  if (minValue > 0) {
    value = Math.max(value, purchasePrice * minValue);
  }

  // Apply condition modifier
  value *= CONDITION_MODIFIERS[condition];

  return Math.round(value);
}

function VarderingContent() {
  const { t } = useLanguage();
  const [items, setItems] = useState<VarderingItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('vardering_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<VarderingCategory | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    description: '',
    category: 'mobler' as VarderingCategory,
    purchasePrice: '',
    purchaseYear: '',
    condition: 'good' as ConditionLevel,
    photoReference: '',
    notes: '',
  });

  // Save to localStorage whenever items change
  const saveItems = (newItems: VarderingItem[]) => {
    setItems(newItems);
    localStorage.setItem('vardering_items', JSON.stringify(newItems));
  };

  const handleAddItem = () => {
    const errs: Record<string, string> = {};
    if (!formData.description.trim()) errs.description = 'Beskrivning krävs';
    if (
      formData.purchasePrice &&
      (isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) < 0)
    ) {
      errs.purchasePrice = 'Ange ett giltigt inköpspris';
    }
    if (
      formData.purchaseYear &&
      (isNaN(Number(formData.purchaseYear)) ||
        Number(formData.purchaseYear) < 1950 ||
        Number(formData.purchaseYear) > new Date().getFullYear())
    ) {
      errs.purchaseYear = 'Ange ett giltigt år';
    }
    setFormErrors(errs);

    if (Object.keys(errs).length > 0) return;

    const purchasePrice = formData.purchasePrice
      ? parseInt(formData.purchasePrice)
      : undefined;
    const purchaseYear = formData.purchaseYear
      ? parseInt(formData.purchaseYear)
      : undefined;

    const suggestedValue = calculateSuggestedValue(
      formData.category,
      purchasePrice,
      purchaseYear,
      formData.condition
    );

    const newItem: VarderingItem = {
      id: crypto.randomUUID(),
      description: formData.description.trim(),
      category: formData.category,
      purchasePrice,
      purchaseYear,
      condition: formData.condition,
      suggestedValue,
      photoReference: formData.photoReference.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    saveItems([...items, newItem]);
    setFormData({
      description: '',
      category: 'mobler',
      purchasePrice: '',
      purchaseYear: '',
      condition: 'good',
      photoReference: '',
      notes: '',
    });
    setFormErrors({});
    setShowForm(false);
  };

  const handleDeleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateValue = (id: string, newValue: number) => {
    saveItems(
      items.map((item) =>
        item.id === id ? { ...item, overrideValue: newValue > 0 ? newValue : undefined } : item
      )
    );
  };

  const formatSEK = (amount: number) =>
    new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(amount);

  const getItemValue = (item: VarderingItem) => item.overrideValue ?? item.suggestedValue;

  const categoryTotals: Record<VarderingCategory, { count: number; value: number }> = {
    mobler: { count: 0, value: 0 },
    smycken: { count: 0, value: 0 },
    konst: { count: 0, value: 0 },
    elektronik: { count: 0, value: 0 },
    fordon: { count: 0, value: 0 },
    samlarobj: { count: 0, value: 0 },
    klader: { count: 0, value: 0 },
    ovrigt: { count: 0, value: 0 },
  };

  items.forEach((item) => {
    categoryTotals[item.category].count += 1;
    categoryTotals[item.category].value += getItemValue(item);
  });

  const grandTotal = items.reduce((sum, item) => sum + getItemValue(item), 0);

  const handleExport = () => {
    const lines = [
      'VÄRDEING AV LÖSÖRE — DÖDSBO',
      new Date().toLocaleDateString('sv-SE'),
      '',
    ];

    Object.entries(CATEGORY_INFO).forEach(([cat, info]) => {
      const catItems = items.filter((item) => item.category === cat as VarderingCategory);
      if (catItems.length > 0) {
        lines.push(`${info.label}:`);
        catItems.forEach((item) => {
          const value = getItemValue(item);
          lines.push(
            `  - ${item.description}: ${formatSEK(value)}${item.notes ? ` (${item.notes})` : ''}`
          );
        });
        lines.push(`  Subtotal ${info.label}: ${formatSEK(categoryTotals[cat as VarderingCategory].value)}`);
        lines.push('');
      }
    });

    lines.push('---');
    lines.push(`TOTALT VÄRDE: ${formatSEK(grandTotal)}`);
    lines.push('');

    if (grandTotal > 50000) {
      lines.push(
        'Notering: Värdet överstiger 50 000 kr. En professionell värdering rekommenderas.'
      );
    }

    lines.push('');
    lines.push(
      'Lösöre värderas till marknadsvärde — vad en annan privatperson rimligen skulle betala.'
    );

    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vardering-losore-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (showForm) {
    return (
      <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-6 py-8 pb-28">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display text-primary">Ny värdering</h1>
          <button
            onClick={() => setShowForm(false)}
            className="p-2 text-muted hover:text-primary transition-colors"
            aria-label="Stäng formulär"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="card border-2 border-accent mb-6" style={{ borderRadius: '28px' }}>
          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">
              Beskrivning *
            </span>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setFormErrors((p) => ({ ...p, description: '' }));
              }}
              placeholder="T.ex. Sofabord i teak från 1970-tal"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-[20px] focus:outline-none bg-white ${
                formErrors.description ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'
              }`}
            />
            {formErrors.description && (
              <span className="text-xs text-warn mt-1 block">{formErrors.description}</span>
            )}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">
              Kategori
            </span>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as VarderingCategory })
              }
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-[20px] focus:outline-none focus:border-accent bg-white"
            >
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">
              Skick
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CONDITION_LABELS) as ConditionLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData({ ...formData, condition: level })}
                  className={`py-2 px-3 rounded-[20px] text-sm font-medium border-2 transition-colors ${
                    formData.condition === level
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-[#E8E4DE] text-muted'
                  }`}
                >
                  {CONDITION_LABELS[level]}
                </button>
              ))}
            </div>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">
              Inköpspris (kr)
            </span>
            <input
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => {
                setFormData({ ...formData, purchasePrice: e.target.value });
                setFormErrors((p) => ({ ...p, purchasePrice: '' }));
              }}
              placeholder="T.ex. 2500"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-[20px] focus:outline-none bg-white ${
                formErrors.purchasePrice ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'
              }`}
            />
            {formErrors.purchasePrice && (
              <span className="text-xs text-warn mt-1 block">{formErrors.purchasePrice}</span>
            )}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">
              Inköpsår
            </span>
            <input
              type="number"
              value={formData.purchaseYear}
              onChange={(e) => {
                setFormData({ ...formData, purchaseYear: e.target.value });
                setFormErrors((p) => ({ ...p, purchaseYear: '' }));
              }}
              placeholder={new Date().getFullYear().toString()}
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-[20px] focus:outline-none bg-white ${
                formErrors.purchaseYear ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'
              }`}
            />
            {formErrors.purchaseYear && (
              <span className="text-xs text-warn mt-1 block">{formErrors.purchaseYear}</span>
            )}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">
              Fotoreferens (filnamn)
            </span>
            <input
              type="text"
              value={formData.photoReference}
              onChange={(e) => setFormData({ ...formData, photoReference: e.target.value })}
              placeholder="T.ex. foto_sofabord_DSC1234.jpg"
              className="w-full min-h-touch px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-[20px] focus:outline-none focus:border-accent bg-white"
            />
            <p className="text-xs text-muted mt-1">
              Lagra foto separat och referera med filnamn
            </p>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">
              Noteringar
            </span>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="T.ex. Litet repor på baksida, dock i gott skick"
              rows={3}
              className="w-full px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-[20px] focus:outline-none focus:border-accent bg-white"
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary flex-1"
            >
              Avbryt
            </button>
            <button
              onClick={handleAddItem}
              disabled={!formData.description.trim()}
              className="btn-primary flex-1"
            >
              Lägg till
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-6 py-8 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display text-primary">Värdering av lösöre</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
          aria-label="Lägg till värdering"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* MikeRossTip */}
      <div className="info-box mb-4">
        <div className="flex gap-2">
          <HelpCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-primary mb-1">Att veta om lösöre:</p>
            <p className="text-sm text-primary/70">
              Lösöre värderas till marknadsvärde — vad en annan privatperson rimligen skulle betala.
              Det är vanligt att värdena är mycket lägre än inköpspriset.
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      {items.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="card text-center py-3">
              <p className="text-xs text-muted uppercase">Antal objekt</p>
              <p className="text-lg font-bold text-primary">{items.length}</p>
            </div>
            <div className="card text-center py-3">
              <p className="text-xs text-muted uppercase">Totalt värde</p>
              <p className="text-lg font-bold text-success">{formatSEK(grandTotal)}</p>
            </div>
          </div>

          {grandTotal > 50000 && (
            <div className="card mb-6" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}>
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary mb-1">
                    Värdet överstiger 50 000 kr
                  </p>
                  <p className="text-xs text-primary/70">
                    En professionell värdering rekommenderas för dessa objekt.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Category sections */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-medium text-primary mb-2">Inga värderingar ännu</h2>
          <p className="text-muted text-sm max-w-xs">
            Börja med att lägga till personliga föremål som möbler, smycken, elektronik
            och annat lösöre.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(Object.entries(CATEGORY_INFO) as Array<
            [VarderingCategory, typeof CATEGORY_INFO[VarderingCategory]]
          >).map(([catKey, catInfo]) => {
            const catItems = items.filter((item) => item.category === catKey);
            if (catItems.length === 0) return null;

            const catTotal = categoryTotals[catKey].value;
            const isExpanded = expandedCategory === catKey;

            return (
              <div key={catKey} className="card">
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : catKey)
                  }
                  className="w-full flex items-center justify-between py-3"
                >
                  <div className="text-left flex-1">
                    <h3 className="font-display text-primary">{catInfo.label}</h3>
                    <p className="text-xs text-muted mt-0.5">{catItems.length} objekt</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className="font-bold text-success text-sm">{formatSEK(catTotal)}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-accent" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-accent" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <>
                    <div className="border-t border-[#E8E4DE] pt-3 mt-3">
                      <p className="text-xs text-muted mb-2 font-medium">
                        Depreciering: {catInfo.depreciation}
                      </p>
                      <p className="text-xs text-primary/70 mb-3">
                        {catInfo.guidance}
                      </p>
                    </div>

                    <div className="space-y-2 mt-3">
                      {catItems.map((item) => {
                        const itemValue = getItemValue(item);
                        const isOverridden = item.overrideValue !== undefined;

                        return (
                          <div
                            key={item.id}
                            className="bg-background p-3 rounded-[20px] border border-[#E8E4DE]"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-primary text-sm">
                                  {item.description}
                                </p>
                                <p className="text-xs text-muted">
                                  {CONDITION_LABELS[item.condition]}
                                  {item.purchaseYear && ` • År ${item.purchaseYear}`}
                                </p>
                                {item.notes && (
                                  <p className="text-xs text-primary/70 mt-1">
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1.5 text-muted hover:text-warn transition-colors flex-shrink-0"
                                aria-label={`Ta bort ${item.description}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 bg-white p-2 rounded-[20px] border border-[#E8E4DE]">
                              <input
                                type="number"
                                value={itemValue}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  handleUpdateValue(item.id, val);
                                }}
                                className="flex-1 bg-transparent text-sm font-semibold text-success focus:outline-none"
                              />
                              <span className="text-xs text-muted flex-shrink-0">
                                kr
                              </span>
                            </div>

                            {!isOverridden && item.suggestedValue > 0 && (
                              <p className="text-xs text-muted/70 mt-1.5">
                                Förslag baserat på depreciering
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Export button */}
      {items.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleExport}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportera som textfil
          </button>
        </div>
      )}

    </div>
  );
}

export default function VarderingPage() {
  return (
    <DodsboProvider>
      <VarderingContent />
    </DodsboProvider>
  );
}
