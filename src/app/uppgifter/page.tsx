'use client';

import { useEffect, useState } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import { generateTasks } from '@/lib/tasks';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Filter,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import type { DodsboTask, ProcessStep, TaskStatus } from '@/types';

const STEP_LABELS: Record<ProcessStep, string> = {
  akut: 'Nödbroms (dag 1–7)',
  kartlaggning: 'Kartläggning (vecka 1–4)',
  bouppteckning: 'Bouppteckning (månad 1–3)',
  arvskifte: 'Arvskifte (månad 3–6)',
  avslutat: 'Avslutat',
};

const STEP_COLORS: Record<ProcessStep, string> = {
  akut: 'border-warn bg-[#FEF3EE]',
  kartlaggning: 'border-accent bg-info-light',
  bouppteckning: 'border-primary bg-primary-lighter/30',
  arvskifte: 'border-success bg-green-50',
  avslutat: 'border-gray-400 bg-gray-50',
};

const PRIORITY_ICON: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  akut: { icon: AlertTriangle, color: 'text-warn' },
  viktig: { icon: Clock, color: 'text-accent' },
  normal: { icon: Circle, color: 'text-muted' },
  kan_vanta: { icon: Circle, color: 'text-gray-300' },
};

function UppgifterContent() {
  const { state, dispatch, loading } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [filterStep, setFilterStep] = useState<ProcessStep | 'all'>('all');
  const [showDone, setShowDone] = useState(false);
  const [advancedTo, setAdvancedTo] = useState<ProcessStep | null>(null);
  const [recentlyDone, setRecentlyDone] = useState<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);

  // Generate tasks from onboarding if none exist
  const tasks = state.tasks.length > 0
    ? state.tasks
    : generateTasks(state.onboarding);

  if (!mounted || loading) return (
    <div className="min-h-dvh bg-background p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="h-10 bg-gray-200 rounded-full mb-6" />
      <div className="space-y-3">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  );

  const filtered = tasks.filter((t) => {
    if (filterStep !== 'all' && t.step !== filterStep) return false;
    if (!showDone && t.status === 'klar' && !recentlyDone.has(t.id)) return false;
    return true;
  });

  // Group by step
  const grouped = filtered.reduce<Record<string, DodsboTask[]>>((acc, t) => {
    const key = t.step;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const deathDate = state.deathDate ? new Date(state.deathDate) : null;
  const daysSinceDeath = deathDate
    ? Math.floor((Date.now() - deathDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const statusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'klar':
        return <CheckCircle2 className="w-6 h-6 text-success" />;
      case 'pagaende':
        return <Clock className="w-6 h-6 text-accent" />;
      default:
        return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  const STEP_ORDER: ProcessStep[] = ['akut', 'kartlaggning', 'bouppteckning', 'arvskifte', 'avslutat'];

  const toggleStatus = (task: DodsboTask) => {
    const next: TaskStatus = task.status === 'klar' ? 'ej_paborjad' : 'klar';
    dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, status: next } });

    // Keep recently completed tasks visible briefly before hiding
    if (next === 'klar' && !showDone) {
      setRecentlyDone((prev) => new Set(prev).add(task.id));
      setTimeout(() => {
        setRecentlyDone((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
      }, 1200);
    }

    // Auto-advance: if completing a task, check if all tasks in current step are now done
    if (next === 'klar') {
      const currentStepTasks = tasks.filter((t) => t.step === state.currentStep);
      const allDoneAfter = currentStepTasks.every(
        (t) => t.id === task.id ? true : t.status === 'klar'
      );

      if (allDoneAfter) {
        const currentIndex = STEP_ORDER.indexOf(state.currentStep);
        if (currentIndex < STEP_ORDER.length - 1) {
          const nextStep = STEP_ORDER[currentIndex + 1];
          dispatch({ type: 'SET_STEP', payload: nextStep });
          setAdvancedTo(nextStep);
          setTimeout(() => setAdvancedTo(null), 4000);
        }
      }
    }
  };

  const totalDone = tasks.filter((t) => t.status === 'klar').length;

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-primary">Att göra</h1>
        <p className="text-muted text-sm mt-1">
          {totalDone}/{tasks.length} uppgifter klara
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-2 bg-success rounded-full transition-all duration-500"
          style={{ width: `${tasks.length > 0 ? (totalDone / tasks.length) * 100 : 0}%` }}
        />
      </div>

      {/* Auto-advance celebration */}
      {advancedTo && (
        <div className="card border-l-4 border-success bg-green-50 mb-4 animate-slideUp">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <p className="font-medium text-primary text-sm">
              Alla uppgifter klara! Du har gått vidare till: {STEP_LABELS[advancedTo]}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1" role="tablist" aria-label="Filtrera uppgifter">
        <button
          onClick={() => setFilterStep('all')}
          role="tab"
          aria-selected={filterStep === 'all'}
          className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filterStep === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-primary/70 hover:bg-gray-200'
          }`}
        >
          Alla
        </button>
        {(['akut', 'kartlaggning', 'bouppteckning', 'arvskifte'] as ProcessStep[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStep(s)}
            role="tab"
            aria-selected={filterStep === s}
            className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterStep === s
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-primary/70 hover:bg-gray-200'
            }`}
          >
            {STEP_LABELS[s].split(' (')[0]}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowDone(!showDone)}
        aria-pressed={showDone}
        className={`flex items-center gap-2 mb-4 px-3 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
          showDone
            ? 'bg-success/10 text-success'
            : 'text-primary/60 hover:bg-gray-100'
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        {showDone ? 'Dölj klara' : 'Visa klara'}
      </button>

      {/* Task list grouped by step */}
      {Object.entries(grouped).map(([step, stepTasks]) => (
        <div key={step} className="mb-6">
          <div className={`border-l-4 rounded-r-card px-3 py-2 mb-3 ${STEP_COLORS[step as ProcessStep]}`}>
            <h2 className="text-sm font-semibold text-primary">
              {STEP_LABELS[step as ProcessStep]}
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {stepTasks.map((task) => {
              const isOverdue =
                task.deadlineDays != null && daysSinceDeath > task.deadlineDays && task.status !== 'klar';
              return (
                <button
                  key={task.id}
                  onClick={() => toggleStatus(task)}
                  className={`card flex items-start gap-3 w-full text-left transition-all duration-300 ${
                    task.status === 'klar' && recentlyDone.has(task.id)
                      ? 'opacity-60 scale-[0.98]'
                      : task.status === 'klar'
                      ? 'opacity-60'
                      : ''
                  } ${isOverdue ? 'border-l-4 border-warn' : ''}`}
                >
                  {statusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        task.status === 'klar'
                          ? 'line-through text-muted'
                          : 'text-primary'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-muted mt-0.5 line-clamp-2">
                      {task.description}
                    </p>
                    {task.deadlineDays != null && task.status !== 'klar' && (
                      <p
                        className={`text-xs font-medium mt-1 ${
                          isOverdue ? 'text-warn' : 'text-accent'
                        }`}
                      >
                        {isOverdue
                          ? `${daysSinceDeath - task.deadlineDays} dagar försenad`
                          : `${task.deadlineDays - daysSinceDeath} dagar kvar`}
                      </p>
                    )}
                    {task.externalUrl && task.status !== 'klar' && (
                      <span className="inline-flex items-center gap-1 text-xs text-accent mt-1">
                        <ExternalLink className="w-3 h-3" />
                        Länk
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-success mb-4" />
          <h2 className="text-lg font-medium text-primary">
            {showDone ? 'Inga uppgifter i denna kategori' : 'Alla uppgifter klara!'}
          </h2>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function UppgifterPage() {
  return (
    <DodsboProvider>
      <UppgifterContent />
    </DodsboProvider>
  );
}
