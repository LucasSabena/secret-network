'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BlogSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultsCount?: number;
}

export function BlogSearchBar({ value, onChange, onClear, resultsCount }: BlogSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar artículos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {value && resultsCount !== undefined && (
        <p className="text-xs text-muted-foreground mt-2">
          {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'}
        </p>
      )}
    </div>
  );
}
