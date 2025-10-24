// FILE: src/components/admin/blocks/programs-grid-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Columns2, Columns3, Columns4 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ProgramsGridBlockEditorProps {
  block: Extract<Block, { type: 'programs-grid' }>;
  onChange: (block: Extract<Block, { type: 'programs-grid' }>) => void;
}

export function ProgramsGridBlockEditor({ block, onChange }: ProgramsGridBlockEditorProps) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    const { data } = await supabaseBrowserClient
      .from('programas')
      .select('id, nombre, icono_url')
      .order('nombre');
    
    if (data) {
      setPrograms(data);
    }
  }

  const addProgram = (programId: number) => {
    if (!block.data.programIds.includes(programId)) {
      onChange({
        ...block,
        data: {
          ...block.data,
          programIds: [...block.data.programIds, programId],
        },
      });
    }
  };

  const removeProgram = (programId: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        programIds: block.data.programIds.filter((id) => id !== programId),
      },
    });
  };

  const filteredPrograms = programs.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPrograms = programs.filter((p) =>
    block.data.programIds.includes(p.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Columnas
          </Label>
          <Select
            value={block.data.columns.toString()}
            onValueChange={(value) =>
              onChange({
                ...block,
                data: { ...block.data, columns: parseInt(value) as 2 | 3 | 4 },
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">
                <div className="flex items-center gap-2">
                  <Columns2 className="h-4 w-4" />
                  2 Columnas
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-2">
                  <Columns3 className="h-4 w-4" />
                  3 Columnas
                </div>
              </SelectItem>
              <SelectItem value="4">
                <div className="flex items-center gap-2">
                  <Columns4 className="h-4 w-4" />
                  4 Columnas
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Programas seleccionados */}
      {selectedPrograms.length > 0 && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Programas seleccionados ({selectedPrograms.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedPrograms.map((program) => (
              <Card key={program.id} className="flex items-center gap-2 p-2">
                {program.icono_url && (
                  <img
                    src={program.icono_url}
                    alt={program.nombre}
                    className="w-6 h-6 rounded"
                  />
                )}
                <span className="text-sm">{program.nombre}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeProgram(program.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Buscar y agregar programas */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">
          Agregar programas
        </Label>
        <Input
          placeholder="Buscar programa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-[200px] overflow-y-auto space-y-1">
          {filteredPrograms.map((program) => {
            const isSelected = block.data.programIds.includes(program.id);
            return (
              <button
                key={program.id}
                type="button"
                onClick={() => addProgram(program.id)}
                disabled={isSelected}
                className={`w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors text-left ${
                  isSelected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {program.icono_url && (
                  <img
                    src={program.icono_url}
                    alt={program.nombre}
                    className="w-6 h-6 rounded"
                  />
                )}
                <span className="text-sm">{program.nombre}</span>
                {isSelected && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Agregado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
