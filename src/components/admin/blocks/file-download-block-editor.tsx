// FILE: src/components/admin/blocks/file-download-block-editor.tsx
'use client';

import { FileDownloadBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FileDownloadBlockEditorProps {
  block: FileDownloadBlock;
  onChange: (block: FileDownloadBlock) => void;
}

export function FileDownloadBlockEditor({ block, onChange }: FileDownloadBlockEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Nombre del Archivo</Label>
        <Input
          value={block.data.fileName}
          onChange={(e) => onChange({ ...block, data: { ...block.data, fileName: e.target.value } })}
          placeholder="documento.pdf"
        />
      </div>
      <div>
        <Label>URL del Archivo</Label>
        <Input
          value={block.data.fileUrl}
          onChange={(e) => onChange({ ...block, data: { ...block.data, fileUrl: e.target.value } })}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label>Tamaño (opcional)</Label>
        <Input
          value={block.data.fileSize || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, fileSize: e.target.value } })}
          placeholder="2.5 MB"
        />
      </div>
      <div>
        <Label>Tipo (opcional)</Label>
        <Input
          value={block.data.fileType || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, fileType: e.target.value } })}
          placeholder="PDF"
        />
      </div>
      <div>
        <Label>Descripción (opcional)</Label>
        <Textarea
          value={block.data.description || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, description: e.target.value } })}
          rows={2}
        />
      </div>
    </div>
  );
}
