import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center transition-opacity hover:opacity-80">
          <Image
            src="/logo.svg"
            alt="Secret Station"
            width={256}
            height={23}
            className="h-6 w-auto"
            priority
          />
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
