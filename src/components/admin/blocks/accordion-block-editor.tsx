// FILE: src/components/admin/blocks/accordion-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { IconSelector } from './icon-selector';
import { useRef } from 'react';

interface AccordionBlockEditorProps {
  block: Extract<Block, { type: 'accordion' }>;
  onChange: (block: Extract<Block, { type: 'accordion' }>) => void;
}

export function AccordionBlockEditor({ block, onChange }: AccordionBlockEditorProps) {
  const generateId = () => `accordion-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const contentRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  const addItem = () => {
    onChange({
      ...block,
      data: {
        items: [...block.data.items, { id: generateId(), title: `Item ${block.data.items.length + 1}`, content: '' }],
      },
    });
  };

  const removeItem = (id: string) => {
    if (block.data.items.length === 1) return; // Mantener al menos 1 item
    onChange({
      ...block,
      data: {
        items: block.data.items.filter((item) => item.id !== id),
      },
    });
  };

  const updateItem = (id: string, field: 'title' | 'content', value: string) => {
    onChange({
      ...block,
      data: {
        items: block.data.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      },
    });
  };

  const insertIcon = (itemId: string, iconName: string) => {
    const textarea = contentRefs.current[itemId];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const item = block.data.items.find(i => i.id === itemId);
    if (!item) return;

    const text = item.content;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + `[icon:${iconName}]` + after;

    updateItem(itemId, 'content', newText);

    // Restaurar foco y posición del cursor
    setTimeout(() => {
      textarea.focus();
      const newPos = start + `[icon:${iconName}]`.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Acordeón</Label>
        <Button onClick={addItem} size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Item
        </Button>
      </div>

      <div className="space-y-4">
        {block.data.items.map((item, index) => (
          <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Item {index + 1}</Label>
              {block.data.items.length > 1 && (
                <Button
                  onClick={() => removeItem(item.id)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div>
              <Label className="text-xs mb-1 block">Título:</Label>
              <Input
                value={item.title}
                onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                placeholder="Título del item"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs">Contenido:</Label>
                <IconSelector onSelect={(iconName: string) => insertIcon(item.id, iconName)} />
              </div>
              <Textarea
                ref={(el) => { contentRefs.current[item.id] = el; }}
                value={item.content}
                onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                placeholder="Contenido del item. Puedes usar [icon:nombre] para insertar iconos."
                className="min-h-[100px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usa [icon:nombre] para insertar iconos inline (ej: [icon:heart])
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
