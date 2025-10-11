// FILE: src/components/open-source/open-source-list-client.tsx

"use client";

import { useState, useMemo } from "react";
import { ProgramCard } from "@/components/shared/program-card";
import { ProgramFilters, type FilterOptions } from "@/components/shared/program-filters";
import type { Programa as ProgramaType } from "@/lib/types";

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

interface OpenSourceListClientProps {
  initialPrograms: ProgramaType[];
  categorias: Categoria[];
  subcategorias: Categoria[];
  modelosPrecios: ModeloPrecio[];
}

export function OpenSourceListClient({
  initialPrograms,
  categorias,
  subcategorias,
  modelosPrecios,
}: OpenSourceListClientProps) {
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

  // Aplicar filtros y ordenamiento (todos los programas ya son open-source)
  const filteredPrograms = useMemo(() => {
    let result = [...initialPrograms];

    // Filtro de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(programa => {
        const nombreMatch = programa.nombre.toLowerCase().includes(searchLower);
        const descripcionMatch = programa.descripcion_corta?.toLowerCase().includes(searchLower) ||
                                 programa.descripcion_larga?.toLowerCase().includes(searchLower);
        
        return nombreMatch || descripcionMatch;
      });
    }

    // Filtro de categoría
    if (filters.categoriaId) {
      result = result.filter(p => p.categoria_id === filters.categoriaId);
    }

    // Filtro de dificultad
    if (filters.dificultad) {
      result = result.filter(p => p.dificultad === filters.dificultad);
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
          if (a.es_recomendado === b.es_recomendado) {
            return a.nombre.localeCompare(b.nombre);
          }
          return a.es_recomendado ? -1 : 1;
        });
        break;
    }

    return result;
  }, [initialPrograms, filters]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-8">
      <ProgramFilters
        categorias={categorias}
        subcategorias={subcategorias}
        modelosPrecios={modelosPrecios}
        onFilterChange={handleFiltersChange}
        initialFilters={{
          ...filters,
          esOpenSource: true // Forzar siempre open source
        }}
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{filteredPrograms.length}</span> herramientas open source
        </p>
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-4">
            No se encontraron herramientas open source con estos filtros
          </p>
          <button
            onClick={() => setFilters({
              searchTerm: '',
              categoriaId: null,
              subcategoriaIds: [],
              modelosPrecioIds: [],
              dificultad: null,
              esOpenSource: null,
              esRecomendado: null,
              sortBy: 'nombre-asc'
            })}
            className="text-primary hover:underline font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((programa) => (
            <ProgramCard key={programa.id} program={programa} variant="medium" />
          ))}
        </div>
      )}
    </div>
  );
}
