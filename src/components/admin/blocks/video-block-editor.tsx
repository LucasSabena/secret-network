// FILE: src/components/admin/blocks/video-block-editor.tsx
'use client';

import { VideoBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VideoBlockEditorProps {
  block: VideoBlock;
  onChange: (block: VideoBlock) => void;
}

export function VideoBlockEditor({ block, onChange }: VideoBlockEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>URL del Video</Label>
        <Input
          value={block.data.url}
          onChange={(e) => onChange({ ...block, data: { ...block.data, url: e.target.value } })}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      <div>
        <Label>Plataforma</Label>
        <Select
          value={block.data.platform}
          onValueChange={(value: 'youtube' | 'vimeo' | 'loom') =>
            onChange({ ...block, data: { ...block.data, platform: value } })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="loom">Loom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Caption (opcional)</Label>
        <Input
          value={block.data.caption || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, caption: e.target.value } })}
          placeholder="Descripción del video"
        />
      </div>
    </div>
  );
}
