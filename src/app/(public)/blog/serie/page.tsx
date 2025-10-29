// FILE: src/app/blog/serie/page.tsx

import { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { ChevronRight, Layers, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Series de Blog | Secret Network',
  description: 'Explora todas las series de artículos organizadas por tema',
};

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function SeriesIndexPage() {
  const supabase = await createClient();

  // Obtener metadatos de series guardadas
  const { data: savedSeries } = await supabase
    .from('blog_series')
    .select('*')
    .order('orden', { ascending: true });

  const seriesMetadata = new Map(
    savedSeries?.map(s => [s.tag, s]) || []
  );

  // Obtener todos los posts publicados con tags
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, titulo, slug, fecha_publicacion, tags, imagen_portada_url')
    .eq('publicado', true)
    .not('tags', 'is', null);

  // Extraer series de los tags
  const seriesMap = new Map<string, any[]>();
  posts?.forEach((post: any) => {
    post.tags?.forEach((tag: string) => {
      // Considerar como serie si tiene 2+ palabras o contiene un año
      if (tag.split(' ').length >= 2 || /\d{4}/.test(tag)) {
        if (!seriesMap.has(tag)) {
          seriesMap.set(tag, []);
        }
        seriesMap.get(tag)!.push(post);
      }
    });
  });

  // Convertir a array y filtrar series con 2+ posts
  const series = Array.from(seriesMap.entries())
    .filter(([_, posts]) => posts.length >= 2)
    .map(([tag, posts]) => {
      const metadata = seriesMetadata.get(tag);
      return {
        tag,
        nombre: metadata?.nombre || tag,
        slug: metadata?.slug || createSlug(tag),
        color: metadata?.color || '#ff3399',
        descripcion: metadata?.descripcion,
        count: posts.length,
        latestPost: posts.sort((a, b) => 
          new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime()
        )[0],
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Layers className="h-4 w-4" />
              {series.length} Series Disponibles
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Series de Blog
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Explora colecciones de artículos organizados por tema
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">Series</span>
          </div>
        </div>
      </div>

      {/* Grid de series */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {series.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay series disponibles aún</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.map((serie) => (
                <Link
                  key={serie.slug}
                  href={`/blog/serie/${serie.slug}`}
                  className="group"
                >
                  <article className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    {/* Imagen del último post */}
                    {serie.latestPost.imagen_portada_url && (
                      <div className="aspect-video overflow-hidden bg-muted relative">
                        <img
                          src={serie.latestPost.imagen_portada_url}
                          alt={serie.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                        />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div 
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: serie.color }}
                          >
                            <Layers className="h-3 w-3" />
                            {serie.count} artículos
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contenido */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {serie.nombre}
                      </h3>

                      {serie.descripcion && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {serie.descripcion}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-sm text-primary font-medium pt-4 border-t">
                        Ver serie
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Botón volver */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            ← Volver al blog
          </Link>
        </div>
      </div>
    </div>
  );
}
