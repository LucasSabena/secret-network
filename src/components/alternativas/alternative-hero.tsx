// FILE: src/components/alternativas/alternative-hero.tsx

'use client';

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, GitBranch } from "lucide-react";
import type { Programa } from "@/lib/types";

interface AlternativeHeroProps {
  program: Programa;
}

// Función para limpiar HTML de la descripción
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export function AlternativeHero({ program }: AlternativeHeroProps) {
  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Icono del programa */}
        {program.icono_url && (
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-muted border-2 border-border">
            <Image
              src={program.icono_url}
              alt={`${program.nombre} icon`}
              fill
              className="object-contain p-3"
              priority
            />
          </div>
        )}

        {/* Información del programa */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <GitBranch className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Alternativas Disponibles
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Alternativas a{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {program.nombre}
            </span>
          </h1>

          {program.descripcion_corta && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {stripHtml(program.descripcion_corta)}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {program.web_oficial_url && (
              <Link
                href={program.web_oficial_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <span>Visitar {program.nombre}</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}

            <Link
              href={`/programas/${program.slug}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary/10 transition-colors"
            >
              Ver Detalles Completos
            </Link>
          </div>
        </div>
      </div>

      {program.captura_url && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg mt-8 bg-muted border border-border">
          <Image
            src={program.captura_url}
            alt={`${program.nombre} screenshot`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      )}
    </section>
  );
}
