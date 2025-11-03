import { createClient } from '@/lib/supabase';
import { postToLinkedIn, generateLinkedInSnippet, isLinkedInConfigured } from '@/lib/linkedin-api';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint para publicar un blog
 * Se ejecuta cuando un blog pasa de borrador (publicado: false) a publicado (publicado: true)
 * Automáticamente postea en LinkedIn si está configurado
 */
export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID requerido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Obtener datos del post
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (fetchError || !post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el post no esté ya publicado
    if (post.publicado) {
      return NextResponse.json(
        { error: 'El post ya está publicado' },
        { status: 400 }
      );
    }

    // Actualizar estado a publicado
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ 
        publicado: true,
        fecha_publicacion: new Date().toISOString()
      })
      .eq('id', postId);

    if (updateError) {
      throw updateError;
    }

    // Auto-post a LinkedIn si está configurado
    let linkedInResult = null;
    if (isLinkedInConfigured()) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://secretnetwork.co';
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      
      const snippet = generateLinkedInSnippet(
        post.titulo,
        post.descripcion_corta || '',
        200
      );

      linkedInResult = await postToLinkedIn({
        title: post.titulo,
        description: snippet,
        url: postUrl,
        imageUrl: post.imagen_portada_url || undefined
      });

      // Log del resultado (no fallar si LinkedIn falla)
      if (linkedInResult.success) {
        console.log('✅ Post publicado en LinkedIn:', linkedInResult.id);
      } else {
        console.warn('⚠️ Error al publicar en LinkedIn:', linkedInResult.error);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Post publicado exitosamente',
      linkedIn: linkedInResult
    });

  } catch (error: any) {
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { error: 'Error al publicar el post' },
      { status: 500 }
    );
  }
}
