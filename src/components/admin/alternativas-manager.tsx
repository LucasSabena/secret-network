'use client';

import { useEffect, useState } from 'react';
import { Search, Link as LinkIcon, Unlink, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Programa } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function AlternativasManager() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [selectedPrograma, setSelectedPrograma] = useState<string>('');
  const [alternativas, setAlternativas] = useState<Programa[]>([]);
  const [availableAlternatives, setAvailableAlternatives] = useState<Programa[]>(
    []
  );
  const [selectedAlternativa, setSelectedAlternativa] = useState<string>('');
  const [busquedaAlternativas, setBusquedaAlternativas] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProgramas();
  }, []);

  useEffect(() => {
    if (selectedPrograma) {
      loadAlternativas(parseInt(selectedPrograma));
    } else {
      setAlternativas([]);
    }
  }, [selectedPrograma]);

  useEffect(() => {
    // Filter out already linked alternatives
    const alternativasIds = alternativas.map((a) => a.id);
    const available = programas.filter(
      (p) =>
        p.id !== parseInt(selectedPrograma || '0') &&
        !alternativasIds.includes(p.id)
    );
    setAvailableAlternatives(available);
  }, [alternativas, programas, selectedPrograma]);

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
      
      // Intentar cargar alternativas normalmente
      const { data, error } = await supabase
        .from('programas_alternativas')
        .select('programa_alternativa_id')
        .eq('programa_original_id', programaId);

      if (error) {
        // Si el error es que la tabla no existe o no hay permisos
        if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('permission denied')) {
          // Solo mostrar el toast una vez
          if (!sessionStorage.getItem('alternativas_table_error_shown')) {
            toast({
              title: 'Tabla no configurada',
              description: 'La tabla programas_alternativas necesita ser creada en Supabase. Revisa SUPABASE_SETUP.md',
              variant: 'destructive',
              duration: 8000,
            });
            sessionStorage.setItem('alternativas_table_error_shown', 'true');
            
            console.error('⚠️ IMPORTANTE: La tabla programas_alternativas no existe o no tiene permisos.');
            console.log('📋 Ejecuta el SQL que está en el archivo SUPABASE_SETUP.md');
          }
          setAlternativas([]);
          return;
        }
        throw error;
      }

      // Get full programa data for alternatives
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
    }
  }

  async function handleAddAlternativa() {
    if (!selectedPrograma || !selectedAlternativa) {
      toast({
        title: 'Error',
        description: 'Selecciona un programa y una alternativa',
        variant: 'destructive',
      });
      return;
    }

    try {
      const supabase = supabaseBrowserClient;

      // Add bidirectional relationship
      const { error: error1 } = await supabase
        .from('programas_alternativas')
        .insert([
          {
            programa_original_id: parseInt(selectedPrograma),
            programa_alternativa_id: parseInt(selectedAlternativa),
          },
        ]);

      if (error1) throw error1;

      // Add reverse relationship
      const { error: error2 } = await supabase
        .from('programas_alternativas')
        .insert([
          {
            programa_original_id: parseInt(selectedAlternativa),
            programa_alternativa_id: parseInt(selectedPrograma),
          },
        ]);

      if (error2) throw error2;

      toast({
        title: 'Éxito',
        description: 'Alternativa agregada correctamente',
      });

      setSelectedAlternativa('');
      loadAlternativas(parseInt(selectedPrograma));
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
    if (!confirm('¿Estás seguro de eliminar esta relación?')) return;

    try {
      const supabase = supabaseBrowserClient;

      // Remove both directions
      const { error: error1 } = await supabase
        .from('programas_alternativas')
        .delete()
        .eq('programa_original_id', parseInt(selectedPrograma!))
        .eq('programa_alternativa_id', alternativaId);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('programas_alternativas')
        .delete()
        .eq('programa_original_id', alternativaId)
        .eq('programa_alternativa_id', parseInt(selectedPrograma!));

      if (error2) throw error2;

      toast({
        title: 'Éxito',
        description: 'Alternativa eliminada correctamente',
      });

      loadAlternativas(parseInt(selectedPrograma!));
    } catch (error) {
      console.error('Error removing alternativa:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la alternativa',
        variant: 'destructive',
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <Label htmlFor="programa-select">Seleccionar Programa</Label>
        <Select value={selectedPrograma} onValueChange={setSelectedPrograma}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Elige un programa..." />
          </SelectTrigger>
          <SelectContent>
            {programas.map((programa) => (
              <SelectItem key={programa.id} value={programa.id.toString()}>
                {programa.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPrograma && (
        <>
          <div className="bg-muted/50 rounded-lg p-4">
            <Label>Agregar Nueva Alternativa</Label>
            
            {/* Buscador */}
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar programa..."
                value={busquedaAlternativas}
                onChange={(e) => setBusquedaAlternativas(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 mt-2">
              <Select
                value={selectedAlternativa}
                onValueChange={setSelectedAlternativa}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona una alternativa..." />
                </SelectTrigger>
                <SelectContent>
                  {availableAlternatives
                    .filter(programa => 
                      busquedaAlternativas === '' || 
                      programa.nombre.toLowerCase().includes(busquedaAlternativas.toLowerCase())
                    )
                    .map((programa) => (
                      <SelectItem key={programa.id} value={programa.id.toString()}>
                        {programa.nombre} #{programa.id}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddAlternativa}
                disabled={!selectedAlternativa}
                className="bg-pink-500 hover:bg-pink-600 gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Alternativas Actuales ({alternativas.length})
            </h3>
            {alternativas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay alternativas configuradas
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alternativas.map((alternativa) => (
                  <Card key={alternativa.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {alternativa.icono_url && (
                        <img
                          src={alternativa.icono_url}
                          alt={alternativa.nombre}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold truncate">
                            {alternativa.nombre}
                          </h4>
                          <span className="text-xs text-muted-foreground shrink-0">#{alternativa.id}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {alternativa.descripcion_corta}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAlternativa(alternativa.id)}
                      className="w-full mt-3 gap-2 text-destructive hover:text-destructive"
                    >
                      <Unlink className="h-4 w-4" />
                      Desvincular
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
