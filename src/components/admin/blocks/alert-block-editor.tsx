// FILE: src/components/admin/blocks/alert-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { IconSelector } from './icon-selector';
import { useRef } from 'react';

interface AlertBlockEditorProps {
  block: Extract<Block, { type: 'alert' }>;
  onChange: (block: Extract<Block, { type: 'alert' }>) => void;
}

export function AlertBlockEditor({ block, onChange }: AlertBlockEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const variantIcons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
  };

  const Icon = variantIcons[block.data.variant];

  const insertIcon = (iconName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = block.data.description;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + `[icon:${iconName}]` + after;

    onChange({ ...block, data: { ...block.data, description: newText } });

    // Restaurar foco y posición del cursor
    setTimeout(() => {
      textarea.focus();
      const newPos = start + `[icon:${iconName}]`.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

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
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Descripción:</Label>
            <IconSelector onSelect={(iconName: string) => insertIcon(iconName)} />
          </div>
          <Textarea
            ref={textareaRef}
            value={block.data.description}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, description: e.target.value } })
            }
            placeholder="Contenido de la alerta. Puedes usar [icon:nombre] para insertar iconos."
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Usa [icon:nombre] para insertar iconos inline (ej: [icon:heart])
          </p>
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
