'use client';

import { Bot } from 'lucide-react';

interface MikeRossTipProps {
  /** The explanation text Mike Ross delivers */
  text: string;
  /** Optional className for outer wrapper */
  className?: string;
}

/**
 * Mike Ross — vår juridiska AI-assistent som förklarar svåra termer
 * på enkel svenska så att kunden alltid hänger med.
 */
export function MikeRossTip({ text, className = '' }: MikeRossTipProps) {
  return (
    <div
      className={`flex gap-3 p-4 rounded-2xl ${className}`}
      style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, var(--accent), #6B8E6F)' }}
      >
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--accent)' }}>Mike Ross</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{text}</p>
      </div>
    </div>
  );
}
