// FILE: src/components/admin/blog-editor-v2/sidebar-tools.tsx
'use client';

import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BLOCK_TOOLS, BLOCK_CATEGORIES } from './block-tools';
import { cn } from '@/lib/utils';
import { ChevronDown, Search, X, Heart } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const FAVORITES_KEY = 'blog-editor-favorite-blocks';

export function SidebarTools() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['favorites', ...Object.keys(BLOCK_CATEGORIES)])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Cargar favoritos desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Guardar favoritos en localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (blockId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(blockId)) {
      newFavorites.delete(blockId);
    } else {
      newFavorites.add(blockId);
    }
    saveFavorites(newFavorites);
  };

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  // Filtrar bloques según búsqueda y agregar favoritos
  const filteredTools = useMemo(() => {
    const tools = searchQuery.trim()
      ? BLOCK_TOOLS.filter(tool => {
          const query = searchQuery.toLowerCase();
          return (
            tool.label.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.type.toLowerCase().includes(query)
          );
        })
      : BLOCK_TOOLS;

    // Agregar bloques favoritos a la categoría 'favorites'
    return tools.map(tool => ({
      ...tool,
      category: (favorites.has(tool.id) ? 'favorites' : tool.category) as typeof tool.category,
    }));
  }, [searchQuery, favorites]);

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

        if (categoryTools.length === 0 && categoryKey !== 'favorites') return null;

        const isExpanded = displayCategories.has(categoryKey);

        return (
          <div key={categoryKey} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full flex items-center justify-between p-3 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{category.icon}</span>
                <h4 className={cn('text-xs font-medium', category.color)}>
                  {category.label} ({categoryTools.length})
                </h4>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isExpanded ? 'rotate-180' : ''
                )}
              />
            </button>
            {isExpanded && (
              <div className="p-2 space-y-2 bg-muted/30">
                {categoryKey === 'favorites' && categoryTools.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Haz clic en el ❤️ de tus bloques favoritos para verlos aquí
                  </p>
                ) : (
                  categoryTools.map((tool) => (
                    <DraggableBlockTool
                      key={tool.id}
                      tool={tool}
                      isFavorite={favorites.has(tool.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DraggableBlockTool({
  tool,
  isFavorite,
  onToggleFavorite,
}: {
  tool: typeof BLOCK_TOOLS[0];
  isFavorite: boolean;
  onToggleFavorite: (blockId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tool-${tool.id}`,
    data: { type: tool.type, isNew: true },
  });

  const Icon = tool.icon;

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'p-3 transition-all hover:border-primary hover:shadow-md relative group',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          {...listeners}
          {...attributes}
          className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 cursor-grab active:cursor-grabbing"
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-medium">{tool.label}</h5>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {tool.description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(tool.id);
          }}
          className={cn(
            'shrink-0 p-1 rounded transition-all',
            isFavorite
              ? 'text-rose-500 hover:text-rose-600'
              : 'text-muted-foreground/40 hover:text-rose-500 opacity-0 group-hover:opacity-100'
          )}
          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </button>
      </div>
    </Card>
  );
}
