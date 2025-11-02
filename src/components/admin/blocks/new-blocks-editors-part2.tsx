'use client';

/**
 * Editores consolidados para los nuevos bloques - Parte 2
 */

import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
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
// PROGRESS BAR EDITOR
// ============================================================================
interface ProgressBarBlockEditorProps {
  block: Extract<Block, { type: 'progress-bar' }>;
  onChange: (block: Extract<Block, { type: 'progress-bar' }>) => void;
}

export function ProgressBarBlockEditor({ block, onChange }: ProgressBarBlockEditorProps) {
  const addItem = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: [
          ...block.data.items,
          { id: `prog-${Date.now()}`, label: '', value: 50, color: '#3b82f6' },
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

  const updateItem = (id: string, field: string, value: any) => {
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
      <Button type="button" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1" />
        Agregar Barra
      </Button>

      <div className="space-y-3">
        {block.data.items.map((item) => (
          <Card key={item.id} className="p-3">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                  placeholder="Etiqueta"
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.value}
                    onChange={(e) => updateItem(item.id, 'value', parseInt(e.target.value))}
                    placeholder="Valor (0-100)"
                  />
                  <Input
                    type="color"
                    value={item.color || '#3b82f6'}
                    onChange={(e) => updateItem(item.id, 'color', e.target.value)}
                    className="w-20"
                  />
                </div>
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
// CHECKLIST EDITOR
// ============================================================================
interface ChecklistBlockEditorProps {
  block: Extract<Block, { type: 'checklist' }>;
  onChange: (block: Extract<Block, { type: 'checklist' }>) => void;
}

export function ChecklistBlockEditor({ block, onChange }: ChecklistBlockEditorProps) {
  const addItem = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: [
          ...block.data.items,
          { id: `check-${Date.now()}`, text: '', checked: false },
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

  const updateItem = (id: string, text: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: block.data.items.map((i) => (i.id === id ? { ...i, text } : i)),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Título (opcional)</Label>
        <Input
          value={block.data.title || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, title: e.target.value } })
          }
          placeholder="Checklist"
        />
      </div>

      <Button type="button" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1" />
        Agregar Item
      </Button>

      <div className="space-y-2">
        {block.data.items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <Input
              value={item.text}
              onChange={(e) => updateItem(item.id, e.target.value)}
              placeholder="Tarea..."
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CHANGELOG EDITOR
// ============================================================================
interface ChangelogBlockEditorProps {
  block: Extract<Block, { type: 'changelog' }>;
  onChange: (block: Extract<Block, { type: 'changelog' }>) => void;
}

export function ChangelogBlockEditor({ block, onChange }: ChangelogBlockEditorProps) {
  const addEntry = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        entries: [
          ...block.data.entries,
          {
            id: `entry-${Date.now()}`,
            version: '1.0.0',
            date: new Date().toISOString().split('T')[0],
            changes: [''],
            type: 'added',
          },
        ],
      },
    });
  };

  const removeEntry = (id: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        entries: block.data.entries.filter((e) => e.id !== id),
      },
    });
  };

  const updateEntry = (id: string, field: string, value: any) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        entries: block.data.entries.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      },
    });
  };

  const addChange = (entryId: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        entries: block.data.entries.map((e) =>
          e.id === entryId ? { ...e, changes: [...e.changes, ''] } : e
        ),
      },
    });
  };

  const updateChange = (entryId: string, index: number, value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        entries: block.data.entries.map((e) =>
          e.id === entryId
            ? { ...e, changes: e.changes.map((c, i) => (i === index ? value : c)) }
            : e
        ),
      },
    });
  };

  return (
    <div className="space-y-4">
      <Button type="button" size="sm" onClick={addEntry}>
        <Plus className="h-4 w-4 mr-1" />
        Agregar Versión
      </Button>

      <div className="space-y-4">
        {block.data.entries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={entry.version}
                  onChange={(e) => updateEntry(entry.id, 'version', e.target.value)}
                  placeholder="Versión"
                  className="w-32"
                />
                <Input
                  type="date"
                  value={entry.date}
                  onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                />
                <Select
                  value={entry.type || 'added'}
                  onValueChange={(value) => updateEntry(entry.id, 'type', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">Agregado</SelectItem>
                    <SelectItem value="fixed">Corregido</SelectItem>
                    <SelectItem value="changed">Cambiado</SelectItem>
                    <SelectItem value="removed">Eliminado</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEntry(entry.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {entry.changes.map((change, index) => (
                  <Input
                    key={index}
                    value={change}
                    onChange={(e) => updateChange(entry.id, index, e.target.value)}
                    placeholder="Cambio..."
                  />
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addChange(entry.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar Cambio
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PRICING TABLE EDITOR
// ============================================================================
interface PricingTableBlockEditorProps {
  block: Extract<Block, { type: 'pricing-table' }>;
  onChange: (block: Extract<Block, { type: 'pricing-table' }>) => void;
}

export function PricingTableBlockEditor({ block, onChange }: PricingTableBlockEditorProps) {
  const addPlan = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        plans: [
          ...block.data.plans,
          {
            id: `plan-${Date.now()}`,
            name: 'Plan',
            price: '$0',
            period: '/mes',
            features: [''],
            highlighted: false,
            ctaText: 'Comenzar',
            ctaUrl: '',
          },
        ],
      },
    });
  };

  const removePlan = (id: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        plans: block.data.plans.filter((p) => p.id !== id),
      },
    });
  };

  const updatePlan = (id: string, field: string, value: any) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        plans: block.data.plans.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
      },
    });
  };

  const addFeature = (planId: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        plans: block.data.plans.map((p) =>
          p.id === planId ? { ...p, features: [...p.features, ''] } : p
        ),
      },
    });
  };

  const updateFeature = (planId: string, index: number, value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        plans: block.data.plans.map((p) =>
          p.id === planId
            ? { ...p, features: p.features.map((f, i) => (i === index ? value : f)) }
            : p
        ),
      },
    });
  };

  return (
    <div className="space-y-4">
      <Button type="button" size="sm" onClick={addPlan}>
        <Plus className="h-4 w-4 mr-1" />
        Agregar Plan
      </Button>

      <div className="space-y-4">
        {block.data.plans.map((plan) => (
          <Card key={plan.id} className="p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={plan.name}
                  onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                  placeholder="Nombre del plan"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlan(plan.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Input
                  value={plan.price}
                  onChange={(e) => updatePlan(plan.id, 'price', e.target.value)}
                  placeholder="Precio"
                />
                <Input
                  value={plan.period || ''}
                  onChange={(e) => updatePlan(plan.id, 'period', e.target.value)}
                  placeholder="/mes"
                  className="w-24"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Features</Label>
                {plan.features.map((feature, index) => (
                  <Input
                    key={index}
                    value={feature}
                    onChange={(e) => updateFeature(plan.id, index, e.target.value)}
                    placeholder="Feature..."
                  />
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addFeature(plan.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar Feature
                </Button>
              </div>

              <div className="flex gap-2">
                <Input
                  value={plan.ctaText || ''}
                  onChange={(e) => updatePlan(plan.id, 'ctaText', e.target.value)}
                  placeholder="Texto del botón"
                />
                <Input
                  value={plan.ctaUrl || ''}
                  onChange={(e) => updatePlan(plan.id, 'ctaUrl', e.target.value)}
                  placeholder="URL"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={plan.highlighted || false}
                  onChange={(e) => updatePlan(plan.id, 'highlighted', e.target.checked)}
                  id={`highlighted-${plan.id}`}
                />
                <Label htmlFor={`highlighted-${plan.id}`}>Destacar este plan</Label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// TESTIMONIAL EDITOR
// ============================================================================
interface TestimonialBlockEditorProps {
  block: Extract<Block, { type: 'testimonial' }>;
  onChange: (block: Extract<Block, { type: 'testimonial' }>) => void;
}

export function TestimonialBlockEditor({ block, onChange }: TestimonialBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Testimonio</Label>
        <Textarea
          value={block.data.quote}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, quote: e.target.value } })
          }
          placeholder="El testimonio aquí..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Autor</Label>
          <Input
            value={block.data.author}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, author: e.target.value } })
            }
            placeholder="Nombre"
          />
        </div>
        <div>
          <Label>Cargo</Label>
          <Input
            value={block.data.role || ''}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, role: e.target.value } })
            }
            placeholder="CEO, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Empresa</Label>
          <Input
            value={block.data.company || ''}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, company: e.target.value } })
            }
            placeholder="Nombre de empresa"
          />
        </div>
        <div>
          <Label>Rating (1-5)</Label>
          <Input
            type="number"
            min="1"
            max="5"
            value={block.data.rating || 5}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, rating: parseInt(e.target.value) } })
            }
          />
        </div>
      </div>

      <div>
        <Label>Avatar URL</Label>
        <Input
          value={block.data.avatar || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, avatar: e.target.value } })
          }
          placeholder="URL de la imagen"
        />
      </div>
    </div>
  );
}

// ============================================================================
// TIP BOX EDITOR
// ============================================================================
interface TipBoxBlockEditorProps {
  block: Extract<Block, { type: 'tip-box' }>;
  onChange: (block: Extract<Block, { type: 'tip-box' }>) => void;
}

export function TipBoxBlockEditor({ block, onChange }: TipBoxBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Tipo</Label>
        <Select
          value={block.data.type}
          onValueChange={(value: any) =>
            onChange({ ...block, data: { ...block.data, type: value } })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tip">Tip</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="danger">Danger</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Título (opcional)</Label>
        <Input
          value={block.data.title || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, title: e.target.value } })
          }
          placeholder="Título"
        />
      </div>

      <div>
        <Label>Contenido</Label>
        <Textarea
          value={block.data.content}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, content: e.target.value } })
          }
          placeholder="Contenido del tip... (soporta HTML)"
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Puedes usar HTML: &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
        </p>
      </div>

      <div>
        <Label>Icono (opcional)</Label>
        <Input
          value={block.data.icon || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, icon: e.target.value } })
          }
          placeholder="Nombre del icono de Lucide"
        />
      </div>
    </div>
  );
}

// ============================================================================
// CTA BANNER EDITOR
// ============================================================================
interface CTABannerBlockEditorProps {
  block: Extract<Block, { type: 'cta-banner' }>;
  onChange: (block: Extract<Block, { type: 'cta-banner' }>) => void;
}

export function CTABannerBlockEditor({ block, onChange }: CTABannerBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Título</Label>
        <Input
          value={block.data.title}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, title: e.target.value } })
          }
          placeholder="Título del banner"
        />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          value={block.data.description || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, description: e.target.value } })
          }
          placeholder="Descripción... (soporta HTML)"
          rows={2}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Puedes usar HTML: &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Texto del Botón</Label>
          <Input
            value={block.data.ctaText}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, ctaText: e.target.value } })
            }
            placeholder="Acción"
          />
        </div>
        <div>
          <Label>URL</Label>
          <Input
            value={block.data.ctaUrl}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, ctaUrl: e.target.value } })
            }
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Color de Fondo</Label>
          <Input
            type="color"
            value={block.data.backgroundColor || '#3b82f6'}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, backgroundColor: e.target.value } })
            }
          />
        </div>
        <div>
          <Label>Imagen de Fondo (opcional)</Label>
          <Input
            value={block.data.backgroundImage || ''}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, backgroundImage: e.target.value } })
            }
            placeholder="URL"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PRODUCT SHOWCASE EDITOR
// ============================================================================
interface ProductShowcaseBlockEditorProps {
  block: Extract<Block, { type: 'product-showcase' }>;
  onChange: (block: Extract<Block, { type: 'product-showcase' }>) => void;
}

export function ProductShowcaseBlockEditor({ block, onChange }: ProductShowcaseBlockEditorProps) {
  const [program, setProgram] = useState<any>(null);
  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data } = await supabaseBrowserClient
        .from('programas')
        .select('id, nombre, icono_url')
        .order('nombre');
      if (data) setAllPrograms(data);
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (block.data.programId > 0) {
      supabaseBrowserClient
        .from('programas')
        .select('*')
        .eq('id', block.data.programId)
        .single()
        .then(({ data }) => setProgram(data));
    }
  }, [block.data.programId]);

  const addFeature = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        features: [...(block.data.features || []), ''],
      },
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(block.data.features || [])];
    newFeatures[index] = value;
    onChange({ ...block, data: { ...block.data, features: newFeatures } });
  };

  const removeFeature = (index: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        features: (block.data.features || []).filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Buscar Programa:</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {program ? program.nombre : 'Selecciona un programa...'}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Buscar..." />
              <CommandList>
                <CommandEmpty>No se encontró.</CommandEmpty>
                <CommandGroup>
                  {allPrograms.map((prog) => (
                    <CommandItem
                      key={prog.id}
                      value={prog.nombre}
                      onSelect={() => {
                        onChange({ ...block, data: { ...block.data, programId: prog.id } });
                        setOpen(false);
                      }}
                    >
                      {prog.icono_url && (
                        <img src={prog.icono_url} alt="" className="w-5 h-5 mr-2 rounded" />
                      )}
                      {prog.nombre}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Features Destacadas (opcional)</Label>
          <Button type="button" size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
        <div className="space-y-2">
          {(block.data.features || []).map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="Feature..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFeature(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Texto del CTA</Label>
        <Input
          value={block.data.ctaText || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, ctaText: e.target.value } })
          }
          placeholder="Ver más"
        />
      </div>
    </div>
  );
}
