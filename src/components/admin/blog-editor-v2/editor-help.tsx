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
import { HelpCircle, Keyboard, Lightbulb, Zap, Package } from 'lucide-react';

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
              <li><strong>Desktop:</strong> Arrastra bloques desde el panel izquierdo</li>
              <li><strong>Mobile:</strong> Toca el botón + flotante para agregar bloques</li>
              <li>Haz clic en un bloque para editarlo</li>
              <li>Usa el ícono de arrastre para reordenar bloques</li>
              <li>Click derecho en un bloque para más opciones</li>
              <li>Cambia a "Vista Previa" para ver el resultado</li>
            </ol>
          </Card>

          {/* Atajos de Teclado */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-primary" />
              Atajos de Teclado
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Guardar</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Copiar bloque</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + C</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Cortar bloque</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + X</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Pegar bloque</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + V</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Duplicar bloque</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + D</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Mover arriba</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + ↑</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Mover abajo</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + ↓</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Eliminar bloque</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Delete</kbd>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Tips y Trucos
            </h3>
            <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
              <li><strong>Auto-save:</strong> Guarda automáticamente cada 30 segundos</li>
              <li><strong>Reemplazar imágenes:</strong> Hover sobre imagen → Click para reemplazar (no ocupa espacio extra)</li>
              <li><strong>Editor enriquecido:</strong> Tabs, acordeón y alertas tienen toolbar de formato</li>
              <li><strong>Duplicar posts:</strong> Click en ícono de copiar para crear variaciones</li>
              <li><strong>Mobile:</strong> Botón + flotante para agregar bloques</li>
              <li><strong>Grids:</strong> En mobile se deslizan horizontalmente</li>
              <li><strong>Vista previa:</strong> Verifica cómo se verá antes de publicar</li>
              <li><strong>Borradores:</strong> No son visibles públicamente hasta publicar</li>
            </ul>
          </Card>

          {/* Tipos de Bloques */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Tipos de Bloques
            </h3>
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
                <strong className="text-primary">Grid Imágenes</strong>
                <p className="text-xs text-muted-foreground">
                  Múltiples imágenes en 2/3/4 columnas
                </p>
              </div>
              <div>
                <strong className="text-primary">Programa</strong>
                <p className="text-xs text-muted-foreground">
                  Tarjeta de programa del catálogo
                </p>
              </div>
              <div>
                <strong className="text-primary">Grid Programas</strong>
                <p className="text-xs text-muted-foreground">
                  Múltiples programas en columnas
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
                  Mensajes destacados
                </p>
              </div>
              <div>
                <strong className="text-primary">Código</strong>
                <p className="text-xs text-muted-foreground">
                  Bloques de código
                </p>
              </div>
              <div>
                <strong className="text-primary">Separador</strong>
                <p className="text-xs text-muted-foreground">
                  Líneas divisorias
                </p>
              </div>
            </div>
          </Card>

          {/* Funciones Avanzadas */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Funciones Avanzadas
            </h3>
            <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
              <li><strong>Menú contextual:</strong> Click derecho en bloque para copiar, duplicar, mover o eliminar</li>
              <li><strong>Copiar/Pegar:</strong> Copia bloques entre diferentes posts</li>
              <li><strong>Configuración:</strong> Click en ⚙️ para slug, descripción, autor, portada y tags</li>
              <li><strong>Estadísticas:</strong> Ve bloques, palabras y tiempo de lectura en tiempo real</li>
              <li><strong>Publicar/Borrador:</strong> Switch en header para cambiar estado</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
