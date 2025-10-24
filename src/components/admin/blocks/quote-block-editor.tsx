// FILE: src/components/admin/blocks/quote-block-editor.tsx
'use client';

import { QuoteBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuoteBlockEditorProps {
  block: QuoteBlock;
  onChange: (block: QuoteBlock) => void;
}

export function QuoteBlockEditor({ block, onChange }: QuoteBlockEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Cita</Label>
        <Textarea
          value={block.data.quote}
          onChange={(e) => onChange({ ...block, data: { ...block.data, quote: e.target.value } })}
          rows={3}
        />
      </div>
      <div>
        <Label>Autor (opcional)</Label>
        <Input
          value={block.data.author || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, author: e.target.value } })}
        />
      </div>
      <div>
        <Label>Cargo (opcional)</Label>
        <Input
          value={block.data.role || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, role: e.target.value } })}
        />
      </div>
      <div>
        <Label>Variante</Label>
        <Select
          value={block.data.variant}
          onValueChange={(value: any) => onChange({ ...block, data: { ...block.data, variant: value } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="bordered">Con Borde</SelectItem>
            <SelectItem value="highlighted">Destacado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
