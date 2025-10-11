// FILE: src/components/shared/program-card.tsx

import { type Programa, type Categoria } from "@/lib/types";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { ExternalLink, Check, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

interface ProgramCardProps {
  program: Programa & {
    categoria?: Categoria;
    subcategorias?: Categoria[];
  };
}

/**
 * ProgramCard Component
 * 
 * Displays a single program in a card format with:
 * - Icon
 * - Name
 * - Recommended badge (if applicable)
 * - Category
 * - Subcategories
 * - Short description
 * - Open source badge (if applicable)
 * - Difficulty badge
 * - Link to official website
 * 
 * This is a Server Component - it receives data via props.
 * Clicking the card navigates to the program's detail page.
 */
export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Link href={`/programas/${program.slug}`} className="block h-full" prefetch={false}>
      <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 flex flex-col">
        <CardHeader className="pb-4">
          {/* 1. Program Icon and Name with Badges */}
          <div className="flex items-center gap-3 mb-3">
            {program.icono_url ? (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={program.icono_url}
                  alt={`${program.nombre} icon`}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                  loading="lazy"
                  quality={75}
                />
              </div>
            ) : (
              <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-muted" />
            )}
            
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <CardTitle className="text-lg leading-tight break-words">
                {program.nombre}
              </CardTitle>
              
              {/* Icon Badges: Recommended & Open Source */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {program.es_recomendado && (
                  <div className="flex items-center justify-center rounded-full bg-warning/10 p-1.5" title="Recomendado">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  </div>
                )}
                {program.es_open_source && (
                  <div className="flex items-center justify-center rounded-full bg-secondary/10 p-1.5" title="Open Source">
                    <Check className="h-3.5 w-3.5 text-secondary" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Category */}
          {program.categoria && (
            <div className="flex items-center gap-1 text-sm font-medium text-primary mb-2">
              <span>#{stripHtml(program.categoria.nombre)}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow">
          {/* 3. Description */}
          <CardDescription className="line-clamp-3 text-sm mb-4">
            {stripHtml(program.descripcion_corta || "No hay descripción disponible.")}
          </CardDescription>

          {/* 4. Subcategories, Difficulty, and Link */}
          <div className="space-y-3">
            {/* Subcategories */}
            {program.subcategorias && program.subcategorias.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {program.subcategorias.slice(0, 3).map((subcat) => (
                  <span
                    key={subcat.id}
                    className="inline-flex items-center rounded-md bg-accent/50 px-2 py-0.5 text-xs font-medium text-accent-foreground"
                  >
                    #{stripHtml(subcat.nombre)}
                  </span>
                ))}
                {program.subcategorias.length > 3 && (
                  <span className="inline-flex items-center rounded-md bg-accent/50 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    +{program.subcategorias.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Difficulty Badge */}
            {program.dificultad && (
              <div>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  program.dificultad === 'Facil' 
                    ? 'bg-success/10 text-success' 
                    : program.dificultad === 'Intermedio'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {program.dificultad}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4 mt-auto">
          {/* Official Website Link */}
          {program.web_oficial_url ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
              <span>Ver detalles</span>
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Ver detalles
            </span>
          )}
        </CardFooter>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </Card>
    </Link>
  );
}
