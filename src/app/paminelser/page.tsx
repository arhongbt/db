'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, BellOff, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import {
  getNotificationPrefs,
  saveNotificationPrefs,
  requestNotificationPermission,
  getNotificationPermission,
  calculateUpcomingReminders,
  checkAndNotifyDeadlines,
} from '@/lib/notifications';
import { DEFAULT_TIDSFRISTER } from '@/types';

function PaminelserContent() {
  const { state } = useDodsbo();
  const [prefs, setPrefs] = useState(getNotificationPrefs());
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const toggleNotifications = async () => {
    if (!prefs.enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        const newPrefs = { ...prefs, enabled: true };
        setPrefs(newPrefs);
        saveNotificationPrefs(newPrefs);
        setPermission('granted');

        // Trigger check immediately
        if (state.deathDate) {
          checkAndNotifyDeadlines(state.deathDate, DEFAULT_TIDSFRISTER);
        }
      }
    } else {
      const newPrefs = { ...prefs, enabled: false };
      setPrefs(newPrefs);
      saveNotificationPrefs(newPrefs);
    }
  };

  const toggleReminderDay = (day: number) => {
    const current = prefs.reminderDays;
    const newDays = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort((a, b) => b - a);
    const newPrefs = { ...prefs, reminderDays: newDays };
    setPrefs(newPrefs);
    saveNotificationPrefs(newPrefs);
  };

  // Calculate all deadlines
  const deadlineItems = useMemo(() => {
    if (!state.deathDate) return [];

    const death = new Date(state.deathDate);
    const now = new Date();

    return DEFAULT_TIDSFRISTER.map(d => {
      const deadline = new Date(death);
      deadline.setDate(deadline.getDate() + d.offsetDays);
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...d,
        deadline,
        daysLeft,
        status: daysLeft <= 0 ? 'passed' as const : daysLeft <= 7 ? 'urgent' as const : daysLeft <= 30 ? 'soon' as const : 'ok' as const,
      };
    }).sort((a, b) => a.daysLeft - b.daysLeft);
  }, [state.deathDate]);

  const upcoming = deadlineItems.filter(d => d.status !== 'passed');
  const passed = deadlineItems.filter(d => d.status === 'passed');

  return (
    <div className="min-h-dvh bg-background">
      <div className="px-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">Påminnelser & Tidsfrister</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          Få push-notiser innan viktiga tidsfrister löper ut.
        </p>

        {/* Notification toggle */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {prefs.enabled ? (
                <Bell className="w-5 h-5 text-accent" />
              ) : (
                <BellOff className="w-5 h-5 text-muted" />
              )}
              <div>
                <p className="font-semibold text-primary text-sm">Push-notiser</p>
                <p className="text-xs text-muted">
                  {prefs.enabled ? 'Aktiverade' : 'Avaktiverade'}
                  {permission === 'denied' && ' (blockerade i webbläsaren)'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                prefs.enabled ? 'bg-accent' : 'bg-gray-300'
              }`}
              disabled={permission === 'denied'}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                prefs.enabled ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {prefs.enabled && (
            <div>
              <p className="text-xs text-muted mb-2">Påminn mig:</p>
              <div className="flex flex-wrap gap-2">
                {[14, 7, 3, 1].map(day => (
                  <button
                    key={day}
                    onClick={() => toggleReminderDay(day)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      prefs.reminderDays.includes(day)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-primary border-border hover:border-accent'
                    }`}
                  >
                    {day} {day === 1 ? 'dag' : 'dagar'} före
                  </button>
                ))}
              </div>
            </div>
          )}

          {permission === 'denied' && (
            <div className="mt-3 bg-[#FEF3EE] rounded-lg p-3">
              <p className="text-xs text-warn">
                Notiser är blockerade i din webbläsare. Gå till webbläsarens inställningar för att tillåta notiser från denna sida.
              </p>
            </div>
          )}
        </div>

        {!state.deathDate && (
          <div className="card text-center py-8">
            <Clock className="w-8 h-8 mx-auto text-muted mb-3 opacity-30" />
            <p className="text-sm text-muted">Ange dödsdatum i inställningarna för att se tidsfrister.</p>
            <Link href="/installningar" className="text-xs text-accent hover:underline mt-2 inline-block">
              Gå till inställningar
            </Link>
          </div>
        )}

        {/* Upcoming deadlines */}
        {upcoming.length > 0 && (
          <>
            <h2 className="font-semibold text-primary text-sm mb-3">
              Kommande tidsfrister ({upcoming.length})
            </h2>
            <div className="space-y-3 mb-6">
              {upcoming.map(d => (
                <div
                  key={d.id}
                  className={`card border-l-4 ${
                    d.status === 'urgent' ? 'border-warn' :
                    d.status === 'soon' ? 'border-amber-400' :
                    'border-accent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-start gap-2">
                      {d.status === 'urgent' ? (
                        <AlertTriangle className="w-4 h-4 text-warn mt-0.5 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-primary text-sm">{d.title}</p>
                        <p className="text-xs text-muted mt-1">{d.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className={`text-lg font-bold ${
                        d.status === 'urgent' ? 'text-warn' :
                        d.status === 'soon' ? 'text-amber-600' :
                        'text-primary'
                      }`}>
                        {d.daysLeft}
                      </p>
                      <p className="text-xs text-muted">dagar</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-2">
                    {d.deadline.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {d.consequence && (
                    <p className="text-xs text-warn mt-1">
                      Om du missar: {d.consequence}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Passed deadlines */}
        {passed.length > 0 && (
          <>
            <h2 className="font-semibold text-muted text-sm mb-3">
              Passerade ({passed.length})
            </h2>
            <div className="space-y-2 mb-6">
              {passed.map(d => (
                <div key={d.id} className="card opacity-60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <p className="text-sm text-primary">{d.title}</p>
                    <span className="text-xs text-muted ml-auto">
                      {Math.abs(d.daysLeft)} dagar sedan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaminelserPage() {
  return (
    <DodsboProvider>
      <PaminelserContent />
    </DodsboProvider>
  );
}
