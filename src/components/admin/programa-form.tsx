'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Loader2, Image as ImageIcon, Search } from 'lucide-react';
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
import RichTextEditor from './rich-text-editor';
import { Programa, Categoria } from '@/lib/types';
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
  const [subcategorias, setSubcategorias] = useState<Categoria[]>([]);
  const [todasCategorias, setTodasCategorias] = useState<Categoria[]>([]);
  const [subcategoriasSeleccionadas, setSubcategoriasSeleccionadas] = useState<number[]>([]);
  const [programasDisponibles, setProgramasDisponibles] = useState<{ id: number; nombre: string; slug: string }[]>([]);
  const [alternativasSeleccionadas, setAlternativasSeleccionadas] = useState<number[]>([]);
  const [busquedaAlternativas, setBusquedaAlternativas] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [capturaFile, setCapturaFile] = useState<File | null>(null);
  const [descripcionLarga, setDescripcionLarga] = useState(
    programa?.descripcion_larga || ''
  );
  const [isPasteAreaFocused, setIsPasteAreaFocused] = useState(false);
  const { toast } = useToast();
  
  const [categoriaPrincipalInicial, setCategoriaPrincipalInicial] = useState('');
  
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      nombre: programa?.nombre || '',
      slug: programa?.slug || '',
      categoria_principal_id: programa?.categoria_id?.toString() || '',
      descripcion_corta: programa?.descripcion_corta || '',
      descripcion_larga: programa?.descripcion_larga || '',
      dificultad: programa?.dificultad || 'Intermedio',
      es_open_source: programa?.es_open_source || false,
      es_recomendado: programa?.es_recomendado || false,
      web_oficial_url: programa?.web_oficial_url || '',
    },
  });

  const nombre = watch('nombre');
  const categoriaPrincipalId = watch('categoria_principal_id');

  useEffect(() => {
    loadCategorias();
    loadProgramas();
  }, []);

  async function loadProgramas() {
    try {
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('programas')
        .select('id, nombre, slug')
        .order('nombre');

      if (error) throw error;
      setProgramasDisponibles(data || []);
    } catch (error) {
      console.error('Error loading programas:', error);
    }
  }

  // Cuando cambia la categoría principal, actualizar subcategorías
  useEffect(() => {
    if (categoriaPrincipalId) {
      const subs = todasCategorias.filter(
        cat => cat.id_categoria_padre === parseInt(categoriaPrincipalId)
      );
      setSubcategorias(subs);
      
      // Limpiar subcategorías seleccionadas si cambió la categoría principal
      if (categoriaPrincipalId !== categoriaPrincipalInicial) {
        setSubcategoriasSeleccionadas([]);
      }
    } else {
      setSubcategorias([]);
      setSubcategoriasSeleccionadas([]);
    }
  }, [categoriaPrincipalId, todasCategorias]);

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
      
      // Si estamos editando, cargar la categoría principal y sus subcategorías
      if (programa?.categoria_id) {
        setCategoriaPrincipalInicial(programa.categoria_id.toString());
        setValue('categoria_principal_id', programa.categoria_id.toString());
        
        // Cargar subcategorías de esa categoría principal
        const subs = todas.filter(cat => cat.id_categoria_padre === programa.categoria_id);
        setSubcategorias(subs);
        // Las subcategorías se cargarán en el useEffect siguiente desde la tabla intermedia
      }
    } catch (error) {
      console.error('Error loading categorias:', error);
    }
  }

  // Cargar subcategorías del programa si estamos editando
  useEffect(() => {
    const cargarSubcategorias = async () => {
      if (programa) {
        const supabase = supabaseBrowserClient;
        // Obtener subcategorías desde la tabla intermedia
        const { data, error } = await supabase
          .from('programas_subcategorias')
          .select('subcategoria_id')
          .eq('programa_id', programa.id);

        if (error) {
          console.error('Error al cargar subcategorías:', error);
        } else if (data) {
          const ids = data.map(item => item.subcategoria_id);
          console.log('📚 Subcategorías cargadas desde BD:', ids);
          setSubcategoriasSeleccionadas(ids);
        }
      }
    };

    const cargarAlternativas = async () => {
      if (programa) {
        const supabase = supabaseBrowserClient;
        // Obtener alternativas desde la tabla intermedia
        const { data, error } = await supabase
          .from('programas_alternativas')
          .select('programa_alternativa_id')
          .eq('programa_original_id', programa.id);

        if (error) {
          console.error('Error al cargar alternativas:', error);
        } else if (data) {
          const ids = data.map(item => item.programa_alternativa_id);
          console.log('🔄 Alternativas cargadas desde BD:', ids);
          setAlternativasSeleccionadas(ids);
        }
      }
    };

    cargarSubcategorias();
    cargarAlternativas();
  }, [programa]);

  async function onSubmit(data: FormData) {
    try {
      // Validaciones
      if (!data.categoria_principal_id) {
        toast({
          title: 'Error de validación',
          description: 'Debes seleccionar una categoría principal',
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

      let iconUrl = programa?.icono_url;
      let capturaUrl = programa?.captura_url;

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

      // Obtener el slug de la categoría principal seleccionada
      const categoriaPrincipal = categoriasPrincipales.find(
        cat => cat.id === parseInt(data.categoria_principal_id)
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
        categoria_id: parseInt(data.categoria_principal_id),
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria_principal">Categoría Principal *</Label>
              <Select
                value={watch('categoria_principal_id')}
                onValueChange={(value) => setValue('categoria_principal_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría principal" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasPrincipales.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.icono && `${cat.icono} `}
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Primero selecciona la categoría principal
              </p>
            </div>
          </div>

          {/* Subcategorías con checkboxes */}
          <div className="space-y-2">
            <Label>Subcategorías * (selecciona al menos una)</Label>
            {!categoriaPrincipalId ? (
              <p className="text-sm text-muted-foreground">
                Primero selecciona una categoría principal
              </p>
            ) : subcategorias.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay subcategorías disponibles para esta categoría
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg">
                {subcategorias.map((subcat) => (
                  <div key={subcat.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`subcat-${subcat.id}`}
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
                    <label
                      htmlFor={`subcat-${subcat.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {subcat.icono && `${subcat.icono} `}
                      {subcat.nombre}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {categoriaPrincipalId && subcategorias.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Seleccionadas: {subcategoriasSeleccionadas.length} de {subcategorias.length}
              </p>
            )}
          </div>

          {/* Selector de Alternativas */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold">Alternativas a este programa</Label>
              <span className="text-xs text-muted-foreground">(Opcional)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Selecciona programas que sean alternativas a este (por ejemplo, alternativas a Photoshop: GIMP, Krita, etc.)
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {programasDisponibles
                  .filter(p => p.id !== programa?.id) // Excluir el programa actual
                  .filter(p => 
                    busquedaAlternativas === '' || 
                    p.nombre.toLowerCase().includes(busquedaAlternativas.toLowerCase())
                  )
                  .map((prog) => (
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
                      <span className="text-sm flex items-center gap-1">
                        {prog.nombre}
                        <span className="text-xs text-muted-foreground">#{prog.id}</span>
                      </span>
                    </label>
                  ))}
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
            <Input
              id="web_oficial_url"
              {...register('web_oficial_url')}
              placeholder="https://ejemplo.com"
              type="url"
            />
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
                {(programa?.icono_url || iconFile) && (
                  <img
                    src={
                      iconFile
                        ? URL.createObjectURL(iconFile)
                        : programa?.icono_url || ''
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
              <p className="text-xs text-muted-foreground mb-2">
                💡 Tip: Puedes pegar una imagen directamente con Ctrl+V en cualquier lugar del formulario
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
                className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-colors ${
                  isPasteAreaFocused ? 'border-primary bg-primary/5' : 'border-dashed hover:border-primary/50'
                }`}
              >
                {(programa?.captura_url || capturaFile) && (
                  <img
                    src={
                      capturaFile
                        ? URL.createObjectURL(capturaFile)
                        : programa?.captura_url || ''
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
