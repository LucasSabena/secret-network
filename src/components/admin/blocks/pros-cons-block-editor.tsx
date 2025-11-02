'use client';

import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ProsConsBlockEditorProps {
  block: Extract<Block, { type: 'pros-cons' }>;
  onChange: (block: Extract<Block, { type: 'pros-cons' }>) => void;
}

export function ProsConsBlockEditor({ block, onChange }: ProsConsBlockEditorProps) {
  const addPro = () => {
    onChange({
      ...block,
      data: { ...block.data, pros: [...block.data.pros, ''] },
    });
  };

  const addCon = () => {
    onChange({
      ...block,
      data: { ...block.data, cons: [...block.data.cons, ''] },
    });
  };

  const removePro = (index: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        pros: block.data.pros.filter((_, i) => i !== index),
      },
    });
  };

  const removeCon = (index: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        cons: block.data.cons.filter((_, i) => i !== index),
      },
    });
  };

  const updatePro = (index: number, value: string) => {
    const newPros = [...block.data.pros];
    newPros[index] = value;
    onChange({ ...block, data: { ...block.data, pros: newPros } });
  };

  const updateCon = (index: number, value: string) => {
    const newCons = [...block.data.cons];
    newCons[index] = value;
    onChange({ ...block, data: { ...block.data, cons: newCons } });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm mb-2 block">Título (opcional)</Label>
        <Input
          value={block.data.title || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, title: e.target.value } })
          }
          placeholder="Pros y Contras"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pros */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm flex items-center gap-1 text-green-600">
              <ThumbsUp className="h-4 w-4" />
              Pros
            </Label>
            <Button type="button" size="sm" variant="outline" onClick={addPro}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-2">
            {block.data.pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={pro}
                  onChange={(e) => updatePro(index, e.target.value)}
                  placeholder="Ventaja..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePro(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm flex items-center gap-1 text-red-600">
              <ThumbsDown className="h-4 w-4" />
              Contras
            </Label>
            <Button type="button" size="sm" variant="outline" onClick={addCon}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-2">
            {block.data.cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={con}
                  onChange={(e) => updateCon(index, e.target.value)}
                  placeholder="Desventaja..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCon(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
