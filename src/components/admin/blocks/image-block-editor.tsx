// FILE: src/components/admin/blocks/image-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Loader2, ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';

interface ImageBlockEditorProps {
  block: Extract<Block, { type: 'image' }>;
  onChange: (block: Extract<Block, { type: 'image' }>) => void;
}

export function ImageBlockEditor({ block, onChange }: ImageBlockEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Solo se permiten imágenes',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'La imagen debe ser menor a 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const { uploadToCloudinary } = await import('@/lib/cloudinary-upload');
      const existingUrl = block.data.url || undefined;
      const url = await uploadToCloudinary(file, 'blog/images', existingUrl);
      onChange({ ...block, data: { ...block.data, url } });
      toast({
        title: 'Imagen subida',
        description: 'La imagen se subió correctamente',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Error al subir la imagen',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }, [block, onChange, toast]);

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

  // Paste (Ctrl+V) - Listener cuando el dropZone está enfocado
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handlePaste = async (e: ClipboardEvent) => {
      // Solo procesar si el dropZone tiene foco
      if (document.activeElement !== dropZone) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          e.stopPropagation();
          const file = items[i].getAsFile();
          if (file) {
            await uploadFile(file);
          }
          return;
        }
      }
    };

    // Agregar listener al dropZone específico
    dropZone.addEventListener('paste', handlePaste as any);
    return () => dropZone.removeEventListener('paste', handlePaste as any);
  }, [uploadFile]);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg transition-all focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer
          ${isDragging ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20' : 'border-border'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Arrastra una imagen aquí
                </p>
                <div className="flex gap-2 items-center justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(`file-upload-${block.id}`)?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar archivo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF hasta 5MB | Click aquí y presiona Ctrl+V para pegar
                </p>
              </div>
            </>
          )}
        </div>
        <input
          id={`file-upload-${block.id}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          aria-label="Subir imagen"
          title="Subir imagen"
        />
      </div>

      <div>
        <Label className="text-sm mb-2 block">O ingresa una URL:</Label>
        <Input
          value={block.data.url}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, url: e.target.value } })
          }
          placeholder="https://..."
        />
      </div>

      <div>
        <Label className="text-sm mb-2 block">Texto alternativo:</Label>
        <Input
          value={block.data.alt || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, alt: e.target.value } })
          }
          placeholder="Descripción de la imagen"
        />
      </div>

      <div>
        <Label className="text-sm mb-2 block">Pie de foto (opcional):</Label>
        <Input
          value={block.data.caption || ''}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, caption: e.target.value } })
          }
          placeholder="Texto que aparece debajo de la imagen"
        />
      </div>

      {/* Vista previa */}
      {block.data.url && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Vista previa:</Label>
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted group">
            <Image
              src={block.data.url}
              alt={block.data.alt || ''}
              fill
              className="object-contain"
            />
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
              <div className="text-white text-center">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm">Reemplazar imagen</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
                aria-label="Reemplazar imagen"
                title="Reemplazar imagen"
              />
            </label>
          </div>
          {block.data.caption && (
            <p className="text-sm text-center text-muted-foreground mt-2">{block.data.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
