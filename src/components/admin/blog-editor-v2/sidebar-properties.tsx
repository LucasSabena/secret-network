// FILE: src/components/admin/blog-editor-v2/sidebar-properties.tsx
'use client';

import { Block } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Settings, Info } from 'lucide-react';
import { BLOCK_TOOLS } from './block-tools';

interface SidebarPropertiesProps {
  selectedBlock: Block | null;
}

export function SidebarProperties({ selectedBlock }: SidebarPropertiesProps) {
  if (!selectedBlock) {
    return (
      <div className="h-full overflow-y-auto p-4">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
            <Info className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">Sin selección</h3>
          <p className="text-sm text-muted-foreground">
            Selecciona un bloque en el canvas para ver y editar sus propiedades
          </p>
        </Card>
      </div>
    );
  }

  const tool = BLOCK_TOOLS.find((t) => t.type === selectedBlock.type);
  const Icon = tool?.icon || Settings;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{tool?.label || 'Bloque'}</h3>
            <p className="text-xs text-muted-foreground">{tool?.description}</p>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
          Información
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium">{selectedBlock.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono text-[10px]">
              {selectedBlock.id.substring(0, 12)}...
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
          Ayuda
        </h4>
        <div className="text-xs text-muted-foreground space-y-2">
          <p>
            Haz clic en el bloque en el canvas para editarlo. Los cambios se
            guardan automáticamente.
          </p>
          <p>
            Usa el ícono de arrastre para reordenar los bloques.
          </p>
        </div>
      </Card>
    </div>
  );
}
