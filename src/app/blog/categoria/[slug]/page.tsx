// FILE: src/app/blog/categoria/[slug]/page.tsx
import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BlogCategoryBadge } from '@/components/blog/blog-category-badge';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const supabase = createClient();
  
  const { data: category } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: `${category.nombre} - Blog | Secret Network`,
    description: category.descripcion || `Artículos sobre ${category.nombre}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createClient();

  // Obtener categoría
  const { data: category } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    notFound();
  }

  // Obtener posts de esta categoría
  const { data: postCategories } = await supabase
    .from('blog_posts_categories')
    .select('post_id')
    .eq('category_id', category.id);

  const postIds = postCategories?.map(pc => pc.post_id) || [];

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .in('id', postIds)
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{category.nombre}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <BlogCategoryBadge category={category} size="md" />
            <h1 className="text-4xl font-bold mt-4">{category.nombre}</h1>
            {category.descripcion && (
              <p className="text-xl text-muted-foreground mt-4">
                {category.descripcion}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              {posts?.length || 0} {posts?.length === 1 ? 'artículo' : 'artículos'}
            </p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="container mx-auto px-4 py-12">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay artículos en esta categoría todavía.
            </p>
            <Link href="/blog" className="text-primary hover:underline mt-4 inline-block">
              Ver todos los artículos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
            {posts.map((post) => (
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
                        alt={post.imagen_portada_alt || post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {post.titulo}
                    </h2>
                    {post.descripcion_corta && (
                      <p className="text-muted-foreground mt-2 line-clamp-3 flex-1">
                        {post.descripcion_corta}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                      <span>
                        {new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
