// FILE: src/components/blog/blog-hero-improved.tsx
import { BookOpen, Sparkles, Layers } from 'lucide-react';
import Link from 'next/link';

interface BlogHeroImprovedProps {
  totalPosts: number;
  featuredSeries?: Array<{
    name: string;
    slug: string;
    count: number;
    color: string;
  }>;
}

export function BlogHeroImproved({ totalPosts, featuredSeries }: BlogHeroImprovedProps) {
  return (
    <div className="border-b bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {totalPosts} artículos publicados
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Secret Blog
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Artículos, tutoriales y recursos sobre diseño, creatividad y herramientas digitales
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Actualizado semanalmente</span>
          </div>

          {/* Series destacadas */}
          {featuredSeries && featuredSeries.length > 0 && (
            <div className="pt-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Series destacadas</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {featuredSeries.map((serie) => (
                  <Link
                    key={serie.slug}
                    href={`/blog/serie/${serie.slug}`}
                    className="group px-4 py-2 rounded-full border hover:shadow-md transition-all duration-300"
                    style={{ borderColor: serie.color }}
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {serie.name}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({serie.count})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
