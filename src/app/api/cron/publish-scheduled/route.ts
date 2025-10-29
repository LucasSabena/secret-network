// FILE: src/app/api/cron/publish-scheduled/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Endpoint de cron para publicar posts programados
 * Se ejecuta cada hora via Vercel Cron
 */
export async function GET(request: Request) {
  try {
    // Verificar authorization header (opcional pero recomendado)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Solo verificar si CRON_SECRET está configurado
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Usar cliente directo de Supabase sin cookies (para cron jobs)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const now = new Date().toISOString();

    // Buscar posts programados cuya fecha ya pasó
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, titulo, scheduled_for')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now);

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({ 
        message: 'No posts to publish',
        published: 0 
      });
    }

    // Publicar posts usando su fecha programada original
    const updates = scheduledPosts.map(post => 
      supabase
        .from('blog_posts')
        .update({ 
          status: 'published',
          publicado: true,
          fecha_publicacion: post.scheduled_for, // Usar la fecha programada
        })
        .eq('id', post.id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(r => r.error);

    if (errors.length > 0) {
      console.error('Error publishing some posts:', errors);
      return NextResponse.json({ 
        error: 'Some posts failed to publish',
        details: errors 
      }, { status: 500 });
    }

    console.log(`Published ${scheduledPosts.length} posts:`, scheduledPosts.map(p => p.titulo));

    return NextResponse.json({
      message: 'Posts published successfully',
      published: scheduledPosts.length,
      posts: scheduledPosts.map(p => ({ id: p.id, titulo: p.titulo })),
    });
  } catch (error) {
    console.error('Error in publish-scheduled cron:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
