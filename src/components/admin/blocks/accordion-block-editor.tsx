// FILE: src/components/admin/blocks/accordion-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { InlineRichEditor } from './inline-rich-editor';

interface AccordionBlockEditorProps {
  block: Extract<Block, { type: 'accordion' }>;
  onChange: (block: Extract<Block, { type: 'accordion' }>) => void;
}

export function AccordionBlockEditor({ block, onChange }: AccordionBlockEditorProps) {
  const generateId = () => `accordion-${Date.now()}-${Math.random().toString(36).substring(7)}`;

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
              <Label className="text-xs mb-1 block">Contenido:</Label>
              <InlineRichEditor
                value={item.content}
                onChange={(value) => updateItem(item.id, 'content', value)}
                placeholder="Contenido del item..."
                minHeight="120px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
