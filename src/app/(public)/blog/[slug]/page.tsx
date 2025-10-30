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

  // Obtener categoría si existe
  const { data: postCategories } = await supabase
    .from('blog_posts_categories')
    .select('category_id')
    .eq('post_id', post.id)
    .limit(1)
    .single();

  let categoryName = '';
  if (postCategories) {
    const { data: category } = await supabase
      .from('blog_categories')
      .select('nombre')
      .eq('id', postCategories.category_id)
      .single();
    categoryName = category?.nombre || '';
  }

  // Usar imagen de portada si existe, sino generar OG image dinámica
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://secretnetwork.co';
  const imageUrl = post.imagen_portada_url || 
    `${baseUrl}/api/og-blog?title=${encodeURIComponent(post.titulo)}&author=${encodeURIComponent(post.autor || 'Binary Studio')}&date=${encodeURIComponent(post.fecha_publicacion)}&category=${encodeURIComponent(categoryName)}`;

  return {
    title: `${post.titulo} | Secret Network Blog`,
    description: post.descripcion_corta || post.titulo,
    keywords: post.tags || [],
    authors: post.autor ? [{ name: post.autor }] : [{ name: 'Secret Network' }],
    openGraph: {
      type: 'article',
      title: post.titulo,
      description: post.descripcion_corta || '',
      images: [imageUrl],
      publishedTime: post.fecha_publicacion,
      modifiedTime: post.actualizado_en,
      authors: post.autor ? [post.autor] : undefined,
      tags: post.tags || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.titulo,
      description: post.descripcion_corta || '',
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const supabase = await createClient();
  
  // Si es modo preview, no filtrar por publicado
  const query = supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug);
  
  // Solo filtrar por publicado si NO es preview
  if (preview !== 'true') {
    query.eq('publicado', true);
  }
  
  const { data: post, error } = await query.single();

  if (error || !post) {
    notFound();
  }
  
  // Mostrar banner de preview si no está publicado
  const isPreview = preview === 'true' && !post.publicado;

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
      
      {/* Tracking de analytics - solo si está publicado */}
      {!isPreview && <BlogAnalyticsTracker postId={post.id} />}
      
      {/* Banner de preview */}
      {isPreview && (
        <div className="bg-yellow-500 text-yellow-950 py-3 px-4 text-center font-medium">
          🔍 Modo Preview - Este post no está publicado aún
        </div>
      )}
      
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
