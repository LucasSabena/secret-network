// FILE: src/components/admin/blog-editor-v2/sidebar-tools.tsx
'use client';

import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { BLOCK_TOOLS, BLOCK_CATEGORIES } from './block-tools';
import { cn } from '@/lib/utils';

export function SidebarTools() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Bloques Disponibles
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Arrastra los bloques al canvas para construir tu post
        </p>
      </div>

      {Object.entries(BLOCK_CATEGORIES).map(([categoryKey, category]) => {
        const categoryTools = BLOCK_TOOLS.filter(
          (tool) => tool.category === categoryKey
        );

        if (categoryTools.length === 0) return null;

        return (
          <div key={categoryKey}>
            <h4 className={cn('text-xs font-medium mb-2', category.color)}>
              {category.label}
            </h4>
            <div className="space-y-2">
              {categoryTools.map((tool) => (
                <DraggableBlockTool key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DraggableBlockTool({ tool }: { tool: typeof BLOCK_TOOLS[0] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tool-${tool.id}`,
    data: { type: tool.type, isNew: true },
  });

  const Icon = tool.icon;

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'p-3 cursor-grab active:cursor-grabbing transition-all hover:border-primary hover:shadow-md',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-medium">{tool.label}</h5>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {tool.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
