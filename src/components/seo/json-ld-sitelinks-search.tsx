// FILE: src/components/seo/json-ld-sitelinks-search.tsx
// Schema.org Sitelinks Search Box - Para mostrar buscador en Google

/**
 * Sitelinks Search Box JSON-LD
 * 
 * Permite que Google muestre un cuadro de búsqueda directamente
 * en los resultados de búsqueda, con subpáginas sugeridas.
 * 
 * Requisitos:
 * - Sitio debe tener un buscador funcional
 * - URL debe aceptar parámetro de búsqueda
 */
export function JsonLdSitelinksSearch() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://secretnetwork.co',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://secretnetwork.co/?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
