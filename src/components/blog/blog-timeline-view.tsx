'use client';

import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { calculateReadingTimeFromBlocks } from '@/lib/reading-time';

interface Post {
  id: number;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  imagen_portada_url: string | null;
  fecha_publicacion: string;
  contenido_bloques: any[];
  categories: any[];
}

interface BlogTimelineViewProps {
  posts: Post[];
}

export function BlogTimelineView({ posts }: BlogTimelineViewProps) {
  // Agrupar posts por mes/año
  const groupedPosts = posts.reduce((acc, post) => {
    const date = new Date(post.fecha_publicacion);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    
    if (!acc[key]) {
      acc[key] = { label, posts: [] };
    }
    acc[key].posts.push(post);
    return acc;
  }, {} as Record<string, { label: string; posts: Post[] }>);

  const sortedGroups = Object.entries(groupedPosts).sort(([a], [b]) => b.localeCompare(a));

  return (
    <div className="space-y-12">
      {sortedGroups.map(([key, { label, posts }]) => (
        <div key={key}>
          {/* Header del mes */}
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold capitalize">{label}</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'}
            </span>
          </div>

          {/* Lista de posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-300">
                  {/* Imagen */}
                  {post.imagen_portada_url && (
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={post.imagen_portada_url}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    {/* Categorías */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
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

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.titulo}
                    </h3>

                    {post.descripcion_corta && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.descripcion_corta}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
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
      ))}
    </div>
  );
}
