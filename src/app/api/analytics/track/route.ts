// FILE: src/app/api/analytics/track/route.ts
import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API para trackear eventos de analytics
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, eventType, userAgent, referrer, metadata, timestamp } = body;

    // Validación básica
    if (!postId || !eventType) {
      return NextResponse.json(
        { error: 'postId and eventType are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insertar evento
    const { error } = await supabase
      .from('blog_analytics')
      .insert({
        post_id: postId,
        event_type: eventType,
        user_agent: userAgent,
        referrer: referrer,
        metadata: metadata || {},
        created_at: timestamp || new Date().toISOString(),
      });

    if (error) {
      console.error('Error inserting analytics:', error);
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in analytics track:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
