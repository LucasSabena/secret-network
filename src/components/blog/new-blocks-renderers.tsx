'use client';

/**
 * Renderizadores para los nuevos bloques en el frontend
 */

import { Block } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Check, X, ChevronDown, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';

// Helper para obtener iconos dinámicamente
const getIcon = (iconName: string) => {
  try {
    if (!iconName) {
      console.warn('[new-blocks-renderers getIcon] No icon name provided');
      return LucideIcons.HelpCircle;
    }
    const Icon = (LucideIcons as any)[iconName];
    if (!Icon) {
      console.warn(`[new-blocks-renderers getIcon] Icon "${iconName}" not found`);
      return LucideIcons.HelpCircle;
    }
    return Icon;
  } catch (error) {
    console.error('[new-blocks-renderers getIcon] Error:', error, 'iconName:', iconName);
    return LucideIcons.HelpCircle;
  }
};

// ============================================================================
// FAQ RENDERER
// ============================================================================
export function FAQBlockComponent({ block }: { block: Extract<Block, { type: 'faq' }> }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="my-8 space-y-3" itemScope itemType="https://schema.org/FAQPage">
      {block.data.items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
            >
              <span itemProp="name">{item.question}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 transition-transform flex-shrink-0 ml-2',
                  isOpen ? 'rotate-180' : ''
                )}
              />
            </button>
            {isOpen && (
              <div
                className="p-4 pt-0 text-muted-foreground"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div 
                  itemProp="text"
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// PROS & CONS RENDERER
// ============================================================================
export function ProsConsBlockComponent({ block }: { block: Extract<Block, { type: 'pros-cons' }> }) {
  return (
    <div className="my-8">
      {block.data.title && (
        <h3 className="text-xl font-semibold mb-4 text-center">{block.data.title}</h3>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-green-50 dark:bg-green-950">
          <h4 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-300 flex items-center gap-2">
            <Check className="h-5 w-5" />
            Ventajas
          </h4>
          <ul className="space-y-2">
            {block.data.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div 
                  className="flex-1 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: pro }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-950">
          <h4 className="text-lg font-semibold mb-4 text-red-700 dark:text-red-300 flex items-center gap-2">
            <X className="h-5 w-5" />
            Desventajas
          </h4>
          <ul className="space-y-2">
            {block.data.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <X className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div 
                  className="flex-1 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: con }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE LIST RENDERER
// ============================================================================
export function FeatureListBlockComponent({ block }: { block: Extract<Block, { type: 'feature-list' }> }) {
  return (
    <div
      className={cn(
        'my-8 grid gap-6',
        block.data.columns === 2 && 'md:grid-cols-2',
        block.data.columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        block.data.columns === 4 && 'md:grid-cols-2 lg:grid-cols-4'
      )}
    >
      {block.data.features.filter(feature => feature != null).map((feature) => {
        const Icon = getIcon(feature?.icon || 'Check'); // Fallback a 'Check' si no hay icon
        return (
          <div key={feature.id} className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{feature.title}</h4>
              {feature.description && (
                <div 
                  className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// BEFORE/AFTER RENDERER
// ============================================================================
export function BeforeAfterBlockComponent({ block }: { block: Extract<Block, { type: 'before-after' }> }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div className="my-8">
      <div
        className="relative w-full aspect-video rounded-lg overflow-hidden cursor-ew-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <img
            src={block.data.afterImage}
            alt={block.data.afterLabel || 'Después'}
            className="w-full h-full object-cover"
          />
          {block.data.afterLabel && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
              {block.data.afterLabel}
            </div>
          )}
        </div>

        {/* Before Image (Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={block.data.beforeImage}
            alt={block.data.beforeLabel || 'Antes'}
            className="w-full h-full object-cover"
          />
          {block.data.beforeLabel && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
              {block.data.beforeLabel}
            </div>
          )}
        </div>

        {/* Slider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-gray-600" />
              <div className="w-0.5 h-4 bg-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ICON GRID RENDERER
// ============================================================================
export function IconGridBlockComponent({ block }: { block: Extract<Block, { type: 'icon-grid' }> }) {
  return (
    <div
      className={cn(
        'my-8 grid gap-6',
        block.data.columns === 2 && 'md:grid-cols-2',
        block.data.columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        block.data.columns === 4 && 'md:grid-cols-2 lg:grid-cols-4'
      )}
    >
      {block.data.items.filter(item => item != null).map((item) => {
        const Icon = getIcon(item?.icon || 'Star'); // Fallback a 'Star' si no hay icon
        return (
          <div key={item.id} className="text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-3">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">{item.title}</h4>
            {item.description && (
              <div 
                className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// CATEGORY CARD RENDERER
// ============================================================================
export function CategoryCardBlockComponent({ block }: { block: Extract<Block, { type: 'category-card' }> }) {
  const [category, setCategory] = useState<any>(null);
  const [programCount, setProgramCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      const { data: catData } = await supabaseBrowserClient
        .from('categorias')
        .select('*')
        .eq('id', block.data.categoryId)
        .single();

      if (catData) {
        setCategory(catData);

        // Contar programas en esta categoría
        const { count } = await supabaseBrowserClient
          .from('programas')
          .select('*', { count: 'exact', head: true })
          .eq('categoria_id', block.data.categoryId);

        setProgramCount(count || 0);
      }
      setLoading(false);
    };

    if (block.data.categoryId) {
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [block.data.categoryId]);

  if (loading) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg my-8" />;
  }

  if (!category) {
    return null;
  }

  return (
    <div className="my-8">
      <a
        href={`/programas/categoria/${category.slug}`}
        className="block border rounded-lg p-6 hover:border-primary transition-colors"
      >
        <div className="flex items-center gap-4">
          {category.icono && (
            <div className="text-4xl">{category.icono}</div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{category.nombre}</h3>
            {category.descripcion && (
              <p className="text-sm text-muted-foreground mb-2">{category.descripcion}</p>
            )}
            <p className="text-sm text-primary">{programCount} programas</p>
          </div>
        </div>
      </a>
    </div>
  );
}

// Continúa en el siguiente archivo...
