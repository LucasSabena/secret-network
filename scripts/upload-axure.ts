import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function uploadAxure() {
  try {
    const iconPath = path.join(process.cwd(), 'Iconos', 'Listos', 'Axure RP.svg');
    
    console.log('📤 Subiendo ícono de Axure...');
    
    const result = await cloudinary.uploader.upload(iconPath, {
      folder: 'secret-station/icons',
      public_id: 'axure',
      overwrite: true,
      resource_type: 'image',
    });

    console.log('✅ Ícono subido a Cloudinary');
    console.log(`🔗 URL: ${result.secure_url}\n`);

    // Buscar el programa en la base de datos
    const { data, error } = await supabase
      .from('programas')
      .select('id, nombre')
      .ilike('nombre', '%axure%');

    if (error) {
      console.error('❌ Error al buscar programa:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('⚠️  Programa "Axure" no encontrado en la base de datos');
      console.log('💡 El ícono está en Cloudinary pero no se actualizó ningún programa');
      return;
    }

    // Actualizar el programa
    const { error: updateError } = await supabase
      .from('programas')
      .update({ icono_url: result.secure_url })
      .eq('id', data[0].id);

    if (updateError) {
      console.error('❌ Error al actualizar programa:', updateError);
      return;
    }

    console.log(`✅ Programa "${data[0].nombre}" actualizado exitosamente`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

uploadAxure();
