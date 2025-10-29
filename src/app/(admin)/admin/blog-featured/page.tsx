import { Metadata } from 'next';
import { BlogFeaturedManager } from '@/components/admin/blog-featured-manager';

export const metadata: Metadata = {
  title: 'Posts Destacados | Admin',
  description: 'Gestiona los posts destacados del blog',
};

export default function BlogFeaturedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Posts Destacados</h1>
        <p className="text-muted-foreground">
          Gestiona qué posts aparecen en el carrusel principal del blog
        </p>
      </div>

      <BlogFeaturedManager />
    </div>
  );
}
