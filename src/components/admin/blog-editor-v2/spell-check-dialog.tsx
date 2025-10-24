// FILE: src/components/admin/blog-editor-v2/spell-check-dialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, SpellCheck, AlertCircle } from 'lucide-react';
import { Block } from '@/lib/types';
import { checkSpelling, SpellingError } from '@/lib/spell-checker';
import { useToast } from '@/components/ui/use-toast';

interface SpellCheckDialogProps {
  blocks: Block[];
  onApplyCorrection?: (blockId: string, newContent: string) => void;
}

interface BlockError {
  blockId: string;
  blockIndex: number;
  blockType: string;
  errors: SpellingError[];
  content: string;
}

export function SpellCheckDialog({ blocks, onApplyCorrection }: SpellCheckDialogProps) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [blockErrors, setBlockErrors] = useState<BlockError[]>([]);
  const { toast } = useToast();

  const handleCheck = async () => {
    setChecking(true);
    setBlockErrors([]);

    try {
      const errors: BlockError[] = [];

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        let textToCheck = '';

        // Extraer texto según el tipo de bloque
        if (block.type === 'text') {
          textToCheck = block.data.content;
        } else if (block.type === 'alert') {
          textToCheck = `${block.data.title || ''} ${block.data.description}`;
        } else if (block.type === 'image') {
          textToCheck = `${block.data.alt || ''} ${block.data.caption || ''}`;
        } else if (block.type === 'tabs') {
          textToCheck = block.data.tabs.map(t => `${t.label} ${t.content}`).join(' ');
        } else if (block.type === 'accordion') {
          textToCheck = block.data.items.map(item => `${item.title} ${item.content}`).join(' ');
        }

        if (textToCheck.trim()) {
          const result = await checkSpelling(textToCheck);
          if (result.errors.length > 0) {
            errors.push({
              blockId: block.id,
              blockIndex: i + 1,
              blockType: block.type,
              errors: result.errors,
              content: textToCheck,
            });
          }
        }
      }

      setBlockErrors(errors);

      if (errors.length === 0) {
        toast({
          title: '✅ Sin errores',
          description: 'No se encontraron errores ortográficos',
        });
      } else {
        const totalErrors = errors.reduce((sum, be) => sum + be.errors.length, 0);
        toast({
          title: `⚠️ ${totalErrors} error${totalErrors > 1 ? 'es' : ''} encontrado${totalErrors > 1 ? 's' : ''}`,
          description: `En ${errors.length} bloque${errors.length > 1 ? 's' : ''}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error checking spelling:', error);
      toast({
        title: 'Error',
        description: 'No se pudo verificar la ortografía',
        variant: 'destructive',
      });
    } finally {
      setChecking(false);
    }
  };

  const handleApplyCorrection = (blockId: string, error: SpellingError, replacement: string) => {
    if (!onApplyCorrection) return;

    const blockError = blockErrors.find(be => be.blockId === blockId);
    if (!blockError) return;

    const before = blockError.content.substring(0, error.offset);
    const after = blockError.content.substring(error.offset + error.length);
    const newContent = before + replacement + after;

    onApplyCorrection(blockId, newContent);

    // Actualizar la lista de errores
    setBlockErrors(prev =>
      prev.map(be =>
        be.blockId === blockId
          ? { ...be, errors: be.errors.filter(e => e !== error) }
          : be
      ).filter(be => be.errors.length > 0)
    );

    toast({
      title: 'Corrección aplicada',
      description: `"${error.context.text.substring(error.context.offset, error.context.offset + error.context.length)}" → "${replacement}"`,
    });
  };

  const totalErrors = blockErrors.reduce((sum, be) => sum + be.errors.length, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SpellCheck className="h-4 w-4" />
          Ortografía
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SpellCheck className="h-5 w-5" />
            Corrector Ortográfico
          </DialogTitle>
          <DialogDescription>
            Revisa y corrige errores ortográficos en tu contenido
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {!checking && blockErrors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SpellCheck className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Verificar Ortografía
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Analizaremos todos los bloques de texto en busca de errores ortográficos y gramaticales.
              </p>
              <Button onClick={handleCheck} disabled={checking}>
                {checking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <SpellCheck className="mr-2 h-4 w-4" />
                    Iniciar Verificación
                  </>
                )}
              </Button>
            </div>
          )}

          {checking && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">
                Analizando contenido...
              </p>
            </div>
          )}

          {!checking && blockErrors.length > 0 && (
            <>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="font-semibold">
                    {totalErrors} error{totalErrors > 1 ? 'es' : ''} encontrado{totalErrors > 1 ? 's' : ''}
                  </span>
                </div>
                <Button onClick={handleCheck} variant="outline" size="sm">
                  Verificar de nuevo
                </Button>
              </div>

              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {blockErrors.map((blockError) => (
                    <Card key={blockError.blockId}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          Bloque #{blockError.blockIndex}
                          <Badge variant="outline">{blockError.blockType}</Badge>
                          <Badge variant="destructive">
                            {blockError.errors.length} error{blockError.errors.length > 1 ? 'es' : ''}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {blockError.errors.map((error, idx) => (
                          <div
                            key={idx}
                            className="border rounded-lg p-3 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-destructive mb-1">
                                  {error.shortMessage}
                                </p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {error.message}
                                </p>
                                <div className="bg-muted p-2 rounded text-sm font-mono">
                                  {error.context.text.substring(0, error.context.offset)}
                                  <span className="bg-destructive/20 text-destructive px-1">
                                    {error.context.text.substring(
                                      error.context.offset,
                                      error.context.offset + error.context.length
                                    )}
                                  </span>
                                  {error.context.text.substring(error.context.offset + error.context.length)}
                                </div>
                              </div>
                            </div>
                            {error.replacements.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-muted-foreground">
                                  Sugerencias:
                                </span>
                                {error.replacements.map((replacement, rIdx) => (
                                  <Button
                                    key={rIdx}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() =>
                                      handleApplyCorrection(
                                        blockError.blockId,
                                        error,
                                        replacement
                                      )
                                    }
                                  >
                                    {replacement}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
