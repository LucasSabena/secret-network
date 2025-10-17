// FILE: src/components/seo/json-ld-organization.tsx
// Schema.org Organization markup para mejorar SEO y rich snippets

export function JsonLdOrganization() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Secret Network',
    description: 'Directorio completo de herramientas y programas de diseño, con alternativas gratuitas y open source.',
    url: 'https://secretnetwork.co',
    logo: 'https://secretnetwork.co/logo.svg',
    foundingDate: '2024',
    sameAs: [
      // Agregar tus redes sociales aquí cuando las tengas
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Spanish', 'English'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
