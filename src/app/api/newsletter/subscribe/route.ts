import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'Este email ya está suscrito' },
          { status: 400 }
        );
      }
      
      // Reactivar suscripción
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          status: 'active',
          unsubscribed_at: null,
          subscribed_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) throw error;

      return NextResponse.json({ 
        success: true,
        message: 'Suscripción reactivada exitosamente' 
      });
    }

    // Crear nueva suscripción
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name: name || null,
        source: source || 'unknown',
        status: 'active',
      });

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: 'Suscripción exitosa' 
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    );
  }
}
