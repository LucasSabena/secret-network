// FILE: src/app/sobre-nosotros/page.tsx

import { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { AboutMission } from "@/components/about/about-mission";
import { AboutBinaryStudio } from "@/components/about/about-binary-studio";

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Secret Network',
  description: 'Conoce la historia detrás de Secret Network, un directorio curado de herramientas de diseño inspirado en OpenAlternative y creado por Binary Studio.',
};

export default function SobreNosotrosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <AboutBinaryStudio />
    </div>
  );
}
