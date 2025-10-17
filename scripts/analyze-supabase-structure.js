const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeStructure() {
  console.log('\n=== ANÁLISIS DE ESTRUCTURA SUPABASE ===\n');

  try {
    // Obtener tablas y su estructura
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      console.log('No se pudo obtener lista de tablas directamente.');
      console.log('Probando con tablas conocidas...\n');
      
      // Probar tablas conocidas
      const knownTables = ['programas', 'categorias', 'blog_posts', 'plataformas'];
      
      for (const table of knownTables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (!error && data) {
            console.log(`✓ Tabla: ${table}`);
            if (data[0]) {
              console.log('  Columnas:', Object.keys(data[0]).join(', '));
            }
            console.log('');
          }
        } catch (e) {
          console.log(`✗ Tabla ${table} no encontrada`);
        }
      }
    }

    // Verificar estructura de blog_posts
    console.log('\n=== ESTRUCTURA DE blog_posts ===');
    const { data: blogPost } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
    
    if (blogPost && blogPost[0]) {
      console.log('Columnas actuales:');
      Object.entries(blogPost[0]).forEach(([key, value]) => {
        console.log(`  - ${key}: ${typeof value}`);
      });
    }

    console.log('\n=== ANÁLISIS COMPLETADO ===\n');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzeStructure();
