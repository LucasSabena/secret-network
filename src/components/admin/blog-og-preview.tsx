// FILE: src/components/admin/blog-og-preview.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2 } from 'lucide-react';

interface BlogOGPreviewProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

/**
 * Preview de cómo se verá el post en redes sociales (Open Graph)
 */
export function BlogOGPreview({ title, description, image, url }: BlogOGPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Preview en Redes Sociales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-white">
          {/* Imagen */}
          {image ? (
            <div className="aspect-[1.91/1] bg-muted">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Sin imagen</span>
            </div>
          )}

          {/* Contenido */}
          <div className="p-3 space-y-1">
            {url && (
              <p className="text-xs text-muted-foreground uppercase truncate">
                {url}
              </p>
            )}
            <h3 className="font-semibold text-sm line-clamp-2">
              {title || 'Título del post'}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description || 'Descripción del post'}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p>• Imagen recomendada: 1200x630px (ratio 1.91:1)</p>
          <p>• Título: máximo 60 caracteres</p>
          <p>• Descripción: máximo 160 caracteres</p>
        </div>
      </CardContent>
    </Card>
  );
}
