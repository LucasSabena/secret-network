// FILE: src/lib/blog-categories.ts
/**
 * Utilidades para gestión de categorías de blog
 */

export interface BlogCategory {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  color: string;
  icono: string;
  orden: number;
  created_at: string;
}

export const DEFAULT_CATEGORIES: Omit<BlogCategory, 'id' | 'created_at'>[] = [
  {
    nombre: 'Diseño Web',
    slug: 'diseno-web',
    descripcion: 'Artículos sobre diseño de interfaces y UX',
    color: '#ec4899',
    icono: 'palette',
    orden: 1,
  },
  {
    nombre: 'Desarrollo',
    slug: 'desarrollo',
    descripcion: 'Tutoriales y guías de programación',
    color: '#3b82f6',
    icono: 'code',
    orden: 2,
  },
  {
    nombre: 'Herramientas',
    slug: 'herramientas',
    descripcion: 'Reviews y comparativas de software',
    color: '#8b5cf6',
    icono: 'wrench',
    orden: 3,
  },
];

/**
 * Genera un slug a partir de un nombre
 */
export function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Obtiene el color de una categoría o un color por defecto
 */
export function getCategoryColor(category?: BlogCategory | null): string {
  return category?.color || '#3b82f6';
}
