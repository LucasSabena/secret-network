// FILE: src/components/blog/related-posts.tsx

import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/types";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Artículos Relacionados
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
