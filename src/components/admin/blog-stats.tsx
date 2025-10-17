'use client';

import { useMemo } from 'react';
import { Clock, FileText, Image } from 'lucide-react';

interface BlogStatsProps {
  content: string;
}

export default function BlogStats({ content }: BlogStatsProps) {
  const stats = useMemo(() => {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, ' ');
    
    // Count words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Calculate reading time (average 200 words per minute in Spanish)
    const readingTime = Math.max(1, Math.ceil(words / 200));
    
    // Count images in HTML
    const images = (content.match(/<img/g) || []).length;
    
    // Count links
    const links = (content.match(/<a /g) || []).length;
    
    return { words, readingTime, images, links };
  }, [content]);

  if (stats.words === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border rounded-lg p-3 bg-muted/20">
      <div className="flex items-center gap-1.5">
        <FileText className="h-4 w-4" />
        <span>{stats.words} palabras</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        <span>{stats.readingTime} min de lectura</span>
      </div>
      {stats.images > 0 && (
        <div className="flex items-center gap-1.5">
          <Image className="h-4 w-4" />
          <span>{stats.images} {stats.images === 1 ? 'imagen' : 'imágenes'}</span>
        </div>
      )}
    </div>
  );
}
