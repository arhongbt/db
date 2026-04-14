'use client';

import { Check } from 'lucide-react';

interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  /** Multi-select mode shows checkbox, single shows radio */
  multi?: boolean;
}

export function OptionCard({
  label,
  description,
  selected,
  onClick,
  multi = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-touch text-left px-5 py-4 transition-all duration-300 active:scale-[0.98] ${
        selected
          ? 'shadow-sm'
          : 'hover:shadow-sm'
      }`}
      style={{
        borderRadius: '24px',
        border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
        background: selected
          ? 'linear-gradient(135deg, rgba(122,158,126,0.06), rgba(122,158,126,0.02))'
          : 'var(--bg-card)',
      }}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-4">
        {/* Indicator — circular always for Tiimo feel */}
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            border: selected ? 'none' : '2px solid var(--border)',
            background: selected ? 'var(--accent)' : 'transparent',
          }}
        >
          {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>

        {/* Text */}
        <div className="flex-1">
          <span className="text-lg font-medium text-primary">{label}</span>
          {description && (
            <p className="text-sm text-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
}
