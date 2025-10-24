// FILE: src/components/blog/block-renderer.tsx
'use client';

import { Block } from '@/lib/types';
import { ProgramCard } from '@/components/shared/program-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseTextWithIcons } from '@/lib/icon-renderer';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

interface BlockRendererProps {
  blocks: Block[];
}

// Componente para renderizar un bloque de texto
function TextBlockComponent({ block }: { block: Extract<Block, { type: 'text' }> }) {
  const { format, content } = block.data;
  
  const className = {
    paragraph: 'text-foreground leading-7 [&:not(:first-child)]:mt-6 whitespace-pre-wrap',
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
    ol: 'my-6 ml-6 list-decimal [&>li]:mt-2',
    quote: 'mt-6 border-l-2 border-primary pl-6 italic',
    code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  }[format];

  // Para formatos de texto enriquecido, usar dangerouslySetInnerHTML
  if (format === 'paragraph') {
    return (
      <div 
        className={cn(className, 'prose prose-sm dark:prose-invert max-w-none')}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h1') {
    return (
      <h1 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h2') {
    return (
      <h2 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h3') {
    return (
      <h3 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h4') {
    return (
      <h4 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'ul') {
    return <ul className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  if (format === 'ol') {
    return <ol className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  if (format === 'quote') {
    return (
      <blockquote 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'code') {
    return <code className={className}>{content}</code>;
  }

  return null;
}

// Componente para renderizar tarjeta de programa
function ProgramCardBlockComponent({ block }: { block: Extract<Block, { type: 'program-card' }> }) {
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
    return <div className="animate-pulse bg-muted h-32 rounded-lg my-8" />;
  }

  if (!program) {
    return (
      <div className="my-8 p-4 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
        Selecciona un programa para mostrar
      </div>
    );
  }

  return (
    <div className="my-8 not-prose">
      <ProgramCard program={program} variant="medium" />
    </div>
  );
}

// Componente para renderizar grid de imágenes
function ImagesGridBlockComponent({ block }: { block: Extract<Block, { type: 'images-grid' }> }) {
  if (block.data.images.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      'my-8 not-prose grid gap-4',
      block.data.columns === 2 && 'grid-cols-1 md:grid-cols-2',
      block.data.columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      block.data.columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    )}>
      {block.data.images.map((image, index) => (
        <figure key={index} className="space-y-2">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={image.url}
              alt={image.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {image.caption && (
            <figcaption className="text-sm text-muted-foreground text-center">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

// Componente para renderizar grid de programas
function ProgramsGridBlockComponent({ block }: { block: Extract<Block, { type: 'programs-grid' }> }) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (block.data.programIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data } = await supabaseBrowserClient
        .from('programas')
        .select('*')
        .in('id', block.data.programIds);
      
      if (data) {
        // Ordenar según el orden en programIds
        const ordered = block.data.programIds
          .map(id => data.find(p => p.id === id))
          .filter(Boolean);
        setPrograms(ordered);
      }
      setLoading(false);
    };

    fetchPrograms();
  }, [block.data.programIds]);

  if (loading) {
    return (
      <div className={cn(
        'my-8 grid gap-4',
        block.data.columns === 2 && 'grid-cols-1 md:grid-cols-2',
        block.data.columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        block.data.columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      )}>
        {Array.from({ length: block.data.programIds.length }).map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      'my-8 not-prose grid gap-4',
      block.data.columns === 2 && 'grid-cols-1 md:grid-cols-2',
      block.data.columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      block.data.columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    )}>
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} variant="medium" />
      ))}
    </div>
  );
}

// Componente para renderizar tabs
function TabsBlockComponent({ block }: { block: Extract<Block, { type: 'tabs' }> }) {
  const [activeTab, setActiveTab] = useState(block.data.tabs[0]?.id || '');

  return (
    <div className="my-8 rounded-lg border border-border bg-card p-4">
      {/* Tab Headers */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3 mb-4">
        {block.data.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="prose prose-invert max-w-none">
        {block.data.tabs.map((tab) => {
          const contentWithIcons = parseTextWithIcons(tab.content);
          return (
            <div
              key={tab.id}
              className={activeTab === tab.id ? 'block' : 'hidden'}
            >
              {contentWithIcons}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Componente para renderizar accordion
function AccordionBlockComponent({ block }: { block: Extract<Block, { type: 'accordion' }> }) {
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
    <div className="my-8 space-y-2">
      {block.data.items.map((item) => {
        const isOpen = openItems.has(item.id);
        const contentWithIcons = parseTextWithIcons(item.content);
        return (
          <div key={item.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
            >
              <span>{item.title}</span>
              <svg
                className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="p-4 pt-0 prose prose-invert max-w-none">
                {contentWithIcons}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Componente para renderizar alertas
function AlertBlockComponent({ block }: { block: Extract<Block, { type: 'alert' }> }) {
  const variantConfig = {
    default: { icon: Info, className: '' },
    destructive: { icon: XCircle, className: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive' },
    success: { icon: CheckCircle2, className: 'border-success/50 text-success [&>svg]:text-success' },
    warning: { icon: AlertTriangle, className: 'border-warning/50 text-warning [&>svg]:text-warning' },
  };

  const config = variantConfig[block.data.variant];
  const Icon = config.icon;
  const descriptionWithIcons = parseTextWithIcons(block.data.description);

  return (
    <Alert className={`my-8 ${config.className}`}>
      <Icon className="h-4 w-4" />
      {block.data.title && <AlertTitle>{block.data.title}</AlertTitle>}
      <AlertDescription>{descriptionWithIcons}</AlertDescription>
    </Alert>
  );
}

// Componente para renderizar separadores
function SeparatorBlockComponent({ block }: { block: Extract<Block, { type: 'separator' }> }) {
  return <Separator className={`my-8 ${block.data.style === 'dashed' ? 'border-dashed' : block.data.style === 'dotted' ? 'border-dotted' : ''}`} />;
}

// Componente para renderizar imágenes
function ImageBlockComponent({ block }: { block: Extract<Block, { type: 'image' }> }) {
  return (
    <figure className="my-8">
      <div className="relative w-full h-auto rounded-lg overflow-hidden">
        <Image
          src={block.data.url}
          alt={block.data.alt || ''}
          width={block.data.width || 800}
          height={600}
          className="w-full h-auto"
        />
      </div>
      {block.data.caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {block.data.caption}
        </figcaption>
      )}
    </figure>
  );
}

// Componente para renderizar bloques de código
function CodeBlockComponent({ block }: { block: Extract<Block, { type: 'code' }> }) {
  return (
    <div className="my-8">
      <pre className="rounded-lg text-sm overflow-auto bg-[#1e1e1e] p-4">
        <code className="text-gray-300 font-mono">{block.data.code}</code>
      </pre>
    </div>
  );
}

// Componente principal que renderiza todos los bloques
export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return <p className="text-muted-foreground">No hay contenido para mostrar.</p>;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        try {
          switch (block.type) {
            case 'text':
              return <TextBlockComponent key={block.id} block={block} />;
            case 'program-card':
              return <ProgramCardBlockComponent key={block.id} block={block} />;
            case 'programs-grid':
              return <ProgramsGridBlockComponent key={block.id} block={block} />;
            case 'images-grid':
              return <ImagesGridBlockComponent key={block.id} block={block} />;
            case 'tabs':
              return <TabsBlockComponent key={block.id} block={block} />;
            case 'accordion':
              return <AccordionBlockComponent key={block.id} block={block} />;
            case 'alert':
              return <AlertBlockComponent key={block.id} block={block} />;
            case 'separator':
              return <SeparatorBlockComponent key={block.id} block={block} />;
            case 'image':
              return <ImageBlockComponent key={block.id} block={block} />;
            case 'code':
              return <CodeBlockComponent key={block.id} block={block} />;
            default:
              console.warn('Unknown block type:', (block as any).type);
              return null;
          }
        } catch (error) {
          console.error('Error rendering block:', (block as any).type, error);
          return (
            <div key={block.id} className="p-4 border-2 border-destructive rounded-lg text-destructive">
              Error al renderizar bloque de tipo: {(block as any).type}
            </div>
          );
        }
      })}
    </div>
  );
}
