// FILE: src/components/admin/blocks/embed-block-editor.tsx
'use client';

import { EmbedBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EmbedBlockEditorProps {
  block: EmbedBlock;
  onChange: (block: EmbedBlock) => void;
}

export function EmbedBlockEditor({ block, onChange }: EmbedBlockEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Código Embed (HTML/iframe)</Label>
        <Textarea
          value={block.data.embedCode}
          onChange={(e) => onChange({ ...block, data: { ...block.data, embedCode: e.target.value } })}
          rows={6}
          placeholder='<iframe src="..." />'
        />
      </div>
      <div>
        <Label>Altura (px, opcional)</Label>
        <Input
          type="number"
          value={block.data.height || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, height: parseInt(e.target.value) || undefined } })}
          placeholder="400"
        />
      </div>
      <div>
        <Label>Caption (opcional)</Label>
        <Input
          value={block.data.caption || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, caption: e.target.value } })}
        />
      </div>
    </div>
  );
}
