// FILE: src/app/blog/page.tsx

import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { BlogPost } from "@/lib/types";
import { BlogHeroImproved } from "@/components/blog/blog-hero-improved";
import { BlogGridImproved } from "@/components/blog/blog-grid-improved";
import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import { ScrollToTopButton } from "@/components/blog/scroll-to-top-button";

export const revalidate = 3600; // 1 hora
export const dynamic = 'force-dynamic'; // Generar en cada request para mejor UX con skeleton

export const metadata: Metadata = {
  title: 'Secret Blog | Secret Network',
  description: 'Artículos, tutoriales y recursos sobre diseño, creatividad y herramientas digitales.',
};

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getColorForSeries(name: string): string {
  const colors = [
    '#ff3399', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default async function BlogPage() {
  const supabase = await createClient();
  
  // Optimización: Solo traer campos necesarios
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, titulo, slug, descripcion_corta, imagen_portada_url, fecha_publicacion, tags, contenido_bloques')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false })
    .limit(50); // Limitar para mejor performance

  // Traer categorías (solo las necesarias)
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id, nombre, slug, color, icono')
    .order('orden', { ascending: true });

  // Obtener relaciones post-categoría solo para los posts cargados
  const postIds = posts?.map(p => p.id) || [];
  const { data: postCategories } = await supabase
    .from('blog_posts_categories')
    .select('post_id, category_id')
    .in('post_id', postIds);

  // Mapear categorías a posts de forma más eficiente
  const categoryMap = new Map(categories?.map(c => [c.id, c]) || []);
  const postCategoryMap = new Map<number, any[]>();
  
  postCategories?.forEach(pc => {
    if (!postCategoryMap.has(pc.post_id)) {
      postCategoryMap.set(pc.post_id, []);
    }
    const category = categoryMap.get(pc.category_id);
    if (category) {
      postCategoryMap.get(pc.post_id)!.push(category);
    }
  });

  const postsWithCategories = posts?.map(post => ({
    ...post,
    categories: postCategoryMap.get(post.id) || []
  })) || [];

  const totalPosts = posts?.length || 0;

  // Obtener serie destacada en hero desde blog_series
  const { data: featuredSerieData } = await supabase
    .from('blog_series')
    .select('*')
    .eq('is_featured_in_hero', true)
    .single();

  let featuredSeries: Array<{
    name: string;
    slug: string;
    count: number;
    color: string;
  }> = [];
  
  if (featuredSerieData) {
    // Contar posts de la serie destacada
    const seriePostsCount = postsWithCategories.filter(post => 
      post.tags?.includes(featuredSerieData.tag)
    ).length;

    if (seriePostsCount > 0) {
      featuredSeries = [{
        name: featuredSerieData.nombre,
        slug: featuredSerieData.slug,
        count: seriePostsCount,
        color: featuredSerieData.color,
      }];
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <BlogHeroImproved totalPosts={totalPosts} featuredSeries={featuredSeries} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filtros de Categorías */}
        <BlogCategoryFilter categories={categories || []} />

        {/* Grid de Posts */}
        {postsWithCategories && postsWithCategories.length > 0 ? (
          <BlogGridImproved posts={postsWithCategories as any[]} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay posts publicados todavía. ¡Volvé pronto!
            </p>
          </div>
        )}
      </div>

      {/* Botón volver arriba */}
      <ScrollToTopButton />
    </div>
  );
}
