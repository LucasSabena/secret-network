'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

// Lista completa de iconos de Lucide (nombres hardcodeados para evitar problemas de filtrado)
const ALL_ICONS = [
  'Activity', 'Airplay', 'AlertCircle', 'AlertOctagon', 'AlertTriangle', 'AlignCenter', 'AlignJustify',
  'AlignLeft', 'AlignRight', 'Anchor', 'Aperture', 'Archive', 'ArrowDown', 'ArrowDownCircle',
  'ArrowDownLeft', 'ArrowDownRight', 'ArrowLeft', 'ArrowLeftCircle', 'ArrowRight', 'ArrowRightCircle',
  'ArrowUp', 'ArrowUpCircle', 'ArrowUpLeft', 'ArrowUpRight', 'AtSign', 'Award', 'BarChart', 'BarChart2',
  'Battery', 'BatteryCharging', 'Bell', 'BellOff', 'Bluetooth', 'Bold', 'Book', 'BookOpen', 'Bookmark',
  'Box', 'Briefcase', 'Calendar', 'Camera', 'CameraOff', 'Cast', 'Check', 'CheckCircle', 'CheckSquare',
  'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronsDown', 'ChevronsLeft',
  'ChevronsRight', 'ChevronsUp', 'Chrome', 'Circle', 'Clipboard', 'Clock', 'Cloud', 'CloudDrizzle',
  'CloudLightning', 'CloudOff', 'CloudRain', 'CloudSnow', 'Code', 'Codepen', 'Codesandbox', 'Coffee',
  'Columns', 'Command', 'Compass', 'Copy', 'CornerDownLeft', 'CornerDownRight', 'CornerLeftDown',
  'CornerLeftUp', 'CornerRightDown', 'CornerRightUp', 'CornerUpLeft', 'CornerUpRight', 'Cpu',
  'CreditCard', 'Crop', 'Crosshair', 'Database', 'Delete', 'Disc', 'DollarSign', 'Download',
  'DownloadCloud', 'Droplet', 'Edit', 'Edit2', 'Edit3', 'ExternalLink', 'Eye', 'EyeOff', 'Facebook',
  'FastForward', 'Feather', 'Figma', 'File', 'FileMinus', 'FilePlus', 'FileText', 'Film', 'Filter',
  'Flag', 'Folder', 'FolderMinus', 'FolderOpen', 'FolderPlus', 'Framer', 'Frown', 'Gift', 'GitBranch',
  'GitCommit', 'GitMerge', 'GitPullRequest', 'Github', 'Gitlab', 'Globe', 'Grid', 'HardDrive', 'Hash',
  'Headphones', 'Heart', 'HelpCircle', 'Hexagon', 'Home', 'Image', 'Inbox', 'Info', 'Instagram',
  'Italic', 'Key', 'Layers', 'Layout', 'LifeBuoy', 'Link', 'Link2', 'Linkedin', 'List', 'Loader',
  'Lock', 'LogIn', 'LogOut', 'Mail', 'Map', 'MapPin', 'Maximize', 'Maximize2', 'Meh', 'Menu',
  'MessageCircle', 'MessageSquare', 'Mic', 'MicOff', 'Minimize', 'Minimize2', 'Minus', 'MinusCircle',
  'MinusSquare', 'Monitor', 'Moon', 'MoreHorizontal', 'MoreVertical', 'MousePointer', 'Move', 'Music',
  'Navigation', 'Navigation2', 'Octagon', 'Package', 'Paperclip', 'Pause', 'PauseCircle', 'PenTool',
  'Percent', 'Phone', 'PhoneCall', 'PhoneForwarded', 'PhoneIncoming', 'PhoneMissed', 'PhoneOff',
  'PhoneOutgoing', 'PieChart', 'Play', 'PlayCircle', 'Plus', 'PlusCircle', 'PlusSquare', 'Pocket',
  'Power', 'Printer', 'Radio', 'RefreshCcw', 'RefreshCw', 'Repeat', 'Rewind', 'RotateCcw', 'RotateCw',
  'Rss', 'Save', 'Scissors', 'Search', 'Send', 'Server', 'Settings', 'Share', 'Share2', 'Shield',
  'ShieldOff', 'ShoppingBag', 'ShoppingCart', 'Shuffle', 'Sidebar', 'SkipBack', 'SkipForward', 'Slack',
  'Slash', 'Sliders', 'Smartphone', 'Smile', 'Speaker', 'Square', 'Star', 'StopCircle', 'Sun',
  'Sunrise', 'Sunset', 'Tablet', 'Tag', 'Target', 'Terminal', 'Thermometer', 'ThumbsDown', 'ThumbsUp',
  'ToggleLeft', 'ToggleRight', 'Tool', 'Trash', 'Trash2', 'Trello', 'TrendingDown', 'TrendingUp',
  'Triangle', 'Truck', 'Tv', 'Twitch', 'Twitter', 'Type', 'Umbrella', 'Underline', 'Unlock', 'Upload',
  'UploadCloud', 'User', 'UserCheck', 'UserMinus', 'UserPlus', 'UserX', 'Users', 'Video', 'VideoOff',
  'Voicemail', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Watch', 'Wifi', 'WifiOff', 'Wind', 'X',
  'XCircle', 'XOctagon', 'XSquare', 'Youtube', 'Zap', 'ZapOff', 'ZoomIn', 'ZoomOut'
];

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Obtener el componente del icono actual
  const CurrentIcon = value ? (LucideIcons as any)[value] : null;

  // Filtrar iconos por búsqueda
  const filteredIcons = useMemo(() => {
    if (!search) return ALL_ICONS;
    
    const searchLower = search.toLowerCase();
    return ALL_ICONS.filter(name => 
      name.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm">{label}</Label>}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            type="button"
          >
            {CurrentIcon ? (
              <>
                <CurrentIcon className="h-4 w-4" />
                <span>{value}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Selecciona un icono...</span>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar icono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearch('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredIcons.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No se encontraron iconos
              </div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground mb-2 px-2">
                  {filteredIcons.length} {filteredIcons.length === 1 ? 'icono' : 'iconos'} disponibles
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {filteredIcons.map((iconName) => {
                    const Icon = (LucideIcons as any)[iconName];
                    if (!Icon) return null;

                    return (
                      <Button
                        key={iconName}
                        variant={value === iconName ? 'default' : 'ghost'}
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => handleSelect(iconName)}
                        title={iconName}
                        type="button"
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {value && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                type="button"
              >
                <X className="h-3 w-3 mr-2" />
                Limpiar selección
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
