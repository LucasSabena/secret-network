// FILE: src/lib/icon-renderer.tsx
import { 
  Smile,
  Heart,
  Star,
  ThumbsUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Zap,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Rocket,
  Lightbulb,
  Eye,
  Search,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Check,
  X,
  Plus,
  Minus,
  Download,
  Upload,
  Code,
  Palette,
  Brush,
  Pen,
  Image as ImageIcon,
  Layout,
  Grid,
  Box,
  Package,
  Layers,
  Mouse,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Calendar,
  Mail,
  MessageSquare,
  Settings,
  Wrench,
  Filter,
  Bookmark,
  Flag,
  type LucideIcon
} from 'lucide-react';

// Mapa de iconos disponibles
const ICON_MAP: Record<string, LucideIcon> = {
  'smile': Smile,
  'heart': Heart,
  'star': Star,
  'thumbs-up': ThumbsUp,
  'check-circle': CheckCircle2,
  'x-circle': XCircle,
  'alert-circle': AlertCircle,
  'info': Info,
  'alert-triangle': AlertTriangle,
  'zap': Zap,
  'sparkles': Sparkles,
  'target': Target,
  'trending-up': TrendingUp,
  'award': Award,
  'rocket': Rocket,
  'lightbulb': Lightbulb,
  'eye': Eye,
  'search': Search,
  'external-link': ExternalLink,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'chevron-right': ChevronRight,
  'check': Check,
  'x': X,
  'plus': Plus,
  'minus': Minus,
  'download': Download,
  'upload': Upload,
  'code': Code,
  'palette': Palette,
  'brush': Brush,
  'pen': Pen,
  'image': ImageIcon,
  'layout': Layout,
  'grid': Grid,
  'box': Box,
  'package': Package,
  'layers': Layers,
  'mouse': Mouse,
  'monitor': Monitor,
  'smartphone': Smartphone,
  'tablet': Tablet,
  'globe': Globe,
  'clock': Clock,
  'calendar': Calendar,
  'mail': Mail,
  'message-square': MessageSquare,
  'settings': Settings,
  'wrench': Wrench,
  'filter': Filter,
  'bookmark': Bookmark,
  'flag': Flag,
};

/**
 * Convierte texto con placeholders [icon:nombre] a JSX con iconos reales
 * Ejemplo: "Hola [icon:heart] mundo" → "Hola ❤️ mundo" (pero con icono Lucide)
 */
export function parseTextWithIcons(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[icon:([a-z-]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Agregar texto antes del icono
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Agregar el icono
    const iconName = match[1];
    const IconComponent = ICON_MAP[iconName];
    
    if (IconComponent) {
      parts.push(
        <IconComponent 
          key={`icon-${match.index}`} 
          className="inline-block w-4 h-4 mx-1 align-text-bottom" 
          aria-hidden="true"
        />
      );
    } else {
      // Si el icono no existe, mantener el placeholder
      parts.push(`[icon:${iconName}]`);
    }

    lastIndex = regex.lastIndex;
  }

  // Agregar texto restante después del último icono
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Obtiene el componente de icono por nombre
 */
export function getIconComponent(name: string): LucideIcon | null {
  return ICON_MAP[name] || null;
}
