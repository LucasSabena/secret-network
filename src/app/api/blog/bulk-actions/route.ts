// FILE: src/app/api/blog/bulk-actions/route.ts
import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API para acciones masivas en posts
 */
export async function POST(request: Request) {
  try {
    const { action, postIds } = await request.json();

    if (!action || !postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let updateData: any = {};

    switch (action) {
      case 'publish':
        updateData = {
          publicado: true,
          status: 'published',
          fecha_publicacion: new Date().toISOString(),
        };
        break;

      case 'unpublish':
        updateData = {
          publicado: false,
          status: 'draft',
        };
        break;

      case 'archive':
        updateData = {
          status: 'archived',
          publicado: false,
        };
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from('blog_posts')
          .delete()
          .in('id', postIds);

        if (deleteError) {
          console.error('Error deleting posts:', deleteError);
          return NextResponse.json(
            { error: 'Failed to delete posts' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `${postIds.length} posts deleted`,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Actualizar posts
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .in('id', postIds);

    if (updateError) {
      console.error('Error updating posts:', updateError);
      return NextResponse.json(
        { error: 'Failed to update posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${postIds.length} posts updated`,
    });
  } catch (error) {
    console.error('Error in bulk actions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
