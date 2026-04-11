import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sista Resan — Sveriges första digitala dödsbohjälp';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#2C4A6E',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              letterSpacing: '-2px',
            }}
          >
            Sista Resan
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 400,
              opacity: 0.85,
              maxWidth: '700px',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Hantera dödsboet steg för steg
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '16px',
              padding: '12px 32px',
              backgroundColor: '#7A9E8E',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            Sveriges första digitala dödsbohjälp
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
