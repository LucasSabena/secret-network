'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Programa, Categoria } from '@/lib/types';
import ProgramaForm from './programa-form';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function ProgramasManager() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredProgramas, setFilteredProgramas] = useState<Programa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterOpenSource, setFilterOpenSource] = useState<string>('all');
  const [filterRecomendado, setFilterRecomendado] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [selectedPrograma, setSelectedPrograma] = useState<Programa | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProgramas();
    loadCategorias();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, programas, filterCategoria, filterOpenSource, filterRecomendado, sortBy]);

  function applyFilters() {
    let filtered = [...programas];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (filterCategoria !== 'all') {
      filtered = filtered.filter((p) => p.categoria_id === parseInt(filterCategoria));
    }

    // Filtro por Open Source
    if (filterOpenSource !== 'all') {
      const isOpenSource = filterOpenSource === 'true';
      filtered = filtered.filter((p) => p.es_open_source === isOpenSource);
    }

    // Filtro por Recomendado
    if (filterRecomendado !== 'all') {
      const isRecomendado = filterRecomendado === 'true';
      filtered = filtered.filter((p) => p.es_recomendado === isRecomendado);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'nombre-desc':
          return b.nombre.localeCompare(a.nombre);
        case 'id-desc':
          return b.id - a.id; // Más nuevo = ID mayor
        case 'id-asc':
          return a.id - b.id; // Más antiguo = ID menor
        default:
          return 0;
      }
    });

    setFilteredProgramas(filtered);
  }

  function clearFilters() {
    setSearchTerm('');
    setFilterCategoria('all');
    setFilterOpenSource('all');
    setFilterRecomendado('all');
    setSortBy('nombre');
  }

  const hasActiveFilters = 
    searchTerm || 
    filterCategoria !== 'all' || 
    filterOpenSource !== 'all' || 
    filterRecomendado !== 'all' || 
    sortBy !== 'nombre';

  async function loadCategorias() {
    try {
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .is('id_categoria_padre', null)
        .order('nombre');

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Error loading categorias:', error);
    }
  }

  async function loadProgramas() {
    try {
      setIsLoading(true);
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('programas')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setProgramas(data || []);
      setFilteredProgramas(data || []);
    } catch (error) {
      console.error('Error loading programas:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los programas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este programa?')) return;

    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase.from('programas').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Programa eliminado correctamente',
      });
      loadProgramas();
    } catch (error) {
      console.error('Error deleting programa:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el programa',
        variant: 'destructive',
      });
    }
  }

  function handleNew() {
    setSelectedPrograma(null);
    setIsFormOpen(true);
  }

  function handleEdit(programa: Programa) {
    setSelectedPrograma(programa);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setSelectedPrograma(null);
    loadProgramas();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y botones */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar programas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 text-xs bg-pink-500">
                  •
                </Badge>
              )}
            </Button>
            <Button onClick={handleNew} className="gap-2 bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4" />
              Nuevo Programa
            </Button>
          </div>
        </div>

        {/* Panel de filtros colapsable */}
        {showFilters && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filtros</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                    Limpiar filtros
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtro por categoría */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría</label>
                  <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.icono && `${cat.icono} `}
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por Open Source */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={filterOpenSource} onValueChange={setFilterOpenSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="true">Open Source</SelectItem>
                      <SelectItem value="false">Propietario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por Recomendado */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={filterRecomendado} onValueChange={setFilterRecomendado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="true">Recomendados</SelectItem>
                      <SelectItem value="false">No recomendados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ordenamiento */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordenar por</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nombre A-Z" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nombre">Nombre (A-Z)</SelectItem>
                      <SelectItem value="nombre-desc">Nombre (Z-A)</SelectItem>
                      <SelectItem value="id-desc">Más nuevos primero</SelectItem>
                      <SelectItem value="id-asc">Más antiguos primero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="text-sm text-muted-foreground pt-2 border-t">
                Mostrando <strong>{filteredProgramas.length}</strong> de{' '}
                <strong>{programas.length}</strong> programas
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Grid de programas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProgramas.map((programa) => (
          <Card key={programa.id} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              {programa.icono_url && (
                <img
                  src={programa.icono_url}
                  alt={programa.nombre}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{programa.nombre}</h3>
                  <span className="text-xs text-muted-foreground shrink-0">#{programa.id}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {programa.slug}
                </p>
              </div>
            </div>
            {programa.descripcion_corta && (
              <p className="text-sm line-clamp-2">{programa.descripcion_corta}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {programa.es_open_source && (
                <Badge variant="success" className="text-xs">
                  Open Source
                </Badge>
              )}
              {programa.es_recomendado && (
                <Badge variant="default" className="text-xs bg-pink-500">
                  Recomendado
                </Badge>
              )}
              {programa.dificultad && (
                <Badge variant="outline" className="text-xs">
                  {programa.dificultad}
                </Badge>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(programa)}
                className="flex-1 gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(programa.id)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredProgramas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron programas</p>
        </div>
      )}

      {isFormOpen && (
        <ProgramaForm
          programa={selectedPrograma}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
