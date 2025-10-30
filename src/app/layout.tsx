// FILE: src/app/layout.tsx

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import dynamic from "next/dynamic";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";

// Lazy load del Footer - no se necesita inmediatamente
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => ({ default: mod.Footer })), {
  ssr: true,
});
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/google-tag-manager";
import { JsonLdOrganization } from "@/components/seo/json-ld-organization";
import { JsonLdWebsite } from "@/components/seo/json-ld-website";
import { JsonLdSitelinksSearch } from "@/components/seo/json-ld-sitelinks-search";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScrollWrapper } from "@/components/layout/smooth-scroll-wrapper";
import { ServiceWorkerRegister } from "@/components/shared/service-worker-register";

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap', // Evita bloqueo de renderizado
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://secretnetwork.co'),
  title: {
    default: 'Secret Network - Directorio de Herramientas de Diseño',
    template: '%s | Secret Network',
  },
  description: 'Descubre las mejores herramientas y programas de diseño. Encuentra alternativas gratuitas y open source a Photoshop, Illustrator, Figma y más.',
  keywords: [
    'herramientas de diseño',
    'software de diseño',
    'alternativas photoshop',
    'alternativas illustrator',
    'alternativas figma',
    'programas de diseño gratis',
    'diseño gráfico',
    'diseño UI/UX',
    'software open source',
    'herramientas creatividad',
  ],
  authors: [{ name: 'Secret Network' }],
  creator: 'Secret Network',
  publisher: 'Secret Network',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://secretnetwork.co',
    title: 'Secret Network - Directorio de Herramientas de Diseño',
    description: 'Descubre las mejores herramientas y programas de diseño. Encuentra alternativas gratuitas y open source.',
    siteName: 'Secret Network',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Secret Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secret Network - Directorio de Herramientas de Diseño',
    description: 'Descubre las mejores herramientas y programas de diseño. Encuentra alternativas gratuitas y open source.',
    images: ['/og-image.png'],
    creator: '@SecretNetwork',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google', // Agregar después
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Variables de entorno para Analytics
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect para mejorar rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fkfoapcvmuxycebsnttd.supabase.co" />
        <link rel="dns-prefetch" href="https://fkfoapcvmuxycebsnttd.supabase.co" />
        
        {/* Redirección automática para invitaciones */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (window.location.hash && window.location.hash.includes('type=invite')) {
              window.location.href = '/admin/setup-password' + window.location.hash;
            }
          `
        }} />
        
        {/* JSON-LD Structured Data */}
        <JsonLdOrganization />
        <JsonLdWebsite />
        <JsonLdSitelinksSearch />
        
        {/* Google Tag Manager - Solo en producción */}
        {process.env.NODE_ENV === 'production' && <GoogleTagManager gtmId={gtmId} />}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSpaceGrotesk.variable
        )}
      >
        {/* GTM NoScript - Solo en producción */}
        {process.env.NODE_ENV === 'production' && <GoogleTagManagerNoScript gtmId={gtmId} />}
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SmoothScrollWrapper>
              {children}
              <Toaster />
            </SmoothScrollWrapper>
          </ReactQueryProvider>
        </ThemeProvider>

        {/* Google Analytics - Solo en producción */}
        {process.env.NODE_ENV === 'production' && <GoogleAnalytics measurementId={gaId} />}
        
        {/* Vercel Analytics */}
        <Analytics />
        
        {/* Service Worker para cache offline */}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}