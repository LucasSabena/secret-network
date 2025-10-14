'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Plataforma } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function PlataformasManager() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Plataforma | null>(null);
  const [creando, setCreando] = useState(false);

  // Form state
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [iconoUrl, setIconoUrl] = useState('');

  useEffect(() => {
    cargarPlataformas();
  }, []);

  const cargarPlataformas = async () => {
    setLoading(true);
    const { data, error } = await supabaseBrowserClientBrowserClient
      .from('Plataformas')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error cargando plataformas:', error);
    } else {
      setPlataformas(data || []);
    }
    setLoading(false);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setSlug('');
    setIconoUrl('');
    setEditando(null);
    setCreando(false);
  };

  const handleEditar = (plataforma: Plataforma) => {
    setEditando(plataforma);
    setNombre(plataforma.nombre);
    setSlug(plataforma.slug);
    setIconoUrl(plataforma.icono_url || '');
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
      icono_url: iconoUrl || null,
    };

    if (editando) {
      // Actualizar
      const { error } = await supabaseBrowserClient
        .from('Plataformas')
        .update(datos)
        .eq('id', editando.id);

      if (error) {
        console.error('Error actualizando:', error);
        alert('Error al actualizar');
      } else {
        alert('Plataforma actualizada ✅');
        limpiarFormulario();
        cargarPlataformas();
      }
    } else {
      // Crear
      const { error } = await supabaseBrowserClient
        .from('Plataformas')
        .insert(datos);

      if (error) {
        console.error('Error creando:', error);
        alert('Error al crear');
      } else {
        alert('Plataforma creada ✅');
        limpiarFormulario();
        cargarPlataformas();
      }
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta plataforma?')) return;

    const { error } = await supabaseBrowserClient
      .from('Plataformas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar (puede estar en uso)');
    } else {
      alert('Plataforma eliminada ✅');
      cargarPlataformas();
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
    return <div className="text-center py-8">Cargando plataformas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Plataformas ({plataformas.length})</h2>
        <button
          onClick={handleCrear}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Nueva Plataforma
        </button>
      </div>

      {/* Formulario */}
      {(creando || editando) && (
        <Card className="p-6 border-2 border-primary">
          <h3 className="text-xl font-bold mb-4">
            {editando ? 'Editar Plataforma' : 'Nueva Plataforma'}
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
                placeholder="Windows, macOS, Linux, Web..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="windows, macos, linux..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL del Icono</label>
              <input
                type="text"
                value={iconoUrl}
                onChange={(e) => setIconoUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://..."
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plataformas.map((plataforma) => (
          <Card key={plataforma.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {plataforma.icono_url && (
                    <img
                      src={plataforma.icono_url}
                      alt={plataforma.nombre}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <h3 className="font-bold">{plataforma.nombre}</h3>
                  <span className="text-xs text-muted-foreground">#{plataforma.id}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plataforma.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(plataforma)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEliminar(plataforma.id)}
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
