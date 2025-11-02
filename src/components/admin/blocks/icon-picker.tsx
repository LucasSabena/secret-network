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

// Obtener TODOS los iconos disponibles de Lucide
const ALL_ICONS = Object.keys(LucideIcons).filter(
  (key) => 
    key !== 'default' && 
    key !== 'createLucideIcon' &&
    typeof (LucideIcons as any)[key] === 'function'
).sort();

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
