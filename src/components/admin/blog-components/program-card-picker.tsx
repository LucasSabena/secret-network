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
<div style="border: 1px solid rgb(51, 51, 51); border-radius: 12px; background: rgb(26, 26, 26); overflow: hidden; transition: all 0.2s; margin: 24px 0; display: inline-block; max-width: 100%;">
  <a href="/programas/${program.slug}" style="text-decoration: none; color: inherit; display: block;">
    <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 12px;">
          <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
              <td style="width: 48px; vertical-align: top; padding-right: 12px;">
                ${program.icono_url ? `
                  <img 
                    src="${program.icono_url}" 
                    alt="${program.nombre}" 
                    style="width: 48px; height: 48px; border-radius: 8px; object-fit: contain; background: rgb(39, 39, 42); padding: 6px; display: block;"
                  />
                ` : `
                  <div style="width: 48px; height: 48px; border-radius: 8px; background: rgb(39, 39, 42);"></div>
                `}
              </td>
              <td style="vertical-align: top;">
                <h4 style="font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: rgb(250, 250, 250); line-height: 1.4;">
                  ${program.nombre}${program.es_open_source ? ' <span style="color: rgb(161, 161, 170);">★</span>' : ''}
                </h4>
                <p style="font-size: 12px; color: rgb(161, 161, 170); margin: 0 0 4px 0; line-height: 1.5;">
                  ${description.substring(0, 80)}${description.length > 80 ? '...' : ''}
                </p>
                <span style="font-size: 10px; color: rgb(255, 51, 153); font-weight: 500;">
                  #${stripHtml(categoryName)}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </a>
</div>
    `.trim();
  }

  if (size === 'large') {
    return `
<div style="border: 1px solid rgb(51, 51, 51); border-radius: 12px; background: rgb(26, 26, 26); overflow: hidden; margin: 24px 0; max-width: 100%;">
  <a href="/programas/${program.slug}" style="text-decoration: none; color: inherit; display: block;">
    ${program.captura_url ? `
      <img 
        src="${program.captura_url}" 
        alt="${program.nombre}" 
        style="width: 100%; height: auto; aspect-ratio: 16/9; object-fit: cover; display: block;"
      />
    ` : `
      <div style="width: 100%; padding-bottom: 56.25%; position: relative; background: linear-gradient(135deg, rgb(255, 51, 153) 0%, rgb(153, 51, 255) 100%);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 64px; font-weight: bold; color: white;">${program.nombre.charAt(0)}</div>
      </div>
    `}
    <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 24px;">
          <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 16px;">
            <tr>
              ${program.icono_url ? `
                <td style="width: 48px; vertical-align: middle; padding-right: 12px;">
                  <img 
                    src="${program.icono_url}" 
                    alt="${program.nombre}" 
                    style="width: 48px; height: 48px; border-radius: 8px; object-fit: contain; background: rgb(39, 39, 42); padding: 6px; display: block;"
                  />
                </td>
              ` : ''}
              <td style="vertical-align: middle;">
                <h3 style="font-size: 24px; font-weight: 700; margin: 0 0 4px 0; color: rgb(250, 250, 250); line-height: 1.3;">
                  ${program.nombre}
                </h3>
                <span style="font-size: 14px; color: rgb(255, 51, 153); font-weight: 500;">
                  #${stripHtml(categoryName)}
                </span>
              </td>
            </tr>
          </table>
          <p style="font-size: 15px; color: rgb(161, 161, 170); margin: 0 0 16px 0; line-height: 1.6;">
            ${description}
          </p>
          ${program.web_oficial_url ? `
            <div>
              <span style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, rgb(255, 51, 153) 0%, rgb(153, 51, 255) 100%); color: white; border-radius: 8px; font-size: 14px; font-weight: 600;">
                Ver programa →
              </span>
            </div>
          ` : ''}
        </td>
      </tr>
    </table>
  </a>
</div>
    `.trim();
  }

  // Medium (default)
  return `
<div style="border: 1px solid rgb(51, 51, 51); border-radius: 12px; background: rgb(26, 26, 26); overflow: hidden; margin: 24px 0; max-width: 400px;">
  <a href="/programas/${program.slug}" style="text-decoration: none; color: inherit; display: block;">
    <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 20px;">
          <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 16px;">
            <tr>
              ${program.icono_url ? `
                <td style="width: 64px; vertical-align: middle; padding-right: 12px;">
                  <img 
                    src="${program.icono_url}" 
                    alt="${program.nombre}" 
                    style="width: 64px; height: 64px; border-radius: 12px; object-fit: contain; background: rgb(39, 39, 42); padding: 8px; display: block;"
                  />
                </td>
              ` : ''}
              <td style="vertical-align: middle;">
                <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 6px 0; color: rgb(250, 250, 250); line-height: 1.3;">
                  ${program.nombre}
                </h3>
                <span style="font-size: 13px; color: rgb(255, 51, 153); font-weight: 500;">
                  #${stripHtml(categoryName)}
                </span>
              </td>
            </tr>
          </table>
          ${program.captura_url ? `
            <img 
              src="${program.captura_url}" 
              alt="${program.nombre}" 
              style="width: 100%; height: auto; aspect-ratio: 16/9; object-fit: cover; border-radius: 8px; margin-bottom: 16px; display: block;"
            />
          ` : ''}
          <p style="font-size: 14px; color: rgb(161, 161, 170); margin: 0; line-height: 1.6;">
            ${description}
          </p>
        </td>
      </tr>
    </table>
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
