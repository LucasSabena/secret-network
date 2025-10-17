// FILE: src/app/contacto/page.tsx

import { Metadata } from 'next';
import { ContactHero } from '@/components/contact/contact-hero';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { JsonLdBreadcrumb } from '@/components/seo/json-ld-breadcrumb';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Ponte en contacto con Secret Network. Reporta errores, sugiere programas, conviértete en sponsor o simplemente saluda.',
  openGraph: {
    title: 'Contacto | Secret Network',
    description:
      'Ponte en contacto con Secret Network. Reporta errores, sugiere programas, conviértete en sponsor o simplemente saluda.',
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Contacto', url: '/contacto' },
  ];

  return (
    <>
      <JsonLdBreadcrumb items={breadcrumbItems} />
      
      <div className="min-h-screen bg-background">
        <ContactHero />
        
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Formulario - 2 columnas */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Info de contacto - 1 columna */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
