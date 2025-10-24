'use client';

import { useEffect } from 'react';

interface BlogAnalyticsTrackerProps {
  postId: number;
}

/**
 * Componente para trackear vistas de posts del blog
 * Se ejecuta automáticamente cuando se monta el componente
 */
export function BlogAnalyticsTracker({ postId }: BlogAnalyticsTrackerProps) {
  useEffect(() => {
    // Trackear vista del post
    const trackView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId,
            eventType: 'view',
            referrer: document.referrer || undefined,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        // Silenciar errores de tracking para no afectar UX
        console.debug('Analytics tracking failed:', error);
      }
    };

    trackView();
  }, [postId]);

  // Este componente no renderiza nada
  return null;
}
