// FILE: src/components/blog/blog-category-badge.tsx
'use client';

import { BlogCategory } from '@/lib/blog-categories';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface BlogCategoryBadgeProps {
  category: BlogCategory;
  asLink?: boolean;
  size?: 'sm' | 'md';
}

export function BlogCategoryBadge({
  category,
  asLink = false,
  size = 'sm',
}: BlogCategoryBadgeProps) {
  const badge = (
    <Badge
      style={{ backgroundColor: category.color }}
      className={`text-white hover:opacity-80 transition-opacity ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
    >
      {category.nombre}
    </Badge>
  );

  if (asLink) {
    return (
      <Link href={`/blog/categoria/${category.slug}`}>
        {badge}
      </Link>
    );
  }

  return badge;
}
