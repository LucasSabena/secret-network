import { createClient } from "@/lib/supabase";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

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
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link 
            href="/" 
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Categories</span>
        </nav>

        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Open Source Software Categories
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Browse top categories to find your best Open Source software options.
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
                  No subcategories available
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Showing {categoriasConSubs?.length || 0} main categories with{" "}
            {categoriasConSubs?.reduce((acc, cat) => acc + (cat.subcategorias?.length || 0), 0) || 0}{" "}
            subcategories total.
          </p>
        </div>
      </div>
    </main>
  );
}
