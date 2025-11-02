// FILE: src/app/alternativas/[slug]/page.tsx

import { createClient, createStaticClient } from "@/lib/supabase";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlternativeHero } from "@/components/alternativas/alternative-hero";
import { AlternativesList } from "@/components/alternativas/alternatives-list";
import type { Programa } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 3600; // 1 hora

// Generar rutas estáticas para ISR
export async function generateStaticParams() {
  const supabase = createStaticClient();
  
  const { data: programas } = await supabase
    .from('programas')
    .select('slug');

  return programas?.map((programa) => ({
    slug: programa.slug,
  })) || [];
}

// Generar metadata dinámica
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: programa } = await supabase
    .from('programas')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!programa) {
    return {
      title: 'Programa no encontrado | Secret Network',
    };
  }

  return {
    title: `Alternativas a ${programa.nombre} | Secret Network`,
    description: `Descubre las mejores alternativas a ${programa.nombre}. Compara características, precios y funcionalidades.`,
    alternates: {
      canonical: `https://secretnetwork.co/alternativas/${slug}`
    },
  };
}

export default async function AlternativasDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Obtener el programa original
  const { data: programa, error: programaError } = await supabase
    .from('programas')
    .select('*')
    .eq('slug', slug)
    .single();

  if (programaError || !programa) {
    notFound();
  }

  // Obtener las alternativas relacionadas
  const { data: relacionesAlternativas } = await supabase
    .from('programas_alternativas')
    .select('programa_alternativa_id')
    .eq('programa_original_id', programa.id);

  let alternativas: Programa[] = [];
  
  if (relacionesAlternativas && relacionesAlternativas.length > 0) {
    const alternativasIds = relacionesAlternativas.map(rel => rel.programa_alternativa_id);
    
    const { data: alternativasData } = await supabase
      .from('programas')
      .select('*')
      .in('id', alternativasIds)
      .order('es_recomendado', { ascending: false })
      .order('nombre', { ascending: true });

    alternativas = alternativasData || [];
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/alternativas">Alternativas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{programa.nombre}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AlternativeHero program={programa as Programa} />
      
      <AlternativesList 
        alternatives={alternativas} 
        originalProgram={programa as Programa}
      />
    </div>
  );
}
