'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Bell, BellOff, Clock, AlertTriangle, CheckCircle2, ChevronRight,
  Mail, Trash2, Plus, Zap, Calendar
} from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
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

interface CustomReminder {
  id: string;
  title: string;
  date: string;
  enabled: boolean;
}

function PaminelserContent() {
  const { state } = useDodsbo();
  const [prefs, setPrefs] = useState(getNotificationPrefs());
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [customReminders, setCustomReminders] = useState<CustomReminder[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');

  useEffect(() => {
    setPermission(getNotificationPermission());
    // Load custom reminders and preferences from localStorage
    const saved = localStorage.getItem('customReminders');
    if (saved) setCustomReminders(JSON.parse(saved));

    const savedPush = localStorage.getItem('pushNotificationsEnabled');
    if (savedPush) setPushEnabled(JSON.parse(savedPush));

    const savedEmail = localStorage.getItem('emailRemindersEnabled');
    if (savedEmail) setEmailEnabled(JSON.parse(savedEmail));

    const savedEmailAddr = localStorage.getItem('emailAddress');
    if (savedEmailAddr) setEmailAddress(savedEmailAddr);
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

  const togglePushNotifications = () => {
    const newState = !pushEnabled;
    setPushEnabled(newState);
    localStorage.setItem('pushNotificationsEnabled', JSON.stringify(newState));
  };

  const toggleEmailReminders = () => {
    const newState = !emailEnabled;
    setEmailEnabled(newState);
    localStorage.setItem('emailRemindersEnabled', JSON.stringify(newState));
  };

  const saveEmailAddress = () => {
    localStorage.setItem('emailAddress', emailAddress);
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

  const addCustomReminder = () => {
    if (newReminderTitle && newReminderDate) {
      const reminder: CustomReminder = {
        id: Date.now().toString(),
        title: newReminderTitle,
        date: newReminderDate,
        enabled: true,
      };
      const updated = [...customReminders, reminder];
      setCustomReminders(updated);
      localStorage.setItem('customReminders', JSON.stringify(updated));
      setNewReminderTitle('');
      setNewReminderDate('');
      setShowAddReminder(false);
    }
  };

  const deleteCustomReminder = (id: string) => {
    const updated = customReminders.filter(r => r.id !== id);
    setCustomReminders(updated);
    localStorage.setItem('customReminders', JSON.stringify(updated));
  };

  const toggleCustomReminder = (id: string) => {
    const updated = customReminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setCustomReminders(updated);
    localStorage.setItem('customReminders', JSON.stringify(updated));
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

  // Combine and sort all reminders (legal + custom)
  const allUpcoming = useMemo(() => {
    const customDates = customReminders
      .filter(r => r.enabled)
      .map(r => {
        const date = new Date(r.date);
        const now = new Date();
        const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          id: r.id,
          title: r.title,
          date,
          daysLeft,
          isCustom: true,
        };
      });

    return [...upcoming, ...customDates].sort((a, b) => a.daysLeft - b.daysLeft);
  }, [upcoming, customReminders]);

  return (
    <div className="min-h-dvh bg-background pb-24">
      <div className="px-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">Påminnelser & Tidsfrister</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          Få notifieringar innan viktiga tidsfrister löper ut.
        </p>

        {/* Timeline visualization */}
        {state.deathDate && allUpcoming.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl p-4" style={{ borderColor: '#E8E4DE', borderWidth: 1 }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-primary text-sm">Tidslinje kommande</h3>
            </div>
            <div className="space-y-2">
              {allUpcoming.slice(0, 4).map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${
                      item.daysLeft <= 7 ? 'bg-red-500' :
                      item.daysLeft <= 30 ? 'bg-amber-400' :
                      'bg-accent'
                    }`} />
                    {idx < allUpcoming.length - 1 && <div className="w-0.5 h-6 bg-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary truncate">{item.title}</p>
                    <p className="text-xs text-muted">{item.daysLeft} dagar</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Push Notifications */}
        <div className="mb-4 bg-white rounded-2xl p-4" style={{ borderColor: '#E8E4DE', borderWidth: 1 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {pushEnabled ? (
                <Bell className="w-5 h-5 text-accent" />
              ) : (
                <BellOff className="w-5 h-5 text-muted" />
              )}
              <div>
                <p className="font-semibold text-primary text-sm">Push-notiser (pretend)</p>
                <p className="text-xs text-muted">
                  {pushEnabled ? 'Aktiverade' : 'Avaktiverade'}
                </p>
              </div>
            </div>
            <button
              onClick={togglePushNotifications}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                pushEnabled ? 'bg-[#6B7F5E]' : 'bg-[#E8E4DE]'
              }`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                pushEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {pushEnabled && (
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
        </div>

        {/* Email Reminders */}
        <div className="mb-6 bg-white rounded-2xl p-4" style={{ borderColor: '#E8E4DE', borderWidth: 1 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {emailEnabled ? (
                <Mail className="w-5 h-5 text-accent" />
              ) : (
                <Mail className="w-5 h-5 text-muted opacity-50" />
              )}
              <div>
                <p className="font-semibold text-primary text-sm">E-post påminnelser (pretend)</p>
                <p className="text-xs text-muted">
                  {emailEnabled ? 'Aktiverade' : 'Avaktiverade'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleEmailReminders}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                emailEnabled ? 'bg-[#6B7F5E]' : 'bg-[#E8E4DE]'
              }`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                emailEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {emailEnabled && (
            <div>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                onBlur={saveEmailAddress}
                placeholder="din@email.com"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ borderColor: '#E8E4DE' }}
              />
              <p className="text-xs text-muted mt-2">Vi skickar påminnelser till denna adress.</p>
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

        {/* Upcoming deadlines (legal defaults) */}
        {upcoming.length > 0 && (
          <>
            <h2 className="font-semibold text-primary text-sm mb-3">
              Svenska juridiska tidsfrister ({upcoming.length})
            </h2>
            <div className="space-y-3 mb-6">
              {upcoming.map(d => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl p-4"
                  style={{ borderColor: '#E8E4DE', borderWidth: 1, borderLeftColor: d.status === 'urgent' ? '#E85C4D' : d.status === 'soon' ? '#D4A574' : '#6B7F5E', borderLeftWidth: 4 }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-start gap-2 flex-1">
                      {d.status === 'urgent' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-primary text-sm">{d.title}</p>
                        <p className="text-xs text-muted mt-1">{d.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className={`text-lg font-bold ${
                        d.status === 'urgent' ? 'text-red-500' :
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
                    <p className="text-xs text-red-500 mt-1">
                      Om du missar: {d.consequence}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Custom Reminders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-primary text-sm">
              Egna påminnelser ({customReminders.filter(r => r.enabled).length})
            </h2>
            <button
              onClick={() => setShowAddReminder(!showAddReminder)}
              className="flex items-center gap-1 text-xs text-accent hover:text-accent"
            >
              <Plus className="w-4 h-4" /> Lägg till
            </button>
          </div>

          {showAddReminder && (
            <div className="mb-4 bg-white rounded-2xl p-4" style={{ borderColor: '#E8E4DE', borderWidth: 1 }}>
              <input
                type="text"
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                placeholder="T.ex. Kontakta banken"
                className="w-full text-sm px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ borderColor: '#E8E4DE' }}
              />
              <input
                type="date"
                value={newReminderDate}
                onChange={(e) => setNewReminderDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ borderColor: '#E8E4DE' }}
              />
              <button
                onClick={addCustomReminder}
                className="w-full bg-accent text-white text-sm px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Spara påminnelse
              </button>
            </div>
          )}

          {customReminders.length > 0 ? (
            <div className="space-y-2">
              {customReminders.map(reminder => {
                const reminderDate = new Date(reminder.date);
                const now = new Date();
                const daysLeft = Math.ceil((reminderDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={reminder.id}
                    className="bg-white rounded-2xl p-4 flex items-center justify-between"
                    style={{ borderColor: '#E8E4DE', borderWidth: 1 }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCustomReminder(reminder.id)}
                        className={`relative w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          reminder.enabled ? 'bg-accent border-accent' : 'border-border'
                        }`}
                      >
                        {reminder.enabled && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${reminder.enabled ? 'text-primary' : 'text-muted opacity-50'}`}>
                          {reminder.title}
                        </p>
                        <p className="text-xs text-muted">
                          {reminderDate.toLocaleDateString('sv-SE')} · {daysLeft > 0 ? `${daysLeft} dagar` : 'Förfallen'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCustomReminder(reminder.id)}
                      className="text-muted hover:text-red-500 transition-colors ml-2 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Inga egna påminnelser ännu. Lägg till en ovanför.</p>
            </div>
          )}
        </div>

        {/* Passed deadlines */}
        {passed.length > 0 && (
          <>
            <h2 className="font-semibold text-muted text-sm mb-3">
              Passerade ({passed.length})
            </h2>
            <div className="space-y-2 mb-6">
              {passed.map(d => (
                <div key={d.id} className="bg-white rounded-2xl p-4 opacity-60" style={{ borderColor: '#E8E4DE', borderWidth: 1 }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
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
      <BottomNav />
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
