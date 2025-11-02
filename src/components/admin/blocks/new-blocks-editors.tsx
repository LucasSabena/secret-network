'use client';

/**
 * Editores consolidados para los nuevos bloques
 * Este archivo contiene todos los editores de bloques nuevos para mantener el código organizado
 */

import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, X, GripVertical, Upload, Columns2, Columns3, Columns4 } from 'lucide-react';
import { IconPicker } from './icon-picker';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search } from 'lucide-react';

// ============================================================================
// FEATURE LIST EDITOR
// ============================================================================
interface FeatureListBlockEditorProps {
  block: Extract<Block, { type: 'feature-list' }>;
  onChange: (block: Extract<Block, { type: 'feature-list' }>) => void;
}

export function FeatureListBlockEditor({ block, onChange }: FeatureListBlockEditorProps) {
  const addFeature = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        features: [
          ...block.data.features,
          { id: `feat-${Date.now()}`, icon: 'Check', title: '', description: '' },
        ],
      },
    });
  };

  const removeFeature = (id: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        features: block.data.features.filter((f) => f.id !== id),
      },
    });
  };

  const updateFeature = (id: string, field: keyof typeof block.data.features[0], value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        features: block.data.features.map((f) =>
          f.id === id ? { ...f, [field]: value } : f
        ),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Columnas</Label>
        <Select
          value={block.data.columns.toString()}
          onValueChange={(value) =>
            onChange({
              ...block,
              data: { ...block.data, columns: parseInt(value) as 2 | 3 | 4 },
            })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columnas</SelectItem>
            <SelectItem value="3">3 Columnas</SelectItem>
            <SelectItem value="4">4 Columnas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="button" size="sm" onClick={addFeature}>
        <Plus className="h-4 w-4 mr-1" />
        Agregar Feature
      </Button>

      <div className="space-y-3">
        {block.data.features.map((feature) => (
          <Card key={feature.id} className="p-3">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <IconPicker
                  value={feature.icon}
                  onChange={(icon) => updateFeature(feature.id, 'icon', icon)}
                  label="Icono"
                />
                <Input
                  value={feature.title}
                  onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                  placeholder="Título"
                />
                <Textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                  placeholder="Descripción"
                  rows={2}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFeature(feature.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BEFORE/AFTER EDITOR
// ============================================================================
interface BeforeAfterBlockEditorProps {
  block: Extract<Block, { type: 'before-after' }>;
  onChange: (block: Extract<Block, { type: 'before-after' }>) => void;
}

export function BeforeAfterBlockEditor({ block, onChange }: BeforeAfterBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Imagen "Antes"</Label>
        <Input
          value={block.data.beforeImage}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, beforeImage: e.target.value } })
          }
          placeholder="URL de la imagen"
        />
        <Input
          value={block.data.beforeLabel || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, beforeLabel: e.target.value } })
          }
          placeholder="Etiqueta (ej: Antes)"
          className="mt-2"
        />
      </div>
      <div>
        <Label>Imagen "Después"</Label>
        <Input
          value={block.data.afterImage}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, afterImage: e.target.value } })
          }
          placeholder="URL de la imagen"
        />
        <Input
          value={block.data.afterLabel || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, afterLabel: e.target.value } })
          }
          placeholder="Etiqueta (ej: Después)"
          className="mt-2"
        />
      </div>
    </div>
  );
}

// ============================================================================
// ICON GRID EDITOR
// ============================================================================
interface IconGridBlockEditorProps {
  block: Extract<Block, { type: 'icon-grid' }>;
  onChange: (block: Extract<Block, { type: 'icon-grid' }>) => void;
}

export function IconGridBlockEditor({ block, onChange }: IconGridBlockEditorProps) {
  const addItem = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: [
          ...block.data.items,
          { id: `icon-${Date.now()}`, icon: 'Star', title: '', description: '' },
        ],
      },
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: block.data.items.filter((i) => i.id !== id),
      },
    });
  };

  const updateItem = (id: string, field: string, value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: block.data.items.map((i) =>
          i.id === id ? { ...i, [field]: value } : i
        ),
      },
    });
  };

  return (
    <div className="space-y-4">
      <Select
        value={block.data.columns.toString()}
        onValueChange={(value) =>
          onChange({
            ...block,
            data: { ...block.data, columns: parseInt(value) as 2 | 3 | 4 },
          })
        }
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">2 Columnas</SelectItem>
          <SelectItem value="3">3 Columnas</SelectItem>
          <SelectItem value="4">4 Columnas</SelectItem>
        </SelectContent>
      </Select>

      <Button type="button" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1" />
        Agregar Item
      </Button>

      <div className="space-y-2">
        {block.data.items.map((item) => (
          <Card key={item.id} className="p-3">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <IconPicker
                  value={item.icon}
                  onChange={(icon) => updateItem(item.id, 'icon', icon)}
                  label="Icono"
                />
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                  placeholder="Título"
                />
                <Input
                  value={item.description || ''}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Descripción (opcional)"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CATEGORY CARD EDITOR
// ============================================================================
interface CategoryCardBlockEditorProps {
  block: Extract<Block, { type: 'category-card' }>;
  onChange: (block: Extract<Block, { type: 'category-card' }>) => void;
}

export function CategoryCardBlockEditor({ block, onChange }: CategoryCardBlockEditorProps) {
  const [category, setCategory] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabaseBrowserClient
        .from('categorias')
        .select('id, nombre, icono')
        .order('nombre');
      if (data) setAllCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (block.data.categoryId > 0) {
      supabaseBrowserClient
        .from('categorias')
        .select('*')
        .eq('id', block.data.categoryId)
        .single()
        .then(({ data }) => setCategory(data));
    }
  }, [block.data.categoryId]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Buscar Categoría:</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {category ? category.nombre : 'Selecciona una categoría...'}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Buscar..." />
              <CommandList>
                <CommandEmpty>No se encontró.</CommandEmpty>
                <CommandGroup>
                  {allCategories.map((cat) => (
                    <CommandItem
                      key={cat.id}
                      value={cat.nombre}
                      onSelect={() => {
                        onChange({ ...block, data: { ...block.data, categoryId: cat.id } });
                        setOpen(false);
                      }}
                    >
                      {cat.nombre}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Tamaño:</Label>
        <Select
          value={block.data.variant || 'default'}
          onValueChange={(value: any) =>
            onChange({ ...block, data: { ...block.data, variant: value } })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Pequeño</SelectItem>
            <SelectItem value="default">Normal</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ============================================================================
// AUTHOR BIO EDITOR
// ============================================================================
interface AuthorBioBlockEditorProps {
  block: Extract<Block, { type: 'author-bio' }>;
  onChange: (block: Extract<Block, { type: 'author-bio' }>) => void;
}

export function AuthorBioBlockEditor({ block, onChange }: AuthorBioBlockEditorProps) {
  const [author, setAuthor] = useState<any>(null);
  const [allAuthors, setAllAuthors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      const { data } = await supabaseBrowserClient
        .from('autores')
        .select('id, nombre, avatar_url')
        .order('nombre');
      if (data) setAllAuthors(data);
    };
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (block.data.authorId > 0) {
      supabaseBrowserClient
        .from('autores')
        .select('*')
        .eq('id', block.data.authorId)
        .single()
        .then(({ data }) => setAuthor(data));
    }
  }, [block.data.authorId]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Buscar Autor:</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {author ? author.nombre : 'Selecciona un autor...'}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Buscar..." />
              <CommandList>
                <CommandEmpty>No se encontró.</CommandEmpty>
                <CommandGroup>
                  {allAuthors.map((aut) => (
                    <CommandItem
                      key={aut.id}
                      value={aut.nombre}
                      onSelect={() => {
                        onChange({ ...block, data: { ...block.data, authorId: aut.id } });
                        setOpen(false);
                      }}
                    >
                      {aut.avatar_url && (
                        <img src={aut.avatar_url} alt="" className="w-6 h-6 rounded-full mr-2" />
                      )}
                      {aut.nombre}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={block.data.showSocial !== false}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, showSocial: e.target.checked } })
          }
          id="showSocial"
          aria-label="Mostrar redes sociales"
        />
        <Label htmlFor="showSocial">Mostrar redes sociales</Label>
      </div>
    </div>
  );
}

// ============================================================================
// POLL EDITOR
// ============================================================================
interface PollBlockEditorProps {
  block: Extract<Block, { type: 'poll' }>;
  onChange: (block: Extract<Block, { type: 'poll' }>) => void;
}

export function PollBlockEditor({ block, onChange }: PollBlockEditorProps) {
  const addOption = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        options: [...block.data.options, { id: `opt-${Date.now()}`, text: '' }],
      },
    });
  };

  const removeOption = (id: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        options: block.data.options.filter((o) => o.id !== id),
      },
    });
  };

  const updateOption = (id: string, text: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        options: block.data.options.map((o) => (o.id === id ? { ...o, text } : o)),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Pregunta</Label>
        <Input
          value={block.data.question}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, question: e.target.value } })
          }
          placeholder="¿Tu pregunta aquí?"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Opciones</Label>
          <Button type="button" size="sm" onClick={addOption}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
        <div className="space-y-2">
          {block.data.options.map((option, index) => (
            <div key={option.id} className="flex gap-2">
              <Input
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder={`Opción ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(option.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={block.data.allowMultiple || false}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, allowMultiple: e.target.checked } })
          }
          id="allowMultiple"
          aria-label="Permitir múltiples respuestas"
        />
        <Label htmlFor="allowMultiple">Permitir múltiples respuestas</Label>
      </div>

      <p className="text-xs text-muted-foreground">
        ID del Poll: <code className="bg-muted px-1 rounded">{block.data.pollId}</code>
      </p>
    </div>
  );
}

// Continúa en el siguiente archivo...
