/**
 * Script para migrar imágenes de Framer a Cloudinary
 * 
 * Este script:
 * 1. Obtiene todos los programas con imágenes de framerusercontent.com
 * 2. Descarga cada imagen
 * 3. La sube a Cloudinary
 * 4. Actualiza la base de datos con la nueva URL
 */

import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

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
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Necesitas esta key con permisos de admin
);

interface Programa {
  id: number;
  nombre: string;
  slug: string;
  icono_url: string | null;
  captura_url: string | null;
}

async function uploadToCloudinary(imageUrl: string, programSlug: string, type: 'icon' | 'screenshot'): Promise<string | null> {
  try {
    console.log(`📥 Descargando ${type} para ${programSlug}...`);
    
    // Subir directamente desde URL a Cloudinary
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `secret-station/${type === 'icon' ? 'icons' : 'screenshots'}`,
      public_id: programSlug,
      overwrite: true,
      resource_type: 'auto'
    });

    console.log(`✅ ${type} subido: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error subiendo ${type} para ${programSlug}:`, error);
    return null;
  }
}

async function migrateImages() {
  console.log('🚀 Iniciando migración de imágenes...\n');

  // 1. Obtener todos los programas con imágenes de Framer
  const { data: programas, error } = await supabase
    .from('programas')
    .select('id, nombre, slug, icono_url, captura_url')
    .or('icono_url.ilike.%framerusercontent.com%,captura_url.ilike.%framerusercontent.com%');

  if (error) {
    console.error('❌ Error obteniendo programas:', error);
    return;
  }

  if (!programas || programas.length === 0) {
    console.log('✅ No hay imágenes de Framer para migrar.');
    return;
  }

  console.log(`📊 Encontrados ${programas.length} programas con imágenes de Framer\n`);

  let successCount = 0;
  let errorCount = 0;

  // 2. Procesar cada programa
  for (const programa of programas as Programa[]) {
    console.log(`\n📦 Procesando: ${programa.nombre} (${programa.slug})`);
    
    let newIconoUrl = programa.icono_url;
    let newCapturaUrl = programa.captura_url;

    // Migrar ícono si es de Framer
    if (programa.icono_url && programa.icono_url.includes('framerusercontent.com')) {
      const cloudinaryUrl = await uploadToCloudinary(programa.icono_url, programa.slug, 'icon');
      if (cloudinaryUrl) {
        newIconoUrl = cloudinaryUrl;
      }
      // Pequeña pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Migrar captura si es de Framer
    if (programa.captura_url && programa.captura_url.includes('framerusercontent.com')) {
      const cloudinaryUrl = await uploadToCloudinary(programa.captura_url, `${programa.slug}-screenshot`, 'screenshot');
      if (cloudinaryUrl) {
        newCapturaUrl = cloudinaryUrl;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 3. Actualizar base de datos si hubo cambios
    if (newIconoUrl !== programa.icono_url || newCapturaUrl !== programa.captura_url) {
      const { error: updateError } = await supabase
        .from('programas')
        .update({
          icono_url: newIconoUrl,
          captura_url: newCapturaUrl
        })
        .eq('id', programa.id);

      if (updateError) {
        console.error(`❌ Error actualizando ${programa.nombre}:`, updateError);
        errorCount++;
      } else {
        console.log(`✅ Base de datos actualizada para ${programa.nombre}`);
        successCount++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(50));
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📦 Total procesados: ${programas.length}`);
  console.log('='.repeat(50));
}

// Ejecutar migración
migrateImages()
  .then(() => {
    console.log('\n🎉 Migración completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error en la migración:', error);
    process.exit(1);
  });
