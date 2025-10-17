// FILE: src/components/seo/json-ld-software.tsx
// Schema.org SoftwareApplication markup para programas individuales

import { Programa } from '@/lib/types';

interface JsonLdSoftwareProps {
  programa: Programa;
}

export function JsonLdSoftware({ programa }: JsonLdSoftwareProps) {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: programa.nombre,
    description: programa.descripcion_corta || programa.descripcion_larga,
    url: `https://secretnetwork.co/programas/${programa.slug}`,
    image: programa.icono_url || programa.captura_url,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Windows, macOS, Linux, Web',
    offers: programa.es_open_source ? {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    } : undefined,
    featureList: programa.es_open_source ? 'Open Source' : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
    />
  );
}
