'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-14 inset-x-0 z-40 p-4 bg-white border-t border-border shadow-lg mb-[env(safe-area-inset-bottom)]">
      <div className="max-w-lg mx-auto">
        <p className="text-sm text-primary mb-3">
          Vi använder nödvändiga cookies för inloggning samt Vercel Analytics för att förbättra
          tjänsten. Inga spårningscookies för reklam.{' '}
          <a href="/integritetspolicy" className="text-accent underline">
            Läs mer
          </a>
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="btn-primary text-sm py-2 px-4"
          >
            Godkänn
          </button>
          <button
            onClick={decline}
            className="text-sm text-muted hover:text-primary transition-colors py-2 px-4"
          >
            Bara nödvändiga
          </button>
        </div>
      </div>
    </div>
  );
}
