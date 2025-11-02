// FILE: src/app/robots.txt/route.ts
import { NextResponse } from 'next/server';

/**
 * Robots.txt optimizado
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://secretnetwork.co';

  const robots = `# Robots.txt para Secret Network
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /auth/

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay para bots de SEO (permitir con delay)
User-agent: AhrefsBot
Crawl-delay: 10
Allow: /

User-agent: SemrushBot
Crawl-delay: 10
Allow: /

# Bloquear bots malos
User-agent: MJ12bot
Disallow: /
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
