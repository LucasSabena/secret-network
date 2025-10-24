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
        'relative transition-all duration-200',
        isOver ? 'h-16 my-2' : 'h-2'
      )}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-dashed border-primary rounded-lg animate-pulse">
            <Plus className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Soltar aquí
            </span>
          </div>
        </div>
      )}
      {!isOver && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity">
          <div className="h-1 w-full bg-primary/30 rounded" />
        </div>
      )}
    </div>
  );
}
