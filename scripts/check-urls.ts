import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkSpecificPrograms() {
  const programsToCheck = [
    'Adobe Illustrator',
    'Adobe Photoshop',
    'Axure RP',
    'Cavalry'
  ];

  console.log('🔍 Verificando URLs en la base de datos...\n');

  for (const programName of programsToCheck) {
    const { data, error } = await supabase
      .from('programas')
      .select('nombre, icono_url')
      .eq('nombre', programName)
      .single();

    if (error) {
      console.log(`❌ ${programName}: Error - ${error.message}`);
    } else if (data) {
      const isCloudinary = data.icono_url.includes('cloudinary');
      const emoji = isCloudinary ? '✅' : '❌';
      console.log(`${emoji} ${data.nombre}`);
      console.log(`   ${data.icono_url}\n`);
    } else {
      console.log(`⚠️  ${programName}: No encontrado\n`);
    }
  }
}

checkSpecificPrograms();
