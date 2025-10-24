// FILE: src/components/admin/blog-editor-v2/canvas-block.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLOCK_TOOLS } from './block-tools';
import { BlockContextMenu } from './block-context-menu';
import { ContextMenuTrigger } from '@/components/ui/context-menu';

interface CanvasBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  children: React.ReactNode;
}

export function CanvasBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}: CanvasBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { type: block.type, isNew: false },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const tool = BLOCK_TOOLS.find((t) => t.type === block.type);
  const Icon = tool?.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(block));
  };

  const handleCut = () => {
    navigator.clipboard.writeText(JSON.stringify(block));
    onDelete();
  };

  return (
    <BlockContextMenu
      block={block}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onCopy={handleCopy}
      onCut={handleCut}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            'group relative',
            isDragging && 'opacity-50 z-50'
          )}
        >
          <Card
        onClick={onSelect}
        className={cn(
          'p-4 transition-all cursor-pointer',
          isSelected
            ? 'ring-2 ring-primary border-primary shadow-lg'
            : 'hover:border-primary/50 hover:shadow-md'
        )}
      >
        {/* Toolbar superior */}
        <div
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background border rounded-lg px-2 py-1 shadow-md transition-opacity',
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 cursor-grab active:cursor-grabbing"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-3 w-3" />
          </Button>

          {Icon && (
            <div className="px-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="h-3 w-3" />
              <span>{tool?.label}</span>
            </div>
          )}

          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Contenido del bloque */}
        <div className="min-h-[60px]">{children}</div>
      </Card>
        </div>
      </ContextMenuTrigger>
    </BlockContextMenu>
  );
}
