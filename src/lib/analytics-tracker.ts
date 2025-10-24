// FILE: src/lib/analytics-tracker.ts
// Utilidad para trackear eventos de analytics del blog

export type AnalyticsEvent = 'view' | 'click' | 'share' | 'download';

export interface TrackEventParams {
  postId: number;
  eventType: AnalyticsEvent;
  metadata?: Record<string, any>;
}

/**
 * Trackea un evento de analytics
 */
export async function trackEvent({ postId, eventType, metadata }: TrackEventParams): Promise<boolean> {
  try {
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        eventType,
        userAgent: navigator.userAgent,
        referrer: document.referrer || null,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error tracking event:', error);
    return false;
  }
}

/**
 * Trackea una vista de post (con debounce)
 */
let viewTracked = false;
export function trackPostView(postId: number) {
  if (viewTracked) return;
  
  viewTracked = true;
  trackEvent({ postId, eventType: 'view' });
}

/**
 * Trackea un click en CTA
 */
export function trackCTAClick(postId: number, ctaText: string, ctaUrl: string) {
  trackEvent({
    postId,
    eventType: 'click',
    metadata: { ctaText, ctaUrl },
  });
}

/**
 * Trackea un share
 */
export function trackShare(postId: number, platform: string) {
  trackEvent({
    postId,
    eventType: 'share',
    metadata: { platform },
  });
}
