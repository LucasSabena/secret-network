// FILE: src/components/layout/hero.tsx

import { Sparkles } from "lucide-react";

/**
 * Hero Component
 * 
 * Main hero section for the homepage.
 * Inspired by OpenAlternative's clean, centered design.
 * Explains what Secret Network is about.
 */
export function Hero() {
  return (
    <section className="relative py-16 md:py-24 overflow-x-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-20">
          <div className="h-[600px] w-[1000px] rounded-full bg-primary"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground">
              Descubrí más de <span className="font-bold text-primary">200 herramientas</span>
            </span>
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl min-h-[120px] sm:min-h-[140px] md:min-h-[180px] flex items-center justify-center">
            <span className="block">
              Descubrí programas y páginas de{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                diseño
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground sm:text-xl">
            Tu directorio secreto de herramientas de diseño. Encuentra software 
            open-source, alternativas gratuitas y las mejores herramientas 
            cuidadosamente curadas para diseñadores y creativos.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary"></div>
              <span>200+ Herramientas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Actualizaciones Continuas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
