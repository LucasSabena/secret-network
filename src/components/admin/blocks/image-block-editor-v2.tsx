'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploadZone } from './image-upload-zone';
import Image from 'next/image';
import { Upload } from 'lucide-react';

interface ImageBlockEditorProps {
  block: Extract<Block, { type: 'image' }>;
  onChange: (block: Extract<Block, { type: 'image' }>) => void;
}

export function ImageBlockEditorV2({ block, onChange }: ImageBlockEditorProps) {
  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <ImageUploadZone
        currentImageUrl={block.data.url}
        onImageUploaded={(url) => onChange({ ...block, data: { ...block.data, url } })}
      />

      {/* URL Manual */}
      <div>
        <Label className="text-sm mb-2 block">O ingresa una URL:</Label>
        <Input
          value={block.data.url}
          onChange={(e) => onChange({ ...block, data: { ...block.data, url: e.target.value } })}
          placeholder="https://..."
        />
      </div>

      {/* Alt Text */}
      <div>
        <Label className="text-sm mb-2 block">Texto alternativo:</Label>
        <Input
          value={block.data.alt || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, alt: e.target.value } })}
          placeholder="Descripción de la imagen"
        />
      </div>

      {/* Caption */}
      <div>
        <Label className="text-sm mb-2 block">Pie de foto (opcional):</Label>
        <Input
          value={block.data.caption || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, caption: e.target.value } })}
          placeholder="Texto que aparece debajo de la imagen"
        />
      </div>

      {/* Preview */}
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
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-center">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm">Arrastra nueva imagen para reemplazar</span>
              </div>
            </div>
          </div>
          {block.data.caption && (
            <p className="text-sm text-center text-muted-foreground mt-2">{block.data.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
