'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { DodsboProvider } from '@/lib/context';
import { ArrowLeft, Smartphone, ChevronDown, Bot, CheckCircle2, Circle } from 'lucide-react';

function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: 'var(--accent-soft)' }}>
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

function CollapsibleSection({
  title,
  children,
  expanded,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border rounded-2xl overflow-hidden mb-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:opacity-70 transition-opacity"
      >
        <h3 className="text-base font-display text-primary">{title}</h3>
        <ChevronDown
          className="w-5 h-5 text-muted transition-transform"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {expanded && (
        <div className="border-t p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ChecklistItem({
  text,
  completed,
  onToggle,
}: {
  text: string;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-start gap-3 w-full text-left mb-3 hover:opacity-70 transition-opacity"
    >
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
      ) : (
        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
      )}
      <span className={`text-sm ${completed ? 'text-gray-500 line-through' : 'text-primary'}`}>
        {text}
      </span>
    </button>
  );
}

function Content() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    crypto: false,
    social: false,
    streaming: false,
    email: false,
    domains: false,
  });

  const [cryptoChecklist, setCryptoChecklist] = useState<Record<string, boolean>>({
    wallets: false,
    bank: false,
    hardware: false,
    seeds: false,
  });

  const [socialChecklist, setSocialChecklist] = useState<Record<string, boolean>>({
    facebook: false,
    instagram: false,
    linkedin: false,
    google: false,
    screenshots: false,
  });

  const [streamingChecklist, setStreamingChecklist] = useState<Record<string, boolean>>({
    spotify: false,
    netflix: false,
    hbo: false,
    disney: false,
    youtube: false,
    apple: false,
    microsoft: false,
  });

  const [emailChecklist, setEmailChecklist] = useState<Record<string, boolean>>({
    gmail: false,
    icloud: false,
    dropbox: false,
  });

  const [domainsChecklist, setDomainsChecklist] = useState<Record<string, boolean>>({
    websites: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCryptoCheckbox = (key: string) => {
    setCryptoChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSocialCheckbox = (key: string) => {
    setSocialChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleStreamingCheckbox = (key: string) => {
    setStreamingChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleEmailCheckbox = (key: string) => {
    setEmailChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleDomainsCheckbox = (key: string) => {
    setDomainsChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto flex flex-col min-h-[calc(100dvh-5rem)] px-4 py-6 pb-32">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <div className="flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-display text-primary">Digitala tillgångar & konton</h1>
          </div>
        </div>

        {/* Mike Ross Tip */}
        <MikeRossTip text="Digitala tillgångar ingår i dödsboet precis som fysiska. Kryptovalutor, onlinekonton, sociala medier och digitala abonnemang — allt behöver hanteras." />

        {/* Section 1: Kryptovalutor */}
        <CollapsibleSection
          title="1. Kryptovalutor"
          expanded={expandedSections.crypto}
          onToggle={() => toggleSection('crypto')}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Checklista:</p>
              <ChecklistItem
                text="Sök efter krypto-wallets (Coinbase, Binance, Avanza)"
                completed={cryptoChecklist.wallets}
                onToggle={() => toggleCryptoCheckbox('wallets')}
              />
              <ChecklistItem
                text="Kontrollera bankutdrag för kryptoköp"
                completed={cryptoChecklist.bank}
                onToggle={() => toggleCryptoCheckbox('bank')}
              />
              <ChecklistItem
                text="Sök efter hardware wallets (Ledger/Trezor)"
                completed={cryptoChecklist.hardware}
                onToggle={() => toggleCryptoCheckbox('hardware')}
              />
              <ChecklistItem
                text="Leta efter seed phrases/lösenord i anteckningar eller säkerhetsbox"
                completed={cryptoChecklist.seeds}
                onToggle={() => toggleCryptoCheckbox('seeds')}
              />
            </div>

            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
              <p className="text-sm text-primary">
                <strong>Viktigt:</strong> Utan lösenord eller seed phrase kan krypto vara oåtkomligt. Kontakta börsen med dödsbevis — vissa kan hjälpa.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 2: Sociala medier */}
        <CollapsibleSection
          title="2. Sociala medier"
          expanded={expandedSections.social}
          onToggle={() => toggleSection('social')}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Checklista:</p>

              <div className="mb-4 p-3 border rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium text-primary mb-2">Facebook</p>
                <p className="text-xs text-gray-600 mb-2">Minnessida eller radera</p>
                <a
                  href="https://www.facebook.com/help/1506822589577997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  facebook.com/help — minnesplats
                </a>
                <div className="mt-2">
                  <ChecklistItem
                    text="Facebook hanterad"
                    completed={socialChecklist.facebook}
                    onToggle={() => toggleSocialCheckbox('facebook')}
                  />
                </div>
              </div>

              <div className="mb-4 p-3 border rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium text-primary mb-2">Instagram</p>
                <p className="text-xs text-gray-600 mb-2">Minneskonto eller radera</p>
                <a
                  href="https://help.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  help.instagram.com
                </a>
                <div className="mt-2">
                  <ChecklistItem
                    text="Instagram hanterad"
                    completed={socialChecklist.instagram}
                    onToggle={() => toggleSocialCheckbox('instagram')}
                  />
                </div>
              </div>

              <div className="mb-4 p-3 border rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium text-primary mb-2">LinkedIn</p>
                <p className="text-xs text-gray-600 mb-2">Stäng via support</p>
                <div className="mt-2">
                  <ChecklistItem
                    text="LinkedIn hanterad"
                    completed={socialChecklist.linkedin}
                    onToggle={() => toggleSocialCheckbox('linkedin')}
                  />
                </div>
              </div>

              <div className="mb-4 p-3 border rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium text-primary mb-2">Google/Gmail</p>
                <p className="text-xs text-gray-600 mb-2">Inactive Account Manager kan ha ställts in</p>
                <div className="mt-2">
                  <ChecklistItem
                    text="Google/Gmail hanterad"
                    completed={socialChecklist.google}
                    onToggle={() => toggleSocialCheckbox('google')}
                  />
                </div>
              </div>

              <ChecklistItem
                text="Skärmdumpad viktiga meddelanden/foton innan konton stängs"
                completed={socialChecklist.screenshots}
                onToggle={() => toggleSocialCheckbox('screenshots')}
              />
            </div>

            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
              <p className="text-sm text-primary">
                <strong>Tips:</strong> Skärmdumpa viktiga meddelanden och foton innan du stänger konton — de kan vara värdefulla minnen.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 3: Streamingtjänster & abonnemang */}
        <CollapsibleSection
          title="3. Streamingtjänster & abonnemang"
          expanded={expandedSections.streaming}
          onToggle={() => toggleSection('streaming')}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Checklista — avsluta dessa tjänster:</p>
              <ChecklistItem
                text="Spotify"
                completed={streamingChecklist.spotify}
                onToggle={() => toggleStreamingCheckbox('spotify')}
              />
              <ChecklistItem
                text="Netflix"
                completed={streamingChecklist.netflix}
                onToggle={() => toggleStreamingCheckbox('netflix')}
              />
              <ChecklistItem
                text="HBO Max"
                completed={streamingChecklist.hbo}
                onToggle={() => toggleStreamingCheckbox('hbo')}
              />
              <ChecklistItem
                text="Disney+"
                completed={streamingChecklist.disney}
                onToggle={() => toggleStreamingCheckbox('disney')}
              />
              <ChecklistItem
                text="YouTube Premium"
                completed={streamingChecklist.youtube}
                onToggle={() => toggleStreamingCheckbox('youtube')}
              />
              <ChecklistItem
                text="Apple-prenumerationer"
                completed={streamingChecklist.apple}
                onToggle={() => toggleStreamingCheckbox('apple')}
              />
              <ChecklistItem
                text="Microsoft 365"
                completed={streamingChecklist.microsoft}
                onToggle={() => toggleStreamingCheckbox('microsoft')}
              />
            </div>

            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
              <p className="text-sm text-primary">
                <strong>Så gör du:</strong> Kontrollera bankutdrag för månatliga dragningar. Avsluta varje tjänst via deras support med dödsbevis.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 4: E-post & molnlagring */}
        <CollapsibleSection
          title="4. E-post & molnlagring"
          expanded={expandedSections.email}
          onToggle={() => toggleSection('email')}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Checklista:</p>

              <div className="mb-4 p-3 border rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium text-primary mb-2">Gmail/Outlook</p>
                <p className="text-xs text-gray-600 mb-2">Kan ge tillgång via dödsbevis + bouppteckning</p>
                <div className="mt-2">
                  <ChecklistItem
                    text="Gmail/Outlook hanterad"
                    completed={emailChecklist.gmail}
                    onToggle={() => toggleEmailCheckbox('gmail')}
                  />
                </div>
              </div>

              <div className="mb-4 p-3 border rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium text-primary mb-2">iCloud</p>
                <p className="text-xs text-gray-600 mb-2">Apple har Legacy Contact-program</p>
                <div className="mt-2">
                  <ChecklistItem
                    text="iCloud hanterad"
                    completed={emailChecklist.icloud}
                    onToggle={() => toggleEmailCheckbox('icloud')}
                  />
                </div>
              </div>

              <div className="mb-4 p-3 border rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium text-primary mb-2">Dropbox/Google Drive</p>
                <p className="text-xs text-gray-600 mb-2">Kan innehålla viktiga dokument</p>
                <div className="mt-2">
                  <ChecklistItem
                    text="Molnlagring kontrollerad"
                    completed={emailChecklist.dropbox}
                    onToggle={() => toggleEmailCheckbox('dropbox')}
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 5: Domäner & webbplatser */}
        <CollapsibleSection
          title="5. Domäner & webbplatser"
          expanded={expandedSections.domains}
          onToggle={() => toggleSection('domains')}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Checklista:</p>
              <ChecklistItem
                text="Om hemsida/domän finns — förnya eller avsluta"
                completed={domainsChecklist.websites}
                onToggle={() => toggleDomainsCheckbox('websites')}
              />
            </div>

            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
              <p className="text-sm text-primary">
                <strong>Viktigt:</strong> Kontrollera domänregistratören för förnyelsedatum. Utan förnyelse kan domänen försvinna eller tas över av andra.
              </p>
            </div>
          </div>
        </CollapsibleSection>
      </div>

    </div>
  );
}

export default function DigitalaTillgangarPage() {
  return (
    <DodsboProvider>
      <Content />
    </DodsboProvider>
  );
}
