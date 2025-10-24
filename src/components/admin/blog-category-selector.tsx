// FILE: src/components/admin/blog-category-selector.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { BlogCategory } from '@/lib/blog-categories';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface BlogCategorySelectorProps {
  selectedCategories: number[];
  onChange: (categories: number[]) => void;
}

export function BlogCategorySelector({
  selectedCategories,
  onChange,
}: BlogCategorySelectorProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabaseBrowserClient
      .from('blog_categories')
      .select('*')
      .order('orden');

    if (data) {
      setCategories(data as BlogCategory[]);
    }
  }

  const selectedCats = categories.filter(c => selectedCategories.includes(c.id));

  const handleSelect = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const handleRemove = (categoryId: number) => {
    onChange(selectedCategories.filter(id => id !== categoryId));
  };

  return (
    <div className="space-y-2">
      <Label>Categorías</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCats.map(cat => (
          <Badge
            key={cat.id}
            style={{ backgroundColor: cat.color }}
            className="text-white"
          >
            {cat.nombre}
            <button
              onClick={() => handleRemove(cat.id)}
              className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              aria-label={`Eliminar ${cat.nombre}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Agregar categoría
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar categoría..." />
            <CommandEmpty>No se encontraron categorías</CommandEmpty>
            <CommandGroup>
              {categories.map(cat => (
                <CommandItem
                  key={cat.id}
                  onSelect={() => {
                    handleSelect(cat.id);
                    setOpen(false);
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.nombre}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
