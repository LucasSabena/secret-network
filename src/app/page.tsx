// FILE: src/app/page.tsx

import { createClient } from "@/lib/supabase";
import { Hero } from "@/components/layout/hero";
import { ProgramsListClient } from "@/components/shared/programs-list-client";

// ⚡ ISR: Regenerar esta página cada hora (3600 segundos)
// Esto mejora drásticamente la velocidad al servir páginas pre-renderizadas
export const revalidate = 3600; // 1 hora

// 🚀 Generar metadata para SEO
export const metadata = {
  title: 'Secret Network - Design Tools & Resources',
  description: 'Discover the best design tools, software, and resources for creative professionals.',
};

/**
 * HomePage Component - Updated with filtering and search
 * 
 * Main landing page that displays:
 * - Hero section explaining what Secret Network is
 * - Filters, search, and sorting controls
 * - All programs in a grid layout with full details
 * 
 * This is a Server Component that fetches data and passes it to client components.
 */
export default async function HomePage() {
  const supabase = await createClient();
  
  // 🚀 Optimización: Fetch paralelo de todos los datos necesarios
  const [
    { data: programas, error: programasError },
    { data: todasCategorias },
    { data: modelosPrecios },
  ] = await Promise.all([
    supabase
      .from('programas')
      .select('*')
      .order('nombre', { ascending: true }),
    supabase
      .from('categorias')
      .select('*')
      .order('nombre', { ascending: true }),
    supabase
      .from('modelos_de_precios')
      .select('*')
      .order('nombre', { ascending: true }),
  ]);

  // Separar categorías principales y subcategorías
  const categoriasPrincipales = todasCategorias?.filter(c => !c.id_categoria_padre) || [];
  const subcategorias = todasCategorias?.filter(c => c.id_categoria_padre) || [];

  // Log error for debugging
  if (programasError) {
    console.error("Error fetching programs:", programasError);
  }

  if (!programas || programas.length === 0) {
    return (
      <main className="min-h-screen">
        <Hero />
        <section className="container mx-auto px-4 py-12">
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
            <div className="rounded-lg border border-error/50 bg-error/10 p-6 text-center">
              <p className="mb-2 text-lg font-semibold text-error">
                No programs found in the database.
              </p>
              {programasError && (
                <p className="text-sm text-muted-foreground">
                  Error: {programasError.message}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 2. Fetch all category data needed for programs
  const categoriaIds = [...new Set(programas.map(p => p.categoria_id))];
  
  // 🚀 Optimización: Fetch paralelo de categorías y relaciones
  const programaIds = programas.map(p => p.id);
  
  const [
    { data: categorias },
    { data: subcatRelations },
    { data: programasModelosPrecios },
  ] = await Promise.all([
    supabase
      .from('categorias')
      .select('id, nombre, slug')
      .in('id', categoriaIds),
    supabase
      .from('programas_subcategorias')
      .select('programa_id, subcategoria_id')
      .in('programa_id', programaIds),
    supabase
      .from('programas_modelos_de_precios')
      .select('programa_id, modelo_precio_id')
      .in('programa_id', programaIds),
  ]);

  // Create maps for quick lookup
  const categoriaMap = new Map(categorias?.map(c => [c.id, c]) || []);

  // 4. Fetch all subcategories
  const subcatIds = [...new Set(subcatRelations?.map(r => r.subcategoria_id) || [])];
  const { data: subcatsData } = await supabase
    .from('categorias')
    .select('id, nombre, slug, id_categoria_padre')
    .in('id', subcatIds);

  // Create a map for quick lookup
  const subcategoriaMap = new Map(subcatsData?.map(s => [s.id, s]) || []);

  // 5. Group subcategories by program
  const programaSubcatsMap = new Map<number, any[]>();
  subcatRelations?.forEach(rel => {
    const existing = programaSubcatsMap.get(rel.programa_id) || [];
    const subcat = subcategoriaMap.get(rel.subcategoria_id);
    if (subcat) {
      existing.push(subcat);
      programaSubcatsMap.set(rel.programa_id, existing);
    }
  });

  // 6. Assemble the final data
  const programasConDatos = programas.map(programa => ({
    ...programa,
    categoria: categoriaMap.get(programa.categoria_id) || null,
    subcategorias: programaSubcatsMap.get(programa.id) || []
  }));

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Programs Section with Filters */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Browse All Tools
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explore our complete collection of design tools
          </p>
        </div>

        <ProgramsListClient
          initialPrograms={programasConDatos as any}
          categorias={categoriasPrincipales as any}
          subcategorias={subcatsData || []}
          modelosPrecios={modelosPrecios || []}
          programasModelosPrecios={programasModelosPrecios || []}
        />
      </section>
    </main>
  );
}