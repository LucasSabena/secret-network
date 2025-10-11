import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usar SERVICE_ROLE para permisos de escritura
);

// Mapeo de nombres de programas a public_ids en Cloudinary
const cloudinaryMapping: Record<string, string> = {
  'Adobe Acrobat Pro': 'adobeacrobatpro',
  'Adobe Illustrator': 'adobeillustrator',
  'Adobe InDesign': 'adobeindesign',
  'Adobe Photoshop': 'adobephotoshop',
  'Adobe Premiere Pro': 'adobepremierepro',
  'Affinity Publisher': 'affinitypublisher',
  'Autodesk Maya': 'autodeskmaya',
  'Axure RP': 'axure',
  'Cavalry': 'cavalry',
  'Clipchamp': 'clipchamp',
  'Conceptboard': 'conceptboard',
  'CorelDRAW': 'coreldraw',
  'DaVinci Resolve': 'davinciresolve',
  'FontForge': 'fontforge',
  'Justinmind': 'justinmind',
  'Lucidspark': 'lucidspark',
  'Nuke': 'nuke',
  'Origami Studio': 'origamistudio',
  'PDF24 Creator & Toolbox': 'pdf24creatortoolbox',
  'QuarkXPress': 'quarkxpress',
  'shots.so': 'shotsso',
  'Squarespace': 'squarespace',
  'TinyPNG / TinyJPG': 'tinypngtinyjpg',
  'Unreal Engine': 'unrealengine',
};

async function updateDatabaseUrls() {
  console.log('🔄 Actualizando URLs en la base de datos...\n');

  const cloudinaryBase = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  let updated = 0;
  let errors = 0;

  for (const [programName, publicId] of Object.entries(cloudinaryMapping)) {
    try {
      const cloudinaryUrl = `https://res.cloudinary.com/${cloudinaryBase}/image/upload/v1760154130/secret-station/icons/${publicId}.svg`;

      const { error } = await supabase
        .from('programas')
        .update({ icono_url: cloudinaryUrl })
        .eq('nombre', programName);

      if (error) {
        console.log(`❌ Error al actualizar "${programName}":`, error.message);
        errors++;
      } else {
        console.log(`✅ ${programName}`);
        updated++;
      }

    } catch (error: any) {
      console.log(`❌ Error al actualizar "${programName}":`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE ACTUALIZACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Programas actualizados: ${updated}`);
  console.log(`❌ Errores: ${errors}`);
  console.log('='.repeat(60));
}

updateDatabaseUrls();
