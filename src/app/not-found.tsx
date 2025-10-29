// FILE: src/app/not-found.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Sparkles, Code, Laugh, HelpCircle, Lightbulb, Rocket, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programa 404 - Página No Encontrada | Secret Network",
  description: "La página más especial de Secret Network. Diseñada exclusivamente para cuando escribís mal un link.",
};

/**
 * 404 Not Found Page Component
 * 
 * Una página 404 con humor que sigue el design system del proyecto.
 * Presenta "Programa 404" como si fuera una herramienta más del directorio.
 */
export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background gradient effect - similar al hero */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-20">
          <div className="h-[600px] w-[1000px] rounded-full bg-primary"></div>
        </div>
      </div>

      {/* Decorative dots pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute top-10 left-10 h-2 w-2 rounded-full bg-primary animate-pulse"></div>
        <div className="absolute top-20 right-20 h-2 w-2 rounded-full bg-secondary animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-1/4 h-2 w-2 rounded-full bg-primary animate-pulse delay-200"></div>
        <div className="absolute bottom-40 right-1/3 h-2 w-2 rounded-full bg-secondary animate-pulse delay-300"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Card container */}
          <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 md:p-12 shadow-2xl">
            {/* Badge de estado */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium">
              <Laugh className="h-4 w-4 text-primary" />
              <span className="text-primary">Estado: Perdido en el espacio</span>
            </div>

            {/* Número 404 grande */}
            <div className="mb-6 text-center">
              <h1 className="text-8xl md:text-9xl font-bold tracking-tighter">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  404
                </span>
              </h1>
            </div>

            {/* Título y descripción con humor */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Programa 404
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-2">
                La página más especial de Secret Network
              </p>
              <p className="text-base text-muted-foreground flex items-center justify-center gap-2">
                Diseñada exclusivamente para cuando <span className="text-primary font-semibold">escribiste mal un link</span>
                <Target className="h-4 w-4 text-primary" />
              </p>
            </div>

            {/* Sección "Ficha técnica" estilo programa */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 rounded-xl bg-muted/30 border border-border/50">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  PARA QUIÉN ES IDEAL
                </h3>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>Gente que escribe URLs de memoria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>Diseñadores que clickean links rotos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>Exploradores digitales aventureros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>Bots de Google perdidos</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  CARACTERÍSTICAS
                </h3>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    <span>100% gratuita (no tenés opción)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    <span>Open source (literalmente visible)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    <span>Modo oscuro incluido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    <span>Sin anuncios ni pop-ups molestos</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Descripción larga con humor */}
            <div className="mb-8 p-6 rounded-xl bg-background/50 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                ¿Qué es el Programa 404?
              </h3>
              <p className="text-muted-foreground mb-3">
                <strong className="text-foreground">Programa 404</strong> es nuestra herramienta exclusiva y 
                ultra-especializada para detectar cuando alguien se perdió en la web. Con un diseño minimalista 
                y siguiendo nuestro design system al pie de la letra, esta página te informa con elegancia que 
                el contenido que buscabas... simplemente no existe (o tal vez nunca existió{" "}
                <HelpCircle className="inline h-4 w-4 text-muted-foreground" />).
              </p>
              <p className="text-muted-foreground mb-3">
                A diferencia de otras herramientas del directorio, esta no la elegiste vos, ella te eligió a vos. 
                Es como un error 404, pero con más <span className="text-primary font-semibold">estilo</span> y 
                mejor <span className="text-primary font-semibold">tipografía</span>.
              </p>
              <p className="text-muted-foreground text-sm italic flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Pro tip:</strong> Si llegaste acá, probablemente querías ir a otro lado. 
                  Los botones de abajo son tus amigos.
                </span>
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Volver al inicio
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/categorias" className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Explorar programas
                </Link>
              </Button>
            </div>

            {/* Nota sobre el blog publicado */}
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
                <Rocket className="h-4 w-4 text-primary" />
                <span>
                  <strong className="text-foreground">Recomendado:</strong>{' '}
                  <a 
                    href="/blog/las-40-mejores-paginas-404" 
                    className="text-primary hover:underline font-medium"
                  >
                    Las 40 mejores páginas 404 de diseño
                  </a>
                </span>
              </p>
            </div>
          </div>

          {/* Mensaje extra debajo de la card */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Creés que llegaste acá por error? Probablemente tengas razón.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
