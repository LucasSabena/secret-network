// FILE: src/components/seo/seo-metadata.tsx
// Componente para generar metadatos SEO optimizados con Open Graph y Twitter Cards

import { Metadata } from 'next';

export interface SEOMetadataProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  canonical,
  keywords = [],
  ogImage = 'https://secret-network.vercel.app/og-image.png',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noindex = false,
}: SEOMetadataProps): Metadata {
  const baseUrl = 'https://secret-network.vercel.app';
  const fullTitle = `${title} | Secret Network`;
  const url = canonical ? `${baseUrl}${canonical}` : baseUrl;

  // Combinar keywords generales con específicas
  const defaultKeywords = [
    'herramientas de diseño',
    'software de diseño',
    'alternativas de diseño',
    'programas de diseño',
    'diseño gráfico',
    'diseño UI/UX',
    'software gratuito',
    'open source',
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'Secret Network' }],
    creator: 'Secret Network',
    publisher: 'Secret Network',
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      locale: 'es_ES',
      url,
      title: fullTitle,
      description,
      siteName: 'Secret Network',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@SecretNetwork',
    },
  };

  // Agregar metadatos específicos para artículos
  if (ogType === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    };
  }

  return metadata;
}
