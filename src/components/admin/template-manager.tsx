// FILE: src/components/admin/template-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Search,
  FileText,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { TemplateEditor } from './template-editor';
import { Block } from '@/lib/types';

interface Template {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  thumbnail_url: string;
  bloques: Block[];
  es_predefinida: boolean;
  uso_count: number;
  creado_en: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  lista: 'Lista',
  tutorial: 'Tutorial',
  comparativa: 'Comparativa',
  guia: 'Guía',
  review: 'Review',
  showcase: 'Showcase',
};

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    const { data, error } = await supabaseBrowserClient
      .from('blog_templates')
      .select('*')
      .order('nombre');

    if (!error && data) {
      setTemplates(data as Template[]);
    } else if (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los templates',
        variant: 'destructive',
      });
    }
    setLoading(false);
  }

  async function handleDelete(id: number, esPredefinida: boolean) {
    if (esPredefinida) {
      toast({
        title: 'No permitido',
        description: 'No puedes eliminar templates predefinidos',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este template?')) return;

    const { error } = await supabaseBrowserClient
      .from('blog_templates')
      .delete()
      .eq('id', id);

    if (!error) {
      toast({
        title: 'Template eliminado',
        description: 'El template se eliminó correctamente',
      });
      loadTemplates();
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el template',
        variant: 'destructive',
      });
    }
  }

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (editingTemplate || isCreating) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onClose={() => {
          setEditingTemplate(null);
          setIsCreating(false);
          loadTemplates();
        }}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Templates</h1>
          <p className="text-muted-foreground mt-2">
            Administra las plantillas de posts del blog
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Template
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No se encontraron templates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={template.es_predefinida ? 'default' : 'secondary'}>
                    {template.es_predefinida ? 'Predefinido' : 'Personalizado'}
                  </Badge>
                  <Badge variant="outline">
                    {CATEGORY_LABELS[template.categoria] || template.categoria}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{template.nombre}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.descripcion}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{template.bloques?.length || 0} bloques</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{template.uso_count || 0} usos</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className="mr-2 h-3 w-3" />
                    Editar
                  </Button>
                  {!template.es_predefinida && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(template.id, template.es_predefinida)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
