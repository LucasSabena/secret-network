// Generador dinámico de OG Images para BLOG POSTS
// URL: /api/og-blog?title=Mi Post&author=Binary Studio&date=2025-10-29
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get('title') || 'Post del Blog';
  const author = searchParams.get('author') || 'Binary Studio';
  const date = searchParams.get('date');
  const category = searchParams.get('category');

  // Formatear fecha si existe
  let formattedDate = '';
  if (date) {
    try {
      const dateObj = new Date(date);
      formattedDate = dateObj.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      formattedDate = date;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#202020',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(0, 204, 102, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 51, 153, 0.15) 0%, transparent 50%)',
          padding: '60px 80px',
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '50px',
        }}>
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
            Secret Network Blog
          </div>
          
          {category && (
            <div style={{
              padding: '8px 20px',
              backgroundColor: '#ff3399',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
            }}>
              {category}
            </div>
          )}
        </div>

        {/* Título del post */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
        }}>
          <h1
            style={{
              fontSize: title.length > 60 ? '56px' : '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0',
              lineHeight: 1.2,
              maxHeight: '400px',
              overflow: 'hidden',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer con autor y fecha */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '40px',
          borderTop: '2px solid #333',
        }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ 
              fontSize: '24px', 
              color: '#e5e5e5',
              fontWeight: '600',
            }}>
              {author}
            </div>
            {formattedDate && (
              <div style={{ fontSize: '20px', color: '#888' }}>
                {formattedDate}
              </div>
            )}
          </div>
          <div style={{ 
            fontSize: '24px', 
            color: '#ff3399', 
            fontWeight: '600',
          }}>
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
