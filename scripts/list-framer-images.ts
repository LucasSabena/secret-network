import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function listFramerImages() {
  try {
    const { data, error } = await supabase
      .from('programas')
      .select('nombre, icono_url')
      .or('icono_url.ilike.%framer%,icono_url.ilike.%framerusercontent%')
      .order('nombre');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('\n' + '='.repeat(70));
    console.log('🐌 PROGRAMAS CON ÍCONOS AÚN EN FRAMER');
    console.log('='.repeat(70) + '\n');

    if (!data || data.length === 0) {
      console.log('✅ ¡No hay imágenes en Framer! Todas migradas a Cloudinary.');
      return;
    }

    data.forEach((programa, index) => {
      console.log(`${index + 1}. ${programa.nombre}`);
      console.log(`   🔗 ${programa.icono_url}`);
      console.log('');
    });

    console.log('='.repeat(70));
    console.log(`📊 Total: ${data.length} programas con íconos en Framer`);
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listFramerImages();
