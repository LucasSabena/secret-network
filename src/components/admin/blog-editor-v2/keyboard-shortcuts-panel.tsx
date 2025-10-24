// FILE: src/components/admin/blog-editor-v2/keyboard-shortcuts-panel.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

/**
 * Panel que muestra todos los atajos de teclado disponibles
 */
export function KeyboardShortcutsPanel() {
  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: ['Cmd', 'S'], description: 'Guardar borrador' },
        { keys: ['Cmd', 'P'], description: 'Abrir preview' },
        { keys: ['Cmd', 'Shift', 'P'], description: 'Publicar post' },
        { keys: ['Cmd', 'K'], description: 'Abrir command palette' },
        { keys: ['Cmd', '?'], description: 'Mostrar atajos' },
      ],
    },
    {
      category: 'Bloques',
      items: [
        { keys: ['Cmd', 'B'], description: 'Agregar bloque' },
        { keys: ['Cmd', 'D'], description: 'Duplicar bloque' },
        { keys: ['Cmd', 'Backspace'], description: 'Eliminar bloque' },
        { keys: ['Cmd', '↑'], description: 'Mover bloque arriba' },
        { keys: ['Cmd', '↓'], description: 'Mover bloque abajo' },
      ],
    },
    {
      category: 'Navegación',
      items: [
        { keys: ['Cmd', 'F'], description: 'Buscar en contenido' },
        { keys: ['Esc'], description: 'Cerrar dialogs' },
        { keys: ['Tab'], description: 'Siguiente campo' },
        { keys: ['Shift', 'Tab'], description: 'Campo anterior' },
      ],
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          Atajos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Atajos de Teclado</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="font-semibold mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="text-sm">{item.description}</span>
                    <div className="flex gap-1">
                      {item.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-1 text-xs bg-muted border rounded"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>Tip:</strong> En Mac usa Cmd, en Windows/Linux usa Ctrl
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
