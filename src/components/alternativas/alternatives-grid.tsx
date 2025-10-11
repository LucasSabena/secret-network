// FILE: src/components/alternativas/alternatives-grid.tsx

'use client';

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, GitBranch } from "lucide-react";
import type { Programa } from "@/lib/types";

interface AlternativesGridProps {
  programs: Programa[];
}

// Función para limpiar HTML de la descripción
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export function AlternativesGrid({ programs }: AlternativesGridProps) {
  if (programs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground">
          No hay programas disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Herramientas Populares</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((programa) => (
          <Link 
            key={programa.id} 
            href={`/alternativas/${programa.slug}`}
            className="block h-full"
            prefetch={false}
          >
            <Card className="group h-full overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
              {/* Imagen/Captura del programa */}
              {programa.captura_url && (
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <Image
                    src={programa.captura_url}
                    alt={`${programa.nombre} screenshot`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start gap-4 mb-2">
                  {programa.icono_url && (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={programa.icono_url}
                        alt={`${programa.nombre} icon`}
                        fill
                        className="object-contain p-1.5"
                        sizes="48px"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {programa.nombre}
                    </CardTitle>
                  </div>
                </div>

                {programa.descripcion_corta && (
                  <CardDescription className="line-clamp-2">
                    {stripHtml(programa.descripcion_corta)}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GitBranch className="h-4 w-4 text-primary" />
                    <span>Ver alternativas</span>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
