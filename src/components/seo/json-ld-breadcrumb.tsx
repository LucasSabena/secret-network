// FILE: src/components/seo/json-ld-breadcrumb.tsx
// Schema.org BreadcrumbList markup para navegación

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface JsonLdBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function JsonLdBreadcrumb({ items }: JsonLdBreadcrumbProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://secret-network.vercel.app${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
