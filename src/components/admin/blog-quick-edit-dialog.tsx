// FILE: src/components/admin/blog-quick-edit-dialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { BlogPost } from '@/lib/types';

interface BlogQuickEditDialogProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

/**
 * Dialog para edición rápida de campos básicos del post
 */
export function BlogQuickEditDialog({
  post,
  open,
  onOpenChange,
  onSave,
}: BlogQuickEditDialogProps) {
  const [titulo, setTitulo] = useState(post?.titulo || '');
  const [descripcion, setDescripcion] = useState(post?.descripcion_corta || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!post) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descripcion_corta: descripcion,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast({
        title: 'Post actualizado',
        description: 'Los cambios se guardaron correctamente',
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el post',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edición Rápida</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del post"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción Corta</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción breve del post"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
