// FILE: src/components/admin/blocks/alert-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { InlineRichEditor } from './inline-rich-editor';

interface AlertBlockEditorProps {
  block: Extract<Block, { type: 'alert' }>;
  onChange: (block: Extract<Block, { type: 'alert' }>) => void;
}

export function AlertBlockEditor({ block, onChange }: AlertBlockEditorProps) {
  const variantIcons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
  };

  const Icon = variantIcons[block.data.variant];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label className="text-sm mb-2 block">Tipo de alerta:</Label>
          <Select
            value={block.data.variant}
            onValueChange={(value: any) =>
              onChange({ ...block, data: { ...block.data, variant: value } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Informativo</SelectItem>
              <SelectItem value="success">Éxito</SelectItem>
              <SelectItem value="warning">Advertencia</SelectItem>
              <SelectItem value="destructive">Error/Peligro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm mb-2 block">Título (opcional):</Label>
          <Input
            value={block.data.title || ''}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, title: e.target.value } })
            }
            placeholder="Título de la alerta"
          />
        </div>

        <div>
          <Label className="text-sm mb-2 block">Descripción:</Label>
          <InlineRichEditor
            value={block.data.description}
            onChange={(value) =>
              onChange({ ...block, data: { ...block.data, description: value } })
            }
            placeholder="Contenido de la alerta..."
            minHeight="100px"
          />
        </div>
      </div>

      {/* Vista previa */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Vista previa:</Label>
        <Alert variant={block.data.variant === 'default' ? 'default' : block.data.variant as any}>
          <Icon className="h-4 w-4" />
          {block.data.title && <AlertTitle>{block.data.title}</AlertTitle>}
          <AlertDescription>{block.data.description || 'Escribe una descripción...'}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
