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
  Lock,
  Unlock,
  MessageSquare,
  FileCode,
  SpellCheck,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
  Minimize,
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
  onConvertTo?: (type: Block['type']) => void;
  onToggleVisibility?: () => void;
  onToggleLock?: () => void;
  onAddComment?: () => void;
  onCheckSpelling?: () => void;
  onCopyAsMarkdown?: () => void;
  onChangeAlignment?: (alignment: 'left' | 'center' | 'right') => void;
  onChangeWidth?: (width: 'full' | 'content') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isVisible?: boolean;
  isLocked?: boolean;
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
  onConvertTo,
  onToggleVisibility,
  onToggleLock,
  onAddComment,
  onCheckSpelling,
  onCopyAsMarkdown,
  onChangeAlignment,
  onChangeWidth,
  canMoveUp,
  canMoveDown,
  isVisible = true,
  isLocked = false,
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

        {/* Convertir a otro tipo */}
        {onConvertTo && block.type === 'text' && (
          <>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <FileCode className="mr-2 h-4 w-4" />
                Convertir a...
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem onClick={() => onConvertTo('alert')}>
                  Alerta
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onConvertTo('code')}>
                  Código
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onConvertTo('text')}>
                  Texto
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
          </>
        )}

        {/* Estilos */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            Estilo
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {onChangeAlignment && (
              <>
                <ContextMenuItem onClick={() => onChangeAlignment('left')}>
                  <AlignLeft className="mr-2 h-4 w-4" />
                  Alinear izquierda
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onChangeAlignment('center')}>
                  <AlignCenter className="mr-2 h-4 w-4" />
                  Alinear centro
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onChangeAlignment('right')}>
                  <AlignRight className="mr-2 h-4 w-4" />
                  Alinear derecha
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}
            {onChangeWidth && (
              <>
                <ContextMenuItem onClick={() => onChangeWidth('full')}>
                  <Maximize className="mr-2 h-4 w-4" />
                  Ancho completo
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onChangeWidth('content')}>
                  <Minimize className="mr-2 h-4 w-4" />
                  Ancho contenido
                </ContextMenuItem>
              </>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {/* Herramientas adicionales */}
        {onCheckSpelling && (block.type === 'text' || block.type === 'alert') && (
          <ContextMenuItem onClick={onCheckSpelling}>
            <SpellCheck className="mr-2 h-4 w-4" />
            Revisar ortografía
          </ContextMenuItem>
        )}

        {onCopyAsMarkdown && (
          <ContextMenuItem onClick={onCopyAsMarkdown}>
            <FileCode className="mr-2 h-4 w-4" />
            Copiar como Markdown
          </ContextMenuItem>
        )}

        {onAddComment && (
          <ContextMenuItem onClick={onAddComment}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Agregar comentario
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {/* Visibilidad y bloqueo */}
        {onToggleVisibility && (
          <ContextMenuItem onClick={onToggleVisibility}>
            {isVisible ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Ocultar
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Mostrar
              </>
            )}
          </ContextMenuItem>
        )}

        {onToggleLock && (
          <ContextMenuItem onClick={onToggleLock}>
            {isLocked ? (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Desbloquear
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Bloquear edición
              </>
            )}
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
          disabled={isLocked}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
