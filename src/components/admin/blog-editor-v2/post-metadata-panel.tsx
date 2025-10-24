'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Link as LinkIcon, 
  Calendar as CalendarIcon,
  Tag,
  User,
  Eye,
  EyeOff,
  Hash,
  FileText,
  Image as ImageIcon,
  Upload,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogCategorySelector } from '../blog-category-selector';

interface Autor {
  id: number;
  nombre: string;
  avatar_url?: string | null;
}

interface PostMetadataPanelProps {
  // Campos básicos
  titulo: string;
  slug: string;
  descripcionCorta: string;
  
  // Autor
  autorId: number | null;
  autores: Autor[];
  
  // Publicación
  publicado: boolean;
  fechaPublicacion: Date;
  scheduledFor: string | null;
  
  // Taxonomía
  tags: string[];
  categories: number[];
  
  // Imagen de portada
  imagenPortadaUrl?: string;
  imagenPortadaAlt?: string;
  imageFile: File | null;
  
  // Callbacks
  onTituloChange: (titulo: string) => void;
  onSlugChange: (slug: string) => void;
  onDescripcionChange: (desc: string) => void;
  onAutorChange: (autorId: number | null) => void;
  onPublicadoChange: (publicado: boolean) => void;
  onFechaChange: (fecha: Date) => void;
  onScheduledForChange: (date: string | null) => void;
  onTagsChange: (tags: string[]) => void;
  onCategoriesChange: (categories: number[]) => void;
  onImageFileChange: (file: File | null) => void;
  onImagenAltChange: (alt: string) => void;
}

export function PostMetadataPanel({
  titulo,
  slug,
  descripcionCorta,
  autorId,
  autores,
  publicado,
  fechaPublicacion,
  scheduledFor,
  tags,
  categories,
  imagenPortadaUrl,
  imagenPortadaAlt,
  imageFile,
  onTituloChange,
  onSlugChange,
  onDescripcionChange,
  onAutorChange,
  onPublicadoChange,
  onFechaChange,
  onScheduledForChange,
  onTagsChange,
  onCategoriesChange,
  onImageFileChange,
  onImagenAltChange,
}: PostMetadataPanelProps) {
  const [editingSlug, setEditingSlug] = useState(false);
  const [tempSlug, setTempSlug] = useState(slug);
  const [newTag, setNewTag] = useState('');

  const handleSlugSave = () => {
    const cleanSlug = tempSlug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    onSlugChange(cleanSlug);
    setTempSlug(cleanSlug);
    setEditingSlug(false);
  };

  const handleSlugCancel = () => {
    setTempSlug(slug);
    setEditingSlug(false);
  };

  const generateSlugFromTitle = () => {
    const newSlug = titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    setTempSlug(newSlug);
    onSlugChange(newSlug);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const cleanTag = newTag.trim().toLowerCase();
    if (!tags.includes(cleanTag)) {
      onTagsChange([...tags, cleanTag]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageFileChange(file);
    }
  };

  const selectedAutor = autores.find(a => a.id === autorId);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Metadatos del Post</h3>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <FileText className="h-3 w-3" />
            Título del Post
          </Label>
          <Input
            value={titulo}
            onChange={(e) => onTituloChange(e.target.value)}
            placeholder="Título del post..."
            className="text-sm font-semibold w-full"
          />
          <p className="text-xs text-muted-foreground break-words">
            {titulo.length} caracteres
          </p>
        </div>

        {/* URL/Slug */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <LinkIcon className="h-3 w-3" />
            URL del Post (Slug)
          </Label>
          
          {editingSlug ? (
            <div className="space-y-2">
              <Input
                value={tempSlug}
                onChange={(e) => setTempSlug(e.target.value)}
                placeholder="mi-post-ejemplo"
                className="text-sm w-full"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSlugSave}
                  className="flex-1 h-7 text-xs"
                >
                  Guardar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSlugCancel}
                  className="flex-1 h-7 text-xs"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <code className="text-xs flex-1 break-all overflow-hidden">
                  {slug || 'sin-slug'}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingSlug(true)}
                  className="h-6 px-2 text-xs shrink-0"
                >
                  Editar
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={generateSlugFromTitle}
                className="w-full h-7 text-xs"
                disabled={!titulo}
              >
                <Hash className="h-3 w-3 mr-1" />
                Generar desde título
              </Button>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground break-all">
            URL: /blog/{slug || 'sin-slug'}
          </p>
        </div>

        {/* Descripción corta */}
        <div className="space-y-2">
          <Label className="text-xs">Descripción Corta (SEO)</Label>
          <Textarea
            value={descripcionCorta}
            onChange={(e) => onDescripcionChange(e.target.value)}
            placeholder="Breve descripción del post para SEO y redes sociales..."
            className="text-sm min-h-[80px]"
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground text-right">
            {descripcionCorta.length}/160
          </p>
        </div>

        {/* Imagen de portada */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <ImageIcon className="h-3 w-3" />
            Imagen de Portada
          </Label>
          
          {(imageFile || imagenPortadaUrl) && (
            <div className="relative">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imagenPortadaUrl}
                alt="Portada"
                className="w-full h-32 object-cover rounded-md"
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onImageFileChange(null)}
                className="absolute top-2 right-2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => document.getElementById('cover-image-input')?.click()}
              className="flex-1 h-8 text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              {imageFile || imagenPortadaUrl ? 'Cambiar' : 'Subir'}
            </Button>
            <input
              id="cover-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Subir imagen de portada"
              title="Subir imagen de portada"
            />
          </div>
          
          {(imageFile || imagenPortadaUrl) && (
            <Input
              value={imagenPortadaAlt || ''}
              onChange={(e) => onImagenAltChange(e.target.value)}
              placeholder="Texto alternativo (alt)"
              className="text-xs"
            />
          )}
        </div>

        {/* Autor */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3" />
            Autor
          </Label>
          <Select
            value={autorId?.toString() || ''}
            onValueChange={(value) => onAutorChange(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Seleccionar autor">
                {selectedAutor && (
                  <div className="flex items-center gap-2">
                    {selectedAutor.avatar_url ? (
                      <img
                        src={selectedAutor.avatar_url}
                        alt=""
                        className="w-4 h-4 rounded-full"
                      />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span>{selectedAutor.nombre}</span>
                  </div>
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
                        alt=""
                        className="w-4 h-4 rounded-full"
                      />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span>{autor.nombre}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categorías */}
        <div className="space-y-2">
          <Label className="text-xs">Categorías</Label>
          <BlogCategorySelector
            selectedCategories={categories}
            onChange={onCategoriesChange}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <Tag className="h-3 w-3" />
            Etiquetas
          </Label>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-pink-900 dark:hover:text-pink-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="nueva-etiqueta"
              className="text-sm h-8"
            />
            <Button
              size="sm"
              onClick={handleAddTag}
              className="h-8 px-3 text-xs"
            >
              +
            </Button>
          </div>
        </div>

        {/* Estado de publicación */}
        <div className="space-y-3 p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-xs">
              {publicado ? (
                <Eye className="h-3 w-3 text-green-500" />
              ) : (
                <EyeOff className="h-3 w-3 text-muted-foreground" />
              )}
              {publicado ? 'Publicado' : 'Borrador'}
            </Label>
            <Switch
              checked={publicado}
              onCheckedChange={onPublicadoChange}
            />
          </div>

          {/* Fecha de publicación */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs">
              <CalendarIcon className="h-3 w-3" />
              Fecha de Publicación
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal h-8 text-xs',
                    !fechaPublicacion && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {fechaPublicacion ? (
                    format(fechaPublicacion, 'PPP', { locale: es })
                  ) : (
                    'Seleccionar fecha'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-3" align="start" side="left">
                <Calendar
                  mode="single"
                  selected={fechaPublicacion}
                  onSelect={(date: Date | undefined) => date && onFechaChange(date)}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Programar publicación */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Programar Publicación</Label>
              <Switch
                checked={!!scheduledFor}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    onScheduledForChange(null);
                  } else {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(9, 0, 0, 0);
                    onScheduledForChange(tomorrow.toISOString());
                  }
                }}
              />
            </div>
            
            {scheduledFor && (
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-8 text-xs"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {format(new Date(scheduledFor), 'PPP', { locale: es })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit p-3" align="start" side="left">
                    <Calendar
                      mode="single"
                      selected={new Date(scheduledFor)}
                      onSelect={(date: Date | undefined) => {
                        if (date) {
                          const currentDate = new Date(scheduledFor);
                          date.setHours(currentDate.getHours(), currentDate.getMinutes());
                          onScheduledForChange(date.toISOString());
                        }
                      }}
                      locale={es}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                
                <div>
                  <Label className="text-xs mb-1 block">Hora</Label>
                  <Input
                    type="time"
                    value={format(new Date(scheduledFor), 'HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newDate = new Date(scheduledFor);
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      onScheduledForChange(newDate.toISOString());
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}
            
            {scheduledFor && (
              <p className="text-xs text-muted-foreground">
                El post se publicará automáticamente en la fecha seleccionada
              </p>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
