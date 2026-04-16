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
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
         style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-md" style={{ color: 'var(--text)' }}>
        <div className="text-6xl mb-6">🕊️</div>
        <h2 className="font-serif text-2xl mb-4"
            style={{ fontFamily: "'Libre Baskerville', serif" }}>
          Något gick fel
        </h2>
        <p className="mb-6 leading-relaxed"
           style={{ color: 'var(--text-secondary)' }}>
          Vi beklagar besväret. Din data är sparad och säker.
          Försök igen, eller gå tillbaka till startsidan.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset}
                  className="px-6 py-3 rounded-full font-medium"
                  style={{ background: 'var(--accent)', color: 'white' }}>
            Försök igen
          </button>
          <a href="/dashboard"
             className="px-6 py-3 rounded-full font-medium"
             style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            Till startsidan
          </a>
        </div>
      </div>
    </div>
  );
}
