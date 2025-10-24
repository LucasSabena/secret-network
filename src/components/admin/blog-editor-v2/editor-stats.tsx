// FILE: src/components/admin/blog-editor-v2/editor-stats.tsx
'use client';

import { useState } from 'react';
import { Block } from '@/lib/types';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, Clock, TrendingUp, Link, Heading, AlertCircle } from 'lucide-react';
import { analyzeContent, getReadabilityLevel, getSEOLevel } from '@/lib/content-analyzer';

interface EditorStatsProps {
  blocks: Block[];
  title: string;
  description?: string;
}

export function EditorStats({ blocks, title, description = '' }: EditorStatsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Análisis completo
  const analysis = analyzeContent(blocks, title, description);
  const readabilityLevel = getReadabilityLevel(analysis.readabilityScore);
  const seoLevel = getSEOLevel(analysis.seoScore);

  // Estadísticas básicas
  const stats = {
    totalBlocks: blocks.length,
    textBlocks: blocks.filter((b) => b.type === 'text').length,
    imageBlocks: analysis.imageCount,
    wordCount: analysis.wordCount,
    readingTime: analysis.readingTime,
  };

  return (
    <>
      <div className="space-y-2">
        <StatCard
          icon={FileText}
          label="Bloques"
          value={stats.totalBlocks}
          color="text-blue-500"
        />
        <StatCard
          icon={FileText}
          label="Palabras"
          value={stats.wordCount}
          color="text-green-500"
        />
        <StatCard
          icon={Image}
          label="Imágenes"
          value={stats.imageBlocks}
          color="text-purple-500"
        />
        <StatCard
          icon={Clock}
          label="Lectura"
          value={`${stats.readingTime} min`}
          color="text-orange-500"
        />
        <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
          <DialogTrigger asChild>
            <Card className="p-3 cursor-pointer hover:bg-accent transition-colors">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-pink-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">SEO Score</p>
                  <p className="text-sm font-semibold truncate">{analysis.seoScore}/100</p>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Análisis Avanzado de Contenido</DialogTitle>
              <DialogDescription>
                Métricas detalladas de SEO y legibilidad
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* SEO Score */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">SEO Score</h3>
                  <Badge className={seoLevel.color}>
                    {analysis.seoScore}/100 - {seoLevel.level}
                  </Badge>
                </div>
                <Progress value={analysis.seoScore} className="h-2" />
                <p className="text-sm text-muted-foreground">{seoLevel.description}</p>
                
                {analysis.suggestions.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Sugerencias de Mejora
                    </h4>
                    <ul className="space-y-1">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-yellow-500">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Legibilidad */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Legibilidad</h3>
                  <Badge className={readabilityLevel.color}>
                    {Math.round(analysis.readabilityScore)}/100 - {readabilityLevel.level}
                  </Badge>
                </div>
                <Progress value={analysis.readabilityScore} className="h-2" />
                <p className="text-sm text-muted-foreground">{readabilityLevel.description}</p>
              </div>

              {/* Estadísticas Detalladas */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatDetailCard
                  icon={FileText}
                  label="Palabras"
                  value={analysis.wordCount}
                  subtitle={`${analysis.characterCount} caracteres`}
                />
                <StatDetailCard
                  icon={FileText}
                  label="Párrafos"
                  value={analysis.paragraphCount}
                  subtitle={`${Math.round(analysis.wordCount / Math.max(1, analysis.paragraphCount))} palabras/párrafo`}
                />
                <StatDetailCard
                  icon={Heading}
                  label="Encabezados"
                  value={analysis.headingCount}
                  subtitle="H1, H2, H3, H4"
                />
                <StatDetailCard
                  icon={Image}
                  label="Imágenes"
                  value={analysis.imageCount}
                  subtitle={`Ratio: ${Math.round(analysis.wordCount / Math.max(1, analysis.imageCount))} palabras/img`}
                />
                <StatDetailCard
                  icon={Link}
                  label="Enlaces"
                  value={analysis.linkCount}
                  subtitle="Internos y externos"
                />
                <StatDetailCard
                  icon={Clock}
                  label="Tiempo de Lectura"
                  value={`${analysis.readingTime} min`}
                  subtitle="~200 palabras/min"
                />
              </div>

              {/* Palabras Clave */}
              {analysis.keywordDensity.size > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Palabras Clave Principales</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(analysis.keywordDensity.entries()).map(([word, density]) => (
                      <Badge key={word} variant="outline">
                        {word} ({density.toFixed(1)}%)
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Densidad de palabras que aparecen más del 0.5% del contenido
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold truncate">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function StatDetailCard({
  icon: Icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}
