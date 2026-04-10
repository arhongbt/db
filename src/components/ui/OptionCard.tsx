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
      className={`w-full min-h-touch text-left p-4 rounded-card border-2 transition-all duration-200 ${
        selected
          ? 'border-accent bg-primary-lighter/30'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        {/* Indicator */}
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-${
            multi ? 'md' : 'full'
          } border-2 flex items-center justify-center transition-colors ${
            selected
              ? 'border-accent bg-accent'
              : 'border-gray-300 bg-white'
          }`}
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
