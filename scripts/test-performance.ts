import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function comparePerformance() {
  console.log('\n' + '='.repeat(70));
  console.log('🔬 COMPARACIÓN DE PERFORMANCE - ANTES vs DESPUÉS');
  console.log('='.repeat(70) + '\n');

  // Test 1: Consulta simple
  console.log('📊 TEST 1: Consulta Simple de Programas');
  const start1 = Date.now();
  const { data: programas } = await supabase
    .from('programas')
    .select('*')
    .limit(100);
  const time1 = Date.now() - start1;
  console.log(`   ⏱️  Tiempo: ${time1}ms`);
  console.log(`   📈 ${time1 < 200 ? '✅ RÁPIDO' : '⚠️  MEJORABLE'}\n`);

  // Test 2: Consulta con JOIN (categorías)
  console.log('📊 TEST 2: Programas con Categorías (JOIN)');
  const start2 = Date.now();
  const programaIds = programas?.slice(0, 50).map(p => p.id) || [];
  const categoriaIds = programas?.slice(0, 50).map(p => p.categoria_id) || [];
  
  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .in('id', categoriaIds);
  const time2 = Date.now() - start2;
  console.log(`   ⏱️  Tiempo: ${time2}ms`);
  console.log(`   📈 ${time2 < 150 ? '✅ RÁPIDO' : '⚠️  MEJORABLE'}\n`);

  // Test 3: Consulta compleja con relaciones
  console.log('📊 TEST 3: Relaciones Programa-Subcategorías');
  const start3 = Date.now();
  const { data: relaciones } = await supabase
    .from('programas_subcategorias')
    .select('*')
    .in('programa_id', programaIds);
  const time3 = Date.now() - start3;
  console.log(`   ⏱️  Tiempo: ${time3}ms`);
  console.log(`   📈 ${time3 < 100 ? '✅ RÁPIDO' : '⚠️  MEJORABLE'}\n`);

  // Test 4: Búsqueda por slug (índice recomendado)
  console.log('📊 TEST 4: Búsqueda por Slug');
  const start4 = Date.now();
  const { data: programa } = await supabase
    .from('programas')
    .select('*')
    .eq('slug', 'figma')
    .single();
  const time4 = Date.now() - start4;
  console.log(`   ⏱️  Tiempo: ${time4}ms`);
  console.log(`   📈 ${time4 < 50 ? '✅ RÁPIDO' : '⚠️  MEJORABLE'}\n`);

  // Resumen
  const totalTime = time1 + time2 + time3 + time4;
  console.log('='.repeat(70));
  console.log('📈 RESUMEN DE PERFORMANCE');
  console.log('='.repeat(70));
  console.log(`⏱️  Tiempo total: ${totalTime}ms\n`);

  console.log('🎯 OBJETIVOS (CON ÍNDICES):');
  console.log(`   • Consulta simple: < 200ms       (actual: ${time1}ms) ${time1 < 200 ? '✅' : '❌'}`);
  console.log(`   • JOIN categorías: < 150ms       (actual: ${time2}ms) ${time2 < 150 ? '✅' : '❌'}`);
  console.log(`   • Relaciones: < 100ms            (actual: ${time3}ms) ${time3 < 100 ? '✅' : '❌'}`);
  console.log(`   • Búsqueda slug: < 50ms          (actual: ${time4}ms) ${time4 < 50 ? '✅' : '❌'}`);
  console.log(`   • Total: < 500ms                 (actual: ${totalTime}ms) ${totalTime < 500 ? '✅' : '❌'}\n`);

  if (totalTime < 500 && time3 < 100) {
    console.log('🎉 ¡EXCELENTE! Los índices están funcionando correctamente.');
    console.log('   Tu base de datos está optimizada.\n');
  } else if (time3 > 200) {
    console.log('⚠️  LOS ÍNDICES NO ESTÁN CREADOS O NO ESTÁN FUNCIONANDO');
    console.log('   Por favor, ejecuta el SQL en Supabase:');
    console.log('   1. Abre: scripts/create-indexes.sql');
    console.log('   2. Copia el contenido');
    console.log('   3. Pégalo en Supabase SQL Editor');
    console.log('   4. Ejecuta\n');
  } else {
    console.log('🟡 RENDIMIENTO MODERADO');
    console.log('   Los índices ayudarán, pero también considera:');
    console.log('   • Verificar la ubicación del servidor de Supabase');
    console.log('   • Revisar el plan de Supabase (free tier puede ser más lento)');
    console.log('   • Implementar caché adicional en el servidor\n');
  }

  console.log('='.repeat(70));
}

comparePerformance();
