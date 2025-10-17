// FILE: src/components/seo/json-ld-article.tsx
// Schema.org Article markup para posts del blog

import { BlogPost } from '@/lib/types';

interface JsonLdArticleProps {
  post: BlogPost;
}

export function JsonLdArticle({ post }: JsonLdArticleProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
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
        url: 'https://secretnetwork.co/logo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://secretnetwork.co/blog/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}
