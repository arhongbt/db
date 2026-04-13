'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { BottomNav } from '@/components/ui/BottomNav';
import { ArrowLeft, Scale, CheckCircle2, Clock, Calendar, Mail, Phone, User, Send } from 'lucide-react';

export default function BokaJuristPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: 'morning',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Bokning: Gratis juridisk rådgivning – ${form.name}`);
    const body = encodeURIComponent(
      `Hej!\n\nJag vill boka en gratis juridisk rådgivning (30 min).\n\n` +
      `Namn: ${form.name}\n` +
      `E-post: ${form.email}\n` +
      `Telefon: ${form.phone}\n` +
      `Önskat datum: ${form.preferredDate}\n` +
      `Önskad tid: ${
        form.preferredTime === 'morning' ? 'Morgon (09–12)'
        : form.preferredTime === 'lunch' ? 'Lunch (12–14)'
        : form.preferredTime === 'afternoon' ? 'Eftermiddag (14–17)'
        : 'Kväll (17–20)'
      }\n\n` +
      `Meddelande:\n${form.message || '(inget)'}\n\n` +
      `Vänliga hälsningar,\n${form.name}`
    );
    window.location.href = `mailto:jurist@sistaresan.se?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const timeSlots = [
    { value: 'morning', label: t('Morgon (09–12)', 'Morning (09–12)') },
    { value: 'lunch', label: t('Lunch (12–14)', 'Lunch (12–14)') },
    { value: 'afternoon', label: t('Eftermiddag (14–17)', 'Afternoon (14–17)') },
    { value: 'evening', label: t('Kväll (17–20)', 'Evening (17–20)') },
  ];

  return (
    <main className="min-h-dvh pb-28" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <Link
          href="/juridisk-hjalp"
          className="inline-flex items-center gap-1 text-muted mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Tillbaka', 'Back')}
        </Link>

        {/* Våg-ikon som hero */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}
          >
            <Scale className="w-10 h-10 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-bold text-primary leading-tight">
            {t('Boka juristkonsultation', 'Book a lawyer consultation')}
          </h1>
          <p className="text-sm text-muted mt-2 leading-relaxed max-w-md">
            {t(
              'Välj en tid som passar dig. En erfaren jurist går igenom dödsboet med dig — digitalt via video.',
              'Choose a time that suits you. An experienced lawyer will review the estate with you — digitally via video.'
            )}
          </p>
        </div>
      </div>

      {/* Service card — vår egna version, ingen Elfsight */}
      <div className="px-6 mb-4">
        <div
          className="rounded-2xl border p-4 flex items-start gap-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}
          >
            <Scale className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-primary">
              {t('Gratis Juridisk rådgivning', 'Free Legal Advice')}
            </h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              {t(
                'Boka tid för Gratis Juridisk Rådgivning — inga förbindelser, bara ett samtal med en jurist.',
                'Book a free legal consultation — no obligations, just a conversation with a lawyer.'
              )}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm font-semibold" style={{ color: '#6B7F5E' }}>
                {t('Gratis', 'Free')}
              </span>
              <span className="text-muted">·</span>
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                <Clock className="w-3.5 h-3.5" />
                {t('30 minuter', '30 minutes')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What you get */}
      <div className="px-6 mb-6">
        <div
          className="rounded-2xl border p-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-semibold text-primary text-sm mb-3">
            {t('Vad ingår i mötet?', 'What\u2019s included?')}
          </h3>
          <ul className="space-y-2">
            {[
              t('Genomgång av bouppteckning och arvsordning', 'Review of estate inventory and inheritance order'),
              t('Rådgivning kring bodelning och särkullbarn', 'Advice on property division and stepchildren'),
              t('Frågor om testamente och fullmakter', 'Questions on wills and powers of attorney'),
              t('Vid behov: hjälp med internationella arv och företag', 'If needed: help with international estates and businesses'),
              t('Sammanfattning och nästa steg via mejl', 'Summary and next steps via email'),
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6B7F5E' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Booking form */}
      <div className="px-6">
        <h2 className="text-lg font-bold text-primary mb-3">
          {t('Boka din tid', 'Book your time')}
        </h2>

        {submitted ? (
          <div
            className="rounded-2xl border p-6 text-center"
            style={{ background: 'var(--accent-soft)', borderColor: 'var(--border)' }}
          >
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-primary mb-1">
              {t('Förfrågan skickad!', 'Request sent!')}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {t(
                'Vår jurist återkommer inom 24 timmar med bekräftelse och möteslänk.',
                'Our lawyer will respond within 24 hours with confirmation and meeting link.'
              )}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm font-medium underline"
              style={{ color: '#6B7F5E' }}
            >
              {t('Skicka en till', 'Send another')}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border p-5 space-y-4"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {t('Ditt namn', 'Your name')}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('Förnamn Efternamn', 'First Last')}
                className="w-full px-3 py-2.5 rounded-xl border text-sm text-primary
                  focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {t('E-post', 'Email')}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="namn@exempel.se"
                className="w-full px-3 py-2.5 rounded-xl border text-sm text-primary
                  focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {t('Telefon', 'Phone')}
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="070-123 45 67"
                className="w-full px-3 py-2.5 rounded-xl border text-sm text-primary
                  focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              />
            </div>

            {/* Preferred date */}
            <div>
              <label className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {t('Önskat datum', 'Preferred date')}
              </label>
              <input
                type="date"
                required
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 rounded-xl border text-sm text-primary
                  focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              />
            </div>

            {/* Time slot */}
            <div>
              <label className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {t('Önskad tid på dagen', 'Preferred time of day')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot.value}
                    onClick={() => setForm({ ...form, preferredTime: slot.value })}
                    className="px-3 py-2.5 rounded-xl border text-xs font-medium transition-all"
                    style={{
                      background: form.preferredTime === slot.value
                        ? 'linear-gradient(135deg, #6B7F5E, #4F6145)'
                        : 'var(--bg)',
                      borderColor: form.preferredTime === slot.value ? '#4F6145' : 'var(--border)',
                      color: form.preferredTime === slot.value ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-semibold text-primary mb-1.5 block">
                {t('Kort beskrivning (valfritt)', 'Brief description (optional)')}
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t(
                  'Beskriv kort vad du behöver hjälp med...',
                  'Briefly describe what you need help with...'
                )}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border text-sm text-primary resize-none
                  focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}
            >
              <Send className="w-4 h-4" />
              {t('Skicka bokningsförfrågan', 'Send booking request')}
            </button>

            <p className="text-[11px] text-muted text-center leading-relaxed">
              {t(
                'Du får en bekräftelse via e-post inom 24 timmar med möteslänk (Google Meet/Zoom).',
                'You\u2019ll receive an email confirmation within 24 hours with meeting link (Google Meet/Zoom).'
              )}
            </p>
          </form>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
