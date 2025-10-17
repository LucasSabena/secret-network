// FILE: src/components/admin/blocks/icon-selector.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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

// Lista de iconos disponibles con sus nombres
export const AVAILABLE_ICONS: { name: string; icon: LucideIcon; label: string }[] = [
  { name: 'smile', icon: Smile, label: 'Sonrisa' },
  { name: 'heart', icon: Heart, label: 'Corazón' },
  { name: 'star', icon: Star, label: 'Estrella' },
  { name: 'thumbs-up', icon: ThumbsUp, label: 'Me gusta' },
  { name: 'check-circle', icon: CheckCircle2, label: 'Check círculo' },
  { name: 'x-circle', icon: XCircle, label: 'X círculo' },
  { name: 'alert-circle', icon: AlertCircle, label: 'Alerta círculo' },
  { name: 'info', icon: Info, label: 'Información' },
  { name: 'alert-triangle', icon: AlertTriangle, label: 'Advertencia' },
  { name: 'zap', icon: Zap, label: 'Rayo' },
  { name: 'sparkles', icon: Sparkles, label: 'Brillos' },
  { name: 'target', icon: Target, label: 'Objetivo' },
  { name: 'trending-up', icon: TrendingUp, label: 'Tendencia' },
  { name: 'award', icon: Award, label: 'Premio' },
  { name: 'rocket', icon: Rocket, label: 'Cohete' },
  { name: 'lightbulb', icon: Lightbulb, label: 'Idea' },
  { name: 'eye', icon: Eye, label: 'Ojo' },
  { name: 'search', icon: Search, label: 'Buscar' },
  { name: 'external-link', icon: ExternalLink, label: 'Link externo' },
  { name: 'arrow-right', icon: ArrowRight, label: 'Flecha derecha' },
  { name: 'arrow-left', icon: ArrowLeft, label: 'Flecha izquierda' },
  { name: 'chevron-right', icon: ChevronRight, label: 'Chevron derecha' },
  { name: 'check', icon: Check, label: 'Check' },
  { name: 'x', icon: X, label: 'X' },
  { name: 'plus', icon: Plus, label: 'Más' },
  { name: 'minus', icon: Minus, label: 'Menos' },
  { name: 'download', icon: Download, label: 'Descargar' },
  { name: 'upload', icon: Upload, label: 'Subir' },
  { name: 'code', icon: Code, label: 'Código' },
  { name: 'palette', icon: Palette, label: 'Paleta' },
  { name: 'brush', icon: Brush, label: 'Pincel' },
  { name: 'pen', icon: Pen, label: 'Lapicera' },
  { name: 'image', icon: ImageIcon, label: 'Imagen' },
  { name: 'layout', icon: Layout, label: 'Layout' },
  { name: 'grid', icon: Grid, label: 'Grilla' },
  { name: 'box', icon: Box, label: 'Caja' },
  { name: 'package', icon: Package, label: 'Paquete' },
  { name: 'layers', icon: Layers, label: 'Capas' },
  { name: 'mouse', icon: Mouse, label: 'Mouse' },
  { name: 'monitor', icon: Monitor, label: 'Monitor' },
  { name: 'smartphone', icon: Smartphone, label: 'Celular' },
  { name: 'tablet', icon: Tablet, label: 'Tablet' },
  { name: 'globe', icon: Globe, label: 'Globo' },
  { name: 'clock', icon: Clock, label: 'Reloj' },
  { name: 'calendar', icon: Calendar, label: 'Calendario' },
  { name: 'mail', icon: Mail, label: 'Mail' },
  { name: 'message-square', icon: MessageSquare, label: 'Mensaje' },
  { name: 'settings', icon: Settings, label: 'Configuración' },
  { name: 'wrench', icon: Wrench, label: 'Llave inglesa' },
  { name: 'filter', icon: Filter, label: 'Filtro' },
  { name: 'bookmark', icon: Bookmark, label: 'Marcador' },
  { name: 'flag', icon: Flag, label: 'Bandera' },
];

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
}

export function IconSelector({ onSelect }: IconSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="h-4 w-4 mr-2" />
          Insertar Icono
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar icono..." />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No se encontró ningún icono.</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-4 gap-1 p-2">
                {AVAILABLE_ICONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.name}
                      value={item.label}
                      onSelect={() => {
                        onSelect(item.name);
                        setOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-accent rounded-md"
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-[10px] text-center">{item.label}</span>
                    </CommandItem>
                  );
                })}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
