import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Cache agresivo para assets estáticos
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  // Cache para páginas públicas
  if (
    request.nextUrl.pathname.startsWith('/blog') ||
    request.nextUrl.pathname.startsWith('/programas') ||
    request.nextUrl.pathname.startsWith('/alternativas') ||
    request.nextUrl.pathname.startsWith('/categorias')
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=600'
    );
  }

  // Prefetch hints
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set(
    'Link',
    '<https://fkfoapcvmuxycebsnttd.supabase.co>; rel=preconnect, <https://res.cloudinary.com>; rel=preconnect'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
