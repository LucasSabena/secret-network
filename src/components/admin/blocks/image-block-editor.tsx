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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // TODO: Implementar upload a Cloudinary
      // Por ahora, usar URL directa
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      onChange({ ...block, data: { ...block.data, url: data.secure_url } });
    } catch (error) {
      console.error('Error uploading image:', error);
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
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
            <Image
              src={block.data.url}
              alt={block.data.alt || ''}
              fill
              className="object-contain"
            />
          </div>
          {block.data.caption && (
            <p className="text-sm text-center text-muted-foreground mt-2">{block.data.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
