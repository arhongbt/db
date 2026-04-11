'use client';

import { useState, useRef, useEffect } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  AlertTriangle,
  Loader2,
  Scale,
  Sparkles,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'Vad är skillnaden mellan laglott och arvslott?',
  'Ärver man skulder i Sverige?',
  'Vad händer om bouppteckningen är sen?',
  'Hur fungerar arvsrätt för sambor?',
  'Vad är fri förfoganderätt?',
  'Kan särkullbarn kräva sin del direkt?',
];

function JuridiskHjalpContent() {
  const { state, loading } = useDodsbo();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  if (!mounted || loading) return null;

  // Build context string from user's dödsbo state
  const buildDodsboContext = (): string => {
    const parts: string[] = [];

    if (state.deceasedName) {
      parts.push(`Den avlidne: ${state.deceasedName}`);
    }
    if (state.deathDate) {
      parts.push(`Dödsdatum: ${state.deathDate}`);
      const days = Math.floor(
        (Date.now() - new Date(state.deathDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      parts.push(`Dagar sedan dödsfallet: ${days}`);
    }
    if (state.onboarding?.relation) {
      const relLabels: Record<string, string> = {
        make_maka: 'Make/maka',
        sambo: 'Sambo',
        barn: 'Barn',
        foralder: 'Förälder',
        syskon: 'Syskon',
        annan_slakting: 'Annan släkting',
        testamentstagare: 'Testamentstagare',
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
        hyresratt: 'Hyresrätt',
        bostadsratt: 'Bostadsrätt',
        villa: 'Villa/hus',
        fritidshus: 'Fritidshus',
        ingen_bostad: 'Ingen egen bostad',
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
        akut: 'Nödbroms (dag 1-7)',
        kartlaggning: 'Kartläggning',
        bouppteckning: 'Bouppteckning',
        arvskifte: 'Arvskifte',
        avslutat: 'Avslutat',
      };
      parts.push(`Aktuell fas: ${stepLabels[state.currentStep] || state.currentStep}`);
    }

    return parts.length > 0 ? parts.join('\n') : '';
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

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

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
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
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 bg-white">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <Scale className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary">Juridisk AI-assistent</h1>
            <p className="text-xs text-muted">Svensk arvsrätt &amp; dödsbohantering</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        {/* Welcome state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Fråga mig om arvsrätt
            </h2>
            <p className="text-muted text-sm max-w-xs mb-6">
              Jag kan svara på frågor om bouppteckning, arvskifte, arvsordning,
              testamente och allt som rör dödsbohantering i Sverige.
            </p>

            {/* Suggested questions */}
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                Förslag på frågor
              </p>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-primary hover:border-accent hover:bg-accent/5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl max-w-sm">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  AI-assistenten ger allmän juridisk information baserad på svensk lag.
                  Den ersätter inte juridisk rådgivning. Kontakta en jurist vid
                  komplexa eller känsliga frågor.
                </p>
              </div>
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
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-primary rounded-bl-md'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-accent" />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Tänker...
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex justify-center mb-4">
            <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl max-w-sm">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 pb-24">
        {messages.length > 0 && (
          <div className="flex gap-1 mb-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {['Berätta mer', 'Ge ett exempel', 'Vilken lag gäller?', 'Vad bör jag göra?'].map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                disabled={isLoading}
                className="flex-shrink-0 px-3 py-1.5 bg-gray-100 text-xs font-medium text-primary rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
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
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none
                       focus:border-accent focus:outline-none transition-colors
                       text-sm text-primary placeholder:text-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-accent text-white rounded-xl hover:bg-accent/90
                       transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                       flex-shrink-0"
            aria-label="Skicka"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          AI kan göra misstag. Verifiera viktig information med en jurist.
        </p>
      </div>

      <BottomNav />
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
