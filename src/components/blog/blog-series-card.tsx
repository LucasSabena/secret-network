'use client';

import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';

interface BlogSeriesCardProps {
  name: string;
  slug: string;
  description?: string;
  postsCount: number;
  coverImage?: string;
  color?: string;
}

export function BlogSeriesCard({
  name,
  slug,
  description,
  postsCount,
  coverImage,
  color = '#ff3399',
}: BlogSeriesCardProps) {
  return (
    <Link href={`/blog/serie/${slug}`} className="group">
      <article className="border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
        {/* Imagen o gradiente */}
        <div
          className="h-48 relative overflow-hidden"
          style={{
            background: coverImage
              ? `url(${coverImage}) center/cover`
              : `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-5 w-5" style={{ color }} />
              <span className="text-sm font-medium" style={{ color }}>
                Serie · {postsCount} artículos
              </span>
            </div>
            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {description && (
            <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
            Ver serie completa
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}
