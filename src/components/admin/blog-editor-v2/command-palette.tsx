// FILE: src/components/admin/blog-editor-v2/command-palette.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Save,
  Eye,
  Send,
  Plus,
  Search,
  FileText,
  Image,
  Code,
  Table,
  Video,
  Quote,
  List,
} from 'lucide-react';

interface CommandPaletteProps {
  onCommand: (command: string) => void;
}

/**
 * Command Palette (Cmd+K) para acciones rápidas en el editor
 */
export function CommandPalette({ onCommand }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (command: string) => {
    setOpen(false);
    onCommand(command);
  };

  const commands = [
    {
      group: 'Acciones',
      items: [
        { value: 'save', label: 'Guardar', icon: Save, shortcut: 'Cmd+S' },
        { value: 'preview', label: 'Preview', icon: Eye, shortcut: 'Cmd+P' },
        { value: 'publish', label: 'Publicar', icon: Send, shortcut: 'Cmd+Shift+P' },
      ],
    },
    {
      group: 'Agregar Bloque',
      items: [
        { value: 'add-text', label: 'Texto', icon: FileText },
        { value: 'add-image', label: 'Imagen', icon: Image },
        { value: 'add-code', label: 'Código', icon: Code },
        { value: 'add-table', label: 'Tabla', icon: Table },
        { value: 'add-video', label: 'Video', icon: Video },
        { value: 'add-quote', label: 'Cita', icon: Quote },
        { value: 'add-list', label: 'Lista', icon: List },
      ],
    },
    {
      group: 'Navegación',
      items: [
        { value: 'search', label: 'Buscar en contenido', icon: Search, shortcut: 'Cmd+F' },
        { value: 'templates', label: 'Ver templates', icon: Plus },
      ],
    },
  ];

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar comando..." />
        <CommandList>
          <CommandEmpty>No se encontraron comandos.</CommandEmpty>
          {commands.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => handleSelect(item.value)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.shortcut}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>

      {/* Hint para abrir */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md border">
        Presiona <kbd className="px-1.5 py-0.5 bg-background border rounded">Cmd+K</kbd> para comandos
      </div>
    </>
  );
}
