import { Block } from '@/lib/types';
import {
  Type,
  Image as ImageIcon,
  Code,
  List,
  Table,
  Video,
  FileText,
  AlertCircle,
  Quote,
  Grid3x3,
  Download,
  Calendar,
  BarChart3,
  GitCompare,
  Minus,
  MousePointer,
  MessageSquare,
  Layers,
  Folder,
  Package,
} from 'lucide-react';

export const BLOCK_ICONS: Record<string, any> = {
  text: Type,
  image: ImageIcon,
  code: Code,
  list: List,
  table: Table,
  video: Video,
  alert: AlertCircle,
  quote: Quote,
  'images-grid': Grid3x3,
  'file-download': Download,
  timeline: Calendar,
  stats: BarChart3,
  comparison: GitCompare,
  separator: Minus,
  'divider-text': Minus,
  button: MousePointer,
  callout: MessageSquare,
  tabs: Layers,
  accordion: Folder,
  'program-card': Package,
  'programs-grid': Grid3x3,
  'blog-card': FileText,
  'blogs-grid': Grid3x3,
  faq: MessageSquare,
  'pros-cons': BarChart3,
  'feature-list': Layers,
  'before-after': Grid3x3,
  'icon-grid': Grid3x3,
  'category-card': Folder,
  'author-bio': Package,
  poll: BarChart3,
  'progress-bar': BarChart3,
  checklist: List,
  changelog: Calendar,
  'pricing-table': Table,
  testimonial: Quote,
  'tip-box': AlertCircle,
  'cta-banner': MessageSquare,
  'product-showcase': Package,
};

export const BLOCK_LABELS: Record<string, string> = {
  text: 'Texto',
  image: 'Imagen',
  code: 'Código',
  list: 'Lista',
  table: 'Tabla',
  video: 'Video',
  alert: 'Alerta',
  quote: 'Cita',
  'images-grid': 'Galería',
  'file-download': 'Descarga',
  timeline: 'Timeline',
  stats: 'Estadísticas',
  comparison: 'Comparación',
  separator: 'Separador',
  'divider-text': 'Divisor con texto',
  button: 'Botón',
  callout: 'Callout',
  tabs: 'Pestañas',
  accordion: 'Acordeón',
  'program-card': 'Programa',
  'programs-grid': 'Grid Programas',
  'blog-card': 'Blog',
  'blogs-grid': 'Grid Blogs',
  faq: 'FAQ',
  'pros-cons': 'Pros & Cons',
  'feature-list': 'Lista de Features',
  'before-after': 'Before/After',
  'icon-grid': 'Grid de Iconos',
  'category-card': 'Categoría',
  'author-bio': 'Bio de Autor',
  poll: 'Encuesta',
  'progress-bar': 'Barra de Progreso',
  checklist: 'Checklist',
  changelog: 'Changelog',
  'pricing-table': 'Tabla de Precios',
  testimonial: 'Testimonio',
  'tip-box': 'Caja de Tip',
  'cta-banner': 'Banner CTA',
  'product-showcase': 'Showcase Programa',
};

export function getBlockIcon(type: string) {
  return BLOCK_ICONS[type] || FileText;
}

export function getBlockLabel(type: string): string {
  return BLOCK_LABELS[type] || type;
}

export function getBlockPreview(block: Block): string {
  switch (block.type) {
    case 'text':
      const text = block.data.content?.replace(/<[^>]*>/g, '') || '';
      return text.substring(0, 50) + (text.length > 50 ? '...' : '');
    case 'image':
      return block.data.alt || block.data.caption || 'Imagen sin descripción';
    case 'code':
      return `${block.data.language || 'code'} - ${block.data.code?.substring(0, 30) || ''}...`;
    case 'alert':
      return block.data.title || block.data.description?.substring(0, 40) || 'Alerta';
    case 'quote':
      return block.data.quote?.substring(0, 50) || 'Cita';
    case 'button':
      return block.data.text || 'Botón';
    case 'callout':
      return block.data.content?.substring(0, 40) || 'Callout';
    case 'video':
      return block.data.caption || block.data.url?.substring(0, 40) || 'Video';
    case 'program-card':
      return `Programa ID: ${block.data.programId}`;
    case 'programs-grid':
      return `${block.data.programIds?.length || 0} programas`;
    case 'blogs-grid':
      return `${block.data.blogIds?.length || 0} blogs`;
    case 'blog-card':
      return `Blog ID: ${block.data.blogId}`;
    case 'faq':
      return `${block.data.items?.length || 0} preguntas`;
    case 'pros-cons':
      return `${block.data.pros?.length || 0} pros, ${block.data.cons?.length || 0} cons`;
    case 'feature-list':
      return `${block.data.features?.length || 0} features`;
    case 'before-after':
      return 'Comparador de imágenes';
    case 'icon-grid':
      return `${block.data.items?.length || 0} items`;
    case 'category-card':
      return `Categoría ID: ${block.data.categoryId}`;
    case 'author-bio':
      return `Autor ID: ${block.data.authorId}`;
    case 'poll':
      return `${block.data.options?.length || 0} opciones`;
    case 'progress-bar':
      return `${block.data.items?.length || 0} barras`;
    case 'checklist':
      return `${block.data.items?.length || 0} items`;
    case 'changelog':
      return `${block.data.entries?.length || 0} versiones`;
    case 'pricing-table':
      return `${block.data.plans?.length || 0} planes`;
    case 'testimonial':
      return block.data.author || 'Testimonio';
    case 'tip-box':
      return block.data.type || 'Tip';
    case 'cta-banner':
      return block.data.title || 'Banner CTA';
    case 'product-showcase':
      return `Programa ID: ${block.data.programId}`;
    case 'images-grid':
      return `${block.data.images?.length || 0} imágenes`;
    case 'tabs':
      return `${block.data.tabs?.length || 0} pestañas`;
    case 'accordion':
      return `${block.data.items?.length || 0} items`;
    case 'table':
      return `${block.data.headers?.length || 0} columnas × ${block.data.rows?.length || 0} filas`;
    case 'stats':
      return `${block.data.stats?.length || 0} estadísticas`;
    case 'timeline':
      return `${block.data.items?.length || 0} eventos`;
    case 'comparison':
      return `${block.data.items?.length || 0} items`;
    case 'file-download':
      return block.data.fileName || 'Archivo';
    case 'divider-text':
      return block.data.text || 'Divisor';
    default:
      return getBlockLabel(block.type);
  }
}
