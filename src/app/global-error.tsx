'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{
        background: '#FAFBF9',
        color: '#1A1A2E',
        fontFamily: "'Libre Baskerville', serif",
      }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🕊️</div>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
              Något gick fel
            </h2>
            <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
              Vi beklagar besväret. Försök ladda om sidan.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                background: '#6B7F5E',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Ladda om
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
