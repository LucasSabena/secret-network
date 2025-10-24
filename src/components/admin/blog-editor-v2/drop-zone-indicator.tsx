// FILE: src/components/admin/blog-editor-v2/drop-zone-indicator.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface DropZoneIndicatorProps {
  id: string;
  index: number;
}

export function DropZoneIndicator({ id, index }: DropZoneIndicatorProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'drop-zone',
      index,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative h-2 -my-1 transition-all duration-200',
        isOver && 'h-12 my-2'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-all duration-200',
          isOver
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-dashed border-primary rounded-lg">
          <Plus className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Soltar aquí
          </span>
        </div>
      </div>
      {!isOver && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="h-0.5 w-full bg-border" />
        </div>
      )}
    </div>
  );
}
