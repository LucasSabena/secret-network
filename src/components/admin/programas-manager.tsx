'use client';

import { useEffect, useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, Loader2, Filter, X,
  Image as ImageIcon, CheckCircle2, AlertCircle,
  ExternalLink, MoreHorizontal, LayoutGrid, List as ListIcon,
  Wand2, Download, Star, Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Categoria, ModeloDePrecio, Plataforma, Programa } from '@/lib/types';
import ProgramaForm from './programa-form';
import BatchIconUpload from './batch-icon-upload';
import ProgramaJsonImporter from './programa-json-importer';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function ProgramasManager() {
  // Data State
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredProgramas, setFilteredProgramas] = useState<Programa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterIcon, setFilterIcon] = useState<'all' | 'yes' | 'no'>('all');
  const [filterCaptura, setFilterCaptura] = useState<'all' | 'yes' | 'no'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Modal State
  const [selectedPrograma, setSelectedPrograma] = useState<Programa | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [programas, searchTerm, filterCategoria, filterIcon, filterCaptura, sortBy]);

  async function loadData() {
    setIsLoading(true);
    const supabase = supabaseBrowserClient;

    try {
      const [progsRes, catsRes] = await Promise.all([
        supabase.from('programas').select('*').order('id', { ascending: false }),
        supabase.from('categorias').select('*').order('nombre')
      ]);

      if (progsRes.error) {
        console.error('Error loading programas:', progsRes.error);
        toast({ title: 'Error', description: progsRes.error.message, variant: 'destructive' });
      }
      if (catsRes.error) {
        console.error('Error loading categorias:', catsRes.error);
      }

      setProgramas(progsRes.data || []);
      setCategorias(catsRes.data || []);
    } catch (e) {
      console.error('loadData error:', e);
      toast({ title: 'Error de conexión', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  function filterData() {
    let result = programas;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(lower) ||
        p.slug.includes(lower)
      );
    }

    if (filterCategoria !== 'all') {
      result = result.filter(p => p.categoria_id.toString() === filterCategoria);
    }

    if (filterIcon === 'yes') {
      result = result.filter(p => !!p.icono_url);
    } else if (filterIcon === 'no') {
      result = result.filter(p => !p.icono_url);
    }

    if (filterCaptura === 'yes') {
      result = result.filter(p => !!p.captura_url);
    } else if (filterCaptura === 'no') {
      result = result.filter(p => !p.captura_url);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        result.sort((a, b) => a.id - b.id);
        break;
      case 'name-asc':
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name-desc':
        result.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    setFilteredProgramas(result);
  }

  async function handleQuickToggle(id: number, field: 'es_recomendado' | 'es_open_source', value: boolean) {
    const { error } = await supabaseBrowserClient
      .from('programas')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      // Update local state
      setProgramas(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
      toast({ title: 'Actualizado' });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este programa?')) return;

    const { error } = await supabaseBrowserClient.from('programas').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Programa eliminado' });
      loadData();
    }
  }

  async function handleAutoFetch(programa: Programa, type: 'all' | 'icon' | 'screenshot') {
    if (!programa.web_oficial_url) {
      toast({ title: 'URL requerida', description: 'El programa no tiene URL oficial.', variant: 'destructive' });
      return;
    }

    toast({ title: 'Buscando...', description: `Obteniendo ${type === 'icon' ? 'icono' : type === 'screenshot' ? 'captura' : 'assets'}...` });

    try {
      const res = await fetch('/api/auto-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: programa.web_oficial_url, slug: programa.slug, type })
      });
      const data = await res.json();

      // Update in database
      const updateData: any = {};
      if (data.logoUrl) updateData.icono_url = data.logoUrl;
      if (data.screenshotUrl) updateData.captura_url = data.screenshotUrl;

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabaseBrowserClient
          .from('programas')
          .update(updateData)
          .eq('id', programa.id);

        if (error) {
          toast({ title: 'Error guardando', description: error.message, variant: 'destructive' });
        } else {
          // Update local state
          setProgramas(prev => prev.map(p => p.id === programa.id ? { ...p, ...updateData } : p));
          toast({ title: 'Asset actualizado', description: `${data.logoUrl ? 'Icono' : ''} ${data.screenshotUrl ? 'Captura' : ''} completado.` });
        }
      } else {
        toast({ title: 'No encontrado', description: 'No se pudo obtener el asset.', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Fallo la conexion.', variant: 'destructive' });
    }
  }

  function openNew() {
    setSelectedPrograma(null);
    setIsFormOpen(true);
  }

  function openEdit(prog: Programa) {
    setSelectedPrograma(prog);
    setIsFormOpen(true);
  }

  function downloadProgramasJson() {
    const exportData = {
      descripcion: "Programas ya cargados en la base de datos (para evitar duplicados)",
      total: programas.length,
      programas: programas.map(p => ({
        id: p.id,
        nombre: p.nombre,
        slug: p.slug
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '04_programas_existentes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'JSON Descargado', description: 'Actualiza el archivo en gemini-context' });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Programas
          </h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de software ({filteredProgramas.length})
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={downloadProgramasJson} variant="outline" className="gap-2" title="Descargar lista para actualizar IA">
            <Download className="h-4 w-4" /> JSON Context
          </Button>
          <Button onClick={() => setIsImporterOpen(true)} variant="outline" className="gap-2">
            <Wand2 className="h-4 w-4" /> Importar JSON
          </Button>
          <Button onClick={openNew} className="gap-2 bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/20">
            <Plus className="h-4 w-4" /> Nuevo Programa
          </Button>
        </div>
      </div>

      {/* Toolbar Flotante */}
      <div className="sticky top-2 z-10 flex flex-wrap gap-3 items-center bg-background/80 backdrop-blur-md p-2 rounded-xl border shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/50 border-transparent focus:bg-background transition-all"
          />
        </div>

        <Select value={filterCategoria} onValueChange={setFilterCategoria}>
          <SelectTrigger className="w-[140px] bg-muted/50 border-transparent">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categorias.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterIcon} onValueChange={(v: 'all' | 'yes' | 'no') => setFilterIcon(v)}>
          <SelectTrigger className="w-[110px] bg-muted/50 border-transparent">
            <SelectValue placeholder="Icono" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Icono: Todos</SelectItem>
            <SelectItem value="yes">Con icono</SelectItem>
            <SelectItem value="no">Sin icono</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCaptura} onValueChange={(v: 'all' | 'yes' | 'no') => setFilterCaptura(v)}>
          <SelectTrigger className="w-[120px] bg-muted/50 border-transparent">
            <SelectValue placeholder="Captura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Captura: Todos</SelectItem>
            <SelectItem value="yes">Con captura</SelectItem>
            <SelectItem value="no">Sin captura</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v: 'newest' | 'oldest' | 'name-asc' | 'name-desc') => setSortBy(v)}>
          <SelectTrigger className="w-[130px] bg-muted/50 border-transparent">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más nuevos</SelectItem>
            <SelectItem value="oldest">Más antiguos</SelectItem>
            <SelectItem value="name-asc">A → Z</SelectItem>
            <SelectItem value="name-desc">Z → A</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex bg-muted/50 p-1 rounded-lg border border-transparent">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ListIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      ) : filteredProgramas.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No se encontraron programas</p>
          <p className="text-sm">Total en BD: {programas.length} | Prueba cambiar los filtros</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
          {filteredProgramas.map(prog => (
            <ProgramCard
              key={prog.id}
              programa={prog}
              viewMode={viewMode}
              onEdit={() => openEdit(prog)}
              onDelete={() => handleDelete(prog.id)}
              onQuickToggle={(field, value) => handleQuickToggle(prog.id, field, value)}
              onAutoFetch={(type) => handleAutoFetch(prog, type)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {isFormOpen && (
        <ProgramaForm
          programa={selectedPrograma}
          onClose={() => { setIsFormOpen(false); loadData(); }}
        />
      )}

      {isImporterOpen && (
        <ProgramaJsonImporter
          isOpen={isImporterOpen}
          onClose={() => setIsImporterOpen(false)}
          onSuccess={() => { loadData(); }}
        />
      )}
    </div>
  );
}

// Subcomponente Card/Row
function ProgramCard({ programa, viewMode, onEdit, onDelete, onQuickToggle, onAutoFetch }: {
  programa: Programa;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
  onQuickToggle: (field: 'es_recomendado' | 'es_open_source', value: boolean) => void;
  onAutoFetch: (type: 'all' | 'icon' | 'screenshot') => void;
}) {
  const hasIcon = !!programa.icono_url;
  const hasScreen = !!programa.captura_url;

  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-4 p-3 rounded-lg border bg-card hover:shadow-md transition-all hover:border-pink-500/50">
        {/* Icon */}
        <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden border">
          {hasIcon ? (
            <img src={programa.icono_url!} alt="" className="h-full w-full object-contain p-1" />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground opacity-30" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{programa.nombre}</h3>
            {programa.es_recomendado && (
              <Badge className="text-[10px] h-5 bg-yellow-500 text-yellow-900 border-0 gap-0.5">
                <Star className="h-2.5 w-2.5 fill-yellow-900" /> Top
              </Badge>
            )}
            {programa.es_open_source && (
              <Badge variant="outline" className="text-[10px] h-5 text-green-600 border-green-300">
                OSS
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="font-mono truncate">{programa.slug}</span>
            <span className="w-px h-3 bg-border" />
            <div className="flex gap-2">
              <span className={`flex items-center gap-0.5 ${hasIcon ? "text-green-600" : "text-orange-400"}`}>
                <CheckCircle2 className={`h-3 w-3 ${hasIcon ? '' : 'opacity-0'}`} />
                <AlertCircle className={`h-3 w-3 ${hasIcon ? 'opacity-0 hidden' : ''}`} />
                Icono
              </span>
              <span className={`flex items-center gap-0.5 ${hasScreen ? "text-green-600" : "text-orange-400"}`}>
                <CheckCircle2 className={`h-3 w-3 ${hasScreen ? '' : 'opacity-0'}`} />
                <AlertCircle className={`h-3 w-3 ${hasScreen ? 'opacity-0 hidden' : ''}`} />
                Captura
              </span>
            </div>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-3 px-3 border-l">
          <div className="flex items-center gap-1.5" title="Recomendado">
            <Star className={`h-3.5 w-3.5 ${programa.es_recomendado ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
            <Switch
              checked={programa.es_recomendado || false}
              onCheckedChange={(v) => onQuickToggle('es_recomendado', v)}
              className="scale-75"
            />
          </div>
          <div className="flex items-center gap-1.5" title="Open Source">
            <Code className={`h-3.5 w-3.5 ${programa.es_open_source ? 'text-green-500' : 'text-muted-foreground'}`} />
            <Switch
              checked={programa.es_open_source || false}
              onCheckedChange={(v) => onQuickToggle('es_open_source', v)}
              className="scale-75"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Grid View - Functional Card Design
  return (
    <div className="group relative flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all">
      {/* Header with Icon */}
      <div className="p-4 pb-3 flex gap-3">
        {/* Icon Box */}
        <div className={`relative h-14 w-14 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${hasIcon ? 'bg-muted/30 border' : 'bg-orange-100 dark:bg-orange-900/30 border-2 border-dashed border-orange-300'}`}>
          {hasIcon ? (
            <img src={programa.icono_url!} alt="" className="h-full w-full object-contain p-1.5" />
          ) : (
            <ImageIcon className="h-6 w-6 text-orange-400" />
          )}
        </div>

        {/* Title + Badges */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm leading-tight truncate mb-1">{programa.nombre}</h3>
          <p className="text-[11px] text-muted-foreground truncate font-mono mb-1.5">{programa.slug}</p>
          <div className="flex gap-1">
            {programa.es_recomendado && (
              <Badge className="h-4 text-[9px] px-1.5 bg-yellow-500/20 text-yellow-600 border-yellow-300">
                <Star className="h-2 w-2 mr-0.5 fill-current" /> Top
              </Badge>
            )}
            {programa.es_open_source && (
              <Badge variant="outline" className="h-4 text-[9px] px-1.5 text-green-600 border-green-300">
                <Code className="h-2 w-2 mr-0.5" /> OSS
              </Badge>
            )}
          </div>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="gap-2">
              <Edit2 className="h-4 w-4" /> Editar completo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onQuickToggle('es_recomendado', !programa.es_recomendado)} className="gap-2">
              <Star className="h-4 w-4" /> {programa.es_recomendado ? 'Quitar Top' : 'Marcar Top'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onQuickToggle('es_open_source', !programa.es_open_source)} className="gap-2">
              <Code className="h-4 w-4" /> {programa.es_open_source ? 'Quitar OSS' : 'Marcar OSS'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive gap-2">
              <Trash2 className="h-4 w-4" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Asset Status Section */}
      <div className="px-4 pb-3 space-y-2">
        {/* Icon Status */}
        <div className={`flex items-center justify-between p-2 rounded-lg text-xs ${hasIcon ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
          <div className="flex items-center gap-2">
            {hasIcon ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
            <span className={hasIcon ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}>
              {hasIcon ? 'Icono listo' : 'Sin icono'}
            </span>
          </div>
          {!hasIcon && programa.web_oficial_url && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[10px] text-orange-600 hover:text-orange-700 hover:bg-orange-100"
              onClick={() => onAutoFetch('icon')}
            >
              <Wand2 className="h-3 w-3 mr-1" /> Completar
            </Button>
          )}
        </div>

        {/* Screenshot Status */}
        <div className={`flex items-center justify-between p-2 rounded-lg text-xs ${hasScreen ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
          <div className="flex items-center gap-2">
            {hasScreen ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
            <span className={hasScreen ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}>
              {hasScreen ? 'Captura lista' : 'Sin captura'}
            </span>
          </div>
          {!hasScreen && programa.web_oficial_url && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[10px] text-orange-600 hover:text-orange-700 hover:bg-orange-100"
              onClick={() => onAutoFetch('screenshot')}
            >
              <Wand2 className="h-3 w-3 mr-1" /> Completar
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-auto border-t p-2 flex gap-1">
        <Button size="sm" variant="ghost" className="flex-1 h-7 text-xs" onClick={onEdit}>
          <Edit2 className="h-3 w-3 mr-1" /> Editar
        </Button>
        <Button
          size="sm"
          variant={programa.es_recomendado ? "secondary" : "ghost"}
          className={`h-7 w-7 p-0 ${programa.es_recomendado ? 'text-yellow-600' : ''}`}
          onClick={() => onQuickToggle('es_recomendado', !programa.es_recomendado)}
          title={programa.es_recomendado ? 'Quitar Top' : 'Marcar Top'}
        >
          <Star className={`h-3.5 w-3.5 ${programa.es_recomendado ? 'fill-current' : ''}`} />
        </Button>
        <Button
          size="sm"
          variant={programa.es_open_source ? "secondary" : "ghost"}
          className={`h-7 w-7 p-0 ${programa.es_open_source ? 'text-green-600' : ''}`}
          onClick={() => onQuickToggle('es_open_source', !programa.es_open_source)}
          title={programa.es_open_source ? 'Quitar OSS' : 'Marcar OSS'}
        >
          <Code className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
