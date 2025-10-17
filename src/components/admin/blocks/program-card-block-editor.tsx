// FILE: src/components/admin/blocks/program-card-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { ProgramCard } from '@/components/shared/program-card';

interface ProgramCardBlockEditorProps {
  block: Extract<Block, { type: 'program-card' }>;
  onChange: (block: Extract<Block, { type: 'program-card' }>) => void;
}

export function ProgramCardBlockEditor({ block, onChange }: ProgramCardBlockEditorProps) {
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (block.data.programId > 0) {
      setLoading(true);
      supabaseBrowserClient
        .from('programas')
        .select('*')
        .eq('id', block.data.programId)
        .single()
        .then(({ data }: { data: any }) => {
          setProgram(data);
          setLoading(false);
        });
    }
  }, [block.data.programId]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label className="text-sm mb-2 block">ID del Programa:</Label>
          <Input
            type="number"
            value={block.data.programId || ''}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, programId: parseInt(e.target.value) || 0 } })
            }
            placeholder="Ingresa el ID del programa"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Encuentra el ID en la lista de programas del admin
          </p>
        </div>

        <div>
          <Label className="text-sm mb-2 block">Tamaño:</Label>
          <Select
            value={block.data.variant || 'default'}
            onValueChange={(value: any) =>
              onChange({ ...block, data: { ...block.data, variant: value } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Normal</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vista previa */}
      {program && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Vista previa:</Label>
          <ProgramCard program={program} variant={block.data.variant === 'large' ? 'large' : 'medium'} />
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground">Cargando programa...</p>}
      {!loading && block.data.programId > 0 && !program && (
        <p className="text-sm text-destructive">No se encontró el programa con ID {block.data.programId}</p>
      )}
    </div>
  );
}
