// FILE: src/components/admin/blog-editor-v2/zen-mode-toggle.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ZenModeToggleProps {
  onToggle: (isZen: boolean) => void;
}

/**
 * Toggle para activar/desactivar modo zen (oculta sidebar y distracciones)
 */
export function ZenModeToggle({ onToggle }: ZenModeToggleProps) {
  const [isZen, setIsZen] = useState(false);

  const handleToggle = () => {
    const newZenState = !isZen;
    setIsZen(newZenState);
    onToggle(newZenState);

    // Ocultar/mostrar elementos de la UI
    if (newZenState) {
      document.body.classList.add('zen-mode');
    } else {
      document.body.classList.remove('zen-mode');
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="gap-2"
        title={isZen ? 'Salir de modo zen' : 'Activar modo zen'}
      >
        {isZen ? (
          <>
            <Minimize2 className="h-4 w-4" />
            Salir Zen
          </>
        ) : (
          <>
            <Maximize2 className="h-4 w-4" />
            Modo Zen
          </>
        )}
      </Button>

      {/* Estilos para modo zen */}
      <style jsx global>{`
        .zen-mode {
          /* Ocultar elementos innecesarios */
        }
        .zen-mode .sidebar {
          display: none !important;
        }
        .zen-mode .header-actions {
          opacity: 0.3;
          transition: opacity 0.2s;
        }
        .zen-mode .header-actions:hover {
          opacity: 1;
        }
      `}</style>
    </>
  );
}
