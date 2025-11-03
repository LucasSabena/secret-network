'use client';

/**
 * Renderizadores para los nuevos bloques - Parte 4
 * Reddit, TOC, Newsletter, Gist, Mermaid, Math, Spotify, Instagram, Notification
 */

import { Block } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, AlertCircle, Info, AlertTriangle, Megaphone, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Helper para obtener iconos
const getIcon = (iconName: string) => {
  try {
    if (!iconName) return LucideIcons.HelpCircle;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.HelpCircle;
  } catch {
    return LucideIcons.HelpCircle;
  }
};

// ============================================================================
// REDDIT POST RENDERER
// ============================================================================
export function RedditPostBlockComponent({ block }: { block: Extract<Block, { type: 'reddit-post' }> }) {
  return (
    <div className="my-8 border rounded-lg p-4 bg-white dark:bg-gray-900 max-w-2xl">
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="font-semibold text-orange-500">r/{block.data.subreddit || 'subreddit'}</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">
          Posted by u/{block.data.username || 'username'}
        </span>
        {block.data.date && (
          <>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{block.data.date}</span>
          </>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-3">{block.data.title || 'Post Title'}</h3>
      
      {block.data.content && (
        <div 
          className="text-sm mb-4 prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: block.data.content }}
        />
      )}
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3">
        <span className="flex items-center gap-1">
          <span className="text-orange-500">↑</span> {block.data.upvotes || 0}
        </span>
        <span className="flex items-center gap-1">
          💬 {block.data.comments || 0} comments
        </span>
        {block.data.postUrl && (
          <a 
            href={block.data.postUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary"
          >
            🔗 Ver en Reddit
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// TABLE OF CONTENTS RENDERER
// ============================================================================
export function TOCBlockComponent({ block }: { block: Extract<Block, { type: 'toc' }> }) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Extraer headings del documento
    const levels = block.data.levels || [2, 3];
    const selector = levels.map(l => `h${l}`).join(', ');
    const elements = document.querySelectorAll(selector);
    
    const extracted = Array.from(elements).map((el, idx) => {
      const id = el.id || `heading-${idx}`;
      if (!el.id) el.id = id;
      
      return {
        id,
        text: el.textContent || '',
        level: parseInt(el.tagName.substring(1)),
      };
    });
    
    setHeadings(extracted);
  }, [block.data.levels]);

  if (headings.length === 0) {
    return (
      <div className="my-8 p-4 border rounded-lg bg-muted/30 text-center text-sm text-muted-foreground">
        No se encontraron encabezados para generar la tabla de contenidos
      </div>
    );
  }

  return (
    <div className={cn(
      'my-8 border rounded-lg p-6 bg-card',
      block.data.sticky && 'sticky top-4'
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {block.data.title || 'Tabla de Contenidos'}
        </h3>
        {block.data.collapsible && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? 'Expandir' : 'Colapsar'}
          </button>
        )}
      </div>
      
      {!isCollapsed && (
        <nav className="space-y-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                'block text-sm hover:text-primary transition-colors',
                heading.level === 2 && 'font-medium',
                heading.level === 3 && 'pl-4',
                heading.level === 4 && 'pl-8'
              )}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}

// ============================================================================
// NEWSLETTER SIGNUP RENDERER
// ============================================================================
export function NewsletterBlockComponent({ block }: { block: Extract<Block, { type: 'newsletter' }> }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name: block.data.showName ? name : undefined,
          source: window.location.pathname 
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage(block.data.successMessage || '¡Gracias por suscribirte!');
        setEmail('');
        setName('');
      } else {
        const error = await response.json();
        setStatus('error');
        setMessage(error.message || 'Error al suscribirse');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión');
    }
  };

  const variants = {
    default: 'border rounded-lg p-6',
    minimal: 'p-4',
    card: 'border-2 border-primary rounded-lg p-8 bg-primary/5',
  };

  return (
    <div className={cn('my-8', variants[block.data.variant || 'card'])}>
      {status === 'success' ? (
        <div className="text-center">
          <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-semibold">{message}</p>
        </div>
      ) : (
        <>
          {block.data.title && (
            <h3 className="text-xl font-semibold mb-2">{block.data.title}</h3>
          )}
          {block.data.description && (
            <p className="text-muted-foreground mb-4">{block.data.description}</p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {block.data.showName && (
              <Input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={block.data.placeholder || 'tu@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Enviando...' : (block.data.buttonText || 'Suscribirse')}
              </Button>
            </div>
            {status === 'error' && (
              <p className="text-sm text-destructive">{message}</p>
            )}
          </form>
        </>
      )}
    </div>
  );
}

// ============================================================================
// GITHUB GIST RENDERER
// ============================================================================
export function GistBlockComponent({ block }: { block: Extract<Block, { type: 'gist' }> }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar script de GitHub Gist
    const script = document.createElement('script');
    const gistId = block.data.gistUrl.split('/').pop()?.replace('.js', '');
    script.src = `https://gist.github.com/${gistId}.js${block.data.file ? `?file=${block.data.file}` : ''}`;
    script.async = true;
    script.onload = () => setLoading(false);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [block.data.gistUrl, block.data.file]);

  if (!block.data.gistUrl) {
    return (
      <div className="my-8 p-4 border rounded-lg bg-muted/30 text-center text-sm text-muted-foreground">
        Ingresa una URL de GitHub Gist
      </div>
    );
  }

  return (
    <div className="my-8">
      {loading && <div className="animate-pulse bg-muted h-64 rounded-lg" />}
      <div id={`gist-${block.id}`} />
    </div>
  );
}

// ============================================================================
// MERMAID DIAGRAM RENDERER
// ============================================================================
export function MermaidBlockComponent({ block }: { block: Extract<Block, { type: 'mermaid' }> }) {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    // Renderizar diagrama Mermaid
    const renderDiagram = async () => {
      try {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.mermaid) {
          // @ts-ignore
          const { svg } = await window.mermaid.render(`mermaid-${block.id}`, block.data.code);
          setSvg(svg);
        }
      } catch (error) {
        console.error('Error rendering Mermaid:', error);
      }
    };

    renderDiagram();
  }, [block.data.code, block.id]);

  return (
    <div className="my-8">
      <div 
        className="border rounded-lg p-6 bg-card overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {block.data.caption && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          {block.data.caption}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// MATH/LATEX RENDERER
// ============================================================================
export function MathBlockComponent({ block }: { block: Extract<Block, { type: 'math' }> }) {
  return (
    <div className={cn(
      'my-8',
      block.data.display === 'block' && 'text-center'
    )}>
      <div 
        className={cn(
          'katex-display',
          block.data.display === 'inline' && 'inline-block'
        )}
      >
        {/* KaTeX renderizará esto */}
        {block.data.formula}
      </div>
      {block.data.caption && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          {block.data.caption}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// SPOTIFY EMBED RENDERER
// ============================================================================
export function SpotifyBlockComponent({ block }: { block: Extract<Block, { type: 'spotify' }> }) {
  const getEmbedUrl = () => {
    const url = block.data.spotifyUrl;
    if (!url) return '';
    
    // Convertir URL de Spotify a embed URL
    const match = url.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="my-8 p-4 border rounded-lg bg-muted/30 text-center text-sm text-muted-foreground">
        Ingresa una URL de Spotify
      </div>
    );
  }

  return (
    <div className="my-8">
      <iframe
        src={embedUrl}
        width="100%"
        height={block.data.height || 152}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
      />
    </div>
  );
}

// ============================================================================
// INSTAGRAM POST RENDERER
// ============================================================================
export function InstagramBlockComponent({ block }: { block: Extract<Block, { type: 'instagram' }> }) {
  return (
    <div className="my-8 border rounded-lg overflow-hidden bg-white dark:bg-gray-900 max-w-md mx-auto">
      {block.data.imageUrl && (
        <img 
          src={block.data.imageUrl} 
          alt={block.data.caption || 'Instagram post'}
          className="w-full aspect-square object-cover"
        />
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500" />
          <span className="font-semibold">@{block.data.username || 'username'}</span>
        </div>
        
        {block.data.caption && (
          <p className="text-sm mb-3">
            <span className="font-semibold">@{block.data.username} </span>
            {block.data.caption}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>❤️ {block.data.likes || 0} likes</span>
          {block.data.date && <span>{block.data.date}</span>}
          {block.data.postUrl && (
            <a 
              href={block.data.postUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-auto hover:text-primary"
            >
              Ver en Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// NOTIFICATION BANNER RENDERER
// ============================================================================
export function NotificationBlockComponent({ block }: { block: Extract<Block, { type: 'notification' }> }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const typeConfig = {
    info: {
      icon: Info,
      className: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
    },
    success: {
      icon: Check,
      className: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
    },
    error: {
      icon: AlertCircle,
      className: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
    },
    announcement: {
      icon: Megaphone,
      className: 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-100',
    },
  };

  const config = typeConfig[block.data.type];
  const IconComponent = block.data.icon ? getIcon(block.data.icon) : config.icon;

  return (
    <div className={cn('my-8 border-2 rounded-lg p-4', config.className)}>
      <div className="flex items-start gap-3">
        <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          {block.data.title && (
            <h4 className="font-semibold mb-1">{block.data.title}</h4>
          )}
          <p className="text-sm">{block.data.message}</p>
          
          {block.data.actionUrl && block.data.actionText && (
            <a
              href={block.data.actionUrl}
              className="inline-block mt-2 text-sm font-medium underline hover:no-underline"
            >
              {block.data.actionText} →
            </a>
          )}
        </div>
        
        {block.data.dismissible && (
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
