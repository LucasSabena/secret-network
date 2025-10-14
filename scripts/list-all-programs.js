/**
 * Script para listar todos los programas disponibles en Supabase
 * Útil para saber qué alternativas existen al crear nuevos programas
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listarProgramas() {
  console.log('\n📋 LISTANDO TODOS LOS PROGRAMAS EN LA BASE DE DATOS\n');

  try {
    const { data: programas, error } = await supabase
      .from('programas')
      .select('id, nombre, slug, es_open_source, es_recomendado, categoria_id')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Error al obtener programas:', error.message);
      process.exit(1);
    }

    // Agrupar por categoría
    const { data: categorias } = await supabase
      .from('categorias')
      .select('id, nombre')
      .is('id_categoria_padre', null);

    const programasPorCategoria = {};
    
    categorias.forEach(cat => {
      programasPorCategoria[cat.id] = {
        nombre: cat.nombre,
        programas: []
      };
    });

    programas.forEach(prog => {
      if (programasPorCategoria[prog.categoria_id]) {
        programasPorCategoria[prog.categoria_id].programas.push(prog);
      }
    });

    // Mostrar en consola
    console.log(`Total de programas: ${programas.length}\n`);
    
    Object.values(programasPorCategoria).forEach(cat => {
      if (cat.programas.length > 0) {
        console.log(`\n📂 ${cat.nombre} (${cat.programas.length} programas)`);
        console.log('─'.repeat(60));
        cat.programas.forEach(prog => {
          const badges = [];
          if (prog.es_open_source) badges.push('🟢 Open Source');
          if (prog.es_recomendado) badges.push('⭐ Recomendado');
          console.log(`  ${prog.slug}${badges.length ? ' ' + badges.join(' ') : ''}`);
        });
      }
    });

    // Guardar en archivo JSON para fácil consulta
    const outputPath = path.join(__dirname, '..', 'temporal', 'programas-disponibles.json');
    const output = {
      total: programas.length,
      generado: new Date().toISOString(),
      programas: programas.map(p => ({
        slug: p.slug,
        nombre: p.nombre,
        es_open_source: p.es_open_source,
        es_recomendado: p.es_recomendado
      }))
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n✅ Lista guardada en: temporal/programas-disponibles.json`);

    // También crear lista simple de slugs
    const slugsPath = path.join(__dirname, '..', 'temporal', 'slugs-disponibles.txt');
    const slugsList = programas.map(p => p.slug).join('\n');
    fs.writeFileSync(slugsPath, slugsList);
    console.log(`✅ Lista de slugs guardada en: temporal/slugs-disponibles.txt\n`);

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

listarProgramas();
