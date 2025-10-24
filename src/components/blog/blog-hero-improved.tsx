// FILE: src/components/blog/blog-hero-improved.tsx
import { BookOpen, Sparkles } from 'lucide-react';

interface BlogHeroImprovedProps {
  totalPosts: number;
}

export function BlogHeroImproved({ totalPosts }: BlogHeroImprovedProps) {
  return (
    <div className="border-b bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {totalPosts} artículos publicados
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Blog de Secret Network
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Artículos, tutoriales y recursos sobre diseño, creatividad y herramientas digitales
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Actualizado semanalmente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
