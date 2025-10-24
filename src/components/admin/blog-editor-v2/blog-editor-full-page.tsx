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
import { BlockRenderer } from '@/components/blog/block-renderer';
import { BlogPost, Autor, Block } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';
import { ImageManager } from '@/lib/image-manager';

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
  const { toast } = useToast();
  
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      titulo: post?.titulo || '',
      slug: post?.slug || '',
      descripcion_corta: post?.descripcion_corta || '',
      autor: post?.autor || '',
      autor_id: post?.autor_id || null,
      publicado: post?.publicado || false,
      tags: post?.tags?.join(', ') || '',
    },
  });

  const titulo = watch('titulo');
  const descripcion_corta = watch('descripcion_corta');
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
    fetchAutores();
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

      const postData = {
        titulo: data.titulo,
        slug,
        descripcion_corta: data.descripcion_corta || null,
        contenido: '',
        contenido_bloques: blocks,
        imagen_portada_url: imagenUrl || null,
        autor: data.autor || null,
        autor_id: data.autor_id || null,
        publicado: data.publicado,
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

        setHasUnsavedChanges(false);
        setLastSaved(new Date());

        toast({
          title: 'Guardado',
          description: 'Los cambios se guardaron correctamente',
        });
      } else {
        const { error } = await supabase.from('blog_posts').insert([postData]);

        if (error) throw error;

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
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <Input
                  {...register('titulo', { required: true })}
                  placeholder="Título del post..."
                  className="text-lg font-semibold border-0 focus-visible:ring-0 px-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
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
              <EditorHelp />
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Configuración del Post</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        {...register('slug')}
                        placeholder="se-genera-automaticamente"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descripcion_corta">Descripción Corta</Label>
                      <Textarea
                        id="descripcion_corta"
                        {...register('descripcion_corta')}
                        placeholder="Resumen breve..."
                        rows={3}
                        maxLength={300}
                      />
                      <p className="text-xs text-muted-foreground">
                        {watch('descripcion_corta')?.length || 0}/300
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="autor_id">Autor</Label>
                      <Select
                        value={autor_id?.toString() || ''}
                        onValueChange={(value) =>
                          setValue('autor_id', value ? parseInt(value) : null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar">
                            {autor_id && (
                              <div className="flex items-center gap-2">
                                {autores.find((a) => a.id === autor_id)
                                  ?.avatar_url ? (
                                  <img
                                    src={
                                      autores.find((a) => a.id === autor_id)
                                        ?.avatar_url || ''
                                    }
                                    alt=""
                                    className="w-5 h-5 rounded-full"
                                  />
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                                <span>{selectedAutorNombre}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {autores.map((autor) => (
                            <SelectItem key={autor.id} value={autor.id.toString()}>
                              <div className="flex items-center gap-2">
                                {autor.avatar_url ? (
                                  <img
                                    src={autor.avatar_url}
                                    alt={autor.nombre}
                                    className="w-5 h-5 rounded-full"
                                  />
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                                <span>{autor.nombre}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Imagen de Portada</Label>
                      {(post?.imagen_portada_url || imageFile) && (
                        <div className="relative group">
                          <img
                            src={
                              imageFile
                                ? URL.createObjectURL(imageFile)
                                : post?.imagen_portada_url || ''
                            }
                            alt="Portada"
                            className="w-full h-32 rounded object-cover"
                          />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center rounded">
                            <div className="text-white text-center">
                              <Upload className="h-6 w-6 mx-auto mb-1" />
                              <span className="text-xs">Reemplazar</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                              className="hidden"
                              aria-label="Reemplazar imagen de portada"
                            />
                          </label>
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg hover:bg-accent transition-colors">
                          <Upload className="h-4 w-4" />
                          <span className="text-sm">
                            {imageFile || post?.imagen_portada_url
                              ? 'Cambiar imagen'
                              : 'Subir imagen'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="hidden"
                          aria-label="Subir imagen de portada"
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        {...register('tags')}
                        placeholder="diseño, tutorial, recursos"
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border">
                <Switch
                  id="publicado"
                  checked={watch('publicado')}
                  onCheckedChange={(checked) => setValue('publicado', checked)}
                />
                <Label htmlFor="publicado" className="cursor-pointer text-sm">
                  {watch('publicado') ? (
                    <span className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Publicado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-yellow-600">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Borrador
                    </span>
                  )}
                </Label>
              </div>

              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="px-6 pb-3">
            <EditorStats blocks={blocks} title={titulo} />
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}
            className="px-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="edit" className="gap-2">
                <Edit className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Vista Previa
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="edit" className="h-full m-0">
              <DragDropEditor blocks={blocks} onChange={setBlocks} />
            </TabsContent>

            <TabsContent value="preview" className="h-full m-0 overflow-y-auto p-8">
              <Card className="p-8 max-w-4xl mx-auto">
                {(imageFile || post?.imagen_portada_url) && (
                  <img
                    src={
                      imageFile
                        ? URL.createObjectURL(imageFile)
                        : post?.imagen_portada_url || ''
                    }
                    alt="Portada"
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold">
                    {titulo || 'Título del Post'}
                  </h1>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
                    <span>Por {selectedAutorNombre || 'Autor'}</span>
                    <span>•</span>
                    <span>
                      {new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {descripcion_corta && (
                    <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
                      {descripcion_corta}
                    </p>
                  )}

                  <div className="prose prose-sm dark:prose-invert max-w-none pt-8">
                    <BlockRenderer blocks={blocks} />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
