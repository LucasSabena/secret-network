// FILE: src/components/blog/blog-post-header.tsx

import Image from "next/image";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { calculateReadingTime, calculateReadingTimeFromBlocks } from "@/lib/reading-time";

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
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
    <header className="mb-8">
      <Link 
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver al blog</span>
      </Link>

      {post.imagen_portada_url && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg mb-8 bg-muted">
          <Image
            src={post.imagen_portada_url}
            alt={post.titulo}
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(post.fecha_publicacion)}</span>
        </div>
        
        {post.autor && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.autor}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{readingTime.text}</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {post.titulo}
      </h1>

      {post.descripcion_corta && (
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          {post.descripcion_corta}
        </p>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <hr className="mt-8 border-border" />
    </header>
  );
}
