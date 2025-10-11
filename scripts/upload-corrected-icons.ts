import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Lista de los nombres de archivos corregidos (sin extensión)
const correctedIcons = [
  'Adobe acrobat Pro',
  'Adobe Illustrator',
  'Adobe Indesign',
  'Adobe Photoshop',
  'Adobe Premiere Pro',
  'Affinity Publisher',
  'Autodesk Maya',
  'Axure',
  'Cavalry',
  'Clipchamp',
  'Conceptboard',
  'Coreldraw',
  'Davinci resolve',
  'Fontforge',
  'Gravit Designer',
  'Justinmind',
  'Lucidspark',
  'Nuke',
  'Origami Studio',
  'PDF24 Creator & Toolbox',
  'QuarkXPress',
  'shots.so',
  'Squarespace',
  'TinyPNG TinyJPG',
  'Unreal Engine'
];

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function uploadCorrectedIcons() {
  const iconsPath = path.join(process.cwd(), 'Iconos', 'Listos');
  
  console.log('🔄 Iniciando subida de íconos corregidos...\n');
  
  // Obtener todos los programas de la base de datos
  const { data: programas, error } = await supabase
    .from('programas')
    .select('id, nombre, icono_url')
    .order('nombre');

  if (error) {
    console.error('❌ Error al obtener programas:', error);
    return;
  }

  console.log(`📊 Total programas en DB: ${programas?.length || 0}`);
  console.log(`🎯 Íconos a subir: ${correctedIcons.length}\n`);

  let uploadedCount = 0;
  let matchedCount = 0;
  let errorCount = 0;

  // Procesar cada ícono corregido
  for (const iconFileName of correctedIcons) {
    const iconFilePath = path.join(iconsPath, `${iconFileName}.svg`);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(iconFilePath)) {
      console.log(`❌ Archivo no encontrado: ${iconFileName}.svg`);
      errorCount++;
      continue;
    }

    // Normalizar el nombre del archivo para matching
    const normalizedFileName = normalizeName(iconFileName);
    
    // Buscar programa que coincida
    const matchingPrograma = programas?.find(p => 
      normalizeName(p.nombre) === normalizedFileName
    );

    if (!matchingPrograma) {
      console.log(`⚠️  Sin match en DB: ${iconFileName}`);
      errorCount++;
      continue;
    }

    matchedCount++;
    
    try {
      // Subir a Cloudinary
      const result = await cloudinary.uploader.upload(iconFilePath, {
        folder: 'secret-station/icons',
        public_id: normalizedFileName,
        overwrite: true,
        resource_type: 'image',
      });

      uploadedCount++;

      // Actualizar URL en la base de datos
      const { error: updateError } = await supabase
        .from('programas')
        .update({ icono_url: result.secure_url })
        .eq('id', matchingPrograma.id);

      if (updateError) {
        console.log(`❌ Error al actualizar DB para ${matchingPrograma.nombre}:`, updateError.message);
        errorCount++;
      } else {
        console.log(`✅ ${matchingPrograma.nombre}`);
        console.log(`   📁 Archivo: ${iconFileName}.svg`);
        console.log(`   🔗 URL: ${result.secure_url}\n`);
      }

    } catch (error: any) {
      console.log(`❌ Error al subir ${iconFileName}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE SUBIDA DE ÍCONOS CORREGIDOS');
  console.log('='.repeat(60));
  console.log(`✅ Íconos subidos exitosamente: ${uploadedCount}/${correctedIcons.length}`);
  console.log(`🎯 Matches encontrados en DB: ${matchedCount}/${correctedIcons.length}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log('='.repeat(60));
}

uploadCorrectedIcons().catch(console.error);
