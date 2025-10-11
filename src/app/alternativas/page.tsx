// FILE: src/app/alternativas/page.tsx

import { createClient } from "@/lib/supabase";
import { Metadata } from "next";
import { AlternativesHero } from "@/components/alternativas/alternatives-hero";
import { AlternativesGrid } from "@/components/alternativas/alternatives-grid";

export const revalidate = 3600; // 1 hora

export const metadata: Metadata = {
  title: 'Alternativas a Herramientas Populares | Secret Network',
  description: 'Descubre alternativas a las herramientas de diseño más populares. Compara opciones y encuentra la mejor solución para tu flujo de trabajo.',
};

export default async function AlternativasPage() {
  const supabase = await createClient();
  
  // Obtener programas más populares/recomendados con sus alternativas
  const { data: programasPopulares, error } = await supabase
    .from('programas')
    .select('*')
    .eq('es_recomendado', true)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error fetching popular programs:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-red-500">Error al cargar los programas populares.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AlternativesHero totalPrograms={programasPopulares?.length || 0} />
      <AlternativesGrid programs={programasPopulares || []} />
    </div>
  );
}
