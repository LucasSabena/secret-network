// FILE: src/app/api/analytics/stats/[postId]/route.ts
import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    postId: string;
  }>;
}

/**
 * API para obtener estadísticas de un post
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { postId } = await params;
    const supabase = await createClient();

    // Obtener conteo por tipo de evento
    const { data: events, error } = await supabase
      .from('blog_analytics')
      .select('event_type')
      .eq('post_id', parseInt(postId));

    if (error) {
      console.error('Error fetching analytics:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Contar eventos por tipo
    const stats = {
      views: events?.filter(e => e.event_type === 'view').length || 0,
      clicks: events?.filter(e => e.event_type === 'click').length || 0,
      shares: events?.filter(e => e.event_type === 'share').length || 0,
      total: events?.length || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in analytics stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
