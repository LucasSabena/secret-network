// FILE: src/app/programas/[slug]/page.tsx

import { createClient, createStaticClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ExternalLink, 
  ArrowLeft, 
  Check, 
  Star,
  Tag,
  Download,
  Globe,
  Code
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgramCard } from "@/components/shared/program-card";

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

interface ProgramPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Program Detail Page
 * 
 * Displays comprehensive information about a specific program including:
 * - Icon and name
 * - Full description
 * - Screenshot
 * - Category and subcategories
 * - Platforms
 * - Pricing models
 * - Difficulty
 * - Official website link
 * - Up to 5 recommended alternatives
 */
export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Fetch the basic program data
  const { data: programa, error: programaError } = await supabase
    .from('programas')
    .select('*')
    .eq('slug', slug)
    .single();

  // Log error for debugging
  if (programaError) {
    console.error('Error fetching program:', programaError);
  }

  if (!programa) {
    notFound();
  }

  // Fetch category
  const { data: categoria } = await supabase
    .from('categorias')
    .select('id, nombre, slug')
    .eq('id', programa.id_categoria)
    .single();

  // Fetch subcategories
  const { data: subcatRelations } = await supabase
    .from('programas_subcategorias')
    .select('subcategoria_id')
    .eq('programa_id', programa.id);

  let subcategorias: any[] = [];
  if (subcatRelations && subcatRelations.length > 0) {
    const subcatIds = subcatRelations.map(r => r.subcategoria_id);
    const { data: subcats } = await supabase
      .from('categorias')
      .select('id, nombre, slug')
      .in('id', subcatIds);
    subcategorias = subcats || [];
  }

  // Fetch platforms
  const { data: platformRelations } = await supabase
    .from('programas_plataformas')
    .select('plataforma_id')
    .eq('programa_id', programa.id);

  let plataformas: any[] = [];
  if (platformRelations && platformRelations.length > 0) {
    const platformIds = platformRelations.map(r => r.plataforma_id);
    const { data: platforms } = await supabase
      .from('plataformas')
      .select('id, nombre, slug, icono_url')
      .in('id', platformIds);
    plataformas = platforms || [];
  }

  // Fetch pricing models
  const { data: pricingRelations } = await supabase
    .from('programas_modelos_de_precios')
    .select('modelo_precio_id')
    .eq('programa_id', programa.id);

  let modelos_precio: any[] = [];
  if (pricingRelations && pricingRelations.length > 0) {
    const pricingIds = pricingRelations.map(r => r.modelo_precio_id);
    const { data: pricing } = await supabase
      .from('modelos_de_precios')
      .select('id, nombre, slug')
      .in('id', pricingIds);
    modelos_precio = pricing || [];
  }

  // Fetch alternatives
  const { data: altRelations } = await supabase
    .from('programas_alternativas')
    .select('programa_alternativa_id')
    .eq('programa_original_id', programa.id)
    .limit(5);

  let alternativas: any[] = [];
  if (altRelations && altRelations.length > 0) {
    const altIds = altRelations.map(r => r.programa_alternativa_id);
    
    // Fetch alternative programs
    const { data: altPrograms } = await supabase
      .from('programas')
      .select('*')
      .in('id', altIds);

    // For each alternative, fetch its category and subcategories
    alternativas = altPrograms ? await Promise.all(
      altPrograms.map(async (altProgram) => {
        const { data: altCategoria } = await supabase
          .from('categorias')
          .select('id, nombre, slug')
          .eq('id', altProgram.id_categoria)
          .single();

        const { data: altSubcatRelations } = await supabase
          .from('programas_subcategorias')
          .select('subcategoria_id')
          .eq('programa_id', altProgram.id);

        let altSubcategorias: any[] = [];
        if (altSubcatRelations && altSubcatRelations.length > 0) {
          const altSubcatIds = altSubcatRelations.map(r => r.subcategoria_id);
          const { data: altSubcats } = await supabase
            .from('categorias')
            .select('id, nombre, slug')
            .in('id', altSubcatIds);
          altSubcategorias = altSubcats || [];
        }

        return {
          ...altProgram,
          categoria: altCategoria,
          subcategorias: altSubcategorias
        };
      })
    ) : [];
  }

  // Transform the data
  const programaCompleto = {
    ...programa,
    categoria,
    subcategorias,
    plataformas,
    modelos_precio,
    alternativas
  };

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Program Header */}
      <section className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Program Icon */}
            <div className="flex-shrink-0">
              {programaCompleto.icono_url ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-muted ring-1 ring-border md:h-32 md:w-32">
                  <Image
                    src={programaCompleto.icono_url}
                    alt={`${programaCompleto.nombre} icon`}
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted ring-1 ring-border md:h-32 md:w-32">
                  <Code className="h-12 w-12 text-muted-foreground md:h-16 md:w-16" />
                </div>
              )}
            </div>

            {/* Program Info */}
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-start gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {programaCompleto.nombre}
                </h1>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {programaCompleto.es_recomendado && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
                      <Star className="h-4 w-4 fill-warning" />
                      Recomendado
                    </span>
                  )}
                  {programaCompleto.es_open_source && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                      <Check className="h-4 w-4" />
                      Open Source
                    </span>
                  )}
                </div>
              </div>

              {/* Category */}
              {programaCompleto.categoria && (
                <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">{stripHtml(programaCompleto.categoria.nombre)}</span>
                </div>
              )}

              {/* Short Description */}
              <p className="mb-6 text-lg text-muted-foreground">
                {stripHtml(programaCompleto.descripcion_corta || "")}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {programaCompleto.web_oficial_url && (
                  <a
                    href={programaCompleto.web_oficial_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Globe className="h-5 w-5" />
                    Visitar Sitio Oficial
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshot */}
            {programaCompleto.captura_url && (
              <Card>
                <CardContent className="p-6">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={programaCompleto.captura_url}
                      alt={`${programaCompleto.nombre} screenshot`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Long Description */}
            {programaCompleto.descripcion_larga && (
              <Card>
                <CardHeader>
                  <CardTitle>Acerca de {programaCompleto.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {stripHtml(programaCompleto.descripcion_larga || "")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Difficulty */}
                {programaCompleto.dificultad && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-foreground">Dificultad</h3>
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium ${
                      programaCompleto.dificultad === 'Facil' 
                        ? 'bg-success/10 text-success' 
                        : programaCompleto.dificultad === 'Intermedio'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {programaCompleto.dificultad}
                    </span>
                  </div>
                )}

                {/* Subcategories */}
                {programaCompleto.subcategorias.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-foreground">Subcategorías</h3>
                    <div className="flex flex-wrap gap-2">
                      {programaCompleto.subcategorias.map((subcat: any) => (
                        <span
                          key={subcat.id}
                          className="inline-flex items-center rounded-md bg-accent px-2.5 py-1 text-sm font-medium text-accent-foreground"
                        >
                          {subcat.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platforms */}
                {programaCompleto.plataformas.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-foreground">Plataformas</h3>
                    <div className="flex flex-wrap gap-2">
                      {programaCompleto.plataformas.map((plat: any) => (
                        <span
                          key={plat.id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground"
                        >
                          {plat.icono_url && (
                            <Image
                              src={plat.icono_url}
                              alt={plat.nombre}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          )}
                          {plat.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Models */}
                {programaCompleto.modelos_precio.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-foreground">Modelo de Precios</h3>
                    <div className="flex flex-wrap gap-2">
                      {programaCompleto.modelos_precio.map((modelo: any) => (
                        <span
                          key={modelo.id}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
                        >
                          {modelo.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alternatives Section */}
        {programaCompleto.alternativas.length > 0 && (
          <section className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Alternativas Recomendadas
              </h2>
              <p className="mt-2 text-muted-foreground">
                Herramientas similares que podrían interesarte
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {programaCompleto.alternativas.map((alternativa: any) => (
                <ProgramCard key={alternativa.id} program={alternativa} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/**
 * Generate static params for all programs
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  const supabase = createStaticClient();
  
  const { data: programas } = await supabase
    .from('programas')
    .select('slug');

  return programas?.map((programa) => ({
    slug: programa.slug,
  })) || [];
}
