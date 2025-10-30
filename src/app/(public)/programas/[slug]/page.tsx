// FILE: src/app/programas/[slug]/page.tsx

import { createClient, createStaticClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { 
  ExternalLink, 
  ArrowLeft, 
  Github, 
  Star,
  Tag,
  Download,
  Globe,
  Code
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgramCard } from "@/components/shared/program-card";
import { FormattedText } from "@/components/shared/formatted-text";
import { JsonLdSoftware } from "@/components/seo/json-ld-software";
import { JsonLdBreadcrumb } from "@/components/seo/json-ld-breadcrumb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { addUTMParams } from "@/lib/utm-tracker";

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Ensure URL has a protocol (https://)
 */
function ensureProtocol(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}

interface ProgramPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: programa } = await supabase
    .from('programas')
    .select('nombre, descripcion_corta, descripcion_larga, icono_url, captura_url, es_open_source, es_recomendado, categoria_id')
    .eq('slug', slug)
    .single();

  if (!programa) {
    return {
      title: 'Programa no encontrado',
    };
  }

  // Obtener categoría
  const { data: categoria } = await supabase
    .from('categorias')
    .select('nombre')
    .eq('id', programa.categoria_id)
    .single();

  const description = stripHtml(programa.descripcion_corta || programa.descripcion_larga) || `Descubre ${programa.nombre}, una herramienta de diseño profesional.`;
  
  // Usar imagen de captura si existe, sino generar OG image dinámica
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://secretnetwork.co';
  const imageUrl = programa.captura_url || 
    `${baseUrl}/api/og-programa?nombre=${encodeURIComponent(programa.nombre)}&categoria=${encodeURIComponent(categoria?.nombre || 'Herramienta de Diseño')}&icon=${encodeURIComponent(programa.icono_url || '')}&opensource=${programa.es_open_source}&recommended=${programa.es_recomendado}`;

  return {
    title: programa.nombre,
    description,
    keywords: [
      programa.nombre,
      'herramienta de diseño',
      'software de diseño',
      programa.es_open_source ? 'open source' : 'software',
      programa.es_open_source ? 'gratis' : '',
      `alternativa ${programa.nombre}`,
    ],
    openGraph: {
      title: `${programa.nombre} - Secret Network`,
      description,
      images: [imageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${programa.nombre} - Secret Network`,
      description,
      images: [imageUrl],
    },
  };
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
      {/* JSON-LD Structured Data */}
      <JsonLdSoftware programa={programaCompleto} />
      <JsonLdBreadcrumb 
        items={[
          { name: 'Inicio', url: '/' },
          ...(programaCompleto.categoria ? [{ 
            name: stripHtml(programaCompleto.categoria.nombre), 
            url: `/categorias/${programaCompleto.categoria.slug}` 
          }] : []),
          { name: programaCompleto.nombre, url: `/programas/${programaCompleto.slug}` },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {programaCompleto.categoria && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/categorias/${programaCompleto.categoria.slug}`}>
                      {stripHtml(programaCompleto.categoria.nombre)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{programaCompleto.nombre}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
                      <Github className="h-4 w-4" />
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
                    href={addUTMParams(ensureProtocol(programaCompleto.web_oficial_url))}
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
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left Column - Main Content (wider) */}
          <div className="space-y-8">
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

            {/* Long Description with Better Formatting */}
            {programaCompleto.descripcion_larga && (
              <Card>
                <CardHeader>
                  <CardTitle>Acerca de {programaCompleto.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-foreground/90 prose-headings:text-foreground prose-strong:text-foreground prose-ul:text-foreground/90 prose-li:text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: programaCompleto.descripcion_larga }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Details Card - Moved to main column for mobile, hidden on desktop */}
            <Card className="lg:hidden">
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

          {/* Right Column - Sticky Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-6">
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

              {/* Alternatives - Sticky on sidebar */}
              {programaCompleto.alternativas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alternativas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {programaCompleto.alternativas.slice(0, 5).map((alternativa: any) => (
                        <ProgramCard key={alternativa.id} program={alternativa} variant="small" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>

        {/* Alternatives Section - Mobile/Tablet */}
        {programaCompleto.alternativas.length > 0 && (
          <section className="mt-12 lg:hidden">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Alternativas Recomendadas
              </h2>
              <p className="mt-2 text-muted-foreground">
                Herramientas similares que podrían interesarte
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
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
