// Genera OG images estáticas para programas sin captura y blogs publicados.
// Se ejecuta en build time (Node, sin límite de CPU de Workers).
// Output: public/og/<slug>.png — se sirven desde ASSETS (cero CPU en runtime).
import React from 'react';
import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const OUT_DIR = path.join(process.cwd(), 'public', 'og');

function programaOg(nombre: string, categoria: string, iconUrl: string | null, isOpenSource: boolean, isRecommended: boolean) {
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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '24px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff3399' }} />
            Secret Network
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {iconUrl && (
            <div style={{ display: 'flex', marginBottom: '30px' }}>
              <img src={iconUrl} alt={nombre} width="120" height="120" style={{ borderRadius: '20px', backgroundColor: '#2a2a2a', padding: '10px' }} />
            </div>
          )}
          <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: 'white', margin: '0 0 20px 0', lineHeight: 1.1 }}>
            {nombre}
          </h1>
          <p style={{ fontSize: '32px', color: '#e5e5e5', margin: '0 0 30px 0' }}>{categoria}</p>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {isOpenSource && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#00cc66', borderRadius: '8px', fontSize: '20px', fontWeight: '600', color: 'white' }}>
                ⭐ Open Source
              </div>
            )}
            {isRecommended && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#ff3399', borderRadius: '8px', fontSize: '20px', fontWeight: '600', color: 'white' }}>
                ✨ Recomendado
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40px', borderTop: '2px solid #333' }}>
          <div style={{ fontSize: '24px', color: '#666' }}>Directorio de Herramientas de Diseño</div>
          <div style={{ fontSize: '24px', color: '#ff3399', fontWeight: '600' }}>secretnetwork.co</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

function blogOg(title: string, author: string, date: string | null, category: string | null) {
  let formattedDate = '';
  if (date) {
    try {
      formattedDate = new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { /* ignore */ }
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
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 51, 153, 0.15) 0%, transparent 50%)',
          padding: '60px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '24px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff3399' }} />
            Secret Network
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {category && (
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{ padding: '6px 14px', backgroundColor: '#333', borderRadius: '6px', fontSize: '18px', color: '#ff3399', fontWeight: '600' }}>
                {category}
              </div>
            </div>
          )}
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', color: 'white', margin: '0 0 20px 0', lineHeight: 1.15 }}>
            {title}
          </h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40px', borderTop: '2px solid #333' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '24px', color: '#e5e5e5', fontWeight: '600' }}>{author}</div>
            {formattedDate && <div style={{ fontSize: '20px', color: '#888' }}>{formattedDate}</div>}
          </div>
          <div style={{ fontSize: '24px', color: '#ff3399', fontWeight: '600' }}>secretnetwork.co</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  let generated = 0;

  // Programas sin captura
  const { data: programas, error: e1 } = await supabase
    .from('programas')
    .select('slug, nombre, captura_url, icono_url, es_open_source, es_recomendado, categoria_id');
  if (e1) throw e1;

  const { data: categorias } = await supabase.from('categorias').select('id, nombre');
  const catMap = Object.fromEntries((categorias || []).map((c: any) => [c.id, c.nombre]));

  for (const p of (programas || [])) {
    if (p.captura_url) continue;
    const img = await programaOg(
      p.nombre,
      catMap[p.categoria_id] || 'Herramienta de Diseño',
      p.icono_url,
      Boolean(p.es_open_source),
      Boolean(p.es_recomendado)
    );
    const buf = Buffer.from(await img.arrayBuffer());
    writeFileSync(path.join(OUT_DIR, `${p.slug}.png`), buf);
    generated++;
    console.log(`og: ${p.slug}.png`);
  }

  // Blogs publicados
  const { data: blogs, error: e2 } = await supabase
    .from('blog_posts')
    .select('slug, titulo, autor, fecha_publicacion, tags, status')
    .eq('status', 'published');
  if (e2) throw e2;

  for (const b of (blogs || [])) {
    const category = Array.isArray(b.tags) && b.tags.length > 0 ? String(b.tags[0]) : null;
    const img = await blogOg(b.titulo, b.autor || 'Binary Studio', b.fecha_publicacion, category);
    const buf = Buffer.from(await img.arrayBuffer());
    writeFileSync(path.join(OUT_DIR, `${b.slug}.png`), buf);
    generated++;
    console.log(`og: ${b.slug}.png`);
  }

  console.log(`\nGeneradas ${generated} OG images en public/og/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
