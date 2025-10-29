// FILE: src/app/blog/serie/[slug]/page.tsx

import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Layers, Calendar, Clock } from 'lucide-react';
import { calculateReadingTimeFromBlocks } from '@/lib/reading-time';

interface SeriePageProps {
  params: Promise<{ slug: string }>;
}

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateMetadata({ params }: SeriePageProps): Promise<Metadata> {
  const { slug } = await params;
  const serieName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    title: `Serie: ${serieName} | Secret Network`,
    description: `Todos los artículos de la serie ${serieName}`,
  };
}

export default async function SeriePage({ params }: SeriePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Obtener todos los posts publicados
  const { data: allPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });

  if (!allPosts) {
    notFound();
  }

  // Obtener relaciones post-categoría
  const { data: postCategories } = await supabase
    .from('blog_posts_categories')
    .select('post_id, category_id');

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*');

  // Mapear categorías a posts
  const postsWithCategories = allPosts.map(post => ({
    ...post,
    categories: postCategories
      ?.filter(pc => pc.post_id === post.id)
      .map(pc => categories?.find(c => c.id === pc.category_id))
      .filter(Boolean) || []
  }));

  // Encontrar posts de esta serie buscando en tags
  const seriePosts = postsWithCategories.filter(post => {
    if (!post.tags) return false;
    return post.tags.some((tag: string) => createSlug(tag) === slug);
  });

  if (seriePosts.length === 0) {
    notFound();
  }

  // Obtener el nombre de la serie del primer tag que coincida
  const serieName = seriePosts[0].tags?.find((tag: string) => createSlug(tag) === slug) || slug;

  // Separar posts destacados de regulares
  const featuredPosts = seriePosts
    .filter(post => post.is_featured === true)
    .sort((a, b) => new Date(a.fecha_publicacion).getTime() - new Date(b.fecha_publicacion).getTime());

  const regularPosts = seriePosts.filter(post => post.is_featured !== true);

  // Detectar si es Adobe MAX para layout especial
  const isAdobeMax = slug === 'adobe-max-2025';

  // Layout con posts destacados (para todas las series)
  if (featuredPosts.length > 0) {
    const SerieCarousel = (await import('@/components/blog/serie/adobe-max-carousel')).AdobeMaxCarousel;
    
    return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
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
              <span className="text-foreground">Serie: {serieName}</span>
            </div>
          </div>
        </div>

        {/* Header especial para series con destacados */}
        <div className={`border-b ${isAdobeMax ? 'bg-gradient-to-br from-red-500/10 via-primary/10 to-purple-500/10' : 'bg-gradient-to-b from-muted/50 to-background'}`}>
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Layers className="h-4 w-4" />
                Serie · {seriePosts.length} artículos
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {isAdobeMax ? (
                  <span className="bg-gradient-to-r from-red-500 via-primary to-purple-500 bg-clip-text text-transparent">
                    {serieName}
                  </span>
                ) : serieName}
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {isAdobeMax 
                  ? 'Todas las novedades, actualizaciones y anuncios del evento más importante de Adobe'
                  : 'Una colección de artículos relacionados sobre este tema'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Carrusel de posts destacados */}
            <section>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isAdobeMax ? 'Resúmenes Diarios' : 'Artículos Destacados'}
                </h2>
                <p className="text-muted-foreground">
                  {isAdobeMax 
                    ? 'Lo más destacado de cada día del evento'
                    : 'Los artículos principales de esta serie'
                  }
                </p>
              </div>
              <SerieCarousel dailySummaries={featuredPosts} />
            </section>

            {/* Grid de posts regulares */}
            {regularPosts.length > 0 && (
              <section>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">
                    {isAdobeMax ? 'Actualizaciones de Programas' : 'Más Artículos'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isAdobeMax 
                      ? 'Análisis detallado de cada novedad anunciada'
                      : 'Otros artículos de esta serie'
                    }
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group"
                    >
                      <article className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        {post.imagen_portada_url && (
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img
                              src={post.imagen_portada_url}
                              alt={post.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          {post.categories && post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.categories.slice(0, 2).map((cat: any) => (
                                <span
                                  key={cat.id}
                                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: cat.color }}
                                >
                                  {cat.nombre}
                                </span>
                              ))}
                            </div>
                          )}
                          <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.titulo}
                          </h3>
                          {post.descripcion_corta && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                              {post.descripcion_corta}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-4 border-t">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {calculateReadingTimeFromBlocks(post.contenido_bloques).minutes} min
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Botón volver */}
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              ← Volver al blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Layout estándar para otras series
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
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
            <span className="text-foreground">Serie: {serieName}</span>
          </div>
        </div>
      </div>

      {/* Header de la serie */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Layers className="h-4 w-4" />
              Serie · {seriePosts.length} artículos
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {serieName}
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Una colección de artículos relacionados sobre este tema
            </p>
          </div>
        </div>
      </div>

      {/* Grid de posts */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriePosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  {/* Imagen */}
                  {post.imagen_portada_url && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={post.imagen_portada_url}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Categorías */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((cat: any) => (
                          <span
                            key={cat.id}
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: cat.color }}
                          >
                            {cat.nombre}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.titulo}
                    </h3>

                    {post.descripcion_corta && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {post.descripcion_corta}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {calculateReadingTimeFromBlocks(post.contenido_bloques).minutes} min
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            ← Volver al blog
          </Link>
        </div>
      </div>
    </div>
  );
}
