// FILE: src/components/blog/blog-breadcrumbs.tsx
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BlogBreadcrumbsProps {
  items: Breadcrumb[];
}

/**
 * Breadcrumbs para navegación del blog
 */
export function BlogBreadcrumbs({ items }: BlogBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href="/"
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="h-3 w-3" />
        Inicio
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-3 w-3" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
