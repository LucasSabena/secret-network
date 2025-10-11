/**
 * Script para subir íconos locales a Cloudinary y actualizar la BD
 * 
 * Este script:
 * 1. Lee todos los íconos desde /Iconos/Listos
 * 2. Los sube a Cloudinary
 * 3. Hace match con programas en la BD por nombre
 * 4. Actualiza la BD con las nuevas URLs
 */

import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Programa {
  id: number;
  nombre: string;
  slug: string;
  icono_url: string | null;
}

/**
 * Normaliza un nombre para hacer match
 * Ejemplo: "Adobe Photoshop" -> "adobephotoshop"
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Eliminar todo excepto letras y números
    .trim();
}

/**
 * Obtiene el nombre del programa desde el nombre del archivo
 * Ejemplo: "Adobe Photoshop.svg" -> "Adobe Photoshop"
 */
function getNameFromFile(filename: string): string {
  return path.basename(filename, path.extname(filename));
}

async function uploadLocalIconsToCloudinary() {
  console.log('🚀 Subiendo íconos locales a Cloudinary...\n');
  console.log('='.repeat(60));

  // 1. Obtener todos los programas de la BD
  const { data: programas, error } = await supabase
    .from('programas')
    .select('id, nombre, slug, icono_url');

  if (error || !programas) {
    console.error('❌ Error obteniendo programas:', error);
    return;
  }

  console.log(`📊 Total de programas en BD: ${programas.length}`);

  // Crear un mapa de nombres normalizados a programas
  const programaMap = new Map<string, Programa>();
  programas.forEach((p: Programa) => {
    const normalizedName = normalizeName(p.nombre);
    programaMap.set(normalizedName, p);
  });

  // 2. Leer todos los íconos de la carpeta local
  const iconosPath = path.join(process.cwd(), 'Iconos', 'Listos');
  
  if (!fs.existsSync(iconosPath)) {
    console.error(`❌ No se encontró la carpeta: ${iconosPath}`);
    return;
  }

  const archivos = fs.readdirSync(iconosPath);
  const iconos = archivos.filter(f => f.endsWith('.svg') || f.endsWith('.png') || f.endsWith('.jpg'));
  
  console.log(`📁 Total de íconos encontrados: ${iconos.length}`);
  console.log('='.repeat(60));

  let uploadedCount = 0;
  let matchedCount = 0;
  let notMatchedCount = 0;
  let errorCount = 0;
  const notMatched: string[] = [];

  // 3. Procesar cada ícono
  for (const icono of iconos) {
    const nombreIcono = getNameFromFile(icono);
    const normalizedIconName = normalizeName(nombreIcono);
    
    // Buscar match en la BD
    const programa = programaMap.get(normalizedIconName);
    
    if (!programa) {
      console.log(`⚠️  No match: "${nombreIcono}"`);
      notMatched.push(nombreIcono);
      notMatchedCount++;
      continue;
    }

    try {
      console.log(`\n📦 Procesando: ${programa.nombre}`);
      
      // Subir a Cloudinary
      const iconoPath = path.join(iconosPath, icono);
      console.log(`   📥 Subiendo: ${icono}...`);
      
      const result = await cloudinary.uploader.upload(iconoPath, {
        folder: 'secret-station/icons',
        public_id: programa.slug,
        overwrite: true,
        resource_type: 'auto'
      });

      uploadedCount++;
      console.log(`   ✅ Subido: ${result.secure_url}`);

      // Actualizar BD
      const { error: updateError } = await supabase
        .from('programas')
        .update({ icono_url: result.secure_url })
        .eq('id', programa.id);

      if (updateError) {
        console.error(`   ❌ Error actualizando BD:`, updateError);
        errorCount++;
      } else {
        console.log(`   ✅ BD actualizada`);
        matchedCount++;
      }

      // Pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.error(`   ❌ Error procesando ${nombreIcono}:`, error);
      errorCount++;
    }
  }

  // 4. Ahora migrar capturas desde Framer (solo las capturas, no los íconos)
  console.log('\n' + '='.repeat(60));
  console.log('📸 Migrando capturas desde Framer...');
  console.log('='.repeat(60));

  const { data: programasConCapturas } = await supabase
    .from('programas')
    .select('id, nombre, slug, captura_url')
    .ilike('captura_url', '%framerusercontent.com%');

  if (programasConCapturas && programasConCapturas.length > 0) {
    console.log(`\n📊 Encontradas ${programasConCapturas.length} capturas en Framer\n`);

    for (const programa of programasConCapturas) {
      try {
        console.log(`📸 Migrando captura: ${programa.nombre}`);
        
        const result = await cloudinary.uploader.upload(programa.captura_url, {
          folder: 'secret-station/screenshots',
          public_id: `${programa.slug}-screenshot`,
          overwrite: true,
          resource_type: 'auto'
        });

        const { error: updateError } = await supabase
          .from('programas')
          .update({ captura_url: result.secure_url })
          .eq('id', programa.id);

        if (!updateError) {
          console.log(`   ✅ Captura migrada: ${result.secure_url}`);
          uploadedCount++;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`   ❌ Error migrando captura de ${programa.nombre}:`, error);
        errorCount++;
      }
    }
  }

  // 5. Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Íconos subidos: ${uploadedCount}`);
  console.log(`✅ Programas actualizados: ${matchedCount}`);
  console.log(`⚠️  Íconos sin match: ${notMatchedCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log('='.repeat(60));

  if (notMatched.length > 0) {
    console.log('\n⚠️  ÍCONOS SIN MATCH EN LA BASE DE DATOS:');
    console.log('   (Estos íconos existen pero no hay programa correspondiente en la BD)');
    console.log('='.repeat(60));
    notMatched.forEach(name => console.log(`   - ${name}`));
  }

  console.log('\n💡 RECOMENDACIONES:');
  console.log('='.repeat(60));
  console.log('✅ Verifica que los íconos sin match tengan el programa en la BD');
  console.log('✅ Ajusta los nombres en la BD si es necesario');
  console.log('✅ Re-ejecuta el script si agregas nuevos programas');
}

// Ejecutar migración
uploadLocalIconsToCloudinary()
  .then(() => {
    console.log('\n🎉 Migración completada!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error en la migración:', error);
    process.exit(1);
  });
