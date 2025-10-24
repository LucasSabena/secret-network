// FILE: src/components/admin/blog-editor-v2/blog-form-v2.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Upload,
  Loader2,
  Eye,
  Edit,
  Sparkles,
  Pencil,
  CheckCircle,
  AlertTriangle,
  Save,
  Rocket,
  User,
  Plus,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface BlogFormV2Props {
  post: BlogPost | null;
  onClose: () => void;
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

export default function BlogFormV2({ post, onClose }: BlogFormV2Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [blocks, setBlocks] = useState<Block[]>(post?.contenido_bloques || []);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [autores, setAutores] = useState<Autor[]>([]);
  const [selectedAutorNombre, setSelectedAutorNombre] = useState<string>('');
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

  // Cargar autores
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

  // Actualizar nombre del autor
  useEffect(() => {
    if (autor_id) {
      const autor = autores.find((a) => a.id === autor_id);
      if (autor) {
        setSelectedAutorNombre(autor.nombre);
        setValue('autor', autor.nombre);
      }
    }
  }, [autor_id, autores, setValue]);

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
        imagenUrl = await uploadToCloudinary(imageFile, 'blog');
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

        toast({
          title: 'Éxito',
          description: 'Post actualizado correctamente',
        });
      } else {
        const { error } = await supabase.from('blog_posts').insert([postData]);

        if (error) throw error;

        toast({
          title: 'Éxito',
          description: 'Post creado correctamente',
        });
      }

      onClose();
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
      <Dialog
        open
        onOpenChange={() => {
          ImageManager.clearPendingImages();
          onClose();
        }}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {post ? (
                <>
                  <Pencil className="h-6 w-6 text-primary" />
                  Editar Post
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6 text-primary" />
                  Nuevo Post de Blog
                </>
              )}
            </DialogTitle>
            <EditorHelp />
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-6 border-b">
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
          </div>

          {/* TAB: EDITOR */}
          <TabsContent
            value="edit"
            className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Información básica (sticky top) */}
              <div className="px-6 py-4 border-b bg-muted/30 space-y-4">
                {/* Estadísticas */}
                <EditorStats blocks={blocks} title={titulo} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="titulo">Título del Post *</Label>
                    <Input
                      id="titulo"
                      {...register('titulo', { required: true })}
                      placeholder="Ej: Las 30 Mejores Páginas 404"
                      className="text-lg"
                    />
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
                        <SelectValue placeholder="Seleccionar autor">
                          {autor_id ? (
                            <div className="flex items-center gap-2">
                              {autores.find((a) => a.id === autor_id)
                                ?.avatar_url ? (
                                <img
                                  src={
                                    autores.find((a) => a.id === autor_id)
                                      ?.avatar_url || ''
                                  }
                                  alt=""
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span>{selectedAutorNombre}</span>
                            </div>
                          ) : (
                            'Seleccionar autor'
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
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span>{autor.nombre}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Editor drag-and-drop */}
              <div className="flex-1 overflow-hidden">
                <DragDropEditor blocks={blocks} onChange={setBlocks} />
              </div>

              {/* Footer con acciones (sticky bottom) */}
              <div className="px-6 py-4 border-t bg-background flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="publicado"
                      checked={watch('publicado')}
                      onCheckedChange={(checked) => setValue('publicado', checked)}
                    />
                    <Label htmlFor="publicado" className="cursor-pointer text-sm">
                      {watch('publicado') ? (
                        <span className="flex items-center gap-1.5 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Publicado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-yellow-600">
                          <AlertTriangle className="w-4 h-4" />
                          Borrador
                        </span>
                      )}
                    </Label>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Abrir modal de configuración adicional
                      const modal = document.getElementById('config-modal');
                      if (modal) modal.classList.toggle('hidden');
                    }}
                  >
                    Configuración adicional
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
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
                        {post ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Actualizar
                          </>
                        ) : (
                          <>
                            <Rocket className="mr-2 h-4 w-4" />
                            Publicar
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          {/* TAB: PREVIEW */}
          <TabsContent
            value="preview"
            className="flex-1 overflow-y-auto m-0 p-8"
          >
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

        {/* Modal de configuración adicional */}
        <ConfigModal
          register={register}
          watch={watch}
          imageFile={imageFile}
          setImageFile={setImageFile}
          post={post}
        />
      </DialogContent>
    </Dialog>
    </>
  );
}

// Modal de configuración adicional
function ConfigModal({
  register,
  watch,
  imageFile,
  setImageFile,
  post,
}: any) {
  return (
    <div
      id="config-modal"
      className="hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.classList.add('hidden');
        }
      }}
    >
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Configuración Adicional</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              document.getElementById('config-modal')?.classList.add('hidden')
            }
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="Se genera automáticamente si se deja vacío"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion_corta">Descripción Corta</Label>
            <Textarea
              id="descripcion_corta"
              {...register('descripcion_corta')}
              placeholder="Un resumen breve que aparecerá en la lista de posts"
              rows={3}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground">
              {watch('descripcion_corta')?.length || 0}/300 caracteres
            </p>
          </div>

          <div className="space-y-3">
            <Label>Imagen de Portada</Label>
            {(post?.imagen_portada_url || imageFile) && (
              <div className="relative inline-block">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : post?.imagen_portada_url || ''
                  }
                  alt="Preview"
                  className="w-full max-w-md h-48 rounded-lg object-cover border"
                />
              </div>
            )}
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg hover:bg-accent hover:border-primary transition-colors">
                <Upload className="h-5 w-5" />
                <div>
                  <span className="text-sm font-medium">
                    {imageFile || post?.imagen_portada_url
                      ? 'Cambiar imagen'
                      : 'Subir imagen'}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Recomendado: 1200x630px
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separados por comas)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="diseño, tutorial, recursos, IA"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
