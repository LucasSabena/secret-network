// FILE: src/components/admin/blog-categories-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

interface Category {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string;
  icono: string;
  orden: number;
}

export function BlogCategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    const { data, error } = await supabaseBrowserClient
      .from('blog_categories')
      .select('*')
      .order('orden', { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
    setIsLoading(false);
  }

  async function handleSave(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const color = formData.get('color') as string;
    const icono = formData.get('icono') as string;

    const slug = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      if (editingCategory) {
        // Actualizar
        const { error } = await supabaseBrowserClient
          .from('blog_categories')
          .update({
            nombre,
            slug,
            descripcion: descripcion || null,
            color,
            icono,
          })
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: 'Categoría actualizada',
          description: 'Los cambios se guardaron correctamente',
        });
      } else {
        // Crear
        const maxOrden = Math.max(...categories.map(c => c.orden), 0);
        
        const { error } = await supabaseBrowserClient
          .from('blog_categories')
          .insert([{
            nombre,
            slug,
            descripcion: descripcion || null,
            color,
            icono,
            orden: maxOrden + 1,
          }]);

        if (error) throw error;

        toast({
          title: 'Categoría creada',
          description: 'La nueva categoría está lista para usar',
        });
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la categoría',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      const { error } = await supabaseBrowserClient
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Categoría eliminada',
        description: 'La categoría se eliminó correctamente',
      });

      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la categoría',
        variant: 'destructive',
      });
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Botón Crear */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </DialogTitle>
            </DialogHeader>
            <form action={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  defaultValue={editingCategory?.nombre}
                  required
                  placeholder="Ej: Diseño Web"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  defaultValue={editingCategory?.descripcion || ''}
                  placeholder="Descripción breve de la categoría"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    defaultValue={editingCategory?.color || '#3b82f6'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icono">Icono (Lucide)</Label>
                  <Input
                    id="icono"
                    name="icono"
                    defaultValue={editingCategory?.icono || 'folder'}
                    placeholder="folder, code, palette"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Guardar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <CardTitle className="text-lg">{category.nombre}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(category);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {category.descripcion && (
                <CardDescription>{category.descripcion}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Slug: {category.slug}</span>
                <span>Icono: {category.icono}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No hay categorías todavía. Crea la primera.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
