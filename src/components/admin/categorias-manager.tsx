'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Categoria } from '@/lib/types';
import CategoriaForm from './categoria-form';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

type CategoriaConHijos = Categoria & {
  subcategorias?: Categoria[];
};

export default function CategoriasManager() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCategorias(
        categorias.filter((c) =>
          c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCategorias(categorias);
    }
  }, [searchTerm, categorias]);

  async function loadCategorias() {
    try {
      setIsLoading(true);
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setCategorias(data || []);
      setFilteredCategorias(data || []);
    } catch (error) {
      console.error('Error loading categorias:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las categorías',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (
      !confirm(
        '¿Estás seguro de eliminar esta categoría? Esto puede afectar los programas asociados.'
      )
    )
      return;

    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase.from('categorias').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Categoría eliminada correctamente',
      });
      loadCategorias();
    } catch (error) {
      console.error('Error deleting categoria:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la categoría',
        variant: 'destructive',
      });
    }
  }

  function handleNew() {
    setSelectedCategoria(null);
    setIsFormOpen(true);
  }

  function handleEdit(categoria: Categoria) {
    setSelectedCategoria(categoria);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setSelectedCategoria(null);
    loadCategorias();
  }

  function getCategoriaPadre(id: number | null): Categoria | undefined {
    return categorias.find((c) => c.id === id);
  }

  // Organizar categorías en estructura jerárquica
  const organizedCategorias = useMemo(() => {
    const parents = filteredCategorias.filter((cat) => !cat.id_categoria_padre);
    const children = filteredCategorias.filter((cat) => cat.id_categoria_padre);

    const organized: CategoriaConHijos[] = parents.map((parent) => ({
      ...parent,
      subcategorias: children.filter(
        (child) => child.id_categoria_padre === parent.id
      ),
    }));

    return organized;
  }, [filteredCategorias]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={handleNew}
          className="gap-2 bg-pink-500 hover:bg-pink-600"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <div className="space-y-4">
        {organizedCategorias.map((categoria) => (
          <div key={categoria.id} className="border rounded-lg overflow-hidden">
            {/* Categoría padre */}
            <div className="bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                {categoria.icono && (
                  <div className="text-3xl">{categoria.icono}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{categoria.nombre}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {categoria.subcategorias?.length || 0} subcategorías
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Slug: <code className="bg-background px-1.5 py-0.5 rounded">{categoria.slug}</code>
                  </p>
                  {categoria.descripcion && (
                    <p className="text-sm mt-2">{categoria.descripcion}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(categoria)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(categoria.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Subcategorías */}
            {categoria.subcategorias && categoria.subcategorias.length > 0 && (
              <div className="divide-y">
                {categoria.subcategorias.map((subcat) => (
                  <div
                    key={subcat.id}
                    className="p-4 pl-12 bg-background hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FolderTree className="h-5 w-5 text-muted-foreground mt-0.5" />
                      {subcat.icono && (
                        <div className="text-xl">{subcat.icono}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{subcat.nombre}</h4>
                        <p className="text-sm text-muted-foreground">
                          Slug: <code className="bg-muted px-1.5 py-0.5 rounded">{subcat.slug}</code>
                        </p>
                        {subcat.descripcion && (
                          <p className="text-sm mt-1">{subcat.descripcion}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(subcat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subcat.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {organizedCategorias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron categorías</p>
        </div>
      )}

      {isFormOpen && (
        <CategoriaForm
          categoria={selectedCategoria}
          categorias={categorias}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
