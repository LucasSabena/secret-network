import React from 'react';

interface FormattedTextProps {
  text: string | null | undefined;
  className?: string;
}

export function FormattedText({ text, className = '' }: FormattedTextProps) {
  if (!text) {
    return <p className={className}>No hay descripción disponible.</p>;
  }

  return (
    <div 
      className={`prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8 prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6 prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5 prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-primary prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ol:my-4 prose-li:text-foreground/90 prose-li:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-secondary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded -Force{className}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
