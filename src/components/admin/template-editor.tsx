// FILE: src/components/admin/template-editor.tsx
'use client';

import { useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Block } from '@/lib/types';
import { DragDropEditor } from './blog-editor-v2/drag-drop-editor';

interface Template {
  id?: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  thumbnail_url: string;
  bloques: Block[];
  es_predefinida?: boolean;
}

interface TemplateEditorProps {
  template: Template | null;
  onClose: () => void;
}

const CATEGORIES = [
  { value: 'lista', label: 'Lista' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'comparativa', label: 'Comparativa' },
  { value: 'guia', label: 'Guía' },
  { value: 'review', label: 'Review' },
  { value: 'showcase', label: 'Showcase' },
];

export function TemplateEditor({ template, onClose }: TemplateEditorProps) {
  const [nombre, setNombre] = useState(template?.nombre || '');
  const [descripcion, setDescripcion] = useState(template?.descripcion || '');
  const [categoria, setCategoria] = useState(template?.categoria || 'guia');
  const [blocks, setBlocks] = useState<Block[]>(template?.bloques || []);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function handleSave() {
    if (!nombre.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre es requerido',
        variant: 'destructive',
      });
      return;
    }

    if (blocks.length === 0) {
      toast({
        title: 'Error',
        description: 'Agrega al menos un bloque',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    const templateData = {
      nombre,
      descripcion,
      categoria,
      thumbnail_url: 'file-text',
      bloques: blocks,
      es_predefinida: false,
    };

    let error;
    if (template?.id) {
      // Actualizar
      const result = await supabaseBrowserClient
        .from('blog_templates')
        .update(templateData)
        .eq('id', template.id);
      error = result.error;
    } else {
      // Crear
      const result = await supabaseBrowserClient
        .from('blog_templates')
        .insert([templateData]);
      error = result.error;
    }

    setSaving(false);

    if (!error) {
      toast({
        title: 'Template guardado',
        description: template?.id ? 'Template actualizado correctamente' : 'Template creado correctamente',
      });
      onClose();
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el template',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={onClose} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">
          {template?.id ? 'Editar Template' : 'Nuevo Template'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Template</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Tutorial Paso a Paso"
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe para qué sirve este template"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Template
              </>
            )}
          </Button>
        </div>

        <div className="lg:col-span-2">
          <div className="border rounded-lg p-4 bg-card">
            <h3 className="font-semibold mb-4">Bloques del Template</h3>
            <DragDropEditor blocks={blocks} onChange={setBlocks} />
          </div>
        </div>
      </div>
    </div>
  );
}
