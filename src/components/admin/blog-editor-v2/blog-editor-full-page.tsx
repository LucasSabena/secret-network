// FILE: src/components/admin/blog-editor-v2/blog-editor-full-page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Upload,
  Loader2,
  Eye,
  Edit,
  Save,
  X,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Settings,
  User,
  Clipboard,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { DragDropEditor } from './drag-drop-editor';
import { EditorHelp } from './editor-help';
import { EditorStats } from './editor-stats';
import { EditorOnboarding } from './editor-onboarding';
import { TemplateGallery } from './template-gallery';
import { SpellCheckDialog } from './spell-check-dialog';
import { ResponsivePreview } from './responsive-preview';
import { ImagePasteHandler } from './image-paste-handler';
import { BlockRenderer } from '@/components/blog/block-renderer';
import { BlogPost, Autor, Block } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';
import { ImageManager } from '@/lib/image-manager';
import { hasClipboardData, getFromClipboard, formatClipboardAge, cloneBlocksWithNewIds } from '@/lib/clipboard-manager';
import { BlogCategorySelector } from '../blog-category-selector';
import { BlogSchedulePicker } from '../blog-schedule-picker';

interface BlogEditorFullPageProps {
  post: BlogPost | null;
  onClose: () => void;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'hace un momento';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `hace ${hours} h`;
}

interface FormData {
  titulo: string;
  slug: string;
  descripcion_corta: string;
  autor: string;
  autor_id: number | null;
  publicado: boolean;
  tags: string;
  imagen_portada_alt: string;
}

export function BlogEditorFullPage({ post, onClose }: BlogEditorFullPageProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [blocks, setBlocks] = useState<Block[]>(post?.contenido_bloques || []);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [autores, setAutores] = useState<Autor[]>([]);
  const [selectedAutorNombre, setSelectedAutorNombre] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showClipboardIndicator, setShowClipboardIndicator] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(post?.categories || []);
  const [scheduledFor, setScheduledFor] = useState<string | null>(post?.scheduled_for || null);
  const { toast } = useToast();

  // Verificar si hay datos en el clipboard
  useEffect(() => {
    setShowClipboardIndicator(hasClipboardData());
  }, []);
  
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      titulo: post?.titulo || '',
      slug: post?.slug || '',
      descripcion_corta: post?.descripcion_corta || '',
      autor: post?.autor || '',
      autor_id: post?.autor_id || null,
      publicado: post?.publicado || false,
      tags: post?.tags?.join(', ') || '',
      imagen_portada_alt: post?.imagen_portada_alt || '',
    },
  });

  const titulo = watch('titulo');
  const slug = watch('slug');
  const descripcion_corta = watch('descripcion_corta');
  const tags = watch('tags');
  const publicado = watch('publicado');
  const autor_id = watch('autor_id');

  // Detectar cambios
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [blocks, titulo, descripcion_corta, autor_id, imageFile]);

  // Auto-save cada 30 segundos
  useEffect(() => {
    if (!hasUnsavedChanges || !post) return;

    const interval = setInterval(() => {
      handleAutoSave();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, blocks, titulo, post]);

  // Advertir antes de salir con cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Ctrl+S para guardar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchAutores = async () => {
      const { data, error } = await supabaseBrowserClient
        .from('autores')
        .select('*')
        .order('nombre', { ascending: true });

      if (!error && data) {
        setAutores(data);
        if (post?.autor_id) {
          const autorActual = data.find((a) => a.id === post.autor_id);
          if (autorActual) {
            setSelectedAutorNombre(autorActual.nombre);
          }
        }
      }
    };
    
    const fetchCategories = async () => {
      if (post?.id) {
        const { data } = await supabaseBrowserClient
          .from('blog_posts_categories')
          .select('category_id')
          .eq('post_id', post.id);
        
        if (data) {
          setSelectedCategories(data.map(d => d.category_id));
        }
      }
    };
    
    fetchAutores();
    fetchCategories();
  }, [post]);

  useEffect(() => {
    if (autor_id) {
      const autor = autores.find((a) => a.id === autor_id);
      if (autor) {
        setSelectedAutorNombre(autor.nombre);
        setValue('autor', autor.nombre);
      }
    }
  }, [autor_id, autores, setValue]);

  async function handleAutoSave() {
    if (!post || !titulo) return;

    try {
      const supabase = supabaseBrowserClient;

      const postData = {
        contenido_bloques: blocks,
        actualizado_en: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', post.id);

      if (!error) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error auto-saving:', error);
    }
  }

  async function updatePostCategories(postId: number, categoryIds: number[]) {
    const supabase = supabaseBrowserClient;
    
    // Eliminar categorías existentes
    await supabase
      .from('blog_posts_categories')
      .delete()
      .eq('post_id', postId);
    
    // Insertar nuevas categorías
    if (categoryIds.length > 0) {
      const relations = categoryIds.map(catId => ({
        post_id: postId,
        category_id: catId,
      }));
      
      await supabase
        .from('blog_posts_categories')
        .insert(relations);
    }
  }

  async function handleImagePasted(file: File) {
    try {
      setIsSaving(true);
      
      // Validar imagen
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: 'Error',
          description: validation.error,
          variant: 'destructive',
        });
        return;
      }

      // Subir a Cloudinary
      const imageUrl = await uploadToCloudinary(file, 'blog-pasted');

      // Crear bloque de imagen
      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        type: 'image',
        data: {
          url: imageUrl,
          alt: `Imagen pegada ${new Date().toLocaleString('es-ES')}`,
          caption: '',
        },
      };

      // Agregar al final de los bloques
      setBlocks([...blocks, newBlock]);
      setHasUnsavedChanges(true);
      
      toast({
        title: 'Imagen agregada',
        description: 'La imagen se subió y agregó correctamente',
      });
    } catch (error) {
      console.error('Error uploading pasted image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen pegada',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true);
      const supabase = supabaseBrowserClient;

      let imagenUrl = post?.imagen_portada_url;

      if (imageFile) {
        const validation = validateImageFile(imageFile);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        const existingUrl = post?.imagen_portada_url || undefined;
        imagenUrl = await uploadToCloudinary(imageFile, 'blog', existingUrl);
      }

      const slug =
        data.slug ||
        titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const tagsArray = data.tags
        ? data.tags.split(',').map((tag) => tag.trim())
        : [];

      // Calcular status basado en publicado y scheduled_for
      let status = 'draft';
      if (data.publicado) {
        status = 'published';
      } else if (scheduledFor && new Date(scheduledFor) > new Date()) {
        status = 'scheduled';
      }

      const postData = {
        titulo: data.titulo,
        slug,
        descripcion_corta: data.descripcion_corta || null,
        contenido: '',
        contenido_bloques: blocks,
        imagen_portada_url: imagenUrl || null,
        imagen_portada_alt: data.imagen_portada_alt || null,
        autor: data.autor || null,
        autor_id: data.autor_id || null,
        publicado: data.publicado,
        status,
        scheduled_for: scheduledFor,
        tags: tagsArray.length > 0 ? tagsArray : null,
        fecha_publicacion: post?.fecha_publicacion || new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };

      if (post) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;

        // Actualizar categorías
        await updatePostCategories(post.id, selectedCategories);

        setHasUnsavedChanges(false);
        setLastSaved(new Date());

        toast({
          title: 'Guardado',
          description: 'Los cambios se guardaron correctamente',
        });
      } else {
        const { data: newPost, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;

        // Guardar categorías del nuevo post
        if (newPost) {
          await updatePostCategories(newPost.id, selectedCategories);
        }

        setHasUnsavedChanges(false);
        setLastSaved(new Date());

        toast({
          title: 'Guardado',
          description: 'Post creado correctamente',
        });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el post',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <EditorOnboarding />
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold truncate max-w-md">
                {titulo || 'Nuevo Post'}
              </h2>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              {hasUnsavedChanges && (
                <span className="text-yellow-600 text-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse" />
                  Sin guardar
                </span>
              )}
              {lastSaved && !hasUnsavedChanges && (
                <span className="text-muted-foreground text-xs">
                  Guardado {formatTimeAgo(lastSaved)}
                </span>
              )}
              {showClipboardIndicator && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const clipboardData = getFromClipboard();
                    if (clipboardData) {
                      const newBlocks = cloneBlocksWithNewIds(clipboardData.blocks);
                      setBlocks([...blocks, ...newBlocks]);
                      toast({
                        title: 'Bloques pegados',
                        description: `${newBlocks.length} bloque(s) agregado(s) desde el clipboard`,
                      });
                    }
                  }}
                  className="text-xs gap-2"
                >
                  <Clipboard className="h-3 w-3" />
                  Pegar desde clipboard ({formatClipboardAge(getFromClipboard()?.timestamp ? Date.now() - getFromClipboard()!.timestamp : 0)})
                </Button>
              )}
              <TemplateGallery onSelectTemplate={(templateBlocks) => {
                setBlocks(templateBlocks);
                setHasUnsavedChanges(true);
                toast({
                  title: 'Plantilla cargada',
                  description: 'Puedes personalizarla ahora',
                });
              }} />
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (blocks.length === 0) {
                    toast({
                      title: 'Error',
                      description: 'Agrega bloques antes de guardar como template',
                      variant: 'destructive',
                    });
                    return;
                  }
                  const nombre = prompt('Nombre del template:');
                  if (!nombre) return;
                  const descripcion = prompt('Descripción (opcional):') || '';
                  const { error } = await supabaseBrowserClient
                    .from('blog_templates')
                    .insert([{
                      nombre,
                      descripcion,
                      categoria: 'guia',
                      thumbnail_url: 'file-text',
                      bloques: blocks,
                      es_predefinida: false,
                    }]);
                  if (!error) {
                    toast({
                      title: 'Template guardado',
                      description: 'Ahora puedes usarlo en otros posts',
                    });
                  } else {
                    toast({
                      title: 'Error',
                      description: 'No se pudo guardar el template',
                      variant: 'destructive',
                    });
                  }
                }}
                className="hidden md:flex gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar como Template
              </Button>

              <SpellCheckDialog blocks={blocks} onApplyCorrection={(blockId, newContent) => {
                const block = blocks.find(b => b.id === blockId);
                if (block && block.type === 'text') {
                  const updatedBlock = { ...block, data: { ...block.data, content: newContent } };
                  setBlocks(blocks.map(b => b.id === blockId ? updatedBlock : b));
                  setHasUnsavedChanges(true);
                }
              }} />
              <EditorHelp />

              <Button
                variant={activeTab === 'preview' ? 'default' : 'outline'}
                onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
                className="gap-2"
              >
                {activeTab === 'preview' ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Editor
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>

              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="edit" className="h-full m-0">
              <ImagePasteHandler 
                onImagePasted={handleImagePasted}
                enabled={activeTab === 'edit'}
              />
              <DragDropEditor 
                blocks={blocks} 
                onChange={setBlocks}
                postSettings={{
                  titulo,
                  slug,
                  descripcionCorta: descripcion_corta,
                  autorId: autor_id,
                  autores,
                  publicado,
                  fechaPublicacion: new Date(post?.fecha_publicacion || Date.now()),
                  scheduledFor,
                  tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                  categories: selectedCategories,
                  imagenPortadaUrl: post?.imagen_portada_url || undefined,
                  imagenPortadaAlt: watch('imagen_portada_alt'),
                  imageFile,
                  onTituloChange: (newTitulo) => {
                    setValue('titulo', newTitulo);
                    setHasUnsavedChanges(true);
                  },
                  onSlugChange: (newSlug) => {
                    setValue('slug', newSlug);
                    setHasUnsavedChanges(true);
                  },
                  onDescripcionChange: (desc) => {
                    setValue('descripcion_corta', desc);
                    setHasUnsavedChanges(true);
                  },
                  onAutorChange: (newAutorId) => {
                    setValue('autor_id', newAutorId);
                    setHasUnsavedChanges(true);
                  },
                  onPublicadoChange: (pub) => {
                    setValue('publicado', pub);
                    setHasUnsavedChanges(true);
                  },
                  onFechaChange: (fecha) => {
                    // Actualizar fecha de publicación
                    setHasUnsavedChanges(true);
                  },
                  onScheduledForChange: (date) => {
                    setScheduledFor(date);
                    setHasUnsavedChanges(true);
                  },
                  onTagsChange: (newTags) => {
                    setValue('tags', newTags.join(', '));
                    setHasUnsavedChanges(true);
                  },
                  onCategoriesChange: (cats) => {
                    setSelectedCategories(cats);
                    setHasUnsavedChanges(true);
                  },
                  onImageFileChange: (file) => {
                    setImageFile(file);
                    setHasUnsavedChanges(true);
                  },
                  onImagenAltChange: (alt) => {
                    setValue('imagen_portada_alt', alt);
                    setHasUnsavedChanges(true);
                  },
                }}
              />
            </TabsContent>

            <TabsContent value="preview" className="h-full m-0">
              <ResponsivePreview
                blocks={blocks}
                title={titulo}
                description={descripcion_corta}
                authorName={selectedAutorNombre}
                coverImage={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : post?.imagen_portada_url || undefined
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
