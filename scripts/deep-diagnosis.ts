import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function deepDiagnosis() {
  console.log('\n' + '='.repeat(70));
  console.log('🔬 DIAGNÓSTICO PROFUNDO DE PERFORMANCE');
  console.log('='.repeat(70) + '\n');

  // 1. Verificar cantidad de datos
  console.log('📊 PASO 1: Verificando cantidad de datos...\n');
  
  const [
    { count: programasCount },
    { count: categoriasCount },
    { count: relacionesCount },
  ] = await Promise.all([
    supabase.from('programas').select('*', { count: 'exact', head: true }),
    supabase.from('categorias').select('*', { count: 'exact', head: true }),
    supabase.from('programas_subcategorias').select('*', { count: 'exact', head: true }),
  ]);

  console.log(`   • Programas: ${programasCount}`);
  console.log(`   • Categorías: ${categoriasCount}`);
  console.log(`   • Relaciones: ${relacionesCount}\n`);

  // 2. Probar consulta específica con timing
  console.log('📊 PASO 2: Probando consulta específica con categoria_id...\n');
  
  const start = Date.now();
  const { data: testProgramas, error } = await supabase
    .from('programas')
    .select('id, nombre, categoria_id')
    .eq('categoria_id', 1)
    .limit(10);
  const time = Date.now() - start;

  if (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  } else {
    console.log(`   ✅ Resultados: ${testProgramas?.length || 0} programas`);
    console.log(`   ⏱️  Tiempo: ${time}ms`);
    console.log(`   📈 ${time < 50 ? '✅ RÁPIDO (índice funcionando)' : '⚠️  LENTO (índice NO funcionando)'}\n`);
  }

  // 3. Probar consulta con IN (usa índices)
  console.log('📊 PASO 3: Probando consulta con IN (múltiples IDs)...\n');
  
  const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const start2 = Date.now();
  const { data: testProgramas2 } = await supabase
    .from('programas')
    .select('id, nombre')
    .in('id', ids);
  const time2 = Date.now() - start2;

  console.log(`   ✅ Resultados: ${testProgramas2?.length || 0} programas`);
  console.log(`   ⏱️  Tiempo: ${time2}ms`);
  console.log(`   📈 ${time2 < 100 ? '✅ RÁPIDO' : '⚠️  LENTO'}\n`);

  // 4. Probar consulta de relaciones
  console.log('📊 PASO 4: Probando relaciones programas-subcategorías...\n');
  
  const start3 = Date.now();
  const { data: relaciones } = await supabase
    .from('programas_subcategorias')
    .select('programa_id, subcategoria_id')
    .in('programa_id', ids);
  const time3 = Date.now() - start3;

  console.log(`   ✅ Resultados: ${relaciones?.length || 0} relaciones`);
  console.log(`   ⏱️  Tiempo: ${time3}ms`);
  console.log(`   📈 ${time3 < 100 ? '✅ RÁPIDO (índice funcionando)' : '⚠️  LENTO (índice NO funcionando)'}\n`);

  // 5. Análisis de latencia de red
  console.log('📊 PASO 5: Probando latencia de red a Supabase...\n');
  
  const pings: number[] = [];
  for (let i = 0; i < 5; i++) {
    const pingStart = Date.now();
    await supabase.from('programas').select('id').limit(1);
    const pingTime = Date.now() - pingStart;
    pings.push(pingTime);
  }

  const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
  console.log(`   🌐 Latencia promedio: ${avgPing}ms`);
  console.log(`   📊 Pings individuales: ${pings.join('ms, ')}ms\n`);

  if (avgPing > 200) {
    console.log('   ⚠️  ALTA LATENCIA DETECTADA');
    console.log('   Esto puede ser por:');
    console.log('   • Servidor de Supabase lejos de tu ubicación');
    console.log('   • Plan Free Tier (más lento)');
    console.log('   • Conexión a internet lenta\n');
  }

  // Resumen y diagnóstico
  console.log('='.repeat(70));
  console.log('🎯 DIAGNÓSTICO FINAL');
  console.log('='.repeat(70) + '\n');

  const issueCount = [time > 50, time2 > 100, time3 > 100, avgPing > 200].filter(Boolean).length;

  if (issueCount === 0) {
    console.log('✅ TODO ESTÁ BIEN');
    console.log('   Los índices están funcionando correctamente.');
    console.log('   Si aún ves lentitud en la app, el problema puede ser:');
    console.log('   • Renderizado en el cliente (React)');
    console.log('   • Muchas imágenes cargando');
    console.log('   • JavaScript bloqueante\n');
  } else if (avgPing > 200) {
    console.log('⚠️  PROBLEMA PRINCIPAL: LATENCIA DE RED');
    console.log(`   Latencia promedio: ${avgPing}ms (objetivo: <100ms)`);
    console.log('\n   Soluciones:');
    console.log('   1. Verifica tu ubicación vs ubicación del servidor Supabase');
    console.log('   2. Considera cambiar la región del proyecto');
    console.log('   3. Implementa más caché en el servidor (ISR)\n');
  } else {
    console.log('⚠️  LOS ÍNDICES NO ESTÁN FUNCIONANDO O NO SE CREARON');
    console.log('\n   Posibles causas:');
    console.log('   1. Los índices no se crearon (error en SQL Editor)');
    console.log('   2. PostgreSQL no los está usando (tabla muy pequeña)');
    console.log('   3. Permisos insuficientes\n');
    
    console.log('   ✅ Solución 1: Verificar en Supabase SQL Editor');
    console.log('   Ejecuta esta query para ver los índices:\n');
    console.log("   SELECT indexname FROM pg_indexes WHERE tablename = 'programas';\n");
    
    console.log('   ✅ Solución 2: Recrear índices con DROP primero');
    console.log('   DROP INDEX IF EXISTS idx_programas_categoria_id;');
    console.log('   CREATE INDEX idx_programas_categoria_id ON programas(categoria_id);\n');
  }

  // Recomendaciones adicionales
  console.log('💡 RECOMENDACIONES ADICIONALES:\n');
  
  if (programasCount && programasCount < 500) {
    console.log('   • Con solo 200 programas, los índices ayudan pero no son críticos');
    console.log('   • El problema real puede ser: latencia de red + sin caché\n');
  }

  console.log('   🚀 Optimizaciones que SÍ funcionan:');
  console.log('   1. ISR (Incremental Static Regeneration) - YA IMPLEMENTADO ✅');
  console.log('   2. Cloudinary para imágenes - YA IMPLEMENTADO ✅');
  console.log('   3. Deploy a Vercel (edge functions cerca del usuario)');
  console.log('   4. Implementar React Query para caché en cliente\n');

  console.log('='.repeat(70));
}

deepDiagnosis();
