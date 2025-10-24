// FILE: src/app/rss.xml/route.ts
import { createStaticClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * RSS Feed para el blog
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://secretnetwork.co';
  const supabase = createStaticClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('titulo, slug, descripcion_corta, fecha_publicacion, autor')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false })
    .limit(50);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Secret Network Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Artículos sobre diseño, desarrollo y herramientas</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${
      posts
        ?.map(
          (post) => `
    <item>
      <title><![CDATA[${post.titulo}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.descripcion_corta || ''}]]></description>
      <pubDate>${new Date(post.fecha_publicacion).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      ${post.autor ? `<author>${post.autor}</author>` : ''}
    </item>`
        )
        .join('') || ''
    }
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
