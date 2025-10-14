'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { ModeloDePrecio } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function ModelosDePrecioManager() {
  const [modelos, setModelos] = useState<ModeloDePrecio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<ModeloDePrecio | null>(null);
  const [creando, setCreando] = useState(false);

  // Form state
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    cargarModelos();
  }, []);

  const cargarModelos = async () => {
    setLoading(true);
    const { data, error } = await supabaseBrowserClient
      .from('Modelos de Precios')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error cargando modelos:', error);
    } else {
      setModelos(data || []);
    }
    setLoading(false);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setSlug('');
    setEditando(null);
    setCreando(false);
  };

  const handleEditar = (modelo: ModeloDePrecio) => {
    setEditando(modelo);
    setNombre(modelo.nombre);
    setSlug(modelo.slug);
    setCreando(false);
  };

  const handleCrear = () => {
    limpiarFormulario();
    setCreando(true);
  };

  const handleGuardar = async () => {
    if (!nombre || !slug) {
      alert('Nombre y slug son obligatorios');
      return;
    }

    const datos: any = {
      nombre,
      slug,
    };

    if (editando) {
      // Actualizar
      const { error } = await supabaseBrowserClient
        .from('Modelos de Precios')
        .update(datos)
        .eq('id', editando.id);

      if (error) {
        console.error('Error actualizando:', error);
        alert('Error al actualizar');
      } else {
        alert('Modelo de precio actualizado ✅');
        limpiarFormulario();
        cargarModelos();
      }
    } else {
      // Crear
      const { error } = await supabaseBrowserClient
        .from('Modelos de Precios')
        .insert(datos);

      if (error) {
        console.error('Error creando:', error);
        alert('Error al crear');
      } else {
        alert('Modelo de precio creado ✅');
        limpiarFormulario();
        cargarModelos();
      }
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar este modelo de precio?')) return;

    const { error } = await supabaseBrowserClient
      .from('Modelos de Precios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar (puede estar en uso)');
    } else {
      alert('Modelo de precio eliminado ✅');
      cargarModelos();
    }
  };

  const generarSlug = () => {
    const slugGenerado = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(slugGenerado);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando modelos de precio...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Modelos de Precio ({modelos.length})</h2>
        <button
          onClick={handleCrear}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Nuevo Modelo
        </button>
      </div>

      {/* Formulario */}
      {(creando || editando) && (
        <Card className="p-6 border-2 border-primary">
          <h3 className="text-xl font-bold mb-4">
            {editando ? 'Editar Modelo de Precio' : 'Nuevo Modelo de Precio'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={generarSlug}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Gratis, Freemium, Pago único, Suscripción..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="gratis, freemium, pago-unico..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGuardar}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Guardar
              </button>
              <button
                onClick={limpiarFormulario}
                className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelos.map((modelo) => (
          <Card key={modelo.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{modelo.nombre}</h3>
                  <span className="text-xs text-muted-foreground">#{modelo.id}</span>
                </div>
                <p className="text-sm text-muted-foreground">{modelo.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(modelo)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEliminar(modelo.id)}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
