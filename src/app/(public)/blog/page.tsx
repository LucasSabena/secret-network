// FILE: src/app/blog/page.tsx

import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { BlogPost } from "@/lib/types";
import { BlogHeroImproved } from "@/components/blog/blog-hero-improved";
import { BlogGridImproved } from "@/components/blog/blog-grid-improved";
import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";

export const revalidate = 3600; // 1 hora

export const metadata: Metadata = {
  title: 'Blog | Secret Network',
  description: 'Artículos, tutoriales y recursos sobre diseño, creatividad y herramientas digitales.',
};

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <BlogHeroImproved totalPosts={totalPosts} />

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
    </div>
  );
}
