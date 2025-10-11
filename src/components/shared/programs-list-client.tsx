"use client";

import { useState, useEffect, useMemo } from "react";
import { ProgramCard } from "@/components/shared/program-card";
import { ProgramFilters, type FilterOptions } from "@/components/shared/program-filters";

interface Programa {
  id: number;
  nombre: string;
  slug: string;
  descripcion_corta?: string;
  dificultad?: string;
  es_open_source: boolean;
  es_recomendado: boolean;
  id_categoria: number;
  icono_url?: string;
  categoria?: {
    id: number;
    nombre: string;
    slug: string;
  };
  subcategorias?: Array<{
    id: number;
    nombre: string;
    slug: string;
  }>;
  modelos_precios?: Array<{
    id: number;
    nombre: string;
    slug: string;
  }>;
}

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  id_categoria_padre?: number | null;
}

interface ModeloPrecio {
  id: number;
  nombre: string;
  slug: string;
}

interface ProgramsListClientProps {
  initialPrograms: Programa[];
  categorias: Categoria[];
  subcategorias: Categoria[];
  modelosPrecios: ModeloPrecio[];
  programasModelosPrecios: Array<{ programa_id: number; modelo_precio_id: number }>;
}

export function ProgramsListClient({
  initialPrograms,
  categorias,
  subcategorias,
  modelosPrecios,
  programasModelosPrecios
}: ProgramsListClientProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    categoriaId: null,
    subcategoriaIds: [],
    modelosPrecioIds: [],
    dificultad: null,
    esOpenSource: null,
    esRecomendado: null,
    sortBy: 'nombre-asc'
  });

  // Crear mapa de modelos de precio por programa
  const programaModelosMap = useMemo(() => {
    const map = new Map<number, number[]>();
    programasModelosPrecios.forEach(rel => {
      const existing = map.get(rel.programa_id) || [];
      existing.push(rel.modelo_precio_id);
      map.set(rel.programa_id, existing);
    });
    return map;
  }, [programasModelosPrecios]);

  // Aplicar filtros y ordenamiento
  const filteredPrograms = useMemo(() => {
    let result = [...initialPrograms];

    // Filtro de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(programa => {
        const nombreMatch = programa.nombre.toLowerCase().includes(searchLower);
        const categoriaMatch = programa.categoria?.nombre.toLowerCase().includes(searchLower);
        const subcategoriasMatch = programa.subcategorias?.some(
          sub => sub.nombre.toLowerCase().includes(searchLower)
        );
        return nombreMatch || categoriaMatch || subcategoriasMatch;
      });
    }

    // Filtro de categoría
    if (filters.categoriaId) {
      result = result.filter(p => p.categoria?.id === filters.categoriaId);
    }

    // Filtro de subcategorías
    if (filters.subcategoriaIds.length > 0) {
      result = result.filter(programa =>
        programa.subcategorias?.some(sub =>
          filters.subcategoriaIds.includes(sub.id)
        )
      );
    }

    // Filtro de modelos de precio
    if (filters.modelosPrecioIds.length > 0) {
      result = result.filter(programa => {
        const programaModelos = programaModelosMap.get(programa.id) || [];
        return filters.modelosPrecioIds.some(id => programaModelos.includes(id));
      });
    }

    // Filtro de dificultad
    if (filters.dificultad) {
      result = result.filter(p => p.dificultad === filters.dificultad);
    }

    // Filtro de open source
    if (filters.esOpenSource !== null) {
      result = result.filter(p => p.es_open_source === filters.esOpenSource);
    }

    // Filtro de recomendado
    if (filters.esRecomendado !== null) {
      result = result.filter(p => p.es_recomendado === filters.esRecomendado);
    }

    // Ordenamiento
    switch (filters.sortBy) {
      case 'nombre-asc':
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        result.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'recomendado':
        result.sort((a, b) => {
          if (a.es_recomendado === b.es_recomendado) return 0;
          return a.es_recomendado ? -1 : 1;
        });
        break;
      case 'nombre-recomendado':
        result.sort((a, b) => {
          if (a.es_recomendado !== b.es_recomendado) {
            return a.es_recomendado ? -1 : 1;
          }
          return a.nombre.localeCompare(b.nombre);
        });
        break;
    }

    return result;
  }, [initialPrograms, filters, programaModelosMap]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <ProgramFilters
        categorias={categorias.filter(c => !c.id_categoria_padre)}
        subcategorias={subcategorias}
        modelosPrecios={modelosPrecios}
        onFilterChange={setFilters}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredPrograms.length}</span> of{' '}
          <span className="font-semibold text-foreground">{initialPrograms.length}</span> programs
        </p>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((programa) => (
            <ProgramCard key={programa.id} program={programa as any} variant="large" />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">No programs found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or search term
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
