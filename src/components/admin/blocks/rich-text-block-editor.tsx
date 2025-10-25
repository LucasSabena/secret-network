// FILE: src/components/admin/blocks/rich-text-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { RichTextEditorV2 } from './rich-text-editor-v2';

interface RichTextBlockEditorProps {
  block: Extract<Block, { type: 'text' }>;
  onChange: (block: Extract<Block, { type: 'text' }>) => void;
}

export function RichTextBlockEditor({ block, onChange }: RichTextBlockEditorProps) {
  return (
    <div className="space-y-2">
      <RichTextEditorV2
        content={block.data.content || ''}
        onChange={(content) => onChange({ ...block, data: { ...block.data, content } })}
        placeholder="Escribe tu contenido aquí... Usa # para títulos, - para listas"
      />
    </div>
  );
}
