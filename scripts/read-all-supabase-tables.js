/**
 * Script para leer todas las tablas de Supabase y entender su estructura
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan las variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function readAllTables() {
  console.log('📊 Leyendo todas las tablas de Supabase...\n');

  // Primero obtener todas las tablas disponibles
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (tablesError) {
    console.log('⚠️  No se pudo obtener la lista de tablas, usando lista predefinida...\n');
    
    // Lista predefinida de tablas comunes
    const tablesList = [
      'programas',
      'categorias',
      'Modelos de Precios',
      'Plataformas',
      'programas_subcategorias',
      'programas_alternativas',
      'autores',
      'blog_posts'
    ];
    
    await readTables(tablesList);
    return;
  }

  const tableNames = tables.map(t => t.table_name).filter(name => 
    !name.startsWith('pg_') && 
    !name.startsWith('_') &&
    name !== 'schema_migrations'
  );

  console.log(`📋 Tablas encontradas: ${tableNames.join(', ')}\n`);
  await readTables(tableNames);
}

async function readTables(tables) {

  for (const table of tables) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Tabla: ${table}`);
    console.log('='.repeat(60));

    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(3);

      if (error) {
        console.error(`❌ Error al leer ${table}:`, error.message);
        continue;
      }

      if (!data || data.length === 0) {
        console.log('⚠️  Tabla vacía o sin datos');
        continue;
      }

      console.log(`✅ Registros encontrados: ${data.length}`);
      console.log('\n📝 Estructura de columnas:');
      
      const firstRow = data[0];
      Object.keys(firstRow).forEach(key => {
        const value = firstRow[key];
        const type = typeof value;
        console.log(`  - ${key}: ${type} ${value === null ? '(null)' : ''}`);
      });

      console.log('\n📄 Ejemplo de datos (primeros 3 registros):');
      console.log(JSON.stringify(data, null, 2));

    } catch (err) {
      console.error(`❌ Error inesperado en ${table}:`, err.message);
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('✅ Lectura completada');
  console.log('='.repeat(60));
}

readAllTables().catch(console.error);
