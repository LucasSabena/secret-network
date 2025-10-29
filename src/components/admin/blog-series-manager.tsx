'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layers, Plus, Edit, Trash2, Eye, EyeOff, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Serie {
  tag: string;
  count: number;
  posts: any[];
  color: string;
  featuredPostId?: number;
}

export function BlogSeriesManager() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSerieTag, setEditingSerieTag] = useState<string | null>(null);
  const [featuredPostId, setFeaturedPostId] = useState<number | null>(null);

  useEffect(() => {
    loadSeries();
  }, []);

  async function loadSeries() {
    try {
      setLoading(true);
      const supabase = supabaseBrowserClient;

      // Obtener todos los posts con tags
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('publicado', true)
        .not('tags', 'is', null);

      if (error) throw error;

      // Extraer series de los tags
      const seriesMap = new Map<string, any[]>();
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
        .map(([tag, posts]) => ({
          tag,
          count: posts.length,
          posts: posts.sort((a, b) => 
            new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime()
          ),
          color: getColorForSeries(tag),
        }))
        .sort((a, b) => b.count - a.count);

      setSeries(seriesArray);
    } catch (error) {
      console.error('Error loading series:', error);
      toast.error('Error al cargar las series');
    } finally {
      setLoading(false);
    }
  }

  function getColorForSeries(name: string): string {
    const colors = [
      '#ff3399', '#FF6B6B', '#4ECDC4', '#45B7D1',
      '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  function createSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleRemovePostFromSerie(serieTag: string, postId: number) {
    try {
      const supabase = supabaseBrowserClient;
      
      // Obtener el post
      const { data: post, error: fetchError } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;

      // Remover el tag
      const newTags = (post as any).tags?.filter((t: string) => t !== serieTag) || [];

      // Actualizar el post
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ tags: newTags })
        .eq('id', postId);

      if (updateError) throw updateError;

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

      // Remover el tag de todos los posts
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

  if (series.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No hay series todavía</h3>
        <p className="text-muted-foreground mb-6">
          Las series se crean automáticamente cuando 2 o más posts comparten un tag común
        </p>
        <div className="max-w-md mx-auto text-left bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">💡 Cómo crear una serie:</p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Ve al editor de blog</li>
            <li>Agrega el mismo tag a varios posts relacionados</li>
            <li>El tag debe tener 2+ palabras o incluir un año</li>
            <li>La serie aparecerá automáticamente aquí</li>
          </ol>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con stats */}
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

      {/* Lista de series */}
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
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`/blog/serie/${createSlug(serie.tag)}`}
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
                  onClick={() => handleDeleteSerie(serie.tag)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>

            {/* Lista de posts */}
            <div className="space-y-2">
              {serie.posts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{post.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.fecha_publicacion).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                      onClick={() => handleRemovePostFromSerie(serie.tag, post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
