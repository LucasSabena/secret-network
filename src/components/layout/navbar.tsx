import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-2 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center">
            {/* Placeholder - reemplaza con tu SVG */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary transition-colors group-hover:text-primary/80"
            >
              <path
                d="M16 2L4 9V23L16 30L28 23V9L16 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M16 10L22 13.5V19.5L16 23L10 19.5V13.5L16 10Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            Secret Station
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/categorias"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Categorías
          </Link>
          
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
