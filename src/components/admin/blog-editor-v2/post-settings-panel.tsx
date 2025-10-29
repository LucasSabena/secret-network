'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Settings, 
  Link as LinkIcon, 
  Calendar as CalendarIcon,
  Tag,
  User,
  Eye,
  EyeOff,
  Hash,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PostSettingsPanelProps {
  titulo: string;
  slug: string;
  descripcionCorta: string;
  tags: string[];
  publicado: boolean;
  isFeatured: boolean;
  fechaPublicacion: Date;
  autor: string;
  onTituloChange?: (titulo: string) => void;
  onSlugChange: (slug: string) => void;
  onDescripcionChange: (desc: string) => void;
  onTagsChange: (tags: string[]) => void;
  onPublicadoChange: (publicado: boolean) => void;
  onIsFeaturedChange: (featured: boolean) => void;
  onFechaChange: (fecha: Date) => void;
}

export function PostSettingsPanel({
  titulo,
  slug,
  descripcionCorta,
  tags,
  publicado,
  isFeatured,
  fechaPublicacion,
  autor,
  onTituloChange,
  onSlugChange,
  onDescripcionChange,
  onTagsChange,
  onPublicadoChange,
  onIsFeaturedChange,
  onFechaChange,
}: PostSettingsPanelProps) {
  const [editingSlug, setEditingSlug] = useState(false);
  const [tempSlug, setTempSlug] = useState(slug);
  const [newTag, setNewTag] = useState('');

  const handleSlugSave = () => {
    const cleanSlug = tempSlug
      .toLowerCase()
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

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Configuración del Post</h3>
        </div>

        {/* Título */}
        {onTituloChange && (
          <div className="space-y-2">
            <Label className="text-xs">Título del Post</Label>
            <Input
              value={titulo}
              onChange={(e) => onTituloChange(e.target.value)}
              placeholder="Título del post..."
              className="text-sm font-semibold"
            />
            <p className="text-xs text-muted-foreground">
              {titulo.length} caracteres
            </p>
          </div>
        )}

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
                className="text-sm"
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
                <code className="text-xs flex-1 break-all overflow-hidden">{slug || 'sin-slug'}</code>
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
              >
                <Hash className="h-3 w-3 mr-1" />
                Generar desde título
              </Button>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground break-all">
            URL final: /blog/{slug || 'sin-slug'}
          </p>
        </div>

        {/* Descripción corta */}
        <div className="space-y-2">
          <Label className="text-xs">Descripción Corta</Label>
          <Textarea
            value={descripcionCorta}
            onChange={(e) => onDescripcionChange(e.target.value)}
            placeholder="Breve descripción del post..."
            className="text-sm min-h-[80px]"
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground text-right">
            {descripcionCorta.length}/160
          </p>
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

          {/* Post destacado en serie */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-xs">
              <Settings className="h-3 w-3 text-primary" />
              Destacado en Serie
            </Label>
            <Switch
              checked={isFeatured}
              onCheckedChange={onIsFeaturedChange}
            />
          </div>
          {isFeatured && (
            <p className="text-xs text-muted-foreground">
              Aparecerá en el carrusel destacado de su serie
            </p>
          )}

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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaPublicacion}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      // Ajustar la fecha a la zona horaria de Argentina (UTC-3)
                      const argDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
                      onFechaChange(argDate);
                    }
                  }}
                  locale={es}
                  defaultMonth={fechaPublicacion}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <Tag className="h-3 w-3" />
            Etiquetas
          </Label>
          
          {/* Tags existentes */}
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

          {/* Agregar nuevo tag */}
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="nueva-etiqueta"
              className="text-sm h-8"
            />
            <Button
              size="sm"
              onClick={handleAddTag}
              className="h-8 px-3 text-xs"
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* Autor */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3" />
            Autor
          </Label>
          <div className="p-2 bg-muted rounded-md">
            <p className="text-sm">{autor || 'Sin autor'}</p>
          </div>
        </div>

        {/* Info adicional */}
        <div className="p-3 bg-muted rounded-lg space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Título:</span>
            <span className="font-medium truncate ml-2 max-w-[150px]">
              {titulo || 'Sin título'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Caracteres:</span>
            <span className="font-medium">{titulo.length}</span>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
