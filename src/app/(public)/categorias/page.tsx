import { createClient } from "@/lib/supabase";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function CategoriasPage() {
  const supabase = await createClient();

  // Obtener todas las categorías principales (sin padre)
  const { data: categoriasPrincipales, error } = await supabase
    .from("categorias")
    .select('*')
    .is("id_categoria_padre", null)
    .order("nombre");

  // Log error for debugging
  if (error) {
    console.error("Error fetching categories:", error);
  }

  // Para cada categoría principal, obtener sus subcategorías
  const categoriasConSubs = await Promise.all(
    (categoriasPrincipales || []).map(async (categoria) => {
      const { data: subcategorias } = await supabase
        .from("categorias")
        .select('id, nombre, slug')
        .eq("id_categoria_padre", categoria.id)
        .order("nombre");

      return {
        ...categoria,
        subcategorias: subcategorias || []
      };
    })
  );

  if (!categoriasPrincipales || categoriasPrincipales.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-lg border border-error/50 bg-error/10 p-6">
            <p className="text-error">
              No se encontraron categorías en la base de datos.
            </p>
            {error && (
              <pre className="mt-2 text-xs text-muted-foreground">
                {JSON.stringify(error, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </main>
    );
  }

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
                <BreadcrumbPage>Categorías</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Explora las categorías
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Encontrá el programa o página que necesitas de forma rápida.
          </p>
        </div>

        {/* Categories Grid - 3 columns */}
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {categoriasConSubs?.map((categoria: any) => (
            <div key={categoria.id} className="space-y-3">
              {/* Category Title - Now clickable */}
              <Link href={`/categorias/${categoria.slug}`}>
                <h2 className="text-lg font-semibold text-foreground transition-colors hover:text-primary cursor-pointer">
                  {categoria.nombre}
                </h2>
              </Link>

              {/* Subcategories List */}
              {categoria.subcategorias && categoria.subcategorias.length > 0 ? (
                <ul className="space-y-2">
                  {categoria.subcategorias.map((sub: any) => (
                    <li key={sub.id}>
                      <Link
                        href={`/categorias/${categoria.slug}/${sub.slug}`}
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                        <span>{sub.nombre}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground/60">
                  No hay subcategorías disponibles
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
