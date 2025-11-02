'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileJson, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Block } from '@/lib/types';

interface ImportedBlog {
  metadata: {
    titulo: string;
    slug: string;
    descripcion_corta: string;
    autor?: string;
    tags?: string[];
    imagen_portada_url?: string;
    imagen_portada_alt?: string;
    publicado?: boolean;
    fecha_publicacion?: string;
  };
  bloques: any[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  manualFields: string[];
}

interface BlogJsonImporterProps {
  onImport: (data: { metadata: any; blocks: Block[] }) => void;
}

export function BlogJsonImporter({ onImport }: BlogJsonImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importedData, setImportedData] = useState<ImportedBlog | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/json') {
        toast({
          title: 'Error',
          description: 'Por favor selecciona un archivo JSON válido',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setValidation(null);
      setImportedData(null);
    }
  };

  const validateBlog = (data: ImportedBlog): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const manualFields: string[] = [];

    // Validar metadata requerida
    if (!data.metadata?.titulo) errors.push('Falta el título');
    if (!data.metadata?.slug) errors.push('Falta el slug');
    if (!data.metadata?.descripcion_corta) errors.push('Falta la descripción corta');

    // Validar slug format
    if (data.metadata?.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.metadata.slug)) {
      errors.push('El slug debe ser URL-friendly (minúsculas, guiones, sin acentos)');
    }

    // Validar descripción corta
    if (data.metadata?.descripcion_corta && data.metadata.descripcion_corta.length > 160) {
      warnings.push('La descripción corta es muy larga (máx 160 caracteres)');
    }

    // Validar bloques
    if (!data.bloques || !Array.isArray(data.bloques)) {
      errors.push('No se encontraron bloques');
    } else {
      data.bloques.forEach((block, index) => {
        if (!block.type) {
          errors.push(`Bloque ${index + 1}: falta el tipo`);
        }

        // Detectar campos manuales
        const blockStr = JSON.stringify(block);
        if (blockStr.includes('[MANUAL]')) {
          manualFields.push(`Bloque ${index + 1} (${block.type}): contiene campos [MANUAL]`);
        }

        // Validaciones específicas por tipo
        switch (block.type) {
          case 'text':
            if (!block.data?.format || !block.data?.content) {
              errors.push(`Bloque ${index + 1} (text): falta format o content`);
            }
            break;
          case 'image':
            if (!block.data?.url) {
              manualFields.push(`Bloque ${index + 1} (image): requiere URL`);
            }
            break;
          case 'program-card':
          case 'programs-grid':
            manualFields.push(`Bloque ${index + 1} (${block.type}): requiere IDs de programas`);
            break;
          case 'blog-card':
          case 'blogs-grid':
            manualFields.push(`Bloque ${index + 1} (${block.type}): requiere IDs de blogs`);
            break;
          case 'category-card':
            manualFields.push(`Bloque ${index + 1} (category-card): requiere ID de categoría`);
            break;
          case 'author-bio':
            manualFields.push(`Bloque ${index + 1} (author-bio): requiere ID de autor`);
            break;
        }
      });
    }

    // Detectar campos manuales en metadata
    if (data.metadata?.imagen_portada_url?.includes('[MANUAL]')) {
      manualFields.push('Metadata: imagen de portada requiere URL');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      manualFields: [...new Set(manualFields)],
    };
  };

  const processBlocks = (blocks: any[]): Block[] => {
    return blocks.map((block, index) => {
      // Generar ID único si no existe
      const id = block.id || `block-${Date.now()}-${index}`;

      // Limpiar campos [MANUAL]
      const cleanData = JSON.parse(
        JSON.stringify(block.data).replace(/\[MANUAL\]\s*/g, '')
      );

      // Generar IDs para items internos si no existen
      if (block.type === 'faq' && cleanData.items) {
        cleanData.items = cleanData.items.map((item: any, i: number) => ({
          ...item,
          id: item.id || `faq-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'tabs' && cleanData.tabs) {
        cleanData.tabs = cleanData.tabs.map((tab: any, i: number) => ({
          ...tab,
          id: tab.id || `tab-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'accordion' && cleanData.items) {
        cleanData.items = cleanData.items.map((item: any, i: number) => ({
          ...item,
          id: item.id || `acc-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'feature-list' && cleanData.features) {
        cleanData.features = cleanData.features.map((feat: any, i: number) => ({
          ...feat,
          id: feat.id || `feat-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'icon-grid' && cleanData.items) {
        cleanData.items = cleanData.items.map((item: any, i: number) => ({
          ...item,
          id: item.id || `icon-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'timeline' && cleanData.items) {
        cleanData.items = cleanData.items.map((item: any, i: number) => ({
          ...item,
          id: item.id || `time-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'changelog' && cleanData.entries) {
        cleanData.entries = cleanData.entries.map((entry: any, i: number) => ({
          ...entry,
          id: entry.id || `v${i + 1}`,
        }));
      }

      if (block.type === 'pricing-table' && cleanData.plans) {
        cleanData.plans = cleanData.plans.map((plan: any, i: number) => ({
          ...plan,
          id: plan.id || `plan-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'progress-bar' && cleanData.items) {
        cleanData.items = cleanData.items.map((item: any, i: number) => ({
          ...item,
          id: item.id || `prog-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'checklist' && cleanData.items) {
        cleanData.items = cleanData.items.map((item: any, i: number) => ({
          ...item,
          id: item.id || `check-${Date.now()}-${i}`,
        }));
      }

      if (block.type === 'poll' && cleanData.options) {
        cleanData.options = cleanData.options.map((opt: any, i: number) => ({
          ...opt,
          id: opt.id || `opt-${Date.now()}-${i}`,
        }));
      }

      return {
        id,
        type: block.type,
        data: cleanData,
        style: block.style,
      } as Block;
    });
  };

  const handleValidate = async () => {
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ImportedBlog;

      setImportedData(data);
      const result = validateBlog(data);
      setValidation(result);

      if (result.valid) {
        toast({
          title: 'Validación exitosa',
          description: 'El archivo JSON es válido y puede ser importado',
        });
      } else {
        toast({
          title: 'Errores de validación',
          description: `Se encontraron ${result.errors.length} errores`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error al leer el archivo',
        description: 'El archivo JSON no es válido o está corrupto',
        variant: 'destructive',
      });
      setValidation(null);
      setImportedData(null);
    } finally {
      setImporting(false);
    }
  };

  const handleImport = () => {
    if (!importedData || !validation?.valid) return;

    try {
      const blocks = processBlocks(importedData.bloques);
      const metadata = {
        ...importedData.metadata,
        imagen_portada_url: importedData.metadata.imagen_portada_url?.replace('[MANUAL] ', ''),
      };

      onImport({ metadata, blocks });

      toast({
        title: 'Blog importado',
        description: 'El blog ha sido importado exitosamente. Completa los campos manuales.',
      });

      // Reset
      setFile(null);
      setValidation(null);
      setImportedData(null);
    } catch (error) {
      toast({
        title: 'Error al importar',
        description: 'Hubo un error al procesar el blog',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Importar Blog desde JSON
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Sube un archivo JSON generado por IA siguiendo la especificación
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="json-file">Archivo JSON</Label>
          <div className="flex gap-2">
            <input
              id="json-file"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              aria-label="Seleccionar archivo JSON"
              className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {file && (
              <Button onClick={handleValidate} disabled={importing}>
                {importing ? 'Validando...' : 'Validar'}
              </Button>
            )}
          </div>
        </div>

        {/* Validation Results */}
        {validation && (
          <div className="space-y-3">
            {/* Errors */}
            {validation.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errores ({validation.errors.length})</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {validation.errors.map((error, i) => (
                      <li key={i} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Advertencias ({validation.warnings.length})</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {validation.warnings.map((warning, i) => (
                      <li key={i} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Manual Fields */}
            {validation.manualFields.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Campos a completar manualmente ({validation.manualFields.length})</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {validation.manualFields.slice(0, 10).map((field, i) => (
                      <li key={i} className="text-sm">{field}</li>
                    ))}
                    {validation.manualFields.length > 10 && (
                      <li className="text-sm text-muted-foreground">
                        ... y {validation.manualFields.length - 10} más
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Success */}
            {validation.valid && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">¡Listo para importar!</AlertTitle>
                <AlertDescription className="text-green-600">
                  El blog se importará con {importedData?.bloques.length} bloques.
                  {validation.manualFields.length > 0 && (
                    <span> Recuerda completar los {validation.manualFields.length} campos manuales después.</span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Import Button */}
        {validation?.valid && (
          <Button onClick={handleImport} className="w-full" size="lg">
            <Upload className="mr-2 h-4 w-4" />
            Importar Blog
          </Button>
        )}

        {/* Help */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p><strong>Tip:</strong> Descarga AI-BLOG-SPEC.json de la raíz del proyecto</p>
          <p>Compártelo con tu IA (Perplexity, Gemini, etc.) para que genere blogs en el formato correcto</p>
        </div>
      </div>
    </Card>
  );
}
