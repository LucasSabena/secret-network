'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Loader2 } from 'lucide-react';

// Paleta de colores predefinidos
export const SERIE_COLORS = [
  { value: '#ff3399', label: 'Rosa' },
  { value: '#FF6B6B', label: 'Rojo' },
  { value: '#4ECDC4', label: 'Turquesa' },
  { value: '#45B7D1', label: 'Azul Cielo' },
  { value: '#FFA07A', label: 'Naranja' },
  { value: '#98D8C8', label: 'Verde Agua' },
  { value: '#F7DC6F', label: 'Amarillo' },
  { value: '#BB8FCE', label: 'Púrpura' },
  { value: '#85C1E2', label: 'Azul Claro' },
  { value: '#F8B739', label: 'Dorado' },
  { value: '#6C5CE7', label: 'Violeta' },
  { value: '#00B894', label: 'Verde' },
];

interface SerieFormData {
  nombre: string;
  slug: string;
  color: string;
  descripcion: string;
}

interface CreateSerieDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SerieFormData) => Promise<void>;
}

export function CreateSerieDialog({ open, onClose, onSave }: CreateSerieDialogProps) {
  const [formData, setFormData] = useState<SerieFormData>({
    nombre: '',
    slug: '',
    color: SERIE_COLORS[0].value,
    descripcion: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // Generar slug automáticamente desde el nombre
  useEffect(() => {
    if (autoSlug && formData.nombre) {
      const slug = formData.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.nombre, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (!formData.slug.trim()) {
      alert('El slug es requerido');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      // Reset form
      setFormData({
        nombre: '',
        slug: '',
        color: SERIE_COLORS[0].value,
        descripcion: '',
      });
      setAutoSlug(true);
      onClose();
    } catch (error) {
      console.error('Error saving serie:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nueva Serie</DialogTitle>
            <DialogDescription>
              Crea una serie para agrupar posts relacionados
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Serie *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Adobe MAX 2025"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData(prev => ({ ...prev, slug: e.target.value }));
                }}
                placeholder="adobe-max-2025"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL: /blog/serie/{formData.slug || 'slug'}
              </p>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERIE_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Describe de qué trata esta serie..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.descripcion.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Serie'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditSerieDialogProps {
  open: boolean;
  serie: SerieFormData | null;
  onClose: () => void;
  onSave: (data: SerieFormData) => Promise<void>;
}

export function EditSerieDialog({ open, serie, onClose, onSave }: EditSerieDialogProps) {
  const [formData, setFormData] = useState<SerieFormData>({
    nombre: '',
    slug: '',
    color: SERIE_COLORS[0].value,
    descripcion: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (serie) {
      setFormData(serie);
    }
  }, [serie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (!formData.slug.trim()) {
      alert('El slug es requerido');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating serie:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Serie</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la serie
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre de la Serie *</Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Adobe MAX 2025"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug (URL) *</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="adobe-max-2025"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL: /blog/serie/{formData.slug || 'slug'}
              </p>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERIE_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="edit-descripcion">Descripción (opcional)</Label>
              <Textarea
                id="edit-descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Describe de qué trata esta serie..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.descripcion.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface BlogPost {
  id: number;
  titulo: string;
  slug: string;
  fecha_publicacion: string;
  tags: string[];
}

interface AddPostDialogProps {
  open: boolean;
  serieTag: string;
  availablePosts: BlogPost[];
  onClose: () => void;
  onAdd: (postId: number) => Promise<void>;
}

export function AddPostDialog({ open, serieTag, availablePosts, onClose, onAdd }: AddPostDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredPosts = availablePosts.filter(post =>
    post.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!selectedPostId) return;

    setIsAdding(true);
    try {
      await onAdd(selectedPostId);
      setSelectedPostId(null);
      setSearchQuery('');
      onClose();
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Post a "{serieTag}"</DialogTitle>
          <DialogDescription>
            Selecciona un post para agregarlo a esta serie
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar posts..."
              className="pl-9"
            />
          </div>

          {/* Lista de posts */}
          <ScrollArea className="h-[400px] border rounded-lg">
            <div className="p-2 space-y-2">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No se encontraron posts' : 'No hay posts disponibles'}
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedPostId(post.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPostId === post.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <p className="font-medium">{post.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(post.fecha_publicacion).toLocaleDateString('es-ES')}
                    </p>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isAdding}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={!selectedPostId || isAdding}>
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Agregando...
              </>
            ) : (
              'Agregar Post'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
