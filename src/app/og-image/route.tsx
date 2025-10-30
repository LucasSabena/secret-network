// Generador dinámico de OG Images
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Secret Network';
  const subtitle = searchParams.get('subtitle') || 'Directorio de Herramientas de Diseño';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#202020',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #ff3399 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00cc66 0%, transparent 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: '#e5e5e5',
              margin: 0,
            }}
          >
            {subtitle}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '40px',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#ff3399',
              }}
            />
            <span style={{ color: '#a0a0a0', fontSize: '24px' }}>
              secretnetwork.co
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
