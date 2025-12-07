// Script para exportar datos para Gemini Gem
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportData() {
    const outputDir = path.join(process.cwd(), 'gemini-context');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('📦 Exportando datos para Gemini Gem...\n');

    // 1. Categorías
    const { data: categorias } = await supabase
        .from('categorias')
        .select('id, nombre, slug, descripcion, id_categoria_padre, icono')
        .order('nombre');

    const categoriasJson = {
        descripcion: "Lista de todas las categorías y subcategorías disponibles",
        categorias_principales: categorias?.filter(c => !c.id_categoria_padre).map(c => ({
            slug: c.slug,
            nombre: c.nombre,
            icono: c.icono,
            subcategorias: categorias?.filter(sub => sub.id_categoria_padre === c.id).map(sub => ({
                slug: sub.slug,
                nombre: sub.nombre
            }))
        }))
    };

    fs.writeFileSync(
        path.join(outputDir, '01_categorias.json'),
        JSON.stringify(categoriasJson, null, 2)
    );
    console.log('✅ Categorías exportadas');

    // 2. Plataformas
    const { data: plataformas } = await supabase
        .from('Plataformas')
        .select('nombre, slug')
        .order('nombre');

    fs.writeFileSync(
        path.join(outputDir, '02_plataformas.json'),
        JSON.stringify({
            descripcion: "Plataformas disponibles para los programas",
            plataformas: plataformas?.map(p => p.slug || p.nombre.toLowerCase())
        }, null, 2)
    );
    console.log('✅ Plataformas exportadas');

    // 3. Modelos de precio
    const { data: precios } = await supabase
        .from('Modelos de Precios')
        .select('nombre, slug')
        .order('nombre');

    fs.writeFileSync(
        path.join(outputDir, '03_modelos_precio.json'),
        JSON.stringify({
            descripcion: "Modelos de precio disponibles",
            modelos_precio: precios?.map(p => p.slug || p.nombre.toLowerCase().replace(/\s+/g, '-'))
        }, null, 2)
    );
    console.log('✅ Modelos de precio exportados');

    // 4. Ejemplos de programas (5 programas bien completos)
    const { data: ejemplos } = await supabase
        .from('programas')
        .select('*')
        .not('descripcion_larga', 'is', null)
        .limit(5);

    if (ejemplos) {
        for (const prog of ejemplos) {
            // Cargar relaciones
            const { data: subs } = await supabase
                .from('programas_subcategorias')
                .select('subcategoria_id')
                .eq('programa_id', prog.id);

            const { data: plats } = await supabase
                .from('programas_plataformas')
                .select('plataforma_id')
                .eq('programa_id', prog.id);

            const { data: precs } = await supabase
                .from('programas_precios')
                .select('precio_id')
                .eq('programa_id', prog.id);

            // Mapear IDs a slugs
            const subSlugs = subs?.map(s => {
                const cat = categorias?.find(c => c.id === s.subcategoria_id);
                return cat?.slug;
            }).filter(Boolean);

            const platSlugs = plats?.map(p => {
                const plat = plataformas?.find(pl => pl.id === p.plataforma_id);
                return plat?.slug || plat?.nombre?.toLowerCase();
            }).filter(Boolean);

            const precSlugs = precs?.map(p => {
                const prec = precios?.find(pr => pr.id === p.precio_id);
                return prec?.slug || prec?.nombre?.toLowerCase().replace(/\s+/g, '-');
            }).filter(Boolean);

            prog.subcategorias_ejemplo = subSlugs;
            prog.plataformas_ejemplo = platSlugs;
            prog.modelos_precio_ejemplo = precSlugs;
        }
    }

    const ejemplosFormateados = ejemplos?.map(p => ({
        nombre: p.nombre,
        slug: p.slug,
        web_oficial_url: p.web_oficial_url,
        descripcion_corta: p.descripcion_corta,
        descripcion_larga: p.descripcion_larga,
        categoria_slug: p.categoria_slug,
        subcategorias: p.subcategorias_ejemplo || [],
        usos: p.usos || [],
        plataformas: p.plataformas_ejemplo || [],
        modelos_precio: p.modelos_precio_ejemplo || [],
        dificultad: p.dificultad,
        es_open_source: p.es_open_source,
        es_recomendado: p.es_recomendado
    }));

    fs.writeFileSync(
        path.join(outputDir, '04_ejemplos_programas.json'),
        JSON.stringify({
            descripcion: "Ejemplos de programas bien formateados para referencia",
            ejemplos: ejemplosFormateados
        }, null, 2)
    );
    console.log('✅ Ejemplos exportados');

    // 5. Prompt del sistema
    const systemPrompt = `# Secret Network - Generador de Programas

Eres un asistente especializado en generar datos estructurados de programas/software para la base de datos de Secret Network.

## Tu tarea
Cuando el usuario te pida programas de una categoría o tipo específico, debes generar un JSON con la información completa de cada programa.

## Formato de salida OBLIGATORIO
Devuelve SOLO un JSON válido, sin texto adicional, con este formato exacto:

\`\`\`json
[
  {
    "nombre": "Nombre del Programa",
    "slug": "nombre-del-programa",
    "web_oficial_url": "https://sitio-oficial.com",
    "descripcion_corta": "Descripción concisa de 1-2 líneas máximo 200 caracteres",
    "descripcion_larga": "Descripción detallada con características principales, casos de uso y beneficios. Puede incluir HTML básico como <strong>, <ul>, <li>.",
    "categoria_slug": "slug-de-categoria-principal",
    "subcategorias": ["slug-subcategoria1", "slug-subcategoria2"],
    "usos": ["Uso principal 1", "Uso principal 2", "Uso principal 3"],
    "plataformas": ["windows", "macos", "linux", "web", "android", "ios"],
    "modelos_precio": ["gratis", "freemium", "pago-unico", "suscripcion"],
    "dificultad": "Facil|Intermedio|Dificil",
    "es_open_source": true|false,
    "es_recomendado": false
  }
]
\`\`\`

## Reglas importantes
1. El slug debe ser lowercase, sin espacios ni caracteres especiales, solo guiones
2. descripcion_corta máximo 200 caracteres
3. usos: 3-5 casos de uso principales del programa
4. Solo usa categorías, subcategorías, plataformas y modelos de precio que existan (ver archivos de contexto)
5. dificultad solo puede ser exactamente: "Facil", "Intermedio", o "Dificil"
6. Siempre busca la URL oficial real del programa
7. es_recomendado siempre en false (se activa manualmente después)

## Archivos de contexto
- 01_categorias.json: Categorías y subcategorías disponibles
- 02_plataformas.json: Plataformas válidas
- 03_modelos_precio.json: Modelos de precio válidos
- 04_ejemplos_programas.json: Ejemplos de referencia

Responde SIEMPRE con JSON válido. Si no conoces un programa, no lo inventes.`;

    fs.writeFileSync(
        path.join(outputDir, '00_system_prompt.txt'),
        systemPrompt
    );
    console.log('✅ System prompt creado');

    console.log('\n🎉 Exportación completada!');
    console.log(`📁 Archivos guardados en: ${outputDir}`);
    console.log('\nPasos para crear el Gem en Gemini:');
    console.log('1. Ve a gemini.google.com/gems');
    console.log('2. Crea un nuevo Gem llamado "Secret Network - Programas"');
    console.log('3. En el prompt del sistema, pega el contenido de 00_system_prompt.txt');
    console.log('4. Sube los archivos 01-04 como contexto');
    console.log('5. Guarda el Gem');
}

exportData().catch(console.error);
