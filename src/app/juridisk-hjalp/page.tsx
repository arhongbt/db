'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import { BankIDVerification } from '@/components/BankIDVerification';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  AlertTriangle,
  Sparkles,
  Scale,
  Phone,
  Clock,
  Gift,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { PremiumModal } from '@/components/ui/PremiumModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ── Typewriter hook ──
function useTypewriter(text: string, enabled: boolean, onDone?: () => void, speed = 12) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed('');
    setDone(false);
    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      if (i < text.length) {
        i += 3;
        setDisplayed(text.slice(0, i));
        setTimeout(tick, speed);
      } else {
        setDisplayed(text);
        setDone(true);
        onDone?.();
      }
    };

    const timer = setTimeout(tick, 100);
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled, speed]);

  return { displayed, done };
}

/** Simple markdown renderer — handles **bold**, *italic*, `code`, and bullet lists */
function renderMarkdown(text: string) {
  return text.split('\n').map((line, i) => {
    const bulletMatch = line.match(/^[\s]*[-•]\s+(.*)/);
    if (bulletMatch) {
      return <div key={i} className="flex gap-2 ml-1"><span className="text-accent">•</span><span>{renderInline(bulletMatch[1])}</span></div>;
    }
    const numMatch = line.match(/^[\s]*(\d+)\.\s+(.*)/);
    if (numMatch) {
      return <div key={i} className="flex gap-2 ml-1"><span className="font-medium text-accent">{numMatch[1]}.</span><span>{renderInline(numMatch[2])}</span></div>;
    }
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return <p key={i}>{renderInline(line)}</p>;
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-background px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// ── Typewriter message bubble ──
function TypewriterBubble({ content, animate, onDone }: { content: string; animate: boolean; onDone?: () => void }) {
  const { displayed, done } = useTypewriter(content, animate, onDone);

  return (
    <div className="text-sm leading-relaxed space-y-1">
      {renderMarkdown(displayed)}
      {!done && (
        <span className="inline-block w-1.5 h-4 bg-accent/60 rounded-sm animate-pulse ml-0.5 align-text-bottom" />
      )}
    </div>
  );
}

const SUGGESTED_QUESTIONS = [
  'Vad är skillnaden mellan laglott och arvslott?',
  'Ärver man skulder i Sverige?',
  'Vad händer om bouppteckningen är sen?',
  'Hur fungerar arvsrätt för sambor?',
  'Vad är fri förfoganderätt?',
  'Kan särkullbarn kräva sin del direkt?',
];

const FREE_MESSAGE_LIMIT = 25;

function getUsedMessages(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem('sr_ai_msg_count');
  return stored ? parseInt(stored, 10) : 0;
}

function incrementUsedMessages(): number {
  const current = getUsedMessages();
  const next = current + 1;
  localStorage.setItem('sr_ai_msg_count', String(next));
  return next;
}

function JuridiskHjalpContent() {
  const { state, loading } = useDodsbo();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null);
  const [usedMessages, setUsedMessages] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isBankIDVerified, setIsBankIDVerified] = useState(false);
  const [showBankIDModal, setShowBankIDModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const userScrolledUp = useRef(false);
  const programmaticScroll = useRef(false);

  const remainingMessages = FREE_MESSAGE_LIMIT - usedMessages;
  const isLimitReached = remainingMessages <= 0;

  useEffect(() => {
    setMounted(true);
    setUsedMessages(getUsedMessages());

    // Check BankID verification status
    try {
      const bankidData = localStorage.getItem('sr_bankid_verified');
      if (bankidData) {
        const parsed = JSON.parse(bankidData);
        setIsBankIDVerified(parsed.verified === true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Detect when user scrolls up manually (ignore programmatic scrolls)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let touchActive = false;

    const handleTouchStart = () => { touchActive = true; };
    const handleTouchEnd = () => { setTimeout(() => { touchActive = false; }, 100); };

    const handleScroll = () => {
      // Ignore scroll events caused by our own scrollIntoView
      if (programmaticScroll.current) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Only mark as scrolled up if user is actively touching/dragging
      if (touchActive && distanceFromBottom > 100) {
        userScrolledUp.current = true;
      }
      // If they scroll back near bottom, re-enable auto-scroll
      if (distanceFromBottom < 50) {
        userScrolledUp.current = false;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!userScrolledUp.current && messagesEndRef.current) {
      programmaticScroll.current = true;
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      // Reset programmatic flag after smooth scroll finishes
      setTimeout(() => { programmaticScroll.current = false; }, 500);
    }
  }, []);

  // Scroll on new message
  useEffect(() => {
    userScrolledUp.current = false;
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Auto-scroll during typewriter (respects user scroll, stops when done)
  useEffect(() => {
    if (animatingIdx !== null) {
      const interval = setInterval(() => {
        scrollToBottom();
      }, 300);
      return () => clearInterval(interval);
    }
  }, [animatingIdx, scrollToBottom]);

  const buildDodsboContext = useCallback((): string => {
    const parts: string[] = [];

    if (state.deceasedName) parts.push(`Den avlidne: ${state.deceasedName}`);
    if (state.deathDate) {
      parts.push(`Dödsdatum: ${state.deathDate}`);
      const days = Math.floor(
        (Date.now() - new Date(state.deathDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      parts.push(`Dagar sedan dödsfallet: ${days}`);
    }
    if (state.onboarding?.relation) {
      const relLabels: Record<string, string> = {
        make_maka: 'Make/maka', sambo: 'Sambo', barn: 'Barn', barnbarn: 'Barnbarn',
        foralder: 'Förälder', syskon: 'Syskon',
        annan_slakting: 'Annan släkting', testamentstagare: 'Testamentstagare',
        god_man: 'God man', ombud: 'Ombud',
        vardnadshavare: 'Vårdnadshavare', foralder_avliden: 'Förälder till den avlidne', van_annan: 'Vän/annan',
      };
      parts.push(`Användarens relation: ${relLabels[state.onboarding.relation] || state.onboarding.relation}`);
    }
    if (state.onboarding?.familySituation) {
      const famLabels: Record<string, string> = {
        gift_med_gemensamma_barn: 'Gift med gemensamma barn',
        gift_med_sarkullebarn: 'Gift med särkullbarn',
        gift_utan_barn: 'Gift utan barn',
        ogift_med_barn: 'Ogift med barn',
        sambo_med_barn: 'Sambo med barn',
        sambo_utan_barn: 'Sambo utan barn',
        ensamstaende_utan_barn: 'Ensamstående utan barn',
      };
      parts.push(`Familjesituation: ${famLabels[state.onboarding.familySituation] || state.onboarding.familySituation}`);
    }
    if (state.onboarding?.hasTestamente !== null && state.onboarding?.hasTestamente !== undefined) {
      parts.push(`Testamente: ${state.onboarding.hasTestamente === true ? 'Ja' : state.onboarding.hasTestamente === false ? 'Nej' : 'Vet ej'}`);
    }
    if (state.onboarding?.housingType) {
      const housingLabels: Record<string, string> = {
        hyresratt: 'Hyresrätt', bostadsratt: 'Bostadsrätt',
        villa: 'Villa/hus', fritidshus: 'Fritidshus', ingen_bostad: 'Ingen egen bostad',
      };
      parts.push(`Boende: ${housingLabels[state.onboarding.housingType] || state.onboarding.housingType}`);
    }
    if (state.delagare.length > 0) {
      parts.push(`Antal dödsbodelägare: ${state.delagare.length}`);
      parts.push(`Delägare: ${state.delagare.map(d => `${d.name} (${d.relation})`).join(', ')}`);
    }
    if (state.tillgangar.length > 0) {
      const total = state.tillgangar.reduce((s, t) => s + (t.estimatedValue ?? 0), 0);
      parts.push(`Totala tillgångar: ${total.toLocaleString('sv-SE')} kr`);
    }
    if (state.skulder.length > 0) {
      const total = state.skulder.reduce((s, t) => s + (t.amount ?? 0), 0);
      parts.push(`Totala skulder: ${total.toLocaleString('sv-SE')} kr`);
    }
    if (state.currentStep) {
      const stepLabels: Record<string, string> = {
        akut: 'Nödbroms (dag 1-7)', kartlaggning: 'Kartläggning',
        bouppteckning: 'Bouppteckning', arvskifte: 'Arvskifte', avslutat: 'Avslutat',
      };
      parts.push(`Aktuell fas: ${stepLabels[state.currentStep] || state.currentStep}`);
    }

    return parts.length > 0 ? parts.join('\n') : '';
  }, [state]);

  if (!mounted || loading) return null;

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    // Check free message limit
    if (isLimitReached) {
      setError('Du har använt alla dina gratis frågor. Uppgradera till Premium för obegränsad tillgång.');
      return;
    }

    const userMessage: Message = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/juridisk-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          dodsboContext: buildDodsboContext(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ett fel uppstod.');
        setIsLoading(false);
        return;
      }

      // Track usage
      const newCount = incrementUsedMessages();
      setUsedMessages(newCount);

      const assistantMsg: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMsg]);
      setAnimatingIdx(newMessages.length);
    } catch {
      setError('Kunde inte ansluta. Kontrollera din internetanslutning.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b bg-background" style={{ borderColor: '#E8E4DE' }}>
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-background transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-primary">Mike Ross</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-xs text-muted">Online — juridisk AI-assistent</p>
            </div>
          </div>
        </div>
      </div>

      {/* BankID verification prompt */}
      {!isBankIDVerified && (
        <div className="px-4 py-3 bg-accent/5 border-b" style={{ borderColor: '#E8E4DE' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-accent">Verifiera först med BankID</p>
              <p className="text-xs text-primary/70 mt-0.5">
                För att använda juridisk rådgivning krävs BankID-verifiering.
              </p>
              <button
                onClick={() => setShowBankIDModal(true)}
                className="mt-2 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                Verifiera nu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4 pb-4" role="log" aria-live="polite" aria-atomic="false">
        {/* Welcome state */}
        {messages.length === 0 && isBankIDVerified && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Hej, jag är Mike Ross
            </h2>
            <p className="text-muted text-sm max-w-xs mb-6">
              Din juridiska assistent. Fråga mig om bouppteckning, arvskifte,
              arvsordning, testamente — allt som rör dödsbohantering i Sverige.
            </p>

            {/* AI-frågor — primär CTA */}
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                Förslag på frågor
              </p>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left px-4 py-3 rounded-2xl text-sm text-primary hover:bg-accent/10 transition-colors"
                  style={{ background: '#EFEDE8' }}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-6 p-3 bg-[#FDF6EA] border border-warn/20 rounded-xl max-w-sm">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-warn flex-shrink-0 mt-0.5" />
                <p className="text-xs text-primary">
                  AI-assistenten ger allmän juridisk information baserad på svensk lag.
                  Den ersätter inte juridisk rådgivning.
                </p>
              </div>
            </div>

            {/* Jurist — subtil teaser längst ner */}
            <div className="mt-4 w-full max-w-sm">
              <button
                onClick={() => {
                  // TODO: Koppla till bokningslänk
                  window.open('mailto:kontakt@example.com?subject=Gratis konsultation via Sista Resan', '_blank');
                }}
                className="w-full p-3 rounded-xl border flex items-center gap-3 text-left hover:shadow-sm transition-all"
                style={{ borderColor: '#E8E4DE', background: '#FAFAF8' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary">Behöver du personlig rådgivning?</p>
                  <p className="text-[11px] text-muted">Första timmen med vår jurist är gratis</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted flex-shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 mb-4 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-accent" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-sm shadow-sm'
                  : 'text-primary rounded-bl-sm'
              }`}
              style={msg.role === 'assistant' ? { background: '#EFEDE8' } : {}}
            >
              {msg.role === 'assistant' ? (
                <TypewriterBubble
                  content={msg.content}
                  animate={i === animatingIdx}
                  onDone={() => { if (i === animatingIdx) setAnimatingIdx(null); }}
                />
              ) : (
                <div className="text-sm leading-relaxed">{msg.content}</div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator — thinking animation */}
        {isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-accent" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: '#EFEDE8' }}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex justify-center mb-4">
            <div className="bg-[#FEF3EE] border border-warn/20 px-4 py-3 rounded-xl max-w-sm">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-warn flex-shrink-0 mt-0.5" />
                <p className="text-sm text-warn">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t bg-background px-4 py-3 pb-24" style={{ borderColor: '#E8E4DE' }}>
        {/* Remaining messages warning — shows when 3 or fewer left */}
        {!isLimitReached && remainingMessages <= 3 && remainingMessages > 0 && (
          <div className="mb-3 text-center">
            <p className="text-xs text-muted">
              Du har {remainingMessages} meddelande{remainingMessages !== 1 ? 'n' : ''} kvar
            </p>
          </div>
        )}

        {/* Limit reached — prominent jurist CTA */}
        {isLimitReached && (
          <div className="mb-4 rounded-2xl overflow-hidden border" style={{ borderColor: '#D4DBC9' }}>
            <div className="p-4" style={{ background: 'linear-gradient(135deg, #EEF2EA 0%, #F7F5F0 100%)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-accent" />
                <p className="text-sm font-bold text-primary">
                  Fick du inte svar på allt?
                </p>
              </div>
              <p className="text-xs text-primary/70 mb-3 leading-relaxed">
                Vår samarbetsjurist erbjuder en gratis första timme. Specialiserad på arvsrätt, bouppteckning och dödsbon.
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Gift className="w-3 h-3 text-accent" />
                  <span className="text-[11px] text-primary/60">1h gratis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-accent" />
                  <span className="text-[11px] text-primary/60">Telefon/video</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-accent" />
                  <span className="text-[11px] text-primary/60">Svar inom 24h</span>
                </div>
              </div>
              <button
                className="w-full py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}
                onClick={() => {
                  // TODO: Koppla till bokningslänk
                  window.open('mailto:kontakt@example.com?subject=Gratis konsultation via Sista Resan', '_blank');
                }}
              >
                Boka gratis konsultation
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-primary/40 text-center mt-2">
                Ingen förpliktelse — extra tid efter överenskommelse
              </p>
            </div>
          </div>
        )}

        {/* Input section */}
        <>
          {/* Quick reply chips */}
          {mounted && messages.length > 0 && (
            <div className="flex gap-1 overflow-x-auto pb-1 mb-2 scrollbar-hide">
              {['Berätta mer', 'Ge ett exempel', 'Vilken lag gäller?', 'Vad bör jag göra?'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  disabled={isLoading}
                  className="flex-shrink-0 px-3 py-1.5 bg-accent/8 border border-accent/20 text-xs font-medium text-accent rounded-full hover:bg-accent/15 transition-colors disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ställ en fråga om arvsrätt..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-2xl resize-none
                         focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all
                         text-sm text-primary placeholder:text-gray-400"
              style={{ border: '2px solid #E8E4DE' }}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-accent text-white rounded-2xl hover:bg-accent/90
                         transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed
                         flex-shrink-0"
              aria-label="Skicka meddelande"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </>

        <p className="text-xs text-center text-gray-400 mt-2">
          AI kan göra misstag. Verifiera viktig information med en jurist.
        </p>
      </div>

      <BottomNav />
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />

      {/* BankID Modal */}
      {showBankIDModal && (
        <BankIDVerification
          onVerified={() => {
            setIsBankIDVerified(true);
            setShowBankIDModal(false);
          }}
          onCancel={() => setShowBankIDModal(false)}
        />
      )}
    </div>
  );
}

export default function JuridiskHjalpPage() {
  return (
    <DodsboProvider>
      <JuridiskHjalpContent />
    </DodsboProvider>
  );
}
