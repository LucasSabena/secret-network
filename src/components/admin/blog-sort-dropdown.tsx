// FILE: src/components/admin/blog-sort-dropdown.tsx
'use client';

import { ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlogSortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function BlogSortDropdown({ value, onChange }: BlogSortDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <ArrowUpDown className="mr-2 h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date-desc">Más recientes</SelectItem>
        <SelectItem value="date-asc">Más antiguos</SelectItem>
        <SelectItem value="title-asc">Título (A-Z)</SelectItem>
        <SelectItem value="title-desc">Título (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  );
}
