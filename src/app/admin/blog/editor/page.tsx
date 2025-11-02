// FILE: src/app/admin/blog/editor/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogPost, Autor, Block } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// ✅ LAZY LOAD: Editor pesado (~200KB) - solo carga cuando se necesita
const BlogEditorFullPage = dynamic(
  () => import('@/components/admin/blog-editor-v2/blog-editor-full-page').then(mod => ({ default: mod.BlogEditorFullPage })),
  { 
    ssr: false, // No renderizar en servidor
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando editor...</p>
        </div>
      </div>
    )
  }
);

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(!!postId);

  useEffect(() => {
    if (postId) {
      loadPost(postId);
    }
  }, [postId]);

  async function loadPost(id: string) {
    try {
      const { data, error } = await supabaseBrowserClient
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    router.push('/admin?tab=blog');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <BlogEditorFullPage post={post} onClose={handleClose} />;
}

export default function BlogEditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
