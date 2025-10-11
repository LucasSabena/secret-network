/**
 * Script de diagnóstico de rendimiento
 * Analiza qué está causando la lentitud
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function diagnosePerformance() {
  console.log('🔍 DIAGNÓSTICO DE RENDIMIENTO\n');
  console.log('='.repeat(60));

  // 1. Contar programas totales
  const start1 = Date.now();
  const { count: totalProgramas } = await supabase
    .from('programas')
    .select('*', { count: 'exact', head: true });
  const time1 = Date.now() - start1;
  console.log(`\n📊 Total de programas: ${totalProgramas}`);
  console.log(`⏱️  Tiempo de consulta: ${time1}ms`);

  // 2. Analizar URLs de imágenes
  const start2 = Date.now();
  const { data: programas } = await supabase
    .from('programas')
    .select('icono_url, captura_url');
  const time2 = Date.now() - start2;

  const imageStats = {
    framer: 0,
    cloudinary: 0,
    supabase: 0,
    other: 0,
    total: 0
  };

  programas?.forEach(p => {
    if (p.icono_url) {
      imageStats.total++;
      if (p.icono_url.includes('framerusercontent.com')) imageStats.framer++;
      else if (p.icono_url.includes('cloudinary.com')) imageStats.cloudinary++;
      else if (p.icono_url.includes('supabase.co')) imageStats.supabase++;
      else imageStats.other++;
    }
    if (p.captura_url) {
      imageStats.total++;
      if (p.captura_url.includes('framerusercontent.com')) imageStats.framer++;
      else if (p.captura_url.includes('cloudinary.com')) imageStats.cloudinary++;
      else if (p.captura_url.includes('supabase.co')) imageStats.supabase++;
      else imageStats.other++;
    }
  });

  console.log(`\n📸 ANÁLISIS DE IMÁGENES`);
  console.log(`⏱️  Tiempo de consulta: ${time2}ms`);
  console.log(`   🖼️  Total de imágenes: ${imageStats.total}`);
  console.log(`   🐌 Framer (LENTAS): ${imageStats.framer} (${Math.round(imageStats.framer/imageStats.total*100)}%)`);
  console.log(`   ⚡ Cloudinary (RÁPIDAS): ${imageStats.cloudinary} (${Math.round(imageStats.cloudinary/imageStats.total*100)}%)`);
  console.log(`   💾 Supabase: ${imageStats.supabase} (${Math.round(imageStats.supabase/imageStats.total*100)}%)`);
  console.log(`   🤷 Otras: ${imageStats.other}`);

  // 3. Probar velocidad de una consulta completa con relaciones
  console.log(`\n🔗 PRUEBA DE CONSULTA COMPLETA CON RELACIONES`);
  const start3 = Date.now();
  const { data: testPrograma } = await supabase
    .from('programas')
    .select('*')
    .limit(1)
    .single();

  if (testPrograma) {
    const { data: categoria } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', testPrograma.categoria_id)
      .single();

    const { data: subcategorias } = await supabase
      .from('programas_subcategorias')
      .select('subcategoria_id')
      .eq('programa_id', testPrograma.id);
  }
  const time3 = Date.now() - start3;
  console.log(`⏱️  Consulta con relaciones: ${time3}ms`);

  // 4. Contar relaciones
  const start4 = Date.now();
  const { count: relaciones } = await supabase
    .from('programas_subcategorias')
    .select('*', { count: 'exact', head: true });
  const time4 = Date.now() - start4;
  console.log(`\n🔗 Relaciones programas-subcategorías: ${relaciones}`);
  console.log(`⏱️  Tiempo de consulta: ${time4}ms`);

  // 5. Índices sugeridos
  console.log(`\n💡 RECOMENDACIONES`);
  console.log('='.repeat(60));
  
  if (imageStats.framer > 0) {
    console.log(`⚠️  CRÍTICO: Migrar ${imageStats.framer} imágenes de Framer a Cloudinary`);
    console.log(`   Ejecuta: npm run migrate:images`);
  }

  if (time3 > 100) {
    console.log(`⚠️  Consultas lentas detectadas (${time3}ms)`);
    console.log(`   Considera agregar índices en Supabase:`);
    console.log(`   - programas.categoria_id`);
    console.log(`   - programas_subcategorias.programa_id`);
    console.log(`   - programas_subcategorias.subcategoria_id`);
  }

  console.log(`\n✅ Implementar caching en el frontend`);
  console.log(`✅ Usar React Query o SWR para cache de datos`);
  console.log(`✅ Implementar ISR (Incremental Static Regeneration)`);

  console.log('\n' + '='.repeat(60));
}

diagnosePerformance()
  .then(() => {
    console.log('\n✅ Diagnóstico completado!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en diagnóstico:', error);
    process.exit(1);
  });
