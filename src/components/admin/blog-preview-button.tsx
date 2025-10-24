// FILE: src/components/admin/blog-preview-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BlogPreviewButtonProps {
  postId?: number;
  postData?: {
    titulo: string;
    slug: string;
    descripcion_corta: string;
    contenido_bloques: any[];
    imagen_portada_url?: string;
  };
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function BlogPreviewButton({
  postId,
  postData,
  variant = 'outline',
  size = 'sm',
}: BlogPreviewButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handlePreview = async () => {
    try {
      setIsGenerating(true);

      let previewUrl = '';

      if (postId) {
        // Post existente - generar token
        const response = await fetch('/api/preview/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        });

        if (!response.ok) throw new Error('Error generando preview');

        const { token } = await response.json();
        previewUrl = `/blog/preview/${token}`;
      } else if (postData) {
        // Post nuevo - preview temporal
        const tempData = encodeURIComponent(JSON.stringify(postData));
        previewUrl = `/blog/preview/temp?data=${tempData}`;
      } else {
        throw new Error('No hay datos para preview');
      }

      // Abrir en nueva pestaña
      window.open(previewUrl, '_blank');

      toast({
        title: 'Preview generado',
        description: 'Se abrió el preview en una nueva pestaña',
      });
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el preview',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePreview}
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
      {isGenerating ? 'Generando...' : 'Preview'}
      <ExternalLink className="h-3 w-3" />
    </Button>
  );
}
