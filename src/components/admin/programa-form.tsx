'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Loader2, Image as ImageIcon, Search, FolderTree, Tag, Monitor, DollarSign, Repeat, Lightbulb, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';
import { Programa, Categoria, Plataforma, ModeloDePrecio } from '@/lib/types';

// Lazy load del editor pesado (solo se carga cuando se necesita)
const RichTextEditor = dynamic(
  () => import('./rich-text-editor'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-muted rounded animate-pulse" />
    )
  }
);
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
  categoria_principal_id: string;
  descripcion_corta: string;
  descripcion_larga: string;
  dificultad: string;
  es_open_source: boolean;
  es_recomendado: boolean;
  web_oficial_url: string;
}

export default function ProgramaForm({ programa, onClose }: ProgramaFormProps) {
  const [categoriasPrincipales, setCategoriasPrincipales] = useState<Categoria[]>([]);
  const [todasCategorias, setTodasCategorias] = useState<Categoria[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<Categoria[]>([]);
  const [subcategoriasSeleccionadas, setSubcategoriasSeleccionadas] = useState<number[]>([]);
  const [busquedaSubcategorias, setBusquedaSubcategorias] = useState('');
  const [programasDisponibles, setProgramasDisponibles] = useState<{ id: number; nombre: string; slug: string; subcategorias?: number[] }[]>([]);
  const [alternativasSeleccionadas, setAlternativasSeleccionadas] = useState<number[]>([]);
  const [busquedaAlternativas, setBusquedaAlternativas] = useState('');
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState<number[]>([]);
  const [modelosPrecios, setModelosPrecios] = useState<ModeloDePrecio[]>([]);
  const [preciosSeleccionados, setPreciosSeleccionados] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [capturaFile, setCapturaFile] = useState<File | null>(null);
  const [descripcionLarga, setDescripcionLarga] = useState(
    programa?.descripcion_larga || ''
  );
  const [isPasteAreaFocused, setIsPasteAreaFocused] = useState(false);
  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [autoFetchedIconUrl, setAutoFetchedIconUrl] = useState<string | null>(null);
  const [autoFetchedCapturaUrl, setAutoFetchedCapturaUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      nombre: programa?.nombre || '',
      slug: programa?.slug || '',
      descripcion_corta: programa?.descripcion_corta || '',
      descripcion_larga: programa?.descripcion_larga || '',
      dificultad: programa?.dificultad || 'Intermedio',
      es_open_source: programa?.es_open_source || false,
      es_recomendado: programa?.es_recomendado || false,
      web_oficial_url: programa?.web_oficial_url || '',
    },
  });

  const nombre = watch('nombre');

  useEffect(() => {
    loadCategorias();
    loadProgramas();
    loadPlataformas();
    loadModelosPrecios();
  }, []);

  // Handler para auto-completar assets desde URL
  async function handleAutoFetchAssets() {
    const webUrl = watch('web_oficial_url');
    const slug = watch('slug');

    if (!webUrl) {
      toast({
        title: 'URL requerida',
        description: 'Primero ingresa la URL del sitio oficial',
        variant: 'destructive',
      });
      return;
    }

    // Normalizar URL
    let normalizedUrl = webUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setIsAutoFetching(true);
    toast({
      title: '🔄 Obteniendo assets...',
      description: 'Capturando screenshot y buscando logo del sitio',
    });

    try {
      const response = await fetch('/api/auto-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl, slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener assets');
      }

      let successParts: string[] = [];
      let errorParts: string[] = [];

      if (data.screenshotUrl) {
        setAutoFetchedCapturaUrl(data.screenshotUrl);
        setCapturaFile(null); // Clear any manually uploaded file
        successParts.push('Screenshot capturado');
      }

      if (data.logoUrl) {
        setAutoFetchedIconUrl(data.logoUrl);
        setIconFile(null); // Clear any manually uploaded file
        successParts.push('Logo procesado (1000x1000)');
      }

      if (data.errors && data.errors.length > 0) {
        errorParts = data.errors;
      }

      if (successParts.length > 0) {
        toast({
          title: '✅ Assets obtenidos',
          description: successParts.join(' • ') + (errorParts.length > 0 ? `. Advertencias: ${errorParts.join(', ')}` : ''),
        });
      } else {
        toast({
          title: '⚠️ No se pudieron obtener assets',
          description: errorParts.join('. ') || 'Error desconocido',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'No se pudieron obtener los assets',
        variant: 'destructive',
      });
    } finally {
      setIsAutoFetching(false);
    }
  }

  async function loadProgramas() {
    try {
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('programas')
        .select('id, nombre, slug')
        .order('nombre');

      if (error) throw error;

      // Cargar subcategorías de cada programa
      const programasConSubcats = await Promise.all(
        (data || []).map(async (prog) => {
          const { data: subsData } = await supabase
            .from('programas_subcategorias')
            .select('subcategoria_id')
            .eq('programa_id', prog.id);

          return {
            ...prog,
            subcategorias: subsData?.map(s => s.subcategoria_id) || []
          };
        })
      );

      setProgramasDisponibles(programasConSubcats);
    } catch (error) {
      console.error('Error loading programas:', error);
    }
  }

  // Cuando cambian las categorías seleccionadas, actualizar subcategorías disponibles
  useEffect(() => {
    if (categoriasSeleccionadas.length > 0) {
      const subs = todasCategorias.filter(
        cat => cat.id_categoria_padre && categoriasSeleccionadas.includes(cat.id_categoria_padre)
      );
      setSubcategoriasDisponibles(subs);

      // Limpiar subcategorías que ya no son válidas
      const subsValidas = subcategoriasSeleccionadas.filter(subId =>
        subs.some(sub => sub.id === subId)
      );
      if (subsValidas.length !== subcategoriasSeleccionadas.length) {
        setSubcategoriasSeleccionadas(subsValidas);
      }
    } else {
      setSubcategoriasDisponibles([]);
      setSubcategoriasSeleccionadas([]);
    }
  }, [categoriasSeleccionadas, todasCategorias]);

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

  // Manejar pegado de imágenes desde el portapapeles
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            // Crear un archivo con nombre descriptivo
            const file = new File([blob], `captura-${Date.now()}.png`, {
              type: blob.type
            });
            setCapturaFile(file);
            toast({
              title: 'Imagen pegada',
              description: 'La captura se ha cargado correctamente. Haz clic en Guardar para subirla.',
            });
          }
          break;
        }
      }
    };

    // Agregar el listener solo cuando el formulario está abierto
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [toast]);

  async function loadCategorias() {
    try {
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre');

      if (error) throw error;

      const todas = data || [];
      setTodasCategorias(todas);

      // Separar categorías principales (sin padre)
      const principales = todas.filter(cat => !cat.id_categoria_padre);
      setCategoriasPrincipales(principales);

      // Si estamos editando, cargar la categoría principal
      if (programa?.categoria_id) {
        setCategoriasSeleccionadas([programa.categoria_id]);
      }
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

  // Cargar datos relacionados del programa si estamos editando
  useEffect(() => {
    const cargarDatosPrograma = async () => {
      if (!programa) return;

      const supabase = supabaseBrowserClient;

      // Cargar subcategorías
      const { data: subsData, error: subsError } = await supabase
        .from('programas_subcategorias')
        .select('subcategoria_id')
        .eq('programa_id', programa.id);

      if (subsError) {
        console.error('Error al cargar subcategorías:', subsError);
      } else if (subsData) {
        const ids = subsData.map(item => item.subcategoria_id);
        console.log('📚 Subcategorías cargadas:', ids);
        setSubcategoriasSeleccionadas(ids);
      }

      // Cargar alternativas
      const { data: altData, error: altError } = await supabase
        .from('programas_alternativas')
        .select('programa_alternativa_id')
        .eq('programa_original_id', programa.id);

      if (altError) {
        console.error('Error al cargar alternativas:', altError);
      } else if (altData) {
        const ids = altData.map(item => item.programa_alternativa_id);
        console.log('🔄 Alternativas cargadas:', ids);
        setAlternativasSeleccionadas(ids);
      }

      // Cargar plataformas (si existe la tabla intermedia)
      const { data: platData, error: platError } = await supabase
        .from('programas_plataformas')
        .select('plataforma_id')
        .eq('programa_id', programa.id);

      if (!platError && platData) {
        const ids = platData.map(item => item.plataforma_id);
        console.log('💻 Plataformas cargadas:', ids);
        setPlataformasSeleccionadas(ids);
      }

      // Cargar precios (si existe la tabla intermedia)
      const { data: precioData, error: precioError } = await supabase
        .from('programas_precios')
        .select('precio_id')
        .eq('programa_id', programa.id);

      if (!precioError && precioData) {
        const ids = precioData.map(item => item.precio_id);
        console.log('💰 Precios cargados:', ids);
        setPreciosSeleccionados(ids);
      }
    };

    cargarDatosPrograma();
  }, [programa]);

  async function onSubmit(data: FormData) {
    try {
      // Validaciones
      if (categoriasSeleccionadas.length === 0) {
        toast({
          title: 'Error de validación',
          description: 'Debes seleccionar al menos una categoría principal',
          variant: 'destructive',
        });
        return;
      }

      if (subcategoriasSeleccionadas.length === 0) {
        toast({
          title: 'Error de validación',
          description: 'Debes seleccionar al menos una subcategoría',
          variant: 'destructive',
        });
        return;
      }

      setIsSaving(true);
      const supabase = supabaseBrowserClient;

      // Priority: manually uploaded file > auto-fetched URL > existing URL from programa
      let iconUrl = autoFetchedIconUrl || programa?.icono_url;
      let capturaUrl = autoFetchedCapturaUrl || programa?.captura_url;

      // Validate and upload icon if changed (opcional, no bloquea guardado)
      if (iconFile) {
        try {
          const validation = validateImageFile(iconFile);
          if (!validation.valid) {
            toast({
              title: 'Advertencia',
              description: `Icono no válido: ${validation.error}. Se guardará sin icono.`,
              variant: 'destructive',
            });
          } else {
            // Usar el slug como public_id para sobrescribir la imagen anterior
            const publicId = `${data.slug}-icon`;
            iconUrl = await uploadToCloudinary(iconFile, 'programas/icons', publicId);
            console.log('✅ Icono subido:', iconUrl);
          }
        } catch (error) {
          console.error('❌ Error subiendo icono:', error);
          toast({
            title: 'Advertencia',
            description: 'No se pudo subir el icono. El programa se guardará sin él. Configura Cloudinary correctamente.',
            variant: 'destructive',
          });
          // Continúa sin el icono
        }
      }

      // Validate and upload capture if changed (opcional, no bloquea guardado)
      if (capturaFile) {
        try {
          const validation = validateImageFile(capturaFile);
          if (!validation.valid) {
            toast({
              title: 'Advertencia',
              description: `Captura no válida: ${validation.error}. Se guardará sin captura.`,
              variant: 'destructive',
            });
          } else {
            // Usar el slug como public_id para sobrescribir la imagen anterior
            const publicId = `${data.slug}-screenshot`;
            capturaUrl = await uploadToCloudinary(capturaFile, 'programas/screenshots', publicId);
            console.log('✅ Captura subida:', capturaUrl);
          }
        } catch (error) {
          console.error('❌ Error subiendo captura:', error);
          toast({
            title: 'Advertencia',
            description: 'No se pudo subir la captura. El programa se guardará sin ella. Configura Cloudinary correctamente.',
            variant: 'destructive',
          });
          // Continúa sin la captura
        }
      }

      // Usar la primera categoría seleccionada como principal
      const categoriaPrincipal = categoriasPrincipales.find(
        cat => cat.id === categoriasSeleccionadas[0]
      );

      if (!categoriaPrincipal) {
        toast({
          title: 'Error',
          description: 'No se encontró la categoría seleccionada',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }

      const programaData = {
        nombre: data.nombre,
        slug: data.slug,
        categoria_slug: categoriaPrincipal.slug,
        categoria_id: categoriaPrincipal.id,
        descripcion_corta: data.descripcion_corta || null,
        descripcion_larga: descripcionLarga || null,
        icono_url: iconUrl || null,
        captura_url: capturaUrl || null,
        dificultad: data.dificultad as 'Facil' | 'Intermedio' | 'Dificil',
        es_open_source: data.es_open_source,
        es_recomendado: data.es_recomendado,
        web_oficial_url: data.web_oficial_url || null,
      };

      console.log('💾 Guardando programa:', programaData);
      console.log('📋 Subcategorías a guardar:', subcategoriasSeleccionadas);

      if (programa) {
        // Update existing
        const { error: updateError } = await supabase
          .from('programas')
          .update(programaData)
          .eq('id', programa.id);

        if (updateError) {
          console.error('❌ Error al actualizar programa:', updateError);
          throw updateError;
        }

        // Actualizar subcategorías: eliminar las viejas y agregar las nuevas
        // 1. Eliminar todas las subcategorías actuales
        const { error: deleteError } = await supabase
          .from('programas_subcategorias')
          .delete()
          .eq('programa_id', programa.id);

        if (deleteError) {
          console.error('❌ Error al eliminar subcategorías viejas:', deleteError);
          throw deleteError;
        }

        // 2. Insertar las nuevas subcategorías
        if (subcategoriasSeleccionadas.length > 0) {
          const subcategoriasData = subcategoriasSeleccionadas.map(subcatId => ({
            programa_id: programa.id,
            subcategoria_id: subcatId
          }));

          const { error: insertError } = await supabase
            .from('programas_subcategorias')
            .insert(subcategoriasData);

          if (insertError) {
            console.error('❌ Error al insertar subcategorías:', insertError);
            throw insertError;
          }
        }

        // Verificar que se actualizó
        const { data: verificacion, error: selectError } = await supabase
          .from('programas')
          .select('*')
          .eq('id', programa.id)
          .single();

        if (selectError) {
          console.error('⚠️ No se pudo verificar la actualización:', selectError);
        } else {
          console.log('✅ Programa actualizado y verificado:', verificacion);
        }

        // Verificar subcategorías guardadas
        const { data: subcatsGuardadas } = await supabase
          .from('programas_subcategorias')
          .select('subcategoria_id')
          .eq('programa_id', programa.id);

        console.log('✅ Subcategorías guardadas en BD:', subcatsGuardadas?.map(s => s.subcategoria_id));

        // =========== GUARDAR ALTERNATIVAS ===========
        // 1. Eliminar todas las alternativas actuales
        const { error: deleteAltError } = await supabase
          .from('programas_alternativas')
          .delete()
          .eq('programa_original_id', programa.id);

        if (deleteAltError) {
          console.error('❌ Error al eliminar alternativas viejas:', deleteAltError);
          throw deleteAltError;
        }

        // 2. Insertar las nuevas alternativas
        if (alternativasSeleccionadas.length > 0) {
          const alternativasData = alternativasSeleccionadas.map(altId => ({
            programa_original_id: programa.id,
            programa_alternativa_id: altId
          }));

          const { error: insertAltError } = await supabase
            .from('programas_alternativas')
            .insert(alternativasData);

          if (insertAltError) {
            console.error('❌ Error al insertar alternativas:', insertAltError);
            throw insertAltError;
          }

          // Verificar alternativas guardadas
          const { data: alternativasGuardadas } = await supabase
            .from('programas_alternativas')
            .select('programa_alternativa_id')
            .eq('programa_original_id', programa.id);

          console.log('✅ Alternativas guardadas en BD:', alternativasGuardadas?.map(a => a.programa_alternativa_id));
        }

        // =========== GUARDAR PLATAFORMAS ===========
        const { error: deletePlatError } = await supabase
          .from('programas_plataformas')
          .delete()
          .eq('programa_id', programa.id);

        if (deletePlatError && deletePlatError.code !== 'PGRST116') {
          console.error('❌ Error al eliminar plataformas:', deletePlatError);
        }

        if (plataformasSeleccionadas.length > 0) {
          const plataformasData = plataformasSeleccionadas.map(platId => ({
            programa_id: programa.id,
            plataforma_id: platId
          }));

          const { error: insertPlatError } = await supabase
            .from('programas_plataformas')
            .insert(plataformasData);

          if (insertPlatError) {
            console.error('❌ Error al insertar plataformas:', insertPlatError);
          } else {
            console.log('✅ Plataformas guardadas');
          }
        }

        // =========== GUARDAR PRECIOS ===========
        const { error: deletePrecioError } = await supabase
          .from('programas_precios')
          .delete()
          .eq('programa_id', programa.id);

        if (deletePrecioError && deletePrecioError.code !== 'PGRST116') {
          console.error('❌ Error al eliminar precios:', deletePrecioError);
        }

        if (preciosSeleccionados.length > 0) {
          const preciosData = preciosSeleccionados.map(precioId => ({
            programa_id: programa.id,
            precio_id: precioId
          }));

          const { error: insertPrecioError } = await supabase
            .from('programas_precios')
            .insert(preciosData);

          if (insertPrecioError) {
            console.error('❌ Error al insertar precios:', insertPrecioError);
          } else {
            console.log('✅ Precios guardados');
          }
        }

        toast({
          title: 'Éxito',
          description: 'Programa actualizado correctamente',
        });
      } else {
        // Create new
        const { data: insertedData, error } = await supabase
          .from('programas')
          .insert([programaData])
          .select()
          .single();

        if (error) {
          console.error('❌ Error al crear:', error);
          throw error;
        }

        console.log('✅ Programa creado:', insertedData);

        // Insertar subcategorías para el nuevo programa
        if (subcategoriasSeleccionadas.length > 0 && insertedData) {
          const subcategoriasData = subcategoriasSeleccionadas.map(subcatId => ({
            programa_id: insertedData.id,
            subcategoria_id: subcatId
          }));

          const { error: insertError } = await supabase
            .from('programas_subcategorias')
            .insert(subcategoriasData);

          if (insertError) {
            console.error('❌ Error al insertar subcategorías:', insertError);
          } else {
            console.log('✅ Subcategorías insertadas para nuevo programa');
          }
        }

        // Insertar alternativas para el nuevo programa
        if (alternativasSeleccionadas.length > 0 && insertedData) {
          const alternativasData = alternativasSeleccionadas.map(altId => ({
            programa_original_id: insertedData.id,
            programa_alternativa_id: altId
          }));

          const { error: insertAltError } = await supabase
            .from('programas_alternativas')
            .insert(alternativasData);

          if (insertAltError) {
            console.error('❌ Error al insertar alternativas:', insertAltError);
          } else {
            console.log('✅ Alternativas insertadas para nuevo programa');
          }
        }

        // Insertar plataformas para el nuevo programa
        if (plataformasSeleccionadas.length > 0 && insertedData) {
          const plataformasData = plataformasSeleccionadas.map(platId => ({
            programa_id: insertedData.id,
            plataforma_id: platId
          }));

          const { error: insertPlatError } = await supabase
            .from('programas_plataformas')
            .insert(plataformasData);

          if (insertPlatError) {
            console.error('❌ Error al insertar plataformas:', insertPlatError);
          } else {
            console.log('✅ Plataformas insertadas para nuevo programa');
          }
        }

        // Insertar precios para el nuevo programa
        if (preciosSeleccionados.length > 0 && insertedData) {
          const preciosData = preciosSeleccionados.map(precioId => ({
            programa_id: insertedData.id,
            precio_id: precioId
          }));

          const { error: insertPrecioError } = await supabase
            .from('programas_precios')
            .insert(preciosData);

          if (insertPrecioError) {
            console.error('❌ Error al insertar precios:', insertPrecioError);
          } else {
            console.log('✅ Precios insertados para nuevo programa');
          }
        }

        toast({
          title: 'Éxito',
          description: 'Programa creado correctamente',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving programa:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el programa',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {programa ? 'Editar Programa' : 'Nuevo Programa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre', { required: true })}
                placeholder="Nombre del programa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug', { required: true })}
                placeholder="nombre-del-programa"
              />
            </div>
          </div>

          {/* Categorías Principales - Selección Múltiple */}
          <div className="space-y-3 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-primary" />
                <Label className="text-base font-semibold">Categorías Principales * (puedes seleccionar varias)</Label>
              </div>
              <span className="text-xs text-muted-foreground">
                {categoriasSeleccionadas.length} seleccionadas
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Selecciona todas las categorías principales a las que pertenece este programa
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-background rounded-lg">
              {categoriasPrincipales.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={categoriasSeleccionadas.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCategoriasSeleccionadas([...categoriasSeleccionadas, cat.id]);
                      } else {
                        setCategoriasSeleccionadas(
                          categoriasSeleccionadas.filter(id => id !== cat.id)
                        );
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">
                    {cat.icono && `${cat.icono} `}
                    {cat.nombre}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategorías con checkboxes */}
          <div className="space-y-3 p-4 bg-accent/30 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                <Label className="text-base font-semibold">Subcategorías * (selecciona al menos una)</Label>
              </div>
              {categoriasSeleccionadas.length > 0 && subcategoriasDisponibles.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {subcategoriasSeleccionadas.length} de {subcategoriasDisponibles.length}
                </span>
              )}
            </div>

            {categoriasSeleccionadas.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/30">
                Primero selecciona al menos una categoría principal
              </p>
            ) : subcategoriasDisponibles.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/30">
                No hay subcategorías disponibles para las categorías seleccionadas
              </p>
            ) : (
              <>
                {/* Buscador de subcategorías */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar subcategoría..."
                    value={busquedaSubcategorias}
                    onChange={(e) => setBusquedaSubcategorias(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Subcategorías agrupadas por categoría */}
                <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                  {categoriasSeleccionadas.map(catId => {
                    const categoriaPadre = categoriasPrincipales.find(c => c.id === catId);
                    const subcatsDeCategoria = subcategoriasDisponibles.filter(
                      sub => sub.id_categoria_padre === catId &&
                        (busquedaSubcategorias === '' ||
                          sub.nombre.toLowerCase().includes(busquedaSubcategorias.toLowerCase()))
                    );

                    if (subcatsDeCategoria.length === 0) return null;

                    return (
                      <div key={catId} className="space-y-2">
                        <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded-md">
                          <span className="text-sm font-semibold text-primary">
                            {categoriaPadre?.icono && `${categoriaPadre.icono} `}
                            {categoriaPadre?.nombre}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({subcatsDeCategoria.filter(s => subcategoriasSeleccionadas.includes(s.id)).length}/{subcatsDeCategoria.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                          {subcatsDeCategoria.map((subcat) => (
                            <label
                              key={subcat.id}
                              className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={subcategoriasSeleccionadas.includes(subcat.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSubcategoriasSeleccionadas([...subcategoriasSeleccionadas, subcat.id]);
                                  } else {
                                    setSubcategoriasSeleccionadas(
                                      subcategoriasSeleccionadas.filter(id => id !== subcat.id)
                                    );
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <span className="text-sm flex-1">
                                {subcat.icono && `${subcat.icono} `}
                                {subcat.nombre}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Selector de Plataformas */}
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <Label className="text-base font-semibold">Plataformas / Sistemas Operativos</Label>
              <span className="text-xs text-muted-foreground">(Opcional)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Selecciona en qué plataformas está disponible este programa
            </p>
            {plataformas.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-background rounded-md">
                {plataformas.map((plat) => (
                  <label
                    key={plat.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={plataformasSeleccionadas.includes(plat.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPlataformasSeleccionadas([...plataformasSeleccionadas, plat.id]);
                        } else {
                          setPlataformasSeleccionadas(
                            plataformasSeleccionadas.filter((id) => id !== plat.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm flex items-center gap-1">
                      {plat.icono_url && (
                        <img src={plat.icono_url} alt={plat.nombre} className="w-4 h-4" />
                      )}
                      {plat.nombre}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Cargando plataformas...</p>
            )}
            {plataformasSeleccionadas.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Seleccionadas: {plataformasSeleccionadas.length} plataformas
              </p>
            )}
          </div>

          {/* Selector de Modelos de Precio */}
          <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <Label className="text-base font-semibold">Modelos de Precio</Label>
              <span className="text-xs text-muted-foreground">(Opcional)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Selecciona los modelos de precio disponibles para este programa
            </p>
            {modelosPrecios.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-background rounded-md">
                {modelosPrecios.map((precio) => (
                  <label
                    key={precio.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preciosSeleccionados.includes(precio.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreciosSeleccionados([...preciosSeleccionados, precio.id]);
                        } else {
                          setPreciosSeleccionados(
                            preciosSeleccionados.filter((id) => id !== precio.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{precio.nombre}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Cargando modelos de precio...</p>
            )}
            {preciosSeleccionados.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Seleccionados: {preciosSeleccionados.length} modelos
              </p>
            )}
          </div>

          {/* Selector de Alternativas */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5" />
              <Label className="text-base font-semibold">Alternativas a este programa</Label>
              <span className="text-xs text-muted-foreground">(Opcional)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Los programas con subcategorías similares aparecen primero. Selecciona las alternativas relevantes.
            </p>

            {/* Buscador de alternativas */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar programa por nombre..."
                value={busquedaAlternativas}
                onChange={(e) => setBusquedaAlternativas(e.target.value)}
                className="pl-10"
              />
            </div>

            {programasDisponibles.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                {(() => {
                  // Filtrar programas (excluir el actual)
                  const programasFiltrados = programasDisponibles
                    .filter(p => p.id !== programa?.id)
                    .filter(p =>
                      busquedaAlternativas === '' ||
                      p.nombre.toLowerCase().includes(busquedaAlternativas.toLowerCase())
                    );

                  // Calcular relevancia basado en subcategorías compartidas
                  const programasConRelevancia = programasFiltrados.map(prog => {
                    const subcatsCompartidas = (prog.subcategorias || []).filter(
                      subId => subcategoriasSeleccionadas.includes(subId)
                    ).length;

                    return {
                      ...prog,
                      relevancia: subcatsCompartidas
                    };
                  });

                  // Ordenar por relevancia (más subcategorías compartidas primero)
                  const programasOrdenados = programasConRelevancia.sort((a, b) => {
                    if (b.relevancia !== a.relevancia) {
                      return b.relevancia - a.relevancia;
                    }
                    return a.nombre.localeCompare(b.nombre);
                  });

                  // Separar en grupos: relevantes y otros
                  const relevantes = programasOrdenados.filter(p => p.relevancia > 0);
                  const otros = programasOrdenados.filter(p => p.relevancia === 0);

                  return (
                    <div className="space-y-4">
                      {relevantes.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-primary px-2">
                            Más relevantes (comparten subcategorías)
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {relevantes.map((prog) => (
                              <label
                                key={prog.id}
                                className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer border border-primary/20 bg-primary/5"
                              >
                                <input
                                  type="checkbox"
                                  checked={alternativasSeleccionadas.includes(prog.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setAlternativasSeleccionadas([...alternativasSeleccionadas, prog.id]);
                                    } else {
                                      setAlternativasSeleccionadas(
                                        alternativasSeleccionadas.filter((id) => id !== prog.id)
                                      );
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm flex flex-col flex-1">
                                  <span>{prog.nombre}</span>
                                  <span className="text-xs text-primary">
                                    {prog.relevancia} subcategoría{prog.relevancia > 1 ? 's' : ''} en común
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {otros.length > 0 && (
                        <div className="space-y-2">
                          {relevantes.length > 0 && (
                            <div className="text-xs font-semibold text-muted-foreground px-2">
                              Otros programas
                            </div>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {otros.map((prog) => (
                              <label
                                key={prog.id}
                                className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={alternativasSeleccionadas.includes(prog.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setAlternativasSeleccionadas([...alternativasSeleccionadas, prog.id]);
                                    } else {
                                      setAlternativasSeleccionadas(
                                        alternativasSeleccionadas.filter((id) => id !== prog.id)
                                      );
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm">
                                  {prog.nombre}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Cargando programas...</p>
            )}

            {alternativasSeleccionadas.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Seleccionadas: {alternativasSeleccionadas.length} alternativas
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dificultad">Dificultad</Label>
              <Select
                value={watch('dificultad')}
                onValueChange={(value) => setValue('dificultad', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facil">Fácil</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion_corta">Descripción Corta</Label>
            <Textarea
              id="descripcion_corta"
              {...register('descripcion_corta')}
              placeholder="Breve descripción del programa"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Descripción Larga</Label>
            <RichTextEditor
              content={descripcionLarga}
              onChange={setDescripcionLarga}
              placeholder="Descripción detallada del programa..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="web_oficial_url">URL Sitio Oficial</Label>
            <div className="flex gap-2">
              <Input
                id="web_oficial_url"
                {...register('web_oficial_url')}
                placeholder="ejemplo.com o https://ejemplo.com"
                type="text"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoFetchAssets}
                disabled={isAutoFetching}
                className="shrink-0"
              >
                {isAutoFetching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Obteniendo...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Auto-completar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresa la URL y haz clic en "Auto-completar" para obtener screenshot y logo automáticamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Icono con Drag & Drop */}
            <div className="space-y-2">
              <Label>Icono del Programa</Label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-primary', 'bg-primary/5');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                  const files = Array.from(e.dataTransfer.files);
                  const imageFile = files.find(f => f.type.startsWith('image/'));
                  if (imageFile) {
                    setIconFile(imageFile);
                    toast({
                      title: 'Icono cargado',
                      description: 'El icono se ha cargado correctamente',
                    });
                  }
                }}
                className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg transition-colors hover:border-primary/50"
              >
                {(programa?.icono_url || iconFile || autoFetchedIconUrl) && (
                  <img
                    src={
                      iconFile
                        ? URL.createObjectURL(iconFile)
                        : autoFetchedIconUrl || programa?.icono_url || ''
                    }
                    alt="Icon preview"
                    className="w-16 h-16 rounded object-cover border"
                  />
                )}
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Subir Icono</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    o arrastra un archivo aquí
                  </p>
                </div>
              </div>
            </div>

            {/* Captura con Drag & Drop y Paste */}
            <div className="space-y-2">
              <Label>Captura de Pantalla</Label>
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                Tip: Puedes pegar una imagen directamente con Ctrl+V en cualquier lugar del formulario
              </p>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-primary', 'bg-primary/5');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                  const files = Array.from(e.dataTransfer.files);
                  const imageFile = files.find(f => f.type.startsWith('image/'));
                  if (imageFile) {
                    setCapturaFile(imageFile);
                    toast({
                      title: 'Captura cargada',
                      description: 'La captura se ha cargado correctamente',
                    });
                  }
                }}
                onFocus={() => setIsPasteAreaFocused(true)}
                onBlur={() => setIsPasteAreaFocused(false)}
                tabIndex={0}
                className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-colors ${isPasteAreaFocused ? 'border-primary bg-primary/5' : 'border-dashed hover:border-primary/50'
                  }`}
              >
                {(programa?.captura_url || capturaFile || autoFetchedCapturaUrl) && (
                  <img
                    src={
                      capturaFile
                        ? URL.createObjectURL(capturaFile)
                        : autoFetchedCapturaUrl || programa?.captura_url || ''
                    }
                    alt="Capture preview"
                    className="w-32 h-20 rounded object-cover border"
                  />
                )}
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm">Subir Archivo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCapturaFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    o arrastra/pega (Ctrl+V)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="es_open_source"
                checked={watch('es_open_source')}
                onCheckedChange={(checked) => setValue('es_open_source', checked)}
              />
              <Label htmlFor="es_open_source" className="cursor-pointer">
                Open Source
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="es_recomendado"
                checked={watch('es_recomendado')}
                onCheckedChange={(checked) => setValue('es_recomendado', checked)}
              />
              <Label htmlFor="es_recomendado" className="cursor-pointer">
                Recomendado
              </Label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
