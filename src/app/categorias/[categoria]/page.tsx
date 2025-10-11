import { createClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgramCard } from "@/components/shared/program-card";

type Props = {
  params: Promise<{ categoria: string }>;
};

type Subcategoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
};

type Programa = {
  id: number;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  icono_url: string | null;
  es_recomendado: boolean;
  es_open_source: boolean;
};

/**
 * Genera metadata dinámica para SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: categoriaSlug } = await params;
  const supabase = await createClient();

  const { data: categoria } = await supabase
    .from("categorias")
    .select("nombre, descripcion")
    .eq("slug", categoriaSlug)
    .is("id_categoria_padre", null)
    .single();

  if (!categoria) {
    return {
      title: "Categoría no encontrada",
    };
  }

  return {
    title: `${categoria.nombre} - Secret Station`,
    description: categoria.descripcion || `Explora todas las herramientas de ${categoria.nombre}`,
  };
}

/**
 * Página de categoría principal
 * Muestra todas las subcategorías y programas de esa categoría
 * 
 * Ruta: /categorias/[categoria]
 * Ejemplo: /categorias/creacion-con-ia
 */
export default async function CategoriaPage({ params }: Props) {
  const { categoria: categoriaSlug } = await params;
  const supabase = await createClient();

  // Obtener categoría principal
  const { data: categoria, error: categoriaError } = await supabase
    .from("categorias")
    .select("id, nombre, slug, descripcion, icono")
    .eq("slug", categoriaSlug)
    .is("id_categoria_padre", null)
    .single();

  if (categoriaError || !categoria) {
    notFound();
  }

  // Obtener todas las subcategorías de esta categoría
  const { data: subcategorias } = await supabase
    .from("categorias")
    .select("id, nombre, slug, descripcion")
    .eq("id_categoria_padre", categoria.id)
    .order("nombre");

  // Obtener todos los programas de esta categoría (de todas sus subcategorías)
  const subcategoriaIds = subcategorias?.map((s: Subcategoria) => s.id) || [];
  
  let programas: any[] = [];
  if (subcategoriaIds.length > 0) {
    // Obtener relaciones programa-subcategoria
    const { data: relaciones } = await supabase
      .from("programas_subcategorias")
      .select("programa_id")
      .in("subcategoria_id", subcategoriaIds);

    const programaIds = [...new Set(relaciones?.map((r: { programa_id: number }) => r.programa_id) || [])];

    if (programaIds.length > 0) {
      const { data: programasData } = await supabase
        .from("programas")
        .select("id, nombre, slug, descripcion_corta, icono_url, captura_url, es_recomendado, es_open_source, dificultad, categoria_id, web_oficial_url")
        .in("id", programaIds)
        .order("nombre");

      // Obtener las categorías principales de estos programas
      const { data: categoriasPrincipales } = await supabase
        .from("categorias")
        .select("id, nombre, slug")
        .in("id", programasData?.map(p => p.categoria_id) || []);

      const categoriaMap = new Map(categoriasPrincipales?.map(c => [c.id, c]) || []);

      // Obtener subcategorías para cada programa
      const { data: subcatRelations } = await supabase
        .from("programas_subcategorias")
        .select("programa_id, subcategoria_id")
        .in("programa_id", programaIds);

      const allSubcatIds = [...new Set(subcatRelations?.map(r => r.subcategoria_id) || [])];
      const { data: todasSubcategorias } = await supabase
        .from("categorias")
        .select("id, nombre, slug")
        .in("id", allSubcatIds);

      const subcategoriaMap = new Map(todasSubcategorias?.map(s => [s.id, s]) || []);

      const programaSubcatsMap = new Map<number, any[]>();
      subcatRelations?.forEach(rel => {
        const existing = programaSubcatsMap.get(rel.programa_id) || [];
        const subcat = subcategoriaMap.get(rel.subcategoria_id);
        if (subcat) {
          existing.push(subcat);
          programaSubcatsMap.set(rel.programa_id, existing);
        }
      });

      // Ensamblar programas con sus relaciones
      programas = programasData?.map(programa => ({
        ...programa,
        categoria: categoriaMap.get(programa.categoria_id) || null,
        subcategorias: programaSubcatsMap.get(programa.id) || []
      })) || [];
    }
  }

  // Contar programas por subcategoría
  const programasPorSubcategoria = new Map<number, number>();
  if (subcategoriaIds.length > 0) {
    const { data: conteos } = await supabase
      .from("programas_subcategorias")
      .select("subcategoria_id")
      .in("subcategoria_id", subcategoriaIds);

    conteos?.forEach((c: { subcategoria_id: number }) => {
      const count = programasPorSubcategoria.get(c.subcategoria_id) || 0;
      programasPorSubcategoria.set(c.subcategoria_id, count + 1);
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          <span>Inicio</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/categorias"
          className="transition-colors hover:text-foreground"
        >
          Categorías
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{categoria.nombre}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          {categoria.nombre}
        </h1>
        {categoria.descripcion && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {categoria.descripcion}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{subcategorias?.length || 0} subcategorías</span>
          <span>•</span>
          <span>{programas.length} programas</span>
        </div>
      </div>

      {/* Subcategorías Grid */}
      {subcategorias && subcategorias.length > 0 ? (
        <div className="space-y-12">
          {/* Subcategorías */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Subcategorías</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subcategorias.map((subcategoria: Subcategoria) => {
                const numProgramas = programasPorSubcategoria.get(subcategoria.id) || 0;
                
                return (
                  <Link
                    key={subcategoria.id}
                    href={`/categorias/${categoria.slug}/${subcategoria.slug}`}
                  >
                    <Card className="h-full transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2 flex-1">
                            <Tag className="h-5 w-5 text-primary flex-shrink-0" />
                            <CardTitle className="text-lg">
                              {subcategoria.nombre}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {subcategoria.descripcion && (
                          <CardDescription className="mb-3 line-clamp-2">
                            {subcategoria.descripcion}
                          </CardDescription>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {numProgramas} {numProgramas === 1 ? "programa" : "programas"}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Programas de esta categoría */}
          {programas.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold">
                Todos los programas de {categoria.nombre}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programas.map((programa) => (
                  <ProgramCard key={programa.id} program={programa} variant="large" />
                ))}
              </div>
            </div>
          )}

          {/* Botón para ver todas las categorías */}
          <div className="flex justify-center pt-8">
            <Link
              href="/categorias"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Ver todas las categorías
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No hay subcategorías</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Esta categoría aún no tiene subcategorías definidas.
          </p>
          <Link
            href="/categorias"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explorar otras categorías
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
