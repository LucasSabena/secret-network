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
