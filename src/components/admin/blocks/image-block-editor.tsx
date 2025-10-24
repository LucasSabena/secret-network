// FILE: src/components/admin/blocks/image-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageBlockEditorProps {
  block: Extract<Block, { type: 'image' }>;
  onChange: (block: Extract<Block, { type: 'image' }>) => void;
}

export function ImageBlockEditor({ block, onChange }: ImageBlockEditorProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, replace: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { uploadToCloudinary } = await import('@/lib/cloudinary-upload');
      const existingUrl = replace ? block.data.url : undefined;
      const url = await uploadToCloudinary(file, 'blog/images', existingUrl);
      onChange({ ...block, data: { ...block.data, url } });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm mb-2 block">URL de la imagen:</Label>
        <div className="flex gap-2">
          <Input
            value={block.data.url}
            onChange={(e) =>
              onChange({ ...block, data: { ...block.data, url: e.target.value } })
            }
            placeholder="https://..."
          />
          <Button
            onClick={() => document.getElementById(`file-upload-${block.id}`)?.click()}
            disabled={uploading}
            variant="outline"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
          <input
            id={`file-upload-${block.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
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
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
                disabled={uploading}
                aria-label="Reemplazar imagen"
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
