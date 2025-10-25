'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBlockIcon, getBlockLabel, getBlockPreview } from '../utils/block-helpers';

interface BlockListItemProps {
  block: Block;
  index: number;
  isSelected: boolean;
  isChecked: boolean;
  isCollapsed: boolean;
  onSelect: () => void;
  onToggleCheck: () => void;
  onToggleCollapse: () => void;
}

export function BlockListItem({
  block,
  index,
  isSelected,
  isChecked,
  isCollapsed,
  onSelect,
  onToggleCheck,
  onToggleCollapse,
}: BlockListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'block-reorder',
      block,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const BlockIcon = getBlockIcon(block.type);
  const label = getBlockLabel(block.type);
  const preview = getBlockPreview(block);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group rounded-md border transition-all',
        isDragging && 'opacity-50 z-50',
        isSelected && 'border-primary bg-primary/5',
        !isSelected && 'border-transparent hover:border-border hover:bg-accent'
      )}
    >
      <div className="flex items-start gap-2 p-2">
        {/* Checkbox */}
        <Checkbox
          checked={isChecked}
          onCheckedChange={onToggleCheck}
          className="mt-1"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Drag handle */}
        <button
          type="button"
          className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none"
          aria-label="Arrastrar bloque"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Contenido del bloque */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={onSelect}
        >
          <div className="flex items-center gap-2 mb-1">
            <BlockIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium">{label}</span>
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
          </div>

          {!isCollapsed && preview && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {preview}
            </p>
          )}
        </div>

        {/* Toggle collapse */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
          aria-label={isCollapsed ? 'Expandir bloque' : 'Colapsar bloque'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
