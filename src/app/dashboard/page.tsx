'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { useLanguage } from '@/lib/i18n';
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  User,
  Calendar,
  Settings,
  Zap,
  ClipboardList,
  Coins,
  ListChecks,
  Package,
  Bot,
  Bell,
  PenTool,
  ScrollText,
  FileX,
  Landmark,
  FileCheck,
  Users,
  Newspaper,
  Flower2,
  Heart,
  Handshake,
  Shield,
} from 'lucide-react';
import { BankIDVerification } from '@/components/BankIDVerification';
import type { DodsboTask, ProcessStep, TaskStatus } from '@/types';
import { DEFAULT_TIDSFRISTER } from '@/types';
import Link from 'next/link';
import { DoveLogo } from '@/components/ui/DoveLogo';
import {
  checkAndNotifyDeadlines,
  requestNotificationPermission,
  getNotificationPrefs,
  saveNotificationPrefs,
  getNotificationPermission,
} from '@/lib/notifications';

function DashboardSkeleton() {
  return (
    <div className="min-h-dvh p-6 animate-pulse" style={{ background: 'var(--bg)' }}>
      <div className="h-6 rounded-full w-2/3 mb-3" style={{ background: 'var(--border)' }} />
      <div className="h-4 rounded-full w-1/3 mb-8" style={{ background: 'var(--border-light)' }} />
      <div className="h-32 rounded-3xl mb-6" style={{ background: 'var(--bg-card)' }} />
      <div className="flex gap-3 mb-6">
        <div className="h-20 rounded-2xl flex-1" style={{ background: 'var(--bg-card)' }} />
        <div className="h-20 rounded-2xl flex-1" style={{ background: 'var(--bg-card)' }} />
        <div className="h-20 rounded-2xl flex-1" style={{ background: 'var(--bg-card)' }} />
      </div>
      <div className="h-5 rounded-full w-1/2 mb-4" style={{ background: 'var(--border)' }} />
      <div className="space-y-3">
        <div className="h-16 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
        <div className="h-16 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
      </div>
    </div>
  );
}

function DashboardContent() {
  const { state, loading } = useDodsbo();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [notifStatus, setNotifStatus] = useState<'idle' | 'enabled' | 'denied' | 'unsupported'>('idle');
  const [isBankIDVerified, setIsBankIDVerified] = useState(false);
  const [showBankIDModal, setShowBankIDModal] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const perm = getNotificationPermission();
    const prefs = getNotificationPrefs();
    if (perm === 'unsupported') setNotifStatus('unsupported');
    else if (perm === 'denied') setNotifStatus('denied');
    else if (perm === 'granted' && prefs.enabled) setNotifStatus('enabled');
    else setNotifStatus('idle');
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      const bankidData = localStorage.getItem('sr_bankid_verified');
      if (bankidData) {
        const parsed = JSON.parse(bankidData);
        setIsBankIDVerified(parsed.verified === true);
      }
    } catch { /* ignore */ }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !state.deathDate || notifStatus !== 'enabled') return;
    checkAndNotifyDeadlines(state.deathDate, DEFAULT_TIDSFRISTER);
  }, [mounted, state.deathDate, notifStatus]);

  if (!mounted || loading) return <DashboardSkeleton />;

  const deathDate = state.deathDate ? new Date(state.deathDate) : null;
  const daysSinceDeath = deathDate
    ? Math.floor((Date.now() - deathDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const computeStep = (days: number): ProcessStep => {
    if (days <= 7) return 'akut';
    if (days <= 30) return 'kartlaggning';
    if (days <= 90) return 'bouppteckning';
    if (days <= 180) return 'arvskifte';
    return 'avslutat';
  };
  const effectiveStep = deathDate ? computeStep(daysSinceDeath) : state.currentStep;

  const upcomingDeadlines = DEFAULT_TIDSFRISTER
    .filter((t) => t.offsetDays > daysSinceDeath)
    .slice(0, 3);

  const passedDeadlines = DEFAULT_TIDSFRISTER
    .filter((t) => t.offsetDays <= daysSinceDeath);

  const stepLabels: Record<ProcessStep, string> = {
    akut: 'Nödbroms',
    kartlaggning: 'Kartläggning',
    bouppteckning: 'Bouppteckning',
    arvskifte: 'Arvskifte',
    avslutat: 'Avslutat',
  };

  const stepSubtitles: Record<ProcessStep, string> = {
    akut: 'Dag 1–7',
    kartlaggning: 'Vecka 1–4',
    bouppteckning: 'Månad 1–3',
    arvskifte: 'Månad 3–6',
    avslutat: '',
  };

  const tillgangarTotal = state.tillgangar.reduce((sum, item) => {
    const value = item.confirmedValue !== undefined ? item.confirmedValue : (item.estimatedValue || 0);
    return sum + value;
  }, 0);

  const skulderTotal = state.skulder.reduce((sum, item) => sum + (item.amount || 0), 0);

  const isSimpleDodsbo = state.tillgangar.length === 0 && state.delagare.length === 0 && daysSinceDeath < 30;

  // If no onboarding done
  if (!state.deceasedName && mounted) {
    return (
      <div className="flex flex-col px-6 py-8 pb-28">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60dvh] text-center">
          <DoveLogo size={56} className="mb-8 opacity-40" />
          <h1 className="font-display text-3xl mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Välkommen</h1>
          <p className="text-base mb-10 max-w-[280px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Börja med att berätta om din situation så skapar vi en personlig plan.
          </p>
          <Link href="/onboarding" className="btn-primary max-w-[260px] flex items-center justify-center gap-2">
            Kom igång
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Progress
  const stepProgress: Record<ProcessStep, number> = {
    akut: 10, kartlaggning: 30, bouppteckning: 55, arvskifte: 80, avslutat: 100,
  };
  const progressPct = stepProgress[effectiveStep];

  return (
    <div className="flex flex-col px-6 py-8 pb-28">

      {/* ── Greeting — Tiimo-inspired display font ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            {t('dashboard.welcome_back')}
          </p>
          <h1 className="font-display text-2xl" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {state.deceasedName
              ? `${state.deceasedName}s dödsbo`
              : t('dashboard.greeting')}
          </h1>
        </div>
        <Link
          href="/installningar"
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          aria-label="Inställningar"
        >
          <Settings className="w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} strokeWidth={1.5} />
        </Link>
      </div>

      {/* ── Phase card — Tiimo-style rounded, immersive ── */}
      <Link
        href="/tidslinje"
        className="relative overflow-hidden mb-7 p-6 transition-all duration-300 active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, rgba(122,158,126,0.06), rgba(122,158,126,0.02))',
          borderRadius: '28px',
          border: '1.5px solid rgba(122,158,126,0.10)',
        }}
        aria-label={`Fas: ${stepLabels[effectiveStep]} — ${progressPct}%`}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--accent)', letterSpacing: '0.06em' }}>
              {stepSubtitles[effectiveStep]}
            </p>
            <h2 className="font-display text-xl" style={{ color: 'var(--text)' }}>
              {stepLabels[effectiveStep]}
            </h2>
          </div>
          <div className="text-right">
            <span className="font-display text-3xl" style={{ color: 'var(--accent)' }}>{progressPct}%</span>
          </div>
        </div>
        {/* Progress bar — rounded pill */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(122,158,126,0.10)' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%`, background: 'var(--accent)' }}
          />
        </div>
        {daysSinceDeath > 0 && (
          <p className="text-xs mt-3.5" style={{ color: 'var(--text-secondary)' }}>
            Dag {daysSinceDeath} — ta den tid du behöver
          </p>
        )}
      </Link>

      {/* ── Nödbroms — first 7 days, Tiimo-style rounded ── */}
      {daysSinceDeath <= 7 && (
        <Link
          href="/nodbroms"
          className="mb-6 p-5 flex items-center gap-4 active:scale-[0.98] transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(196,149,106,0.08), rgba(196,149,106,0.02))',
            borderRadius: '24px',
            border: '1.5px solid rgba(196,149,106,0.12)',
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,149,106,0.12)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--kohaku)' }} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--kohaku)' }}>{t('dashboard.emergency_brake')}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.emergency_brake_desc')}</p>
          </div>
          <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--kohaku)' }} />
        </Link>
      )}

      {/* ── Quick stats — 3 columns, Tiimo bubbly ── */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          { value: state.delagare.length, label: 'Delägare', icon: User, color: 'var(--accent)', bg: 'rgba(122,158,126,0.08)' },
          { value: upcomingDeadlines.length, label: 'Deadlines', icon: Calendar, color: 'var(--sora)', bg: 'rgba(139,164,184,0.08)' },
          { value: state.tillgangar.length, label: 'Tillgångar', icon: Coins, color: 'var(--kohaku)', bg: 'rgba(196,149,106,0.08)' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center py-5 transition-all"
            style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2.5" style={{ background: stat.bg }}>
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.5} />
            </div>
            <span className="font-display text-2xl" style={{ color: 'var(--text)' }}>{stat.value}</span>
            <span className="text-[11px] mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Skulder warning ── */}
      {skulderTotal > tillgangarTotal && skulderTotal > 0 && (
        <div className="mb-6 p-5 flex items-start gap-4" style={{
          background: 'linear-gradient(135deg, rgba(212,160,167,0.08), rgba(212,160,167,0.02))',
          borderRadius: '24px',
          border: '1.5px solid rgba(212,160,167,0.12)',
        }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,160,167,0.12)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--sakura)' }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--sakura)' }}>{t('dashboard.debts_info')}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.debts_desc')}</p>
          </div>
        </div>
      )}

      {/* ── Priority actions ── */}
      {(() => {
        const top3: { label: string; href: string; reason: string; accent: string }[] = [];
        const alreadyDone = state.onboarding.alreadyDone || [];
        const isMarried = state.onboarding.familySituation?.startsWith('gift_');
        const hasBanks = state.onboarding.banks.length > 0;
        const hasDelagare = state.delagare.length > 0;
        const hasTillgangar = state.tillgangar.length > 0;

        if (daysSinceDeath <= 7 && !alreadyDone.includes('dodsbevis'))
          top3.push({ label: 'Gå igenom nödbromsen', href: '/nodbroms', reason: 'Dag 1–7', accent: 'var(--kohaku)' });
        if (hasBanks && !alreadyDone.includes('kontaktat_bank'))
          top3.push({ label: 'Kontakta banker', href: '/avsluta-konton', reason: `${state.onboarding.banks.length} banker`, accent: 'var(--sora)' });
        if (!hasDelagare)
          top3.push({ label: 'Lägg till dödsbodelägare', href: '/delagare', reason: 'Krävs för bouppteckning', accent: 'var(--accent)' });
        if (!hasTillgangar)
          top3.push({ label: 'Inventera tillgångar', href: '/tillgangar', reason: 'Grund för bouppteckning', accent: 'var(--accent)' });
        if (isMarried)
          top3.push({ label: 'Gör bodelning', href: '/bodelning', reason: 'Krävs innan arvskifte', accent: 'var(--sakura)' });
        if (daysSinceDeath >= 14 && hasDelagare && hasTillgangar)
          top3.push({ label: 'Förbered bouppteckning', href: '/bouppteckning', reason: `${Math.max(0, 90 - daysSinceDeath)} dagar kvar`, accent: 'var(--accent)' });
        if (!alreadyDone.includes('kontaktat_forsakring'))
          top3.push({ label: 'Kontrollera försäkringar', href: '/forsakringar', reason: 'Kan ge ersättning', accent: 'var(--sora)' });

        const actions = top3.slice(0, 3);
        if (actions.length === 0) return null;

        return (
          <section className="mb-7">
            <h2 className="font-display text-lg mb-4" style={{ color: 'var(--text)' }}>
              Nästa steg
            </h2>
            <div className="flex flex-col gap-3">
              {actions.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="p-5 flex items-center gap-4 active:scale-[0.98] transition-all duration-300"
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.accent }} />
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{a.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{a.reason}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* ── Deadlines ── */}
      {upcomingDeadlines.length > 0 && (
        <section className="mb-7">
          <h2 className="font-display text-lg mb-4" style={{ color: 'var(--text)' }}>
            Kommande deadlines
          </h2>
          <div className="flex flex-col gap-3">
            {upcomingDeadlines.map((deadline) => {
              const daysLeft = deadline.offsetDays - daysSinceDeath;
              const isUrgent = daysLeft <= 7;
              return (
                <div
                  key={deadline.id}
                  className="p-5 flex items-start gap-4"
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{
                    background: isUrgent ? 'rgba(196,149,106,0.10)' : 'rgba(139,164,184,0.08)',
                  }}>
                    {isUrgent ? (
                      <AlertTriangle className="w-4 h-4" style={{ color: 'var(--kohaku)' }} strokeWidth={1.5} />
                    ) : (
                      <Clock className="w-4 h-4" style={{ color: 'var(--sora)' }} strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{deadline.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{deadline.description}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0" style={{
                    background: isUrgent ? 'rgba(196,149,106,0.1)' : 'rgba(139,164,184,0.08)',
                    color: isUrgent ? 'var(--kohaku)' : 'var(--sora)',
                  }}>
                    {daysLeft}d
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Passed deadlines ── */}
      {passedDeadlines.length > 0 && (
        <div className="mb-6 p-5 flex items-start gap-4" style={{
          background: 'linear-gradient(135deg, rgba(212,160,167,0.08), rgba(212,160,167,0.02))',
          borderRadius: '24px',
          border: '1.5px solid rgba(212,160,167,0.12)',
        }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,160,167,0.12)' }}>
            <AlertTriangle className="w-4 h-4" style={{ color: 'var(--sakura)' }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--sakura)' }}>
              {passedDeadlines.length} {t('dashboard.missed_deadlines')}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('dashboard.missed_deadlines_desc')}
            </p>
          </div>
        </div>
      )}

      {/* ── Mike Ross — Tiimo-style featured card ── */}
      <Link
        href="/juridisk-hjalp"
        className="mb-7 p-5 flex items-center gap-4 active:scale-[0.98] transition-all duration-300"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '28px',
          border: '1px solid var(--border)',
        }}
        aria-label={t('dashboard.ask_mike_ross')}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7A9E7E, #6B8E6F)' }}>
          <Bot className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t('dashboard.ask_mike_ross')}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.mike_ross_desc')}</p>
        </div>
        <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
      </Link>

      {/* ── Notifications ── */}
      {notifStatus === 'idle' && state.deathDate && (
        <button
          onClick={async () => {
            const granted = await requestNotificationPermission();
            if (granted) {
              saveNotificationPrefs({ enabled: true, reminderDays: [7, 3, 1] });
              setNotifStatus('enabled');
              checkAndNotifyDeadlines(state.deathDate!, DEFAULT_TIDSFRISTER);
            } else {
              setNotifStatus('denied');
            }
          }}
          className="mb-6 p-5 flex items-center justify-between w-full text-left transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, rgba(139,164,184,0.06), rgba(139,164,184,0.02))',
            borderRadius: '24px',
            border: '1.5px solid rgba(139,164,184,0.10)',
          }}
        >
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{t('dashboard.enable_notifications')}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.enable_notifications_desc')}</p>
          </div>
          <span className="text-xs font-semibold px-4 py-2 rounded-full" style={{ background: 'var(--sora)', color: '#FFFFFF' }}>
            {t('dashboard.turn_on')}
          </span>
        </button>
      )}

      {/* ── Documents — Tiimo-style rounded grid ── */}
      <section className="mb-7">
        <h2 className="font-display text-lg mb-4" style={{ color: 'var(--text)' }}>
          {t('dashboard.create_documents')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {(isSimpleDodsbo ? [
            { label: 'Begravning', href: '/begravningsplanering', Icon: Flower2, color: 'var(--sakura)' },
            { label: 'Dödsboanmälan', href: '/dodsboanmalan', Icon: FileX, color: 'var(--kohaku)' },
          ] : [
            { label: 'Bouppteckning', href: '/bouppteckning', Icon: ClipboardList, color: 'var(--accent)' },
            { label: 'Testamente', href: '/testamente', Icon: PenTool, color: 'var(--sora)' },
            { label: 'Arvskifte', href: '/arvskifteshandling', Icon: ScrollText, color: 'var(--kohaku)' },
            { label: 'Dödsboanmälan', href: '/dodsboanmalan', Icon: FileX, color: 'var(--sakura)' },
            { label: 'Bankbrev', href: '/bankbrev', Icon: Landmark, color: 'var(--sora)' },
            { label: 'Dödsannons', href: '/dodsannons', Icon: Newspaper, color: 'var(--kohaku)' },
          ]).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 flex items-center gap-3 active:scale-[0.97] transition-all duration-300"
              style={{ background: 'var(--bg-card)', borderRadius: '22px', border: '1px solid var(--border)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `color-mix(in srgb, ${item.color} 10%, transparent)` }}>
                <item.Icon className="w-4.5 h-4.5" style={{ color: item.color }} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Tools — Tiimo-style rounded grid ── */}
      <section className="mb-7">
        <h2 className="font-display text-lg mb-4" style={{ color: 'var(--text)' }}>
          {t('dashboard.tools_guides')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Begravning', href: '/begravningsplanering', Icon: Flower2, color: 'var(--sakura)' },
            { label: 'Skatteverket', href: '/skatteverket-guide', Icon: FileCheck, color: 'var(--accent)' },
            { label: 'Minnesida', href: '/minnesida', Icon: Heart, color: 'var(--sakura)' },
            ...(state.delagare.length > 1 ? [{ label: 'Samarbete', href: '/samarbete', Icon: Handshake, color: 'var(--sora)' }] : []),
            { label: 'Mike Ross', href: '/juridisk-hjalp', Icon: Bot, color: 'var(--accent)' },
            { label: 'Exportera', href: '/exportera', Icon: Package, color: 'var(--kohaku)' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 flex items-center gap-3 active:scale-[0.97] transition-all duration-300"
              style={{ background: 'var(--bg-card)', borderRadius: '22px', border: '1px solid var(--border)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `color-mix(in srgb, ${item.color} 10%, transparent)` }}>
                <item.Icon className="w-4.5 h-4.5" style={{ color: item.color }} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Legal ── */}
      <p className="text-xs text-center mt-2 mb-4 px-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {t('dashboard.legal_disclaimer')}
      </p>

      {/* BankID Modal */}
      {showBankIDModal && (
        <BankIDVerification
          onVerified={() => { setIsBankIDVerified(true); setShowBankIDModal(false); }}
          onCancel={() => setShowBankIDModal(false)}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DodsboProvider>
      <DashboardContent />
    </DodsboProvider>
  );
}
