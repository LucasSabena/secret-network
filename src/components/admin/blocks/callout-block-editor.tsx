// FILE: src/components/admin/blocks/callout-block-editor.tsx
'use client';

import { CalloutBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalloutBlockEditorProps {
  block: CalloutBlock;
  onChange: (block: CalloutBlock) => void;
}

export function CalloutBlockEditor({ block, onChange }: CalloutBlockEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Icono (Lucide)</Label>
        <Input
          value={block.data.icon}
          onChange={(e) => onChange({ ...block, data: { ...block.data, icon: e.target.value } })}
          placeholder="lightbulb"
        />
      </div>
      <div>
        <Label>Color</Label>
        <Select
          value={block.data.color}
          onValueChange={(value: any) => onChange({ ...block, data: { ...block.data, color: value } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blue">Azul</SelectItem>
            <SelectItem value="green">Verde</SelectItem>
            <SelectItem value="yellow">Amarillo</SelectItem>
            <SelectItem value="red">Rojo</SelectItem>
            <SelectItem value="purple">Morado</SelectItem>
            <SelectItem value="gray">Gris</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Contenido</Label>
        <Textarea
          value={block.data.content}
          onChange={(e) => onChange({ ...block, data: { ...block.data, content: e.target.value } })}
          rows={4}
        />
      </div>
    </div>
  );
}
