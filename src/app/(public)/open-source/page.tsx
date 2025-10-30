// FILE: src/app/open-source/page.tsx

import { createClient } from "@/lib/supabase";
import { Metadata } from "next";
import { OpenSourceHero } from "@/components/open-source/open-source-hero";
import { OpenSourceListClient } from "@/components/open-source/open-source-list-client";

export const revalidate = 3600; // 1 hora

export const metadata: Metadata = {
  title: 'Herramientas Open Source | Secret Network',
  description: 'Descubre las mejores herramientas de diseño open source. Software libre y de código abierto para creativos y diseñadores.',
};

export default async function OpenSourcePage() {
  const supabase = await createClient();
  
  // Fetch paralelo de datos necesarios
  const [
    { data: programas, error: programasError },
    { data: todasCategorias },
    { data: modelosPrecios },
  ] = await Promise.all([
    supabase
      .from('programas')
      .select('*')
      .eq('es_open_source', true)
      .order('nombre', { ascending: true })
      .limit(100), // Limitar resultados
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
  const categoriasPrincipales = todasCategorias?.filter(
    (cat) => cat.id_categoria_padre === null
  ) || [];

  const subcategorias = todasCategorias?.filter(
    (cat) => cat.id_categoria_padre !== null
  ) || [];

  if (programasError) {
    console.error('Error fetching open source programs:', programasError);
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-red-500">Error al cargar los programas open source.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <OpenSourceHero totalPrograms={programas?.length || 0} />
      
      <OpenSourceListClient
        initialPrograms={programas || []}
        categorias={categoriasPrincipales}
        subcategorias={subcategorias}
        modelosPrecios={modelosPrecios || []}
      />
    </div>
  );
}
