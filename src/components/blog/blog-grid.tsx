// FILE: src/components/blog/blog-grid.tsx

import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/types";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground">
          No hay artículos publicados todavía. ¡Vuelve pronto!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
