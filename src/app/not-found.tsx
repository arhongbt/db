import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6"
         style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-md" style={{ color: 'var(--text)' }}>
        <div className="text-6xl mb-6">🕊️</div>
        <h2 className="font-serif text-2xl mb-4"
            style={{ fontFamily: "'Libre Baskerville', serif" }}>
          Sidan hittades inte
        </h2>
        <p className="mb-6 leading-relaxed"
           style={{ color: 'var(--text-secondary)' }}>
          Sidan du letar efter finns inte längre eller har flyttats.
        </p>
        <Link href="/dashboard"
              className="inline-block px-6 py-3 rounded-full font-medium"
              style={{ background: 'var(--accent)', color: 'white' }}>
          Till startsidan
        </Link>
      </div>
    </div>
  );
}
