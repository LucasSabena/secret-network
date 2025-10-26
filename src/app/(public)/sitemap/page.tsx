import { createClient } from '@/lib/supabase';
import { ChevronRight, FileText, FolderOpen, Newspaper, Repeat2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Mapa del Sitio | Secret Network',
  description: 'Explora todas las páginas, categorías, programas y artículos de Secret Network.',
};

export const revalidate = 3600; // Revalidar cada hora

export default async function SitemapPage() {
  const supabase = await createClient();

  // Cargar todas las categorías principales
  const { data: categoriasPrincipales } = await supabase
    .from('categorias')
    .select('id, nombre, slug, icono')
    .is('id_categoria_padre', null)
    .order('nombre');

  // Cargar todas las subcategorías
  const { data: todasSubcategorias } = await supabase
    .from('categorias')
    .select('id, nombre, slug, icono, id_categoria_padre')
    .not('id_categoria_padre', 'is', null)
    .order('nombre');

  // Cargar todos los programas
  const { data: programas } = await supabase
    .from('programas')
    .select('nombre, slug')
    .order('nombre');

  // Cargar posts del blog
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('titulo, slug')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });

  // Agrupar subcategorías por categoría padre
  type Subcategoria = NonNullable<typeof todasSubcategorias>[number];
  const subcategoriasPorPadre = (todasSubcategorias || []).reduce((acc, sub) => {
    if (sub.id_categoria_padre) {
      if (!acc[sub.id_categoria_padre]) {
        acc[sub.id_categoria_padre] = [];
      }
      acc[sub.id_categoria_padre].push(sub);
    }
    return acc;
  }, {} as Record<number, Subcategoria[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mapa del Sitio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora todas las páginas, categorías, programas y artículos disponibles en Secret Network
          </p>
        </div>

        <div className="grid gap-8">

          {/* Páginas principales */}
          <section className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Páginas Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/" className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Inicio</span>
              </Link>
              <Link href="/categorias" className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Categorías</span>
              </Link>
              <Link href="/open-source" className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Open Source</span>
              </Link>
              <Link href="/alternativas" className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Alternativas</span>
              </Link>
              <Link href="/blog" className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Blog</span>
              </Link>
              <Link href="/sobre-nosotros" className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Sobre Nosotros</span>
              </Link>
              <Link href="/contacto" className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Contacto</span>
              </Link>
            </div>
          </section>

          {/* Categorías y Subcategorías */}
          <section className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-primary" />
              Categorías ({categoriasPrincipales?.length || 0})
            </h2>
            <div className="space-y-6">
              {categoriasPrincipales?.map((categoria) => {
                const subcats = subcategoriasPorPadre[categoria.id] || [];
                return (
                  <div key={categoria.id} className="space-y-2">
                    <Link 
                      href={`/categorias/${categoria.slug}`}
                      className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group font-semibold"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>{categoria.icono && `${categoria.icono} `}{categoria.nombre}</span>
                      {subcats.length > 0 && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {subcats.length} subcategorías
                        </span>
                      )}
                    </Link>
                    {subcats.length > 0 && (
                      <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {subcats.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/categorias/${categoria.slug}/${sub.slug}`}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors group text-sm"
                          >
                            <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span>{sub.icono && `${sub.icono} `}{sub.nombre}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Programas */}
          <section className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Repeat2 className="w-6 h-6 text-primary" />
              Todos los Programas ({programas?.length || 0})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
              {programas?.map((programa) => (
                <Link
                  key={programa.slug}
                  href={`/programas/${programa.slug}`}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors group text-sm"
                >
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="truncate">{programa.nombre}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Blog */}
          {blogPosts && blogPosts.length > 0 && (
            <section className="bg-card rounded-lg border p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-primary" />
                Artículos del Blog ({blogPosts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {blogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="line-clamp-1">{post.titulo}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            ¿Buscas el sitemap XML para motores de búsqueda?{' '}
            <Link href="/sitemap.xml" className="text-primary hover:underline">
              Ver sitemap.xml
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
