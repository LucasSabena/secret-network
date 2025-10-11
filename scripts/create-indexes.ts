import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Necesita permisos de admin
);

const indexes = [
  {
    name: 'idx_programas_categoria_id',
    table: 'programas',
    column: 'categoria_id',
    sql: 'CREATE INDEX IF NOT EXISTS idx_programas_categoria_id ON programas(categoria_id);',
  },
  {
    name: 'idx_programas_subcategorias_programa_id',
    table: 'programas_subcategorias',
    column: 'programa_id',
    sql: 'CREATE INDEX IF NOT EXISTS idx_programas_subcategorias_programa_id ON programas_subcategorias(programa_id);',
  },
  {
    name: 'idx_programas_subcategorias_subcategoria_id',
    table: 'programas_subcategorias',
    column: 'subcategoria_id',
    sql: 'CREATE INDEX IF NOT EXISTS idx_programas_subcategorias_subcategoria_id ON programas_subcategorias(subcategoria_id);',
  },
  {
    name: 'idx_programas_slug',
    table: 'programas',
    column: 'slug',
    sql: 'CREATE INDEX IF NOT EXISTS idx_programas_slug ON programas(slug);',
  },
  {
    name: 'idx_categorias_slug',
    table: 'categorias',
    column: 'slug',
    sql: 'CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);',
  },
  {
    name: 'idx_categorias_id_categoria_padre',
    table: 'categorias',
    column: 'id_categoria_padre',
    sql: 'CREATE INDEX IF NOT EXISTS idx_categorias_id_categoria_padre ON categorias(id_categoria_padre);',
  },
];

async function createIndexes() {
  console.log('🔧 Creando índices en Supabase para mejorar performance...\n');
  
  let created = 0;
  let errors = 0;

  for (const index of indexes) {
    try {
      console.log(`📊 Creando índice: ${index.name}`);
      console.log(`   Tabla: ${index.table}, Columna: ${index.column}`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: index.sql });
      
      if (error) {
        // Intentar con método alternativo usando el cliente directo
        console.log(`   ⚠️  Método RPC falló, usando SQL directo...`);
        
        // Nota: Esto solo funcionará si tienes permisos directos
        console.log(`   💡 Por favor, ejecuta manualmente en Supabase SQL Editor:`);
        console.log(`   ${index.sql}\n`);
        errors++;
      } else {
        console.log(`   ✅ Índice creado exitosamente\n`);
        created++;
      }
      
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log(`   💡 Ejecuta manualmente en Supabase SQL Editor:`);
      console.log(`   ${index.sql}\n`);
      errors++;
    }
  }

  console.log('='.repeat(60));
  console.log('📊 RESUMEN');
  console.log('='.repeat(60));
  console.log(`✅ Índices creados: ${created}/${indexes.length}`);
  console.log(`❌ Errores: ${errors}`);
  
  if (errors > 0) {
    console.log('\n⚠️  IMPORTANTE:');
    console.log('Si hubo errores, copia el archivo scripts/create-indexes.sql');
    console.log('y ejecútalo manualmente en el SQL Editor de Supabase.');
    console.log('\n📝 Pasos:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. Ve a SQL Editor');
    console.log('4. Copia y pega el contenido de scripts/create-indexes.sql');
    console.log('5. Ejecuta el script');
  }
  
  console.log('='.repeat(60));
}

createIndexes();
