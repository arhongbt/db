'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
// Decorations removed — caused z-index/visibility bugs on mobile
import { generateTasks } from '@/lib/tasks';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Filter,
  ChevronDown,
} from 'lucide-react';
import type { DodsboTask, ProcessStep, TaskStatus } from '@/types';

const STEP_LABELS: Record<ProcessStep, string> = {
  akut: 'Nödbroms (dag 1–7)',
  kartlaggning: 'Kartläggning (vecka 1–4)',
  bouppteckning: 'Bouppteckning (månad 1–3)',
  arvskifte: 'Arvskifte (månad 3–6)',
  avslutat: 'Avslutat',
};

const STEP_COLORS: Record<ProcessStep, { bg: string; border: string }> = {
  akut: { bg: 'rgba(196,149,106,0.06)', border: 'rgba(196,149,106,0.15)' },
  kartlaggning: { bg: 'rgba(107,127,94,0.06)', border: 'rgba(107,127,94,0.15)' },
  bouppteckning: { bg: 'rgba(139,164,184,0.06)', border: 'rgba(139,164,184,0.15)' },
  arvskifte: { bg: 'rgba(107,127,94,0.08)', border: 'rgba(107,127,94,0.18)' },
  avslutat: { bg: 'rgba(123,123,142,0.06)', border: 'rgba(123,123,142,0.12)' },
};

const PRIORITY_ICON: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  akut: { icon: AlertTriangle, color: 'text-warn' },
  viktig: { icon: Clock, color: 'text-accent' },
  normal: { icon: Circle, color: 'text-muted' },
  kan_vanta: { icon: Circle, color: 'text-gray-300' },
};

function UppgifterContent() {
  const { state, dispatch, loading } = useDodsbo();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [filterStep, setFilterStep] = useState<ProcessStep | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string | 'all'>('all');
  const [showDone, setShowDone] = useState(false);
  const [advancedTo, setAdvancedTo] = useState<ProcessStep | null>(null);
  const [recentlyDone, setRecentlyDone] = useState<Set<string>>(new Set());
  const [openAssigneeId, setOpenAssigneeId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Generate tasks from onboarding if none exist
  const tasks = state.tasks.length > 0
    ? state.tasks
    : generateTasks(state.onboarding);

  if (!mounted || loading) return (
    <div className="min-h-dvh bg-background p-6 animate-pulse">
      <div className="h-8 bg-[#E8E4DE] rounded w-1/2 mb-2" />
      <div className="h-4 bg-[#E8E4DE] rounded w-1/3 mb-6" />
      <div className="h-10 bg-[#E8E4DE] rounded-full mb-6" />
      <div className="space-y-3">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-[#E8E4DE] rounded-2xl" />)}
      </div>
    </div>
  );

  const filtered = tasks.filter((t) => {
    if (filterStep !== 'all' && t.step !== filterStep) return false;
    if (!showDone && t.status === 'klar' && !recentlyDone.has(t.id)) return false;
    if (filterAssignee !== 'all' && t.assignedTo !== filterAssignee) return false;
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
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-4 py-5 pb-24">

      <div className="mb-4">
        <h1 className="text-xl font-display text-primary">{t('Att göra', 'To do')}</h1>
        <p className="text-muted text-sm mt-1">
          {totalDone}/{tasks.length} {t('uppgifter klara', 'tasks completed')}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#E8E4DE] rounded-full mb-6">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${tasks.length > 0 ? (totalDone / tasks.length) * 100 : 0}%`,
            background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)'
          }}
        />
      </div>

      {/* Auto-advance celebration */}
      {advancedTo && (
        <div
          className="card mb-4 animate-slideUp rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))',
            border: '1px solid rgba(107,127,94,0.15)'
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <p className="font-display text-primary text-sm">
              {t('Alla uppgifter klara! Du har gått vidare till:', 'All tasks completed! You have advanced to:')} {STEP_LABELS[advancedTo]}
            </p>
          </div>
        </div>
      )}

      {/* Step filters */}
      <p className="text-xs font-medium text-muted mb-2">{t('Fas', 'Phase')}</p>
      <div className="flex gap-2 mb-5 flex-wrap" role="tablist" aria-label={t('Filtrera efter steg', 'Filter by step')}>
        <button
          onClick={() => setFilterStep('all')}
          role="tab"
          aria-selected={filterStep === 'all'}
          className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
            filterStep === 'all'
              ? 'text-white'
              : 'text-primary/70 hover:bg-[#E8E4DE]'
          }`}
          style={filterStep === 'all' ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : { background: 'var(--border-light)' }}
        >
          {t('Alla', 'All')}
        </button>
        {(['akut', 'kartlaggning', 'bouppteckning', 'arvskifte'] as ProcessStep[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStep(s)}
            role="tab"
            aria-selected={filterStep === s}
            aria-label={`Filtrera efter ${STEP_LABELS[s]}`}
            className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
              filterStep === s
                ? 'text-white'
                : 'text-primary/70 hover:bg-[#E8E4DE]'
            }`}
            style={filterStep === s ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : { background: 'var(--border-light)' }}
          >
            {STEP_LABELS[s].split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Assignee filters */}
      {state.delagare.filter((d) => d.isDelagare).length > 0 && (
        <>
          <p className="text-xs font-medium text-muted mb-2">{t('Tilldelad', 'Assigned')}</p>
          <div className="flex gap-2 mb-5 flex-wrap" role="tablist" aria-label={t('Filtrera efter tilldelning', 'Filter by assignee')}>
            <button
              onClick={() => setFilterAssignee('all')}
              role="tab"
              aria-selected={filterAssignee === 'all'}
              className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
                filterAssignee === 'all'
                  ? 'text-white'
                  : 'text-primary/70 hover:bg-[#E8E4DE]'
              }`}
              style={filterAssignee === 'all' ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : { background: 'var(--border-light)' }}
            >
              {t('Alla', 'All')}
            </button>
            {state.delagare.filter((d) => d.isDelagare).map((d) => (
              <button
                key={d.id}
                onClick={() => setFilterAssignee(d.name)}
                role="tab"
                aria-selected={filterAssignee === d.name}
                aria-label={`Filtrera uppgifter tilldelade till ${d.name}`}
                className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
                  filterAssignee === d.name
                    ? 'text-white'
                    : 'text-primary/70 hover:bg-[#E8E4DE]'
                }`}
                style={filterAssignee === d.name ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : { background: 'var(--border-light)' }}
              >
                {d.name}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        onClick={() => setShowDone(!showDone)}
        aria-pressed={showDone}
        aria-label={showDone ? t('Dölj klara uppgifter', 'Hide completed tasks') : t('Visa klara uppgifter', 'Show completed tasks')}
        className={`flex items-center gap-2 mb-4 px-3 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
          showDone
            ? 'bg-success/10 text-success'
            : 'text-primary/60 hover:bg-gray-100'
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        {showDone ? t('Dölj klara', 'Hide completed') : t('Visa klara', 'Show completed')}
      </button>

      {/* Task list grouped by step */}
      {Object.entries(grouped).map(([step, stepTasks]) => (
        <div key={step} className="mb-6">
          <div
            className="px-4 py-2.5 mb-3 rounded-2xl"
            style={{
              background: STEP_COLORS[step as ProcessStep].bg,
              border: `1px solid ${STEP_COLORS[step as ProcessStep].border}`
            }}
          >
            <h2 className="text-sm font-display text-primary">
              {STEP_LABELS[step as ProcessStep]}
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {stepTasks.map((task) => {
              const isOverdue =
                task.deadlineDays != null && daysSinceDeath > task.deadlineDays && task.status !== 'klar';
              const assignedDelaware = state.delagare.find((d) => d.name === task.assignedTo);
              const initials = assignedDelaware
                ? assignedDelaware.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                : '';

              return (
                <div
                  key={task.id}
                  className={`card flex items-start gap-3 w-full transition-all duration-300 relative rounded-2xl ${
                    task.status === 'klar' && recentlyDone.has(task.id)
                      ? 'opacity-60 scale-[0.98]'
                      : task.status === 'klar'
                      ? 'opacity-60'
                      : ''
                  }`}
                  style={{
                    borderLeft: isOverdue ? '3px solid var(--warn)' : 'none'
                  }}
                  role="listitem"
                  aria-label={`${task.title}, ${task.status === 'klar' ? 'slutförd' : 'väntande'}`}
                >
                  <button
                    onClick={() => toggleStatus(task)}
                    className="flex-shrink-0 mt-0.5"
                    aria-label={`Markera ${task.title} som ${task.status === 'klar' ? 'oavslutad' : 'slutförd'}`}
                  >
                    {statusIcon(task.status)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-display text-[15px] ${
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
                          ? t(`${daysSinceDeath - task.deadlineDays} dagar försenad`, `${daysSinceDeath - task.deadlineDays} days overdue`)
                          : t(`${task.deadlineDays - daysSinceDeath} dagar kvar`, `${task.deadlineDays - daysSinceDeath} days left`)}
                      </p>
                    )}
                  </div>

                  {/* Assignee indicator */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAssigneeId(openAssigneeId === task.id ? null : task.id);
                      }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors flex-shrink-0 ${
                        task.assignedTo
                          ? 'bg-[#6B7F5E] text-white'
                          : 'border border-[#E8E4DE] text-[#E8E4DE] hover:border-primary hover:text-primary'
                      }`}
                      aria-label={task.assignedTo ? t(`Ändra tilldelning från ${task.assignedTo}`, `Change assignment from ${task.assignedTo}`) : t('Tilldela uppgift till dödsbodelägare', 'Assign task to estate co-owner')}
                      title={task.assignedTo ? t(`Tilldelad till ${task.assignedTo}`, `Assigned to ${task.assignedTo}`) : t('Tilldela uppgift', 'Assign task')}
                    >
                      {task.assignedTo ? initials : '+'}
                    </button>

                    {/* Dropdown menu */}
                    {openAssigneeId === task.id && (
                      <div
                        className="absolute right-0 mt-1 border rounded-lg shadow-lg z-10 min-w-[160px]"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, assignedTo: '' } });
                            setOpenAssigneeId(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-muted hover:opacity-70 border-b last:border-b-0 transition-opacity"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          {t('Ingen', 'None')}
                        </button>
                        {state.delagare.filter((d) => d.isDelagare).map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, assignedTo: d.name } });
                              setOpenAssigneeId(null);
                            }}
                            className={`block w-full text-left px-3 py-2 text-sm transition-colors border-b last:border-b-0 ${
                              task.assignedTo === d.name
                                ? 'bg-[#6B7F5E]/10 text-[#6B7F5E] font-medium'
                                : 'text-primary hover:opacity-70'
                            }`}
                            style={{ borderColor: 'var(--border)' }}
                          >
                            {d.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-success mb-4" />
          <h2 className="text-lg font-display text-primary">
            {showDone ? t('Inga uppgifter i denna kategori', 'No tasks in this category') : t('Alla uppgifter klara!', 'All tasks completed!')}
          </h2>
        </div>
      )}

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
