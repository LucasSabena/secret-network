'use client';

import { useEffect, useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, Loader2, Filter, X,
  Image as ImageIcon, CheckCircle2, AlertCircle,
  ExternalLink, MoreHorizontal, LayoutGrid, List as ListIcon,
  Wand2, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  }, [programas, searchTerm, filterCategoria, filterIcon, filterCaptura]);

  async function loadData() {
    setIsLoading(true);
    const supabase = supabaseBrowserClient;

    const [progsRes, catsRes] = await Promise.all([
      supabase.from('programas').select('*').order('created_at', { ascending: false }),
      supabase.from('categorias').select('*').order('nombre')
    ]);

    if (progsRes.data) setProgramas(progsRes.data);
    if (catsRes.data) setCategorias(catsRes.data);
    setIsLoading(false);
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

    setFilteredProgramas(result);
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
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
          {filteredProgramas.map(prog => (
            <ProgramCard
              key={prog.id}
              programa={prog}
              viewMode={viewMode}
              onEdit={() => openEdit(prog)}
              onDelete={() => handleDelete(prog.id)}
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
function ProgramCard({ programa, viewMode, onEdit, onDelete }: {
  programa: Programa;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
}) {
  const hasIcon = !!programa.icono_url;
  const hasScreen = !!programa.captura_url;

  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-4 p-3 rounded-lg border bg-card hover:shadow-md transition-all hover:border-pink-500/50">
        <div className="h-10 w-10 rounded bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
          {hasIcon ? (
            <img src={programa.icono_url!} alt="" className="h-full w-full object-contain p-1" />
          ) : (
            <ImageIcon className="h-4 w-4 text-muted-foreground opacity-30" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{programa.nombre}</h3>
            {programa.es_recomendado && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-pink-500/10 text-pink-600 border-pink-200">
                Top
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="truncate">{programa.slug}</span>
            <span className="w-px h-3 bg-border" />
            <div className="flex gap-2">
              <span className={hasIcon ? "text-green-600" : "text-orange-400"}>
                {hasIcon ? "Icono OK" : "Sin icono"}
              </span>
              <span className={hasScreen ? "text-green-600" : "text-orange-400"}>
                {hasScreen ? "Captura OK" : "Sin captura"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

  // Grid View
  return (
    <div className="group relative flex flex-col p-4 rounded-xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border">
          {hasIcon ? (
            <img src={programa.icono_url!} alt="" className="h-full w-full object-contain p-1.5" />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground opacity-30" />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-bold text-lg leading-tight mb-1 truncate">{programa.nombre}</h3>
      <p className="text-xs text-muted-foreground mb-4 truncate">{programa.slug}</p>

      <div className="mt-auto flex gap-2">
        <div className={`flex-1 h-1.5 rounded-full ${hasIcon ? 'bg-green-500' : 'bg-orange-200'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${hasScreen ? 'bg-green-500' : 'bg-orange-200'}`} />
      </div>
    </div>
  );
}
