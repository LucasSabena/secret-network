// FILE: src/components/blog/blog-category-filter.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface Category {
  id: number;
  nombre: string;
  slug: string;
  color: string;
  icono: string;
}

interface BlogCategoryFilterProps {
  categories: Category[];
}

export function BlogCategoryFilter({ categories }: BlogCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('categoria')
  );

  const handleCategoryClick = (slug: string | null) => {
    setSelectedCategory(slug);
    if (slug) {
      router.push(`/blog?categoria=${slug}`);
    } else {
      router.push('/blog');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground">Filtrar por categoría</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryClick(null)}
          className="rounded-full"
        >
          Todas
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryClick(category.slug)}
            className="rounded-full"
            style={{
              backgroundColor: selectedCategory === category.slug ? category.color : undefined,
              borderColor: category.color,
            }}
          >
            {category.nombre}
          </Button>
        ))}
      </div>
    </div>
  );
}
