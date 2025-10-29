'use client';

import { Calendar, SortAsc, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlogFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  viewMode: 'all' | 'series' | 'timeline';
  onViewModeChange: (value: 'all' | 'series' | 'timeline') => void;
}

export function BlogFilters({
  sortBy,
  onSortChange,
  dateFilter,
  onDateFilterChange,
  viewMode,
  onViewModeChange,
}: BlogFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Ordenar por */}
      <div className="flex items-center gap-2">
        <SortAsc className="h-4 w-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="oldest">Más antiguos</SelectItem>
            <SelectItem value="title">Alfabético (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por fecha */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo el tiempo</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="3months">Últimos 3 meses</SelectItem>
            <SelectItem value="6months">Últimos 6 meses</SelectItem>
            <SelectItem value="year">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Modo de vista */}
      <div className="flex items-center gap-2 ml-auto">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('all')}
            className="h-8"
          >
            Todos
          </Button>
          <Button
            variant={viewMode === 'series' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('series')}
            className="h-8"
          >
            Series
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('timeline')}
            className="h-8"
          >
            Timeline
          </Button>
        </div>
      </div>
    </div>
  );
}
