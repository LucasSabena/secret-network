// FILE: src/components/blog/blog-related-posts.tsx
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BlogRelatedPostsProps {
  currentPostId: number;
  categoryIds?: number[];
  limit?: number;
}

/**
 * Muestra posts relacionados basados en categorías compartidas
 */
export async function BlogRelatedPosts({
  currentPostId,
  categoryIds = [],
  limit = 3,
}: BlogRelatedPostsProps) {
  const supabase = await createClient();

  // Si no hay categorías, no mostrar nada
  if (categoryIds.length === 0) return null;

  // Buscar posts que compartan categorías
  const { data: relatedPostIds } = await supabase
    .from('blog_posts_categories')
    .select('post_id')
    .in('category_id', categoryIds)
    .neq('post_id', currentPostId);

  if (!relatedPostIds || relatedPostIds.length === 0) return null;

  const postIds = [...new Set(relatedPostIds.map((r: any) => r.post_id))];

  // Obtener los posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, titulo, slug, descripcion_corta, imagen_portada_url, fecha_publicacion')
    .in('id', postIds)
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false })
    .limit(limit);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="border-t pt-12 mt-12">
      <h2 className="text-2xl font-bold mb-6">Artículos Relacionados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group"
          >
            <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
              {post.imagen_portada_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.imagen_portada_url}
                    alt={post.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {post.titulo}
                </h3>
                {post.descripcion_corta && (
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {post.descripcion_corta}
                  </p>
                )}
                <div className="flex items-center gap-1 text-sm text-primary mt-4">
                  Leer más
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
