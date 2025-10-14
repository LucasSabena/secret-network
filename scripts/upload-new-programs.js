/**
 * Script para subir nuevos programas a Supabase
 * Crea nuevas subcategorías e inserta programas con todas sus relaciones
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las credenciales de Supabase en .env.local');
  console.error('Necesitas NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// PASO 1: CREAR NUEVAS SUBCATEGORÍAS
// ============================================================================

const nuevasSubcategorias = [
  {
    nombre: 'Editor de imágenes',
    slug: 'editor-de-imagenes',
    categoria_padre: 'Programas de diseño',
    icono: 'ImageIcon'
  },
  {
    nombre: 'Escultura digital',
    slug: 'escultura-digital',
    categoria_padre: 'Programas de diseño',
    icono: 'Box'
  },
  {
    nombre: 'Texturizado 3D',
    slug: 'texturizado-3d',
    categoria_padre: 'Programas de diseño',
    icono: 'Paintbrush'
  },
  {
    nombre: 'Diagramas de flujo de usuario',
    slug: 'diagramas-de-flujo-de-usuario',
    categoria_padre: 'Programas de diseño',
    icono: 'GitBranch'
  },
  {
    nombre: 'Documentación de sistemas de diseño',
    slug: 'documentacion-de-sistemas-de-diseño',
    categoria_padre: 'Programas de diseño',
    icono: 'BookOpen'
  },
  {
    nombre: 'Gestión de tipografías',
    slug: 'gestion-de-tipografias',
    categoria_padre: 'Utilidades de apoyo',
    icono: 'Type'
  },
  {
    nombre: 'Mejora y escalado de imagen',
    slug: 'mejora-y-escalado-de-imagen',
    categoria_padre: 'Utilidades de apoyo',
    icono: 'Maximize'
  },
  {
    nombre: 'Toma de notas y conocimiento',
    slug: 'toma-de-notas-y-conocimiento',
    categoria_padre: 'Productividad y gestión',
    icono: 'FileText'
  },
  {
    nombre: 'Modelos y activos 3D',
    slug: 'modelos-y-activos-3d',
    categoria_padre: 'Recursos y activos',
    icono: 'Cube'
  }
];

async function crearSubcategorias() {
  console.log('\n📁 PASO 1: Creando nuevas subcategorías...\n');

  for (const subcategoria of nuevasSubcategorias) {
    try {
      // 1. Buscar el ID de la categoría padre
      const { data: categoriaPadre, error: errorPadre } = await supabase
        .from('categorias')
        .select('id')
        .eq('nombre', subcategoria.categoria_padre)
        .single();

      if (errorPadre || !categoriaPadre) {
        console.error(`❌ No se encontró la categoría padre: ${subcategoria.categoria_padre}`);
        continue;
      }

      // 2. Verificar si la subcategoría ya existe
      const { data: existente, error: errorExistente } = await supabase
        .from('categorias')
        .select('id')
        .eq('slug', subcategoria.slug)
        .maybeSingle();

      if (existente) {
        console.log(`⏭️  La subcategoría "${subcategoria.nombre}" ya existe`);
        continue;
      }

      // 3. Insertar la nueva subcategoría
      const { data: nuevaSubcat, error: errorInsert } = await supabase
        .from('categorias')
        .insert({
          nombre: subcategoria.nombre,
          slug: subcategoria.slug,
          id_categoria_padre: categoriaPadre.id,
          icono: subcategoria.icono,
          descripcion: null
        })
        .select()
        .single();

      if (errorInsert) {
        console.error(`❌ Error al crear "${subcategoria.nombre}":`, errorInsert.message);
      } else {
        console.log(`✅ Subcategoría creada: "${subcategoria.nombre}" (ID: ${nuevaSubcat.id})`);
      }

    } catch (error) {
      console.error(`❌ Error inesperado con "${subcategoria.nombre}":`, error.message);
    }
  }

  console.log('\n✅ Subcategorías procesadas correctamente\n');
}

// ============================================================================
// PASO 2: INSERTAR NUEVOS PROGRAMAS
// ============================================================================

async function insertarProgramas() {
  console.log('\n🚀 PASO 2: Insertando nuevos programas...\n');

  // Cargar el JSON con los nuevos programas
  const jsonPath = path.join(__dirname, '..', 'temporal', 'nuevos-progrmas.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const programas = jsonData.nuevos_programas;

  let exitosos = 0;
  let fallidos = 0;

  for (const programa of programas) {
    try {
      console.log(`\n📦 Procesando: ${programa.nombre}...`);

      // 1. Verificar si el programa ya existe
      const { data: existente } = await supabase
        .from('programas')
        .select('id, nombre')
        .eq('slug', programa.slug)
        .maybeSingle();

      if (existente) {
        console.log(`⏭️  El programa "${programa.nombre}" ya existe (ID: ${existente.id})`);
        continue;
      }

      // 2. Obtener el ID de la categoría principal
      let categoria, errorCategoria;
      ({ data: categoria, error: errorCategoria } = await supabase
        .from('categorias')
        .select('id, nombre, slug')
        .eq('slug', programa.categoria_slug)
        .maybeSingle());

      if (errorCategoria || !categoria) {
        console.error(`❌ No se encontró la categoría: ${programa.categoria_slug}`);
        console.error(`   Intentando buscar por nombre en lugar de slug...`);
        
        // Intentar buscar por nombre (convertir slug a nombre)
        const nombreCategoria = programa.categoria_slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        const { data: categoriaPorNombre } = await supabase
          .from('categorias')
          .select('id, nombre, slug')
          .ilike('nombre', nombreCategoria)
          .maybeSingle();
        
        if (!categoriaPorNombre) {
          console.error(`❌ Tampoco se encontró por nombre: ${nombreCategoria}`);
          fallidos++;
          continue;
        }
        
        categoria = categoriaPorNombre;
        console.log(`   ✓ Encontrada categoría: "${categoria.nombre}" (ID: ${categoria.id})`);
      }

      // 3. Insertar el programa principal (SIN created_at/updated_at)
      const { data: nuevoPrograma, error: errorPrograma } = await supabase
        .from('programas')
        .insert({
          nombre: programa.nombre,
          slug: programa.slug,
          icono_url: null, // Lo completarás después
          categoria_id: categoria.id,
          categoria_slug: categoria.slug, // Campo requerido
          descripcion_corta: programa.descripcion_corta,
          descripcion_larga: programa.descripcion_larga,
          captura_url: null, // Lo completarás después
          dificultad: programa.dificultad,
          es_open_source: programa.es_open_source,
          es_recomendado: programa.es_recomendado,
          web_oficial_url: programa.web_oficial_url
        })
        .select()
        .single();

      if (errorPrograma) {
        console.error(`❌ Error al insertar programa:`, errorPrograma.message);
        fallidos++;
        continue;
      }

      console.log(`✅ Programa creado (ID: ${nuevoPrograma.id})`);

      // 4. Insertar relaciones con SUBCATEGORÍAS
      if (programa.subcategorias_slugs && programa.subcategorias_slugs.length > 0) {
        for (const subcatSlug of programa.subcategorias_slugs) {
          const { data: subcat } = await supabase
            .from('categorias')
            .select('id')
            .eq('slug', subcatSlug)
            .single();

          if (subcat) {
            await supabase.from('programas_subcategorias').insert({
              programa_id: nuevoPrograma.id,
              subcategoria_id: subcat.id
            });
          }
        }
        console.log(`   ✓ ${programa.subcategorias_slugs.length} subcategorías vinculadas`);
      }

      // 5. Insertar relaciones con PLATAFORMAS
      if (programa.plataformas_slugs && programa.plataformas_slugs.length > 0) {
        for (const platSlug of programa.plataformas_slugs) {
          const { data: plataforma } = await supabase
            .from('plataformas')
            .select('id')
            .eq('slug', platSlug)
            .single();

          if (plataforma) {
            await supabase.from('programas_plataformas').insert({
              programa_id: nuevoPrograma.id,
              plataforma_id: plataforma.id
            });
          }
        }
        console.log(`   ✓ ${programa.plataformas_slugs.length} plataformas vinculadas`);
      }

      // 6. Insertar relaciones con MODELOS DE PRECIO
      if (programa.modelos_precios_slugs && programa.modelos_precios_slugs.length > 0) {
        for (const precioSlug of programa.modelos_precios_slugs) {
          const { data: precio } = await supabase
            .from('modelos_de_precios')
            .select('id')
            .eq('slug', precioSlug)
            .single();

          if (precio) {
            await supabase.from('programas_modelos_de_precios').insert({
              programa_id: nuevoPrograma.id,
              modelo_precio_id: precio.id
            });
          }
        }
        console.log(`   ✓ ${programa.modelos_precios_slugs.length} modelos de precio vinculados`);
      }

      // 7. Insertar relaciones con ALTERNATIVAS
      if (programa.alternativas_slugs && programa.alternativas_slugs.length > 0) {
        for (const altSlug of programa.alternativas_slugs) {
          const { data: alternativa } = await supabase
            .from('programas')
            .select('id')
            .eq('slug', altSlug)
            .single();

          if (alternativa) {
            await supabase.from('programas_alternativas').insert({
              programa_original_id: nuevoPrograma.id,
              programa_alternativa_id: alternativa.id
            });
          }
        }
        console.log(`   ✓ ${programa.alternativas_slugs.length} alternativas vinculadas`);
      }

      exitosos++;

    } catch (error) {
      console.error(`❌ Error inesperado con "${programa.nombre}":`, error.message);
      fallidos++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Programas insertados exitosamente: ${exitosos}`);
  console.log(`❌ Programas fallidos: ${fallidos}`);
  console.log('='.repeat(60) + '\n');
}

// ============================================================================
// EJECUTAR EL SCRIPT
// ============================================================================

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 SCRIPT DE CARGA DE NUEVOS PROGRAMAS A SUPABASE');
  console.log('='.repeat(60));

  try {
    await crearSubcategorias();
    await insertarProgramas();

    console.log('\n✅ SCRIPT COMPLETADO CON ÉXITO');
    console.log('\n⚠️  RECUERDA: Los campos icono_url y captura_url están vacíos.');
    console.log('   Deberás subirlos a Cloudinary y actualizar la base de datos después.\n');

  } catch (error) {
    console.error('\n❌ ERROR FATAL:', error.message);
    process.exit(1);
  }
}

main();
