'use client';

import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Columns2, Columns3, Columns4 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface BlogsGridBlockEditorProps {
  block: Extract<Block, { type: 'blogs-grid' }>;
  onChange: (block: Extract<Block, { type: 'blogs-grid' }>) => void;
}

export function BlogsGridBlockEditor({ block, onChange }: BlogsGridBlockEditorProps) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    const { data } = await supabaseBrowserClient
      .from('blog_posts')
      .select('id, titulo, imagen_portada_url, fecha_publicacion')
      .eq('publicado', true)
      .order('fecha_publicacion', { ascending: false });
    
    if (data) {
      setBlogs(data);
    }
  }

  const addBlog = (blogId: number) => {
    if (!block.data.blogIds.includes(blogId)) {
      onChange({
        ...block,
        data: {
          ...block.data,
          blogIds: [...block.data.blogIds, blogId],
        },
      });
    }
  };

  const removeBlog = (blogId: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        blogIds: block.data.blogIds.filter((id) => id !== blogId),
      },
    });
  };

  const filteredBlogs = blogs.filter((b) =>
    b.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBlogs = blogs.filter((b) =>
    block.data.blogIds.includes(b.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Columnas
          </Label>
          <Select
            value={block.data.columns.toString()}
            onValueChange={(value) =>
              onChange({
                ...block,
                data: { ...block.data, columns: parseInt(value) as 2 | 3 | 4 },
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">
                <div className="flex items-center gap-2">
                  <Columns2 className="h-4 w-4" />
                  2 Columnas
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-2">
                  <Columns3 className="h-4 w-4" />
                  3 Columnas
                </div>
              </SelectItem>
              <SelectItem value="4">
                <div className="flex items-center gap-2">
                  <Columns4 className="h-4 w-4" />
                  4 Columnas
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blogs seleccionados */}
      {selectedBlogs.length > 0 && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Blogs seleccionados ({selectedBlogs.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedBlogs.map((blog) => (
              <Card key={blog.id} className="flex items-center gap-2 p-2">
                {blog.imagen_portada_url && (
                  <img
                    src={blog.imagen_portada_url}
                    alt={blog.titulo}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm truncate block">{blog.titulo}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(blog.fecha_publicacion).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => removeBlog(blog.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Buscar y agregar blogs */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">
          Agregar blogs
        </Label>
        <Input
          placeholder="Buscar blog..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-[200px] overflow-y-auto space-y-1">
          {filteredBlogs.map((blog) => {
            const isSelected = block.data.blogIds.includes(blog.id);
            return (
              <button
                key={blog.id}
                type="button"
                onClick={() => addBlog(blog.id)}
                disabled={isSelected}
                className={`w-full flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors text-left ${
                  isSelected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {blog.imagen_portada_url && (
                  <img
                    src={blog.imagen_portada_url}
                    alt={blog.titulo}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm truncate block">{blog.titulo}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(blog.fecha_publicacion).toLocaleDateString()}
                  </span>
                </div>
                {isSelected && (
                  <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
                    Agregado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
