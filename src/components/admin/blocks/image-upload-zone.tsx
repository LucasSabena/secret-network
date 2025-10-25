'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadZoneProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export function ImageUploadZone({ onImageUploaded, currentImageUrl }: ImageUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
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
      const url = await uploadToCloudinary(file, 'blog/images', currentImageUrl);
      onImageUploaded(url);
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

  // Paste - Listener nativo en el elemento
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handlePaste = async (e: Event) => {
      const clipboardEvent = e as ClipboardEvent;
      const items = clipboardEvent.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) await uploadFile(file);
          return;
        }
      }
    };

    dropZone.addEventListener('paste', handlePaste);
    return () => dropZone.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div
      ref={dropZoneRef}
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => dropZoneRef.current?.focus()}
      className={`
        relative border-2 border-dashed rounded-lg transition-all cursor-pointer
        focus:ring-2 focus:ring-primary focus:border-primary outline-none
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
        ${uploading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
          </>
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {currentImageUrl ? 'Reemplazar imagen' : 'Agregar imagen'}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar archivo
              </Button>
              <p className="text-xs text-muted-foreground">
                O arrastra aquí, o haz click y presiona Ctrl+V
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF hasta 5MB
              </p>
            </div>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label="Subir imagen"
        title="Subir imagen"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />
    </div>
  );
}
