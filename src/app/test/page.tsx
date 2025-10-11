import { createClient } from "@/lib/supabase";

export default async function TestPage() {
  const supabase = await createClient();
  
  // Test 1: Programas
  const { data: programas, error: programasError } = await supabase
    .from('programas')
    .select('id, nombre, slug')
    .limit(5);

  // Test 2: Categorías principales
  const { data: categoriasPrincipales, error: catError } = await supabase
    .from('categorias')
    .select('*')
    .is('id_categoria_padre', null)
    .order('nombre');

  // Test 3: Todas las categorías (incluyendo subcategorías)
  const { data: todasCategorias, error: allCatError } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="mb-6 text-3xl font-bold text-primary">Test Supabase Connection</h1>
      
      {/* Test Programas */}
      <section className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">Test 1: Programas</h2>
        {programasError ? (
          <div className="rounded border border-error bg-error/10 p-4">
            <p className="font-semibold text-error">Error:</p>
            <pre className="mt-2 text-xs text-muted-foreground">{JSON.stringify(programasError, null, 2)}</pre>
          </div>
        ) : (
          <div className="rounded border border-success bg-success/10 p-4">
            <p className="mb-2 font-semibold text-success">Success! Found {programas?.length || 0} programs</p>
            <pre className="text-xs text-muted-foreground">{JSON.stringify(programas, null, 2)}</pre>
          </div>
        )}
      </section>

      {/* Test Categorías Principales */}
      <section className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">Test 2: Categorías Principales</h2>
        {catError ? (
          <div className="rounded border border-error bg-error/10 p-4">
            <p className="font-semibold text-error">Error:</p>
            <pre className="mt-2 text-xs text-muted-foreground">{JSON.stringify(catError, null, 2)}</pre>
          </div>
        ) : (
          <div className="rounded border border-success bg-success/10 p-4">
            <p className="mb-2 font-semibold text-success">
              Found {categoriasPrincipales?.length || 0} main categories
            </p>
            <pre className="text-xs text-muted-foreground">{JSON.stringify(categoriasPrincipales, null, 2)}</pre>
          </div>
        )}
      </section>

      {/* Test Todas las Categorías */}
      <section className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">Test 3: Todas las Categorías</h2>
        {allCatError ? (
          <div className="rounded border border-error bg-error/10 p-4">
            <p className="font-semibold text-error">Error:</p>
            <pre className="mt-2 text-xs text-muted-foreground">{JSON.stringify(allCatError, null, 2)}</pre>
          </div>
        ) : (
          <div className="rounded border border-success bg-success/10 p-4">
            <p className="mb-2 font-semibold text-success">
              Found {todasCategorias?.length || 0} total categories (including subcategories)
            </p>
            <pre className="max-h-96 overflow-auto text-xs text-muted-foreground">
              {JSON.stringify(todasCategorias, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}
