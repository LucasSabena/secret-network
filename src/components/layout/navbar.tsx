'use client';

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/categorias", label: "Categorías" },
  { href: "/open-source", label: "Open Source" },
  { href: "/alternativas", label: "Alternativas" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link 
          href="/" 
          className="group flex items-center transition-opacity hover:opacity-80 z-50"
          onClick={closeMenu}
        >
          <Image
            src="/logo.svg"
            alt="Secret Network"
            width={256}
            height={23}
            className="h-4 w-auto sm:h-6"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="p-2 text-muted-foreground hover:text-primary transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />
            
            {/* Menu */}
            <div className="fixed top-16 right-0 left-0 bg-background border-b border-border shadow-lg z-40 md:hidden">
              <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary py-2",
                      pathname === link.href 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
