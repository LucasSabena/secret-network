'use client';

import { useState } from 'react';
import { BlogPost } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Edit2, Trash2, Copy, Eye, Download, Upload, Check, X,
  MoreVertical, FileJson, FileText, Image as ImageIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BlogCardModernProps {
  post: BlogPost;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDuplicate: (post: BlogPost) => void;
  onUpdateStatus: (id: number, published: boolean) => void;
  onUpdateTitle: (id: number, title: string) => void;
  onUpdateDescription: (id: number, description: string) => void;
  onUpdateCover: (id: number, file: File) => void;
  onExport: (post: BlogPost, format: 'json' | 'md') => void;
}

export function BlogCardModern({
  post,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdateStatus,
  onUpdateTitle,
  onUpdateDescription,
  onUpdateCover,
  onExport,
}: BlogCardModernProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.titulo);
  const [editedDescription, setEditedDescription] = useState(post.descripcion_corta || '');
  const [isDragging, setIsDragging] = useState(false);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== post.titulo) {
      onUpdateTitle(post.id, editedTitle);
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (editedDescription !== post.descripcion_corta) {
      onUpdateDescription(post.id, editedDescription);
    }
    setIsEditingDescription(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onUpdateCover(post.id, file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdateCover(post.id, file);
    }
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Cover Image */}
      <div
        className={cn(
          'relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden',
          isDragging && 'ring-2 ring-primary'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {post.imagen_portada_url ? (
          <img
            src={post.imagen_portada_url}
            alt={post.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center gap-2 text-white">
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">Cambiar portada</span>
              <span className="text-xs text-white/70">o arrastra aquí</span>
            </div>
          </label>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <button
            onClick={() => onUpdateStatus(post.id, !post.publicado)}
            className="group/status"
          >
            <Badge
              variant={post.publicado ? 'default' : 'secondary'}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              {post.publicado ? 'Publicado' : 'Borrador'}
            </Badge>
          </button>
        </div>

        {/* Post ID */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            #{post.id}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        {isEditingTitle ? (
          <div className="space-y-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="font-semibold"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') {
                  setEditedTitle(post.titulo);
                  setIsEditingTitle(false);
                }
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveTitle}>
                <Check className="h-3 w-3 mr-1" />
                Guardar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditedTitle(post.titulo);
                  setIsEditingTitle(false);
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <h3
            className="font-semibold text-lg line-clamp-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsEditingTitle(true)}
            title="Click para editar"
          >
            {post.titulo}
          </h3>
        )}

        {/* Description */}
        {isEditingDescription ? (
          <div className="space-y-2">
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="text-sm min-h-[80px]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setEditedDescription(post.descripcion_corta || '');
                  setIsEditingDescription(false);
                }
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveDescription}>
                <Check className="h-3 w-3 mr-1" />
                Guardar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditedDescription(post.descripcion_corta || '');
                  setIsEditingDescription(false);
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p
            className="text-sm text-muted-foreground line-clamp-3 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => setIsEditingDescription(true)}
            title="Click para editar"
          >
            {post.descripcion_corta || 'Sin descripción'}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{new Date(post.fecha_publicacion).toLocaleDateString()}</span>
          {post.autor && (
            <>
              <span>•</span>
              <span>{post.autor}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onEdit(post.id)}
            className="flex-1"
          >
            <Edit2 className="h-3 w-3 mr-1" />
            Editar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                <Eye className="h-4 w-4 mr-2" />
                Vista previa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(post)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onExport(post, 'json')}>
                <FileJson className="h-4 w-4 mr-2" />
                Exportar JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport(post, 'md')}>
                <FileText className="h-4 w-4 mr-2" />
                Exportar Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
