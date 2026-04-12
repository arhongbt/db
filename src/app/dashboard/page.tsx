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
import { BottomNav } from '@/components/ui/BottomNav';
import { BankIDVerification } from '@/components/BankIDVerification';
import type { DodsboTask, ProcessStep, TaskStatus } from '@/types';
import { DEFAULT_TIDSFRISTER } from '@/types';
import Link from 'next/link';
import { DoveLogo } from '@/components/ui/DoveLogo';
// Decorations removed — caused z-index/visibility bugs on mobile
import {
  checkAndNotifyDeadlines,
  requestNotificationPermission,
  getNotificationPrefs,
  saveNotificationPrefs,
  getNotificationPermission,
} from '@/lib/notifications';

function DashboardSkeleton() {
  return (
    <div className="min-h-dvh bg-background p-6 animate-pulse">
      <div className="h-8 bg-[#E8E4DE] rounded w-3/4 mb-2" />
      <div className="h-4 bg-[#E8E4DE] rounded w-1/2 mb-6" />
      <div className="h-24 bg-[#E8E4DE] rounded-2xl mb-6" />
      <div className="flex gap-4 mb-6">
        <div className="h-24 bg-[#E8E4DE] rounded-2xl flex-1" />
        <div className="h-24 bg-[#E8E4DE] rounded-2xl flex-1" />
      </div>
      <div className="h-6 bg-[#E8E4DE] rounded w-1/2 mb-4" />
      <div className="space-y-3">
        <div className="h-20 bg-[#E8E4DE] rounded-2xl" />
        <div className="h-20 bg-[#E8E4DE] rounded-2xl" />
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

  // Check notification status on mount
  useEffect(() => {
    if (!mounted) return;
    const perm = getNotificationPermission();
    const prefs = getNotificationPrefs();
    if (perm === 'unsupported') setNotifStatus('unsupported');
    else if (perm === 'denied') setNotifStatus('denied');
    else if (perm === 'granted' && prefs.enabled) setNotifStatus('enabled');
    else setNotifStatus('idle');
  }, [mounted]);

  // Check BankID verification status on mount
  useEffect(() => {
    if (!mounted) return;
    try {
      const bankidData = localStorage.getItem('sr_bankid_verified');
      if (bankidData) {
        const parsed = JSON.parse(bankidData);
        setIsBankIDVerified(parsed.verified === true);
      }
    } catch {
      // ignore
    }
  }, [mounted]);

  // Check and fire deadline notifications
  useEffect(() => {
    if (!mounted || !state.deathDate || notifStatus !== 'enabled') return;
    checkAndNotifyDeadlines(state.deathDate, DEFAULT_TIDSFRISTER);
  }, [mounted, state.deathDate, notifStatus]);
  if (!mounted || loading) return <DashboardSkeleton />;

  const deathDate = state.deathDate ? new Date(state.deathDate) : null;
  const daysSinceDeath = deathDate
    ? Math.floor((Date.now() - deathDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Auto-compute effective step from daysSinceDeath
  // (the stored currentStep may be stale if user doesn't manually advance)
  const computeStep = (days: number): ProcessStep => {
    if (days <= 7) return 'akut';
    if (days <= 30) return 'kartlaggning';
    if (days <= 90) return 'bouppteckning';
    if (days <= 180) return 'arvskifte';
    return 'avslutat';
  };
  const effectiveStep = deathDate ? computeStep(daysSinceDeath) : state.currentStep;

  // Upcoming deadlines
  const upcomingDeadlines = DEFAULT_TIDSFRISTER
    .filter((t) => t.offsetDays > daysSinceDeath)
    .slice(0, 3);

  const passedDeadlines = DEFAULT_TIDSFRISTER
    .filter((t) => t.offsetDays <= daysSinceDeath);

  // Step labels
  const stepLabels: Record<ProcessStep, string> = {
    akut: 'Nödbroms (dag 1–7)',
    kartlaggning: 'Kartläggning (vecka 1–4)',
    bouppteckning: 'Bouppteckning (månad 1–3)',
    arvskifte: 'Arvskifte (månad 3–6)',
    avslutat: 'Avslutat',
  };

  const stepColors: Record<ProcessStep, string> = {
    akut: 'bg-[#FEF3EE] border-warn text-warn',
    kartlaggning: 'bg-info-light border-accent text-accent',
    bouppteckning: 'bg-primary-lighter border-primary text-primary',
    arvskifte: 'bg-accent/5 border-success text-success',
    avslutat: 'bg-gray-50 border-gray-400 text-gray-600',
  };

  // Calculate totals for skulder/tillgangar
  const tillgangarTotal = state.tillgangar.reduce((sum, item) => {
    const value = item.confirmedValue !== undefined ? item.confirmedValue : (item.estimatedValue || 0);
    return sum + value;
  }, 0);

  const skulderTotal = state.skulder.reduce((sum, item) => {
    return sum + (item.amount || 0);
  }, 0);

  // Check if simple dödsbo: 0 tillgångar AND 0 delagare AND < 30 days
  const isSimpleDodsbo = state.tillgangar.length === 0 && state.delagare.length === 0 && daysSinceDeath < 30;

  const statusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'klar':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'pagaende':
        return <Clock className="w-5 h-5 text-accent" />;
      case 'ej_aktuell':
        return <Circle className="w-5 h-5 text-gray-300" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  // If no onboarding done, redirect
  if (!state.deceasedName && mounted) {
    return (
      <div className="flex flex-col px-5 py-6 pb-24">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60dvh] text-center">
          <DoveLogo size={64} className="mb-4 opacity-60" />
          <h1 className="text-2xl font-semibold text-primary mb-2">Välkommen</h1>
          <p className="text-muted mb-6 max-w-xs">
            Börja med att berätta om din situation så skapar vi en personlig plan.
          </p>
          <Link href="/onboarding" className="btn-primary max-w-xs flex items-center justify-center gap-2">
            Kom igång
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Progress percentage ──
  const stepProgress: Record<ProcessStep, number> = {
    akut: 10,
    kartlaggning: 30,
    bouppteckning: 55,
    arvskifte: 80,
    avslutat: 100,
  };
  const progressPct = stepProgress[effectiveStep];
  const circumference = 2 * Math.PI * 38; // radius 38
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="flex flex-col px-5 py-6 pb-24 stagger-children">

      {/* Greeting + settings */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm text-muted">{t('dashboard.welcome_back')}</p>
          <h1 className="text-xl font-bold text-primary mt-0.5">
            {state.deceasedName
              ? `${state.deceasedName}s ${t('estate.estate').toLowerCase()}`
              : t('dashboard.greeting')}
          </h1>
        </div>
        <Link
          href="/installningar"
          className="p-2.5 -mr-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Inställningar"
        >
          <Settings className="w-5 h-5 text-muted" />
        </Link>
      </div>

      {/* BankID verification banner */}
      {!isBankIDVerified && (
        <button
          onClick={() => setShowBankIDModal(true)}
          className="card border-l-4 border-accent bg-accent/5 mb-5 flex items-center justify-between"
        >
          <div>
            <p className="font-medium text-accent text-sm">{t('dashboard.verify_bankid')}</p>
            <p className="text-xs text-primary/70">{t('dashboard.verify_bankid_required')}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-accent" />
        </button>
      )}

      {/* Upgrade banner */}
      <Link
        href="/priser"
        className="card bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 mb-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-primary text-sm">{t('Lås upp alla verktyg', 'Unlock all tools')}</p>
            <p className="text-xs text-muted">{t('Från 899 kr — engångsbelopp', 'From SEK 899 — one-time')}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-accent" />
      </Link>

      {isBankIDVerified && (
        <div className="card border-l-4 border-success bg-success/5 mb-5 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          <div>
            <p className="font-medium text-success text-sm">{t('dashboard.bankid_verified')}</p>
            <p className="text-xs text-primary/70">{t('dashboard.bankid_verified_desc')}</p>
          </div>
        </div>
      )}

      {/* ── Progress card with ring — Mindify style ── */}
      <Link
        href="/tidslinje"
        className="card mb-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #EEF2EA, #F7F5F0)' }}
        aria-label={`Aktuell fas: ${stepLabels[effectiveStep]} — ${progressPct}% klart`}
      >
        {/* SVG progress ring */}
        <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
            <circle cx="40" cy="40" r="38" fill="none" stroke="#E8E4DE" strokeWidth="5" />
            <circle
              cx="40" cy="40" r="38" fill="none"
              stroke="#6B7F5E" strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold text-primary leading-none">{progressPct}%</span>
            <span className="text-[10px] text-muted">klart</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted mb-0.5">{t('dashboard.current_phase')}</p>
          <p className="text-base font-bold text-primary leading-tight">{stepLabels[effectiveStep]}</p>
          {daysSinceDeath > 0 && (
            <p className="text-xs text-muted mt-1">{t('dashboard.day')} {daysSinceDeath} — {t('dashboard.take_your_time')}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-muted flex-shrink-0" />
      </Link>

      {/* Nödbroms banner — show first 7 days */}
      {daysSinceDeath <= 7 && (
        <Link
          href="/nodbroms"
          className="card border-l-4 border-warn bg-[#FEF3EE] mb-5 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-warn">{t('dashboard.emergency_brake')}</p>
            <p className="text-sm text-primary/70">{t('dashboard.emergency_brake_desc')}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-warn" />
        </Link>
      )}

      {/* Skulder ärver du inte banner — show if skulder > tillgangar */}
      {skulderTotal > tillgangarTotal && skulderTotal > 0 && (
        <div className="card border-l-4 border-accent bg-accent/5 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-accent">{t('dashboard.debts_info')}</p>
            <p className="text-sm text-primary/70 mt-1">
              {t('dashboard.debts_desc')}
            </p>
          </div>
        </div>
      )}

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-3 mb-5" role="group" aria-label={t('dashboard.statistics')}>
        <div className="card text-center" aria-label={`${t('dashboard.co_owners')}: ${state.delagare.length}`}>
          <div className="w-10 h-10 rounded-2xl mx-auto mb-2 flex items-center justify-center" style={{ background: '#EEF2EA' }}>
            <User className="w-5 h-5 text-accent" aria-hidden="true" />
          </div>
          <p className="text-2xl font-bold text-primary">{state.delagare.length}</p>
          <p className="text-xs text-muted">{t('dashboard.co_owners')}</p>
        </div>
        <div className="card text-center" aria-label={`${t('dashboard.upcoming_deadlines')}: ${upcomingDeadlines.length}`}>
          <div className="w-10 h-10 rounded-2xl mx-auto mb-2 flex items-center justify-center" style={{ background: '#EEF2EA' }}>
            <Calendar className="w-5 h-5 text-accent" aria-hidden="true" />
          </div>
          <p className="text-2xl font-bold text-primary">{upcomingDeadlines.length}</p>
          <p className="text-xs text-muted">{t('dashboard.upcoming_deadlines')}</p>
        </div>
      </div>

      {/* Smart Top 3 — personalized priority actions */}
      {(() => {
        const top3: { label: string; href: string; reason: string; color: string }[] = [];

        const alreadyDone = state.onboarding.alreadyDone || [];
        const isMarried = state.onboarding.familySituation?.startsWith('gift_');
        const hasBanks = state.onboarding.banks.length > 0;
        const hasDelagare = state.delagare.length > 0;
        const hasTillgangar = state.tillgangar.length > 0;

        if (daysSinceDeath <= 7 && !alreadyDone.includes('dodsbevis')) {
          top3.push({ label: 'Gå igenom nödbromsen', href: '/nodbroms', reason: 'Dag 1–7 — viktigaste stegen', color: 'border-warn bg-[#FEF3EE]' });
        }
        if (hasBanks && !alreadyDone.includes('kontaktat_bank')) {
          top3.push({ label: 'Kontakta banker', href: '/avsluta-konton', reason: `${state.onboarding.banks.length} banker att meddela`, color: 'border-accent bg-accent/5' });
        }
        if (!hasDelagare) {
          top3.push({ label: 'Lägg till dödsbodelägare', href: '/delagare', reason: 'Krävs för bouppteckning', color: 'border-accent bg-accent/5' });
        }
        if (!hasTillgangar) {
          top3.push({ label: 'Inventera tillgångar & skulder', href: '/tillgangar', reason: 'Grund för bouppteckning', color: 'border-accent bg-accent/5' });
        }
        if (isMarried) {
          top3.push({ label: 'Gör bodelning', href: '/bodelning', reason: 'Krävs innan arvskifte (gifta)', color: 'border-accent bg-accent/5' });
        }
        if (daysSinceDeath >= 14 && hasDelagare && hasTillgangar) {
          top3.push({ label: 'Förbered bouppteckning', href: '/bouppteckning', reason: `${Math.max(0, 90 - daysSinceDeath)} dagar kvar till frist`, color: 'border-accent bg-accent/5' });
        }
        if (!alreadyDone.includes('kontaktat_forsakring')) {
          top3.push({ label: 'Kontrollera försäkringar', href: '/forsakringar', reason: 'Kan ge dödsfallsersättning', color: 'border-accent bg-accent/5' });
        }
        if (effectiveStep === 'arvskifte') {
          top3.push({ label: 'Genomför arvskifte', href: '/arvskifte', reason: 'Fördela tillgångarna', color: 'border-accent bg-accent/5' });
        }

        const actions = top3.slice(0, 3);

        return actions.length > 0 ? (
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-accent" />
              <h2 className="text-base font-bold text-primary">{t('dashboard.do_this_first')}</h2>
            </div>
            <div className="flex flex-col gap-2">
              {actions.map((a, i) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className={`card border-l-4 ${a.color} flex items-center justify-between`}
                  aria-label={`${a.label} — ${a.reason}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="font-medium text-primary text-sm">{a.label}</p>
                    </div>
                    <p className="text-xs text-muted mt-0.5 ml-7">{a.reason}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        ) : null;
      })()}

      {/* Upcoming deadlines */}
      {upcomingDeadlines.length > 0 && (
        <section className="mb-5">
          <h2 className="text-base font-bold text-primary mb-3">
            {t('dashboard.upcoming_deadlines_section')}
          </h2>
          <div className="flex flex-col gap-2">
            {upcomingDeadlines.map((deadline) => {
              const daysLeft = deadline.offsetDays - daysSinceDeath;
              const isUrgent = daysLeft <= 7;
              return (
                <div
                  key={deadline.id}
                  className={`card flex items-start gap-3 ${
                    isUrgent ? 'border-l-4 border-warn' : ''
                  }`}
                >
                  {isUrgent ? (
                    <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-primary text-sm">{deadline.title}</p>
                    <p className="text-xs text-muted mt-0.5">{deadline.description}</p>
                    <p className={`text-xs font-medium mt-1 ${isUrgent ? 'text-warn' : 'text-accent'}`}>
                      {daysLeft} {t('dashboard.days_left')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Passed deadlines warning */}
      {passedDeadlines.length > 0 && (
        <div className="warning-box mb-5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warn">
                {passedDeadlines.length} {t('dashboard.missed_deadlines')}
              </p>
              <p className="text-sm text-primary/70 mt-1">
                {t('dashboard.missed_deadlines_desc')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mike Ross AI — sage color, robot icon */}
      <Link
        href="/juridisk-hjalp"
        className="card mb-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #EEF2EA, #F7F5F0)' }}
        aria-label={t('dashboard.ask_mike_ross')}
      >
        <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
          <Bot className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-primary">{t('dashboard.ask_mike_ross')}</p>
          <p className="text-xs text-muted">{t('dashboard.mike_ross_desc')}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-light flex-shrink-0" />
      </Link>

      {/* Notification prompt */}
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
          className="card border-l-4 border-accent bg-accent/5 mb-4 flex items-center justify-between w-full text-left"
        >
          <div>
            <p className="font-medium text-primary text-sm">{t('dashboard.enable_notifications')}</p>
            <p className="text-xs text-muted">{t('dashboard.enable_notifications_desc')}</p>
          </div>
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">{t('dashboard.turn_on')}</span>
        </button>
      )}
      {notifStatus === 'enabled' && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-xs text-muted">{t('dashboard.notifications_active')}</span>
        </div>
      )}

      {/* Smart action reminders based on current step */}
      {daysSinceDeath > 0 && daysSinceDeath <= 90 && state.onboarding.banks.length > 0 && (
        <Link
          href="/fullmakt"
          className="card border-l-4 border-accent mb-4 flex items-center justify-between"
        >
          <div>
            <p className="font-medium text-primary text-sm">{t('dashboard.bankbrev_ready')}</p>
            <p className="text-xs text-muted">
              {state.onboarding.banks.length} {t('dashboard.bankbrev_ready_desc')}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-accent" />
        </Link>
      )}

      {/* Dokument-generatorer */}
      <section className="mb-5">
        <h2 className="text-base font-bold text-primary mb-3">{t('dashboard.create_documents')}</h2>
        {isSimpleDodsbo ? (
          <>
            {/* Simple dödsbo — simplified options */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Begravningsplanering', href: '/begravningsplanering', Icon: Flower2, description: 'Planera begravning och ceremoni' },
                { label: 'Dödsboanmälan', href: '/dodsboanmalan', Icon: FileX, description: 'Gör dödsboanmälan till Skatteverket' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #EEF2EA, #F7F5F0)' }}
                  aria-label={`${item.label} — ${item.description}`}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
                    <item.Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-semibold text-primary">{item.label}</span>
                </Link>
              ))}
            </div>
            {/* Info banner about simple dödsbo */}
            <div className="card border-l-4 border-accent bg-accent/5">
              <p className="text-sm text-primary font-medium">{t('dashboard.simple_dodsbo')}</p>
              <p className="text-xs text-primary/70 mt-1">
                {t('dashboard.simple_dodsbo_desc')}
              </p>
            </div>
          </>
        ) : (
          /* Full dödsbo — all options */
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Bouppteckning', href: '/bouppteckning', Icon: ClipboardList, description: 'Skapa inventarium av dödsboets tillgångar' },
              { label: 'Testamente', href: '/testamente', Icon: PenTool, description: 'Visa eller dokumentera testamente' },
              { label: 'Arvskifte', href: '/arvskifteshandling', Icon: ScrollText, description: 'Skapa arvskifteshandling' },
              { label: 'Dödsboanmälan', href: '/dodsboanmalan', Icon: FileX, description: 'Gör dödsboanmälan till Skatteverket' },
              { label: 'Bankbrev', href: '/bankbrev', Icon: Landmark, description: 'Skapa bankbrev för bankmeddelanden' },
              { label: 'Dödsannons', href: '/dodsannons', Icon: Newspaper, description: 'Publicera dödsannons' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #EEF2EA, #F7F5F0)' }}
                aria-label={`${item.label} — ${item.description}`}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
                  <item.Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold text-primary">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Verktyg & guider */}
      <section className="mb-5">
        <h2 className="text-base font-bold text-primary mb-3">{t('dashboard.tools_guides')}</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Begravning', href: '/begravningsplanering', Icon: Flower2, description: 'Planera begravning och ceremoni' },
            { label: 'Skatteverket', href: '/skatteverket-guide', Icon: FileCheck, description: 'Guide för Skatteverket-ärenden' },
            { label: 'Minnesida', href: '/minnesida', Icon: Heart, description: 'Skapa minnesida för den avlidne' },
            ...(state.delagare.length > 1 ? [{ label: 'Samarbete', href: '/samarbete', Icon: Handshake, description: 'Samarbeta med dödsbodelägare' }] : []),
            { label: 'Mike Ross', href: '/juridisk-hjalp', Icon: Bot, description: 'Juridisk AI-assistent' },
            { label: 'Exportera', href: '/exportera', Icon: Package, description: 'Exportera dödsbodata' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #EEF2EA, #F7F5F0)' }}
              aria-label={`${item.label} — ${item.description}`}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
                <item.Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold text-primary">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Legal disclaimer */}
      <p className="text-xs text-center text-muted mt-4 mb-4 px-2">
        {t('dashboard.legal_disclaimer')}
      </p>

      <BottomNav />

      {/* BankID Modal */}
      {showBankIDModal && (
        <BankIDVerification
          onVerified={() => {
            setIsBankIDVerified(true);
            setShowBankIDModal(false);
          }}
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
