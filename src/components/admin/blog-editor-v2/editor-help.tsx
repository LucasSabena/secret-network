// FILE: src/components/admin/blog-editor-v2/editor-help.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, Keyboard, Lightbulb, Zap } from 'lucide-react';

export function EditorHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Guía del Editor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Inicio Rápido */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Inicio Rápido
            </h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Arrastra bloques desde el panel izquierdo al canvas central</li>
              <li>Haz clic en un bloque para editarlo</li>
              <li>Usa el ícono de arrastre para reordenar bloques</li>
              <li>Haz clic en el ícono de basura para eliminar un bloque</li>
              <li>Cambia a la pestaña "Vista Previa" para ver el resultado</li>
            </ol>
          </Card>

          {/* Atajos de Teclado */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-primary" />
              Atajos de Teclado (Próximamente)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Deshacer</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + Z</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Rehacer</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + Y</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Guardar</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Duplicar bloque</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + D</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Eliminar bloque</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Delete</kbd>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">💡 Tips y Trucos</h3>
            <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
              <li>Los bloques de texto soportan HTML básico como &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;</li>
              <li>Puedes insertar iconos en el texto usando [icon:nombre-icono]</li>
              <li>Las imágenes se suben automáticamente a Cloudinary</li>
              <li>Los cambios se guardan solo cuando haces clic en "Guardar" o "Publicar"</li>
              <li>Usa la vista previa para verificar cómo se verá el post antes de publicar</li>
              <li>Los borradores no son visibles públicamente hasta que los publiques</li>
            </ul>
          </Card>

          {/* Tipos de Bloques */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">📦 Tipos de Bloques</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <strong className="text-primary">Texto</strong>
                <p className="text-xs text-muted-foreground">
                  Párrafos, títulos, listas, citas
                </p>
              </div>
              <div>
                <strong className="text-primary">Imagen</strong>
                <p className="text-xs text-muted-foreground">
                  Imágenes con caption y alt text
                </p>
              </div>
              <div>
                <strong className="text-primary">Programa</strong>
                <p className="text-xs text-muted-foreground">
                  Tarjetas de programas del catálogo
                </p>
              </div>
              <div>
                <strong className="text-primary">Pestañas</strong>
                <p className="text-xs text-muted-foreground">
                  Contenido organizado en tabs
                </p>
              </div>
              <div>
                <strong className="text-primary">Acordeón</strong>
                <p className="text-xs text-muted-foreground">
                  Contenido expandible/colapsable
                </p>
              </div>
              <div>
                <strong className="text-primary">Alerta</strong>
                <p className="text-xs text-muted-foreground">
                  Mensajes destacados (info, warning, etc)
                </p>
              </div>
              <div>
                <strong className="text-primary">Código</strong>
                <p className="text-xs text-muted-foreground">
                  Bloques de código con highlighting
                </p>
              </div>
              <div>
                <strong className="text-primary">Separador</strong>
                <p className="text-xs text-muted-foreground">
                  Líneas divisorias entre secciones
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
