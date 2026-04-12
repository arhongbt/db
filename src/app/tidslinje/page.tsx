'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  ChevronRight,
  Calendar,
  Flag,
} from 'lucide-react';
import { MikeRossTip } from '@/components/ui/MikeRossTip';
import { DEFAULT_TIDSFRISTER } from '@/types';
import type { ProcessStep } from '@/types';

interface TimelinePhase {
  id: ProcessStep;
  label: string;
  period: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const PHASES: TimelinePhase[] = [
  {
    id: 'akut',
    label: 'Nödbroms',
    period: 'Dag 1–7',
    color: 'text-warn',
    bgColor: 'bg-[#FEF3EE]',
    borderColor: 'border-warn',
  },
  {
    id: 'kartlaggning',
    label: 'Kartläggning',
    period: 'Vecka 1–4',
    color: 'text-accent',
    bgColor: 'bg-info-light',
    borderColor: 'border-accent',
  },
  {
    id: 'bouppteckning',
    label: 'Bouppteckning',
    period: 'Månad 1–3',
    color: 'text-primary',
    bgColor: 'bg-primary-lighter/30',
    borderColor: 'border-primary',
  },
  {
    id: 'arvskifte',
    label: 'Arvskifte',
    period: 'Månad 3–6',
    color: 'text-success',
    bgColor: 'bg-accent/5',
    borderColor: 'border-success',
  },
];

function TidslinjeContent() {
  const { state, loading } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || loading) {
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

  const deathDate = state.deathDate ? new Date(state.deathDate) : null;
  const daysSinceDeath = deathDate
    ? Math.floor((Date.now() - deathDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Determine current phase
  const currentPhase: ProcessStep =
    daysSinceDeath <= 7
      ? 'akut'
      : daysSinceDeath <= 30
      ? 'kartlaggning'
      : daysSinceDeath <= 90
      ? 'bouppteckning'
      : 'arvskifte';

  // Count tasks per phase
  const tasksByPhase = (phase: ProcessStep) =>
    state.tasks.filter((t) => t.step === phase);
  const doneByPhase = (phase: ProcessStep) =>
    state.tasks.filter((t) => t.step === phase && t.status === 'klar');

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      <h1 className="text-2xl font-semibold text-primary mb-2">Tidslinje</h1>

      <MikeRossTip text="Tidsfrister i dödsbo är lag, inte rekommendationer. Bouppteckning ska lämnas till Skatteverket inom 4 månader — missar ni det riskerar ni böter. Hyresrätt måste sägas upp inom 1 månad, annars fortsätter hyran löpa. Börja tidigt." />

      {deathDate && (
        <p className="text-muted mb-6">
          Dag {daysSinceDeath} — {deathDate.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}

      {/* Visual timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

        {PHASES.map((phase, i) => {
          const tasks = tasksByPhase(phase.id);
          const done = doneByPhase(phase.id);
          const isActive = currentPhase === phase.id;
          const isPast =
            PHASES.findIndex((p) => p.id === currentPhase) > i;
          const isFuture =
            PHASES.findIndex((p) => p.id === currentPhase) < i;

          return (
            <div key={phase.id} className="relative pl-14 pb-8 last:pb-0">
              {/* Timeline dot */}
              <div
                className={`absolute left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${
                  isPast
                    ? 'border-success bg-success'
                    : isActive
                    ? `${phase.borderColor} bg-white`
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isPast && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
                {isActive && (
                  <div className={`w-2 h-2 rounded-full ${phase.borderColor.replace('border', 'bg')}`} />
                )}
              </div>

              {/* Phase card */}
              <div
                className={`card border-l-4 ${phase.borderColor} ${
                  isActive ? 'ring-2 ring-accent/20' : ''
                } ${isFuture ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className={`text-lg font-semibold ${phase.color}`}>
                      {phase.label}
                    </h2>
                    <p className="text-sm text-muted">{phase.period}</p>
                  </div>
                  {isActive && (
                    <span className="px-2.5 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                      Du är här
                    </span>
                  )}
                  {isPast && (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  )}
                </div>

                {/* Progress */}
                {tasks.length > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>{done.length}/{tasks.length} klara</span>
                      <span>{Math.round((done.length / tasks.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div
                        className="h-1.5 bg-success rounded-full transition-all"
                        style={{ width: `${(done.length / tasks.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Key deadlines in this phase */}
                {DEFAULT_TIDSFRISTER
                  .filter((t) => {
                    if (phase.id === 'akut') return t.offsetDays <= 7;
                    if (phase.id === 'kartlaggning') return t.offsetDays > 7 && t.offsetDays <= 30;
                    if (phase.id === 'bouppteckning') return t.offsetDays > 30 && t.offsetDays <= 120;
                    return t.offsetDays > 120;
                  })
                  .map((deadline) => {
                    const daysLeft = deadline.offsetDays - daysSinceDeath;
                    const isOverdue = daysLeft < 0;
                    return (
                      <div
                        key={deadline.id}
                        className="flex items-center gap-2 py-1.5 text-sm"
                      >
                        {isOverdue ? (
                          <AlertTriangle className="w-4 h-4 text-warn flex-shrink-0" />
                        ) : daysLeft <= 7 ? (
                          <Clock className="w-4 h-4 text-warn flex-shrink-0" />
                        ) : (
                          <Calendar className="w-4 h-4 text-muted flex-shrink-0" />
                        )}
                        <span className="flex-1 text-primary/80">{deadline.title}</span>
                        <span
                          className={`text-xs font-medium ${
                            isOverdue ? 'text-warn' : daysLeft <= 7 ? 'text-warn' : 'text-muted'
                          }`}
                        >
                          {isOverdue
                            ? `${Math.abs(daysLeft)}d sedan`
                            : `${daysLeft}d kvar`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {/* End marker */}
        <div className="relative pl-14 pt-2">
          <div className="absolute left-3 w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10">
            <Flag className="w-3 h-3 text-gray-400" />
          </div>
          <p className="text-sm text-muted font-medium">Dödsboet avslutat</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function TidslinjePage() {
  return (
    <DodsboProvider>
      <TidslinjeContent />
    </DodsboProvider>
  );
}
