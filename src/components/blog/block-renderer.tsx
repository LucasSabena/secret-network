// FILE: src/components/blog/block-renderer.tsx
'use client';

import { Block, BlockStyle } from '@/lib/types';
import { ProgramCard } from '@/components/shared/program-card';
import { BlogCard } from '@/components/blog/blog-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  FAQBlockComponent,
  ProsConsBlockComponent,
  FeatureListBlockComponent,
  BeforeAfterBlockComponent,
  IconGridBlockComponent,
  CategoryCardBlockComponent,
} from './new-blocks-renderers';
import {
  AuthorBioBlockComponent,
  PollBlockComponent,
  ProgressBarBlockComponent,
  ChecklistBlockComponent,
  ChangelogBlockComponent,
} from './new-blocks-renderers-part2';
import {
  PricingTableBlockComponent,
  TestimonialBlockComponent,
  TipBoxBlockComponent,
  CTABannerBlockComponent,
  ProductShowcaseBlockComponent,
} from './new-blocks-renderers-part3';
import { Separator } from '@/components/ui/separator';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseTextWithIcons } from '@/lib/icon-renderer';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

// Helper para obtener iconos dinámicamente
const getIcon = (iconName?: string) => {
  try {
    if (!iconName) {
      console.warn('[getIcon] No icon name provided, using HelpCircle');
      return LucideIcons.HelpCircle;
    }
    const Icon = (LucideIcons as any)[iconName];
    if (!Icon) {
      console.warn(`[getIcon] Icon "${iconName}" not found, using HelpCircle`);
      return LucideIcons.HelpCircle;
    }
    return Icon;
  } catch (error) {
    console.error('[getIcon] Error getting icon:', error, 'iconName:', iconName);
    return LucideIcons.HelpCircle;
  }
};

// Helper para aplicar estilos de bloque
function getBlockStyleClasses(style?: BlockStyle): string {
  if (!style) return '';

  const classes: string[] = [];

  if (style.alignment) {
    classes.push({
      left: 'text-left',
      center: 'text-center mx-auto',
      right: 'text-right ml-auto',
    }[style.alignment]);
  }

  if (style.width) {
    classes.push({
      full: 'w-full',
      content: 'max-w-3xl mx-auto',
    }[style.width]);
  }

  return classes.join(' ');
}

interface BlockRendererProps {
  blocks: Block[];
}

// Componente para renderizar un bloque de texto
function TextBlockComponent({ block }: { block: Extract<Block, { type: 'text' }> }) {
  const { format, content } = block.data;
  const styleClasses = getBlockStyleClasses(block.style);

  const className = {
    paragraph: 'text-foreground leading-7 [&:not(:first-child)]:mt-6 whitespace-pre-wrap',
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 text-base font-semibold tracking-tight',
    ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
    ol: 'my-6 ml-6 list-decimal [&>li]:mt-2',
    quote: 'mt-6 border-l-2 border-primary pl-6 italic',
    code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  }[format];

  // Para formatos de texto enriquecido, usar dangerouslySetInnerHTML
  if (format === 'paragraph') {
    return (
      <div
        className={cn(className, styleClasses, 'prose prose-sm dark:prose-invert max-w-none')}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h1') {
    return (
      <h1
        className={cn(className, styleClasses)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h2') {
    return (
      <h2
        className={cn(className, styleClasses)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h3') {
    return (
      <h3
        className={cn(className, styleClasses)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h4') {
    return (
      <h4
        className={cn(className, styleClasses)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h5') {
    return (
      <h5
        className={cn(className, styleClasses)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  if (format === 'h6') {
    return (
      <h6
        className={cn(className, styleClasses)}
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
    <div className="my-8 not-prose">
      {/* Mobile: Scroll horizontal */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {block.data.images.map((image, index) => (
            <figure key={index} className="space-y-2" style={{ width: '280px' }}>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  className="object-cover"
                  sizes="280px"
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
      </div>

      {/* Desktop: Grid normal */}
      <div className={cn(
        'hidden md:grid gap-4',
        block.data.columns === 2 && 'md:grid-cols-2',
        block.data.columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        block.data.columns === 4 && 'md:grid-cols-2 lg:grid-cols-4'
      )}>
        {block.data.images.map((image, index) => (
          <figure key={index} className="space-y-2">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={image.url}
                alt={image.alt || ''}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 50vw, 33vw"
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
    </div>
  );
}

// Componente para renderizar tarjeta de blog
function BlogCardBlockComponent({ block }: { block: Extract<Block, { type: 'blog-card' }> }) {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await supabaseBrowserClient
        .from('blog_posts')
        .select('*')
        .eq('id', block.data.blogId)
        .single();

      setBlog(data);
      setLoading(false);
    };

    if (block.data.blogId) {
      fetchBlog();
    } else {
      setLoading(false);
    }
  }, [block.data.blogId]);

  if (loading) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg my-8" />;
  }

  if (!blog) {
    return (
      <div className="my-8 p-4 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
        Selecciona un blog para mostrar
      </div>
    );
  }

  return (
    <div className="my-8 not-prose">
      <BlogCard post={blog} />
    </div>
  );
}

// Componente para renderizar grid de blogs
function BlogsGridBlockComponent({ block }: { block: Extract<Block, { type: 'blogs-grid' }> }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (block.data.blogIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data } = await supabaseBrowserClient
        .from('blog_posts')
        .select('*')
        .in('id', block.data.blogIds);

      if (data) {
        // Ordenar según el orden en blogIds
        const ordered = block.data.blogIds
          .map(id => data.find(b => b.id === id))
          .filter(Boolean);
        setBlogs(ordered);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, [block.data.blogIds]);

  if (loading) {
    return (
      <div className={cn(
        'my-8 grid gap-4',
        block.data.columns === 2 && 'grid-cols-1 md:grid-cols-2',
        block.data.columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        block.data.columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      )}>
        {Array.from({ length: block.data.blogIds.length }).map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div className="my-8 not-prose">
      {/* Mobile: Scroll horizontal */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {blogs.map((blog) => (
            <div key={blog.id} style={{ width: '280px' }}>
              <BlogCard post={blog} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid normal */}
      <div className={cn(
        'hidden md:grid gap-4',
        block.data.columns === 2 && 'md:grid-cols-2',
        block.data.columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        block.data.columns === 4 && 'md:grid-cols-2 lg:grid-cols-4'
      )}>
        {blogs.map((blog) => (
          <BlogCard key={blog.id} post={blog} />
        ))}
      </div>
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
    <div className="my-8 not-prose">
      {/* Mobile: Scroll horizontal */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {programs.map((program) => (
            <div key={program.id} style={{ width: '280px' }}>
              <ProgramCard program={program} variant="medium" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid normal */}
      <div className={cn(
        'hidden md:grid gap-4',
        block.data.columns === 2 && 'md:grid-cols-2',
        block.data.columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        block.data.columns === 4 && 'md:grid-cols-2 lg:grid-cols-4'
      )}>
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} variant="medium" />
        ))}
      </div>
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
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
          return (
            <div
              key={tab.id}
              className={activeTab === tab.id ? 'block' : 'hidden'}
              dangerouslySetInnerHTML={{ __html: tab.content }}
            />
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
              <div 
                className="p-4 pt-0 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
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

  return (
    <Alert className={`my-8 ${config.className}`}>
      <Icon className="h-4 w-4" />
      {block.data.title && <AlertTitle>{block.data.title}</AlertTitle>}
      <AlertDescription>
        <div 
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: block.data.description }}
        />
      </AlertDescription>
    </Alert>
  );
}

// Componente para renderizar separadores
function SeparatorBlockComponent({ block }: { block: Extract<Block, { type: 'separator' }> }) {
  return <Separator className={`my-8 ${block.data.style === 'dashed' ? 'border-dashed' : block.data.style === 'dotted' ? 'border-dotted' : ''}`} />;
}

// Componente para renderizar imágenes
function ImageBlockComponent({ block }: { block: Extract<Block, { type: 'image' }> }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Validar que haya URL
  if (!block.data.url) {
    return (
      <div className="my-8 p-4 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
        Agrega una imagen
      </div>
    );
  }

  // Bloquear scroll cuando el lightbox está abierto
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  return (
    <>
      <figure className="not-prose">
        <div 
          className="relative w-full h-auto rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={block.data.url}
            alt={block.data.alt || ''}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
        {block.data.caption && (
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            {block.data.caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light"
            onClick={() => setIsLightboxOpen(false)}
          >
            ×
          </button>
          <img
            src={block.data.url}
            alt={block.data.alt || ''}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
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

// Componente para video embed
function VideoBlockComponent({ block }: { block: Extract<Block, { type: 'video' }> }) {
  const { url, platform } = block.data;
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Validar que haya URL
  if (!url) {
    return (
      <div className="my-8 p-4 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
        Agrega una URL de video
      </div>
    );
  }

  // Bloquear scroll cuando el lightbox está abierto
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Detectar si es un video de Cloudinary o directo
  const isCloudinaryVideo = url.includes('cloudinary.com') && url.includes('/video/');
  const isDirectVideo = !url.includes('youtube.com') && !url.includes('youtu.be') &&
    !url.includes('vimeo.com') && !url.includes('loom.com');

  const getEmbedUrl = () => {
    if (platform === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    if (platform === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }
    if (platform === 'loom') {
      const videoId = url.match(/loom\.com\/share\/([^?]+)/)?.[1];
      return videoId ? `https://www.loom.com/embed/${videoId}` : '';
    }
    return '';
  };

  // Si es un video directo (Cloudinary u otro)
  if (isDirectVideo || isCloudinaryVideo) {
    // Para autoplay en móviles, el video DEBE estar muted
    const shouldAutoplay = block.data.autoplay === true;
    const shouldMute = block.data.muted === true || shouldAutoplay;

    return (
      <>
        <figure className="not-prose">
          <div 
            className="relative w-full rounded-lg overflow-hidden bg-muted cursor-pointer group"
            onClick={() => setIsLightboxOpen(true)}
          >
            <video
              src={url}
              controls={block.data.controls !== false}
              autoPlay={shouldAutoplay}
              loop={block.data.loop === true}
              muted={shouldMute}
              playsInline
              className="w-full h-auto"
              preload="metadata"
            >
              Tu navegador no soporta el elemento de video.
            </video>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
          {block.data.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.data.caption}</figcaption>
          )}
        </figure>

        {/* Lightbox */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light"
              onClick={() => setIsLightboxOpen(false)}
            >
              ×
            </button>
            <video
              src={url}
              controls
              autoPlay
              loop={block.data.loop === true}
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        )}
      </>
    );
  }

  // Si es un video de plataforma externa
  const embedUrl = getEmbedUrl();
  
  if (!embedUrl) {
    return (
      <div className="my-8 p-4 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
        URL de video inválida o plataforma no soportada
      </div>
    );
  }

  return (
    <div className="not-prose">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {block.data.caption && (
        <p className="text-center text-sm text-muted-foreground mt-2">{block.data.caption}</p>
      )}
    </div>
  );
}

// Componente para tweet embed
function TweetBlockComponent({ block }: { block: Extract<Block, { type: 'tweet' }> }) {
  return (
    <div className="my-8 flex justify-center">
      <blockquote className="twitter-tweet">
        <a href={block.data.tweetUrl}>Tweet</a>
      </blockquote>
    </div>
  );
}

// Componente para tabla
function TableBlockComponent({ block }: { block: Extract<Block, { type: 'table' }> }) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {block.data.showLeftHeaders && <th className="border p-3 bg-muted"></th>}
            {block.data.headers.map((header, i) => (
              <th key={i} className="border p-3 bg-muted font-semibold text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={block.data.striped && rowIndex % 2 === 1 ? 'bg-muted/50' : ''}>
              {block.data.showLeftHeaders && (
                <th className="border p-3 bg-muted font-semibold text-left">
                  {block.data.leftHeaders?.[rowIndex] || ''}
                </th>
              )}
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border p-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {block.data.showFooter && block.data.footerRow && (
          <tfoot>
            <tr>
              {block.data.showLeftHeaders && <td className="border p-3 bg-muted"></td>}
              {block.data.footerRow.map((cell, i) => (
                <td key={i} className="border p-3 bg-muted font-semibold">
                  {cell}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

// Componente para callout
function CalloutBlockComponent({ block }: { block: Extract<Block, { type: 'callout' }> }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
    green: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
    red: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
    purple: 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-100',
    gray: 'bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-100',
  };

  const Icon = block.data.icon ? getIcon(block.data.icon) : null;

  return (
    <div className={cn('my-6 p-4 border-l-4 rounded-r-lg', colorClasses[block.data.color])}>
      <div className="flex gap-3">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="flex-1 whitespace-pre-wrap">{block.data.content}</div>
      </div>
    </div>
  );
}

// Componente para botón
function ButtonBlockComponent({ block }: { block: Extract<Block, { type: 'button' }> }) {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
  };

  return (
    <div className="my-8 flex justify-center">
      <a
        href={block.data.url}
        target={block.data.openInNewTab ? '_blank' : undefined}
        rel={block.data.openInNewTab ? 'noopener noreferrer' : undefined}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          variantClasses[block.data.variant],
          sizeClasses[block.data.size]
        )}
      >
        {block.data.text}
      </a>
    </div>
  );
}

// Componente para divider con texto
function DividerTextBlockComponent({ block }: { block: Extract<Block, { type: 'divider-text' }> }) {
  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (!block.data.text) {
    return <Separator className={cn('my-8', styleClasses[block.data.style])} />;
  }

  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <span className={cn('w-full border-t', styleClasses[block.data.style])} />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">{block.data.text}</span>
      </div>
    </div>
  );
}

// Componente para quote con autor
function QuoteBlockComponent({ block }: { block: Extract<Block, { type: 'quote' }> }) {
  const variantClasses = {
    default: 'border-l-4 border-primary pl-6 italic',
    bordered: 'border-2 border-primary p-6 rounded-lg',
    highlighted: 'bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg',
  };

  return (
    <blockquote className={cn('my-8', variantClasses[block.data.variant])}>
      <p className="text-lg">{block.data.quote}</p>
      {(block.data.author || block.data.role) && (
        <footer className="mt-4 text-sm text-muted-foreground">
          {block.data.author && <cite className="font-semibold not-italic">{block.data.author}</cite>}
          {block.data.role && <span className="ml-2">— {block.data.role}</span>}
        </footer>
      )}
    </blockquote>
  );
}

// Componente para stats
function StatsBlockComponent({ block }: { block: Extract<Block, { type: 'stats' }> }) {
  console.log('[StatsBlock] Rendering with', block.data.stats.length, 'stats');
  return (
    <div className={cn('my-8 grid gap-4', `grid-cols-1 md:grid-cols-${block.data.columns}`)}>
      {block.data.stats.filter(stat => stat != null).map((stat, i) => {
        try {
          console.log(`[StatsBlock] Stat ${i}:`, { label: stat.label, icon: stat.icon, hasIcon: !!stat.icon });
          const Icon = stat?.icon ? getIcon(stat.icon) : null;
          return (
            <div key={i} className="border rounded-lg p-6 text-center">
              {Icon && (
                <div className="flex justify-center mb-3">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              )}
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
            </div>
          );
        } catch (error) {
          console.error(`[StatsBlock] Error rendering stat ${i}:`, error, stat);
          return (
            <div key={i} className="border rounded-lg p-6 text-center bg-red-50">
              <div className="text-sm text-red-600">Error rendering stat</div>
            </div>
          );
        }
      })}
    </div>
  );
}

// Componente para timeline
function TimelineBlockComponent({ block }: { block: Extract<Block, { type: 'timeline' }> }) {
  return (
    <div className="my-8 space-y-8">
      {block.data.items.map((item, i) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
            {i < block.data.items.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
          </div>
          <div className="flex-1 pb-8">
            <div className="text-sm text-muted-foreground mb-1">{item.date}</div>
            <h4 className="font-semibold mb-2">{item.title}</h4>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente para comparison
function ComparisonBlockComponent({ block }: { block: Extract<Block, { type: 'comparison' }> }) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-3 bg-muted font-semibold text-left">Feature</th>
            {block.data.items.map((item, i) => (
              <th key={i} className="border p-3 bg-muted font-semibold text-center">
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.data.featureLabels.map((label, i) => (
            <tr key={i}>
              <td className="border p-3 font-medium">{label}</td>
              {block.data.items.map((item, j) => (
                <td key={j} className="border p-3 text-center">
                  {typeof item.features[label] === 'boolean' ? (
                    item.features[label] ? '✓' : '✗'
                  ) : (
                    item.features[label]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente para file download
function FileDownloadBlockComponent({ block }: { block: Extract<Block, { type: 'file-download' }> }) {
  return (
    <div className="my-8">
      <a
        href={block.data.fileUrl}
        download
        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
      >
        <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-2xl">
          📄
        </div>
        <div className="flex-1">
          <div className="font-semibold">{block.data.fileName}</div>
          {block.data.description && (
            <div className="text-sm text-muted-foreground">{block.data.description}</div>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            {block.data.fileType && <span>{block.data.fileType}</span>}
            {block.data.fileSize && <span className="ml-2">• {block.data.fileSize}</span>}
          </div>
        </div>
        <div className="text-primary">↓</div>
      </a>
    </div>
  );
}

// Componente para embed genérico
function EmbedBlockComponent({ block }: { block: Extract<Block, { type: 'embed' }> }) {
  return (
    <div className="my-8">
      <div
        className="w-full"
        style={{ height: block.data.height ? `${block.data.height}px` : 'auto' }}
        dangerouslySetInnerHTML={{ __html: block.data.embedCode }}
      />
      {block.data.caption && (
        <p className="text-center text-sm text-muted-foreground mt-2">{block.data.caption}</p>
      )}
    </div>
  );
}

// Componente principal que renderiza todos los bloques
export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return <p className="text-muted-foreground">No hay contenido para mostrar.</p>;
  }

  console.log('[BlockRenderer] Rendering', blocks.length, 'blocks');

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        try {
          console.log(`[BlockRenderer] Block ${index}: type=${block.type}`);
          switch (block.type) {
            case 'text':
              return <TextBlockComponent key={block.id} block={block} />;
            case 'program-card':
              return <ProgramCardBlockComponent key={block.id} block={block} />;
            case 'programs-grid':
              return <ProgramsGridBlockComponent key={block.id} block={block} />;
            case 'blog-card':
              return <BlogCardBlockComponent key={block.id} block={block} />;
            case 'blogs-grid':
              return <BlogsGridBlockComponent key={block.id} block={block} />;
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
            case 'video':
              return <VideoBlockComponent key={block.id} block={block} />;
            case 'tweet':
              return <TweetBlockComponent key={block.id} block={block} />;
            case 'table':
              return <TableBlockComponent key={block.id} block={block} />;
            case 'callout':
              return <CalloutBlockComponent key={block.id} block={block} />;
            case 'button':
              return <ButtonBlockComponent key={block.id} block={block} />;
            case 'divider-text':
              return <DividerTextBlockComponent key={block.id} block={block} />;
            case 'quote':
              return <QuoteBlockComponent key={block.id} block={block} />;
            case 'stats':
              return <StatsBlockComponent key={block.id} block={block} />;
            case 'timeline':
              return <TimelineBlockComponent key={block.id} block={block} />;
            case 'comparison':
              return <ComparisonBlockComponent key={block.id} block={block} />;
            case 'file-download':
              return <FileDownloadBlockComponent key={block.id} block={block} />;
            case 'embed':
              return <EmbedBlockComponent key={block.id} block={block} />;
            case 'faq':
              return <FAQBlockComponent key={block.id} block={block} />;
            case 'pros-cons':
              return <ProsConsBlockComponent key={block.id} block={block} />;
            case 'feature-list':
              return <FeatureListBlockComponent key={block.id} block={block} />;
            case 'before-after':
              return <BeforeAfterBlockComponent key={block.id} block={block} />;
            case 'icon-grid':
              return <IconGridBlockComponent key={block.id} block={block} />;
            case 'category-card':
              return <CategoryCardBlockComponent key={block.id} block={block} />;
            case 'author-bio':
              return <AuthorBioBlockComponent key={block.id} block={block} />;
            case 'poll':
              return <PollBlockComponent key={block.id} block={block} />;
            case 'progress-bar':
              return <ProgressBarBlockComponent key={block.id} block={block} />;
            case 'checklist':
              return <ChecklistBlockComponent key={block.id} block={block} />;
            case 'changelog':
              return <ChangelogBlockComponent key={block.id} block={block} />;
            case 'pricing-table':
              return <PricingTableBlockComponent key={block.id} block={block} />;
            case 'testimonial':
              return <TestimonialBlockComponent key={block.id} block={block} />;
            case 'tip-box':
              return <TipBoxBlockComponent key={block.id} block={block} />;
            case 'cta-banner':
              return <CTABannerBlockComponent key={block.id} block={block} />;
            case 'product-showcase':
              return <ProductShowcaseBlockComponent key={block.id} block={block} />;
            default:
              console.warn('[BlockRenderer] Unknown block type:', (block as any).type);
              return null;
          }
        } catch (error) {
          console.error('[BlockRenderer] Error rendering block:', {
            index,
            type: (block as any).type,
            id: block.id,
            error,
            blockData: block
          });
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
