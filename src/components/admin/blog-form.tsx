'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import RichTextEditor from './rich-text-editor';
import { BlogPost } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';

interface BlogFormProps {
  post: BlogPost | null;
  onClose: () => void;
}

interface FormData {
  titulo: string;
  slug: string;
  descripcion_corta: string;
  autor: string;
  publicado: boolean;
  tags: string;
}

export default function BlogForm({ post, onClose }: BlogFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [contenido, setContenido] = useState(post?.contenido || '');
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      titulo: post?.titulo || '',
      slug: post?.slug || '',
      descripcion_corta: post?.descripcion_corta || '',
      autor: post?.autor || '',
      publicado: post?.publicado || false,
      tags: post?.tags?.join(', ') || '',
    },
  });

  const titulo = watch('titulo');

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true);
      const supabase = supabaseBrowserClient();

      let imagenUrl = post?.imagen_portada_url;

      // Validate and upload image if changed
      if (imageFile) {
        const validation = validateImageFile(imageFile);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        imagenUrl = await uploadToCloudinary(imageFile, 'blog');
      }

      // Generate slug from title if not provided
      const slug =
        data.slug ||
        titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const tagsArray = data.tags
        ? data.tags.split(',').map((tag) => tag.trim())
        : [];

      const postData = {
        titulo: data.titulo,
        slug,
        descripcion_corta: data.descripcion_corta || null,
        contenido: contenido,
        imagen_portada_url: imagenUrl || null,
        autor: data.autor || null,
        publicado: data.publicado,
        tags: tagsArray.length > 0 ? tagsArray : null,
        fecha_publicacion: post?.fecha_publicacion || new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };

      if (post) {
        // Update existing
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;

        toast({
          title: 'Éxito',
          description: 'Post actualizado correctamente',
        });
      } else {
        // Create new
        const { error } = await supabase.from('blog_posts').insert([postData]);

        if (error) throw error;

        toast({
          title: 'Éxito',
          description: 'Post creado correctamente',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el post',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Post' : 'Nuevo Post'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                {...register('titulo', { required: true })}
                placeholder="Título del post"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="titulo-del-post"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autor">Autor</Label>
            <Input
              id="autor"
              {...register('autor')}
              placeholder="Nombre del autor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion_corta">Descripción Corta</Label>
            <Textarea
              id="descripcion_corta"
              {...register('descripcion_corta')}
              placeholder="Breve resumen del post"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Contenido *</Label>
            <RichTextEditor
              content={contenido}
              onChange={setContenido}
              placeholder="Escribe el contenido del post..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separados por comas)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="diseño, tutorial, recursos"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagen de Portada</Label>
            <div className="flex items-center gap-4">
              {(post?.imagen_portada_url || imageFile) && (
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : post?.imagen_portada_url || ''
                  }
                  alt="Preview"
                  className="w-40 h-24 rounded object-cover"
                />
              )}
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Subir Imagen</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="publicado"
              checked={watch('publicado')}
              onCheckedChange={(checked) => setValue('publicado', checked)}
            />
            <Label htmlFor="publicado" className="cursor-pointer">
              Publicar inmediatamente
            </Label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
