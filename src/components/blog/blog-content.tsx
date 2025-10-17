// FILE: src/components/blog/blog-content.tsx

'use client';

import { Block } from '@/lib/types';
import { BlockRenderer } from './block-renderer';

interface BlogContentProps {
  content?: string; // Legacy HTML content
  blocks?: Block[]; // New block-based content
}

export function BlogContent({ content, blocks }: BlogContentProps) {
  // Priorizar bloques sobre contenido legacy
  if (blocks && blocks.length > 0) {
    return (
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
        <BlockRenderer blocks={blocks} />
      </div>
    );
  }

  // Fallback a contenido HTML legacy
  if (content) {
    return (
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return <p className="text-muted-foreground">No hay contenido disponible.</p>;
}
