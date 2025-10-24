// FILE: src/components/admin/blocks/timeline-block-editor.tsx
'use client';

import { TimelineBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface TimelineBlockEditorProps {
  block: TimelineBlock;
  onChange: (block: TimelineBlock) => void;
}

export function TimelineBlockEditor({ block, onChange }: TimelineBlockEditorProps) {
  const addItem = () => {
    onChange({
      ...block,
      data: {
        items: [
          ...block.data.items,
          { id: `item-${Date.now()}`, date: '', title: '', description: '' },
        ],
      },
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...block,
      data: {
        items: block.data.items.filter((item) => item.id !== id),
      },
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {block.data.items.map((item, index) => (
        <div key={item.id} className="border p-3 rounded space-y-2">
          <div className="flex justify-between items-center">
            <Label>Item {index + 1}</Label>
            <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <Input
            placeholder="Fecha"
            value={item.date}
            onChange={(e) => {
              const newItems = [...block.data.items];
              newItems[index].date = e.target.value;
              onChange({ ...block, data: { items: newItems } });
            }}
          />
          <Input
            placeholder="Título"
            value={item.title}
            onChange={(e) => {
              const newItems = [...block.data.items];
              newItems[index].title = e.target.value;
              onChange({ ...block, data: { items: newItems } });
            }}
          />
          <Textarea
            placeholder="Descripción"
            value={item.description}
            onChange={(e) => {
              const newItems = [...block.data.items];
              newItems[index].description = e.target.value;
              onChange({ ...block, data: { items: newItems } });
            }}
            rows={2}
          />
        </div>
      ))}
      <Button onClick={addItem} size="sm">
        <Plus className="mr-2 h-3 w-3" />
        Agregar Item
      </Button>
    </div>
  );
}
