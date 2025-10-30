// Generador dinámico de OG Images para PROGRAMAS
// URL: /api/og-programa?nombre=Photoshop&categoria=Edición de Imagen&icon=https://...
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const nombre = searchParams.get('nombre') || 'Programa';
  const categoria = searchParams.get('categoria') || 'Herramienta de Diseño';
  const iconUrl = searchParams.get('icon');
  const isOpenSource = searchParams.get('opensource') === 'true';
  const isRecommended = searchParams.get('recommended') === 'true';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#202020',
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 51, 153, 0.15) 0%, transparent 50%)',
          padding: '60px 80px',
        }}
      >
        {/* Header con logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ 
            fontSize: '24px', 
            color: '#a0a0a0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ff3399',
            }} />
            Secret Network
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
        }}>
          {/* Icono del programa (si existe) */}
          {iconUrl && (
            <div style={{
              display: 'flex',
              marginBottom: '30px',
            }}>
              <img
                src={iconUrl}
                alt={nombre}
                width="120"
                height="120"
                style={{
                  borderRadius: '20px',
                  backgroundColor: '#2a2a2a',
                  padding: '10px',
                }}
              />
            </div>
          )}

          {/* Nombre del programa */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
              lineHeight: 1.1,
            }}
          >
            {nombre}
          </h1>

          {/* Categoría */}
          <p
            style={{
              fontSize: '32px',
              color: '#e5e5e5',
              margin: '0 0 30px 0',
            }}
          >
            {categoria}
          </p>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {isOpenSource && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#00cc66',
                borderRadius: '8px',
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
              }}>
                ⭐ Open Source
              </div>
            )}
            {isRecommended && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#ff3399',
                borderRadius: '8px',
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
              }}>
                ✨ Recomendado
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '40px',
          borderTop: '2px solid #333',
        }}>
          <div style={{ fontSize: '24px', color: '#666' }}>
            Directorio de Herramientas de Diseño
          </div>
          <div style={{ fontSize: '24px', color: '#ff3399', fontWeight: '600' }}>
            secretnetwork.co
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
