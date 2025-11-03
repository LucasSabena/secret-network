'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Send, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BlogPublishButtonProps {
  postId: number;
  isPublished: boolean;
  onPublished?: () => void;
}

/**
 * Botón para publicar un blog
 * Cuando se publica, automáticamente postea en LinkedIn si está configurado
 */
export function BlogPublishButton({ postId, isPublished, onPublished }: BlogPublishButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const response = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al publicar');
      }

      const result = await response.json();

      // Mostrar mensaje de éxito
      let description = 'El blog ha sido publicado exitosamente';
      if (result.linkedIn?.success) {
        description += ' y compartido en LinkedIn';
      } else if (result.linkedIn?.error) {
        description += '. No se pudo compartir en LinkedIn: ' + result.linkedIn.error;
      }

      toast({
        title: '✅ Blog publicado',
        description,
      });

      // Callback para refrescar la lista
      if (onPublished) {
        onPublished();
      }

    } catch (error: any) {
      console.error('Error publishing:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo publicar el blog',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (isPublished) {
    return (
      <Button variant="outline" disabled size="sm">
        <Send className="h-4 w-4 mr-2" />
        Publicado
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm" disabled={isPublishing}>
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Publicando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Publicar
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Publicar este blog?</AlertDialogTitle>
          <AlertDialogDescription>
            El blog será visible públicamente y se compartirá automáticamente en LinkedIn si está configurado.
            Esta acción no se puede deshacer fácilmente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handlePublish}>
            Publicar ahora
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
