// FILE: src/components/alternativas/alternatives-list.tsx

'use client';

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info, ArrowRight, Github, Star } from "lucide-react";
import type { Programa } from "@/lib/types";

interface AlternativesListProps {
  alternatives: Programa[];
  originalProgram: Programa;
}

// Función para limpiar HTML de la descripción
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export function AlternativesList({ alternatives, originalProgram }: AlternativesListProps) {
  if (alternatives.length === 0) {
    return (
      <section className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No hay alternativas registradas todavía
          </h3>
          <p className="text-muted-foreground mb-6">
            Estamos trabajando en agregar más alternativas a {originalProgram.nombre}. 
            Vuelve pronto para ver las actualizaciones.
          </p>
        </div>
      </section>
    );
  }

  // Separar alternativas open-source y de pago
  const openSourceAlternatives = alternatives.filter(alt => alt.es_open_source);
  const otherAlternatives = alternatives.filter(alt => !alt.es_open_source);

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {alternatives.length} Alternativa{alternatives.length !== 1 ? 's' : ''} a {originalProgram.nombre}
        </h2>
        <p className="text-muted-foreground">
          Explora opciones similares que podrían adaptarse mejor a tus necesidades
        </p>
      </div>

      {/* Alternativas Open Source */}
      {openSourceAlternatives.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-semibold">Alternativas Open Source</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              {openSourceAlternatives.length} disponible{openSourceAlternatives.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openSourceAlternatives.map((alternative) => (
              <AlternativeCard key={alternative.id} program={alternative} />
            ))}
          </div>
        </div>
      )}

      {/* Otras Alternativas */}
      {otherAlternatives.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">
            {openSourceAlternatives.length > 0 ? 'Otras Alternativas' : 'Alternativas Disponibles'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAlternatives.map((alternative) => (
              <AlternativeCard key={alternative.id} program={alternative} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// Componente de card para alternativas que lleva a /programas/[slug]
function AlternativeCard({ program }: { program: Programa }) {
  return (
    <Link href={`/programas/${program.slug}`} className="block h-full" prefetch={false}>
      <Card className="group h-full overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3 mb-2">
            {program.icono_url && (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={program.icono_url}
                  alt={`${program.nombre} icon`}
                  fill
                  className="object-contain p-1.5"
                  sizes="48px"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                {program.nombre}
              </CardTitle>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {program.es_open_source && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                    <Github className="h-3 w-3" />
                    Open Source
                  </span>
                )}
                {program.es_recomendado && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                    Recomendado
                  </span>
                )}
              </div>
            </div>
          </div>

          {program.descripcion_corta && (
            <CardDescription className="line-clamp-2 text-sm">
              {stripHtml(program.descripcion_corta)}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <span>Ver detalles</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
