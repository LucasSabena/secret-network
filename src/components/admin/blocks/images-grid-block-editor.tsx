// FILE: src/components/admin/blocks/images-grid-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Columns2, Columns3, Columns4, Upload, Loader2, ImagePlus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';
import { useToast } from '@/components/ui/use-toast';

interface ImagesGridBlockEditorProps {
  block: Extract<Block, { type: 'images-grid' }>;
  onChange: (block: Extract<Block, { type: 'images-grid' }>) => void;
}

export function ImagesGridBlockEditor({ block, onChange }: ImagesGridBlockEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const addImage = async (file: File) => {
    try {
      setUploading(true);
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: 'Error',
          description: validation.error,
          variant: 'destructive',
        });
        return;
      }

      const url = await uploadToCloudinary(file, 'blog/gallery');
      
      onChange({
        ...block,
        data: {
          ...block.data,
          images: [...block.data.images, { url, alt: '', caption: '' }],
        },
      });

      toast({
        title: 'Imagen agregada',
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

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await addImage(file);
      }
    }
  };

  // Paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!dropZoneRef.current?.contains(document.activeElement)) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) await addImage(file);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [block.data.images]);

  const replaceImage = async (index: number, file: File) => {
    try {
      setUploading(true);
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const existingUrl = block.data.images[index].url;
      const url = await uploadToCloudinary(file, 'blog/gallery', existingUrl);
      
      onChange({
        ...block,
        data: {
          ...block.data,
          images: block.data.images.map((img, i) =>
            i === index ? { ...img, url } : img
          ),
        },
      });
    } catch (error) {
      console.error('Error replacing image:', error);
      alert('Error al reemplazar la imagen');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        images: block.data.images.filter((_, i) => i !== index),
      },
    });
  };

  const updateImage = (index: number, field: 'alt' | 'caption', value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        images: block.data.images.map((img, i) =>
          i === index ? { ...img, [field]: value } : img
        ),
      },
    });
  };

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

      {/* Imágenes */}
      {block.data.images.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">
            Imágenes ({block.data.images.length})
          </Label>
          {block.data.images.map((image, index) => (
            <Card key={index} className="p-3 space-y-2">
              <div className="flex items-start gap-3">
                <div className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt || ''}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center rounded">
                    <Upload className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) replaceImage(index, file);
                        e.target.value = '';
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Texto alternativo (alt)"
                    value={image.alt}
                    onChange={(e) => updateImage(index, 'alt', e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Pie de foto (opcional)"
                    value={image.caption}
                    onChange={(e) => updateImage(index, 'caption', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg transition-all
          ${isDragging ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20' : 'border-border'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              <p className="text-sm text-muted-foreground">Subiendo imágenes...</p>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Arrastra imágenes aquí
                </p>
                <div className="flex gap-2 items-center justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(`grid-upload-${block.id}`)?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar archivos
                  </Button>
                  <span className="text-xs text-muted-foreground">o</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.currentTarget.focus();
                    }}
                    onFocus={(e) => {
                      const handlePasteOnButton = async (pasteEvent: ClipboardEvent) => {
                        const items = pasteEvent.clipboardData?.items;
                        if (!items) return;

                        for (let i = 0; i < items.length; i++) {
                          if (items[i].type.indexOf('image') !== -1) {
                            pasteEvent.preventDefault();
                            const file = items[i].getAsFile();
                            if (file) await addImage(file);
                          }
                        }
                      };

                      document.addEventListener('paste', handlePasteOnButton);
                      e.currentTarget.addEventListener('blur', () => {
                        document.removeEventListener('paste', handlePasteOnButton);
                      }, { once: true });
                    }}
                  >
                    📋 Click aquí y Ctrl+V
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Múltiples imágenes a la vez - PNG, JPG, GIF
                </p>
              </div>
            </>
          )}
        </div>
        <input
          id={`grid-upload-${block.id}`}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            files.forEach(file => addImage(file));
            e.target.value = '';
          }}
        />
      </div>

      {/* Subir imagen (legacy - mantener por compatibilidad) */}
      <div className="hidden">
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg hover:bg-accent hover:border-primary transition-colors">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">
              {uploading ? 'Subiendo...' : 'Agregar imagen'}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addImage(file);
              e.target.value = '';
            }}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
