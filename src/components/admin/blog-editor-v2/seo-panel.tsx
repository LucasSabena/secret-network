'use client';

import { useState, useEffect } from 'react';
import { Block } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { analyzeContent, getReadabilityLevel, getSEOLevel } from '@/lib/content-analyzer';

interface SEOPanelProps {
  blocks: Block[];
  titulo: string;
  descripcion: string;
  slug: string;
  imagenPortada?: string;
}

export function SEOPanel({ blocks, titulo, descripcion, slug, imagenPortada }: SEOPanelProps) {
  const analysis = analyzeContent(blocks, titulo, descripcion);
  const readabilityLevel = getReadabilityLevel(analysis.readabilityScore);
  const seoLevel = getSEOLevel(analysis.seoScore);

  // Checklist de SEO
  const seoChecklist = [
    {
      id: 'title-length',
      label: 'Título entre 50-60 caracteres',
      passed: titulo.length >= 50 && titulo.length <= 60,
      current: titulo.length,
      optimal: '50-60',
    },
    {
      id: 'description-length',
      label: 'Descripción entre 120-160 caracteres',
      passed: descripcion.length >= 120 && descripcion.length <= 160,
      current: descripcion.length,
      optimal: '120-160',
    },
    {
      id: 'slug-length',
      label: 'Slug corto y descriptivo',
      passed: slug.length > 0 && slug.length <= 60,
      current: slug.length,
      optimal: '< 60',
    },
    {
      id: 'has-image',
      label: 'Tiene imagen de portada',
      passed: !!imagenPortada,
      current: imagenPortada ? 'Sí' : 'No',
      optimal: 'Sí',
    },
    {
      id: 'word-count',
      label: 'Mínimo 300 palabras',
      passed: analysis.wordCount >= 300,
      current: analysis.wordCount,
      optimal: '> 300',
    },
    {
      id: 'headings',
      label: 'Usa encabezados (H2, H3)',
      passed: analysis.headingCount >= 2,
      current: analysis.headingCount,
      optimal: '> 2',
    },
    {
      id: 'images',
      label: 'Incluye imágenes en el contenido',
      passed: analysis.imageCount >= 1,
      current: analysis.imageCount,
      optimal: '> 1',
    },
    {
      id: 'readability',
      label: 'Legibilidad aceptable',
      passed: analysis.readabilityScore >= 60,
      current: Math.round(analysis.readabilityScore),
      optimal: '> 60',
    },
  ];

  const passedChecks = seoChecklist.filter(c => c.passed).length;
  const totalChecks = seoChecklist.length;
  const completionPercentage = Math.round((passedChecks / totalChecks) * 100);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Optimización SEO</h3>
        </div>

        {/* Score general */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">SEO Score</span>
              <Badge className={seoLevel.color}>
                {analysis.seoScore}/100
              </Badge>
            </div>
            <Progress value={analysis.seoScore} className="h-2" />
            <p className="text-xs text-muted-foreground">{seoLevel.description}</p>
          </div>
        </Card>

        {/* Checklist de SEO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Checklist SEO</h4>
            <span className="text-xs text-muted-foreground">
              {passedChecks}/{totalChecks} completado
            </span>
          </div>
          
          <Progress value={completionPercentage} className="h-2" />

          <div className="space-y-2">
            {seoChecklist.map((check) => (
              <Card key={check.id} className={cn(
                'p-3 transition-colors',
                check.passed ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900'
              )}>
                <div className="flex items-start gap-2">
                  {check.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{check.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Actual: {check.current} | Óptimo: {check.optimal}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sugerencias */}
        {analysis.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Sugerencias de Mejora
            </h4>
            <div className="space-y-2">
              {analysis.suggestions.map((suggestion, idx) => (
                <Card key={idx} className="p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                  <p className="text-xs">{suggestion}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Palabras clave */}
        {analysis.keywordDensity.size > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Palabras Clave Detectadas</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(analysis.keywordDensity.entries())
                .slice(0, 10)
                .map(([word, density]) => (
                  <Badge key={word} variant="outline" className="text-xs">
                    {word} <span className="ml-1 text-muted-foreground">({density.toFixed(1)}%)</span>
                  </Badge>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Palabras que aparecen más del 0.5% del contenido
            </p>
          </div>
        )}

        {/* Legibilidad */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Legibilidad</span>
              <Badge className={readabilityLevel.color}>
                {Math.round(analysis.readabilityScore)}/100
              </Badge>
            </div>
            <Progress value={analysis.readabilityScore} className="h-2" />
            <p className="text-xs text-muted-foreground">{readabilityLevel.description}</p>
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Palabras</p>
            <p className="text-lg font-bold">{analysis.wordCount}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Lectura</p>
            <p className="text-lg font-bold">{analysis.readingTime} min</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Párrafos</p>
            <p className="text-lg font-bold">{analysis.paragraphCount}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Imágenes</p>
            <p className="text-lg font-bold">{analysis.imageCount}</p>
          </Card>
        </div>

        {/* Recursos */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recursos SEO</h4>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-xs"
              onClick={() => window.open('https://developers.google.com/search/docs/fundamentals/seo-starter-guide', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              Guía SEO de Google
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-xs"
              onClick={() => window.open('https://moz.com/beginners-guide-to-seo', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              Guía para principiantes (Moz)
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
