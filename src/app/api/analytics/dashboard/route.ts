// FILE: src/app/api/analytics/dashboard/route.ts
import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API para obtener estadísticas del dashboard
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Obtener todos los eventos
    const { data: events, error: eventsError } = await supabase
      .from('blog_analytics')
      .select('post_id, event_type');

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    // Calcular estadísticas
    const totalViews = events?.filter(e => e.event_type === 'view').length || 0;
    const totalClicks = events?.filter(e => e.event_type === 'click').length || 0;
    const totalShares = events?.filter(e => e.event_type === 'share').length || 0;

    // Contar vistas por post
    const viewsByPost = events
      ?.filter(e => e.event_type === 'view')
      .reduce((acc, event) => {
        acc[event.post_id] = (acc[event.post_id] || 0) + 1;
        return acc;
      }, {} as Record<number, number>) || {};

    // Obtener top 5 posts
    const topPostIds = Object.entries(viewsByPost)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => parseInt(id));

    let topPosts: Array<{ id: number; titulo: string; views: number }> = [];
    if (topPostIds.length > 0) {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, titulo')
        .in('id', topPostIds);

      topPosts = posts?.map(post => ({
        id: post.id,
        titulo: post.titulo,
        views: viewsByPost[post.id] || 0,
      })).sort((a, b) => b.views - a.views) || [];
    }

    // Contar posts únicos con eventos
    const uniquePosts = new Set(events?.map(e => e.post_id) || []).size;

    return NextResponse.json({
      totalViews,
      totalClicks,
      totalShares,
      totalPosts: uniquePosts,
      topPosts,
    });
  } catch (error) {
    console.error('Error in analytics dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
