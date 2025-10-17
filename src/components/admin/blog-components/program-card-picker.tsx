'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Programa, Categoria } from '@/lib/types';
import { ProgramCard } from '@/components/shared/program-card';

interface ProgramCardPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (html: string) => void;
}

type CardSize = 'small' | 'medium' | 'large';

// Función para generar HTML del ProgramCard
function generateProgramCardHTML(
  program: Programa & { categoria?: Categoria },
  size: CardSize
): string {
  const stripHtml = (html: string | null | undefined): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const categoryName = program.categoria?.nombre || 'Sin categoría';
  const description = stripHtml(program.descripcion_corta || 'Sin descripción');
  
  // Estilos base para el card
  const cardStyles = `
    border: 1px solid #333;
    border-radius: 0.75rem;
    background: #1a1a1a;
    overflow: hidden;
    transition: all 0.2s;
    margin: 1.5rem 0;
  `;

  // HTML según el tamaño
  if (size === 'small') {
    return `
<div style="${cardStyles} display: inline-block; max-width: 100%;">
  <a href="/programas/${program.slug}" style="text-decoration: none; color: inherit; display: block;">
    <div style="padding: 0.5rem 0.75rem;">
      <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
        ${program.icono_url ? `
          <img 
            src="${program.icono_url}" 
            alt="${program.nombre}" 
            style="width: 48px; height: 48px; border-radius: 0.5rem; object-fit: contain; background: #27272a; padding: 6px; flex-shrink: 0;"
          />
        ` : `
          <div style="width: 48px; height: 48px; border-radius: 0.5rem; background: #27272a; flex-shrink: 0;"></div>
        `}
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.25rem;">
            <h4 style="font-size: 0.875rem; font-weight: 600; margin: 0; color: #fafafa; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${program.nombre}
            </h4>
            ${program.es_open_source ? '<span style="color: #a1a1aa; font-size: 0.75rem;">★</span>' : ''}
          </div>
          <p style="font-size: 0.75rem; color: #a1a1aa; margin: 0 0 0.25rem 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${description}
          </p>
          <span style="font-size: 0.625rem; color: #ff3399; font-weight: 500;">
            #${stripHtml(categoryName)}
          </span>
        </div>
      </div>
    </div>
  </a>
</div>
    `.trim();
  }

  if (size === 'large') {
    return `
<div style="${cardStyles} max-width: 100%;">
  <a href="/programas/${program.slug}" style="text-decoration: none; color: inherit; display: block;">
    ${program.captura_url ? `
      <img 
        src="${program.captura_url}" 
        alt="${program.nombre}" 
        style="width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;"
      />
    ` : `
      <div style="width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #ff3399 0%, #9933ff 100%); display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 4rem; font-weight: bold; color: white;">${program.nombre.charAt(0)}</span>
      </div>
    `}
    <div style="padding: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        ${program.icono_url ? `
          <img 
            src="${program.icono_url}" 
            alt="${program.nombre}" 
            style="width: 48px; height: 48px; border-radius: 0.5rem; object-fit: contain; background: #27272a; padding: 6px;"
          />
        ` : ''}
        <div>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin: 0 0 0.25rem 0; color: #fafafa;">
            ${program.nombre}
          </h3>
          <span style="font-size: 0.875rem; color: #ff3399; font-weight: 500;">
            #${stripHtml(categoryName)}
          </span>
        </div>
      </div>
      <p style="font-size: 0.9375rem; color: #a1a1aa; margin: 0; line-height: 1.6;">
        ${description}
      </p>
      ${program.web_oficial_url ? `
        <div style="margin-top: 1.25rem;">
          <span style="display: inline-block; padding: 0.625rem 1.25rem; background: linear-gradient(135deg, #ff3399 0%, #9933ff 100%); color: white; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600;">
            Ver programa →
          </span>
        </div>
      ` : ''}
    </div>
  </a>
</div>
    `.trim();
  }

  // Medium (default)
  return `
<div style="${cardStyles} max-width: 400px;">
  <a href="/programas/${program.slug}" style="text-decoration: none; color: inherit; display: block;">
    <div style="padding: 1.25rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        ${program.icono_url ? `
          <img 
            src="${program.icono_url}" 
            alt="${program.nombre}" 
            style="width: 64px; height: 64px; border-radius: 0.75rem; object-fit: contain; background: #27272a; padding: 8px;"
          />
        ` : ''}
        <div style="flex: 1;">
          <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 0.375rem 0; color: #fafafa;">
            ${program.nombre}
          </h3>
          <span style="font-size: 0.8125rem; color: #ff3399; font-weight: 500;">
            #${stripHtml(categoryName)}
          </span>
        </div>
      </div>
      ${program.captura_url ? `
        <img 
          src="${program.captura_url}" 
          alt="${program.nombre}" 
          style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem; display: block;"
        />
      ` : ''}
      <p style="font-size: 0.875rem; color: #a1a1aa; margin: 0; line-height: 1.6;">
        ${description}
      </p>
    </div>
  </a>
</div>
  `.trim();
}

export default function ProgramCardPicker({ isOpen, onClose, onInsert }: ProgramCardPickerProps) {
  const [programas, setProgramas] = useState<(Programa & { categoria?: Categoria })[]>([]);
  const [filteredProgramas, setFilteredProgramas] = useState<(Programa & { categoria?: Categoria })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<(Programa & { categoria?: Categoria }) | null>(null);
  const [selectedSize, setSelectedSize] = useState<CardSize>('medium');

  // Cargar programas
  useEffect(() => {
    if (!isOpen) return;

    const fetchProgramas = async () => {
      setIsLoading(true);
      try {
        // Fetch programas y categorías por separado
        const [{ data: programasData, error: programasError }, { data: categoriasData }] = await Promise.all([
          supabaseBrowserClient
            .from('programas')
            .select('*')
            .order('nombre', { ascending: true })
            .limit(50),
          supabaseBrowserClient
            .from('categorias')
            .select('*')
        ]);

        if (programasError) throw programasError;

        // Mapear categorías por ID
        const categoriasMap = new Map(categoriasData?.map(cat => [cat.id, cat]) || []);

        // Agregar categoría a cada programa
        const programasConCategoria = programasData?.map(p => ({
          ...p,
          categoria: categoriasMap.get(p.categoria_id)
        })) || [];

        setProgramas(programasConCategoria);
        setFilteredProgramas(programasConCategoria);
      } catch (error) {
        console.error('Error loading programs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgramas();
  }, [isOpen]);

  // Filtrar programas
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProgramas(programas);
      return;
    }

    const filtered = programas.filter((p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProgramas(filtered);
  }, [searchTerm, programas]);

  const handleInsert = () => {
    if (!selectedProgram) return;

    const html = generateProgramCardHTML(selectedProgram, selectedSize);
    onInsert(html);
    
    // Reset
    setSelectedProgram(null);
    setSearchTerm('');
    setSelectedSize('medium');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Insertar Programa</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar programa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de programas */}
            <div>
              <Label className="mb-3 block">Selecciona un programa:</Label>
              <div className="space-y-2 max-h-[400px] overflow-y-auto border rounded-lg p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredProgramas.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No se encontraron programas
                  </p>
                ) : (
                  filteredProgramas.map((program) => (
                    <button
                      key={program.id}
                      onClick={() => setSelectedProgram(program)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedProgram?.id === program.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {program.icono_url && (
                          <img
                            src={program.icono_url}
                            alt={program.nombre}
                            className="w-10 h-10 rounded object-contain bg-muted p-1"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{program.nombre}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {program.categoria?.nombre}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Preview y configuración */}
            <div>
              <div className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="size">Tamaño:</Label>
                  <Select value={selectedSize} onValueChange={(value: CardSize) => setSelectedSize(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño (inline)</SelectItem>
                      <SelectItem value="medium">Mediano (destacado)</SelectItem>
                      <SelectItem value="large">Grande (hero)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedProgram && (
                <Card className="p-4">
                  <Label className="mb-3 block">Vista Previa:</Label>
                  <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                    <ProgramCard program={selectedProgram} variant={selectedSize} />
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleInsert}
              disabled={!selectedProgram}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              Insertar Programa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
