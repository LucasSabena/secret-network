// FILE: src/components/blog/blog-hero.tsx

import { Newspaper } from "lucide-react";

interface BlogHeroProps {
  totalPosts: number;
}

export function BlogHero({ totalPosts }: BlogHeroProps) {
  return (
    <section className="mb-12 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
        <Newspaper className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          {totalPosts} Artículos Publicados
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Blog
        </span>{" "}
        <span className="text-foreground">de Diseño</span>
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Artículos, tutoriales y recursos sobre diseño, creatividad y herramientas digitales
      </p>
    </section>
  );
}
