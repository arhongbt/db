'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { useAuth } from '@/lib/auth/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Trash2,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Heart,
  Info,
  LogOut,
  Type,
  Contrast,
  Bell,
  Download,
  FileText,
} from 'lucide-react';
import { exportAsCSV, exportAsJSON } from '@/lib/export-data';
import {
  requestNotificationPermission,
  getNotificationPrefs,
  saveNotificationPrefs,
  getNotificationPermission,
} from '@/lib/notifications';

function InstallningarContent() {
  const { state, dispatch, loading } = useDodsbo();
  const { signOut } = useAuth();
  const router = useRouter();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [editingOnboarding, setEditingOnboarding] = useState(false);
  const [formData, setFormData] = useState({
    deceasedName: state.deceasedName || '',
    deathDate: state.deathDate || '',
    familySituation: state.onboarding?.familySituation || 'gift_med_gemensamma_barn',
    housingType: state.onboarding?.housingType || 'hyresratt',
    hasTestamente: state.onboarding?.hasTestamente || false,
  });
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('dodsbo_textsize') as 'normal' | 'large' | 'xlarge') || 'normal';
    }
    return 'normal';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dodsbo_contrast') === 'true';
    }
    return false;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return getNotificationPrefs().enabled && getNotificationPermission() === 'granted';
    }
    return false;
  });

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

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/auth');
    } catch {
      setSigningOut(false);
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
    router.push('/');
  };

  const handleSaveOnboarding = () => {
    dispatch({
      type: 'SET_DECEASED_INFO',
      payload: {
        name: formData.deceasedName,
        deathDate: formData.deathDate,
      },
    });
    dispatch({
      type: 'SET_ONBOARDING',
      payload: {
        relation: state.onboarding?.relation || 'barn',
        familySituation: formData.familySituation as any,
        hasTestamente: formData.hasTestamente,
        housingType: formData.housingType as any,
        banks: state.onboarding?.banks || [],
        hasDebts: state.onboarding?.hasDebts ?? null,
        alreadyDone: state.onboarding?.alreadyDone || [],
      },
    });
    setEditingOnboarding(false);
  };

  const handleTextSizeChange = (size: 'normal' | 'large' | 'xlarge') => {
    setTextSize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dodsbo_textsize', size);
    }
  };

  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dodsbo_contrast', newValue ? 'true' : 'false');
    }
  };

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <h1 className="text-2xl font-semibold text-primary">Inställningar</h1>
      </div>

      {/* Edit onboarding section */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
          Redigera uppgifter
        </h2>
        {!editingOnboarding ? (
          <>
            {state.deceasedName && (
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted">Dödsbo</p>
                <p className="font-semibold text-primary text-lg">{state.deceasedName}</p>
                {state.deathDate && (
                  <p className="text-sm text-muted">
                    Dödsdatum: {new Date(state.deathDate).toLocaleDateString('sv-SE')}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={() => setEditingOnboarding(true)}
              className="btn-primary w-full"
            >
              Redigera
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Namn på avliden
              </label>
              <input
                type="text"
                value={formData.deceasedName}
                onChange={(e) =>
                  setFormData({ ...formData, deceasedName: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Dödsdatum
              </label>
              <input
                type="date"
                value={formData.deathDate}
                onChange={(e) =>
                  setFormData({ ...formData, deathDate: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Familjsituation
              </label>
              <select
                value={formData.familySituation}
                onChange={(e) =>
                  setFormData({ ...formData, familySituation: e.target.value as any })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors"
              >
                <option value="gift_med_gemensamma_barn">Gift med gemensamma barn</option>
                <option value="gift_med_sarkullebarn">Gift med särskilda barn</option>
                <option value="gift_utan_barn">Gift utan barn</option>
                <option value="ogift_med_barn">Ogift med barn</option>
                <option value="sambo_med_barn">Sambo med barn</option>
                <option value="sambo_utan_barn">Sambo utan barn</option>
                <option value="ensamstaende_utan_barn">Ensamstående utan barn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Boendetyp
              </label>
              <select
                value={formData.housingType}
                onChange={(e) =>
                  setFormData({ ...formData, housingType: e.target.value as any })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors"
              >
                <option value="hyresratt">Hyresrätt</option>
                <option value="bostadsratt">Bostadsrätt</option>
                <option value="villa">Villa</option>
                <option value="fritidshus">Fritidshus</option>
                <option value="ingen_bostad">Ingen bostad</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <label className="text-sm font-medium text-primary">
                Finns testamente?
              </label>
              <button
                onClick={() =>
                  setFormData({ ...formData, hasTestamente: !formData.hasTestamente })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.hasTestamente ? 'bg-accent' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.hasTestamente ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingOnboarding(false)}
                className="btn-secondary flex-1"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveOnboarding}
                className="btn-primary flex-1"
              >
                Spara
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Current dödsbo info */}
      {state.deceasedName && !editingOnboarding && (
        <div className="card mb-6">
          <p className="text-sm text-muted mb-1">Statistik</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.delagare.length}</p>
              <p className="text-xs text-muted">Delägare</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.tillgangar.length}</p>
              <p className="text-xs text-muted">Tillgångar</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.tasks.length}</p>
              <p className="text-xs text-muted">Uppgifter</p>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility section */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
          Tillgänglighet
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-primary flex items-center gap-2">
                <Type className="w-4 h-4" />
                Textstorlek
              </label>
            </div>
            <div className="flex gap-2">
              {['normal', 'large', 'xlarge'].map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    handleTextSizeChange(size as 'normal' | 'large' | 'xlarge')
                  }
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    textSize === size
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-primary hover:bg-gray-200'
                  }`}
                >
                  {size === 'normal' && 'Normal'}
                  {size === 'large' && 'Stor'}
                  {size === 'xlarge' && 'Mycket stor'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <label className="text-sm font-medium text-primary flex items-center gap-2">
              <Contrast className="w-4 h-4" />
              Högt kontrast
            </label>
            <button
              onClick={handleHighContrastToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                highContrast ? 'bg-accent' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification settings */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
          Påminnelser
        </h2>
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
          <label className="text-sm font-medium text-primary flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Push-notiser för tidsfrister
          </label>
          <button
            onClick={async () => {
              if (notificationsEnabled) {
                saveNotificationPrefs({ enabled: false, reminderDays: [7, 3, 1] });
                setNotificationsEnabled(false);
              } else {
                const granted = await requestNotificationPermission();
                if (granted) {
                  saveNotificationPrefs({ enabled: true, reminderDays: [7, 3, 1] });
                  setNotificationsEnabled(true);
                }
              }
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationsEnabled ? 'bg-accent' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {notificationsEnabled && (
          <p className="text-xs text-muted mt-2 px-1">
            Du får notiser 7, 3 och 1 dag innan varje tidsfrist.
          </p>
        )}
        {getNotificationPermission() === 'denied' && (
          <p className="text-xs text-warn mt-2 px-1">
            Notiser är blockerade i din webbläsare. Gå till webbläsarens inställningar för att aktivera.
          </p>
        )}
      </div>

      {/* Data export */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
          Exportera data
        </h2>
        <p className="text-xs text-muted mb-3">
          Ladda ner en kopia av all data i dödsboet. Dela med jurist eller spara som backup.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => exportAsCSV(state)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-primary hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV (Excel)
          </button>
          <button
            onClick={() => exportAsJSON(state)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-primary hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            JSON (backup)
          </button>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">
          Hjälp & information
        </h2>
        {[
          { href: '/faq', label: 'Vanliga frågor', icon: HelpCircle },
          { href: '/nodbroms', label: 'Nödbroms — dag 1-7', icon: AlertTriangle },
          { href: '/tidslinje', label: 'Tidslinje', icon: BookOpen },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-accent" />
              <span className="font-medium text-primary">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted" />
          </Link>
        ))}
      </div>

      {/* Useful contacts */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">
          Viktiga kontakter
        </h2>
        <div className="card space-y-3">
          {[
            { name: 'Skatteverket', phone: '0771-567 567', desc: 'Bouppteckning, folkbokföring' },
            { name: 'Kronofogden', phone: '0771-73 73 00', desc: 'Skulder, betalningsföreläggande' },
            { name: 'Försäkringskassan', phone: '0771-524 524', desc: 'Pension, sjukpenning' },
            { name: 'Jourhavande medmänniska', phone: '08-702 16 80', desc: 'Stöd & samtal (kvällar/nätter)' },
          ].map((contact) => (
            <div key={contact.name} className="flex items-start justify-between">
              <div>
                <p className="font-medium text-primary text-sm">{contact.name}</p>
                <p className="text-xs text-muted">{contact.desc}</p>
              </div>
              <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-accent font-medium hover:underline">{contact.phone}</a>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="info-box mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Om appen</p>
            <p className="text-sm text-primary/70 mt-1">
              Dödsbo-appen ger vägledning baserat på svensk lagstiftning.
              Den ersätter inte juridisk rådgivning. Vid komplexa fall
              rekommenderar vi att kontakta en jurist.
            </p>
          </div>
        </div>
      </div>

      {/* Account actions */}
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">
          Konto
        </h2>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="card flex items-center justify-center gap-2 py-3 text-accent text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {signingOut ? 'Loggar ut...' : 'Logga ut'}
        </button>
      </div>

      {/* Reset */}
      <div className="mb-6">
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-3 text-warn text-sm font-medium hover:bg-red-50 rounded-card transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Radera all data och börja om
            </span>
          </button>
        ) : (
          <div className="card border-2 border-warn">
            <p className="font-medium text-warn mb-2">Är du säker?</p>
            <p className="text-sm text-primary/70 mb-4">
              All data raderas permanent — dödsbodelägare, tillgångar, skulder, försäkringar och uppgifter.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="btn-secondary flex-1"
              >
                Avbryt
              </button>
              <button
                onClick={handleReset}
                className="flex-1 min-h-touch px-6 py-3 bg-warn text-white font-semibold rounded-card"
              >
                Radera allt
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legal links */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">
          Juridik
        </h2>
        <div className="card space-y-3">
          {[
            { href: '/integritetspolicy', label: 'Integritetspolicy' },
            { href: '/anvandarvillkor', label: 'Användarvillkor' },
            { href: '/om', label: 'Om oss' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between text-sm text-primary hover:text-accent transition-colors"
            >
              <span>{item.label}</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function InstallningarPage() {
  return (
    <DodsboProvider>
      <InstallningarContent />
    </DodsboProvider>
  );
}
