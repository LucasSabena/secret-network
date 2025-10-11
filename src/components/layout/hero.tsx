// FILE: src/components/layout/hero.tsx

import { Sparkles } from "lucide-react";

/**
 * Hero Component
 * 
 * Main hero section for the homepage.
 * Inspired by OpenAlternative's clean, centered design.
 * Explains what Secret Station is about.
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
              Descubre más de <span className="font-bold text-primary">200 herramientas</span>
            </span>
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Descubre Alternativas a{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Software Popular
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Tu directorio secreto de herramientas de diseño. Encuentra software 
            open-source, alternativas gratuitas y las mejores herramientas 
            cuidadosamente curadas para diseñadores y creativos.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
              <span>200+ Herramientas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span>Actualizaciones Continuas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
              <span>100% Gratis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
