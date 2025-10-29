'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Layers, Plus, Edit, Trash2, Eye, Sparkles, ExternalLink, Star, UserPlus, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { CreateSerieDialog, EditSerieDialog, AddPostDialog, SERIE_COLORS } from './blog-series-dialogs';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BlogPost {
  id: number;
  titulo: string;
  slug: string;
  fecha_publicacion: string;
  tags: string[];
  is_featured: boolean;
  serie_order?: number;
}

interface Serie {
  tag: string;
  nombre: string;
  slug: string;
  color: string;
  descripcion?: string;
  count: number;
  posts: BlogPost[];
  featuredPostId?: number;
}

// Componente sortable para cada post
function SortablePostItem({
  post,
  index,
  serieTag,
  onSetFeatured,
  onRemove,
}: {
  post: BlogPost;
  index: number;
  serieTag: string;
  onSetFeatured: (postId: number) => void;
  onRemove: (postId: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
          type="button"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          #{index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{post.titulo}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(post.fecha_publicacion).toLocaleDateString('es-ES')}
          </p>
        </div>
        {post.is_featured && (
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Destacado
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSetFeatured(post.id)}
          title={post.is_featured ? 'Ya es destacado' : 'Marcar como destacado'}
          type="button"
        >
          <Star className={`h-4 w-4 ${post.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
            <Eye className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(post.id)}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function BlogSeriesManager() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSerie, setEditingSerie] = useState<Serie | null>(null);
  const [addingToSerie, setAddingToSerie] = useState<string | null>(null);
  const [availablePosts, setAvailablePosts] = useState<BlogPost[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadSeries();
    loadAvailablePosts();
  }, []);

  async function loadSeries() {
    try {
      setLoading(true);
      const supabase = supabaseBrowserClient;

      // Obtener metadatos de series guardadas
      const { data: savedSeries } = await supabase
        .from('blog_series')
        .select('*');

      const seriesMetadata = new Map(
        savedSeries?.map(s => [s.tag, s]) || []
      );

      // Obtener todos los posts con tags
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, titulo, slug, fecha_publicacion, tags, is_featured, serie_order')
        .eq('publicado', true)
        .not('tags', 'is', null);

      if (error) throw error;

      // Extraer series de los tags
      const seriesMap = new Map<string, BlogPost[]>();
      posts?.forEach((post: any) => {
        post.tags?.forEach((tag: string) => {
          if (tag.split(' ').length >= 2 || /\d{4}/.test(tag)) {
            if (!seriesMap.has(tag)) {
              seriesMap.set(tag, []);
            }
            seriesMap.get(tag)!.push(post);
          }
        });
      });

      // Convertir a array y filtrar series con 2+ posts
      const seriesArray = Array.from(seriesMap.entries())
        .filter(([_, posts]) => posts.length >= 2)
        .map(([tag, posts]) => {
          // Ordenar por serie_order si existe, sino por fecha
          const sortedPosts = posts.sort((a, b) => {
            if (a.serie_order !== undefined && b.serie_order !== undefined) {
              return a.serie_order - b.serie_order;
            }
            return new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime();
          });
          const featuredPost = sortedPosts.find(p => p.is_featured);
          
          // Usar metadatos guardados si existen
          const metadata = seriesMetadata.get(tag);
          
          return {
            tag,
            nombre: metadata?.nombre || tag,
            slug: metadata?.slug || createSlug(tag),
            color: metadata?.color || getColorForSeries(tag),
            descripcion: metadata?.descripcion,
            count: posts.length,
            posts: sortedPosts,
            featuredPostId: featuredPost?.id,
          };
        })
        .sort((a, b) => b.count - a.count);

      setSeries(seriesArray);
    } catch (error) {
      console.error('Error loading series:', error);
      toast.error('Error al cargar las series');
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailablePosts() {
    try {
      const supabase = supabaseBrowserClient;
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, titulo, slug, fecha_publicacion, tags, is_featured')
        .eq('publicado', true)
        .order('fecha_publicacion', { ascending: false });

      if (error) throw error;
      setAvailablePosts(posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  function getColorForSeries(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return SERIE_COLORS[Math.abs(hash) % SERIE_COLORS.length].value;
  }

  function createSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleCreateSerie(data: { nombre: string; slug: string; color: string; descripcion: string }) {
    try {
      // Por ahora, las series se crean mediante tags
      // Esta función podría guardar metadatos en una tabla blog_series si existe
      toast.success('Serie creada. Agrega posts con el tag "' + data.nombre + '"');
      loadSeries();
    } catch (error) {
      console.error('Error creating serie:', error);
      toast.error('Error al crear la serie');
      throw error;
    }
  }

  async function handleEditSerie(data: { nombre: string; slug: string; color: string; descripcion: string }) {
    try {
      if (!editingSerie) return;

      const supabase = supabaseBrowserClient;
      
      // Guardar o actualizar en blog_series
      const { data: existingSerie } = await supabase
        .from('blog_series')
        .select('*')
        .eq('tag', editingSerie.tag)
        .single();

      if (existingSerie) {
        // Actualizar serie existente
        await supabase
          .from('blog_series')
          .update({
            nombre: data.nombre,
            slug: data.slug,
            color: data.color,
            descripcion: data.descripcion,
            tag: data.nombre, // Actualizar tag si cambió el nombre
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSerie.id);
      } else {
        // Crear nueva entrada
        await supabase
          .from('blog_series')
          .insert({
            nombre: data.nombre,
            slug: data.slug,
            tag: data.nombre,
            color: data.color,
            descripcion: data.descripcion,
          });
      }
      
      // Si el nombre cambió, actualizar el tag en todos los posts
      if (data.nombre !== editingSerie.tag) {
        for (const post of editingSerie.posts) {
          const newTags = post.tags.map(t => t === editingSerie.tag ? data.nombre : t);
          await supabase
            .from('blog_posts')
            .update({ tags: newTags })
            .eq('id', post.id);
        }
      }

      toast.success('Serie actualizada correctamente');
      setEditingSerie(null);
      loadSeries();
    } catch (error) {
      console.error('Error updating serie:', error);
      toast.error('Error al actualizar la serie');
      throw error;
    }
  }

  async function handleSetFeaturedPost(serieTag: string, postId: number) {
    try {
      const supabase = supabaseBrowserClient;
      const serie = series.find(s => s.tag === serieTag);
      if (!serie) return;

      // Desmarcar todos los posts de la serie
      for (const post of serie.posts) {
        if (post.is_featured) {
          await supabase
            .from('blog_posts')
            .update({ is_featured: false })
            .eq('id', post.id);
        }
      }

      // Marcar el nuevo post destacado
      await supabase
        .from('blog_posts')
        .update({ is_featured: true })
        .eq('id', postId);

      toast.success('Post destacado actualizado');
      loadSeries();
    } catch (error) {
      console.error('Error setting featured post:', error);
      toast.error('Error al actualizar el post destacado');
    }
  }

  async function handleAddPostToSerie(postId: number) {
    try {
      if (!addingToSerie) return;

      const supabase = supabaseBrowserClient;
      const post = availablePosts.find(p => p.id === postId);
      if (!post) return;

      // Agregar el tag de la serie al post
      const newTags = [...(post.tags || []), addingToSerie];
      await supabase
        .from('blog_posts')
        .update({ tags: newTags })
        .eq('id', postId);

      toast.success('Post agregado a la serie');
      setAddingToSerie(null);
      loadSeries();
      loadAvailablePosts();
    } catch (error) {
      console.error('Error adding post to serie:', error);
      toast.error('Error al agregar el post');
      throw error;
    }
  }

  async function handleRemovePostFromSerie(serieTag: string, postId: number) {
    try {
      const supabase = supabaseBrowserClient;
      
      const { data: post, error: fetchError } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;

      const newTags = (post as any).tags?.filter((t: string) => t !== serieTag) || [];

      await supabase
        .from('blog_posts')
        .update({ tags: newTags })
        .eq('id', postId);

      toast.success('Post removido de la serie');
      loadSeries();
    } catch (error) {
      console.error('Error removing post:', error);
      toast.error('Error al remover el post');
    }
  }

  async function handleDeleteSerie(serieTag: string) {
    if (!confirm(`¿Estás seguro de eliminar la serie "${serieTag}"? Esto removerá el tag de todos los posts.`)) {
      return;
    }

    try {
      const supabase = supabaseBrowserClient;
      const serie = series.find(s => s.tag === serieTag);
      
      if (!serie) return;

      for (const post of serie.posts) {
        const newTags = post.tags?.filter((t: string) => t !== serieTag) || [];
        await supabase
          .from('blog_posts')
          .update({ tags: newTags })
          .eq('id', post.id);
      }

      toast.success('Serie eliminada');
      loadSeries();
    } catch (error) {
      console.error('Error deleting serie:', error);
      toast.error('Error al eliminar la serie');
    }
  }

  async function handleDragEnd(event: DragEndEvent, serieTag: string) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const serie = series.find(s => s.tag === serieTag);
    if (!serie) return;

    const oldIndex = serie.posts.findIndex(p => p.id.toString() === active.id);
    const newIndex = serie.posts.findIndex(p => p.id.toString() === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reordenar localmente
    const newPosts = arrayMove(serie.posts, oldIndex, newIndex);
    
    // Actualizar estado local inmediatamente
    setSeries(series.map(s => 
      s.tag === serieTag ? { ...s, posts: newPosts } : s
    ));

    // Guardar orden en la base de datos
    try {
      const supabase = supabaseBrowserClient;
      
      // Actualizar el orden de todos los posts
      for (let i = 0; i < newPosts.length; i++) {
        await supabase
          .from('blog_posts')
          .update({ serie_order: i })
          .eq('id', newPosts[i].id);
      }

      toast.success('Orden actualizado');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar el orden');
      // Recargar para revertir cambios
      loadSeries();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Series de Blog</h2>
          <p className="text-muted-foreground">
            Gestiona las series de artículos relacionados
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Serie
        </Button>
      </div>

      {/* Stats */}
      {series.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Series</p>
                <p className="text-2xl font-bold">{series.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posts en Series</p>
                <p className="text-2xl font-bold">
                  {series.reduce((acc, s) => acc + s.count, 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Serie Más Grande</p>
                <p className="text-2xl font-bold">{series[0]?.count || 0} posts</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Lista de series */}
      {series.length === 0 ? (
        <Card className="p-12 text-center">
          <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No hay series todavía</h3>
          <p className="text-muted-foreground mb-6">
            Las series se crean automáticamente cuando 2 o más posts comparten un tag común
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primera Serie
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {series.map((serie) => (
            <Card key={serie.tag} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: serie.color }}
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{serie.tag}</h3>
                    <p className="text-sm text-muted-foreground">
                      {serie.count} artículos
                      {serie.featuredPostId && ' • 1 destacado'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingToSerie(serie.tag)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Post
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={`/blog/serie/${serie.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Serie
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSerie(serie)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSerie(serie.tag)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>

              {/* Lista de posts con drag & drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, serie.tag)}
              >
                <SortableContext
                  items={serie.posts.map(p => p.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {serie.posts.map((post, index) => (
                      <SortablePostItem
                        key={post.id}
                        post={post}
                        index={index}
                        serieTag={serie.tag}
                        onSetFeatured={(postId) => handleSetFeaturedPost(serie.tag, postId)}
                        onRemove={(postId) => handleRemovePostFromSerie(serie.tag, postId)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogos */}
      <CreateSerieDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleCreateSerie}
      />

      <EditSerieDialog
        open={editingSerie !== null}
        serie={editingSerie ? {
          nombre: editingSerie.nombre,
          slug: editingSerie.slug,
          color: editingSerie.color,
          descripcion: editingSerie.descripcion || '',
        } : null}
        onClose={() => setEditingSerie(null)}
        onSave={handleEditSerie}
      />

      <AddPostDialog
        open={addingToSerie !== null}
        serieTag={addingToSerie || ''}
        availablePosts={availablePosts.filter(post => 
          !post.tags?.includes(addingToSerie || '')
        )}
        onClose={() => setAddingToSerie(null)}
        onAdd={handleAddPostToSerie}
      />
    </div>
  );
}
