'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateReadingTimeFromBlocks } from '@/lib/reading-time';

interface Post {
  id: number;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  imagen_portada_url: string | null;
  fecha_publicacion: string;
  contenido_bloques: any[];
}

interface AdobeMaxCarouselProps {
  dailySummaries: Post[];
}

export function AdobeMaxCarousel({ dailySummaries }: AdobeMaxCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % dailySummaries.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + dailySummaries.length) % dailySummaries.length);
  };

  if (dailySummaries.length === 0) return null;

  const currentPost = dailySummaries[currentIndex];

  return (
    <div className="relative">
      {/* Carrusel principal */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 to-background">
        <Link href={`/blog/${currentPost.slug}`} className="group block">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Imagen */}
            {currentPost.imagen_portada_url && (
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={currentPost.imagen_portada_url}
                  alt={currentPost.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}

            {/* Contenido */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Resumen del Día {currentIndex + 1}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                {currentPost.titulo}
              </h2>

              {currentPost.descripcion_corta && (
                <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                  {currentPost.descripcion_corta}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(currentPost.fecha_publicacion).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {calculateReadingTimeFromBlocks(currentPost.contenido_bloques).minutes} min
                </div>
              </div>

              <div className="text-primary font-medium group-hover:underline">
                Leer resumen completo →
              </div>
            </div>
          </div>
        </Link>

        {/* Controles del carrusel */}
        {dailySummaries.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Indicadores */}
      {dailySummaries.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {dailySummaries.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Ir al día ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Miniaturas de días */}
      {dailySummaries.length > 1 && (
        <div className="grid grid-cols-3 gap-4 mt-8">
          {dailySummaries.map((post, index) => (
            <button
              key={post.id}
              onClick={() => setCurrentIndex(index)}
              className={`text-left p-4 rounded-lg border transition-all ${
                index === currentIndex
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-xs font-medium text-primary mb-1">Día {index + 1}</div>
              <div className="text-sm font-semibold line-clamp-2">{post.titulo}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
