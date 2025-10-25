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

  // Paste - Listener global cuando el elemento tiene foco
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    console.log('🔧 [ImageUploadZone] useEffect ejecutado, dropZone:', dropZone);
    if (!dropZone) {
      console.error('❌ [ImageUploadZone] No hay dropZone ref');
      return;
    }

    const handlePaste = async (e: ClipboardEvent) => {
      // Solo procesar si este elemento tiene foco
      if (document.activeElement !== dropZone) {
        console.log('⏭️ [ImageUploadZone] Paste ignorado - elemento no tiene foco');
        return;
      }

      console.log('📋 [ImageUploadZone] PASTE EVENT DETECTADO!', e);
      const items = e.clipboardData?.items;
      console.log('📋 [ImageUploadZone] Clipboard items:', items);
      
      if (!items) {
        console.warn('⚠️ [ImageUploadZone] No hay items en clipboard');
        return;
      }

      console.log('📋 [ImageUploadZone] Cantidad de items:', items.length);
      for (let i = 0; i < items.length; i++) {
        console.log(`📋 [ImageUploadZone] Item ${i}:`, items[i].type, items[i].kind);
        if (items[i].type.indexOf('image') !== -1) {
          console.log('✅ [ImageUploadZone] Imagen encontrada! Tipo:', items[i].type);
          e.preventDefault();
          e.stopPropagation();
          const file = items[i].getAsFile();
          console.log('📁 [ImageUploadZone] File obtenido:', file);
          if (file) {
            console.log('🚀 [ImageUploadZone] Iniciando upload...');
            await uploadFile(file);
          } else {
            console.error('❌ [ImageUploadZone] getAsFile() retornó null');
          }
          return;
        }
      }
      console.warn('⚠️ [ImageUploadZone] No se encontró ninguna imagen en el clipboard');
    };

    console.log('✅ [ImageUploadZone] Agregando listener de paste al documento');
    // Usar capture phase para interceptar antes que otros handlers
    document.addEventListener('paste', handlePaste, true);
    return () => {
      console.log('🧹 [ImageUploadZone] Removiendo listener de paste del documento');
      document.removeEventListener('paste', handlePaste, true);
    };
  }, []);

  return (
    <div
      ref={dropZoneRef}
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        console.log('🖱️ [ImageUploadZone] Click detectado, dando focus');
        dropZoneRef.current?.focus();
        console.log('🎯 [ImageUploadZone] Focus dado, activeElement:', document.activeElement);
      }}
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
