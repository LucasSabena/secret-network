import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usar SERVICE_ROLE para ver índices
);

async function checkIndexes() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 VERIFICANDO ÍNDICES EN SUPABASE');
  console.log('='.repeat(70) + '\n');

  // Query para verificar índices
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT 
          tablename,
          indexname,
          indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('programas', 'programas_subcategorias', 'categorias', 'programas_modelos_de_precios')
      ORDER BY tablename, indexname;
    `
  });

  if (error) {
    console.log('❌ No se pudo ejecutar la consulta con RPC.');
    console.log('   Vamos a intentar otro método...\n');
    
    // Método alternativo: consultar directamente
    const { data: programas } = await supabase
      .from('programas')
      .select('id')
      .limit(1);
    
    if (programas) {
      console.log('✅ Conexión a Supabase funcionando correctamente.\n');
      console.log('💡 Para verificar los índices manualmente:');
      console.log('   1. Ve a Supabase Dashboard');
      console.log('   2. SQL Editor');
      console.log('   3. Ejecuta esta query:\n');
      console.log('   SELECT tablename, indexname');
      console.log('   FROM pg_indexes');
      console.log("   WHERE schemaname = 'public'");
      console.log("   AND indexname LIKE 'idx_%'");
      console.log('   ORDER BY tablename, indexname;\n');
    }
  } else {
    console.log('📊 ÍNDICES ENCONTRADOS:\n');
    console.log(data);
  }

  // Verificar si los índices mejoran el rendimiento
  console.log('\n' + '='.repeat(70));
  console.log('🧪 PROBANDO PERFORMANCE CON EXPLAIN ANALYZE');
  console.log('='.repeat(70) + '\n');

  console.log('🔬 Test 1: Consulta con categoria_id (debería usar índice)');
  console.log('   SQL: SELECT * FROM programas WHERE categoria_id = 1 LIMIT 10;\n');

  console.log('🔬 Test 2: Consulta con programa_id en relaciones');
  console.log('   SQL: SELECT * FROM programas_subcategorias WHERE programa_id = 1;\n');

  console.log('💡 Para ver si los índices se están usando:');
  console.log('   1. Ve a Supabase SQL Editor');
  console.log('   2. Ejecuta esta query:\n');
  console.log('   EXPLAIN ANALYZE');
  console.log('   SELECT * FROM programas WHERE categoria_id = 1;\n');
  console.log('   Si ves "Index Scan using idx_programas_categoria_id" = ✅ FUNCIONA');
  console.log('   Si ves "Seq Scan on programas" = ❌ NO ESTÁ USANDO EL ÍNDICE\n');

  console.log('='.repeat(70));
}

checkIndexes();
