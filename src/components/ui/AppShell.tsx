'use client';

/**
 * AppShell — wraps app pages in a mobile-optimized container.
 * On mobile: full-width, no visual frame.
 * On desktop: centered phone-width column with Tiimo-inspired soft frame.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg)' }}>
      {/* Desktop: soft, rounded frame */}
      <div
        className="mx-auto max-w-[430px] min-h-dvh md:my-4 md:rounded-[32px] md:overflow-hidden"
        style={{
          background: 'var(--bg)',
          boxShadow: 'var(--shadow-color) 0px 4px 24px, var(--shadow-color) 0px 1px 4px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
