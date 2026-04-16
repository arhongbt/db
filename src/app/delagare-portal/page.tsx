'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import {
  ArrowLeft, Users, Share2, CheckCircle2, Clock, AlertTriangle,
  Copy, Check, Mail, Phone, ChevronDown, ChevronUp, UserPlus, Link2, X, Loader2,
} from 'lucide-react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { createInvite, getInviteLink } from '@/lib/supabase/services/invite-service';

function DelagarePortalContent() {
  const { state } = useDodsbo();
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Calculate overall progress
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.status === 'klar').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Phase labels
  const phaseLabels: Record<string, string> = {
    akut: t('Akut (dag 1-7)', 'Emergency (day 1-7)'),
    kartlaggning: t('Kartläggning', 'Mapping'),
    bouppteckning: t('Bouppteckning', 'Estate inventory'),
    arvskifte: t('Arvskifte', 'Inheritance division'),
    avslutat: t('Avslutat', 'Completed'),
  };

  // Key milestones
  const milestones = useMemo(() => {
    const items = [
      { label: t('Bank kontaktad', 'Bank contacted'), done: state.tasks.some(t => t.id?.includes('bank') && t.status === 'klar') },
      { label: t('Försäkringar kontrollerade', 'Insurance checked'), done: state.forsakringar.length > 0 && state.forsakringar.every(f => f.contacted) },
      { label: t('Bouppteckning påbörjad', 'Estate inventory started'), done: state.forrattningsdatum !== undefined },
      { label: t('Tillgångar inventerade', 'Assets inventoried'), done: state.tillgangar.length > 0 },
      { label: t('Skulder kartlagda', 'Debts mapped'), done: state.skulder.length >= 0 && state.tasks.some(t => t.id?.includes('skuld') && t.status === 'klar') },
      { label: t('Arvskifte genomfört', 'Inheritance divided'), done: state.currentStep === 'avslutat' },
    ];
    return items;
  }, [state, t]);

  // Summary stats
  const totalTillgangar = state.tillgangar.reduce((s, t) => s + (t.confirmedValue || t.estimatedValue || 0), 0);
  const totalSkulder = state.skulder.reduce((s, sk) => s + (sk.amount || 0), 0);
  const totalKostnader = state.kostnader.reduce((s, k) => s + (k.amount || 0), 0);

  const shareLink = () => {
    const text = `Dödsbo för ${state.deceasedName}\n\nStatus: ${phaseLabels[state.currentStep]}\nFramsteg: ${progressPercent}% (${completedTasks}/${totalTasks} uppgifter)\n\nDelägare: ${state.delagare.map(d => d.name).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="px-4 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 rounded-full">
          <ArrowLeft className="w-4 h-4" /> {t('Dashboard', 'Dashboard')}
        </Link>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-display text-primary">{t('Delägare & Status', 'Co-owners & Status')}</h1>
          </div>
          <button
            onClick={shareLink}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-dark transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copiedLink ? t('Kopierat!', 'Copied!') : t('Dela status', 'Share status')}
          </button>
        </div>
        <p className="text-muted text-sm mb-6">
          {t('Överblick för alla dödsbodelägare — framsteg, milstolpar och ekonomi.', 'Overview for all co-owners — progress, milestones, and finances.')}
        </p>

        {/* Overall progress */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted">{t('Nuvarande fas', 'Current phase')}</p>
              <p className="font-display text-primary">{phaseLabels[state.currentStep]}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">{progressPercent}%</p>
              <p className="text-xs text-muted">{completedTasks}/{totalTasks} {t('klara', 'done')}</p>
            </div>
          </div>
          <div className="h-3 bg-primary-lighter rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="card mb-4">
          <p className="font-display text-primary text-sm mb-3">{t('Milstolpar', 'Milestones')}</p>
          <div className="space-y-2">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                {m.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-muted shrink-0" />
                )}
                <span className={`text-sm ${m.done ? 'text-primary line-through opacity-60' : 'text-primary'}`}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Economic summary */}
        <div className="card mb-4">
          <p className="font-display text-primary text-sm mb-3">{t('Ekonomisk sammanfattning', 'Financial summary')}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">{t('Tillgångar', 'Assets')} ({state.tillgangar.length} {t('st', 'pcs')})</span>
              <span className="text-primary font-medium">{totalTillgangar.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">{t('Skulder', 'Debts')} ({state.skulder.length} {t('st', 'pcs')})</span>
              <span className="text-warn font-medium">-{totalSkulder.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">{t('Kostnader', 'Costs')} ({state.kostnader.length} {t('st', 'pcs')})</span>
              <span className="text-warn font-medium">-{totalKostnader.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="border-t border-[#E8E4DE] pt-2 flex justify-between text-sm font-semibold">
              <span className="text-primary">{t('Nettobehållning', 'Net value')}</span>
              <span className={(totalTillgangar - totalSkulder - totalKostnader) >= 0 ? 'text-success' : 'text-warn'}>
                {(totalTillgangar - totalSkulder - totalKostnader).toLocaleString('sv-SE')} kr
              </span>
            </div>
          </div>
        </div>

        {/* Delägare list */}
        <div className="mb-4">
          <p className="font-display text-primary text-sm mb-3">
            {t('Dödsbodelägare', 'Co-owners')} ({state.delagare.length})
          </p>
          {state.delagare.length === 0 ? (
            <div className="card text-center py-6">
              <Users className="w-8 h-8 mx-auto text-muted mb-2 opacity-30" />
              <p className="text-sm text-muted">{t('Inga delägare registrerade ännu.', 'No co-owners registered yet.')}</p>
              <Link href="/delagare" className="text-xs text-accent hover:underline mt-1 inline-block">
                {t('Lägg till delägare', 'Add co-owner')}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {state.delagare.map(d => (
                <div key={d.id} className="card">
                  <button
                    onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-lighter rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-primary text-sm">{d.name}</p>
                        <p className="text-xs text-muted capitalize">{d.relation.replace('_', '/')}</p>
                      </div>
                    </div>
                    {expandedId === d.id ? (
                      <ChevronUp className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </button>

                  {expandedId === d.id && (
                    <div className="mt-3 pt-3 border-t border-[#E8E4DE] space-y-2 animate-fadeIn">
                      {d.email && (
                        <a href={`mailto:${d.email}`} className="flex items-center gap-2 text-xs text-accent">
                          <Mail className="w-3.5 h-3.5" /> {d.email}
                        </a>
                      )}
                      {d.phone && (
                        <a href={`tel:${d.phone}`} className="flex items-center gap-2 text-xs text-accent">
                          <Phone className="w-3.5 h-3.5" /> {d.phone}
                        </a>
                      )}
                      {d.personnummer && (
                        <p className="text-xs text-muted">Personnummer: {d.personnummer}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite section */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display text-primary text-sm">{t('Bjud in delägare', 'Invite co-owners')}</p>
            <button
              onClick={() => { setShowInvite(!showInvite); setInviteLink(null); setInviteError(null); }}
              className="flex items-center gap-1 text-xs text-accent"
            >
              {showInvite ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {showInvite ? t('Stäng', 'Close') : t('Ny inbjudan', 'New invitation')}
            </button>
          </div>

          {!showInvite && (
            <p className="text-xs text-muted">
              {t('Skicka en inbjudningslänk till medarvingar så de kan följa dödsboprocessen.', 'Send an invitation link to co-heirs so they can follow the estate process.')}
            </p>
          )}

          {showInvite && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted block mb-1">{t('E-postadress', 'Email address')}</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder={t('namn@exempel.se', 'name@example.com')}
                  className="w-full px-3 py-2 border-2 border-[#E8E4DE] rounded-2xl text-sm
                             focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={async () => {
                  if (!inviteEmail.trim()) return;
                  setInviteLoading(true);
                  setInviteError(null);
                  setInviteLink(null);
                  try {
                    // Use a placeholder dodsbo_id — in production this comes from Supabase
                    const dodsboId = 'supabaseId' in state ? String((state as Record<string, unknown>).supabaseId) : 'local';
                    const { data, error } = await createInvite(dodsboId, inviteEmail);
                    if (error) throw error;
                    if (data) {
                      setInviteLink(getInviteLink(data.token));
                    }
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : t('Kunde inte skapa inbjudan', 'Could not create invitation');
                    setInviteError(msg);
                  } finally {
                    setInviteLoading(false);
                  }
                }}
                disabled={inviteLoading || !inviteEmail.trim()}
                className="w-full py-2.5 bg-accent text-white text-sm font-medium rounded-xl
                           hover:bg-accent/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {inviteLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('Skapar...', 'Creating...')}</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> {t('Skapa inbjudningslänk', 'Create invitation link')}</>
                )}
              </button>

              {inviteError && (
                <p className="text-xs text-warn">{inviteError}</p>
              )}

              {inviteLink && (
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-3">
                  <p className="text-xs text-muted mb-2">{t('Länk skapad! Dela med delägaren:', 'Link created! Share with the co-owner:')}</p>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={inviteLink}
                      className="flex-1 text-xs bg-white border border-[#E8E4DE] rounded-2xl px-2 py-1.5 text-primary"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLink);
                        setLinkCopied(true);
                        setTimeout(() => setLinkCopied(false), 2000);
                      }}
                      className="p-2 bg-accent text-white rounded-2xl shrink-0"
                    >
                      {linkCopied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    </button>
                  </div>
                  {linkCopied && <p className="text-xs text-accent mt-1">{t('Kopierat!', 'Copied!')}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming deadlines */}
        {state.deathDate && (
          <div className="card mb-4">
            <p className="font-display text-primary text-sm mb-3">{t('Kommande tidsfrister', 'Upcoming deadlines')}</p>
            {(() => {
              const deathDate = new Date(state.deathDate);
              const now = new Date();
              const deadlines = [
                { label: t('Bouppteckning (förrättning)', 'Estate inventory (execution)'), days: 90 },
                { label: t('Bouppteckning (inlämning)', 'Estate inventory (submission)'), days: 120 },
                { label: t('Klander av testamente', 'Will challenge'), days: 180 },
              ].map(d => {
                const deadline = new Date(deathDate);
                deadline.setDate(deadline.getDate() + d.days);
                const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return { ...d, deadline, daysLeft };
              }).filter(d => d.daysLeft > 0);

              if (deadlines.length === 0) {
                return <p className="text-xs text-muted">{t('Alla tidsfrister har passerat.', 'All deadlines have passed.')}</p>;
              }

              return (
                <div className="space-y-2">
                  {deadlines.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-primary">{d.label}</span>
                      <span className={`text-xs font-medium ${d.daysLeft <= 14 ? 'text-warn' : d.daysLeft <= 30 ? 'text-amber-600' : 'text-muted'}`}>
                        {d.daysLeft} {t('dagar kvar', 'days left')}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DelagarePortalPage() {
  return (
    <DodsboProvider>
      <DelagarePortalContent />
    </DodsboProvider>
  );
}
