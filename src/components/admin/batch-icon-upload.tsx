'use client';

import { useState } from 'react';
import { Upload, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';

interface BatchIconUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FileMapping {
  file: File;
  fileName: string;
  suggestedProgramId: number | null;
  suggestedProgramName: string;
  selectedProgramId: number | null;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function BatchIconUpload({ onClose, onSuccess }: BatchIconUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileMappings, setFileMappings] = useState<FileMapping[]>([]);
  const [programas, setProgramas] = useState<{ id: number; nombre: string; slug: string }[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast({
        title: 'Error',
        description: 'No se encontraron archivos de imagen',
        variant: 'destructive',
      });
      return;
    }

    await processFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona archivos de imagen',
        variant: 'destructive',
      });
      return;
    }

    await processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    setLoadingMessage('Cargando programas de la base de datos...');

    try {
      // Cargar todos los programas de la base de datos
      const supabase = supabaseBrowserClient;
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa para mostrar el mensaje
      
      const { data: programasData, error } = await supabase
        .from('programas')
        .select('id, nombre, slug')
        .order('nombre');

      if (error) throw error;
      setProgramas(programasData || []);

      setLoadingMessage(`Analizando ${files.length} archivo(s)...`);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Procesar cada archivo y buscar coincidencias
      setLoadingMessage('Buscando coincidencias automáticas...');
      await new Promise(resolve => setTimeout(resolve, 400));

      const mappings: FileMapping[] = files.map(file => {
        // Remover la extensión del nombre del archivo
        const fileNameWithoutExt = file.name.replace(/\.(svg|png|jpg|jpeg|webp)$/i, '');
        
        // Buscar coincidencia exacta primero
        let matchedProgram = programasData?.find(
          p => p.nombre.toLowerCase() === fileNameWithoutExt.toLowerCase()
        );

        // Si no hay coincidencia exacta, buscar coincidencia parcial
        if (!matchedProgram) {
          matchedProgram = programasData?.find(p =>
            p.nombre.toLowerCase().includes(fileNameWithoutExt.toLowerCase()) ||
            fileNameWithoutExt.toLowerCase().includes(p.nombre.toLowerCase())
          );
        }

        return {
          file,
          fileName: file.name,
          suggestedProgramId: matchedProgram?.id || null,
          suggestedProgramName: matchedProgram?.nombre || 'Sin coincidencia',
          selectedProgramId: matchedProgram?.id || null,
          status: 'pending' as const,
        };
      });

      setFileMappings(mappings);

      setLoadingMessage('Preparando vista previa...');
      await new Promise(resolve => setTimeout(resolve, 300));

      toast({
        title: 'Archivos procesados',
        description: `Se procesaron ${files.length} archivo(s). Revisa las asignaciones antes de confirmar.`,
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron procesar los archivos',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setLoadingMessage('');
    }
  };

  const updateProgramSelection = (index: number, programId: string) => {
    const newMappings = [...fileMappings];
    newMappings[index].selectedProgramId = programId ? parseInt(programId) : null;
    setFileMappings(newMappings);
  };

  const removeFile = (index: number) => {
    setFileMappings(fileMappings.filter((_, i) => i !== index));
  };

  const confirmUpload = async () => {
    // Validar que todos los archivos tengan un programa asignado
    const unassigned = fileMappings.filter(m => !m.selectedProgramId);
    if (unassigned.length > 0) {
      toast({
        title: 'Error de validación',
        description: `${unassigned.length} archivo(s) no tienen programa asignado`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const supabase = supabaseBrowserClient;
      let successCount = 0;
      let errorCount = 0;

      // Procesar cada archivo
      for (let i = 0; i < fileMappings.length; i++) {
        const mapping = fileMappings[i];
        
        // Actualizar estado a "uploading"
        setFileMappings(prev => {
          const newMappings = [...prev];
          newMappings[i].status = 'uploading';
          return newMappings;
        });

        try {
          // Validar el archivo
          const validation = validateImageFile(mapping.file);
          if (!validation.valid) {
            throw new Error(validation.error);
          }

          // Obtener el programa para usar su slug
          const programa = programas.find(p => p.id === mapping.selectedProgramId);
          if (!programa) {
            throw new Error('Programa no encontrado');
          }

          // Subir a Cloudinary
          const publicId = `${programa.slug}-icon`;
          const iconUrl = await uploadToCloudinary(
            mapping.file,
            'programas/icons',
            publicId
          );

          // Actualizar en la base de datos
          const { error: updateError } = await supabase
            .from('programas')
            .update({ icono_url: iconUrl })
            .eq('id', mapping.selectedProgramId);

          if (updateError) throw updateError;

          // Actualizar estado a "success"
          setFileMappings(prev => {
            const newMappings = [...prev];
            newMappings[i].status = 'success';
            return newMappings;
          });

          successCount++;
        } catch (error) {
          console.error(`Error uploading ${mapping.fileName}:`, error);
          
          // Actualizar estado a "error"
          setFileMappings(prev => {
            const newMappings = [...prev];
            newMappings[i].status = 'error';
            newMappings[i].error = error instanceof Error ? error.message : 'Error desconocido';
            return newMappings;
          });

          errorCount++;
        }
      }

      // Mostrar resultado final
      if (errorCount === 0) {
        toast({
          title: '¡Éxito!',
          description: `Se subieron ${successCount} icono(s) correctamente`,
        });
        onSuccess();
        setTimeout(onClose, 1500);
      } else {
        toast({
          title: 'Subida completada con errores',
          description: `Éxito: ${successCount} | Error: ${errorCount}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error en batch upload:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error durante la subida',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: FileMapping['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subida por Lote de Iconos</DialogTitle>
        </DialogHeader>

        {isProcessing ? (
          // Vista de carga con mensajes animados
          <div className="space-y-6 py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {loadingMessage}
              </h3>
              <p className="text-sm text-muted-foreground">
                Por favor espera, esto puede tomar unos segundos...
              </p>
            </div>
          </div>
        ) : fileMappings.length === 0 ? (
          // Vista de carga inicial
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center transition-colors
                ${isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/25 hover:border-primary/50'
                }
              `}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Arrastra tus iconos aquí
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sube múltiples archivos de imagen (SVG, PNG, JPG, WebP)
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                💡 Nombra los archivos igual que el programa (ej: &quot;Lyssna.svg&quot;) para asignación automática
              </p>
              <label className="cursor-pointer">
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar Archivos
                  </span>
                </Button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-sm">Cómo funciona:</h4>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Arrastra o selecciona múltiples archivos de iconos</li>
                <li>El sistema intentará asignar cada icono a su programa automáticamente</li>
                <li>Revisa y ajusta las asignaciones si es necesario</li>
                <li>Confirma para subir todos los iconos a la vez</li>
              </ol>
            </div>
          </div>
        ) : (
          // Vista de asignación y confirmación
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <p className="text-sm text-muted-foreground">
                  {fileMappings.length} archivo(s) cargados
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFileMappings([])}
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar Todo
              </Button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {fileMappings.map((mapping, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                >
                  {/* Icono de estado */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(mapping.status)}
                  </div>

                  {/* Preview del archivo */}
                  <div className="flex-shrink-0">
                    <img
                      src={URL.createObjectURL(mapping.file)}
                      alt={mapping.fileName}
                      className="w-10 h-10 rounded object-cover border"
                    />
                  </div>

                  {/* Nombre del archivo */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {mapping.fileName}
                    </p>
                    {mapping.error && (
                      <p className="text-xs text-red-500 truncate">
                        {mapping.error}
                      </p>
                    )}
                  </div>

                  {/* Selector de programa */}
                  <div className="flex-1">
                    <Select
                      value={mapping.selectedProgramId?.toString() || ''}
                      onValueChange={(value) => updateProgramSelection(index, value)}
                      disabled={isUploading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar programa" />
                      </SelectTrigger>
                      <SelectContent>
                        {programas.map(programa => (
                          <SelectItem key={programa.id} value={programa.id.toString()}>
                            {programa.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botón de eliminar */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={confirmUpload}
                disabled={isUploading || isProcessing}
                className="bg-primary hover:bg-primary/90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo {fileMappings.filter(m => m.status === 'success').length}/{fileMappings.length}...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar y Subir
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
