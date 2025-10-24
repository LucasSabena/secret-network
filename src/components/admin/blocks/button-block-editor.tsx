// FILE: src/components/admin/blocks/button-block-editor.tsx
'use client';

import { ButtonBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ButtonBlockEditorProps {
  block: ButtonBlock;
  onChange: (block: ButtonBlock) => void;
}

export function ButtonBlockEditor({ block, onChange }: ButtonBlockEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Texto del Botón</Label>
        <Input
          value={block.data.text}
          onChange={(e) => onChange({ ...block, data: { ...block.data, text: e.target.value } })}
          placeholder="Click aquí"
        />
      </div>
      <div>
        <Label>URL</Label>
        <Input
          value={block.data.url}
          onChange={(e) => onChange({ ...block, data: { ...block.data, url: e.target.value } })}
          placeholder="https://..."
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
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Tamaño</Label>
        <Select
          value={block.data.size}
          onValueChange={(value: any) => onChange({ ...block, data: { ...block.data, size: value } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Pequeño</SelectItem>
            <SelectItem value="md">Mediano</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={block.data.openInNewTab}
          onCheckedChange={(checked) => onChange({ ...block, data: { ...block.data, openInNewTab: checked } })}
        />
        <Label>Abrir en nueva pestaña</Label>
      </div>
    </div>
  );
}
