// FILE: src/components/admin/blog-bulk-actions.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2, Eye, EyeOff, FolderOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BlogBulkActionsProps {
  selectedIds: number[];
  onActionComplete: () => void;
  onClearSelection: () => void;
}

/**
 * Acciones masivas para posts seleccionados
 */
export function BlogBulkActions({
  selectedIds,
  onActionComplete,
  onClearSelection,
}: BlogBulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (selectedIds.length === 0) return null;

  const handleBulkAction = async (action: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/blog/bulk-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          postIds: selectedIds,
        }),
      });

      if (!response.ok) throw new Error('Error en acción masiva');

      toast({
        title: 'Acción completada',
        description: `${selectedIds.length} posts actualizados`,
      });

      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error('Error in bulk action:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar la acción',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
      <span className="text-sm font-medium">
        {selectedIds.length} seleccionado{selectedIds.length > 1 ? 's' : ''}
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            Acciones
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleBulkAction('publish')}>
            <Eye className="mr-2 h-4 w-4" />
            Publicar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkAction('unpublish')}>
            <EyeOff className="mr-2 h-4 w-4" />
            Despublicar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Archivar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleBulkAction('delete')}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        disabled={isLoading}
      >
        Cancelar
      </Button>
    </div>
  );
}
