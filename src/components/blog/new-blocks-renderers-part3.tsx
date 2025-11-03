'use client';

/**
 * Renderizadores para los nuevos bloques en el frontend - Parte 3
 */

import { Block } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Check, Star, AlertTriangle, Info, Lightbulb, AlertCircle, CheckCircle, Megaphone } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ProgramCard } from '@/components/shared/program-card';

// Helper para obtener iconos dinámicamente
const getIcon = (iconName: string) => {
  try {
    if (!iconName) {
      console.warn('[new-blocks-renderers-part3 getIcon] No icon name provided');
      return LucideIcons.HelpCircle;
    }
    
    console.log('[new-blocks-renderers-part3 getIcon] Looking for icon:', iconName);
    const Icon = (LucideIcons as any)[iconName];
    
    if (!Icon) {
      console.warn(`[new-blocks-renderers-part3 getIcon] Icon "${iconName}" not found in LucideIcons`);
      return LucideIcons.HelpCircle;
    }
    
    console.log('[new-blocks-renderers-part3 getIcon] Icon found successfully:', iconName);
    return Icon;
  } catch (error) {
    console.error('[new-blocks-renderers-part3 getIcon] Error:', error, 'iconName:', iconName);
    return LucideIcons.HelpCircle;
  }
};

// ============================================================================
// PRICING TABLE RENDERER
// ============================================================================
export function PricingTableBlockComponent({ block }: { block: Extract<Block, { type: 'pricing-table' }> }) {
  return (
    <div className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {block.data.plans.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            'border rounded-lg p-6 flex flex-col',
            plan.highlighted && 'border-primary shadow-lg scale-105 bg-primary/5'
          )}
        >
          {plan.highlighted && (
            <div className="text-xs font-semibold text-primary uppercase mb-2 text-center">
              Más Popular
            </div>
          )}
          <h3 
            className="text-2xl font-bold mb-2"
            dangerouslySetInnerHTML={{ __html: plan.name }}
          />
          <div className="mb-4">
            <span className="text-4xl font-bold">{plan.price}</span>
            {plan.period && (
              <span className="text-muted-foreground">{plan.period}</span>
            )}
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: feature }} />
              </li>
            ))}
          </ul>
          {plan.ctaUrl && (
            <a
              href={plan.ctaUrl}
              className={cn(
                'block text-center py-3 px-6 rounded-lg font-medium transition-colors',
                plan.highlighted
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
              )}
            >
              {plan.ctaText || 'Comenzar'}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// TESTIMONIAL RENDERER
// ============================================================================
export function TestimonialBlockComponent({ block }: { block: Extract<Block, { type: 'testimonial' }> }) {
  return (
    <div className="my-8 border rounded-lg p-8 bg-muted/30">
      <div className="flex gap-4 mb-4">
        {block.data.avatar && (
          <img
            src={block.data.avatar}
            alt={block.data.author}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {block.data.rating && (
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < block.data.rating!
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-lg italic mb-4">"{block.data.quote}"</p>
          <div>
            <p 
              className="font-semibold"
              dangerouslySetInnerHTML={{ __html: block.data.author }}
            />
            {block.data.role && (
              <p className="text-sm text-muted-foreground">
                {block.data.role}
                {block.data.company && ` en ${block.data.company}`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TIP BOX RENDERER
// ============================================================================
export function TipBoxBlockComponent({ block }: { block: Extract<Block, { type: 'tip-box' }> }) {
  console.log('[TipBoxBlock] Rendering with data:', JSON.stringify(block.data));
  
  const typeConfig = {
    tip: {
      icon: Lightbulb,
      className: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
      iconClassName: 'text-blue-600 dark:text-blue-400',
      title: 'Consejo',
    },
    warning: {
      icon: AlertTriangle,
      className: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
      iconClassName: 'text-yellow-600 dark:text-yellow-400',
      title: 'Advertencia',
    },
    danger: {
      icon: AlertCircle,
      className: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
      iconClassName: 'text-red-600 dark:text-red-400',
      title: 'Peligro',
    },
    info: {
      icon: Info,
      className: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
      iconClassName: 'text-blue-600 dark:text-blue-400',
      title: 'Información',
    },
    success: {
      icon: CheckCircle,
      className: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
      iconClassName: 'text-green-600 dark:text-green-400',
      title: 'Éxito',
    },
  };

  const config = typeConfig[block.data.type] || typeConfig.info; // Fallback a 'info' si el tipo no existe
  console.log('[TipBoxBlock] Config:', config, 'Type:', block.data.type, 'Custom icon:', block.data.icon);
  
  if (!config) {
    console.error('[TipBoxBlock] Config is undefined! block.data:', block.data);
    return null;
  }
  
  const IconComponent = block.data.icon ? getIcon(block.data.icon) : config.icon;

  return (
    <div className={cn('my-8 border-l-4 rounded-r-lg p-6', config.className)}>
      <div className="flex gap-4">
        <IconComponent className={cn('h-6 w-6 flex-shrink-0', config.iconClassName)} />
        <div className="flex-1">
          {block.data.title && (
            <h4 
              className="font-semibold mb-2"
              dangerouslySetInnerHTML={{ __html: block.data.title }}
            />
          )}
          <div 
            className="text-sm prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: block.data.content }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CTA BANNER RENDERER
// ============================================================================
export function CTABannerBlockComponent({ block }: { block: Extract<Block, { type: 'cta-banner' }> }) {
  return (
    <div
      className="my-8 rounded-lg overflow-hidden relative"
      style={{
        backgroundColor: block.data.backgroundColor || '#3b82f6',
      }}
    >
      {block.data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${block.data.backgroundImage})` }}
        />
      )}
      <div className="relative p-12 text-center text-white">
        <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h2 
          className="text-3xl font-bold mb-3"
          dangerouslySetInnerHTML={{ __html: block.data.title }}
        />
        {block.data.description && (
          <div 
            className="text-lg mb-6 opacity-90 max-w-2xl mx-auto prose prose-invert"
            dangerouslySetInnerHTML={{ __html: block.data.description }}
          />
        )}
        <a
          href={block.data.ctaUrl}
          className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {block.data.ctaText}
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// PRODUCT SHOWCASE RENDERER
// ============================================================================
export function ProductShowcaseBlockComponent({ block }: { block: Extract<Block, { type: 'product-showcase' }> }) {
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      const { data } = await supabaseBrowserClient
        .from('programas')
        .select('*')
        .eq('id', block.data.programId)
        .single();

      setProgram(data);
      setLoading(false);
    };

    if (block.data.programId) {
      fetchProgram();
    } else {
      setLoading(false);
    }
  }, [block.data.programId]);

  if (loading) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg my-8" />;
  }

  if (!program) {
    return null;
  }

  return (
    <div className="my-8 border-2 border-primary rounded-lg p-8 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center gap-4 mb-4">
            {program.icono_url && (
              <img
                src={program.icono_url}
                alt={program.nombre}
                className="w-16 h-16 rounded-lg"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold">{program.nombre}</h3>
              {program.descripcion_corta && (
                <p className="text-sm text-muted-foreground">
                  {program.descripcion_corta}
                </p>
              )}
            </div>
          </div>

          {block.data.features && block.data.features.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Características destacadas:</h4>
              <ul className="space-y-2">
                {block.data.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={`/programas/${program.slug}`}
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {block.data.ctaText || 'Ver más'}
          </a>
        </div>

        {program.captura_url && (
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src={program.captura_url}
              alt={`Captura de ${program.nombre}`}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
