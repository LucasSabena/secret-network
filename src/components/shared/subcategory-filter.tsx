'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { X, Filter } from 'lucide-react';
import { Categoria } from '@/lib/types';

type Props = {
  subcategorias: Categoria[];
  selectedSubIds: number[]; // Cambiado de selectedSubId a array
  onSelect: (ids: number[]) => void; // Cambiado para manejar múltiples
  useAndOperator: boolean;
  onToggleOperator: (useAnd: boolean) => void;
};

export function SubcategoryFilter({ 
  subcategorias, 
  selectedSubIds, 
  onSelect,
  useAndOperator,
  onToggleOperator 
}: Props) {
  // Fix para hidratación: Solo renderizar después del montaje en el cliente
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>(selectedSubIds);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sincronizar estado temporal con el estado real
  useEffect(() => {
    setTempSelectedIds(selectedSubIds);
  }, [selectedSubIds]);

  if (subcategorias.length === 0) return null;

  // Función para toggle de subcategoría
  const toggleSubcategory = (id: number) => {
    if (selectedSubIds.includes(id)) {
      // Remover
      onSelect(selectedSubIds.filter(subId => subId !== id));
    } else {
      // Agregar
      onSelect([...selectedSubIds, id]);
    }
  };

  // Función para toggle en modal (estado temporal)
  const toggleTempSubcategory = (id: number) => {
    if (tempSelectedIds.includes(id)) {
      setTempSelectedIds(tempSelectedIds.filter(subId => subId !== id));
    } else {
      setTempSelectedIds([...tempSelectedIds, id]);
    }
  };

  // Aplicar selección del modal
  const applyModalSelection = () => {
    onSelect(tempSelectedIds);
    setIsModalOpen(false);
  };

  // Cancelar y resetear
  const cancelModal = () => {
    setTempSelectedIds(selectedSubIds);
    setIsModalOpen(false);
  };

  // Durante SSR, mostrar versión simple sin animaciones
  if (!isMounted) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            Subcategorías:
          </span>
          
          {/* Switch AND/OR */}
          {selectedSubIds.length > 1 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={!useAndOperator ? 'font-medium text-foreground' : ''}>
                Cualquiera
              </span>
              <Switch 
                checked={useAndOperator} 
                onCheckedChange={onToggleOperator}
                aria-label="Cambiar operador lógico"
              />
              <span className={useAndOperator ? 'font-medium text-foreground' : ''}>
                Todas
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {subcategorias.map((subcat) => {
            const isSelected = selectedSubIds.includes(subcat.id);
            
            return (
              <Badge
                key={subcat.id}
                variant={isSelected ? 'default' : 'outline'}
                className={`
                  cursor-pointer transition-all px-3 py-1.5 whitespace-nowrap flex-shrink-0
                  ${isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : ''
                  }
                `}
              >
                <span>{subcat.nombre}</span>
                {isSelected && (
                  <X className="ml-1.5 h-3 w-3" />
                )}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  }

  // Después de la hidratación, versión completa con animaciones
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            Subcategorías:
          </span>
          
          {/* Switch AND/OR - Solo mostrar cuando hay más de 1 seleccionada */}
          {selectedSubIds.length > 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span className={!useAndOperator ? 'font-medium text-primary' : ''}>
                Cualquiera (OR)
              </span>
              <Switch 
                checked={useAndOperator} 
                onCheckedChange={onToggleOperator}
                aria-label="Cambiar entre modo OR y AND"
              />
              <span className={useAndOperator ? 'font-medium text-primary' : ''}>
                Todas (AND)
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Vista Mobile: Solo botón "Ver todas" */}
        <div className="md:hidden">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {selectedSubIds.length === 0 
                    ? 'Seleccionar subcategorías' 
                    : `${selectedSubIds.length} seleccionada${selectedSubIds.length > 1 ? 's' : ''}`
                  }
                </span>
                {selectedSubIds.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedSubIds.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filtrar por subcategorías</DialogTitle>
                <DialogDescription>
                  Selecciona una o varias subcategorías para filtrar los programas.
                </DialogDescription>
              </DialogHeader>

              {/* Switch AND/OR en modal */}
              {tempSelectedIds.length > 1 && (
                <div className="flex items-center justify-center gap-2 py-2 text-sm bg-muted/50 rounded-lg">
                  <span className={!useAndOperator ? 'font-medium text-primary' : 'text-muted-foreground'}>
                    Cualquiera (OR)
                  </span>
                  <Switch 
                    checked={useAndOperator} 
                    onCheckedChange={onToggleOperator}
                  />
                  <span className={useAndOperator ? 'font-medium text-primary' : 'text-muted-foreground'}>
                    Todas (AND)
                  </span>
                </div>
              )}

              {/* Grid de subcategorías */}
              <div className="grid grid-cols-2 gap-2 py-4">
                {subcategorias.map((subcat) => {
                  const isSelected = tempSelectedIds.includes(subcat.id);
                  
                  return (
                    <Badge
                      key={subcat.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`
                        cursor-pointer transition-all px-3 py-2.5 text-center justify-center
                        ${isSelected 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'hover:bg-accent hover:border-primary/50'
                        }
                      `}
                      onClick={() => toggleTempSubcategory(subcat.id)}
                    >
                      <span className="text-xs">{subcat.nombre}</span>
                    </Badge>
                  );
                })}
              </div>

              <DialogFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={cancelModal}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={applyModalSelection}
                  className="flex-1"
                >
                  Aplicar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vista Desktop: Scroll horizontal como antes */}
        <div className="hidden md:flex gap-2 flex-wrap">
          {subcategorias.map((subcat) => {
            const isSelected = selectedSubIds.includes(subcat.id);
            
            return (
              <Badge
                key={subcat.id}
                variant={isSelected ? 'default' : 'outline'}
                className={`
                  cursor-pointer transition-all px-3 py-1.5 whitespace-nowrap
                  ${isSelected 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'hover:bg-accent hover:border-primary/50'
                  }
                `}
                onClick={() => toggleSubcategory(subcat.id)}
              >
                <span>{subcat.nombre}</span>
                {isSelected && (
                  <X className="ml-1.5 h-3 w-3" />
                )}
              </Badge>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
