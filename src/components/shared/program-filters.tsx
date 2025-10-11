"use client";

import { useState, useEffect } from "react";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";

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

export interface FilterOptions {
  searchTerm: string;
  categoriaId: number | null;
  subcategoriaIds: number[];
  modelosPrecioIds: number[];
  dificultad: string | null;
  esOpenSource: boolean | null;
  esRecomendado: boolean | null;
  sortBy: 'nombre-asc' | 'nombre-desc' | 'recomendado' | 'nombre-recomendado';
}

interface ProgramFiltersProps {
  categorias: Categoria[];
  subcategorias: Categoria[];
  modelosPrecios: ModeloPrecio[];
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

export function ProgramFilters({ 
  categorias, 
  subcategorias, 
  modelosPrecios,
  onFilterChange,
  initialFilters = {}
}: ProgramFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    categoriaId: null,
    subcategoriaIds: [],
    modelosPrecioIds: [],
    dificultad: null,
    esOpenSource: null,
    esRecomendado: null,
    sortBy: 'nombre-asc',
    ...initialFilters
  });

  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<Categoria[]>([]);

  // Actualizar subcategorías disponibles cuando cambia la categoría
  useEffect(() => {
    if (filters.categoriaId) {
      const subsFiltered = subcategorias.filter(
        sub => sub.id_categoria_padre === filters.categoriaId
      );
      setSubcategoriasDisponibles(subsFiltered);
    } else {
      setSubcategoriasDisponibles([]);
    }
  }, [filters.categoriaId, subcategorias]);

  // Emitir cambios al padre
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Si cambia la categoría, resetear subcategorías
      if (key === 'categoriaId') {
        newFilters.subcategoriaIds = [];
      }
      
      return newFilters;
    });
  };

  const toggleSubcategoria = (id: number) => {
    setFilters(prev => ({
      ...prev,
      subcategoriaIds: prev.subcategoriaIds.includes(id)
        ? prev.subcategoriaIds.filter(subId => subId !== id)
        : [...prev.subcategoriaIds, id]
    }));
  };

  const toggleModeloPrecio = (id: number) => {
    setFilters(prev => ({
      ...prev,
      modelosPrecioIds: prev.modelosPrecioIds.includes(id)
        ? prev.modelosPrecioIds.filter(mpId => mpId !== id)
        : [...prev.modelosPrecioIds, id]
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      categoriaId: null,
      subcategoriaIds: [],
      modelosPrecioIds: [],
      dificultad: null,
      esOpenSource: null,
      esRecomendado: null,
      sortBy: 'nombre-asc'
    });
  };

  const activeFiltersCount = [
    filters.categoriaId,
    filters.subcategoriaIds.length > 0,
    filters.modelosPrecioIds.length > 0,
    filters.dificultad,
    filters.esOpenSource !== null,
    filters.esRecomendado !== null,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar programas, categorías..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {filters.searchTerm && (
            <button
              onClick={() => updateFilter('searchTerm', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="h-10 appearance-none rounded-lg border border-border bg-background px-4 pr-10 text-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="nombre-asc">A → Z</option>
            <option value="nombre-desc">Z → A</option>
            <option value="recomendado">Recomendados</option>
            <option value="nombre-recomendado">A → Z + Recomendados</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Filters Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm transition-colors hover:border-primary hover:bg-accent"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-lg animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filtros</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-primary transition-colors hover:text-primary-hover"
              >
                Resetear todo
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <select
                value={filters.categoriaId || ''}
                onChange={(e) => updateFilter('categoriaId', e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter */}
            {filters.categoriaId && subcategoriasDisponibles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Subcategorías</label>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-border bg-background p-3">
                  {subcategoriasDisponibles.map(sub => (
                    <label key={sub.id} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.subcategoriaIds.includes(sub.id)}
                        onChange={() => toggleSubcategoria(sub.id)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-sm">{sub.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Model Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Precio</label>
              <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                {modelosPrecios.map(modelo => (
                  <label key={modelo.id} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.modelosPrecioIds.includes(modelo.id)}
                      onChange={() => toggleModeloPrecio(modelo.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm">{modelo.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dificultad</label>
              <select
                value={filters.dificultad || ''}
                onChange={(e) => updateFilter('dificultad', e.target.value || null)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos los niveles</option>
                <option value="Facil">Fácil</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Dificil">Difícil</option>
              </select>
            </div>

            {/* Open Source Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Open Source</label>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="openSource"
                    checked={filters.esOpenSource === true}
                    onChange={() => updateFilter('esOpenSource', true)}
                    className="h-4 w-4 border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm">Sí</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="openSource"
                    checked={filters.esOpenSource === false}
                    onChange={() => updateFilter('esOpenSource', false)}
                    className="h-4 w-4 border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="openSource"
                    checked={filters.esOpenSource === null}
                    onChange={() => updateFilter('esOpenSource', null)}
                    className="h-4 w-4 border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm">Todos</span>
                </label>
              </div>
            </div>

            {/* Recommended Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Recomendados</label>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="recommended"
                    checked={filters.esRecomendado === true}
                    onChange={() => updateFilter('esRecomendado', true)}
                    className="h-4 w-4 border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm">Sí</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="recommended"
                    checked={filters.esRecomendado === false}
                    onChange={() => updateFilter('esRecomendado', false)}
                    className="h-4 w-4 border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="recommended"
                    checked={filters.esRecomendado === null}
                    onChange={() => updateFilter('esRecomendado', null)}
                    className="h-4 w-4 border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm">Todos</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categoriaId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Category: {categorias.find(c => c.id === filters.categoriaId)?.nombre}
              <button onClick={() => updateFilter('categoriaId', null)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.dificultad && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {filters.dificultad}
              <button onClick={() => updateFilter('dificultad', null)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.esOpenSource !== null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Open Source: {filters.esOpenSource ? 'Yes' : 'No'}
              <button onClick={() => updateFilter('esOpenSource', null)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.esRecomendado !== null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Recommended: {filters.esRecomendado ? 'Yes' : 'No'}
              <button onClick={() => updateFilter('esRecomendado', null)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
