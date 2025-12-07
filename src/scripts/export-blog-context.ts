
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CONTEXT_DIR = path.join(process.cwd(), 'gemini-context-blog');

async function exportBlogs() {
    console.log('Fetching blogs...');
    const { data: blogs, error } = await supabase
        .from('blogs')
        .select('id, titulo, slug, descripcion_corta')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blogs:', error);
        return;
    }

    const output = {
        descripcion: "Blogs ya existentes en la plataforma. Úsalos para evitar contenido duplicado y para hacer interlinking inteligente.",
        total: blogs.length,
        blogs: blogs.map(b => ({
            id: b.id,
            titulo: b.titulo,
            slug: b.slug,
            descripcion: b.descripcion_corta
        }))
    };

    fs.writeFileSync(
        path.join(CONTEXT_DIR, '02_blogs_existentes.json'),
        JSON.stringify(output, null, 2)
    );
    console.log(`Exported ${blogs.length} blogs to 02_blogs_existentes.json`);
}

async function exportPrograms() {
    console.log('Fetching programs and categories...');

    const { data: categories, error: catError } = await supabase
        .from('categorias')
        .select('id, nombre, slug');

    if (catError) {
        console.error('Error fetching categories:', catError);
        return;
    }

    const { data: programs, error: progError } = await supabase
        .from('programas')
        .select('id, nombre, slug, categoria_id, descripcion_corta, web_oficial_url')
        .order('nombre');

    if (progError) {
        console.error('Error fetching programs:', progError);
        return;
    }

    const categoryMap = new Map(categories.map(c => [c.id, c.nombre]));

    const output = {
        descripcion: "Programas disponibles en la base de datos. Úsalos para los bloques 'program-card' y 'programs-grid'.",
        total: programs.length,
        programas: programs.map(p => ({
            id: p.id,
            nombre: p.nombre,
            slug: p.slug,
            categoria: categoryMap.get(p.categoria_id) || 'General',
            descripcion: p.descripcion_corta,
            url: p.web_oficial_url
        }))
    };

    fs.writeFileSync(
        path.join(CONTEXT_DIR, '03_programas_referenciables.json'),
        JSON.stringify(output, null, 2)
    );
    console.log(`Exported ${programs.length} programs to 03_programas_referenciables.json`);
}

async function main() {
    if (!fs.existsSync(CONTEXT_DIR)) {
        fs.mkdirSync(CONTEXT_DIR);
    }

    await exportBlogs();
    await exportPrograms();
    console.log('Export completed successfully via Antigravity!');
}

main();
