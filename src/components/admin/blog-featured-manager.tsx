'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, GripVertical, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BlogPost {
  id: number;
  titulo: string;
  slug: string;
  fecha_publicacion: string;
  imagen_portada_url: string | null;
  is_featured_in_blog: boolean;
  blog_featured_order: number;
}

interface SortablePostItemProps {
  post: BlogPost;
  onToggleFeatured: (postId: number, isFeatured: boolean) => void;
}

function SortablePostItem({ post, onToggleFeatured }: SortablePostItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {post.imagen_portada_url && (
        <img
          src={post.imagen_portada_url}
          alt={post.titulo}
          className="w-16 h-16 object-cover rounded"
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{post.titulo}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(post.fecha_publicacion).toLocaleDateString('es-ES')}
        </p>
      </div>

      <Button
        type="button"
        variant={post.is_featured_in_blog ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggleFeatured(post.id, !post.is_featured_in_blog)}
      >
        <Star className={`h-4 w-4 ${post.is_featured_in_blog ? 'fill-current' : ''}`} />
      </Button>
    </div>
  );
}

export function BlogFeaturedManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = supabaseBrowserClient;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, titulo, slug, fecha_publicacion, imagen_portada_url, is_featured_in_blog, blog_featured_order')
        .eq('publicado', true)
        .order('fecha_publicacion', { ascending: false });

      if (error) throw error;

      const allPosts = data || [];
      const featured = allPosts
        .filter((p: BlogPost) => p.is_featured_in_blog)
        .sort((a: BlogPost, b: BlogPost) => a.blog_featured_order - b.blog_featured_order);
      
      setPosts(allPosts);
      setFeaturedPosts(featured);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Error al cargar los posts');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFeatured(postId: number, isFeatured: boolean) {
    if (isFeatured && featuredPosts.length >= 5) {
      toast.error('Máximo 5 posts destacados permitidos');
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (isFeatured) {
        // Agregar a destacados
        const newOrder = featuredPosts.length;
        const { error } = await supabase
          .from('blog_posts')
          .update({
            is_featured_in_blog: true,
            blog_featured_order: newOrder,
          })
          .eq('id', postId);

        if (error) throw error;

        const updatedPost = { ...post, is_featured_in_blog: true, blog_featured_order: newOrder };
        setFeaturedPosts([...featuredPosts, updatedPost]);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        toast.success('Post agregado a destacados');
      } else {
        // Quitar de destacados
        const { error } = await supabase
          .from('blog_posts')
          .update({
            is_featured_in_blog: false,
            blog_featured_order: 0,
          })
          .eq('id', postId);

        if (error) throw error;

        const newFeatured = featuredPosts.filter(p => p.id !== postId);
        // Reordenar los restantes
        await reorderFeatured(newFeatured);
        
        const updatedPost = { ...post, is_featured_in_blog: false, blog_featured_order: 0 };
        setFeaturedPosts(newFeatured);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        toast.success('Post quitado de destacados');
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Error al actualizar el post');
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = featuredPosts.findIndex(p => p.id === active.id);
    const newIndex = featuredPosts.findIndex(p => p.id === over.id);

    const newOrder = arrayMove(featuredPosts, oldIndex, newIndex);
    setFeaturedPosts(newOrder);

    // Guardar nuevo orden
    await reorderFeatured(newOrder);
  }

  async function reorderFeatured(orderedPosts: BlogPost[]) {
    try {
      setSaving(true);
      const updates = orderedPosts.map((post, index) =>
        supabase
          .from('blog_posts')
          .update({ blog_featured_order: index })
          .eq('id', post.id)
      );

      await Promise.all(updates);
      toast.success('Orden actualizado');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Error al guardar el orden');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Botón de regreso */}
      <Button 
        variant="ghost" 
        onClick={() => router.push('/admin')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Blogs
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Posts Destacados en Blog</CardTitle>
          <CardDescription>
            Selecciona hasta 5 posts para destacar en el carrusel principal del blog. Arrastra para reordenar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {featuredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay posts destacados aún</p>
              <p className="text-sm mt-1">Haz clic en la estrella de un post para destacarlo</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={featuredPosts.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {featuredPosts.map((post) => (
                    <SortablePostItem
                      key={post.id}
                      post={post}
                      onToggleFeatured={handleToggleFeatured}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            {featuredPosts.length}/5 posts destacados
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Posts</CardTitle>
          <CardDescription>
            Haz clic en la estrella para destacar un post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {posts
              .filter(p => !p.is_featured_in_blog)
              .map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {post.imagen_portada_url && (
                    <img
                      src={post.imagen_portada_url}
                      alt={post.titulo}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.fecha_publicacion).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFeatured(post.id, true)}
                    disabled={featuredPosts.length >= 5}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
