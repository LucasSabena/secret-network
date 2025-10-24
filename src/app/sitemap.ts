// FILE: src/app/sitemap.ts
import { createStaticClient } from '@/lib/supabase';
import { MetadataRoute } from 'next';

/**
 * Sitemap dinámico generado automáticamente
 * Se actualiza con cada build
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://secretnetwork.co';
  const supabase = createStaticClient();

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/open-source`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Posts del blog
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, actualizado_en, fecha_publicacion')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });

  const blogPages: MetadataRoute.Sitemap =
    posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.actualizado_en || post.fecha_publicacion),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || [];

  // Categorías del blog
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('slug');

  const categoryPages: MetadataRoute.Sitemap =
    categories?.map((cat) => ({
      url: `${baseUrl}/blog/categoria/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

  // Programas
  const { data: programas } = await supabase
    .from('programas')
    .select('slug')
    .limit(1000);

  const programaPages: MetadataRoute.Sitemap =
    programas?.map((programa) => ({
      url: `${baseUrl}/programas/${programa.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || [];

  return [...staticPages, ...blogPages, ...categoryPages, ...programaPages];
}
