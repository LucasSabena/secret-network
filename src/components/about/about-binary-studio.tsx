// FILE: src/components/about/about-binary-studio.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Palette, Rocket, Zap } from "lucide-react";
import Link from "next/link";

export function AboutBinaryStudio() {
  return (
    <section>
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Binary Studio</h2>
          </div>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Secret Network es un proyecto de <span className="font-semibold text-foreground">Binary Studio</span>, un estudio de diseño digital enfocado en crear experiencias visuales únicas y funcionales.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                <Rocket className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Nuestra Filosofía</h3>
                  <p className="text-muted-foreground text-sm">
                    Creemos que el buen diseño debe ser accesible, funcional y estéticamente impecable. Cada proyecto que emprendemos refleja estos valores.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Nuestros Servicios</h3>
                  <p className="text-muted-foreground text-sm">
                    Desde branding y diseño web hasta aplicaciones interactivas, Binary Studio transforma ideas en realidades digitales impactantes.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              Con Secret Network, compartimos nuestra pasión por las herramientas que usamos diariamente y queremos ayudar a otros profesionales a descubrir las mejores opciones para sus proyectos.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Explorar Herramientas
              </Link>
              <Link 
                href="/open-source"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary/10 transition-colors"
              >
                Ver Open Source
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
