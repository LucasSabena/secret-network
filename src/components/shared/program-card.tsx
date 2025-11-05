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
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Github, Star, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { programEvents } from "@/components/analytics/analytics-events";
import { optimizeImageUrl } from "@/lib/image-optimizer";
import { addUTMParams } from "@/lib/utm-tracker";

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
  const handleClick = () => {
    programEvents.clickProgram(
      program.nombre, 
      program.categoria?.nombre || 'Sin categoría'
    );
  };

  const handleVisitWebsite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    programEvents.visitWebsite(program.nombre);
    if (program.web_oficial_url) {
      const urlWithUtm = addUTMParams(program.web_oficial_url);
      window.open(urlWithUtm, '_blank', 'noopener,noreferrer');
    }
  };

  // ============================================
  // VARIANT: SMALL
  // ============================================
  if (variant === 'small') {
    return (
      <Link 
        href={`/programas/${program.slug}`} 
        className="block" 
        prefetch={false}
        onClick={handleClick}
      >
        <Card className="group relative overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-md hover:shadow-primary/10">
          <CardContent className="px-3 py-2">
            <div className="flex gap-3">
              {program.icono_url ? (
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={optimizeImageUrl(program.icono_url, { width: 48, quality: 60 })}
                    alt={`${program.nombre} - ${program.categoria?.nombre || 'Herramienta de diseño'}${program.es_open_source ? ' gratis y open source' : ''}`}
                    title={program.nombre}
                    fill
                    className="object-contain p-1.5"
                    sizes="48px"
                    loading="lazy"
                    quality={50}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMmEyYTJhIi8+PC9zdmc+"
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
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-shrink-0">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Recomendado por Secret Network</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {program.es_open_source && (
                    <Github className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                
                {/* Descripción corta */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-0.5">
                  {stripHtml(program.descripcion_corta || 'Sin descripción')}
                </p>
                
                {/* Subcategoría en lugar de categoría padre */}
                {program.subcategorias && program.subcategorias.length > 0 && (
                  <span className="inline-block text-[10px] text-primary font-medium">
                    #{stripHtml(program.subcategorias[0].nombre)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // ============================================
  // VARIANT: LARGE (with 3D flip)
  // ============================================
  if (variant === 'large') {
    const [isFlipped, setIsFlipped] = useState(false);
    
    return (
      <div className="w-full relative" style={{ perspective: '1000px' }}>
        {/* Spacer invisible */}
        <div className="w-full invisible pointer-events-none">
          <div className="px-6 pt-4 pb-2">
            <div className="h-12" />
            <div className="h-7 mt-1.5" />
          </div>
          <div className="w-full aspect-video" />
          <div className="h-4" />
        </div>
        
        {/* Flip button (mobile) */}
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
          onClick={handleClick}
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
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {program.icono_url ? (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={program.icono_url}
                        alt={`${program.nombre} icono`}
                        title={program.nombre}
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
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center rounded-full bg-warning/10 p-1.5">
                                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Recomendado por Secret Network</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {program.es_open_source && (
                        <div className="flex items-center justify-center rounded-full bg-muted p-1.5" title="Open Source">
                          <Github className="h-3.5 w-3.5 text-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subcategoría */}
                {program.subcategorias && program.subcategorias.length > 0 && (
                  <div className="flex items-center gap-1 text-sm font-medium text-primary mt-1.5">
                    <span>#{stripHtml(program.subcategorias[0].nombre)}</span>
                  </div>
                )}
              </CardHeader>

              {/* Screenshot */}
              <CardContent className="p-0 flex-1">
                <div className="relative w-full h-full bg-muted">
                  {program.captura_url ? (
                    <Image
                      src={program.captura_url}
                      alt={`Captura de ${program.nombre}`}
                      title={`Captura de ${program.nombre}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      quality={60}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg=="
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
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {program.icono_url ? (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={program.icono_url}
                        alt={`${program.nombre} icono`}
                        title={program.nombre}
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
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center rounded-full bg-warning/10 p-1.5">
                                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Recomendado por Secret Network</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {program.es_open_source && (
                        <div className="flex items-center justify-center rounded-full bg-muted p-1.5" title="Open Source">
                          <Github className="h-3.5 w-3.5 text-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subcategoría */}
                {program.subcategorias && program.subcategorias.length > 0 && (
                  <div className="flex items-center gap-1 text-sm font-medium text-primary mt-1.5">
                    <span>#{stripHtml(program.subcategorias[0].nombre)}</span>
                  </div>
                )}
              </CardHeader>

              {/* Information */}
              <CardContent className="flex-1 flex flex-col gap-3">
                <CardDescription className="line-clamp-2 lg:line-clamp-3 text-sm leading-relaxed">
                  {stripHtml(program.descripcion_corta || "No hay descripción disponible.")}
                </CardDescription>

                {/* Subcategorías (si hay más de una) */}
                {program.subcategorias && program.subcategorias.length > 1 && (
                  <div className="overflow-x-auto lg:overflow-x-visible -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex lg:flex-wrap gap-1.5 min-w-max lg:min-w-0">
                      {program.subcategorias.slice(1).map((subcat) => (
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

                {/* Usos en lugar de dificultad */}
                {program.usos && program.usos.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Para qué sirve:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {program.usos.slice(0, 3).map((uso, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {uso}
                        </Badge>
                      ))}
                      {program.usos.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{program.usos.length - 3}
                        </Badge>
                      )}
                    </div>
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

  // ============================================
  // VARIANT: MEDIUM (default)
  // ============================================
  return (
    <Link href={`/programas/${program.slug}`} className="block h-full" prefetch={false} onClick={handleClick}>
      <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-3">
            {program.icono_url ? (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={program.icono_url}
                  alt={`${program.nombre} icono`}
                  title={program.nombre}
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
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center rounded-full bg-warning/10 p-1.5">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Recomendado por Secret Network</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {program.es_open_source && (
                  <div className="flex items-center justify-center rounded-full bg-muted p-1.5" title="Open Source">
                    <Github className="h-3.5 w-3.5 text-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subcategoría */}
          {program.subcategorias && program.subcategorias.length > 0 && (
            <div className="flex items-center gap-1 text-sm font-medium text-primary mb-2">
              <span>#{stripHtml(program.subcategorias[0].nombre)}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-3 text-sm mb-4">
            {stripHtml(program.descripcion_corta || "No hay descripción disponible.")}
          </CardDescription>

          <div className="space-y-3">
            {/* Subcategorías adicionales */}
            {program.subcategorias && program.subcategorias.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {program.subcategorias.slice(1, 4).map((subcat) => (
                  <span
                    key={subcat.id}
                    className="inline-flex items-center rounded-md bg-accent/50 px-2 py-0.5 text-xs font-medium text-accent-foreground"
                  >
                    #{stripHtml(subcat.nombre)}
                  </span>
                ))}
                {program.subcategorias.length > 4 && (
                  <span className="inline-flex items-center rounded-md bg-accent/50 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    +{program.subcategorias.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Usos en lugar de dificultad */}
            {program.usos && program.usos.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Para qué sirve:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {program.usos.slice(0, 3).map((uso, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {uso}
                    </Badge>
                  ))}
                  {program.usos.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{program.usos.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4 mt-auto">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
            <span>Ver detalles</span>
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
