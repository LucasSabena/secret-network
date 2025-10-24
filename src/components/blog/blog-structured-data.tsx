// FILE: src/components/blog/blog-structured-data.tsx
import { BlogPost } from '@/lib/types';
import { generateStructuredData } from '@/lib/seo-generator';

interface BlogStructuredDataProps {
  post: BlogPost;
  baseUrl?: string;
}

/**
 * Componente para agregar JSON-LD structured data
 * Mejora el SEO y la apariencia en resultados de búsqueda
 */
export function BlogStructuredData({ post, baseUrl }: BlogStructuredDataProps) {
  const structuredData = generateStructuredData(post, baseUrl);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
