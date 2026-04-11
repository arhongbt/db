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
} from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import type { DodsboTask, ProcessStep, TaskStatus } from '@/types';
import { DEFAULT_TIDSFRISTER } from '@/types';
import Link from 'next/link';

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

  useEffect(() => setMounted(true), []);
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
            { label: 'Lägg till dödsbodelägare', href: '/delagare' },
            { label: 'Inventera tillgångar & skulder', href: '/tillgangar' },
            { label: 'Kontrollera försäkringar', href: '/forsakringar' },
            { label: 'Bouppteckning', href: '/bouppteckning' },
            { label: 'Kallelse till förrättning', href: '/kallelse' },
            { label: 'Arvskifte', href: '/arvskifte' },
            { label: 'Fullmakter & mallar', href: '/fullmakt' },
            { label: 'Avsluta konton', href: '/avsluta-konton' },
            { label: 'Dödsbokostnader', href: '/kostnader' },
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
