// FILE: src/components/admin/blog-editor-v2/block-context-menu.tsx
'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Scissors,
  Clipboard,
  RotateCcw,
  Palette,
} from 'lucide-react';
import { Block } from '@/lib/types';

interface BlockContextMenuProps {
  block: Block;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCopy: () => void;
  onCut: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  children: React.ReactNode;
}

export function BlockContextMenu({
  block,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onCopy,
  onCut,
  canMoveUp,
  canMoveDown,
  children,
}: BlockContextMenuProps) {
  return (
    <ContextMenu>
      {children}
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={onCut}>
          <Scissors className="mr-2 h-4 w-4" />
          Cortar
          <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicar
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onMoveUp} disabled={!canMoveUp}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Mover arriba
          <ContextMenuShortcut>Ctrl+↑</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={onMoveDown} disabled={!canMoveDown}>
          <ArrowDown className="mr-2 h-4 w-4" />
          Mover abajo
          <ContextMenuShortcut>Ctrl+↓</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            Estilo
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Alinear izquierda
            </ContextMenuItem>
            <ContextMenuItem>
              Alinear centro
            </ContextMenuItem>
            <ContextMenuItem>
              Alinear derecha
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              Ancho completo
            </ContextMenuItem>
            <ContextMenuItem>
              Ancho contenido
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
