// FILE: src/components/admin/blocks/text-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { IconSelector } from './icon-selector';
import { useState, useRef } from 'react';

interface TextBlockEditorProps {
  block: Extract<Block, { type: 'text' }>;
  onChange: (block: Extract<Block, { type: 'text' }>) => void;
}

export function TextBlockEditor({ block, onChange }: TextBlockEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertIcon = (iconName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = block.data.content;
    
    // Insertar el placeholder del icono en la posición del cursor
    const iconPlaceholder = `[icon:${iconName}]`;
    const newText = text.substring(0, start) + iconPlaceholder + text.substring(end);
    
    onChange({ ...block, data: { ...block.data, content: newText } });
    
    // Mover el cursor después del icono insertado
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + iconPlaceholder.length, start + iconPlaceholder.length);
    }, 0);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Label className="text-xs text-muted-foreground">Formato:</Label>
        <Select
          value={block.data.format}
          onValueChange={(value: any) =>
            onChange({ ...block, data: { ...block.data, format: value } })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Párrafo</SelectItem>
            <SelectItem value="h1">Título 1 (H1)</SelectItem>
            <SelectItem value="h2">Título 2 (H2)</SelectItem>
            <SelectItem value="h3">Título 3 (H3)</SelectItem>
            <SelectItem value="h4">Título 4 (H4)</SelectItem>
            <SelectItem value="ul">Lista desordenada</SelectItem>
            <SelectItem value="ol">Lista ordenada</SelectItem>
            <SelectItem value="quote">Cita</SelectItem>
            <SelectItem value="code">Código inline</SelectItem>
          </SelectContent>
        </Select>

        <IconSelector onSelect={insertIcon} />
      </div>

      <Textarea
        ref={textareaRef}
        value={block.data.content}
        onChange={(e) =>
          onChange({ ...block, data: { ...block.data, content: e.target.value } })
        }
        placeholder={`Escribe tu ${block.data.format === 'paragraph' ? 'texto' : block.data.format}...`}
        className="min-h-[100px] font-mono"
      />
      
      <p className="text-xs text-muted-foreground">
        Puedes usar HTML básico: &lt;strong&gt;, &lt;em&gt;, &lt;a href=""&gt;, &lt;code&gt;
        <br />
        Para insertar iconos usa: <code className="text-primary">[icon:nombre-icono]</code> (ej: [icon:heart])
      </p>
    </div>
  );
}
