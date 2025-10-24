// FILE: src/components/admin/blocks/comparison-block-editor.tsx
'use client';

import { ComparisonBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface ComparisonBlockEditorProps {
  block: ComparisonBlock;
  onChange: (block: ComparisonBlock) => void;
}

export function ComparisonBlockEditor({ block, onChange }: ComparisonBlockEditorProps) {
  const addItem = () => {
    const newFeatures: Record<string, boolean | string> = {};
    block.data.featureLabels.forEach(label => {
      newFeatures[label] = false;
    });
    onChange({
      ...block,
      data: {
        ...block.data,
        items: [...block.data.items, { name: 'Nuevo item', features: newFeatures }],
      },
    });
  };

  const addFeature = () => {
    const newLabel = `Feature ${block.data.featureLabels.length + 1}`;
    onChange({
      ...block,
      data: {
        ...block.data,
        featureLabels: [...block.data.featureLabels, newLabel],
        items: block.data.items.map(item => ({
          ...item,
          features: { ...item.features, [newLabel]: false },
        })),
      },
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Features</Label>
        {block.data.featureLabels.map((label, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              value={label}
              onChange={(e) => {
                const newLabels = [...block.data.featureLabels];
                const oldLabel = newLabels[index];
                newLabels[index] = e.target.value;
                onChange({
                  ...block,
                  data: {
                    ...block.data,
                    featureLabels: newLabels,
                    items: block.data.items.map(item => {
                      const newFeatures = { ...item.features };
                      newFeatures[e.target.value] = newFeatures[oldLabel];
                      delete newFeatures[oldLabel];
                      return { ...item, features: newFeatures };
                    }),
                  },
                });
              }}
            />
          </div>
        ))}
        <Button onClick={addFeature} size="sm">
          <Plus className="mr-2 h-3 w-3" />
          Agregar Feature
        </Button>
      </div>
      <div>
        <Label>Items</Label>
        {block.data.items.map((item, index) => (
          <div key={index} className="border p-2 rounded mb-2">
            <Input
              value={item.name}
              onChange={(e) => {
                const newItems = [...block.data.items];
                newItems[index].name = e.target.value;
                onChange({ ...block, data: { ...block.data, items: newItems } });
              }}
              className="mb-2"
            />
          </div>
        ))}
        <Button onClick={addItem} size="sm">
          <Plus className="mr-2 h-3 w-3" />
          Agregar Item
        </Button>
      </div>
    </div>
  );
}
