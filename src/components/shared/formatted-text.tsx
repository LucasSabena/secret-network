// FILE: src/components/shared/formatted-text.tsx

import React from 'react';

interface FormattedTextProps {
  text: string | null | undefined;
  className?: string;
}

/**
 * FormattedText Component
 * 
 * Takes plain text and automatically formats it for better readability:
 * - Splits into paragraphs (double line breaks)
 * - Detects and creates lists (lines starting with -, *, or numbers)
 * - Highlights key phrases (text between asterisks: *important*)
 * - Adds color to emphasized text (text between underscores: _key point_)
 * - Applies bold to important keywords
 * 
 * No need to modify the database - works with plain text!
 */
export function FormattedText({ text, className = '' }: FormattedTextProps) {
  if (!text) {
    return <p className={className}>No hay descripción disponible.</p>;
  }

  // Split text into blocks (paragraphs, lists, etc.)
  const blocks = parseText(text);

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

// Types for parsed content
type BlockType = 'paragraph' | 'list' | 'heading';

interface TextBlock {
  type: BlockType;
  content: string | string[];
}

/**
 * Parse plain text into structured blocks
 */
function parseText(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  
  // Split by double line breaks for paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    
    // Check if it's a list (multiple lines starting with -, *, or numbers)
    const lines = trimmed.split('\n');
    const listItems = lines.filter(line => 
      /^[-*•]\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())
    );
    
    if (listItems.length > 1) {
      // It's a list
      blocks.push({
        type: 'list',
        content: listItems.map(item => item.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim())
      });
    } else {
      // It's a paragraph
      blocks.push({
        type: 'paragraph',
        content: trimmed
      });
    }
  }
  
  return blocks;
}

/**
 * Render a single block based on its type
 */
function renderBlock(block: TextBlock, index: number): React.ReactNode {
  switch (block.type) {
    case 'list':
      return (
        <ul key={index} className="space-y-2 list-disc list-inside pl-4">
          {(block.content as string[]).map((item, i) => (
            <li key={i} className="text-muted-foreground leading-relaxed">
              {formatInlineText(item)}
            </li>
          ))}
        </ul>
      );
    
    case 'paragraph':
    default:
      return (
        <p key={index} className="text-muted-foreground leading-relaxed">
          {formatInlineText(block.content as string)}
        </p>
      );
  }
}

/**
 * Format inline text with bold, highlights, and emphasis
 */
function formatInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Patterns to match:
  // *text* for bold/important
  // _text_ for highlighted/emphasized
  // **text** for extra important (bold + colored)
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }
    
    const matched = match[0];
    const content = matched.replace(/^(\*\*|\*|_)|(\*\*|\*|_)$/g, '');
    
    if (matched.startsWith('**')) {
      // Extra important: bold + primary color
      parts.push(
        <strong key={match.index} className="font-bold text-primary">
          {content}
        </strong>
      );
    } else if (matched.startsWith('*')) {
      // Important: bold
      parts.push(
        <strong key={match.index} className="font-semibold">
          {content}
        </strong>
      );
    } else if (matched.startsWith('_')) {
      // Emphasized: highlighted background
      parts.push(
        <span key={match.index} className="bg-primary/10 text-primary px-1 py-0.5 rounded">
          {content}
        </span>
      );
    }
    
    currentIndex = match.index + matched.length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }
  
  return parts.length > 0 ? parts : [text];
}
