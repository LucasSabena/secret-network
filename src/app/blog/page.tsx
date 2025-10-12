// FILE: src/app/blog/page.tsx

import { Metadata } from "next";
import { Newspaper } from "lucide-react";

export const revalidate = 3600; // 1 hora

export const metadata: Metadata = {
  title: 'Blog | Secret Network',
  description: 'Artículos, tutoriales y recursos sobre diseño, creatividad y herramientas digitales.',
};

export default async function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Newspaper className="w-20 h-20 text-muted-foreground mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Blog{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Próximamente
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Estamos preparando contenido de calidad sobre diseño, creatividad y herramientas digitales. 
          Volvé pronto para descubrir artículos, tutoriales y recursos exclusivos.
        </p>
      </div>
    </div>
  );
}
