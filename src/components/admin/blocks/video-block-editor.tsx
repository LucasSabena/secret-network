// FILE: src/components/admin/blocks/video-block-editor.tsx
'use client';

import { VideoBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, Video as VideoIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoBlockEditorProps {
  block: VideoBlock;
  onChange: (block: VideoBlock) => void;
}

export function VideoBlockEditor({ block, onChange }: VideoBlockEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Error',
        description: 'Solo se permiten videos',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'El video debe ser menor a 100MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const { uploadToCloudinary } = await import('@/lib/cloudinary-upload');
      const existingUrl = block.data.url || undefined;
      const url = await uploadToCloudinary(file, 'blog/videos', existingUrl);
      onChange({ ...block, data: { ...block.data, url } });
      toast({
        title: 'Video subido',
        description: 'El video se subió correctamente',
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Error',
        description: 'Error al subir el video',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  // Detectar si el video actual es de Cloudinary
  const isCloudinaryVideo = block.data.url?.includes('cloudinary.com') && block.data.url?.includes('/video/');

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg transition-all
          ${isDragging ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20' : 'border-border'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              <p className="text-sm text-muted-foreground">Subiendo video...</p>
            </>
          ) : (
            <>
              <VideoIcon className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isCloudinaryVideo ? 'Reemplazar video' : 'Arrastra un video aquí'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`video-upload-${block.id}`)?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isCloudinaryVideo ? 'Reemplazar video' : 'Seleccionar archivo'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  MP4, WebM, MOV hasta 100MB
                </p>
              </div>
            </>
          )}
        </div>
        <input
          id={`video-upload-${block.id}`}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileUpload}
          aria-label="Subir video"
          title="Subir video"
        />
      </div>

      <div>
        <Label>URL del Video</Label>
        <Input
          value={block.data.url}
          onChange={(e) => onChange({ ...block, data: { ...block.data, url: e.target.value } })}
          placeholder="https://youtube.com/watch?v=... o URL de video subido"
        />
      </div>
      <div>
        <Label>Plataforma</Label>
        <Select
          value={block.data.platform}
          onValueChange={(value: 'youtube' | 'vimeo' | 'loom') =>
            onChange({ ...block, data: { ...block.data, platform: value } })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="loom">Loom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Caption (opcional)</Label>
        <Input
          value={block.data.caption || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, caption: e.target.value } })}
          placeholder="Descripción del video"
        />
      </div>

      {/* Vista previa */}
      {block.data.url && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Vista previa:</Label>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
            {block.data.url.includes('youtube.com') || block.data.url.includes('youtu.be') ? (
              <iframe
                src={block.data.url.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title={block.data.caption || 'Video de YouTube'}
              />
            ) : block.data.url.includes('vimeo.com') ? (
              <iframe
                src={block.data.url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                className="w-full h-full"
                allowFullScreen
                title={block.data.caption || 'Video de Vimeo'}
              />
            ) : block.data.url.includes('loom.com') ? (
              <iframe
                src={block.data.url.replace('/share/', '/embed/')}
                className="w-full h-full"
                allowFullScreen
                title={block.data.caption || 'Video de Loom'}
              />
            ) : (
              <video 
                src={block.data.url} 
                controls 
                className="w-full h-full object-contain"
                preload="metadata"
              >
                Tu navegador no soporta el elemento de video.
              </video>
            )}
          </div>
          {block.data.caption && (
            <p className="text-sm text-center text-muted-foreground mt-2">{block.data.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
