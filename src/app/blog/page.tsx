// FILE: src/app/blog/page.tsx

import { createClient } from "@/lib/supabase";
import { Metadata } from "next";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogGrid } from "@/components/blog/blog-grid";

export const revalidate = 3600; // 1 hora

export const metadata: Metadata = {
  title: 'Blog | Secret Network',
  description: 'Artículos, tutoriales y recursos sobre diseño, creatividad y herramientas digitales.',
};

export default async function BlogPage() {
  const supabase = await createClient();
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-red-500">Error al cargar los artículos del blog.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogHero totalPosts={posts?.length || 0} />
      <BlogGrid posts={posts || []} />
    </div>
  );
}
