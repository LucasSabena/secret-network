'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2, Plus, Wand2, Upload, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Programa, Categoria, Plataforma, ModeloDePrecio } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';

interface ProgramaFormProps {
  programa: Programa | null;
  onClose: () => void;
}

interface FormData {
  nombre: string;
  slug: string;
  web_oficial_url: string;
  descripcion_corta: string;
  descripcion_larga: string;
  dificultad: string;
  es_open_source: boolean;
  es_recomendado: boolean;
}

export default function ProgramaForm({ programa, onClose }: ProgramaFormProps) {
  // Data states
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Categoria[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [modelosPrecios, setModelosPrecios] = useState<ModeloDePrecio[]>([]);
  const [programasDisponibles, setProgramasDisponibles] = useState<{ id: number; nombre: string; subcategorias?: number[] }[]>([]);
  const [busquedaAlternativas, setBusquedaAlternativas] = useState('');

  // Selection states
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [subcategoriasSeleccionadas, setSubcategoriasSeleccionadas] = useState<number[]>([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState<number[]>([]);
  const [preciosSeleccionados, setPreciosSeleccionados] = useState<number[]>([]);
  const [alternativasSeleccionadas, setAlternativasSeleccionadas] = useState<number[]>([]);
  const [usos, setUsos] = useState<string[]>([]);
  const [nuevoUso, setNuevoUso] = useState('');

  // Media states
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [capturaFile, setCapturaFile] = useState<File | null>(null);
  const [autoFetchedIconUrl, setAutoFetchedIconUrl] = useState<string | null>(null);
  const [autoFetchedCapturaUrl, setAutoFetchedCapturaUrl] = useState<string | null>(null);

  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      nombre: programa?.nombre || '',
      slug: programa?.slug || '',
      web_oficial_url: programa?.web_oficial_url || '',
      descripcion_corta: programa?.descripcion_corta || '',
      descripcion_larga: programa?.descripcion_larga || '',
      dificultad: programa?.dificultad || 'Intermedio',
      es_open_source: programa?.es_open_source || false,
      es_recomendado: programa?.es_recomendado || false,
    },
  });

  const nombre = watch('nombre');
  const webUrl = watch('web_oficial_url');

  // Auto-generate slug
  useEffect(() => {
    if (nombre && !programa) {
      const slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [nombre, programa, setValue]);

  // Load initial data
  useEffect(() => {
    loadCategorias();
    loadPlataformas();
    loadModelosPrecios();
    loadProgramas();
  }, []);

  // Load program related data when editing
  useEffect(() => {
    if (programa) {
      loadProgramaRelaciones();
      if (programa.usos) setUsos(programa.usos);
    }
  }, [programa]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (categoriaSeleccionada) {
      const subs = categorias.filter(c => c.id_categoria_padre === categoriaSeleccionada);
      setSubcategorias(subs);
    } else {
      setSubcategorias([]);
    }
  }, [categoriaSeleccionada, categorias]);

  async function loadCategorias() {
    const { data } = await supabaseBrowserClient.from('categorias').select('*').order('nombre');
    if (data) {
      setCategorias(data);
      if (programa?.categoria_id) {
        setCategoriaSeleccionada(programa.categoria_id);
      }
    }
  }

  async function loadPlataformas() {
    const { data } = await supabaseBrowserClient.from('Plataformas').select('*').order('nombre');
    if (data) setPlataformas(data);
  }

  async function loadModelosPrecios() {
    const { data } = await supabaseBrowserClient.from('Modelos de Precios').select('*').order('nombre');
    if (data) setModelosPrecios(data);
  }

  async function loadProgramas() {
    const { data } = await supabaseBrowserClient.from('programas').select('id, nombre').order('nombre');
    if (data) {
      // Cargar subcategorías de cada programa
      const conSubcats = await Promise.all(
        data.filter(p => p.id !== programa?.id).map(async (prog) => {
          const { data: subs } = await supabaseBrowserClient
            .from('programas_subcategorias')
            .select('subcategoria_id')
            .eq('programa_id', prog.id);
          return { ...prog, subcategorias: subs?.map(s => s.subcategoria_id) || [] };
        })
      );
      setProgramasDisponibles(conSubcats);
    }
  }

  async function loadProgramaRelaciones() {
    if (!programa) return;

    // Subcategorias
    const { data: subs } = await supabaseBrowserClient
      .from('programas_subcategorias').select('subcategoria_id').eq('programa_id', programa.id);
    if (subs) setSubcategoriasSeleccionadas(subs.map(s => s.subcategoria_id));

    // Plataformas
    const { data: plats } = await supabaseBrowserClient
      .from('programas_plataformas').select('plataforma_id').eq('programa_id', programa.id);
    if (plats) setPlataformasSeleccionadas(plats.map(p => p.plataforma_id));

    // Precios
    const { data: precios } = await supabaseBrowserClient
      .from('programas_precios').select('precio_id').eq('programa_id', programa.id);
    if (precios) setPreciosSeleccionados(precios.map(p => p.precio_id));

    // Alternativas
    const { data: alts } = await supabaseBrowserClient
      .from('programas_alternativas').select('programa_alternativa_id').eq('programa_original_id', programa.id);
    if (alts) setAlternativasSeleccionadas(alts.map(a => a.programa_alternativa_id));
  }

  async function handleAutoFetchAssets() {
    if (!webUrl) {
      toast({ title: 'Ingresa primero la URL', variant: 'destructive' });
      return;
    }

    let normalizedUrl = webUrl.trim();
    if (!normalizedUrl.startsWith('http')) normalizedUrl = `https://${normalizedUrl}`;

    setIsAutoFetching(true);
    try {
      const res = await fetch('/api/auto-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl, slug: watch('slug') }),
      });
      const data = await res.json();

      if (data.screenshotUrl) {
        setAutoFetchedCapturaUrl(data.screenshotUrl);
        setCapturaFile(null);
      }
      if (data.logoUrl) {
        setAutoFetchedIconUrl(data.logoUrl);
        setIconFile(null);
      }

      toast({
        title: '✅ Assets obtenidos',
        description: [data.screenshotUrl && 'Screenshot', data.logoUrl && 'Logo'].filter(Boolean).join(' + '),
      });
    } catch (e) {
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setIsAutoFetching(false);
    }
  }

  function agregarUso() {
    if (nuevoUso.trim() && !usos.includes(nuevoUso.trim())) {
      setUsos([...usos, nuevoUso.trim()]);
      setNuevoUso('');
    }
  }

  function eliminarUso(uso: string) {
    setUsos(usos.filter(u => u !== uso));
  }

  function toggleSelection(id: number, array: number[], setter: (arr: number[]) => void) {
    setter(array.includes(id) ? array.filter(x => x !== id) : [...array, id]);
  }

  async function onSubmit(data: FormData) {
    if (!categoriaSeleccionada) {
      toast({ title: 'Selecciona una categoría', variant: 'destructive' });
      return;
    }
    if (subcategoriasSeleccionadas.length === 0) {
      toast({ title: 'Selecciona al menos una subcategoría', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      const categoria = categorias.find(c => c.id === categoriaSeleccionada);

      // Handle uploads
      let iconUrl = autoFetchedIconUrl || programa?.icono_url;
      let capturaUrl = autoFetchedCapturaUrl || programa?.captura_url;

      if (iconFile) {
        const validation = validateImageFile(iconFile);
        if (validation.valid) {
          iconUrl = await uploadToCloudinary(iconFile, 'programas/icons', `${data.slug}-icon`);
        }
      }

      if (capturaFile) {
        const validation = validateImageFile(capturaFile);
        if (validation.valid) {
          capturaUrl = await uploadToCloudinary(capturaFile, 'programas/screenshots', `${data.slug}-screenshot`);
        }
      }

      const programaData = {
        nombre: data.nombre,
        slug: data.slug,
        categoria_slug: categoria?.slug,
        categoria_id: categoriaSeleccionada,
        descripcion_corta: data.descripcion_corta || null,
        descripcion_larga: data.descripcion_larga || null,
        icono_url: iconUrl || null,
        captura_url: capturaUrl || null,
        dificultad: data.dificultad as 'Facil' | 'Intermedio' | 'Dificil',
        es_open_source: data.es_open_source,
        es_recomendado: data.es_recomendado,
        web_oficial_url: data.web_oficial_url || null,
        usos: usos.length > 0 ? usos : null,
      };

      let programaId = programa?.id;

      if (programa) {
        await supabaseBrowserClient.from('programas').update(programaData).eq('id', programa.id);
      } else {
        const { data: inserted } = await supabaseBrowserClient.from('programas').insert([programaData]).select().single();
        programaId = inserted?.id;
      }

      if (programaId) {
        // Save relations
        await saveRelations('programas_subcategorias', 'subcategoria_id', subcategoriasSeleccionadas, programaId);
        await saveRelations('programas_plataformas', 'plataforma_id', plataformasSeleccionadas, programaId);
        await saveRelations('programas_precios', 'precio_id', preciosSeleccionados, programaId);
        await saveAlternativas(programaId);
      }

      toast({ title: '✅ Guardado correctamente' });
      onClose();
    } catch (e) {
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  }

  async function saveRelations(table: string, field: string, ids: number[], programaId: number) {
    await supabaseBrowserClient.from(table).delete().eq('programa_id', programaId);
    if (ids.length > 0) {
      await supabaseBrowserClient.from(table).insert(ids.map(id => ({ programa_id: programaId, [field]: id })));
    }
  }

  async function saveAlternativas(programaId: number) {
    await supabaseBrowserClient.from('programas_alternativas').delete().eq('programa_original_id', programaId);
    if (alternativasSeleccionadas.length > 0) {
      await supabaseBrowserClient.from('programas_alternativas').insert(
        alternativasSeleccionadas.map(id => ({ programa_original_id: programaId, programa_alternativa_id: id }))
      );
    }
  }

  const categoriasPrincipales = categorias.filter(c => !c.id_categoria_padre);
  const iconPreview = iconFile ? URL.createObjectURL(iconFile) : (autoFetchedIconUrl || programa?.icono_url);
  const capturaPreview = capturaFile ? URL.createObjectURL(capturaFile) : (autoFetchedCapturaUrl || programa?.captura_url);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl">
            {programa ? `Editar: ${programa.nombre}` : 'Nuevo Programa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="relaciones">Relaciones</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-1">
              {/* TAB: Info básica */}
              <TabsContent value="info" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input {...register('nombre')} placeholder="Adobe Photoshop" />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input {...register('slug')} placeholder="adobe-photoshop" className="font-mono text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL Sitio Oficial</Label>
                  <div className="flex gap-2">
                    <Input {...register('web_oficial_url')} placeholder="https://example.com" className="flex-1" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAutoFetchAssets}
                      disabled={isAutoFetching || !webUrl}
                      className="shrink-0"
                    >
                      {isAutoFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      Auto
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descripción corta</Label>
                  <Textarea {...register('descripcion_corta')} rows={2} placeholder="Breve descripción..." />
                </div>

                <div className="space-y-2">
                  <Label>Descripción larga</Label>
                  <Textarea {...register('descripcion_larga')} rows={4} placeholder="Descripción detallada..." />
                </div>

                {/* Campo USOS */}
                <div className="space-y-2">
                  <Label>Para qué sirve (usos)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={nuevoUso}
                      onChange={(e) => setNuevoUso(e.target.value)}
                      placeholder="Ej: Edición de fotos"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarUso())}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={agregarUso}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {usos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {usos.map((uso) => (
                        <Badge key={uso} variant="secondary" className="gap-1 pr-1">
                          {uso}
                          <button type="button" onClick={() => eliminarUso(uso)} className="ml-1 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>Dificultad</Label>
                    <Select defaultValue={programa?.dificultad || 'Intermedio'} onValueChange={v => setValue('dificultad', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facil">Fácil</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Dificil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch id="opensource" {...register('es_open_source')} />
                    <Label htmlFor="opensource">Open Source</Label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch id="recomendado" {...register('es_recomendado')} />
                    <Label htmlFor="recomendado">Recomendado</Label>
                  </div>
                </div>
              </TabsContent>

              {/* TAB: Clasificación */}
              <TabsContent value="clasificacion" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <Label>Categoría principal *</Label>
                  <Select value={categoriaSeleccionada?.toString()} onValueChange={v => setCategoriaSeleccionada(Number(v))}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                    <SelectContent>
                      {categoriasPrincipales.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.icono} {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {subcategorias.length > 0 && (
                  <div className="space-y-2">
                    <Label>Subcategorías *</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30 max-h-40 overflow-y-auto">
                      {subcategorias.map(sub => (
                        <Badge
                          key={sub.id}
                          variant={subcategoriasSeleccionadas.includes(sub.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleSelection(sub.id, subcategoriasSeleccionadas, setSubcategoriasSeleccionadas)}
                        >
                          {sub.nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Plataformas</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
                    {plataformas.map(plat => (
                      <Badge
                        key={plat.id}
                        variant={plataformasSeleccionadas.includes(plat.id) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSelection(plat.id, plataformasSeleccionadas, setPlataformasSeleccionadas)}
                      >
                        {plat.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Modelos de precio</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
                    {modelosPrecios.map(precio => (
                      <Badge
                        key={precio.id}
                        variant={preciosSeleccionados.includes(precio.id) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSelection(precio.id, preciosSeleccionados, setPreciosSeleccionados)}
                      >
                        {precio.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* TAB: Media */}
              <TabsContent value="media" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  {/* Icono */}
                  <div className="space-y-3">
                    <Label>Icono</Label>
                    <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-muted/30">
                      {iconPreview ? (
                        <img src={iconPreview} alt="Icono" className="w-full h-full object-contain p-4" />
                      ) : (
                        <div className="text-center text-muted-foreground text-sm">
                          <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          Sin icono
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                      className="text-sm"
                    />
                  </div>

                  {/* Captura */}
                  <div className="space-y-3">
                    <Label>Captura de pantalla</Label>
                    <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-muted/30">
                      {capturaPreview ? (
                        <img src={capturaPreview} alt="Captura" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-muted-foreground text-sm">
                          <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          Sin captura
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCapturaFile(e.target.files?.[0] || null)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  💡 Usa el botón "Auto" en la pestaña Info para obtener icono y captura automáticamente
                </p>
              </TabsContent>

              {/* TAB: Relaciones */}
              <TabsContent value="relaciones" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alternativas</Label>
                      <p className="text-xs text-muted-foreground">Programas similares o alternativos</p>
                    </div>
                    {alternativasSeleccionadas.length > 0 && (
                      <Badge variant="secondary">{alternativasSeleccionadas.length} seleccionadas</Badge>
                    )}
                  </div>

                  {/* Buscador */}
                  <Input
                    placeholder="Buscar programas..."
                    value={busquedaAlternativas}
                    onChange={(e) => setBusquedaAlternativas(e.target.value)}
                    className="h-9"
                  />

                  {/* Auto-recomendados */}
                  {subcategoriasSeleccionadas.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-pink-500">✨ Recomendados (mismas subcategorías)</p>
                      <div className="flex flex-wrap gap-2 p-2 border rounded-lg border-pink-200 bg-pink-50 dark:bg-pink-950/20 dark:border-pink-800">
                        {programasDisponibles
                          .filter(p =>
                            !alternativasSeleccionadas.includes(p.id) &&
                            p.subcategorias?.some(s => subcategoriasSeleccionadas.includes(s))
                          )
                          .slice(0, 10)
                          .map(prog => (
                            <Badge
                              key={prog.id}
                              variant="outline"
                              className="cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900"
                              onClick={() => toggleSelection(prog.id, alternativasSeleccionadas, setAlternativasSeleccionadas)}
                            >
                              + {prog.nombre}
                            </Badge>
                          ))}
                        {programasDisponibles.filter(p =>
                          !alternativasSeleccionadas.includes(p.id) &&
                          p.subcategorias?.some(s => subcategoriasSeleccionadas.includes(s))
                        ).length === 0 && (
                            <span className="text-xs text-muted-foreground">No hay más programas en estas subcategorías</span>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Lista filtrada */}
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30 max-h-48 overflow-y-auto">
                    {programasDisponibles
                      .filter(p => p.nombre.toLowerCase().includes(busquedaAlternativas.toLowerCase()))
                      .map(prog => (
                        <Badge
                          key={prog.id}
                          variant={alternativasSeleccionadas.includes(prog.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleSelection(prog.id, alternativasSeleccionadas, setAlternativasSeleccionadas)}
                        >
                          {prog.nombre}
                        </Badge>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Footer con botones */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2 bg-pink-500 hover:bg-pink-600">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {programa ? 'Guardar cambios' : 'Crear programa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
