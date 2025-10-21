// FILE: src/app/sitemap.ts
// Sitemap dinámico que incluye todas las páginas, categorías, programas, blog y alternativas

import { createClient } from '@/lib/supabase';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar cada hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = 'https://secretnetwork.co';

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/open-source`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alternativas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Obtener todas las categorías
  const { data: categorias } = await supabase
    .from('categorias')
    .select('slug');

  const categoriasPages: MetadataRoute.Sitemap = (categorias || []).map((categoria) => ({
    url: `${baseUrl}/categorias/${categoria.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Obtener todas las subcategorías (necesitamos obtener el slug del padre)
  const { data: subcategorias } = await supabase
    .from('categorias')
    .select('slug, id_categoria_padre')
    .not('id_categoria_padre', 'is', null);

  // Obtener los slugs de las categorías padre
  const padreIds = [...new Set(subcategorias?.map(s => s.id_categoria_padre) || [])];
  const { data: padres } = await supabase
    .from('categorias')
    .select('id, slug')
    .in('id', padreIds);

  const padresMap = new Map(padres?.map(p => [p.id, p.slug]) || []);

  const subcategoriasPages: MetadataRoute.Sitemap = (subcategorias || [])
    .filter(sub => padresMap.has(sub.id_categoria_padre))
    .map((sub) => ({
      url: `${baseUrl}/categorias/${padresMap.get(sub.id_categoria_padre)}/${sub.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

  // Obtener todos los programas
  const { data: programas } = await supabase
    .from('programas')
    .select('slug');

  const programasPages: MetadataRoute.Sitemap = (programas || []).map((programa) => ({
    url: `${baseUrl}/programas/${programa.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Obtener todos los posts del blog
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, fecha_publicacion, actualizado_en')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });

  const blogPages: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.actualizado_en || post.fecha_publicacion || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Obtener programas recomendados para alternativas
  const { data: programasRecomendados } = await supabase
    .from('programas')
    .select('slug')
    .eq('es_recomendado', true);

  const alternativasPages: MetadataRoute.Sitemap = (programasRecomendados || []).map((programa) => ({
    url: `${baseUrl}/alternativas/${programa.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...categoriasPages,
    ...subcategoriasPages,
    ...programasPages,
    ...blogPages,
    ...alternativasPages,
  ];
}
