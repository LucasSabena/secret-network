// FILE: src/components/admin/blocks/program-card-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { ProgramCard } from '@/components/shared/program-card';
import { Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ProgramCardBlockEditorProps {
  block: Extract<Block, { type: 'program-card' }>;
  onChange: (block: Extract<Block, { type: 'program-card' }>) => void;
}

export function ProgramCardBlockEditor({ block, onChange }: ProgramCardBlockEditorProps) {
  const [program, setProgram] = useState<any>(null);
  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Cargar todos los programas para el buscador
  useEffect(() => {
    const fetchAllPrograms = async () => {
      const { data } = await supabaseBrowserClient
        .from('programas')
        .select('id, nombre, icono_url')
        .order('nombre', { ascending: true });
      
      if (data) {
        setAllPrograms(data);
      }
    };

    fetchAllPrograms();
  }, []);

  // Cargar programa seleccionado
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
          <Label className="text-sm mb-2 block">Buscar Programa:</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {program ? program.nombre : "Selecciona un programa..."}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Busca por nombre..." />
                <CommandList>
                  <CommandEmpty>No se encontró ningún programa.</CommandEmpty>
                  <CommandGroup>
                    {allPrograms.map((prog) => (
                      <CommandItem
                        key={prog.id}
                        value={prog.nombre}
                        onSelect={() => {
                          onChange({ ...block, data: { ...block.data, programId: prog.id } });
                          setOpen(false);
                        }}
                      >
                        {prog.icono_url && (
                          <img src={prog.icono_url} alt="" className="w-5 h-5 mr-2 rounded" />
                        )}
                        {prog.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground mt-1">
            Busca y selecciona el programa que quieres mostrar
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
