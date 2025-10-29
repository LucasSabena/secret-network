'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateReadingTimeFromBlocks } from '@/lib/reading-time';

interface FeaturedPost {
  id: number;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  imagen_portada_url: string | null;
  fecha_publicacion: string;
  contenido_bloques: any;
}

interface BlogFeaturedCarouselProps {
  posts: FeaturedPost[];
}

export function BlogFeaturedCarousel({ posts }: BlogFeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!posts || posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative mb-12">
      {/* Carrusel principal */}
      <div className="relative overflow-hidden rounded-2xl border bg-card">
        <Link href={`/blog/${currentPost.slug}`} className="block group">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Imagen */}
            <div className="relative aspect-video md:aspect-auto md:h-[400px] overflow-hidden bg-muted">
              {currentPost.imagen_portada_url ? (
                <img
                  src={currentPost.imagen_portada_url}
                  alt={currentPost.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-4xl font-bold text-primary/30">
                    {currentPost.titulo.charAt(0)}
                  </span>
                </div>
              )}
              
              {/* Badge de destacado */}
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Destacado
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  {currentPost.titulo}
                </h2>

                {currentPost.descripcion_corta && (
                  <p className="text-lg text-muted-foreground line-clamp-3">
                    {currentPost.descripcion_corta}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(currentPost.fecha_publicacion).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {calculateReadingTimeFromBlocks(currentPost.contenido_bloques).minutes} min de lectura
                  </div>
                </div>

                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    Leer artículo
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Controles de navegación */}
        {posts.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Indicadores */}
      {posts.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {posts.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Ir al post ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Miniaturas */}
      {posts.length > 1 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {posts.map((post, index) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground/30'
              }`}
            >
              {post.imagen_portada_url ? (
                <img
                  src={post.imagen_portada_url}
                  alt={post.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground">
                    {post.titulo.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs text-white font-medium line-clamp-2">
                  {post.titulo}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
