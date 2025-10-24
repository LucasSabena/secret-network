// FILE: src/components/admin/blog-editor-v2/template-gallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Palette, 
  BookOpen, 
  Scale, 
  FileCheck, 
  Star,
  List,
  GraduationCap,
  BarChart3,
  Newspaper,
  Lightbulb,
  Code
} from 'lucide-react';
import { PREDEFINED_TEMPLATES, cloneTemplate, BlogTemplate } from '@/lib/blog-templates';
import { Block } from '@/lib/types';

// Mapeo de iconos para cada template
const TEMPLATE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'alert-circle': AlertCircle,
  'palette': Palette,
  'book-open': BookOpen,
  'scale': Scale,
  'file-check': FileCheck,
  'star': Star,
  'list': List,
  'graduation-cap': GraduationCap,
  'bar-chart': BarChart3,
  'newspaper': Newspaper,
  'lightbulb': Lightbulb,
  'code': Code,
};

interface TemplateGalleryProps {
  onSelectTemplate: (blocks: Block[]) => void;
  children?: React.ReactNode;
}

const CATEGORY_LABELS = {
  lista: 'Listas',
  tutorial: 'Tutoriales',
  comparativa: 'Comparativas',
  guia: 'Guías',
  review: 'Reviews',
  showcase: 'Showcases',
};

const CATEGORY_COLORS = {
  lista: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  tutorial: 'bg-green-500/10 text-green-700 dark:text-green-400',
  comparativa: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  guia: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  review: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  showcase: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
};

function TemplateCard({ template, onSelect }: { template: BlogTemplate; onSelect: () => void }) {
  const Icon = TEMPLATE_ICONS[template.thumbnail] || FileText;
  
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <Badge className={CATEGORY_COLORS[template.categoria]}>
            {CATEGORY_LABELS[template.categoria]}
          </Badge>
        </div>
        <CardTitle className="text-lg">{template.nombre}</CardTitle>
        <CardDescription className="text-sm">{template.descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{template.bloques.length} bloques</span>
        </div>
        <Button
          onClick={onSelect}
          className="w-full"
          variant="default"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Usar Template
        </Button>
      </CardContent>
    </Card>
  );
}

export function TemplateGallery({ onSelectTemplate, children }: TemplateGalleryProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | BlogTemplate['categoria']>('all');
  const [templates, setTemplates] = useState<BlogTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar templates desde Supabase
  useEffect(() => {
    async function loadTemplates() {
      setLoading(true);
      const { data, error } = await supabaseBrowserClient
        .from('blog_templates')
        .select('*')
        .eq('es_predefinida', true)
        .order('nombre');

      if (!error && data) {
        // Mapear los datos de Supabase al formato BlogTemplate
        const mappedTemplates: BlogTemplate[] = data.map((t: any) => ({
          id: t.id.toString(),
          nombre: t.nombre,
          descripcion: t.descripcion || '',
          categoria: t.categoria as BlogTemplate['categoria'],
          thumbnail: t.thumbnail_url || 'file-text',
          bloques: t.bloques || [],
        }));
        setTemplates(mappedTemplates);
      } else if (error) {
        console.error('Error cargando templates:', error);
        // Fallback a templates del código si hay error
        setTemplates(PREDEFINED_TEMPLATES);
      }
      setLoading(false);
    }
    
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const handleSelectTemplate = (template: BlogTemplate) => {
    const blocks = cloneTemplate(template);
    onSelectTemplate(blocks);
    setOpen(false);
  };

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.categoria === (selectedCategory as BlogTemplate['categoria']));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Plantillas
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Plantillas de Posts</DialogTitle>
          <DialogDescription>
            Comienza rápido con una plantilla predefinida. Puedes personalizarla después.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="lista">Listas</TabsTrigger>
            <TabsTrigger value="tutorial">Tutoriales</TabsTrigger>
            <TabsTrigger value="comparativa">Comparativas</TabsTrigger>
            <TabsTrigger value="guia">Guías</TabsTrigger>
            <TabsTrigger value="review">Reviews</TabsTrigger>
            <TabsTrigger value="showcase">Showcases</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value={selectedCategory} className="m-0">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  Cargando plantillas...
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No hay plantillas en esta categoría
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={() => handleSelectTemplate(template)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
