'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import { OptionCard } from '@/components/ui/OptionCard';
import { getArvsordning } from '@/lib/arvsordning';
import {
  Plus,
  X,
  Users,
  Scale,
  Info,
  ChevronDown,
  ChevronUp,
  Send,
  Copy,
  CheckCircle2,
  Clock,
  Link2,
} from 'lucide-react';
import {
  createInvite,
  getInvites,
  getInviteLink,
  revokeInvite,
} from '@/lib/supabase/services/invite-service';
import type { Relation, Dodsbodelaware } from '@/types';
import type { Database } from '@/lib/supabase/types';

type InviteRow = Database['public']['Tables']['invites']['Row'];

const createRELATION_LABELS = (t: any) => ({
  make_maka: t('Make/maka', 'Spouse'),
  sambo: t('Sambo', 'Cohabiting partner'),
  barn: t('Barn', 'Child'),
  barnbarn: t('Barnbarn', 'Grandchild'),
  foralder: t('Förälder', 'Parent'),
  syskon: t('Syskon', 'Sibling'),
  annan_slakting: t('Annan släkting', 'Other relative'),
  testamentstagare: t('Testamentstagare', 'Beneficiary'),
  god_man: t('God man', 'Legal guardian'),
  ombud: t('Ombud', 'Authorized representative'),
  vardnadshavare: t('Vårdnadshavare', 'Custodian'),
  foralder_avliden: t('Förälder till den avlidne', 'Parent of deceased'),
  van_annan: t('Vän/annan', 'Friend/Other'),
} as Record<Relation, string>);

function DelagareContent() {
  const { t } = useLanguage();
  const { state, dispatch, loading } = useDodsbo();
  const [showForm, setShowForm] = useState(false);
  const [showArvsinfo, setShowArvsinfo] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<Relation | ''>('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Invite state
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [inviting, setInviting] = useState<string | null>(null);

  // Load invites
  const loadInvites = useCallback(async () => {
    if (!state.id) return;
    const { data } = await getInvites(state.id);
    setInvites(data ?? []);
  }, [state.id]);

  useEffect(() => {
    if (!loading && state.id) loadInvites();
  }, [loading, state.id, loadInvites]);

  // Send invite
  const handleInvite = async (delagareEmail: string) => {
    if (!state.id || !delagareEmail) return;
    setInviting(delagareEmail);
    const { data } = await createInvite(state.id, delagareEmail);
    if (data) {
      setInvites((prev) => [data, ...prev]);
      const link = getInviteLink(data.token);
      await navigator.clipboard.writeText(link);
      setCopiedToken(data.token);
      setTimeout(() => setCopiedToken(null), 3000);
    }
    setInviting(null);
  };

  // Get invite status for an email
  const getInviteStatus = (emailAddr: string): InviteRow | undefined => {
    return invites.find(
      (inv) => inv.invited_email === emailAddr.toLowerCase() && inv.status !== 'revoked'
    );
  };

  if (loading) return (
    <div className="min-h-dvh bg-background p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
      <div className="h-16 bg-gray-200 rounded-2xl mb-4" />
      <div className="h-16 bg-gray-200 rounded-2xl" />
    </div>
  );

  const arvsinfo = getArvsordning(
    state.onboarding.familySituation,
    state.onboarding.hasTestamente
  );

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t('Namn krävs', 'Name required');
    if (!relation) errs.relation = t('Välj relation', 'Select relation');
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = t('Ogiltig e-postadress', 'Invalid email address');
    }
    if (phone.trim() && !/^[\d\s\-+()]{6,20}$/.test(phone.trim())) {
      errs.phone = t('Ogiltigt telefonnummer', 'Invalid phone number');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    const delagare: Dodsbodelaware = {
      id: crypto.randomUUID(),
      name: name.trim(),
      relation: relation as Relation,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      isDelagare: true,
    };

    dispatch({ type: 'ADD_DELAGARE', payload: delagare });
    setName('');
    setRelation('');
    setPhone('');
    setEmail('');
    setErrors({});
    setShowForm(false);
  };

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Dödsbodelägare
          </h1>
          <p className="text-muted text-sm mt-1">
            Alla som har rätt till arvet
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-light transition-colors"
          aria-label="Lägg till dödsbodelägare"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Arvsordning info */}
      <button
        onClick={() => setShowArvsinfo(!showArvsinfo)}
        className="card flex items-center justify-between mb-4 w-full text-left"
      >
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-accent" />
          <span className="font-medium text-primary">Arvsordning</span>
        </div>
        {showArvsinfo ? (
          <ChevronUp className="w-5 h-5 text-muted" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted" />
        )}
      </button>

      {showArvsinfo && (
        <div className="card mb-4 border-l-4 border-accent">
          <p className="font-medium text-primary mb-3">{arvsinfo.summary}</p>

          <div className="space-y-2 mb-4">
            {arvsinfo.details.map((d, i) => (
              <p key={i} className="text-sm text-primary/80">{d}</p>
            ))}
          </div>

          {/* Heirs table */}
          <div className="bg-primary-lighter/30 rounded-card p-3 mb-3">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              Vem ärver?
            </p>
            {arvsinfo.heirs.map((h, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-[#E8E4DE] last:border-0">
                <span className="text-sm font-medium">{h.relation}</span>
                <span className="text-sm text-muted">{h.share}</span>
              </div>
            ))}
          </div>

          {arvsinfo.warnings.length > 0 && (
            <div className="warning-box">
              {arvsinfo.warnings.map((w, i) => (
                <p key={i} className="text-sm mb-1 last:mb-0">{w}</p>
              ))}
            </div>
          )}

          <p className="text-xs text-muted mt-3">
            Lagrum: {arvsinfo.lawRefs.join(', ')}
          </p>
        </div>
      )}

      {/* Delägare list */}
      {state.delagare.length === 0 && !showForm ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-medium text-primary mb-2">
            Inga delägare tillagda ännu
          </h2>
          <p className="text-muted text-sm max-w-xs">
            Lägg till de som ska vara med i processen. Ni kan stötta varandra genom detta.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {state.delagare.map((d) => {
            const invite = d.email ? getInviteStatus(d.email) : undefined;
            const isInvited = invite?.status === 'pending';
            const isAccepted = invite?.status === 'accepted';

            return (
              <div key={d.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-primary">{d.name}</p>
                    <p className="text-sm text-muted">
                      {RELATION_LABELS[d.relation]}
                    </p>
                    {d.phone && (
                      <p className="text-sm text-muted mt-1">{d.phone}</p>
                    )}
                    {d.email && (
                      <p className="text-sm text-accent mt-0.5">{d.email}</p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      dispatch({ type: 'REMOVE_DELAGARE', payload: d.id })
                    }
                    className="p-2 text-muted hover:text-warn transition-colors"
                    aria-label={`Ta bort ${d.name}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Invite actions */}
                {d.email && (
                  <div className="mt-3 pt-3 border-t border-[#E8E4DE] flex items-center gap-2">
                    {isAccepted ? (
                      <span className="flex items-center gap-1.5 text-xs text-success">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Har tillgång
                      </span>
                    ) : isInvited ? (
                      <>
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                          <Clock className="w-3.5 h-3.5" />
                          Inbjudan skickad
                        </span>
                        <button
                          onClick={async () => {
                            const link = getInviteLink(invite!.token);
                            await navigator.clipboard.writeText(link);
                            setCopiedToken(invite!.token);
                            setTimeout(() => setCopiedToken(null), 3000);
                          }}
                          className="ml-auto flex items-center gap-1 text-xs text-accent hover:text-primary transition-colors"
                        >
                          {copiedToken === invite?.token ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Kopierad!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Kopiera länk
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleInvite(d.email!)}
                        disabled={inviting === d.email}
                        className="flex items-center gap-1.5 text-xs text-accent hover:text-primary transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {inviting === d.email ? 'Skapar länk...' : 'Bjud in att följa dödsboet'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="card border-2 border-accent mb-4">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Lägg till dödsbodelägare
          </h3>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Namn *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              placeholder="Förnamn Efternamn"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none ${errors.name ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
              autoFocus
            />
            {errors.name && <span className="text-xs text-warn mt-1 block">{errors.name}</span>}
          </label>

          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">Relation *</span>
            <div className="grid grid-cols-2 gap-2">
              {(
                ['make_maka', 'sambo', 'barn', 'barnbarn', 'foralder', 'syskon', 'annan_slakting', 'testamentstagare'] as Relation[]
              ).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRelation(r); setErrors((p) => ({ ...p, relation: '' })); }}
                  className={`py-2.5 px-3 rounded-card text-sm font-medium border-2 transition-colors ${
                    relation === r
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : errors.relation
                      ? 'border-warn/50 text-muted hover:border-warn'
                      : 'border-[#E8E4DE] text-muted hover:border-gray-300'
                  }`}
                >
                  {RELATION_LABELS[r]}
                </button>
              ))}
            </div>
            {errors.relation && <span className="text-xs text-warn mt-1 block">{errors.relation}</span>}
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">Telefon</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })); }}
              placeholder="070-123 45 67"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none ${errors.phone ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
            />
            {errors.phone && <span className="text-xs text-warn mt-1 block">{errors.phone}</span>}
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-primary mb-1 block">E-post</span>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              placeholder="namn@exempel.se"
              className={`w-full min-h-touch px-4 py-3 text-base border-2 rounded-card focus:outline-none ${errors.email ? 'border-warn' : 'border-[#E8E4DE] focus:border-accent'}`}
            />
            {errors.email && <span className="text-xs text-warn mt-1 block">{errors.email}</span>}
          </label>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">
              Avbryt
            </button>
            <button
              onClick={handleAdd}
              disabled={!name.trim() || !relation}
              className="btn-primary flex-1"
            >
              Lägg till
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function DelagarePage() {
  return (
    <DodsboProvider>
      <DelagareContent />
    </DodsboProvider>
  );
}
