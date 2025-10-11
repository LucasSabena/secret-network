// FILE: src/components/blog/blog-content.tsx

'use client';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div 
      className="prose prose-neutral dark:prose-invert max-w-none mb-12"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
