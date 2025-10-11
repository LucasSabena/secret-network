// FILE: src/app/blog/[slug]/page.tsx

import { createClient, createStaticClient } from "@/lib/supabase";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog/blog-content";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { RelatedPosts } from "@/components/blog/related-posts";
import type { BlogPost } from "@/lib/types";

export const revalidate = 3600; // 1 hora

// Generar rutas estáticas para ISR
export async function generateStaticParams() {
  const supabase = createStaticClient();
  
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('publicado', true);

  return posts?.map((post) => ({
    slug: post.slug,
  })) || [];
}

// Generar metadata dinámica
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single();

  if (!post) {
    return {
      title: 'Post no encontrado | Secret Network',
    };
  }

  return {
    title: `${post.titulo} | Secret Network Blog`,
    description: post.descripcion_corta || post.titulo,
    openGraph: {
      title: post.titulo,
      description: post.descripcion_corta || '',
      images: post.imagen_portada_url ? [post.imagen_portada_url] : [],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single();

  if (error || !post) {
    notFound();
  }

  // Obtener posts relacionados (mismos tags)
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .neq('id', post.id)
    .limit(3);

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <BlogPostHeader post={post as BlogPost} />
        <BlogContent content={post.contenido} />
      </article>
      
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <RelatedPosts posts={relatedPosts as BlogPost[]} />
        </div>
      )}
    </div>
  );
}
