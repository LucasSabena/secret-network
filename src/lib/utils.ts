import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a string to a URL-safe slug
 * Removes accents, special characters, and converts to lowercase
 * 
 * @param text - The text to convert to a slug
 * @returns A URL-safe slug without accents or special characters
 * 
 * @example
 * slugify("Análisis y Extracción de Estilos") // "analisis-y-extraccion-de-estilos"
 * slugify("Diseño UI/UX") // "diseno-ui-ux"
 * slugify("Creación con IA") // "creacion-con-ia"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace accented characters
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    // Replace special characters
    .replace(/ñ/g, 'n')
    .replace(/ü/g, 'u')
    // Replace spaces and special chars with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}
