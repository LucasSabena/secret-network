// Script para actualizar los posts de ejemplo y reemplazar emojis con iconos
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function updatePosts() {
  console.log('🔄 Actualizando posts para reemplazar emojis con iconos...\n');

  // Obtener los posts existentes
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .in('slug', ['mejores-paginas-404-creatividad-diseno', 'ia-herramientas-disenadores-web-workflow']);

  if (error || !posts) {
    console.error('❌ Error obteniendo posts:', error);
    return;
  }

  for (const post of posts) {
    const blocks = post.contenido_bloques;
    let updated = false;

    // Recorrer todos los bloques de tipo 'text' y reemplazar emojis
    const updatedBlocks = blocks.map(block => {
      if (block.type === 'text' && block.data.content) {
        let content = block.data.content;
        
        // Mapeo de emojis comunes a iconos de Lucide
        const replacements = {
          '🎨': '[icon:palette]',
          '✨': '[icon:sparkles]',
          '🚀': '[icon:rocket]',
          '💡': '[icon:lightbulb]',
          '🎯': '[icon:target]',
          '⚡': '[icon:zap]',
          '👀': '[icon:eye]',
          '🔍': '[icon:search]',
          '💻': '[icon:monitor]',
          '📱': '[icon:smartphone]',
          '⏱️': '[icon:clock]',
          '📅': '[icon:calendar]',
          '✅': '[icon:check-circle]',
          '❌': '[icon:x-circle]',
          '⚠️': '[icon:alert-triangle]',
          'ℹ️': '[icon:info]',
          '❤️': '[icon:heart]',
          '⭐': '[icon:star]',
          '🏆': '[icon:award]',
          '📈': '[icon:trending-up]',
          '➡️': '[icon:arrow-right]',
          '⬅️': '[icon:arrow-left]',
          '🔗': '[icon:external-link]',
          '📦': '[icon:package]',
          '🎁': '[icon:box]',
          '🖱️': '[icon:mouse]',
          '⚙️': '[icon:settings]',
          '🔧': '[icon:wrench]',
          '📧': '[icon:mail]',
          '💬': '[icon:message-square]',
          '🌐': '[icon:globe]',
          '📸': '[icon:image]',
          '🖌️': '[icon:brush]',
          '✏️': '[icon:pen]',
          '📐': '[icon:grid]',
        };

        for (const [emoji, icon] of Object.entries(replacements)) {
          if (content.includes(emoji)) {
            content = content.replaceAll(emoji, icon);
            updated = true;
          }
        }

        return { ...block, data: { ...block.data, content } };
      }
      return block;
    });

    if (updated) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ contenido_bloques: updatedBlocks })
        .eq('id', post.id);

      if (updateError) {
        console.error(`❌ Error actualizando post "${post.titulo}":`, updateError);
      } else {
        console.log(`✅ Post actualizado: "${post.titulo}"`);
      }
    } else {
      console.log(`ℹ️ Post sin cambios: "${post.titulo}"`);
    }
  }

  console.log('\n🎉 ¡Actualización completada!');
}

updatePosts();
