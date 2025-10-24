'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ImagePasteHandlerProps {
  onImagePasted: (file: File) => void;
  enabled?: boolean;
}

/**
 * Hook para manejar el pegado de imágenes con Ctrl+V
 * Detecta cuando se pega una imagen desde el clipboard y la procesa
 */
export function ImagePasteHandler({ onImagePasted, enabled = true }: ImagePasteHandlerProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      // Buscar imágenes en el clipboard
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          
          const file = item.getAsFile();
          if (!file) continue;

          // Validar tamaño (máximo 5MB)
          if (file.size > 5 * 1024 * 1024) {
            toast({
              title: 'Imagen muy grande',
              description: 'La imagen debe ser menor a 5MB',
              variant: 'destructive',
            });
            return;
          }

          // Crear un nombre único para la imagen
          const timestamp = Date.now();
          const extension = file.type.split('/')[1] || 'png';
          const newFile = new File(
            [file], 
            `pasted-image-${timestamp}.${extension}`,
            { type: file.type }
          );

          toast({
            title: 'Imagen detectada',
            description: 'Procesando imagen pegada...',
          });

          onImagePasted(newFile);
          return;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [enabled, onImagePasted, toast]);

  return null;
}
