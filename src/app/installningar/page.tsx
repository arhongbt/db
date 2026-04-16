'use client';

import { useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n';
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
  const { language, setLanguage, t } = useLanguage();
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
      const scale = localStorage.getItem('sr_text_scale');
      if (scale === '1.15') return 'large';
      if (scale === '1.3') return 'xlarge';
      return 'normal';
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
      const scaleMap = {
        normal: '1',
        large: '1.15',
        xlarge: '1.3',
      };
      const scaleValue = scaleMap[size];
      localStorage.setItem('sr_text_scale', scaleValue);
      document.documentElement.style.setProperty('--text-scale', scaleValue);
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
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-4 py-5 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white transition-colors"
          aria-label={t('Tillbaka', 'Back')}
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <h1 className="text-xl font-display text-primary">{t('Inställningar', 'Settings')}</h1>
      </div>

      {/* Edit onboarding section */}
      <div className="card mb-6">
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-4">
          {t('Redigera uppgifter', 'Edit Information')}
        </h2>
        {!editingOnboarding ? (
          <>
            {state.deceasedName && (
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted">{t('Dödsbo', 'Estate')}</p>
                <p className="font-semibold text-primary text-lg">{state.deceasedName}</p>
                {state.deathDate && (
                  <p className="text-sm text-muted">
                    {t('Dödsdatum: ', 'Date of death: ')}{new Date(state.deathDate).toLocaleDateString('sv-SE')}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={() => setEditingOnboarding(true)}
              className="btn-primary w-full"
            >
              {t('Redigera', 'Edit')}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                {t('Namn på avliden', 'Name of deceased')}
              </label>
              <input
                type="text"
                value={formData.deceasedName}
                onChange={(e) =>
                  setFormData({ ...formData, deceasedName: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                {t('Dödsdatum', 'Date of death')}
              </label>
              <input
                type="date"
                value={formData.deathDate}
                onChange={(e) =>
                  setFormData({ ...formData, deathDate: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                {t('Familjsituation', 'Family situation')}
              </label>
              <select
                value={formData.familySituation}
                onChange={(e) =>
                  setFormData({ ...formData, familySituation: e.target.value as any })
                }
                className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none transition-colors"
              >
                <option value="gift_med_gemensamma_barn">{t('Gift med gemensamma barn', 'Married with shared children')}</option>
                <option value="gift_med_sarkullebarn">{t('Gift med särskilda barn', 'Married with separate children')}</option>
                <option value="gift_utan_barn">{t('Gift utan barn', 'Married without children')}</option>
                <option value="ogift_med_barn">{t('Ogift med barn', 'Unmarried with children')}</option>
                <option value="sambo_med_barn">{t('Sambo med barn', 'Cohabiting with children')}</option>
                <option value="sambo_utan_barn">{t('Sambo utan barn', 'Cohabiting without children')}</option>
                <option value="ensamstaende_utan_barn">{t('Ensamstående utan barn', 'Single without children')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                {t('Boendetyp', 'Housing type')}
              </label>
              <select
                value={formData.housingType}
                onChange={(e) =>
                  setFormData({ ...formData, housingType: e.target.value as any })
                }
                className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-[20px] focus:border-accent focus:outline-none transition-colors"
              >
                <option value="hyresratt">{t('Hyresrätt', 'Rental apartment')}</option>
                <option value="bostadsratt">{t('Bostadsrätt', 'Tenant-owned apartment')}</option>
                <option value="villa">{t('Villa', 'House')}</option>
                <option value="fritidshus">{t('Fritidshus', 'Holiday home')}</option>
                <option value="ingen_bostad">{t('Ingen bostad', 'No property')}</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#E8E4DE] rounded-[20px]">
              <label className="text-sm font-medium text-primary">
                {t('Finns testamente?', 'Is there a will?')}
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
                {t('Avbryt', 'Cancel')}
              </button>
              <button
                onClick={handleSaveOnboarding}
                className="btn-primary flex-1"
              >
                {t('Spara', 'Save')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Current dödsbo info */}
      {state.deceasedName && !editingOnboarding && (
        <div className="card mb-6">
          <p className="text-sm text-muted mb-1">{t('Statistik', 'Statistics')}</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.delagare.length}</p>
              <p className="text-xs text-muted">{t('Delägare', 'Co-owners')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.tillgangar.length}</p>
              <p className="text-xs text-muted">{t('Tillgångar', 'Assets')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{state.tasks.length}</p>
              <p className="text-xs text-muted">{t('Uppgifter', 'Tasks')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility section */}
      <div className="card mb-6">
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-4">
          {t('Tillgänglighet', 'Accessibility')}
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-primary flex items-center gap-2">
                <Type className="w-4 h-4" />
                {t('Textstorlek', 'Text size')}
              </label>
            </div>
            <div className="flex gap-2">
              {['normal', 'large', 'xlarge'].map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    handleTextSizeChange(size as 'normal' | 'large' | 'xlarge')
                  }
                  className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-colors ${
                    textSize === size
                      ? 'bg-accent text-white'
                      : 'bg-white text-primary hover:bg-white'
                  }`}
                >
                  {size === 'normal' && t('Normal', 'Normal')}
                  {size === 'large' && t('Stor', 'Large')}
                  {size === 'xlarge' && t('Mycket stor', 'Extra large')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-[#E8E4DE] rounded-[20px]">
            <label className="text-sm font-medium text-primary flex items-center gap-2">
              <Contrast className="w-4 h-4" />
              {t('Högt kontrast', 'High contrast')}
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
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-primary flex items-center gap-2">
                {t('settings.language')}
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('sv')}
                className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  language === 'sv'
                    ? 'bg-accent text-white'
                    : 'bg-white text-primary hover:bg-white border border-[#E8E4DE]'
                }`}
              >
                <span>🇸🇪</span>
                {t('settings.swedish')}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  language === 'en'
                    ? 'bg-accent text-white'
                    : 'bg-white text-primary hover:bg-white border border-[#E8E4DE]'
                }`}
              >
                <span>🇬🇧</span>
                {t('settings.english')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification settings */}
      <div className="card mb-6">
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-4">
          {t('Påminnelser', 'Reminders')}
        </h2>
        <div className="flex items-center justify-between p-3 border border-[#E8E4DE] rounded-[20px]">
          <label className="text-sm font-medium text-primary flex items-center gap-2">
            <Bell className="w-4 h-4" />
            {t('Push-notiser för tidsfrister', 'Push notifications for deadlines')}
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
            {t('Du får notiser 7, 3 och 1 dag innan varje tidsfrist.', 'You will receive notifications 7, 3, and 1 day before each deadline.')}
          </p>
        )}
        {getNotificationPermission() === 'denied' && (
          <p className="text-xs text-warn mt-2 px-1">
            {t('Notiser är blockerade i din webbläsare. Gå till webbläsarens inställningar för att aktivera.', 'Notifications are blocked in your browser. Go to browser settings to enable them.')}
          </p>
        )}
      </div>

      {/* Data export */}
      <div className="card mb-6">
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-4">
          {t('Exportera data', 'Export data')}
        </h2>
        <p className="text-xs text-muted mb-3">
          {t('Ladda ner en kopia av all data i dödsboet. Dela med jurist eller spara som backup.', 'Download a copy of all estate data. Share with a lawyer or save as backup.')}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => exportAsCSV(state)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-[#E8E4DE] rounded-[20px] text-sm font-medium text-primary hover:bg-white transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('CSV (Excel)', 'CSV (Excel)')}
          </button>
          <button
            onClick={() => exportAsJSON(state)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-[#E8E4DE] rounded-[20px] text-sm font-medium text-primary hover:bg-white transition-colors"
          >
            <FileText className="w-4 h-4" />
            {t('JSON (backup)', 'JSON (backup)')}
          </button>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-1">
          {t('Hjälp & information', 'Help & information')}
        </h2>
        {[
          { href: '/faq', label: t('Vanliga frågor', 'FAQ'), icon: HelpCircle },
          { href: '/nodbroms', label: t('Nödbroms — dag 1-7', 'Emergency guide — days 1-7'), icon: AlertTriangle },
          { href: '/tidslinje', label: t('Tidslinje', 'Timeline'), icon: BookOpen },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card flex items-center justify-between hover:bg-white transition-colors"
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
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-1">
          {t('Viktiga kontakter', 'Important contacts')}
        </h2>
        <div className="card space-y-3">
          {[
            { name: 'Skatteverket', phone: '0771-567 567', desc: t('Bouppteckning, folkbokföring', 'Estate inventory, population register') },
            { name: 'Kronofogden', phone: '0771-73 73 00', desc: t('Skulder, betalningsföreläggande', 'Debts, payment orders') },
            { name: 'Försäkringskassan', phone: '0771-524 524', desc: t('Pension, sjukpenning', 'Pension, sick benefits') },
            { name: 'Jourhavande medmänniska', phone: '08-702 16 80', desc: t('Stöd & samtal (kvällar/nätter)', 'Support & counseling (evenings/nights)') },
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
            <p className="text-sm font-medium text-primary">{t('Om appen', 'About the app')}</p>
            <p className="text-sm text-primary/70 mt-1">
              {t('Dödsbo-appen ger vägledning baserat på svensk lagstiftning. Den ersätter inte juridisk rådgivning. Vid komplexa fall rekommenderar vi att kontakta en jurist.', 'The estate app provides guidance based on Swedish law. It does not replace legal advice. For complex matters, we recommend contacting a lawyer.')}
            </p>
          </div>
        </div>
      </div>

      {/* Account actions */}
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-1">
          {t('Konto', 'Account')}
        </h2>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="card flex items-center justify-center gap-2 py-3 text-accent text-sm font-medium hover:bg-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {signingOut ? t('Loggar ut...', 'Signing out...') : t('Logga ut', 'Sign out')}
        </button>
      </div>

      {/* Reset */}
      <div className="mb-6">
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-3 text-warn text-sm font-medium hover:bg-red-50 rounded-[24px] transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              {t('Radera all data och börja om', 'Delete all data and start over')}
            </span>
          </button>
        ) : (
          <div className="card border-2 border-warn">
            <p className="font-medium text-warn mb-2">{t('Är du säker?', 'Are you sure?')}</p>
            <p className="text-sm text-primary/70 mb-4">
              {t('All data raderas permanent — dödsbodelägare, tillgångar, skulder, försäkringar och uppgifter.', 'All data will be permanently deleted — co-owners, assets, debts, insurance, and tasks.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="btn-secondary flex-1"
              >
                {t('Avbryt', 'Cancel')}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 min-h-touch px-6 py-3 bg-warn text-white font-semibold rounded-[24px]"
              >
                {t('Radera allt', 'Delete all')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legal links */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-sm font-display text-muted uppercase tracking-wide mb-1">
          {t('Juridik', 'Legal')}
        </h2>
        <div className="card space-y-3">
          {[
            { href: '/integritetspolicy', label: t('Integritetspolicy', 'Privacy Policy') },
            { href: '/anvandarvillkor', label: t('Användarvillkor', 'Terms of Use') },
            { href: '/om', label: t('Om oss', 'About us') },
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
