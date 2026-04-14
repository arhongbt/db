import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-display text-accent mb-4">404</p>
        <h1 className="text-2xl font-display text-primary mb-2">
          Sidan hittades inte
        </h1>
        <p className="text-muted mb-8">
          Sidan du letar efter finns inte eller har flyttats.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="btn-primary inline-flex items-center justify-center"
          >
            Gå till dashboard
          </Link>
          <Link
            href="/"
            className="text-sm text-accent hover:text-accent-dark transition-colors"
          >
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}
