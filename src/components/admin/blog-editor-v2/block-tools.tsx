// FILE: src/components/admin/blog-editor-v2/block-tools.tsx
/**
 * Definición de todas las herramientas/bloques disponibles
 */

import {
  Type,
  Image as ImageIcon,
  CreditCard,
  LayoutGrid,
  ChevronDown,
  AlertCircle,
  Minus,
  FileCode,
} from 'lucide-react';
import { BlockToolDefinition } from './types';

export const BLOCK_TOOLS: BlockToolDefinition[] = [
  {
    id: 'text',
    type: 'text',
    label: 'Texto',
    icon: Type,
    description: 'Párrafos, títulos, listas',
    category: 'content',
  },
  {
    id: 'image',
    type: 'image',
    label: 'Imagen',
    icon: ImageIcon,
    description: 'Sube o enlaza imágenes',
    category: 'media',
  },
  {
    id: 'program-card',
    type: 'program-card',
    label: 'Programa',
    icon: CreditCard,
    description: 'Tarjeta de programa',
    category: 'content',
  },
  {
    id: 'tabs',
    type: 'tabs',
    label: 'Pestañas',
    icon: LayoutGrid,
    description: 'Contenido en tabs',
    category: 'interactive',
  },
  {
    id: 'accordion',
    type: 'accordion',
    label: 'Acordeón',
    icon: ChevronDown,
    description: 'Contenido expandible',
    category: 'interactive',
  },
  {
    id: 'alert',
    type: 'alert',
    label: 'Alerta',
    icon: AlertCircle,
    description: 'Mensajes destacados',
    category: 'content',
  },
  {
    id: 'code',
    type: 'code',
    label: 'Código',
    icon: FileCode,
    description: 'Bloques de código',
    category: 'content',
  },
  {
    id: 'separator',
    type: 'separator',
    label: 'Separador',
    icon: Minus,
    description: 'Línea divisoria',
    category: 'layout',
  },
];

export const BLOCK_CATEGORIES = {
  content: { label: 'Contenido', color: 'text-blue-500' },
  media: { label: 'Medios', color: 'text-purple-500' },
  interactive: { label: 'Interactivo', color: 'text-green-500' },
  layout: { label: 'Diseño', color: 'text-orange-500' },
} as const;
