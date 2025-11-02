'use client';

import { Block } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BlogCardBlockEditorProps {
  block: Extract<Block, { type: 'blog-card' }>;
  onChange: (block: Extract<Block, { type: 'blog-card' }>) => void;
}

export function BlogCardBlockEditor({ block, onChange }: BlogCardBlockEditorProps) {
  const [blog, setBlog] = useState<any>(null);
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Cargar todos los blogs para el buscador
  useEffect(() => {
    const fetchAllBlogs = async () => {
      const { data } = await supabaseBrowserClient
        .from('blog_posts')
        .select('id, titulo, imagen_portada_url, fecha_publicacion')
        .eq('publicado', true)
        .order('fecha_publicacion', { ascending: false });
      
      if (data) {
        setAllBlogs(data);
      }
    };

    fetchAllBlogs();
  }, []);

  // Cargar blog seleccionado
  useEffect(() => {
    if (block.data.blogId > 0) {
      setLoading(true);
      supabaseBrowserClient
        .from('blog_posts')
        .select('*')
        .eq('id', block.data.blogId)
        .single()
        .then(({ data }: { data: any }) => {
          setBlog(data);
          setLoading(false);
        });
    }
  }, [block.data.blogId]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label className="text-sm mb-2 block">Buscar Blog:</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {blog ? blog.titulo : "Selecciona un blog..."}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Busca por título..." />
                <CommandList>
                  <CommandEmpty>No se encontró ningún blog.</CommandEmpty>
                  <CommandGroup>
                    {allBlogs.map((blogItem) => (
                      <CommandItem
                        key={blogItem.id}
                        value={blogItem.titulo}
                        onSelect={() => {
                          onChange({ ...block, data: { ...block.data, blogId: blogItem.id } });
                          setOpen(false);
                        }}
                      >
                        {blogItem.imagen_portada_url && (
                          <img src={blogItem.imagen_portada_url} alt="" className="w-8 h-8 mr-2 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm">{blogItem.titulo}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(blogItem.fecha_publicacion).toLocaleDateString()}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground mt-1">
            Busca y selecciona el blog que quieres mostrar
          </p>
        </div>

        <div>
          <Label className="text-sm mb-2 block">Tamaño:</Label>
          <Select
            value={block.data.variant || 'default'}
            onValueChange={(value: any) =>
              onChange({ ...block, data: { ...block.data, variant: value } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeño</SelectItem>
              <SelectItem value="default">Normal</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vista previa */}
      {blog && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Vista previa:</Label>
          <Card className="p-4">
            {blog.imagen_portada_url && (
              <img 
                src={blog.imagen_portada_url} 
                alt={blog.titulo}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold text-sm mb-1">{blog.titulo}</h3>
            {blog.descripcion_corta && (
              <p className="text-xs text-muted-foreground line-clamp-2">{blog.descripcion_corta}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(blog.fecha_publicacion).toLocaleDateString()}
            </p>
          </Card>
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground">Cargando blog...</p>}
      {!loading && block.data.blogId > 0 && !blog && (
        <p className="text-sm text-destructive">No se encontró el blog con ID {block.data.blogId}</p>
      )}
    </div>
  );
}
