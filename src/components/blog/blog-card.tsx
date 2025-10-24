// FILE: src/components/blog/blog-card.tsx

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { calculateReadingTime, calculateReadingTimeFromBlocks } from "@/lib/reading-time";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Usar bloques si existen, sino usar contenido legacy
  const readingTime = post.contenido_bloques && post.contenido_bloques.length > 0
    ? calculateReadingTimeFromBlocks(post.contenido_bloques)
    : calculateReadingTime(post.contenido);

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full" prefetch={false}>
      <Card className="group h-full overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
        {post.imagen_portada_url && (
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <Image
              src={post.imagen_portada_url}
              alt={post.titulo}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(post.fecha_publicacion)}</span>
            </div>
            
            {post.autor && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{post.autor}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime.text}</span>
            </div>
          </div>

          <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
            {post.titulo}
          </CardTitle>

          {post.descripcion_corta && (
            <CardDescription className="line-clamp-2">
              {post.descripcion_corta}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-primary font-medium">
            <span>Leer más</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
