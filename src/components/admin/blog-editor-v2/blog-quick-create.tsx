// FILE: src/components/admin/blog-editor-v2/blog-quick-create.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Sparkles, User } from 'lucide-react';
import { Autor } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

interface BlogQuickCreateProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  titulo: string;
  descripcion_corta: string;
  autor_id: number | null;
  tags: string;
}

export function BlogQuickCreate({ open, onClose }: BlogQuickCreateProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [autores, setAutores] = useState<Autor[]>([]);
  
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      titulo: '',
      descripcion_corta: '',
      autor_id: null,
      tags: '',
    },
  });

  const autor_id = watch('autor_id');

  useEffect(() => {
    if (open) {
      loadAutores();
    }
  }, [open]);

  async function loadAutores() {
    const { data, error } = await supabaseBrowserClient
      .from('autores')
      .select('*')
      .order('nombre', { ascending: true });

    if (!error && data) {
      setAutores(data);
    }
  }

  async function onSubmit(data: FormData) {
    try {
      setIsCreating(true);

      const slug = data.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const tagsArray = data.tags
        ? data.tags.split(',').map((tag) => tag.trim())
        : [];

      const autor = autores.find((a) => a.id === data.autor_id);

      const postData = {
        titulo: data.titulo,
        slug,
        descripcion_corta: data.descripcion_corta || null,
        contenido: '',
        contenido_bloques: [],
        imagen_portada_url: null,
        autor: autor?.nombre || null,
        autor_id: data.autor_id || null,
        publicado: false,
        tags: tagsArray.length > 0 ? tagsArray : null,
        fecha_publicacion: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };

      const { data: newPost, error } = await supabaseBrowserClient
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Post creado',
        description: 'Ahora puedes empezar a agregar contenido',
      });

      reset();
      onClose();
      
      // Redirigir al editor completo
      router.push(`/admin/blog/editor?id=${newPost.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el post',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Crear Nuevo Post
          </DialogTitle>
          <DialogDescription>
            Configura la información básica. Luego podrás agregar el contenido en el editor completo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título del Post *</Label>
            <Input
              id="titulo"
              {...register('titulo', { required: true })}
              placeholder="Ej: Las 30 Mejores Páginas 404"
              className="text-lg"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              El slug (URL) se generará automáticamente
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion_corta">Descripción Corta</Label>
            <Textarea
              id="descripcion_corta"
              {...register('descripcion_corta')}
              placeholder="Un resumen breve que aparecerá en la lista de posts"
              rows={3}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground">
              {watch('descripcion_corta')?.length || 0}/300 caracteres
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="autor_id">Autor</Label>
              <Select
                value={autor_id?.toString() || ''}
                onValueChange={(value) =>
                  setValue('autor_id', value ? parseInt(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar autor">
                    {autor_id ? (
                      <div className="flex items-center gap-2">
                        {autores.find((a) => a.id === autor_id)?.avatar_url ? (
                          <img
                            src={
                              autores.find((a) => a.id === autor_id)
                                ?.avatar_url || ''
                            }
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span>
                          {autores.find((a) => a.id === autor_id)?.nombre}
                        </span>
                      </div>
                    ) : (
                      'Seleccionar autor'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {autores.map((autor) => (
                    <SelectItem key={autor.id} value={autor.id.toString()}>
                      <div className="flex items-center gap-2">
                        {autor.avatar_url ? (
                          <img
                            src={autor.avatar_url}
                            alt={autor.nombre}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span>{autor.nombre}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separados por comas)</Label>
              <Input
                id="tags"
                {...register('tags')}
                placeholder="diseño, tutorial, recursos"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !watch('titulo')}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Crear y Editar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
