// FILE: src/components/admin/blocks/divider-text-block-editor.tsx
'use client';

import { DividerTextBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DividerTextBlockEditorProps {
  block: DividerTextBlock;
  onChange: (block: DividerTextBlock) => void;
}

export function DividerTextBlockEditor({ block, onChange }: DividerTextBlockEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Texto (opcional)</Label>
        <Input
          value={block.data.text || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, text: e.target.value } })}
          placeholder="Sección"
        />
      </div>
      <div>
        <Label>Estilo</Label>
        <Select
          value={block.data.style}
          onValueChange={(value: any) => onChange({ ...block, data: { ...block.data, style: value } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Sólido</SelectItem>
            <SelectItem value="dashed">Discontinuo</SelectItem>
            <SelectItem value="dotted">Punteado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
