'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, SortAsc, Loader2, Upload as UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { BlogPost } from '@/lib/types';
import { BlogCardModern } from './blog-card-modern';
import { BlogQuickCreate } from './blog-editor-v2/blog-quick-create';
import { BlogJsonImporter } from './blog-json-importer';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { exportToJSON, exportToMarkdown } from '@/lib/blog-export';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';

export default function BlogManagerV2() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isJsonImporterOpen, setIsJsonImporterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, selectedStatus, sortBy]);

  async function loadPosts() {
    try {
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('fecha_publicacion', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
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

  function filterAndSortPosts() {
    let filtered = [...posts];

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.titulo.toLowerCase().includes(search) ||
          post.descripcion_corta?.toLowerCase().includes(search) ||
          post.slug.toLowerCase().includes(search) ||
          post.autor?.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((post) =>
        selectedStatus === 'published' ? post.publicado : !post.publicado
      );
    }

    // Sort
    filtered.sort((a, b) => {
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
  }

  async function handleDelete(id: number) {
    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);

      if (error) throw error;

      setPosts(posts.filter((p) => p.id !== id));
      toast({
        title: 'Post eliminado',
        description: 'El post se eliminó correctamente',
      });
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

  async function handleDuplicate(post: BlogPost) {
    try {
      const supabase = supabaseBrowserClient;
      const newPost = {
        ...post,
        id: undefined,
        titulo: `${post.titulo} (Copia)`,
        slug: `${post.slug}-copia-${Date.now()}`,
        publicado: false,
        fecha_publicacion: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([newPost])
        .select()
        .single();

      if (error) throw error;

      setPosts([data, ...posts]);
      toast({
        title: 'Post duplicado',
        description: 'El post se duplicó correctamente',
      });
    } catch (error) {
      console.error('Error duplicating post:', error);
      toast({
        title: 'Error',
        description: 'No se pudo duplicar el post',
        variant: 'destructive',
      });
    }
  }

  async function handleUpdateStatus(id: number, published: boolean) {
    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase
        .from('blog_posts')
        .update({ publicado: published })
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.map((p) => (p.id === id ? { ...p, publicado: published } : p)));
      toast({
        title: 'Estado actualizado',
        description: `Post ${published ? 'publicado' : 'guardado como borrador'}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    }
  }

  async function handleUpdateTitle(id: number, title: string) {
    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase
        .from('blog_posts')
        .update({ titulo: title })
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.map((p) => (p.id === id ? { ...p, titulo: title } : p)));
      toast({
        title: 'Título actualizado',
        description: 'El título se guardó correctamente',
      });
    } catch (error) {
      console.error('Error updating title:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el título',
        variant: 'destructive',
      });
    }
  }

  async function handleUpdateDescription(id: number, description: string) {
    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase
        .from('blog_posts')
        .update({ descripcion_corta: description })
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.map((p) => (p.id === id ? { ...p, descripcion_corta: description } : p)));
      toast({
        title: 'Descripción actualizada',
        description: 'La descripción se guardó correctamente',
      });
    } catch (error) {
      console.error('Error updating description:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la descripción',
        variant: 'destructive',
      });
    }
  }

  async function handleUpdateCover(id: number, file: File) {
    try {
      toast({
        title: 'Subiendo imagen...',
        description: 'Por favor espera',
      });

      const imageUrl = await uploadToCloudinary(file, 'blog-covers');

      const supabase = supabaseBrowserClient;
      const { error } = await supabase
        .from('blog_posts')
        .update({ imagen_portada_url: imageUrl })
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.map((p) => (p.id === id ? { ...p, imagen_portada_url: imageUrl } : p)));
      toast({
        title: 'Portada actualizada',
        description: 'La imagen se subió correctamente',
      });
    } catch (error) {
      console.error('Error updating cover:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la portada',
        variant: 'destructive',
      });
    }
  }

  function handleExport(post: BlogPost, format: 'json' | 'md') {
    try {
      if (format === 'json') {
        exportToJSON(post);
      } else {
        exportToMarkdown(post);
      }
      toast({
        title: 'Exportado',
        description: `Post exportado como ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: 'Error',
        description: 'No se pudo exportar el post',
        variant: 'destructive',
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsJsonImporterOpen(true)}>
            <UploadIcon className="h-4 w-4 mr-2" />
            Importar JSON
          </Button>
          <Button onClick={() => setIsQuickCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Post
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, descripción, slug o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Más recientes</SelectItem>
            <SelectItem value="date-asc">Más antiguos</SelectItem>
            <SelectItem value="title-asc">Título A-Z</SelectItem>
            <SelectItem value="title-desc">Título Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron posts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCardModern
              key={post.id}
              post={post}
              onEdit={(id) => router.push(`/admin/blog/editor?id=${id}`)}
              onDelete={(id) => setPostToDelete(id)}
              onDuplicate={handleDuplicate}
              onUpdateStatus={handleUpdateStatus}
              onUpdateTitle={handleUpdateTitle}
              onUpdateDescription={handleUpdateDescription}
              onUpdateCover={handleUpdateCover}
              onExport={handleExport}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <BlogQuickCreate
        open={isQuickCreateOpen}
        onClose={() => {
          setIsQuickCreateOpen(false);
          loadPosts();
        }}
      />

      {/* JSON Importer - usar el componente existente si es necesario */}

      <AlertDialog open={postToDelete !== null} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar post?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El post se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => postToDelete && handleDelete(postToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
