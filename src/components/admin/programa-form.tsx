'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  X, Save, Loader2, Image as ImageIcon, Video,
  Globe, Link as LinkIcon, AlertCircle, Check,
  Upload, Wand2, Tag, Layers, CreditCard, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';
import { Categoria, ModeloDePrecio, Plataforma, Programa } from '@/lib/types';

interface Props {
  programa: Programa | null;
  onClose: () => void;
  // isOpen es implícito si se monta el componente, pero podemos pasarlo si queremos animación de salida controlada externamente
}

export default function ProgramaForm({ programa, onClose }: Props) {
  // Form State
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<any>({
    defaultValues: {
      nombre: '',
      slug: '',
      web_oficial_url: '',
      descripcion_corta: '',
      descripcion_larga: '',
      es_open_source: false,
      es_recomendado: false,
    }
  });

  // UI State
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoFetching, setIsAutoFetching] = useState(false);

  // Data State
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Categoria[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [modelosPrecios, setModelosPrecios] = useState<ModeloDePrecio[]>([]);
  const [programasDisponibles, setProgramasDisponibles] = useState<any[]>([]);

  // Selection Data
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [subcategoriasSeleccionadas, setSubcategoriasSeleccionadas] = useState<number[]>([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState<number[]>([]);
  const [preciosSeleccionados, setPreciosSeleccionados] = useState<number[]>([]);
  const [alternativasSeleccionadas, setAlternativasSeleccionadas] = useState<number[]>([]);
  const [usos, setUsos] = useState<string[]>([]);
  const [nuevoUso, setNuevoUso] = useState('');

  // Media State
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [capturaFile, setCapturaFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [capturaPreview, setCapturaPreview] = useState<string | null>(null);

  const { toast } = useToast();
  const nombre = watch('nombre');

  // Load Data
  useEffect(() => {
    loadAuxData();
    if (programa) loadProgramaCompleto();
  }, [programa]);

  // Slug Gen
  useEffect(() => {
    if (!programa && nombre) {
      const slug = nombre.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [nombre]);

  // Subcats Filter
  useEffect(() => {
    if (categoriaSeleccionada) {
      const subs = categorias.filter(c => c.id_categoria_padre === categoriaSeleccionada);
      setSubcategorias(subs);
    } else {
      setSubcategorias([]);
    }
  }, [categoriaSeleccionada, categorias]);

  // Paste Handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (activeTab !== 'media') return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            // Preguntar o inferir. Por ahora asumimos captura si es grande
            if (confirm('¿Pegar imagen como Captura de Pantalla? (Cancelar para Icono)')) {
              handleFileSelect(file, 'captura');
            } else {
              handleFileSelect(file, 'icono');
            }
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [activeTab]);

  async function loadAuxData() {
    const supabase = supabaseBrowserClient;
    const [cats, plats, precios, progs] = await Promise.all([
      supabase.from('categorias').select('*').order('nombre'),
      supabase.from('Plataformas').select('*').order('nombre'),
      supabase.from('Modelos de Precios').select('*').order('nombre'),
      supabase.from('programas').select('id, nombre, subcategorias:programas_subcategorias(subcategoria_id)').neq('id', programa?.id || 0)
    ]);

    if (cats.data) setCategorias(cats.data);
    if (plats.data) setPlataformas(plats.data);
    if (precios.data) setModelosPrecios(precios.data);
    if (progs.data) setProgramasDisponibles(progs.data.map(p => ({
      ...p,
      subcategorias: p.subcategorias.map((s: any) => s.subcategoria_id)
    })));
  }

  async function loadProgramaCompleto() {
    if (!programa) return;
    setValue('nombre', programa.nombre);
    setValue('slug', programa.slug);
    setValue('web_oficial_url', programa.web_oficial_url);
    setValue('descripcion_corta', programa.descripcion_corta);
    setValue('descripcion_larga', programa.descripcion_larga);
    setValue('es_open_source', programa.es_open_source);
    setValue('es_recomendado', programa.es_recomendado);
    setValue('dificultad', programa.dificultad);

    setCategoriaSeleccionada(programa.categoria_id);
    if (programa.usos) setUsos(programa.usos);
    if (programa.icono_url) setIconPreview(programa.icono_url);
    if (programa.captura_url) setCapturaPreview(programa.captura_url);

    const supabase = supabaseBrowserClient;

    // Load relations
    const [subs, plats, pre, alts] = await Promise.all([
      supabase.from('programas_subcategorias').select('subcategoria_id').eq('programa_id', programa.id),
      supabase.from('programas_plataformas').select('plataforma_id').eq('programa_id', programa.id),
      supabase.from('programas_precios').select('precio_id').eq('programa_id', programa.id),
      supabase.from('programas_alternativas').select('programa_alternativa_id').eq('programa_original_id', programa.id)
    ]);

    if (subs.data) setSubcategoriasSeleccionadas(subs.data.map(x => x.subcategoria_id));
    if (plats.data) setPlataformasSeleccionadas(plats.data.map(x => x.plataforma_id));
    if (pre.data) setPreciosSeleccionados(pre.data.map(x => x.precio_id));
    if (alts.data) setAlternativasSeleccionadas(alts.data.map(x => x.programa_alternativa_id));
  }

  async function handleAutoFetch(type: 'all' | 'icon' | 'screenshot' = 'all') {
    const url = watch('web_oficial_url');
    if (!url) return toast({ title: 'URL requerida', variant: 'destructive' });

    setIsAutoFetching(true);
    try {
      const res = await fetch('/api/auto-assets', {
        method: 'POST',
        body: JSON.stringify({ url, slug: watch('slug'), type })
      });
      const data = await res.json();

      if (data.logoUrl) setIconPreview(data.logoUrl);
      if (data.screenshotUrl) setCapturaPreview(data.screenshotUrl);

      let msg = 'Assets encontrados';
      if (type === 'icon' && data.logoUrl) msg = 'Icono actualizado';
      if (type === 'screenshot' && data.screenshotUrl) msg = 'Captura actualizada';

      toast({ title: msg });
    } catch (e) {
      toast({ title: 'Error fetching', variant: 'destructive' });
    } finally {
      setIsAutoFetching(false);
    }
  }

  function handleFileSelect(file: File, type: 'icono' | 'captura') {
    const valid = validateImageFile(file);
    if (!valid.valid) return toast({ title: 'Archivo inválido', description: valid.error });

    if (type === 'icono') {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    } else {
      setCapturaFile(file);
      setCapturaPreview(URL.createObjectURL(file));
    }
  }

  const toggleSelection = (id: number, list: number[], setList: (l: number[]) => void) => {
    setList(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
  };

  async function onSubmit(data: any) {
    if (!categoriaSeleccionada) return toast({ title: 'Categoría requerida', variant: 'destructive' });

    setIsSaving(true);
    try {
      let iconUrl = iconPreview;
      let capturaUrl = capturaPreview;

      if (iconFile) iconUrl = await uploadToCloudinary(iconFile, 'programas/icons', `${data.slug}-icon`);
      if (capturaFile) capturaUrl = await uploadToCloudinary(capturaFile, 'programas/screenshots', `${data.slug}-screenshot`);

      const programData = {
        ...data,
        categoria_id: categoriaSeleccionada,
        icono_url: iconUrl,
        captura_url: capturaUrl,
        usos: usos
      };

      const supabase = supabaseBrowserClient;
      let progId = programa?.id;

      if (programa) {
        await supabase.from('programas').update(programData).eq('id', programa.id);
      } else {
        const { data: newProg, error } = await supabase.from('programas').insert(programData).select().single();
        if (error) throw error;
        progId = newProg.id;
      }

      // Sync Relations
      if (progId) {
        // Helper to sync many-to-many
        const sync = async (table: string, idField: string, ids: number[]) => {
          await supabase.from(table).delete().eq('programa_id', progId);
          if (ids.length > 0) {
            await supabase.from(table).insert(ids.map(id => ({ programa_id: progId, [idField]: id })));
          }
        };

        await Promise.all([
          sync('programas_subcategorias', 'subcategoria_id', subcategoriasSeleccionadas),
          sync('programas_plataformas', 'plataforma_id', plataformasSeleccionadas),
          sync('programas_precios', 'precio_id', preciosSeleccionados),
          (async () => {
            await supabase.from('programas_alternativas').delete().eq('programa_original_id', progId);
            if (alternativasSeleccionadas.length > 0) {
              await supabase.from('programas_alternativas').insert(
                alternativasSeleccionadas.map(id => ({ programa_original_id: progId, programa_alternativa_id: id }))
              );
            }
          })()
        ]);
      }

      toast({ title: '✅ Programa guardado correctamente' });
      onClose();
    } catch (e) {
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  }

  function handleInternalClose() {
    setIsOpen(false);
    setTimeout(onClose, 300); // Esperar animación
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleInternalClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-3xl overflow-y-auto sm:p-6" side="right">
        <SheetHeader className="mb-6 space-y-4">
          <div className="flex justify-between items-start">
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {programa ? `Editar: ${programa.nombre}` : 'Nuevo Programa'}
            </SheetTitle>
          </div>
          <SheetDescription>
            Completa la información del software. Usa las pestañas para organizar los datos.
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="general" className="rounded-lg">Info</TabsTrigger>
            <TabsTrigger value="clasificacion" className="rounded-lg">Class</TabsTrigger>
            <TabsTrigger value="media" className="rounded-lg">Media</TabsTrigger>
            <TabsTrigger value="relaciones" className="rounded-lg">Rel</TabsTrigger>
          </TabsList>

          <form id="prog-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">

            {/* TAB: GENERAL */}
            <TabsContent value="general" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>Nombre del Programa *</Label>
                  <Input {...register('nombre', { required: true })} className="bg-muted/30" placeholder="Ej: Adobe Photoshop" />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>Slug (URL) *</Label>
                  <Input {...register('slug', { required: true })} className="font-mono text-xs bg-muted/30" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sitio Web Oficial</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input {...register('web_oficial_url')} className="pl-9 bg-muted/30" placeholder="https://..." />
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={() => handleAutoFetch('all')} disabled={isAutoFetching} title="Auto-detectar TODO">
                    {isAutoFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-pink-500" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descripción Corta (SEO) *</Label>
                <Textarea {...register('descripcion_corta')} maxLength={200} className="bg-muted/30 resize-none h-20" />
              </div>

              <div className="space-y-2">
                <Label>Descripción Larga (Markdown)</Label>
                <Textarea {...register('descripcion_larga')} className="bg-muted/30 resize-none h-40 font-mono text-sm" placeholder="Descripción detallada del programa. Soporta **Markdown**..." />
              </div>

              <div className="space-y-2">
                <Label>Usos Principales (Tags)</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {usos.map((u, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1">
                      {u} <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setUsos(usos.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={nuevoUso}
                    onChange={e => setNuevoUso(e.target.value)}
                    placeholder="Ej: Edición de video"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (nuevoUso) { setUsos([...usos, nuevoUso]); setNuevoUso(''); } } }}
                    className="bg-muted/30"
                  />
                  <Button type="button" variant="secondary" onClick={() => { if (nuevoUso) { setUsos([...usos, nuevoUso]); setNuevoUso(''); } }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
                <div className="space-y-0.5">
                  <Label>Open Source</Label>
                  <p className="text-xs text-muted-foreground">¿Es software libre?</p>
                </div>
                <Switch checked={watch('es_open_source')} onCheckedChange={v => setValue('es_open_source', v)} />
              </div>

              <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="space-y-0.5">
                  <Label className="text-yellow-700 dark:text-yellow-400">⭐ Recomendado</Label>
                  <p className="text-xs text-yellow-600 dark:text-yellow-500">Marcar como Top Pick / Best in Class</p>
                </div>
                <Switch checked={watch('es_recomendado')} onCheckedChange={v => setValue('es_recomendado', v)} />
              </div>
            </TabsContent>

            {/* TAB: CLASIFICACION */}
            <TabsContent value="clasificacion" className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2"><Layers className="h-4 w-4" /> Categoría Principal</Label>
                <Select value={categoriaSeleccionada?.toString()} onValueChange={v => setCategoriaSeleccionada(Number(v))}>
                  <SelectTrigger className="w-full bg-muted/30 h-12">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.filter(c => !c.id_categoria_padre).map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {subcategorias.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2"><Tag className="h-4 w-4" /> Subcategorías</Label>
                  <div className="flex flex-wrap gap-2">
                    {subcategorias.map(s => (
                      <Badge
                        key={s.id}
                        variant={subcategoriasSeleccionadas.includes(s.id) ? 'default' : 'outline'}
                        className={`cursor-pointer px-3 py-1.5 text-sm transition-all ${subcategoriasSeleccionadas.includes(s.id) ? 'bg-pink-500 hover:bg-pink-600' : 'hover:bg-muted'}`}
                        onClick={() => toggleSelection(s.id, subcategoriasSeleccionadas, setSubcategoriasSeleccionadas)}
                      >
                        {s.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Precio</Label>
                <div className="flex flex-wrap gap-2">
                  {modelosPrecios.map(p => (
                    <Badge
                      key={p.id}
                      variant={preciosSeleccionados.includes(p.id) ? 'default' : 'outline'}
                      className={`cursor-pointer px-3 py-1.5 transition-all ${preciosSeleccionados.includes(p.id) ? 'bg-indigo-500 hover:bg-indigo-600' : 'hover:bg-muted'}`}
                      onClick={() => toggleSelection(p.id, preciosSeleccionados, setPreciosSeleccionados)}
                    >
                      {p.nombre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2"><Globe className="h-4 w-4" /> Plataformas</Label>
                <div className="flex flex-wrap gap-2">
                  {plataformas.map(p => (
                    <Badge
                      key={p.id}
                      variant={plataformasSeleccionadas.includes(p.id) ? 'default' : 'outline'}
                      className={`cursor-pointer px-3 py-1.5 transition-all ${plataformasSeleccionadas.includes(p.id) ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-muted'}`}
                      onClick={() => toggleSelection(p.id, plataformasSeleccionadas, setPlataformasSeleccionadas)}
                    >
                      {p.nombre}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB: MEDIA */}
            <TabsContent value="media" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-600 dark:text-blue-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Tip Pro: Puedes pegar imágenes (Ctrl+V) directamente aquí.
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Icono (Cuadrado)</Label>
                    <Button type="button" size="sm" variant="ghost" className="h-6 text-xs text-pink-500" onClick={() => handleAutoFetch('icon')} disabled={isAutoFetching}>
                      <Wand2 className="mr-1 h-3 w-3" /> Auto Icono
                    </Button>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 border-2 border-dashed rounded-xl flex items-center justify-center bg-muted/30 relative overflow-hidden group">
                      {iconPreview ? (
                        <img src={iconPreview} className="w-full h-full object-contain p-2" />
                      ) : (
                        <ImageIcon className="text-muted-foreground opacity-20" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-medium"
                        onClick={() => document.getElementById('icon-upload')?.click()}>
                        Cambiar
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input id="icon-upload" type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'icono')} />
                      <p className="text-xs text-muted-foreground">Recomendado: 512x512 PNG/WebP</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Captura de Pantalla (Landscape)</Label>
                    <Button type="button" size="sm" variant="ghost" className="h-6 text-xs text-pink-500" onClick={() => handleAutoFetch('screenshot')} disabled={isAutoFetching}>
                      <Wand2 className="mr-1 h-3 w-3" /> Auto Captura
                    </Button>
                  </div>
                  <div className="w-full aspect-video border-2 border-dashed rounded-xl flex items-center justify-center bg-muted/30 relative overflow-hidden group">
                    {capturaPreview ? (
                      <img src={capturaPreview} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="mx-auto h-8 w-8 opacity-20 mb-2" />
                        <p className="text-sm">Arrastra o pega aquí</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white font-medium"
                      onClick={() => document.getElementById('captura-upload')?.click()}>
                      Subir nueva imagen
                    </div>
                  </div>
                  <Input id="captura-upload" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'captura')} />
                </div>
              </div>
            </TabsContent>

            {/* TAB: RELACIONES */}
            <TabsContent value="relaciones" className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Programas Alternativos</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      // Auto-recomendation: Select programs in the same subcategories
                      const matchingIds = programasDisponibles
                        .filter(p => p.subcategorias?.some((subId: number) => subcategoriasSeleccionadas.includes(subId)))
                        .map(p => p.id);
                      setAlternativasSeleccionadas(matchingIds);
                    }}
                  >
                    <Wand2 className="mr-1 h-3 w-3" /> Auto-Sugerir
                  </Button>
                </div>

                <Input
                  placeholder="Buscar programas..."
                  className="bg-muted/30"
                  onChange={e => {
                    const term = e.target.value.toLowerCase();
                    // Filter is applied visually below
                    (document.querySelectorAll('[data-alt-item]') as NodeListOf<HTMLElement>).forEach(el => {
                      el.style.display = el.dataset.nombre?.toLowerCase().includes(term) ? '' : 'none';
                    });
                  }}
                />

                <div className="p-3 border rounded-xl bg-muted/10 max-h-72 overflow-y-auto space-y-1">
                  {programasDisponibles.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">No hay programas disponibles</p>
                  ) : (
                    programasDisponibles.map(p => (
                      <div
                        key={p.id}
                        data-alt-item
                        data-nombre={p.nombre}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${alternativasSeleccionadas.includes(p.id) ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700' : 'hover:bg-muted border border-transparent'}`}
                        onClick={() => toggleSelection(p.id, alternativasSeleccionadas, setAlternativasSeleccionadas)}
                      >
                        <span className="text-sm font-medium">{p.nombre}</span>
                        {alternativasSeleccionadas.includes(p.id) && <Check className="h-4 w-4 text-pink-500" />}
                      </div>
                    ))
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {alternativasSeleccionadas.length} seleccionados
                </p>
              </div>
            </TabsContent>
          </form>
        </Tabs>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={handleInternalClose}>Cancelar</Button>
          <Button type="submit" form="prog-form" disabled={isSaving} className="flex-1 bg-pink-600 hover:bg-pink-700">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}


