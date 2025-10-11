// FILE: src/components/layout/footer.tsx

import Link from "next/link";
import { Code2, Github, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">Secret Station</span>
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

          {/* Recursos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Programas Recomendados
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Open Source
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/LucasSabena/secret-station" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Acerca de */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Acerca de</h3>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Secret Station es un proyecto que reúne las mejores herramientas para diseñadores y desarrolladores.
              </p>
              <a
                href="https://binarystudio.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Github className="h-4 w-4" />
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
              © {currentYear} Secret Station. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="transition-colors hover:text-foreground"
              >
                Términos
              </Link>
              <span>•</span>
              <Link 
                href="/" 
                className="transition-colors hover:text-foreground"
              >
                Privacidad
              </Link>
              <span>•</span>
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
      </div>
    </footer>
  );
}
