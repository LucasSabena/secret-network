"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ProgramCard } from "@/components/shared/program-card";
import { ProgramFilters, type FilterOptions } from "@/components/shared/program-filters";
import { CategoryTabs } from "@/components/shared/category-tabs";
import { SubcategoryFilter } from "@/components/shared/subcategory-filter";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface Programa {
  id: number;
  nombre: string;
  slug: string;
  descripcion_corta?: string;
  descripcion_larga?: string;
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
  descripcion?: string | null;
  icono?: string | null;
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
  // Encontrar "Programas de diseño" por defecto
  const categoriasPrincipales = categorias.filter(c => !c.id_categoria_padre);
  const programasDeDiseno = categoriasPrincipales.find(
    c => c.slug === 'programas-de-diseno' || 
         c.slug === 'diseno-grafico' || 
         c.nombre.toLowerCase().includes('diseño')
  );
  
  // Estado para CategoryTabs (filtro visual principal) - Seleccionar programas de diseño por defecto
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(programasDeDiseno?.id || null);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]); // Cambiado a array
  const [useAndOperator, setUseAndOperator] = useState(false); // false = OR, true = AND

  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    categoriaId: programasDeDiseno?.id || null, // Inicializar con la categoría seleccionada
    subcategoriaIds: [],
    modelosPrecioIds: [],
    dificultad: null,
    esOpenSource: null,
    esRecomendado: null,
    sortBy: 'nombre-asc'
  });

  // Estado para infinite scroll
  const [displayCount, setDisplayCount] = useState(24); // Mostrar 24 inicialmente (3x8 grid)
  const ITEMS_PER_PAGE = 24; // Cargar de 24 en 24

  // Sincronizar CategoryTabs con filtros
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      categoriaId: selectedCategoryId,
      subcategoriaIds: selectedSubcategoryIds
    }));
  }, [selectedCategoryId, selectedSubcategoryIds]);

  // Resetear displayCount cuando cambian los filtros
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filters]);

  // Obtener subcategorías de la categoría seleccionada
  const subcategoriasFiltered = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subcategorias.filter(sub => sub.id_categoria_padre === selectedCategoryId);
  }, [selectedCategoryId, subcategorias]);

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
        const descripcionCortaMatch = programa.descripcion_corta?.toLowerCase().includes(searchLower);
        const descripcionLargaMatch = programa.descripcion_larga?.toLowerCase().includes(searchLower);
        
        return nombreMatch || categoriaMatch || subcategoriasMatch || descripcionCortaMatch || descripcionLargaMatch;
      });
    }

    // Filtro de categoría
    if (filters.categoriaId) {
      result = result.filter(p => p.categoria?.id === filters.categoriaId);
    }

    // Filtro de subcategorías con operador AND/OR
    if (filters.subcategoriaIds.length > 0) {
      if (useAndOperator) {
        // AND: El programa debe tener TODAS las subcategorías seleccionadas
        result = result.filter(programa => {
          const programaSubcatIds = programa.subcategorias?.map(sub => sub.id) || [];
          return filters.subcategoriaIds.every(id => programaSubcatIds.includes(id));
        });
      } else {
        // OR: El programa debe tener AL MENOS UNA de las subcategorías seleccionadas
        result = result.filter(programa =>
          programa.subcategorias?.some(sub =>
            filters.subcategoriaIds.includes(sub.id)
          )
        );
      }
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
      case 'nuevos':
        // Ordenar por ID descendente (más recientes primero)
        result.sort((a, b) => b.id - a.id);
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
  }, [initialPrograms, filters, programaModelosMap, useAndOperator]); // Agregado useAndOperator

  // Programas a mostrar (con infinite scroll)
  const displayedPrograms = useMemo(() => {
    return filteredPrograms.slice(0, displayCount);
  }, [filteredPrograms, displayCount]);

  // Cargar más programas
  const loadMore = useCallback(() => {
    if (displayCount < filteredPrograms.length) {
      setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredPrograms.length));
    }
  }, [displayCount, filteredPrograms.length, ITEMS_PER_PAGE]);

  // Reset display count cuando cambian los filtros
  useEffect(() => {
    setDisplayCount(24);
  }, [filters]);

  // Infinite scroll trigger
  const loadMoreRef = useInfiniteScroll(loadMore, {
    threshold: 0.5,
    rootMargin: '200px',
  });

  const hasMore = displayCount < filteredPrograms.length;

  return (
    <div className="space-y-8">
      {/* Filters avanzados (primero, arriba de todo) */}
      <ProgramFilters
        categorias={categoriasPrincipales}
        subcategorias={subcategorias}
        modelosPrecios={modelosPrecios}
        onFilterChange={setFilters}
      />

      {/* CategoryTabs - Filtro visual principal */}
      <CategoryTabs
        categorias={categoriasPrincipales as any}
        selectedId={selectedCategoryId}
        onSelect={(id) => {
          setSelectedCategoryId(id);
          setSelectedSubcategoryIds([]); // Reset subcategorías al cambiar categoría
        }}
      />

      {/* SubcategoryFilter - Aparece cuando hay categoría seleccionada */}
      {selectedCategoryId && subcategoriasFiltered.length > 0 && (
        <SubcategoryFilter
          subcategorias={subcategoriasFiltered as any}
          selectedSubIds={selectedSubcategoryIds}
          onSelect={setSelectedSubcategoryIds}
          useAndOperator={useAndOperator}
          onToggleOperator={setUseAndOperator}
        />
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{displayedPrograms.length}</span> de{' '}
          <span className="font-semibold text-foreground">{filteredPrograms.length}</span> programas
          {filteredPrograms.length !== initialPrograms.length && (
            <span className="ml-1">({initialPrograms.length} total)</span>
          )}
        </p>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedPrograms.map((programa) => (
              <ProgramCard key={programa.id} program={programa as any} variant="large" />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div 
              ref={loadMoreRef}
              className="flex justify-center py-8"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm">Cargando más...</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">No se encontraron programas</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Intenta ajustar tus filtros o término de búsqueda
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
