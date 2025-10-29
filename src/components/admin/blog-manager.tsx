'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Loader2, Copy, FileText, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BlogPost, Block } from '@/lib/types';
import { BlogQuickCreate } from './blog-editor-v2/blog-quick-create';
import { EditorAnnouncement } from './blog-editor-v2/editor-announcement';
import { TemplateGallery } from './blog-editor-v2/template-gallery';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { BlogCategoryBadge } from '@/components/blog/blog-category-badge';
import { BlogStatusBadge } from './blog-status-badge';
import { BlogPostStats } from './blog-post-stats';

export default function BlogManager() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [categories, setCategories] = useState<any[]>([]);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [postToDuplicate, setPostToDuplicate] = useState<BlogPost | null>(null);
  const [templateBlocks, setTemplateBlocks] = useState<Block[] | null>(null);
  const { toast } = useToast();

  // Cuando se selecciona un template, crear un post con esos bloques
  const handleTemplateSelect = async (blocks: Block[]) => {
    try {
      const supabase = supabaseBrowserClient;
      
      const newPost = {
        titulo: 'Nuevo Post desde Template',
        slug: `nuevo-post-${Date.now()}`,
        descripcion_corta: '',
        contenido: '',
        contenido_bloques: blocks,
        publicado: false,
        fecha_publicacion: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([newPost])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Post creado',
        description: 'Post creado desde template. Ahora puedes editarlo.',
      });

      // Redirigir al editor
      router.push(`/admin/blog/editor?id=${data.id}`);
    } catch (error) {
      console.error('Error creating post from template:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el post desde el template',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, []);

  useEffect(() => {
    let filtered = posts;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion_corta?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((p) => 
        selectedStatus === 'published' ? p.publicado : !p.publicado
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => 
        p.categories?.includes(parseInt(selectedCategory))
      );
    }
    
    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime();
        case 'date-asc':
          return new Date(a.fecha_publicacion).getTime() - new Date(b.fecha_publicacion).getTime();
        case 'title-asc':
          return a.titulo.localeCompare(b.titulo);
        case 'title-desc':
          return b.titulo.localeCompare(a.titulo);
        default:
          return 0;
      }
    });
    
    setFilteredPosts(filtered);
  }, [searchTerm, selectedStatus, selectedCategory, sortBy, posts]);

  async function loadCategories() {
    const { data } = await supabaseBrowserClient
      .from('blog_categories')
      .select('*')
      .order('orden');
    
    if (data) {
      setCategories(data);
    }
  }

  async function loadPosts() {
    try {
      setIsLoading(true);
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('fecha_publicacion', { ascending: false });

      if (error) throw error;
      
      // Cargar categorías de cada post
      const postsWithCategories = await Promise.all(
        (data || []).map(async (post) => {
          const { data: cats } = await supabase
            .from('blog_posts_categories')
            .select('category_id')
            .eq('post_id', post.id);
          
          return {
            ...post,
            categories: cats?.map(c => c.category_id) || [],
          };
        })
      );
      
      setPosts(postsWithCategories);
      setFilteredPosts(postsWithCategories);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los posts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete() {
    if (!postToDelete) return;

    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase.from('blog_posts').delete().eq('id', postToDelete);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Post eliminado correctamente',
      });
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el post',
        variant: 'destructive',
      });
    } finally {
      setPostToDelete(null);
    }
  }

  function handleNew() {
    setIsQuickCreateOpen(true);
  }

  function handleEdit(post: BlogPost) {
    router.push(`/admin/blog/editor?id=${post.id}`);
  }

  async function confirmDuplicate() {
    if (!postToDuplicate) return;

    try {
      const supabase = supabaseBrowserClient;
      
      // Crear slug único
      const baseSlug = postToDuplicate.slug;
      const timestamp = Date.now();
      const newSlug = `${baseSlug}-copia-${timestamp}`;

      // Crear objeto limpio solo con los campos necesarios
      const newPost = {
        titulo: `${postToDuplicate.titulo} (Copia)`,
        slug: newSlug,
        descripcion_corta: postToDuplicate.descripcion_corta,
        contenido: postToDuplicate.contenido || '',
        contenido_bloques: postToDuplicate.contenido_bloques || [],
        imagen_portada_url: postToDuplicate.imagen_portada_url,
        autor: postToDuplicate.autor,
        autor_id: postToDuplicate.autor_id,
        publicado: false, // Duplicados empiezan como borrador
        tags: postToDuplicate.tags,
        fecha_publicacion: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([newPost])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Post duplicado correctamente',
      });

      loadPosts();
      
      // Abrir el post duplicado
      router.push(`/admin/blog/editor?id=${data.id}`);
    } catch (error) {
      console.error('Error duplicating post:', error);
      toast({
        title: 'Error',
        description: 'No se pudo duplicar el post',
        variant: 'destructive',
      });
    } finally {
      setPostToDuplicate(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditorAnnouncement />
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleNew} className="gap-2 bg-pink-500 hover:bg-pink-600">
            <Plus className="h-4 w-4" />
            Nuevo Post
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => router.push('/admin/blog-series')}
          >
            <FileText className="h-4 w-4" />
            Series
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => router.push('/admin/blog-featured')}
          >
            <Star className="h-4 w-4" />
            Destacados
          </Button>
          <TemplateGallery onSelectTemplate={handleTemplateSelect}>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Desde Template
            </Button>
          </TemplateGallery>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => router.push('/admin/templates')}
          >
            <FileText className="h-4 w-4" />
            Templates
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => router.push('/admin/blog-categorias')}
          >
            <FileText className="h-4 w-4" />
            Categorías
          </Button>
        </div>
        </div>
        
        {/* Filtros */}
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="p-3 md:p-4 space-y-3">
            <div className="flex items-start gap-2 md:gap-3">
              {post.imagen_portada_url && (
                <img
                  src={post.imagen_portada_url}
                  alt={post.titulo}
                  className="w-20 h-14 md:w-24 md:h-16 rounded object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold line-clamp-2 flex-1 text-sm md:text-base">{post.titulo}</h3>
                  <span className="text-xs text-muted-foreground shrink-0">#{post.id}</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {new Date(post.fecha_publicacion).toLocaleDateString('es-ES')}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <BlogStatusBadge 
                    status={post.status || (post.publicado ? 'published' : 'draft')} 
                    scheduledFor={post.scheduled_for}
                  />
                  {post.categories && post.categories.length > 0 && (
                    <>
                      {categories
                        .filter(cat => post.categories?.includes(cat.id))
                        .slice(0, 2)
                        .map(cat => (
                          <BlogCategoryBadge key={cat.id} category={cat} size="sm" />
                        ))}
                      {post.categories.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{post.categories.length - 2}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {post.descripcion_corta && (
              <p className="text-xs md:text-sm line-clamp-2">{post.descripcion_corta}</p>
            )}
            
            {/* Estadísticas del post */}
            <BlogPostStats postId={post.id} />
            
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(post)}
                className="flex-1 gap-1 md:gap-2 text-xs md:text-sm"
              >
                <Edit className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const previewUrl = `/blog/${post.slug}?preview=true`;
                  window.open(previewUrl, '_blank');
                }}
                className="gap-1 md:gap-2"
                title="Vista previa"
              >
                <Eye className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPostToDuplicate(post)}
                className="gap-1 md:gap-2"
                title="Duplicar post"
              >
                <Copy className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPostToDelete(post.id)}
                className="gap-1 md:gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron posts</p>
        </div>
      )}

      <BlogQuickCreate
        open={isQuickCreateOpen}
        onClose={() => {
          setIsQuickCreateOpen(false);
          loadPosts();
        }}
      />

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={postToDelete !== null} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este post?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El post será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmación para duplicar */}
      <AlertDialog open={postToDuplicate !== null} onOpenChange={() => setPostToDuplicate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Duplicar este post?</AlertDialogTitle>
            <AlertDialogDescription>
              Se creará una copia del post como borrador. Podrás editarlo antes de publicarlo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDuplicate}>
              Duplicar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
