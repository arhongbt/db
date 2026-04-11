'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-accent mb-4">Fel</p>
        <h1 className="text-2xl font-semibold text-primary mb-2">
          Något gick fel
        </h1>
        <p className="text-muted mb-8">
          Ett oväntat fel uppstod. Försök igen eller gå tillbaka till
          startsidan.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center justify-center"
          >
            Försök igen
          </button>
          <a
            href="/dashboard"
            className="text-sm text-accent hover:text-accent-dark transition-colors"
          >
            Gå till dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
