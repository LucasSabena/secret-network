'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Categoria } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

interface CategoriaFormProps {
  categoria: Categoria | null;
  categorias: Categoria[];
  onClose: () => void;
}

interface FormData {
  nombre: string;
  slug: string;
  descripcion: string;
  icono: string;
  id_categoria_padre: string;
}

export default function CategoriaForm({
  categoria,
  categorias,
  onClose,
}: CategoriaFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      nombre: categoria?.nombre || '',
      slug: categoria?.slug || '',
      descripcion: categoria?.descripcion || '',
      icono: categoria?.icono || '',
      id_categoria_padre: categoria?.id_categoria_padre?.toString() || '',
    },
  });

  const nombre = watch('nombre');

  useEffect(() => {
    if (nombre && !categoria) {
      const slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [nombre, categoria, setValue]);

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true);
      const supabase = supabaseBrowserClient();

      const categoriaData = {
        nombre: data.nombre,
        slug: data.slug,
        descripcion: data.descripcion || null,
        icono: data.icono || null,
        id_categoria_padre: data.id_categoria_padre && data.id_categoria_padre !== 'none'
          ? parseInt(data.id_categoria_padre)
          : null,
      };

      if (categoria) {
        // Update existing
        const { error } = await supabase
          .from('categorias')
          .update(categoriaData)
          .eq('id', categoria.id);

        if (error) throw error;

        toast({
          title: 'Éxito',
          description: 'Categoría actualizada correctamente',
        });
      } else {
        // Create new
        const { error } = await supabase
          .from('categorias')
          .insert([categoriaData]);

        if (error) throw error;

        toast({
          title: 'Éxito',
          description: 'Categoría creada correctamente',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving categoria:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la categoría',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  // Filter out the current categoria from parent options to prevent circular references
  const availableParents = categorias.filter(
    (c) => c.id !== categoria?.id && c.id_categoria_padre === null
  );

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre', { required: true })}
                placeholder="Nombre de la categoría"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug', { required: true })}
                placeholder="nombre-de-la-categoria"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              {...register('descripcion')}
              placeholder="Descripción de la categoría"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icono">Icono (emoji o texto)</Label>
              <Input
                id="icono"
                {...register('icono')}
                placeholder="🎨"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria_padre">Categoría Padre (opcional)</Label>
              <Select
                value={watch('id_categoria_padre')}
                onValueChange={(value) => setValue('id_categoria_padre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin categoría padre</SelectItem>
                  {availableParents.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
