import { createClient } from "@/lib/supabase";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ProgramCard } from "@/components/shared/program-card";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageProps {
  params: Promise<{
    categoria: string;
    subcategoria: string;
  }>;
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { categoria: categoriaSlug, subcategoria: subcategoriaSlug } = await params;
  const supabase = await createClient();

  // 1. Obtener la subcategoría por slug
  const { data: subcategoria, error: subcatError } = await supabase
    .from('categorias')
    .select('id, nombre, slug, descripcion, id_categoria_padre')
    .eq('slug', subcategoriaSlug)
    .single();

  if (subcatError || !subcategoria || !subcategoria.id_categoria_padre) {
    notFound();
  }

  // 2. Obtener la categoría padre
  const { data: categoriaPadre } = await supabase
    .from('categorias')
    .select('id, nombre, slug')
    .eq('id', subcategoria.id_categoria_padre)
    .single();

  if (!categoriaPadre || categoriaPadre.slug !== categoriaSlug) {
    notFound();
  }

  // 3. Obtener IDs de programas que tienen esta subcategoría
  const { data: programasIds } = await supabase
    .from('programas_subcategorias')
    .select('programa_id')
    .eq('subcategoria_id', subcategoria.id);

  const programaIdsArray = programasIds?.map(p => p.programa_id) || [];

  if (programaIdsArray.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/categorias">Categorías</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/categorias/${categoriaPadre.slug}`}>
                    {categoriaPadre.nombre}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{subcategoria.nombre}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              {subcategoria.nombre}
            </h1>
            {subcategoria.descripcion && (
              <p className="text-base text-muted-foreground md:text-lg">
                {subcategoria.descripcion}
              </p>
            )}
          </div>

          {/* Empty state */}
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card p-12">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                No programs found in this category yet.
              </p>
              <Link 
                href="/categorias"
                className="mt-4 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary-hover"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Browse all categories
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 4. Obtener información completa de los programas
  const { data: programas } = await supabase
    .from('programas')
    .select('*')
    .in('id', programaIdsArray)
    .order('nombre', { ascending: true });

  // 5. Obtener datos relacionados en batch
  const { data: categorias } = await supabase
    .from('categorias')
    .select('id, nombre, slug')
    .in('id', programas?.map(p => p.id_categoria) || []);

  const categoriaMap = new Map(categorias?.map(c => [c.id, c]) || []);

  // 6. Obtener subcategorías para cada programa
  const { data: subcatRelations } = await supabase
    .from('programas_subcategorias')
    .select('programa_id, subcategoria_id')
    .in('programa_id', programas?.map(p => p.id) || []);

  const subcatIds = [...new Set(subcatRelations?.map(r => r.subcategoria_id) || [])];
  const { data: subcategorias } = await supabase
    .from('categorias')
    .select('id, nombre, slug')
    .in('id', subcatIds);

  const subcategoriaMap = new Map(subcategorias?.map(s => [s.id, s]) || []);

  const programaSubcatsMap = new Map<number, any[]>();
  subcatRelations?.forEach(rel => {
    const existing = programaSubcatsMap.get(rel.programa_id) || [];
    const subcat = subcategoriaMap.get(rel.subcategoria_id);
    if (subcat) {
      existing.push(subcat);
      programaSubcatsMap.set(rel.programa_id, existing);
    }
  });

  // 7. Ensamblar datos finales
  const programasConDatos = programas?.map(programa => ({
    ...programa,
    categoria: categoriaMap.get(programa.id_categoria) || null,
    subcategorias: programaSubcatsMap.get(programa.id) || []
  })) || [];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/categorias">Categorías</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/categorias/${categoriaPadre.slug}`}>
                  {categoriaPadre.nombre}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{subcategoria.nombre}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            {subcategoria.nombre}
          </h1>
          {subcategoria.descripcion && (
            <p className="text-base text-muted-foreground md:text-lg">
              {subcategoria.descripcion}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {programasConDatos.length} {programasConDatos.length === 1 ? 'program' : 'programs'} found
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {programasConDatos.map((programa) => (
            <ProgramCard key={programa.id} program={programa} />
          ))}
        </div>
      </div>
    </main>
  );
}
