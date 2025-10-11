// FILE: src/components/about/about-story.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Lightbulb } from "lucide-react";

export function AboutStory() {
  return (
    <section className="mb-16">
      <Card className="border-2">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Nuestra Historia</h2>
          </div>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              Secret Network nació de una necesidad real: encontrar las herramientas perfectas para proyectos de diseño sin perderse en la inmensidad de internet.
            </p>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              Inspirados por <a href="https://openalternative.co/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">OpenAlternative.co</a>, un directorio excepcional de alternativas open-source, nos dimos cuenta de que existía una oportunidad única: crear algo similar pero enfocado específicamente en el mundo del diseño, la creatividad y las herramientas visuales.
            </p>
            
            <div className="flex items-start gap-4 my-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">¿Por qué otro directorio?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Los diseñadores, ilustradores, fotógrafos y creadores de contenido tienen necesidades específicas. Necesitábamos un espacio que no solo listara herramientas, sino que las organizara por categorías relevantes, mostrara sus características únicas, y permitiera descubrir alternativas según necesidades específicas.
                </p>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed text-muted-foreground">
              Secret Network es más que un simple directorio. Es una comunidad que valora el open-source, la calidad sobre la cantidad, y la accesibilidad de herramientas profesionales para todos.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
