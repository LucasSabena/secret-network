'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { BlogPost } from '@/lib/types';
import { BlogQuickCreate } from './blog-editor-v2/blog-quick-create';
import { EditorAnnouncement } from './blog-editor-v2/editor-announcement';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function BlogManager() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredPosts(
        posts.filter((p) =>
          p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  async function loadPosts() {
    try {
      setIsLoading(true);
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('fecha_publicacion', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      setFilteredPosts(data || []);
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

  async function handleDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este post?')) return;

    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);

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
    }
  }

  function handleNew() {
    setIsQuickCreateOpen(true);
  }

  function handleEdit(post: BlogPost) {
    router.push(`/admin/blog/editor?id=${post.id}`);
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
        <Button onClick={handleNew} className="gap-2 bg-pink-500 hover:bg-pink-600">
          <Plus className="h-4 w-4" />
          Nuevo Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              {post.imagen_portada_url && (
                <img
                  src={post.imagen_portada_url}
                  alt={post.titulo}
                  className="w-24 h-16 rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold line-clamp-2 flex-1">{post.titulo}</h3>
                  <span className="text-xs text-muted-foreground shrink-0">#{post.id}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.fecha_publicacion).toLocaleDateString('es-ES')}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {post.publicado ? (
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                      Publicado
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                      Borrador
                    </span>
                  )}
                </div>
              </div>
            </div>
            {post.descripcion_corta && (
              <p className="text-sm line-clamp-2">{post.descripcion_corta}</p>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(post)}
                className="flex-1 gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(post.id)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
