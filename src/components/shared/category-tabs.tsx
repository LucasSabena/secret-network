'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Code, 
  Video, 
  Layout, 
  Box, 
  Sparkles,
  Layers,
  Pen,
  Camera,
  Briefcase
} from 'lucide-react';
import { Categoria } from '@/lib/types';

// Mapeo de iconos por slug de categoría
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'programas-de-diseno': Palette,
  'diseño-grafico': Palette,
  'diseno-grafico': Palette,
  'ui-ux': Layout,
  'desarrollo-web': Code,
  'edicion-video': Video,
  'edicion-de-video': Video,
  'modelado-3d': Box,
  'herramientas-ia': Sparkles,
  'animacion': Video,
  'fotografia': Camera,
  'ilustracion': Pen,
  'productividad': Briefcase,
  'default': Layers,
};

function getIconForCategory(slug: string): React.ComponentType<any> {
  return ICON_MAP[slug] || ICON_MAP['default'];
}

type Props = {
  categorias: Categoria[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
};

export function CategoryTabs({ categorias, selectedId, onSelect }: Props) {
  // Fix para hidratación: Solo renderizar después del montaje en el cliente
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll al elemento seleccionado en mobile
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;
    
    const selectedButton = containerRef.current.querySelector('[data-selected="true"]');
    if (selectedButton && window.innerWidth < 768) {
      selectedButton.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'center' 
      });
    }
  }, [selectedId, isMounted]);

  // Durante SSR y primera hidratación, mostrar placeholder sin animaciones
  if (!isMounted) {
    return (
      <div className="mb-8">
        {/* Skeleton loader sin animaciones para SSR */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="px-6 py-3 rounded-xl bg-card border border-border whitespace-nowrap flex-shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <span>Todas</span>
            </div>
          </div>
          {categorias.slice(0, 6).map((cat) => {
            const Icon = getIconForCategory(cat.slug);
            return (
              <div key={cat.id} className="px-6 py-3 rounded-xl bg-card border border-border whitespace-nowrap flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span>{cat.nombre}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Después de la hidratación, renderizar versión completa con animaciones
  return (
    <div className="mb-8">
      {/* Tabs de categorías - Scrolleable horizontal en mobile, wrap en desktop */}
      <div 
        ref={containerRef}
        className="flex gap-3 flex-wrap overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {/* Botón "Todas" */}
        <motion.button
          onClick={() => onSelect(null)}
          data-selected={selectedId === null}
          className={`
            px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex-shrink-0
            ${selectedId === null
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
              : 'bg-card hover:bg-accent border border-border hover:border-primary/50'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            <span>Todas</span>
          </div>
        </motion.button>

        {/* Categorías */}
        {categorias.map((cat) => {
          const Icon = getIconForCategory(cat.slug);
          const isSelected = cat.id === selectedId;
          
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              data-selected={isSelected}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex-shrink-0
                ${isSelected
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'bg-card hover:bg-accent border border-border hover:border-primary/50'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span>{cat.nombre}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
