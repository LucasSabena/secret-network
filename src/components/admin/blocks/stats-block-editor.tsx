// FILE: src/components/admin/blocks/stats-block-editor.tsx
'use client';

import { StatsBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatsBlockEditorProps {
  block: StatsBlock;
  onChange: (block: StatsBlock) => void;
}

export function StatsBlockEditor({ block, onChange }: StatsBlockEditorProps) {
  const addStat = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        stats: [...block.data.stats, { label: 'Nueva métrica', value: '0' }],
      },
    });
  };

  const removeStat = (index: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        stats: block.data.stats.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Columnas</Label>
        <Select
          value={block.data.columns.toString()}
          onValueChange={(value) => onChange({ ...block, data: { ...block.data, columns: parseInt(value) as 2 | 3 | 4 } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 columnas</SelectItem>
            <SelectItem value="3">3 columnas</SelectItem>
            <SelectItem value="4">4 columnas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {block.data.stats.map((stat, index) => (
        <div key={index} className="border p-3 rounded space-y-2">
          <div className="flex justify-between items-center">
            <Label>Métrica {index + 1}</Label>
            <Button size="icon" variant="ghost" onClick={() => removeStat(index)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <Input
            placeholder="Etiqueta"
            value={stat.label}
            onChange={(e) => {
              const newStats = [...block.data.stats];
              newStats[index].label = e.target.value;
              onChange({ ...block, data: { ...block.data, stats: newStats } });
            }}
          />
          <Input
            placeholder="Valor"
            value={stat.value}
            onChange={(e) => {
              const newStats = [...block.data.stats];
              newStats[index].value = e.target.value;
              onChange({ ...block, data: { ...block.data, stats: newStats } });
            }}
          />
        </div>
      ))}
      <Button onClick={addStat} size="sm">
        <Plus className="mr-2 h-3 w-3" />
        Agregar Métrica
      </Button>
    </div>
  );
}
