// FILE: src/components/blog/blog-grid-improved.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { calculateReadingTimeFromBlocks } from '@/lib/reading-time';

interface Post {
  id: number;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  imagen_portada_url: string | null;
  fecha_publicacion: string;
  autor: string | null;
  contenido_bloques: any[];
  categories: any[];
}

interface BlogGridImprovedProps {
  posts: Post[];
}

export function BlogGridImproved({ posts }: BlogGridImprovedProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('categoria');

  // Filtrar posts por categoría si hay una seleccionada
  const filteredPosts = selectedCategory
    ? posts.filter(post => 
        post.categories?.some((cat: any) => cat?.slug === selectedCategory)
      )
    : posts;

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No hay posts en esta categoría todavía.
        </p>
      </div>
    );
  }

  // Post destacado (el más reciente)
  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="space-y-12">
      {/* Post Destacado */}
      <Link href={`/blog/${featuredPost.slug}`} className="group block">
        <article className="grid md:grid-cols-2 gap-8 border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Imagen */}
          {featuredPost.imagen_portada_url && (
            <div className="aspect-video md:aspect-auto overflow-hidden bg-muted">
              <img
                src={featuredPost.imagen_portada_url}
                alt={featuredPost.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          
          {/* Contenido */}
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Destacado
              </span>
              {featuredPost.categories?.[0] && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: featuredPost.categories[0].color }}
                >
                  {featuredPost.categories[0].nombre}
                </span>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
              {featuredPost.titulo}
            </h2>

            {featuredPost.descripcion_corta && (
              <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                {featuredPost.descripcion_corta}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(featuredPost.fecha_publicacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {calculateReadingTimeFromBlocks(featuredPost.contenido_bloques).minutes} min lectura
              </div>
            </div>

            <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Leer artículo
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </article>
      </Link>

      {/* Grid de Posts */}
      {otherPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
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

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.titulo}
                  </h3>

                  {post.descripcion_corta && (
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {post.descripcion_corta}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
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
      )}
    </div>
  );
}
