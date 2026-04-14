'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Info,
  AlertCircle,
  Camera,
  X,
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
  const { t } = useLanguage();
  const items = state.losore || [];
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<LosoreCategory>('mobler');
  const [formValue, setFormValue] = useState('');
  const [formAssignedTo, setFormAssignedTo] = useState('');
  const [formTilldeladTill, setFormTilldeladTill] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
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

  // Image compression utility
  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Resize to max 800px width
          if (width > 800) {
            height = (height * 800) / width;
            width = 800;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Compress to max 200KB
          let quality = 0.8;
          let result = canvas.toDataURL('image/jpeg', quality);

          while (result.length > 200 * 1024 && quality > 0.1) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(result);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setFormImageUrl(compressed);
    } catch (err) {
      console.error('Failed to compress image:', err);
      setFormErrors(p => ({ ...p, image: 'Failed to process image' }));
    }

    // Reset input
    e.target.value = '';
  };

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
      tilldeladTill: formTilldeladTill || undefined,
      notes: formNotes.trim() || undefined,
      imageUrl: formImageUrl || undefined,
    };

    dispatch({ type: 'ADD_LOSORE', payload: newItem });
    setFormName('');
    setFormValue('');
    setFormAssignedTo('');
    setFormTilldeladTill('');
    setFormNotes('');
    setFormImageUrl(null);
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
    <div className="flex flex-col px-6 py-8 pb-28">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-accent mb-4 hover:text-primary transition-colors w-fit rounded-full"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">{t('Tillbaka', 'Back')}</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display text-primary">{t('Lösöre', 'Personal property')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-light transition-colors"
          style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
          aria-label={t('Lägg till', 'Add')}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Info box */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/70">
            {t('Lösöre är personliga tillhörigheter som inte är fast egendom. Det kan vara möbler, smycken, konst, bilar, och andra fysiska föremål.', 'Personal property is personal possessions that are not real estate. It can be furniture, jewelry, art, cars, and other physical objects.')}
          </p>
        </div>
      </div>

      {/* Summary card */}
      {items.length > 0 && (
        <div className="card mb-6">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-xs text-muted uppercase mb-1">{t('Föremål', 'Items')}</p>
              <p className="text-lg font-display text-primary">{items.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted uppercase mb-1">{t('Totalt värde', 'Total value')}</p>
              <p className="text-lg font-display text-success">{formatSEK(totalValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted uppercase mb-1">{t('Tilldelad', 'Assigned')}</p>
              <p className="text-lg font-display text-primary">{assignedCount}/{items.length}</p>
            </div>
          </div>

          {/* Fairness indicator */}
          {assignedCount > 0 && delagareNames.length > 1 && (
            <div className={`flex items-center gap-2 p-3 rounded-[20px] ${
              isFair ? 'bg-success/10' : 'bg-yellow-50'
            }`}>
              <AlertCircle className={`w-4 h-4 flex-shrink-0 ${
                isFair ? 'text-success' : 'text-yellow-600'
              }`} />
              <p className={`text-xs font-medium ${
                isFair ? 'text-success' : 'text-yellow-700'
              }`}>
                {isFair
                  ? t('Fördelningen verkar rättvis', 'The distribution appears fair')
                  : t('Ojämn fördelning — några får mycket mer än andra', 'Uneven distribution — some get much more than others')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Per-delägare breakdown */}
      {delagareBreakdown.size > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-display text-primary mb-3">{t('Tilldelning per delägare', 'Distribution per co-owner')}</h3>
          <div className="space-y-2">
            {delagareNames.map(name => {
              const value = delagareBreakdown.get(name) ?? 0;
              const itemCount = items.filter(i => i.assignedTo === name).length;
              return (
                <div key={name} className="flex items-center justify-between p-2 bg-white rounded-[20px]">
                  <span className="text-sm text-primary font-medium">{name}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{formatSEK(value)}</p>
                    <p className="text-xs text-muted">{itemCount} {t('föremål', 'items')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="card mb-6" style={{ borderRadius: '28px' }}>
          <h3 className="text-lg font-display text-primary mb-4">{t('Lägg till föremål', 'Add item')}</h3>

          {/* Photo upload section */}
          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">{t('Foto (valfritt)', 'Photo (optional)')}</span>
            {formImageUrl ? (
              <div className="relative w-full mb-3">
                <NextImage
                  src={formImageUrl}
                  alt="Preview"
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded-[20px] border-2 border-[#E8E4DE]"
                  unoptimized
                />
                <button
                  onClick={() => setFormImageUrl(null)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label={t('Ta bort foto', 'Remove photo')}
                >
                  <X className="w-4 h-4 text-primary" />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  id="photo-input"
                  className="hidden"
                />
                <label
                  htmlFor="photo-input"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] cursor-pointer hover:border-accent hover:bg-gray-50 transition-colors bg-white"
                >
                  <Camera className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-primary">{t('Ta foto eller ladda upp', 'Take photo or upload')}</span>
                </label>
              </>
            )}
            {formErrors.image && <span className="text-xs text-warn mt-1 block">{formErrors.image}</span>}
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Namn på föremål *', 'Name of item *')}</span>
            <input
              type="text"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                setFormErrors(p => ({ ...p, formName: '' }));
              }}
              placeholder={t('T.ex. Soffa, Guldring, Tavla', 'E.g. Sofa, Gold ring, Painting')}
              className={`w-full px-4 py-3 border-2 rounded-[20px] focus:outline-none transition-colors bg-white ${
                formErrors.formName ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'
              }`}
            />
            {formErrors.formName && <span className="text-xs text-warn mt-1 block">{formErrors.formName}</span>}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Kategori *', 'Category *')}</span>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as LosoreItem['category'])}
              className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none transition-colors"
            >
              {CATEGORY_ORDER.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Uppskattat värde (kr) *', 'Estimated value (SEK) *')}</span>
            <input
              type="number"
              value={formValue}
              onChange={(e) => {
                setFormValue(e.target.value);
                setFormErrors(p => ({ ...p, formValue: '' }));
              }}
              placeholder="0"
              className={`w-full px-4 py-3 border-2 rounded-[20px] focus:outline-none transition-colors bg-white ${
                formErrors.formValue ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'
              }`}
            />
            {formErrors.formValue && <span className="text-xs text-warn mt-1 block">{formErrors.formValue}</span>}
          </label>

          {delagareNames.length > 0 && (
            <>
              <label className="block mb-4">
                <span className="text-sm font-medium text-primary mb-1 block">{t('Tilldelad till (valfritt)', 'Assigned to (optional)')}</span>
                <select
                  value={formAssignedTo}
                  onChange={(e) => setFormAssignedTo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="">— Ej tilldelad —</option>
                  {delagareNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </label>

              <label className="block mb-4">
                <span className="text-sm font-medium text-primary mb-1 block">{t('Tilldelad till arving (valfritt)', 'Assigned to heir (optional)')}</span>
                <select
                  value={formTilldeladTill}
                  onChange={(e) => setFormTilldeladTill(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="">— Välj arving —</option>
                  {delagareNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Anteckningar (valfritt)', 'Notes (optional)')}</span>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder={t('T.ex. Märkning, skick, särskilda instruktioner...', 'E.g. Markings, condition, special instructions...')}
              className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none transition-colors min-h-[80px]"
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setFormErrors({});
                setFormImageUrl(null);
              }}
              className="btn-secondary flex-1"
            >
              {t('Avbryt', 'Cancel')}
            </button>
            <button
              onClick={handleAddItem}
              disabled={!formName.trim() || !formValue}
              className="btn-primary flex-1"
            >
              {t('Lägg till', 'Add')}
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-medium text-primary mb-2">
            {t('Inga föremål ännu', 'No items yet')}
          </h2>
          <p className="text-muted text-sm max-w-xs">
            {t('Det är okej att ta det i din takt. Lägg till föremål när du känner dig redo.', 'It\'s okay to take your time. Add items when you\'re ready.')}
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
                  <h3 className="font-display text-primary">{CATEGORY_LABELS[category]}</h3>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success">{formatSEK(categoryTotal)}</p>
                    <p className="text-xs text-muted">{categoryItems.length} st</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {categoryItems.map(item => (
                    <div key={item.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            {item.imageUrl && (
                              <NextImage
                                src={item.imageUrl}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover rounded-[12px] flex-shrink-0 border border-[#E8E4DE]"
                                unoptimized
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-primary">{item.name}</p>
                              {item.notes && <p className="text-xs text-muted mt-1">{item.notes}</p>}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-warn transition-colors flex-shrink-0"
                          aria-label={t(`Ta bort ${item.name}`, `Remove ${item.name}`)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold text-success">{formatSEK(item.estimatedValue)}</p>
                        {item.tilldeladTill && (
                          <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                            {item.tilldeladTill}
                          </span>
                        )}
                      </div>

                      {delagareNames.length > 0 && (
                        <select
                          value={item.assignedTo || ''}
                          onChange={(e) => handleUpdateAssignment(item.id, e.target.value)}
                          className="w-full px-3 py-2 border border-[#E8E4DE] rounded-[20px] text-sm focus:border-accent focus:outline-none transition-colors mb-2"
                        >
                          <option value="">{t('— Ej tilldelad —', '— Not assigned —')}</option>
                          {delagareNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      )}

                      {item.assignedTo && (
                        <p className="text-xs text-primary/70">
                          {t('Tilldelad:', 'Assigned to:')} <span className="font-medium">{item.assignedTo}</span>
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
            <span className="font-semibold">{t('Juridisk anmärkning:', 'Legal note:')}</span> {t('Lösöre ska tas upp i bouppteckningen (ÄB 20 kap. 4 §). Värdet uppskattas till försäljningsvärdet.', 'Personal property must be listed in the estate inventory (AB Chapter 20, Section 4). The value is estimated at the sales value.')}
          </p>
        </div>
      </div>

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
