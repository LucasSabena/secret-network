// FILE: src/components/blog/block-renderer.tsx
'use client';

import { Block } from '@/lib/types';
import { ProgramCard } from '@/components/shared/program-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
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
    paragraph: 'text-muted-foreground leading-7 [&:not(:first-child)]:mt-6',
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
    ol: 'my-6 ml-6 list-decimal [&>li]:mt-2',
    quote: 'mt-6 border-l-2 border-primary pl-6 italic',
    code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  }[format];

  // Parsear el contenido para convertir [icon:nombre] en iconos reales
  const contentWithIcons = parseTextWithIcons(content);

  if (format === 'paragraph') {
    return <p className={className}>{contentWithIcons}</p>;
  }
  if (format === 'h1') {
    return <h1 className={className}>{contentWithIcons}</h1>;
  }
  if (format === 'h2') {
    return <h2 className={className}>{contentWithIcons}</h2>;
  }
  if (format === 'h3') {
    return <h3 className={className}>{contentWithIcons}</h3>;
  }
  if (format === 'h4') {
    return <h4 className={className}>{contentWithIcons}</h4>;
  }
  if (format === 'ul') {
    return <ul className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  if (format === 'ol') {
    return <ol className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  if (format === 'quote') {
    return <blockquote className={className}>{contentWithIcons}</blockquote>;
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

    fetchProgram();
  }, [block.data.programId]);

  if (loading) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg" />;
  }

  if (!program) {
    return null;
  }

  // Mapear variant del bloque a variant del ProgramCard
  const cardVariant = 
    block.data.variant === 'large' ? 'large' : 
    block.data.variant === 'small' ? 'small' : 
    'medium';

  return (
    <div className={cn(
      "my-8",
      // Si es small, limitar el ancho máximo (como en la home)
      block.data.variant === 'small' && "max-w-sm"
    )}>
      <ProgramCard program={program} variant={cardVariant} />
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
      <SyntaxHighlighter
        language={block.data.language}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
        {block.data.code}
      </SyntaxHighlighter>
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
        switch (block.type) {
          case 'text':
            return <TextBlockComponent key={block.id} block={block} />;
          case 'program-card':
            return <ProgramCardBlockComponent key={block.id} block={block} />;
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
            return null;
        }
      })}
    </div>
  );
}
