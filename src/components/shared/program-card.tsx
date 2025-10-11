// FILE: src/components/shared/program-card.tsx

'use client';

import { type Programa, type Categoria } from "@/lib/types";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { ExternalLink, Github, Star, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

interface ProgramCardProps {
  program: Programa & {
    categoria?: Categoria;
    subcategorias?: Categoria[];
  };
  variant?: 'small' | 'medium' | 'large';
}

export function ProgramCard({ program, variant = 'medium' }: ProgramCardProps) {
  if (variant === 'small') {
    return (
      <Link href={`/programas/${program.slug}`} className="block" prefetch={false}>
        <Card className="group relative overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-md hover:shadow-primary/10">
          <CardContent className="px-3 py-2">
            <div className="flex gap-3">
              {program.icono_url ? (
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={program.icono_url}
                    alt={`${program.nombre} icon`}
                    fill
                    className="object-contain p-1.5"
                    sizes="48px"
                    loading="lazy"
                    quality={75}
                  />
                </div>
              ) : (
                <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-muted" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-sm font-semibold leading-tight truncate">
                    {program.nombre}
                  </h3>
                  {program.es_recomendado && (
                    <Star className="h-3 w-3 fill-warning text-warning flex-shrink-0" />
                  )}
                  {program.es_open_source && (
                    <Github className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                
                {/* Descripción corta */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-0.5">
                  {stripHtml(program.descripcion_corta || 'Sin descripción')}
                </p>
                
                {/* Categoría */}
                {program.categoria && (
                  <span className="inline-block text-[10px] text-primary font-medium">
                    #{stripHtml(program.categoria.nombre)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Large variant with 3D flip effect on hover
  if (variant === 'large') {
    const [isFlipped, setIsFlipped] = useState(false);
    
    return (
      <div className="w-full relative" style={{ perspective: '1000px' }}>
        {/* Spacer invisible - define la altura real basada en el contenido */}
        <div className="w-full invisible pointer-events-none">
          <div className="px-6 pt-4 pb-2">
            <div className="h-12" /> {/* Icono */}
            <div className="h-7 mt-1.5" /> {/* Categoría */}
          </div>
          <div className="w-full aspect-video" /> {/* Imagen 16:9 */}
          <div className="h-4" /> {/* Bottom spacer */}
        </div>
        
        {/* Flip button - abajo a la derecha, sobre la imagen */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }}
          className="absolute bottom-3 right-3 z-10 lg:hidden bg-primary/90 backdrop-blur-sm border border-primary rounded-full p-2.5 shadow-lg hover:bg-primary transition-colors"
          aria-label="Ver información"
        >
          <Info className="h-4 w-4 text-primary-foreground" />
        </button>
        
        <Link 
          href={`/programas/${program.slug}`} 
          className="block w-full absolute inset-0"
          prefetch={false}
        >
          <div 
            className={`relative w-full h-full transition-transform duration-700 lg:hover:[transform:rotateY(180deg)] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* FRONT SIDE - Screenshot */}
            <Card 
              className="absolute inset-0 overflow-hidden flex flex-col pb-0"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Header */}
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center gap-3">
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
                    
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {program.es_recomendado && (
                        <div className="flex items-center justify-center rounded-full bg-warning/10 p-1.5" title="Recomendado">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        </div>
                      )}
                      {program.es_open_source && (
                        <div className="flex items-center justify-center rounded-full bg-muted p-1.5" title="Open Source">
                          <Github className="h-3.5 w-3.5 text-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {program.categoria && (
                  <div className="flex items-center gap-1 text-sm font-medium text-primary mt-1.5">
                    <span>#{stripHtml(program.categoria.nombre)}</span>
                  </div>
                )}
              </CardHeader>

              {/* Screenshot 16:9 - sin padding, llega a los bordes */}
              <CardContent className="p-0 flex-1">
                <div className="relative w-full h-full bg-muted">
                  {program.captura_url ? (
                    <Image
                      src={program.captura_url}
                      alt={`${program.nombre} screenshot`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      quality={85}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">Sin captura disponible</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* BACK SIDE - Information */}
            <Card 
              className="absolute inset-0 overflow-hidden flex flex-col"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              {/* Header - mismo que el frente */}
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center gap-3">
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
                    
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {program.es_recomendado && (
                        <div className="flex items-center justify-center rounded-full bg-warning/10 p-1.5" title="Recomendado">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        </div>
                      )}
                      {program.es_open_source && (
                        <div className="flex items-center justify-center rounded-full bg-muted p-1.5" title="Open Source">
                          <Github className="h-3.5 w-3.5 text-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {program.categoria && (
                  <div className="flex items-center gap-1 text-sm font-medium text-primary mt-1.5">
                    <span>#{stripHtml(program.categoria.nombre)}</span>
                  </div>
                )}
              </CardHeader>

              {/* Information */}
              <CardContent className="flex-1 flex flex-col gap-3">
                <CardDescription className="line-clamp-2 lg:line-clamp-3 text-sm leading-relaxed">
                  {stripHtml(program.descripcion_corta || "No hay descripción disponible.")}
                </CardDescription>

                {program.subcategorias && program.subcategorias.length > 0 && (
                  <div className="overflow-x-auto -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex gap-1.5 min-w-max">
                      {program.subcategorias.map((subcat) => (
                        <span
                          key={subcat.id}
                          className="inline-flex items-center rounded-md bg-accent/50 px-2 py-0.5 text-xs font-medium text-accent-foreground whitespace-nowrap"
                        >
                          #{stripHtml(subcat.nombre)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
              </CardContent>

              <CardFooter className="pt-4 flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  <span>Ver detalles</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </CardFooter>
            </Card>
          </div>
        </Link>
      </div>
    );
  }

  // Medium variant (default)
  return (
    <Link href={`/programas/${program.slug}`} className="block h-full" prefetch={false}>
      <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 flex flex-col">
        <CardHeader className="pb-4">
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
              
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {program.es_recomendado && (
                  <div className="flex items-center justify-center rounded-full bg-warning/10 p-1.5" title="Recomendado">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  </div>
                )}
                {program.es_open_source && (
                  <div className="flex items-center justify-center rounded-full bg-muted p-1.5" title="Open Source">
                    <Github className="h-3.5 w-3.5 text-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {program.categoria && (
            <div className="flex items-center gap-1 text-sm font-medium text-primary mb-2">
              <span>#{stripHtml(program.categoria.nombre)}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-3 text-sm mb-4">
            {stripHtml(program.descripcion_corta || "No hay descripción disponible.")}
          </CardDescription>

          <div className="space-y-3">
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
          {program.web_oficial_url ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
              <span>Ver detalles</span>
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
              <span>Ver detalles</span>
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}