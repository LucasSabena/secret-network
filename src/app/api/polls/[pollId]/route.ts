import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Obtener resultados del poll
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    const { pollId } = await params;

    // Obtener el poll
    const { data: poll, error } = await supabase
      .from('blog_polls')
      .select('*')
      .eq('poll_id', pollId)
      .single();

    if (error || !poll) {
      return NextResponse.json(
        { error: 'Poll no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(poll);
  } catch (error) {
    console.error('Error al obtener poll:', error);
    return NextResponse.json(
      { error: 'Error al obtener poll' },
      { status: 500 }
    );
  }
}

// POST - Votar en el poll
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    const { pollId } = await params;
    const body = await request.json();
    const { optionId, fingerprint } = body;

    if (!optionId || !fingerprint) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Obtener IP del cliente
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';

    // Verificar si ya votó
    const { data: existingVote } = await supabase
      .from('blog_poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('voter_fingerprint', fingerprint)
      .single();

    if (existingVote) {
      return NextResponse.json(
        { error: 'Ya has votado en esta encuesta' },
        { status: 409 }
      );
    }

    // Registrar el voto
    const { error: voteError } = await supabase
      .from('blog_poll_votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        voter_fingerprint: fingerprint,
        voter_ip: ip,
      });

    if (voteError) {
      console.error('Error al registrar voto:', voteError);
      return NextResponse.json(
        { error: 'Error al registrar voto' },
        { status: 500 }
      );
    }

    // Obtener el poll actual
    const { data: poll } = await supabase
      .from('blog_polls')
      .select('*')
      .eq('poll_id', pollId)
      .single();

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar contadores
    const options = poll.options.map((opt: any) => {
      if (opt.id === optionId) {
        return { ...opt, votes: (opt.votes || 0) + 1 };
      }
      return opt;
    });

    const totalVotes = poll.total_votes + 1;

    // Guardar actualización
    const { data: updatedPoll, error: updateError } = await supabase
      .from('blog_polls')
      .update({
        options,
        total_votes: totalVotes,
      })
      .eq('poll_id', pollId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar poll:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar poll' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      poll: updatedPoll,
    });
  } catch (error) {
    console.error('Error al votar:', error);
    return NextResponse.json(
      { error: 'Error al procesar voto' },
      { status: 500 }
    );
  }
}

// PUT - Crear o actualizar poll (solo para el editor)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    const { pollId } = await params;
    const body = await request.json();
    const { question, options } = body;

    if (!question || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    // Preparar opciones con votos en 0
    const formattedOptions = options.map((opt: any) => ({
      id: opt.id,
      text: opt.text,
      votes: 0,
    }));

    // Verificar si el poll ya existe
    const { data: existingPoll } = await supabase
      .from('blog_polls')
      .select('id')
      .eq('poll_id', pollId)
      .single();

    if (existingPoll) {
      // Actualizar poll existente
      const { data, error } = await supabase
        .from('blog_polls')
        .update({
          question,
          options: formattedOptions,
        })
        .eq('poll_id', pollId)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar poll:', error);
        return NextResponse.json(
          { error: 'Error al actualizar poll' },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Crear nuevo poll
      const { data, error } = await supabase
        .from('blog_polls')
        .insert({
          poll_id: pollId,
          question,
          options: formattedOptions,
          total_votes: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Error al crear poll:', error);
        return NextResponse.json(
          { error: 'Error al crear poll' },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error al crear/actualizar poll:', error);
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
}
