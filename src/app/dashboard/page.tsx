'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  User,
  Calendar,
  Heart,
  Settings,
  Zap,
} from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import type { DodsboTask, ProcessStep, TaskStatus } from '@/types';
import { DEFAULT_TIDSFRISTER } from '@/types';
import Link from 'next/link';
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
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
      <div className="h-24 bg-gray-200 rounded-2xl mb-6" />
      <div className="flex gap-4 mb-6">
        <div className="h-24 bg-gray-200 rounded-2xl flex-1" />
        <div className="h-24 bg-gray-200 rounded-2xl flex-1" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="space-y-3">
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

function DashboardContent() {
  const { state, loading } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [notifStatus, setNotifStatus] = useState<'idle' | 'enabled' | 'denied' | 'unsupported'>('idle');

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
    akut: 'bg-red-50 border-warn text-warn',
    kartlaggning: 'bg-blue-50 border-accent text-accent',
    bouppteckning: 'bg-primary-lighter border-primary text-primary',
    arvskifte: 'bg-green-50 border-success text-success',
    avslutat: 'bg-gray-50 border-gray-400 text-gray-600',
  };

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
          <Heart className="w-16 h-16 text-primary-lighter mb-4" />
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

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Greeting */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            {state.deceasedName
              ? `${state.deceasedName}s dödsbo`
              : 'Ditt dödsbo'}
        </h1>
          {daysSinceDeath > 0 && (
            <p className="text-muted mt-1">
              Dag {daysSinceDeath} sedan dödsfallet
            </p>
          )}
        </div>
        <Link
          href="/installningar"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Inställningar"
        >
          <Settings className="w-5 h-5 text-muted" />
        </Link>
      </div>

      {/* Current phase card — links to timeline */}
      <Link
        href="/tidslinje"
        className={`card border-l-4 mb-6 ${stepColors[state.currentStep]} flex items-center justify-between`}
      >
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">Du är i fasen</p>
          <p className="text-lg font-semibold">
            {stepLabels[state.currentStep]}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 opacity-60" />
      </Link>

      {/* Nödbroms banner — show first 7 days */}
      {daysSinceDeath <= 7 && (
        <Link
          href="/nodbroms"
          className="card border-l-4 border-warn bg-red-50 mb-6 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-warn">Nödbroms — dag 1-7</p>
            <p className="text-sm text-primary/70">Steg-för-steg guide för de första dagarna</p>
          </div>
          <ChevronRight className="w-5 h-5 text-warn" />
        </Link>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card text-center">
          <User className="w-6 h-6 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">
            {state.delagare.length}
          </p>
          <p className="text-sm text-muted">Dödsbodelägare</p>
        </div>
        <div className="card text-center">
          <Calendar className="w-6 h-6 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">
            {upcomingDeadlines.length}
          </p>
          <p className="text-sm text-muted">Kommande frister</p>
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

        // Priority 1: Nödbroms first week
        if (daysSinceDeath <= 7 && !alreadyDone.includes('dodsbevis')) {
          top3.push({ label: 'Gå igenom nödbromsen', href: '/nodbroms', reason: 'Dag 1–7 — viktigaste stegen', color: 'border-warn bg-red-50' });
        }
        // Priority 2: Contact bank
        if (hasBanks && !alreadyDone.includes('kontaktat_bank')) {
          top3.push({ label: 'Kontakta banker', href: '/avsluta-konton', reason: `${state.onboarding.banks.length} banker att meddela`, color: 'border-accent bg-blue-50' });
        }
        // Priority 3: Add delägare
        if (!hasDelagare) {
          top3.push({ label: 'Lägg till dödsbodelägare', href: '/delagare', reason: 'Krävs för bouppteckning', color: 'border-accent bg-blue-50' });
        }
        // Priority 4: Inventera tillgångar
        if (!hasTillgangar) {
          top3.push({ label: 'Inventera tillgångar & skulder', href: '/tillgangar', reason: 'Grund för bouppteckning', color: 'border-accent bg-blue-50' });
        }
        // Priority 5: Bodelning for married
        if (isMarried) {
          top3.push({ label: 'Gör bodelning', href: '/bodelning', reason: 'Krävs innan arvskifte (gifta)', color: 'border-primary bg-primary-lighter/20' });
        }
        // Priority 6: Bouppteckning
        if (daysSinceDeath >= 14 && hasDelagare && hasTillgangar) {
          top3.push({ label: 'Förbered bouppteckning', href: '/bouppteckning', reason: `${Math.max(0, 90 - daysSinceDeath)} dagar kvar till frist`, color: 'border-primary bg-primary-lighter/20' });
        }
        // Priority 7: Försäkringar
        if (!alreadyDone.includes('kontaktat_forsakring')) {
          top3.push({ label: 'Kontrollera försäkringar', href: '/forsakringar', reason: 'Kan ge dödsfallsersättning', color: 'border-success bg-green-50' });
        }
        // Priority 8: Arvskifte
        if (state.currentStep === 'arvskifte') {
          top3.push({ label: 'Genomför arvskifte', href: '/arvskifte', reason: 'Fördela tillgångarna', color: 'border-success bg-green-50' });
        }

        const actions = top3.slice(0, 3);

        return actions.length > 0 ? (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-primary">Gör detta först</h2>
            </div>
            <div className="flex flex-col gap-2">
              {actions.map((a, i) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className={`card border-l-4 ${a.color} flex items-center justify-between`}
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
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3">
            Kommande tidsfrister
          </h2>
          <div className="flex flex-col gap-3">
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
                    <p className="font-medium text-primary">{deadline.title}</p>
                    <p className="text-sm text-muted mt-0.5">
                      {deadline.description}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        isUrgent ? 'text-warn' : 'text-accent'
                      }`}
                    >
                      {daysLeft} dagar kvar
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
        <div className="warning-box mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warn">
                {passedDeadlines.length} tidsfrist(er) har passerat
              </p>
              <p className="text-sm text-primary/70 mt-1">
                Det kan fortfarande gå att ordna. Kontrollera varje punkt.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Legal Assistant — always visible */}
      <Link
        href="/juridisk-hjalp"
        className="card border-l-4 border-accent bg-blue-50 mb-4 flex items-center justify-between"
      >
        <div>
          <p className="font-semibold text-accent">Juridisk AI-assistent</p>
          <p className="text-sm text-primary/70">Fråga om arvsrätt, bouppteckning, arvskifte</p>
        </div>
        <ChevronRight className="w-5 h-5 text-accent" />
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
          className="card border-l-4 border-primary bg-primary-lighter/20 mb-4 flex items-center justify-between w-full text-left"
        >
          <div>
            <p className="font-medium text-primary text-sm">Aktivera påminnelser</p>
            <p className="text-xs text-muted">Få notiser innan viktiga tidsfrister</p>
          </div>
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">Slå på</span>
        </button>
      )}
      {notifStatus === 'enabled' && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-xs text-muted">Påminnelser aktiva — du notifieras 7, 3 och 1 dag innan frister</span>
        </div>
      )}

      {/* Smart action reminders based on current step */}
      {daysSinceDeath > 0 && daysSinceDeath <= 90 && state.onboarding.banks.length > 0 && (
        <Link
          href="/fullmakt"
          className="card border-l-4 border-accent mb-4 flex items-center justify-between"
        >
          <div>
            <p className="font-medium text-primary text-sm">Bankbrev redo</p>
            <p className="text-xs text-muted">
              {state.onboarding.banks.length} bankbrev har genererats automatiskt
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-accent" />
        </Link>
      )}

      {/* Quick actions — contextual based on step */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-3">
          Nästa steg
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Juridisk AI-assistent', href: '/juridisk-hjalp' },
            { label: 'Lägg till dödsbodelägare', href: '/delagare' },
            { label: 'Inventera tillgångar & skulder', href: '/tillgangar' },
            { label: 'Lösöre — möbler, smycken, konst', href: '/losore' },
            { label: 'Kontrollera försäkringar', href: '/forsakringar' },
            { label: 'Bouppteckning', href: '/bouppteckning' },
            { label: 'Dödsboanmälan (enklare alternativ)', href: '/dodsboanmalan' },
            { label: 'Bodelning (gifta par)', href: '/bodelning' },
            { label: 'Kallelse till förrättning', href: '/kallelse' },
            { label: 'Arvskifte', href: '/arvskifte' },
            { label: 'Fullmakter & mallar', href: '/fullmakt' },
            { label: 'Avsluta konton', href: '/avsluta-konton' },
            { label: 'Dödsbokostnader', href: '/kostnader' },
            { label: 'Konflikter & skiftesman', href: '/konflikt' },
            { label: 'Internationella arv', href: '/internationellt' },
            { label: 'Företag i dödsbo', href: '/foretag-i-dodsbo' },
            { label: 'Ordlista — juridiska termer', href: '/ordlista' },
            { label: 'Vanliga frågor', href: '/faq' },
            { label: 'Visa alla uppgifter', href: '/uppgifter' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="card flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-medium text-primary">
                {action.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted" />
            </Link>
          ))}
        </div>
      </section>

      {/* Legal disclaimer */}
      <p className="text-xs text-center text-muted mt-6 mb-4 px-2">
        Denna app ger allmän vägledning och ersätter inte juridisk rådgivning.
        Kontakta alltid en jurist vid osäkerhet.
      </p>

      <BottomNav />
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
