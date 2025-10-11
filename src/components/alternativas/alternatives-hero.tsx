// FILE: src/components/alternativas/alternatives-hero.tsx

import { Layers, TrendingUp } from "lucide-react";

interface AlternativesHeroProps {
  totalPrograms: number;
}

export function AlternativesHero({ totalPrograms }: AlternativesHeroProps) {
  return (
    <section className="mb-12 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
        <Layers className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          {totalPrograms} Herramientas Populares
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        <span className="text-foreground">Encuentra</span>{" "}
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Alternativas
        </span>
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
        Explora alternativas a las herramientas más conocidas del mercado
      </p>

      <div className="flex items-center justify-center gap-3 text-muted-foreground">
        <TrendingUp className="h-5 w-5 text-primary" />
        <p className="text-sm md:text-base">
          Comparaciones inteligentes basadas en funcionalidades similares
        </p>
      </div>

      <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20 max-w-2xl mx-auto">
        <h2 className="font-semibold text-lg mb-2">¿Por qué buscar alternativas?</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A veces las herramientas más conocidas no son las ideales para tus necesidades. 
          Explora opciones que pueden ser más económicas, open-source, o simplemente mejor 
          adaptadas a tu flujo de trabajo específico.
        </p>
      </div>
    </section>
  );
}
