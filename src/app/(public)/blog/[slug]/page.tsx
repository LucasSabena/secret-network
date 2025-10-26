// FILE: src/app/blog/[slug]/page.tsx

import { createClient, createStaticClient } from "@/lib/supabase";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog/blog-content";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { RelatedPosts } from "@/components/blog/related-posts";
import { BlogShareButtons } from "@/components/blog/blog-share-buttons";
import { ReadingProgressBar } from "@/components/blog/reading-progress-bar";
import { BlogAnalyticsTracker } from "@/components/blog/blog-analytics-tracker";
import { JsonLdArticle } from "@/components/seo/json-ld-article";
import { JsonLdBreadcrumb } from "@/components/seo/json-ld-breadcrumb";
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
    keywords: post.tags || [],
    authors: post.autor ? [{ name: post.autor }] : [{ name: 'Secret Network' }],
    openGraph: {
      type: 'article',
      title: post.titulo,
      description: post.descripcion_corta || '',
      images: post.imagen_portada_url ? [post.imagen_portada_url] : [],
      publishedTime: post.fecha_publicacion,
      modifiedTime: post.actualizado_en,
      authors: post.autor ? [post.autor] : undefined,
      tags: post.tags || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.titulo,
      description: post.descripcion_corta || '',
      images: post.imagen_portada_url ? [post.imagen_portada_url] : [],
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
    <>
      {/* Barra de progreso de lectura */}
      <ReadingProgressBar />
      
      {/* Tracking de analytics */}
      <BlogAnalyticsTracker postId={post.id} />
      
      <div className="container mx-auto px-4 py-8">
        {/* JSON-LD Structured Data */}
        <JsonLdArticle post={post as BlogPost} />
        <JsonLdBreadcrumb 
          items={[
            { name: 'Inicio', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.titulo, url: `/blog/${post.slug}` },
          ]}
        />

      <article className="max-w-4xl mx-auto">
        <BlogPostHeader post={post as BlogPost} />
        <BlogContent content={post.contenido} blocks={post.contenido_bloques} />
        
        {/* Botones de Compartir */}
        <div className="mt-12 pt-8 border-t border-border">
          <BlogShareButtons 
            postId={post.id}
            title={post.titulo}
            url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://secretnetwork.co'}/blog/${post.slug}`}
          />
        </div>
      </article>
      
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <RelatedPosts posts={relatedPosts as BlogPost[]} />
        </div>
      )}
      </div>
    </>
  );
}
