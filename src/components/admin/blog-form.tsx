'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Loader2, Eye, Edit, Sparkles, Pencil, Image as ImageIcon, CheckCircle, AlertTriangle, Save, Rocket, User, Plus } from 'lucide-react';
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
import RichTextEditor from './rich-text-editor';
import BlogStats from './blog-stats';
import { BlogPost, Autor } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';

interface BlogFormProps {
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

export default function BlogForm({ post, onClose }: BlogFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [contenido, setContenido] = useState(post?.contenido || '');
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

  // Cargar autores desde Supabase
  useEffect(() => {
    const fetchAutores = async () => {
      const { data, error } = await supabaseBrowserClient
        .from('autores')
        .select('*')
        .order('nombre', { ascending: true });

      if (!error && data) {
        setAutores(data);
        // Si estamos editando y hay autor_id, buscar el nombre
        if (post?.autor_id) {
          const autorActual = data.find(a => a.id === post.autor_id);
          if (autorActual) {
            setSelectedAutorNombre(autorActual.nombre);
          }
        }
      }
    };
    fetchAutores();
  }, [post]);

  // Actualizar nombre del autor seleccionado para el preview
  useEffect(() => {
    if (autor_id) {
      const autor = autores.find(a => a.id === autor_id);
      if (autor) {
        setSelectedAutorNombre(autor.nombre);
        // También actualizar el campo autor (legacy) para compatibilidad
        setValue('autor', autor.nombre);
      }
    }
  }, [autor_id, autores, setValue]);

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true);
      const supabase = supabaseBrowserClient;

      let imagenUrl = post?.imagen_portada_url;

      // Validate and upload image if changed
      if (imageFile) {
        const validation = validateImageFile(imageFile);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        imagenUrl = await uploadToCloudinary(imageFile, 'blog');
      }

      // Generate slug from title if not provided
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
        contenido: contenido,
        imagen_portada_url: imagenUrl || null,
        autor: data.autor || null, // Legacy field (mantener por compatibilidad)
        autor_id: data.autor_id || null, // Nuevo campo relacional
        publicado: data.publicado,
        tags: tagsArray.length > 0 ? tagsArray : null,
        fecha_publicacion: post?.fecha_publicacion || new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };

      if (post) {
        // Update existing
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
        // Create new
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
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
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
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Vista Previa
            </TabsTrigger>
          </TabsList>

          {/* TAB: EDITOR */}
          <TabsContent value="edit" className="flex-1 overflow-y-auto pr-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="titulo">Título del Post *</Label>
                    <Input
                      id="titulo"
                      {...register('titulo', { required: true })}
                      placeholder="Ej: Las 30 Mejores Páginas 404"
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="Se genera automáticamente si se deja vacío"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="autor_id">Autor</Label>
                    <Select
                      value={autor_id?.toString() || ''}
                      onValueChange={(value) => setValue('autor_id', value ? parseInt(value) : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar autor">
                          {autor_id ? (
                            <div className="flex items-center gap-2">
                              {autores.find(a => a.id === autor_id)?.avatar_url ? (
                                <img
                                  src={autores.find(a => a.id === autor_id)?.avatar_url || ''}
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
                        {autores.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No hay autores disponibles
                          </div>
                        ) : (
                          autores.map((autor) => (
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
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Crea nuevos autores en la pestaña "Autores"
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Resumen</h3>
                <div className="space-y-2">
                  <Label htmlFor="descripcion_corta">Descripción Corta</Label>
                  <Textarea
                    id="descripcion_corta"
                    {...register('descripcion_corta')}
                    placeholder="Un resumen breve que aparecerá en la lista de posts y en redes sociales"
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground">
                    {watch('descripcion_corta')?.length || 0}/300 caracteres
                  </p>
                </div>
              </Card>

              <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Contenido Principal *</h3>
                <div className="space-y-2">
                  <RichTextEditor
                    content={contenido}
                    onChange={setContenido}
                    placeholder="Escribe el contenido completo del artículo aquí. Puedes insertar imágenes, enlaces, código y más..."
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Usa el botón de imagen en el toolbar para insertar imágenes directamente en el contenido
                  </p>
                  <BlogStats content={contenido} />
                </div>
              </Card>

              <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Imagen de Portada</h3>
                <div className="space-y-3">
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
                          {imageFile || post?.imagen_portada_url ? 'Cambiar imagen' : 'Subir imagen de portada'}
                        </span>
                        <p className="text-xs text-muted-foreground">Recomendado: 1200x630px (JPG o PNG, máx 5MB)</p>
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
              </Card>

              <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Metadatos</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separados por comas)</Label>
                    <Input
                      id="tags"
                      {...register('tags')}
                      placeholder="diseño, tutorial, recursos, IA"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ej: diseño web, 404, inspiración, UI/UX
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="publicado"
                      checked={watch('publicado')}
                      onCheckedChange={(checked) => setValue('publicado', checked)}
                    />
                    <Label htmlFor="publicado" className="cursor-pointer">
                      <span className="font-medium">Publicar inmediatamente</span>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        {watch('publicado') ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            El post será visible públicamente
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                            El post quedará como borrador
                          </>
                        )}
                      </p>
                    </Label>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3 justify-end pt-4 border-t sticky bottom-0 bg-background">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
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
                          Actualizar Post
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Publicar Post
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB: PREVIEW */}
          <TabsContent value="preview" className="flex-1 overflow-y-auto pr-2">
            <Card className="p-8 max-w-4xl mx-auto">
              {/* Preview Header */}
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
                {/* Title */}
                <h1 className="text-4xl font-bold">
                  {titulo || 'Título del Post'}
                </h1>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
                  <span>Por {selectedAutorNombre || watch('autor') || 'Autor'}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {watch('publicado') && (
                    <>
                      <span>•</span>
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Publicado
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                {descripcion_corta && (
                  <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
                    {descripcion_corta}
                  </p>
                )}

                {/* Tags */}
                {watch('tags') && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {watch('tags').split(',').map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose prose-sm dark:prose-invert max-w-none pt-8"
                  dangerouslySetInnerHTML={{ __html: contenido || '<p class="text-muted-foreground">El contenido aparecerá aquí...</p>' }}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
