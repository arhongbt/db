'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { ArrowLeft, Handshake, Bot, Check, Clock, AlertCircle, Plus, Trash2, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getBeslut, addBeslut, updateBeslut, deleteBeslut, getAnteckningar, addAnteckning, deleteAnteckning } from '@/lib/supabase/services/samarbete-service';

function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: '#E8F0E8' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

type DecisionStatus = 'Väntar' | 'Pågår' | 'Alla godkänt';

interface Decision {
  id: string;
  title: string;
  status: DecisionStatus;
  approvals: Record<string, boolean>;
  lastUpdated: string;
  createdAt: string;
}

interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface TimelineEntry {
  id: string;
  date: string;
  type: 'decision' | 'note';
  description: string;
  icon: 'check' | 'clock' | 'alert' | 'comment';
}

const PREDEFINED_DECISIONS = [
  { sv: 'Godkänna bouppteckning', en: 'Approve estate inventory' },
  { sv: 'Godkänna arvskifte', en: 'Approve inheritance division' },
  { sv: 'Sälja bostad', en: 'Sell property' },
  { sv: 'Sälja fordon', en: 'Sell vehicle' },
  { sv: 'Fördela lösöre', en: 'Distribute movable assets' }
];

function getStatusColor(status: DecisionStatus): string {
  switch (status) {
    case 'Väntar':
      return '#FCD34D';
    case 'Pågår':
      return '#60A5FA';
    case 'Alla godkänt':
      return '#34D399';
    default:
      return '#D1D5DB';
  }
}

function getStatusIcon(status: DecisionStatus) {
  switch (status) {
    case 'Väntar':
      return <Clock className="w-4 h-4" />;
    case 'Pågår':
      return <AlertCircle className="w-4 h-4" />;
    case 'Alla godkänt':
      return <Check className="w-4 h-4" />;
  }
}

function TabBeslut() {
  const { t } = useLanguage();
  const { state } = useDodsbo();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDecisionTitle, setNewDecisionTitle] = useState('');
  const [selectedPredefined, setSelectedPredefined] = useState('');
  const [dodsboId, setDodsboId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        const stored = localStorage.getItem('samarbete-beslut');
        if (stored) {
          setDecisions(JSON.parse(stored));
        } else {
          const initial: Decision[] = PREDEFINED_DECISIONS.map((item) => ({
            id: Math.random().toString(36).substr(2, 9),
            title: item.sv,
            status: 'Väntar' as DecisionStatus,
            approvals: state.delagare.reduce((acc, del) => { acc[del.name] = false; return acc; }, {} as Record<string, boolean>),
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }));
          setDecisions(initial);
          localStorage.setItem('samarbete-beslut', JSON.stringify(initial));
        }
        return;
      }
      const { data: dodsbon } = await supabase.from('dodsbon').select('id').order('created_at').limit(1);
      const dbId = dodsbon?.[0]?.id ?? null;
      setDodsboId(dbId);
      if (dbId) {
        const { data } = await getBeslut(dbId);
        if (data && data.length > 0) {
          setDecisions(data.map(row => ({ id: row.id, title: row.title, status: row.status, approvals: row.approvals, lastUpdated: row.updated_at, createdAt: row.created_at })));
        } else {
          for (const item of PREDEFINED_DECISIONS) {
            const approvals = state.delagare.reduce((acc, del) => { acc[del.name] = false; return acc; }, {} as Record<string, boolean>);
            await addBeslut(dbId, item.sv, approvals);
          }
          const { data: seeded } = await getBeslut(dbId);
          if (seeded) setDecisions(seeded.map(row => ({ id: row.id, title: row.title, status: row.status, approvals: row.approvals, lastUpdated: row.updated_at, createdAt: row.created_at })));
        }
      }
    });
  }, [state.delagare]);

  const updateDecision = async (id: string, updatedDecision: Decision) => {
    setDecisions(prev => prev.map(d => d.id === id ? updatedDecision : d));
    if (dodsboId) {
      await updateBeslut(id, { status: updatedDecision.status, approvals: updatedDecision.approvals });
    } else {
      const updated = decisions.map(d => d.id === id ? updatedDecision : d);
      localStorage.setItem('samarbete-beslut', JSON.stringify(updated));
    }
  };

  const toggleApproval = (decisionId: string, delagareName: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;
    const newApprovals = { ...decision.approvals };
    newApprovals[delagareName] = !newApprovals[delagareName];
    const allApproved = Object.values(newApprovals).every(v => v === true);
    const newStatus: DecisionStatus = allApproved ? 'Alla godkänt' : 'Väntar';
    updateDecision(decisionId, { ...decision, approvals: newApprovals, status: newStatus, lastUpdated: new Date().toISOString() });
  };

  const addDecision = async () => {
    const title = selectedPredefined || newDecisionTitle;
    if (!title.trim()) return;
    const approvals = state.delagare.reduce((acc, del) => { acc[del.name] = false; return acc; }, {} as Record<string, boolean>);
    if (dodsboId) {
      const { data } = await addBeslut(dodsboId, title, approvals);
      if (data) setDecisions(prev => [...prev, { id: data.id, title: data.title, status: data.status, approvals: data.approvals, lastUpdated: data.updated_at, createdAt: data.created_at }]);
    } else {
      const newDecision: Decision = { id: Math.random().toString(36).substr(2, 9), title, status: 'Väntar', approvals, lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() };
      const updated = [...decisions, newDecision];
      setDecisions(updated);
      localStorage.setItem('samarbete-beslut', JSON.stringify(updated));
    }
    setNewDecisionTitle('');
    setSelectedPredefined('');
    setShowAddForm(false);
  };

  const deleteDecision = async (id: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
    if (dodsboId) {
      await deleteBeslut(id);
    } else {
      localStorage.setItem('samarbete-beslut', JSON.stringify(decisions.filter(d => d.id !== id)));
    }
  };

  return (
    <div>
      <MikeRossTip text={t('Alla dödsbodelägare måste vara överens om beslut. Här kan ni hålla koll på vilka beslut som tagits och vem som godkänt.', 'All estate owners must agree on decisions. Here you can track what decisions have been made and who has approved them.')} />

      <div className="space-y-4 mb-6">
        {decisions.map((decision) => (
          <div key={decision.id} className="bg-white border rounded-2xl p-4" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-display text-primary mb-2">{decision.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-xs font-semibold"
                    style={{ background: getStatusColor(decision.status) }}
                  >
                    {getStatusIcon(decision.status)}
                    {t(decision.status, decision.status === 'Väntar' ? 'Pending' : decision.status === 'Pågår' ? 'In progress' : 'All approved')}
                  </div>
                  <span className="text-xs text-muted-light">
                    {new Date(decision.lastUpdated).toLocaleDateString('sv-SE')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteDecision(decision.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {state.delagare.map((delagare) => (
                <label key={delagare.name} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={decision.approvals[delagare.name] || false}
                    onChange={() => toggleApproval(decision.id, delagare.name)}
                    className="w-4 h-4 rounded cursor-pointer accent-accent"
                  />
                  <span className="text-sm text-primary">
                    {delagare.name} <span className="text-xs text-muted-light">({delagare.relation})</span>
                  </span>
                  {decision.approvals[delagare.name] && (
                    <Check className="w-4 h-4 text-accent ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 border-2 border-dashed border-accent text-accent font-semibold rounded-[20px] hover:bg-accent/5 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('Lägg till beslut', 'Add decision')}
        </button>
      ) : (
        <div className="bg-white border rounded-2xl p-4 mb-6" style={{ borderRadius: '28px' }}>
          <h3 className="font-display text-primary mb-3">{t('Lägg till nytt beslut', 'Add new decision')}</h3>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-primary mb-2">{t('Välj fördefinierat beslut', 'Choose predefined decision')}</label>
            <select
              value={selectedPredefined}
              onChange={(e) => setSelectedPredefined(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
            >
              <option value="">-- {t('Välj', 'Choose')} --</option>
              {PREDEFINED_DECISIONS.map((item) => (
                <option key={item.sv} value={item.sv}>
                  {t(item.sv, item.en)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-primary mb-2">{t('Eller skriv eget beslut', 'Or write your own decision')}</label>
            <input
              type="text"
              value={newDecisionTitle}
              onChange={(e) => setNewDecisionTitle(e.target.value)}
              placeholder={t('Skriva här...', 'Write here...')}
              className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={addDecision}
              className="flex-1 py-2.5 bg-accent text-white font-semibold rounded-[20px] hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
            >
              {t('Lägg till', 'Add')}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewDecisionTitle('');
                setSelectedPredefined('');
              }}
              className="flex-1 py-2.5 border border-[#E8E4DE] text-primary font-semibold rounded-[20px] hover:bg-background transition"
            >
              {t('Avbryt', 'Cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabAnteckningar() {
  const { t } = useLanguage();
  const { state } = useDodsbo();
  const [notes, setNotes] = useState<Note[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [dodsboId, setDodsboId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        const stored = localStorage.getItem('samarbete-anteckningar');
        if (stored) setNotes(JSON.parse(stored));
        return;
      }
      const { data: dodsbon } = await supabase.from('dodsbon').select('id').order('created_at').limit(1);
      const dbId = dodsbon?.[0]?.id ?? null;
      setDodsboId(dbId);
      if (dbId) {
        const { data } = await getAnteckningar(dbId);
        if (data) setNotes(data.map(row => ({ id: row.id, author: row.author, content: row.content, timestamp: row.created_at })));
      } else {
        const stored = localStorage.getItem('samarbete-anteckningar');
        if (stored) setNotes(JSON.parse(stored));
      }
    });
  }, []);

  const addNote = async () => {
    if (!author.trim() || !content.trim()) return;
    if (dodsboId) {
      const { data } = await addAnteckning(dodsboId, author, content);
      if (data) setNotes(prev => [{ id: data.id, author: data.author, content: data.content, timestamp: data.created_at }, ...prev]);
    } else {
      const newNote: Note = { id: Math.random().toString(36).substr(2, 9), author, content, timestamp: new Date().toISOString() };
      const updated = [newNote, ...notes];
      setNotes(updated);
      localStorage.setItem('samarbete-anteckningar', JSON.stringify(updated));
    }
    setAuthor('');
    setContent('');
  };

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (dodsboId) {
      await deleteAnteckning(id);
    } else {
      localStorage.setItem('samarbete-anteckningar', JSON.stringify(notes.filter(n => n.id !== id)));
    }
  };

  return (
    <div>
      <MikeRossTip text={t('Skriv anteckningar som alla delägare kan se. Perfekt för att dokumentera telefonsamtal, överenskommelser eller viktiga detaljer.', 'Write notes that all co-owners can see. Perfect for documenting phone calls, agreements or important details.')} />

      <div className="bg-white border rounded-2xl p-4 mb-6" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
        <h3 className="font-display text-primary mb-3">{t('Ny anteckning', 'New note')}</h3>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-primary mb-2">{t('Författare', 'Author')}</label>
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
          >
            <option value="">-- {t('Välj namn', 'Choose name')} --</option>
            {state.delagare.map((del) => (
              <option key={del.name} value={del.name}>
                {del.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-primary mb-2">{t('Anteckning', 'Note')}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('Skriv här...', 'Write here...')}
            className="w-full px-4 py-3 border border-[#E8E4DE] rounded-[20px] text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={addNote}
          className="w-full py-2.5 bg-accent text-white font-semibold rounded-[20px] hover:opacity-90 transition"
          style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
        >
          {t('Lägg till anteckning', 'Add note')}
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-white border rounded-2xl p-4" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-primary text-sm">{note.author}</p>
                <p className="text-xs text-muted-light">
                  {new Date(note.timestamp).toLocaleString('sv-SE')}
                </p>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-primary leading-relaxed">{note.content}</p>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-light text-sm">{t('Inga anteckningar än', 'No notes yet')}</p>
        </div>
      )}
    </div>
  );
}

function TabTidslinje() {
  const { t } = useLanguage();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        const storedDecisions = localStorage.getItem('samarbete-beslut');
        if (storedDecisions) setDecisions(JSON.parse(storedDecisions));
        const storedNotes = localStorage.getItem('samarbete-anteckningar');
        if (storedNotes) setNotes(JSON.parse(storedNotes));
        return;
      }
      const { data: dodsbon } = await supabase.from('dodsbon').select('id').order('created_at').limit(1);
      const dbId = dodsbon?.[0]?.id ?? null;
      if (dbId) {
        const { data: beslutData } = await getBeslut(dbId);
        if (beslutData) setDecisions(beslutData.map(row => ({ id: row.id, title: row.title, status: row.status, approvals: row.approvals, lastUpdated: row.updated_at, createdAt: row.created_at })));
        const { data: antData } = await getAnteckningar(dbId);
        if (antData) setNotes(antData.map(row => ({ id: row.id, author: row.author, content: row.content, timestamp: row.created_at })));
      }
    });
  }, []);

  const timelineEntries: TimelineEntry[] = [
    ...decisions.map(d => ({
      id: d.id,
      date: new Date(d.createdAt).toISOString(),
      type: 'decision' as const,
      description: `${d.title} - ${d.status}`,
      icon: d.status === 'Alla godkänt' ? 'check' as const : 'alert' as const
    })),
    ...notes.map(n => ({
      id: n.id,
      date: n.timestamp,
      type: 'note' as const,
      description: `${n.author}: ${n.content.substring(0, 50)}${n.content.length > 50 ? '...' : ''}`,
      icon: 'comment' as const
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getEntryColor = (icon: string): string => {
    switch (icon) {
      case 'check':
        return '#34D399';
      case 'alert':
        return '#FCD34D';
      case 'comment':
        return '#60A5FA';
      default:
        return '#D1D5DB';
    }
  };

  const getEntryIcon = (icon: string) => {
    switch (icon) {
      case 'check':
        return <Check className="w-3 h-3" />;
      case 'alert':
        return <AlertCircle className="w-3 h-3" />;
      case 'comment':
        return <Handshake className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div>
      <MikeRossTip text={t('Tidslinjen visar alla viktiga händelser i ordning. Det hjälper er att hålla koll på vad som hänt och vad som behöver göras.', 'The timeline shows all important events in order. It helps you keep track of what has happened and what needs to be done.')} />

      <div className="space-y-4">
        {timelineEntries.map((entry, index) => (
          <div key={entry.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{ background: getEntryColor(entry.icon) }}
              >
                {getEntryIcon(entry.icon)}
              </div>
              {index < timelineEntries.length - 1 && (
                <div
                  className="w-0.5 h-12 my-2"
                  style={{ background: getEntryColor(entry.icon) }}
                />
              )}
            </div>
            <div className="pb-4 flex-1">
              <p className="text-xs text-muted-light mb-1">
                {new Date(entry.date).toLocaleString('sv-SE')}
              </p>
              <p className="text-sm text-primary">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>

      {timelineEntries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-light text-sm">{t('Ingen aktivitet än', 'No activity yet')}</p>
        </div>
      )}
    </div>
  );
}

function Content() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'beslut' | 'anteckningar' | 'tidslinje'>('beslut');

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="text-primary hover:text-accent transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Handshake className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-display text-primary">{t('Samarbete', 'Collaboration')}</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('beslut')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
                tab === 'beslut' ? 'text-white' : 'text-primary/60'
              }`}
              style={tab === 'beslut' ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : undefined}
            >
              {t('Beslut', 'Decisions')}
            </button>
            <button
              onClick={() => setTab('anteckningar')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
                tab === 'anteckningar' ? 'text-white' : 'text-primary/60'
              }`}
              style={tab === 'anteckningar' ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : undefined}
            >
              {t('Anteckningar', 'Notes')}
            </button>
            <button
              onClick={() => setTab('tidslinje')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
                tab === 'tidslinje' ? 'text-white' : 'text-primary/60'
              }`}
              style={tab === 'tidslinje' ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : undefined}
            >
              {t('Tidslinje', 'Timeline')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto flex flex-col min-h-[calc(100dvh-5rem)] px-6 py-8 pb-28">
        {tab === 'beslut' && <TabBeslut />}
        {tab === 'anteckningar' && <TabAnteckningar />}
        {tab === 'tidslinje' && <TabTidslinje />}
      </div>

      {/* Bottom Nav */}
    </div>
  );
}

export default function Page() {
  return (
    <DodsboProvider>
      <Content />
    </DodsboProvider>
  );
}
