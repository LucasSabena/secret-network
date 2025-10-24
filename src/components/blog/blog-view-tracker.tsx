// FILE: src/components/blog/blog-view-tracker.tsx
'use client';

import { useEffect } from 'react';
import { trackPostView } from '@/lib/analytics-tracker';

interface BlogViewTrackerProps {
  postId: number;
}

/**
 * Componente para trackear vistas de posts
 * Se monta en la página del post y trackea automáticamente
 */
export function BlogViewTracker({ postId }: BlogViewTrackerProps) {
  useEffect(() => {
    // Trackear vista después de 3 segundos (para evitar bounces)
    const timer = setTimeout(() => {
      trackPostView(postId);
    }, 3000);

    return () => clearTimeout(timer);
  }, [postId]);

  return null; // No renderiza nada
}
