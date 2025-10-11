// FILE: src/components/open-source/open-source-hero.tsx

import { Code2, Heart } from "lucide-react";

interface OpenSourceHeroProps {
  totalPrograms: number;
}

export function OpenSourceHero({ totalPrograms }: OpenSourceHeroProps) {
  return (
    <section className="mb-12 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
        <Code2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          {totalPrograms} Herramientas Open Source
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Open Source
        </span>{" "}
        <span className="text-foreground">para Diseñadores</span>
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
        Software libre y de código abierto que potencia la creatividad sin límites
      </p>

      <div className="flex items-center justify-center gap-3 text-muted-foreground">
        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        <p className="text-sm md:text-base">
          Apoyamos y promovemos el movimiento open source
        </p>
      </div>

      <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20 max-w-2xl mx-auto">
        <h2 className="font-semibold text-lg mb-2">¿Por qué Open Source?</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          El software open source garantiza transparencia, libertad de personalización, 
          y comunidades vibrantes. Estas herramientas son mantenidas por desarrolladores 
          apasionados que creen en el acceso libre al software de calidad.
        </p>
      </div>
    </section>
  );
}
