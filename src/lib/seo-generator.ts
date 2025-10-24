// FILE: src/lib/seo-generator.ts
// Utilidad para generar meta tags SEO automáticamente

import { BlogPost } from './types';

export interface SEOMetadata {
  title: string;
  description: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  keywords: string[];
  canonical: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Genera metadata SEO completa para un post
 */
export function generatePostSEO(post: BlogPost, baseUrl: string = 'https://secretnetwork.co'): SEOMetadata {
  const title = post.titulo;
  const description = post.descripcion_corta || extractDescription(post.contenido);
  const ogImage = post.imagen_portada_url || `${baseUrl}/og-default.png`;
  const canonical = `${baseUrl}/blog/${post.slug}`;
  
  // Extraer keywords del contenido
  const keywords = extractKeywords(post.contenido, post.titulo);

  return {
    title: `${title} | Secret Network Blog`,
    description: truncateDescription(description),
    ogImage,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    keywords,
    canonical,
    author: post.autor || 'Secret Network',
    publishedTime: post.fecha_publicacion,
    modifiedTime: post.actualizado_en,
  };
}

/**
 * Extrae descripción del contenido si no existe
 */
function extractDescription(content: string): string {
  // Remover HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Tomar primeras 160 caracteres
  return text.substring(0, 160).trim();
}

/**
 * Trunca descripción a 160 caracteres (límite SEO)
 */
function truncateDescription(description: string): string {
  if (description.length <= 160) return description;
  return description.substring(0, 157) + '...';
}

/**
 * Extrae keywords relevantes del contenido
 */
function extractKeywords(content: string, title: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const words = text.match(/\b\w{4,}\b/g) || [];
  
  // Contar frecuencia
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Ordenar por frecuencia y tomar top 10
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Genera structured data (JSON-LD) para un post
 */
export function generateStructuredData(post: BlogPost, baseUrl: string = 'https://secretnetwork.co') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.titulo,
    description: post.descripcion_corta,
    image: post.imagen_portada_url,
    datePublished: post.fecha_publicacion,
    dateModified: post.actualizado_en,
    author: {
      '@type': 'Person',
      name: post.autor || 'Secret Network',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Secret Network',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  };
}
