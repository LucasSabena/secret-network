// FILE: src/components/admin/blocks/separator-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SeparatorBlockEditorProps {
  block: Extract<Block, { type: 'separator' }>;
  onChange: (block: Extract<Block, { type: 'separator' }>) => void;
}

export function SeparatorBlockEditor({ block, onChange }: SeparatorBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label className="text-sm">Estilo:</Label>
        <Select
          value={block.data.style}
          onValueChange={(value: any) =>
            onChange({ ...block, data: { style: value } })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Sólido</SelectItem>
            <SelectItem value="dashed">Guiones</SelectItem>
            <SelectItem value="dotted">Puntos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="py-4">
        <Label className="text-xs text-muted-foreground mb-2 block">Vista previa:</Label>
        <Separator className={`${block.data.style === 'dashed' ? 'border-dashed' : block.data.style === 'dotted' ? 'border-dotted' : ''}`} />
      </div>
    </div>
  );
}
