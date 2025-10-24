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
import { Plus, X, Columns2, Columns3, Columns4, Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';

interface ImagesGridBlockEditorProps {
  block: Extract<Block, { type: 'images-grid' }>;
  onChange: (block: Extract<Block, { type: 'images-grid' }>) => void;
}

export function ImagesGridBlockEditor({ block, onChange }: ImagesGridBlockEditorProps) {
  const [uploading, setUploading] = useState(false);

  const addImage = async (file: File) => {
    try {
      setUploading(true);
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const url = await uploadToCloudinary(file, 'blog/gallery');
      
      onChange({
        ...block,
        data: {
          ...block.data,
          images: [...block.data.images, { url, alt: '', caption: '' }],
        },
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
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
                <img
                  src={image.url}
                  alt={image.alt || ''}
                  className="w-20 h-20 rounded object-cover"
                />
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

      {/* Subir imagen */}
      <div>
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
