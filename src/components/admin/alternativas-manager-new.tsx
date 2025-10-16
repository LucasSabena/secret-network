'use client';

import { useEffect, useState } from 'react';
import { Search, Link as LinkIcon, Unlink, Loader2, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Programa } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function AlternativasManagerNew() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [selectedPrograma, setSelectedPrograma] = useState<Programa | null>(null);
  const [alternativas, setAlternativas] = useState<Programa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProgramas();
  }, []);

  useEffect(() => {
    if (selectedPrograma) {
      loadAlternativas(selectedPrograma.id);
    }
  }, [selectedPrograma]);

  async function loadProgramas() {
    try {
      setIsLoading(true);
      const supabase = supabaseBrowserClient;
      const { data, error } = await supabase
        .from('programas')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setProgramas(data || []);
    } catch (error) {
      console.error('Error loading programas:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los programas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function loadAlternativas(programaId: number) {
    try {
      const supabase = supabaseBrowserClient;
      
      const { data, error } = await supabase
        .from('programas_alternativas')
        .select('programa_alternativa_id')
        .eq('programa_original_id', programaId);

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('relation')) {
          toast({
            title: 'Tabla no configurada',
            description: 'La tabla programas_alternativas necesita ser creada en Supabase',
            variant: 'destructive',
          });
          setAlternativas([]);
          return;
        }
        throw error;
      }

      const alternativasIds = data?.map((a) => a.programa_alternativa_id) || [];
      if (alternativasIds.length > 0) {
        const { data: alternativasData, error: alternativasError } =
          await supabase
            .from('programas')
            .select('*')
            .in('id', alternativasIds);

        if (alternativasError) throw alternativasError;
        setAlternativas(alternativasData || []);
      } else {
        setAlternativas([]);
      }
    } catch (error) {
      console.error('Error loading alternativas:', error);
      setAlternativas([]);
    }
  }

  async function handleAddAlternativa(alternativaId: number) {
    if (!selectedPrograma) return;

    try {
      const supabase = supabaseBrowserClient;

      // Verificar si ya existe la relación
      const { data: existingData } = await supabase
        .from('programas_alternativas')
        .select('*')
        .eq('programa_original_id', selectedPrograma.id)
        .eq('programa_alternativa_id', alternativaId)
        .single();

      if (existingData) {
        toast({
          title: 'Ya existe',
          description: 'Esta alternativa ya está agregada',
          variant: 'destructive',
        });
        return;
      }

      // Agregar relación bidireccional
      const relations = [
        {
          programa_original_id: selectedPrograma.id,
          programa_alternativa_id: alternativaId,
        },
        {
          programa_original_id: alternativaId,
          programa_alternativa_id: selectedPrograma.id,
        },
      ];

      // Insertar con upsert para evitar duplicados
      const { error } = await supabase
        .from('programas_alternativas')
        .upsert(relations, { 
          onConflict: 'programa_original_id,programa_alternativa_id',
          ignoreDuplicates: true 
        });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Alternativa agregada correctamente',
      });

      loadAlternativas(selectedPrograma.id);
      setIsAddingMode(false);
    } catch (error) {
      console.error('Error adding alternativa:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la alternativa',
        variant: 'destructive',
      });
    }
  }

  async function handleRemoveAlternativa(alternativaId: number) {
    if (!selectedPrograma) return;
    if (!confirm('¿Estás seguro de eliminar esta relación?')) return;

    try {
      const supabase = supabaseBrowserClient;

      // Eliminar ambas direcciones
      await supabase
        .from('programas_alternativas')
        .delete()
        .eq('programa_original_id', selectedPrograma.id)
        .eq('programa_alternativa_id', alternativaId);

      await supabase
        .from('programas_alternativas')
        .delete()
        .eq('programa_original_id', alternativaId)
        .eq('programa_alternativa_id', selectedPrograma.id);

      toast({
        title: 'Éxito',
        description: 'Alternativa eliminada correctamente',
      });

      loadAlternativas(selectedPrograma.id);
    } catch (error) {
      console.error('Error removing alternativa:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la alternativa',
        variant: 'destructive',
      });
    }
  }

  const filteredProgramas = programas.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableProgramas = programas.filter(
    (p) =>
      p.id !== selectedPrograma?.id &&
      !alternativas.some((alt) => alt.id === p.id) &&
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!selectedPrograma ? (
        // Vista de selección de programa
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Gestión de Alternativas</h2>
            <p className="text-muted-foreground">
              Selecciona un programa para gestionar sus alternativas
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar programa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProgramas.map((programa) => (
              <Card
                key={programa.id}
                className="p-4 hover:border-primary cursor-pointer transition-colors"
                onClick={() => setSelectedPrograma(programa)}
              >
                <div className="flex items-start gap-3">
                  {programa.icono_url && (
                    <img
                      src={programa.icono_url}
                      alt={programa.nombre}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {programa.nombre}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {programa.descripcion_corta || 'Sin descripción'}
                    </p>
                    {programa.es_open_source && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Open Source
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredProgramas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron programas</p>
            </div>
          )}
        </div>
      ) : (
        // Vista de gestión de alternativas
        <div className="space-y-6">
          {/* Header con programa seleccionado */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPrograma(null);
                  setIsAddingMode(false);
                  setSearchTerm('');
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Volver
              </Button>
              {selectedPrograma.icono_url && (
                <img
                  src={selectedPrograma.icono_url}
                  alt={selectedPrograma.nombre}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedPrograma.nombre}</h2>
                <p className="text-muted-foreground text-sm">
                  {alternativas.length} alternativa(s) configurada(s)
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddingMode(!isAddingMode)}
              variant={isAddingMode ? 'outline' : 'default'}
              className={!isAddingMode ? 'bg-primary' : ''}
            >
              {isAddingMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Alternativa
                </>
              )}
            </Button>
          </div>

          {isAddingMode && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar programa para agregar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
                {availableProgramas.map((programa) => (
                  <Card
                    key={programa.id}
                    className="p-3 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => handleAddAlternativa(programa.id)}
                  >
                    <div className="flex items-center gap-3">
                      {programa.icono_url && (
                        <img
                          src={programa.icono_url}
                          alt={programa.nombre}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {programa.nombre}
                        </h3>
                        {programa.es_open_source && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Open Source
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {availableProgramas.length === 0 && (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? 'No se encontraron programas con ese nombre'
                      : 'No hay más programas disponibles'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Lista de alternativas actuales */}
          {!isAddingMode && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Alternativas configuradas</h3>
              
              {alternativas.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No hay alternativas configuradas para este programa
                  </p>
                  <Button
                    onClick={() => setIsAddingMode(true)}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar primera alternativa
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alternativas.map((alternativa) => (
                    <Card key={alternativa.id} className="p-4">
                      <div className="flex items-start gap-3">
                        {alternativa.icono_url && (
                          <img
                            src={alternativa.icono_url}
                            alt={alternativa.nombre}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {alternativa.nombre}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {alternativa.descripcion_corta || 'Sin descripción'}
                          </p>
                          {alternativa.es_open_source && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              Open Source
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAlternativa(alternativa.id)}
                        className="w-full mt-3 text-destructive hover:text-destructive"
                      >
                        <Unlink className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
