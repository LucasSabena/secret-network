// FILE: src/components/admin/image-menu.tsx
'use client';

import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Trash2, Replace, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { validateImageFile } from '@/lib/cloudinary-config';
import { ImageManager } from '@/lib/image-manager';
import { useToast } from '@/components/ui/use-toast';

interface ImageMenuProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ImageMenu({ editor, isOpen, onClose, imageUrl }: ImageMenuProps) {
  const [isReplacing, setIsReplacing] = useState(false);
  const { toast } = useToast();

  const handleReplace = useCallback(async () => {
    if (!editor) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: 'Error',
          description: validation.error,
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsReplacing(true);
        
        // Si es un data URL, reemplazar en el manager
        if (ImageManager.isDataUrl(imageUrl)) {
          const newDataUrl = await ImageManager.replacePendingImage(imageUrl, file);
          
          // Actualizar la imagen en el editor
          editor.chain().focus().updateAttributes('image', { src: newDataUrl }).run();
        } else {
          // Si es una URL de Cloudinary, crear nueva data URL
          const newDataUrl = await ImageManager.addPendingImage(file);
          editor.chain().focus().updateAttributes('image', { src: newDataUrl }).run();
        }

        toast({
          title: 'Éxito',
          description: 'Imagen reemplazada (se subirá al guardar)',
        });
        onClose();
      } catch (error) {
        console.error('Error replacing image:', error);
        toast({
          title: 'Error',
          description: 'No se pudo reemplazar la imagen',
          variant: 'destructive',
        });
      } finally {
        setIsReplacing(false);
      }
    };

    input.click();
  }, [editor, imageUrl, toast, onClose]);

  const handleDelete = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteSelection().run();
    onClose();
  }, [editor, onClose]);

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(imageUrl);
    toast({
      title: 'Copiado',
      description: 'URL copiada al portapapeles',
    });
  }, [imageUrl, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Opciones de Imagen
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="border rounded-lg overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full max-h-[400px] object-contain"
            />
          </div>

          {/* Info */}
          <div className="text-sm text-muted-foreground">
            {ImageManager.isDataUrl(imageUrl) ? (
              <p className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                Imagen temporal (se subirá a Cloudinary al guardar)
              </p>
            ) : ImageManager.isCloudinaryUrl(imageUrl) ? (
              <p className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                Imagen guardada en Cloudinary
              </p>
            ) : (
              <p className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                Imagen externa
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleReplace}
              disabled={isReplacing}
              className="w-full"
            >
              <Replace className="h-4 w-4 mr-2" />
              {isReplacing ? 'Reemplazando...' : 'Reemplazar'}
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyUrl}
              className="w-full"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Copiar URL
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
