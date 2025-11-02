// FILE: src/components/admin/blog-editor-v2/sidebar-tools.tsx
'use client';

import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BLOCK_TOOLS, BLOCK_CATEGORIES } from './block-tools';
import { cn } from '@/lib/utils';
import { ChevronDown, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

export function SidebarTools() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(BLOCK_CATEGORIES))
  );
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  // Filtrar bloques según búsqueda
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return BLOCK_TOOLS;
    
    const query = searchQuery.toLowerCase();
    return BLOCK_TOOLS.filter(tool => 
      tool.label.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Auto-expandir categorías cuando hay búsqueda
  const displayCategories = useMemo(() => {
    if (searchQuery.trim()) {
      return new Set(Object.keys(BLOCK_CATEGORIES));
    }
    return expandedCategories;
  }, [searchQuery, expandedCategories]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
          Bloques Disponibles
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Arrastra los bloques al canvas para construir tu post
        </p>
        
        {/* Buscador */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar bloques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-9 text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Contador de resultados */}
        {searchQuery && (
          <p className="text-xs text-muted-foreground mb-3">
            {filteredTools.length} {filteredTools.length === 1 ? 'resultado' : 'resultados'}
          </p>
        )}
      </div>

      {Object.entries(BLOCK_CATEGORIES).map(([categoryKey, category]) => {
        const categoryTools = filteredTools.filter(
          (tool) => tool.category === categoryKey
        );

        if (categoryTools.length === 0) return null;

        const isExpanded = displayCategories.has(categoryKey);

        return (
          <div key={categoryKey} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full flex items-center justify-between p-3 hover:bg-accent transition-colors"
            >
              <h4 className={cn('text-xs font-medium', category.color)}>
                {category.label} ({categoryTools.length})
              </h4>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isExpanded ? 'rotate-180' : ''
                )}
              />
            </button>
            {isExpanded && (
              <div className="p-2 space-y-2 bg-muted/30">
                {categoryTools.map((tool) => (
                  <DraggableBlockTool key={tool.id} tool={tool} />
                ))}
              </div>
            )}
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
