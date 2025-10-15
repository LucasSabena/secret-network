// FILE: src/components/layout/footer.tsx

'use client';

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme, resolvedTheme } = useTheme();

  // Determinar qué logo usar según el tema
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const logoSrc = currentTheme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg';

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link href="/" className="group inline-block transition-opacity hover:opacity-80">
              <Image
                src={logoSrc}
                alt="Secret Network"
                width={256}
                height={23}
                className="h-6 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu directorio secreto de herramientas de diseño y desarrollo. Descubre las mejores soluciones open source y propietarias.
            </p>
          </div>

          {/* Navegación Principal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  href="/categorias" 
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Herramientas Destacadas
                </Link>
              </li>
            </ul>
          </div>

          {/* Acerca de */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Acerca de</h3>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Secret Network es un proyecto que reúne las mejores herramientas para diseñadores y desarrolladores.
              </p>
              <a
                href="https://binarystudio.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <span>Creado por Binary Studio</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>
              © {currentYear} Secret Network
            </p>
            <a
              href="https://binarystudio.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              Binary Studio
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
