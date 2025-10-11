// FILE: src/components/seo/json-ld-website.tsx
// Schema.org WebSite markup con SearchAction para habilitar sitelinks searchbox

export function JsonLdWebsite() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Secret Network',
    url: 'https://secretnetwork.vercel.app',
    description: 'Directorio de herramientas y programas de diseño con alternativas gratuitas y open source',
    inLanguage: 'es-ES',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://secretnetwork.vercel.app/categorias?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}
