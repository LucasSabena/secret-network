'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Upload, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ImageBlockEditorProps {
  block: Extract<Block, { type: 'image' }>;
  onChange: (block: Extract<Block, { type: 'image' }>) => void;
}

export function ImageBlockEditorV2({ block, onChange }: ImageBlockEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
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
      const url = await uploadToCloudinary(file, 'blog/images', block.data.url);
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
  };

  return (
    <div className="space-y-4">
      {/* Botón simple de upload */}
      <div>
        <Label className="text-sm mb-2 block">Subir imagen:</Label>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar archivo
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
      </div>

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
