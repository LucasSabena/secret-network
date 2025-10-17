// FILE: src/app/blog/page.tsx

import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { BlogPost } from "@/lib/types";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogGrid } from "@/components/blog/blog-grid";

export const revalidate = 3600; // 1 hora

export const metadata: Metadata = {
  title: 'Blog | Secret Network',
  description: 'Artículos, tutoriales y recursos sobre diseño, creatividad y herramientas digitales.',
};

export default async function BlogPage() {
  const supabase = await createClient();
  
  // Traer solo posts publicados, ordenados por fecha
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });

  const totalPosts = posts?.length || 0;

  return (
    <div className="container mx-auto px-4 py-24">
      <BlogHero totalPosts={totalPosts} />
      {posts && posts.length > 0 ? (
        <BlogGrid posts={posts as BlogPost[]} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay posts publicados todavía. ¡Volvé pronto!
          </p>
        </div>
      )}
    </div>
  );
}
