// FILE: src/app/blog/page.tsx

import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { BlogPost } from "@/lib/types";
import { BlogHeroImproved } from "@/components/blog/blog-hero-improved";
import { BlogGridImproved } from "@/components/blog/blog-grid-improved";
import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import { ScrollToTopButton } from "@/components/blog/scroll-to-top-button";

export const revalidate = 3600; // 1 hora

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
  
  // Traer posts publicados con sus categorías
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });

  // Traer categorías
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('orden', { ascending: true });

  // Obtener relaciones post-categoría
  const { data: postCategories } = await supabase
    .from('blog_posts_categories')
    .select('post_id, category_id');

  // Mapear categorías a posts
  const postsWithCategories = posts?.map(post => ({
    ...post,
    categories: postCategories
      ?.filter(pc => pc.post_id === post.id)
      .map(pc => categories?.find(c => c.id === pc.category_id))
      .filter(Boolean) || []
  })) || [];

  const totalPosts = posts?.length || 0;

  // Extraer series destacadas de los tags
  const seriesMap = new Map<string, number>();
  postsWithCategories.forEach(post => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach((tag: string) => {
        if (tag.split(' ').length >= 2 || /\d{4}/.test(tag)) {
          seriesMap.set(tag, (seriesMap.get(tag) || 0) + 1);
        }
      });
    }
  });

  const featuredSeries = Array.from(seriesMap.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({
      name,
      slug: createSlug(name),
      count,
      color: getColorForSeries(name),
    }));

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
