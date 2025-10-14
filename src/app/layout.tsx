// FILE: src/app/layout.tsx

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/google-tag-manager";
import { JsonLdOrganization } from "@/components/seo/json-ld-organization";
import { JsonLdWebsite } from "@/components/seo/json-ld-website";
import { Toaster } from "@/components/ui/toaster";

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://secret-network.vercel.app'),
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
    url: 'https://secret-network.vercel.app',
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
        {/* JSON-LD Structured Data */}
        <JsonLdOrganization />
        <JsonLdWebsite />
        
        {/* Google Tag Manager */}
        <GoogleTagManager gtmId={gtmId} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSpaceGrotesk.variable
        )}
      >
        {/* GTM NoScript */}
        <GoogleTagManagerNoScript gtmId={gtmId} />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ReactQueryProvider>
        </ThemeProvider>

        {/* Google Analytics */}
        <GoogleAnalytics measurementId={gaId} />
      </body>
    </html>
  );
}