'use client';

/**
 * AppShell — wraps app pages in a mobile-optimized container.
 * On mobile: full-width, no visual frame.
 * On desktop: centered phone-width column with subtle shadow frame.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop: subtle frame around content */}
      <div className="mx-auto max-w-[430px] min-h-dvh bg-background md:shadow-xl md:border-x md:border-gray-200/50">
        {children}
      </div>
    </div>
  );
}
