// FILE: src/app/admin/blog-categorias/page.tsx
import AdminAuthCheck from '@/components/admin/admin-auth-check';
import { BlogCategoriesManager } from '@/components/admin/blog-categories-manager';

export default function BlogCategoriasPage() {
  return (
    <AdminAuthCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Categorías del Blog</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las categorías para organizar tus posts
          </p>
        </div>
        
        <BlogCategoriesManager />
      </div>
    </AdminAuthCheck>
  );
}
