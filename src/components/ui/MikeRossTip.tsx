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
      style={{ background: '#EEF2EA' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}
      >
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
