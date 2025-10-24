'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, Filter, X, Upload, Image as ImageIcon, CheckCircle2, XCircle, ExternalLink, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Programa, Categoria, Plataforma, ModeloDePrecio } from '@/lib/types';
import ProgramaForm from './programa-form';
import BatchIconUpload from './batch-icon-upload';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { addUTMParams } from '@/lib/utm-tracker';

export default function ProgramasManager() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [modelosPrecios, setModelosPrecios] = useState<ModeloDePrecio[]>([]);
  const [programasPlataformas, setProgramasPlataformas] = useState<Record<number, number[]>>({});
  const [programasPrecios, setProgramasPrecios] = useState<Record<number, number[]>>({});
  const [filteredProgramas, setFilteredProgramas] = useState<Programa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterOpenSource, setFilterOpenSource] = useState<string>('all');
  const [filterRecomendado, setFilterRecomendado] = useState<string>('all');
  const [filterSinIcono, setFilterSinIcono] = useState(false);
  const [filterSinCaptura, setFilterSinCaptura] = useState(false);
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [selectedPrograma, setSelectedPrograma] = useState<Programa | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProgramas();
    loadCategorias();
    loadPlataformas();
    loadModelosPrecios();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, programas, filterCategoria, filterOpenSource, filterRecomendado, filterSinIcono, filterSinCaptura, sortBy]);

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

    // Filtro por programas sin icono
    if (filterSinIcono) {
      filtered = filtered.filter((p) => !p.icono_url);
    }

    // Filtro por programas sin captura
    if (filterSinCaptura) {
      filtered = filtered.filter((p) => !p.captura_url);
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
    setFilterSinIcono(false);
    setFilterSinCaptura(false);
    setSortBy('nombre');
  }

  const hasActiveFilters = 
    searchTerm || 
    filterCategoria !== 'all' || 
    filterOpenSource !== 'all' || 
    filterRecomendado !== 'all' || 
    filterSinIcono ||
    filterSinCaptura ||
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

  async function loadPlataformas() {
    try {
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('Plataformas')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setPlataformas(data || []);
    } catch (error) {
      console.error('Error loading plataformas:', error);
    }
  }

  async function loadModelosPrecios() {
    try {
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('Modelos de Precios')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setModelosPrecios(data || []);
    } catch (error) {
      console.error('Error loading modelos de precio:', error);
    }
  }

  async function loadProgramasRelaciones() {
    try {
      const supabase = supabaseBrowserClient;
      
      // Cargar plataformas de programas
      const { data: platData } = await supabase
        .from('programas_plataformas')
        .select('programa_id, plataforma_id');
      
      const platMap: Record<number, number[]> = {};
      platData?.forEach(rel => {
        if (!platMap[rel.programa_id]) platMap[rel.programa_id] = [];
        platMap[rel.programa_id].push(rel.plataforma_id);
      });
      setProgramasPlataformas(platMap);

      // Cargar precios de programas
      const { data: precioData } = await supabase
        .from('programas_precios')
        .select('programa_id, precio_id');
      
      const precioMap: Record<number, number[]> = {};
      precioData?.forEach(rel => {
        if (!precioMap[rel.programa_id]) precioMap[rel.programa_id] = [];
        precioMap[rel.programa_id].push(rel.precio_id);
      });
      setProgramasPrecios(precioMap);
    } catch (error) {
      console.error('Error loading relaciones:', error);
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
      await loadProgramasRelaciones();
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

  async function updateDificultad(programaId: number, dificultad: 'Facil' | 'Intermedio' | 'Dificil') {
    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase
        .from('programas')
        .update({ dificultad })
        .eq('id', programaId);

      if (error) throw error;

      setProgramas(prev => prev.map(p => 
        p.id === programaId ? { ...p, dificultad } : p
      ));

      toast({
        title: 'Actualizado',
        description: 'Dificultad actualizada correctamente',
      });
    } catch (error) {
      console.error('Error updating dificultad:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la dificultad',
        variant: 'destructive',
      });
    }
  }

  async function toggleRecomendado(programaId: number, currentValue: boolean) {
    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase
        .from('programas')
        .update({ es_recomendado: !currentValue })
        .eq('id', programaId);

      if (error) throw error;

      setProgramas(prev => prev.map(p => 
        p.id === programaId ? { ...p, es_recomendado: !currentValue } : p
      ));

      toast({
        title: 'Actualizado',
        description: `Programa ${!currentValue ? 'marcado como' : 'desmarcado de'} recomendado`,
      });
    } catch (error) {
      console.error('Error toggling recomendado:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar',
        variant: 'destructive',
      });
    }
  }

  async function toggleOpenSource(programaId: number, currentValue: boolean) {
    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase
        .from('programas')
        .update({ es_open_source: !currentValue })
        .eq('id', programaId);

      if (error) throw error;

      setProgramas(prev => prev.map(p => 
        p.id === programaId ? { ...p, es_open_source: !currentValue } : p
      ));

      toast({
        title: 'Actualizado',
        description: `Programa ${!currentValue ? 'marcado como' : 'desmarcado de'} Open Source`,
      });
    } catch (error) {
      console.error('Error toggling open source:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar',
        variant: 'destructive',
      });
    }
  }

  async function updatePlataformas(programaId: number, plataformaId: number, isChecked: boolean) {
    try {
      const supabase = supabaseBrowserClient;

      if (isChecked) {
        const { error } = await supabase
          .from('programas_plataformas')
          .insert({ programa_id: programaId, plataforma_id: plataformaId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('programas_plataformas')
          .delete()
          .eq('programa_id', programaId)
          .eq('plataforma_id', plataformaId);
        if (error) throw error;
      }

      await loadProgramasRelaciones();
      toast({
        title: 'Actualizado',
        description: 'Plataformas actualizadas',
      });
    } catch (error) {
      console.error('Error updating plataformas:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar',
        variant: 'destructive',
      });
    }
  }

  async function updatePrecios(programaId: number, precioId: number, isChecked: boolean) {
    try {
      const supabase = supabaseBrowserClient;

      if (isChecked) {
        const { error } = await supabase
          .from('programas_precios')
          .insert({ programa_id: programaId, precio_id: precioId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('programas_precios')
          .delete()
          .eq('programa_id', programaId)
          .eq('precio_id', precioId);
        if (error) throw error;
      }

      await loadProgramasRelaciones();
      toast({
        title: 'Actualizado',
        description: 'Modelos de precio actualizados',
      });
    } catch (error) {
      console.error('Error updating precios:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar',
        variant: 'destructive',
      });
    }
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
            <Button
              variant="outline"
              onClick={() => setIsBatchUploadOpen(true)}
              className="gap-2 border-primary text-primary hover:bg-primary/10"
            >
              <Upload className="h-4 w-4" />
              Subida por Lote
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

              {/* Filtros de recursos faltantes */}
              <div className="space-y-3 pt-4 border-t">
                <label className="text-sm font-medium">Filtrar por recursos faltantes</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={filterSinIcono}
                      onCheckedChange={setFilterSinIcono}
                    />
                    <span className="text-sm">Sin icono</span>
                    {filterSinIcono && (
                      <Badge variant="destructive" className="text-xs">
                        {programas.filter(p => !p.icono_url).length}
                      </Badge>
                    )}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={filterSinCaptura}
                      onCheckedChange={setFilterSinCaptura}
                    />
                    <span className="text-sm">Sin captura</span>
                    {filterSinCaptura && (
                      <Badge variant="destructive" className="text-xs">
                        {programas.filter(p => !p.captura_url).length}
                      </Badge>
                    )}
                  </label>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="text-sm text-muted-foreground pt-2 border-t">
                Mostrando <strong>{filteredProgramas.length}</strong> de{' '}
                <strong>{programas.length}</strong> programas
                {(filterSinIcono || filterSinCaptura) && (
                  <span className="ml-2 text-destructive">
                    (filtrado por recursos faltantes)
                  </span>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Grid de programas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProgramas.map((programa) => {
          const plataformasPrograma = programasPlataformas[programa.id] || [];
          const preciosPrograma = programasPrecios[programa.id] || [];

          return (
            <Card key={programa.id} className="p-4 space-y-3">
              {/* Header con título e indicadores de imágenes */}
              <div className="flex items-start gap-3">
                <div className="relative">
                  {programa.icono_url ? (
                    <img
                      src={programa.icono_url}
                      alt={programa.nombre}
                      className="w-12 h-12 rounded object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{programa.nombre}</h3>
                    <span className="text-xs text-muted-foreground shrink-0">#{programa.id}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {programa.slug}
                  </p>
                  {/* Indicadores de imágenes */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-xs">
                      {programa.icono_url ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-muted-foreground/50" />
                      )}
                      <span className="text-muted-foreground">Icono</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {programa.captura_url ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-muted-foreground/50" />
                      )}
                      <span className="text-muted-foreground">Captura</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción corta */}
              {programa.descripcion_corta && (
                <p className="text-sm line-clamp-2 text-muted-foreground">
                  {programa.descripcion_corta.replace(/<[^>]*>/g, '')}
                </p>
              )}

              {/* Controles rápidos */}
              <div className="space-y-2 pt-2 border-t">
                {/* Dificultad */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dificultad</span>
                  <Select
                    value={programa.dificultad || undefined}
                    onValueChange={(value) => updateDificultad(programa.id, value as any)}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facil">Fácil</SelectItem>
                      <SelectItem value="Intermedio">Intermedio</SelectItem>
                      <SelectItem value="Dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recomendado</span>
                  <Switch
                    checked={programa.es_recomendado}
                    onCheckedChange={() => toggleRecomendado(programa.id, programa.es_recomendado)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Open Source</span>
                  <Switch
                    checked={programa.es_open_source}
                    onCheckedChange={() => toggleOpenSource(programa.id, programa.es_open_source)}
                  />
                </div>

                {/* Plataformas */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plataformas</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        {plataformasPrograma.length > 0 ? (
                          <span className="text-xs">{plataformasPrograma.length} seleccionadas</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Ninguna</span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Sistemas Operativos</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {plataformas.map((plat) => (
                        <DropdownMenuCheckboxItem
                          key={plat.id}
                          checked={plataformasPrograma.includes(plat.id)}
                          onCheckedChange={(checked) => updatePlataformas(programa.id, plat.id, checked)}
                        >
                          {plat.nombre}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Modelos de Precio */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precio</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        {preciosPrograma.length > 0 ? (
                          <span className="text-xs">{preciosPrograma.length} seleccionados</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Ninguno</span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Modelos de Precio</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {modelosPrecios.map((precio) => (
                        <DropdownMenuCheckboxItem
                          key={precio.id}
                          checked={preciosPrograma.includes(precio.id)}
                          onCheckedChange={(checked) => updatePrecios(programa.id, precio.id, checked)}
                        >
                          {precio.nombre}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Link del sitio web */}
              {programa.web_oficial_url && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <a
                    href={addUTMParams(programa.web_oficial_url.startsWith('http') ? programa.web_oficial_url : `https://${programa.web_oficial_url}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-2 px-3 py-2 text-sm rounded-md border hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="truncate">{programa.web_oficial_url}</span>
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Aquí podrías abrir un modal para editar solo el URL
                      handleEdit(programa);
                    }}
                    className="shrink-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-2 pt-2 border-t">
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
          );
        })}
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

      {isBatchUploadOpen && (
        <BatchIconUpload
          onClose={() => setIsBatchUploadOpen(false)}
          onSuccess={loadProgramas}
        />
      )}
    </div>
  );
}
