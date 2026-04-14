'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { MikeRossTip } from '@/components/ui/MikeRossTip';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  AlertTriangle,
  Check,
  Share2,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  category: 'deadline' | 'möte' | 'bank' | 'juridiskt' | 'övrigt';
  notes?: string;
  isAutomatic?: boolean; // true if generated from process timeline
}

const CATEGORY_COLORS: Record<CalendarEvent['category'], { bg: string; text: string; dot: string }> = {
  deadline: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  möte: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  bank: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  juridiskt: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  övrigt: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' },
};

const CATEGORY_LABELS: Record<CalendarEvent['category'], { sv: string; en: string }> = {
  deadline: { sv: 'Deadline', en: 'Deadline' },
  möte: { sv: 'Möte', en: 'Meeting' },
  bank: { sv: 'Bank', en: 'Bank' },
  juridiskt: { sv: 'Juridiskt', en: 'Legal' },
  övrigt: { sv: 'Övrigt', en: 'Other' },
};

function generateAutomaticDeadlines(deathDate: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const death = new Date(deathDate);

  // Bouppteckning — 3 months from death
  const bouppteckning = new Date(death);
  bouppteckning.setMonth(bouppteckning.getMonth() + 3);
  events.push({
    id: 'deadline_bouppteckning',
    title: 'Bouppteckning ska vara klar',
    date: bouppteckning.toISOString().split('T')[0],
    category: 'deadline',
    isAutomatic: true,
    notes: 'Bouppteckningsförrättningen måste hållas senast 3 månader efter dödsfall',
  });

  // Skattedeklaration — May 2 each year
  const currentYear = new Date().getFullYear();
  for (let year = death.getFullYear(); year <= currentYear + 1; year++) {
    const taxDate = new Date(`${year}-05-02`);
    if (taxDate > death) {
      events.push({
        id: `deadline_skattedeklaration_${year}`,
        title: 'Skattedeklaration (Skatteverket)',
        date: taxDate.toISOString().split('T')[0],
        category: 'deadline',
        isAutomatic: true,
        notes: 'Sista dag för skattedeklaration för dödsboet',
      });
    }
  }

  // VAT (Moms) declaration — quarterly: Jan 20, Apr 20, Jul 20, Oct 20
  const vatDates = [1, 4, 7, 10];
  for (let year = death.getFullYear(); year <= currentYear + 1; year++) {
    for (const month of vatDates) {
      const vatDate = new Date(`${year}-${String(month).padStart(2, '0')}-20`);
      if (vatDate > death) {
        events.push({
          id: `deadline_moms_${year}_${month}`,
          title: 'Momsdeklaration förfallen',
          date: vatDate.toISOString().split('T')[0],
          category: 'deadline',
          isAutomatic: true,
          notes: 'Kvartalsvis momsdeklaration till Skatteverket',
        });
      }
    }
  }

  return events;
}

interface DayViewEvent extends CalendarEvent {
  timeSort: number;
}

function CalendarContent() {
  const { t } = useLanguage();
  const { state } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formCategory, setFormCategory] = useState<CalendarEvent['category']>('övrigt');
  const [formNotes, setFormNotes] = useState('');

  // Initialize from localStorage and generate automatic deadlines
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('sr_calendar_events');
    const userEvents = saved ? JSON.parse(saved) : [];

    if (state.deathDate) {
      const automaticEvents = generateAutomaticDeadlines(state.deathDate);
      setEvents([...userEvents, ...automaticEvents]);
    } else {
      setEvents(userEvents);
    }
  }, [state.deathDate]);

  // Save to localStorage when events change
  const saveEvents = (newEvents: CalendarEvent[]) => {
    const userEvents = newEvents.filter((e) => !e.isAutomatic);
    localStorage.setItem('sr_calendar_events', JSON.stringify(userEvents));
    setEvents(newEvents);
  };

  const handleAddEvent = () => {
    if (!formTitle.trim() || !formDate) {
      alert(t('Fyll i titel och datum', 'Fill in title and date'));
      return;
    }

    const newEvent: CalendarEvent = {
      id: `event_${Date.now()}`,
      title: formTitle,
      date: formDate,
      time: formTime,
      category: formCategory,
      notes: formNotes,
      isAutomatic: false,
    };

    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);

    setFormTitle('');
    setFormDate('');
    setFormTime('');
    setFormCategory('övrigt');
    setFormNotes('');
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter((e) => e.id !== id);
    saveEvents(updatedEvents);
  };

  if (!mounted) {
    return (
      <div className="min-h-dvh bg-background p-6 animate-pulse">
        <div className="h-8 bg-[#E8E4DE] rounded w-1/2 mb-2" />
        <div className="h-4 bg-[#E8E4DE] rounded w-1/3 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-[#E8E4DE] rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Calendar view setup
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: (number | null)[] = [];
  for (let i = 1; i < startingDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthName = new Intl.DateTimeFormat('sv-SE', { month: 'long', year: 'numeric' }).format(currentDate);

  const getEventsForDate = (day: number): CalendarEvent[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
  const selectedDayEvents: DayViewEvent[] = selectedDate
    ? events
        .filter((e) => e.date === selectedDate)
        .map((e) => ({
          ...e,
          timeSort: e.time ? parseInt(e.time.replace(':', '')) : 0,
        }))
        .sort((a, b) => (a.timeSort || 9999) - (b.timeSort || 9999))
    : [];

  return (
    <div className="flex flex-col px-5 py-6 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-[#E8E4DE] transition-colors"
          aria-label={t('Tillbaka', 'Back')}
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#6B7F5E]" />
            {t('Kalender', 'Calendar')}
          </h1>
          <p className="text-muted text-sm mt-1">
            {t('Dela med andra dödsbodelägare', 'Share with other heirs')}
          </p>
        </div>
      </div>

      {/* Mike Ross Tip */}
      <MikeRossTip
        text={t(
          'Här samlas alla viktiga datum för dödsboet — både juridiska tidsfrister och möten ni planerar tillsammans. Frister för bouppteckning, skattedeklaration och momsdeklaration sätts automatiskt så att ni aldrig glömmer.',
          'Here all important dates for the estate are collected — both legal deadlines and meetings you plan together. Deadlines for estate inventory, tax returns and VAT declarations are set automatically so you never forget.'
        )}
        className="mb-5"
      />

      {/* Share hint card */}
      <div className="card border-l-4 border-[#6B7F5E] bg-green-50 mb-5 flex items-start gap-3">
        <Share2 className="w-5 h-5 text-[#6B7F5E] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary">{t('Framtida funktion', 'Coming soon')}</p>
          <p className="text-xs text-primary/70 mt-1">
            {t('Du kommer snart kunna dela kalendern säkert med andra delägare och få uppdateringar i realtid.', 'You will soon be able to safely share the calendar with other heirs and receive real-time updates.')}
          </p>
        </div>
      </div>

      {/* Month view or day view toggle */}
      {!selectedDate ? (
        <>
          {/* Month header */}
          <div className="card mb-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="p-2 hover:bg-background rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('Föregående månad', 'Previous month')}
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <h2 className="text-lg font-semibold text-primary capitalize">{monthName}</h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-2 hover:bg-background rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('Nästa månad', 'Next month')}
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((day, i) => (
              <div key={i} className="text-center text-xs font-semibold text-muted py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-6 card p-2">
            {days.map((day, i) => {
              const dateStr = day
                ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                : '';
              const dayEvents = day ? getEventsForDate(day) : [];
              const hasDeadline = dayEvents.some((e) => e.category === 'deadline');
              const isToday =
                day &&
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <button
                  key={i}
                  onClick={() => day && setSelectedDate(dateStr)}
                  className={`aspect-square p-1 rounded-lg text-xs font-medium flex flex-col items-center justify-between transition-colors relative ${
                    !day
                      ? 'text-transparent'
                      : isToday
                      ? 'bg-[#6B7F5E] text-white'
                      : dayEvents.length > 0
                      ? 'bg-primary/5 text-primary hover:bg-primary/10'
                      : 'text-primary hover:bg-[#E8E4DE]'
                  }`}
                  aria-label={day ? `${day} ${monthName}` : ''}
                >
                  {day && (
                    <>
                      <span>{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 justify-center">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`w-1 h-1 rounded-full ${CATEGORY_COLORS[event.category].dot}`}
                            />
                          ))}
                          {dayEvents.length > 2 && <div className="w-1 h-1 bg-gray-300 rounded-full" />}
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add event button */}
          <button
            onClick={() => {
              setShowAddEvent(!showAddEvent);
              setSelectedDate(null);
            }}
            className="w-full card bg-[#6B7F5E] text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-[#5a6d50] transition-colors"
            aria-label={t('Lägg till händelse', 'Add event')}
          >
            <Plus className="w-5 h-5" />
            {t('Lägg till händelse', 'Add event')}
          </button>
        </>
      ) : (
        <>
          {/* Day view header */}
          <div className="card mb-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedDate(null)}
              className="p-2 hover:bg-background rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('Tillbaka till månadsvyn', 'Back to month view')}
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <h2 className="text-lg font-semibold text-primary">
              {selectedDateObj?.toLocaleDateString('sv-SE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-2 hover:bg-background rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('Stäng dagsvy', 'Close day view')}
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          {/* Events for selected day */}
          {selectedDayEvents.length > 0 ? (
            <div className="space-y-3 mb-6">
              {selectedDayEvents.map((event) => {
                const colors = CATEGORY_COLORS[event.category];
                return (
                  <div key={event.id} className={`card border-l-4 ${colors.bg} ${colors.text}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold">{event.title}</p>
                        {event.time && (
                          <p className="text-sm flex items-center gap-1 mt-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-white/60">
                            {t(CATEGORY_LABELS[event.category].sv, CATEGORY_LABELS[event.category].en)}
                          </span>
                          {event.isAutomatic && (
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-white/60">
                              {t('Automatisk', 'Automatic')}
                            </span>
                          )}
                        </div>
                        {event.notes && (
                          <p className="text-sm mt-2 opacity-80">{event.notes}</p>
                        )}
                      </div>
                      {!event.isAutomatic && (
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
                          aria-label={t('Ta bort händelse', 'Delete event')}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-muted text-sm">{t('Inga händelser denna dag', 'No events this day')}</p>
            </div>
          )}

          {/* Quick add form for selected day */}
          <button
            onClick={() => {
              setShowAddEvent(!showAddEvent);
              setFormDate(selectedDate || '');
            }}
            className="w-full card bg-[#6B7F5E] text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-[#5a6d50] transition-colors"
            aria-label={t('Lägg till händelse denna dag', 'Add event this day')}
          >
            <Plus className="w-5 h-5" />
            {t('Lägg till händelse', 'Add event')}
          </button>
        </>
      )}

      {/* Add event form modal */}
      {showAddEvent && (
        <div className="card border-2 border-[#6B7F5E] mb-6 p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-primary">{t('Ny händelse', 'New event')}</h3>
            <button
              onClick={() => {
                setShowAddEvent(false);
                setFormTitle('');
                setFormDate('');
                setFormTime('');
                setFormCategory('övrigt');
                setFormNotes('');
              }}
              className="p-1 hover:bg-background rounded-full"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Titel', 'Title')}</span>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder={t('T.ex. Möte med advokat', 'E.g. Meeting with lawyer')}
              className="w-full px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-card focus:border-[#6B7F5E] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Datum', 'Date')}</span>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-card focus:border-[#6B7F5E] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Tid (valfritt)', 'Time (optional)')}</span>
            <input
              type="time"
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-card focus:border-[#6B7F5E] focus:outline-none"
            />
          </label>

          <div>
            <span className="text-sm font-medium text-primary mb-2 block">{t('Kategori', 'Category')}</span>
            <div className="grid grid-cols-2 gap-2">
              {(['deadline', 'möte', 'bank', 'juridiskt', 'övrigt'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormCategory(cat)}
                  className={`py-2 px-3 rounded-card text-sm font-medium border-2 transition-colors ${
                    formCategory === cat
                      ? `border-[#6B7F5E] ${CATEGORY_COLORS[cat].bg} text-primary`
                      : 'border-[#E8E4DE] text-muted hover:border-[#6B7F5E]/50'
                  }`}
                >
                  {t(CATEGORY_LABELS[cat].sv, CATEGORY_LABELS[cat].en)}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-primary mb-1 block">{t('Anteckning (valfritt)', 'Note (optional)')}</span>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder={t('Mer information om denna händelse...', 'More information about this event...')}
              rows={2}
              className="w-full px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-card focus:border-[#6B7F5E] focus:outline-none resize-none"
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setShowAddEvent(false);
                setFormTitle('');
                setFormDate('');
                setFormTime('');
                setFormCategory('övrigt');
                setFormNotes('');
              }}
              className="btn-secondary flex-1"
            >
              {t('Avbryt', 'Cancel')}
            </button>
            <button
              onClick={handleAddEvent}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {t('Spara', 'Save')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function KalenderPage() {
  return (
    <DodsboProvider>
      <CalendarContent />
    </DodsboProvider>
  );
}
