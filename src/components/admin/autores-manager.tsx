'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Autor } from '@/lib/types';
import AutorForm from './autor-form';

export default function AutoresManager() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [filteredAutores, setFilteredAutores] = useState<Autor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAutor, setSelectedAutor] = useState<Autor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  // Cargar autores desde Supabase
  const fetchAutores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseBrowserClient
        .from('autores')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setAutores(data || []);
      setFilteredAutores(data || []);
    } catch (error: any) {
      toast({
        title: 'Error al cargar autores',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAutores();
  }, []);

  // Filtrar autores por búsqueda
  useEffect(() => {
    const filtered = autores.filter((autor) =>
      autor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      autor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAutores(filtered);
  }, [searchTerm, autores]);

  // Abrir formulario para crear nuevo autor
  const handleCreate = () => {
    setSelectedAutor(null);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar autor existente
  const handleEdit = (autor: Autor) => {
    setSelectedAutor(autor);
    setIsFormOpen(true);
  };

  // Eliminar autor
  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar al autor "${nombre}"? Los posts asociados quedarán sin autor.`)) {
      return;
    }

    try {
      const { error } = await supabaseBrowserClient
        .from('autores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Autor eliminado',
        description: `"${nombre}" ha sido eliminado correctamente.`,
      });

      fetchAutores();
    } catch (error: any) {
      toast({
        title: 'Error al eliminar autor',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Callback cuando se guarda un autor (crear o actualizar)
  const handleSave = () => {
    setIsFormOpen(false);
    fetchAutores();
  };

  return (
    <div className="space-y-4">
      {/* Header con búsqueda y botón crear */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Autor
        </Button>
      </div>

      {/* Lista de autores */}
      {isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">
          Cargando autores...
        </Card>
      ) : filteredAutores.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          {searchTerm ? 'No se encontraron autores' : 'No hay autores creados'}
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredAutores.map((autor) => (
            <Card key={autor.id} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {autor.avatar_url ? (
                    <img
                      src={autor.avatar_url}
                      alt={autor.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{autor.nombre}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="truncate">/{autor.slug}</span>
                    {autor.email && (
                      <>
                        <span>•</span>
                        <span className="truncate">{autor.email}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(autor)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(autor.id, autor.nombre)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Formulario de crear/editar */}
      <AutorForm
        autor={selectedAutor}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
