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
} from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import type { DodsboTask, ProcessStep, TaskStatus } from '@/types';
import { DEFAULT_TIDSFRISTER } from '@/types';
import Link from 'next/link';

function DashboardContent() {
  const { state } = useDodsbo();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

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

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      {/* Greeting */}
      <div className="mb-6">
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

      {/* Current phase card */}
      <div
        className={`card border-l-4 mb-6 ${stepColors[state.currentStep]}`}
      >
        <p className="text-sm font-medium opacity-80 mb-1">Du är i fasen</p>
        <p className="text-lg font-semibold">
          {stepLabels[state.currentStep]}
        </p>
      </div>

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

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-3">
          Nästa steg
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Lägg till dödsbodelägare', href: '/delagare' },
            { label: 'Inventera tillgångar & skulder', href: '/tillgangar' },
            { label: 'Kontrollera försäkringar', href: '/forsakringar' },
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
