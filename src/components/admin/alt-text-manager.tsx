'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/use-toast';

interface ImageWithAlt {
  id: number;
  url: string;
  alt: string | null;
  source: 'blog_post' | 'program';
  sourceId: number;
  sourceName: string;
}

export default function AltTextManager() {
  const [images, setImages] = useState<ImageWithAlt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      setLoading(true);
      const supabase = supabaseBrowserClient;

      // Cargar imágenes de posts de blog
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, titulo, imagen_portada_url, imagen_portada_alt')
        .not('imagen_portada_url', 'is', null);

      // Cargar imágenes de programas
      const { data: programs } = await supabase
        .from('programas')
        .select('id, nombre, imagen_url, imagen_alt')
        .not('imagen_url', 'is', null);

      const allImages: ImageWithAlt[] = [];

      // Agregar imágenes de blog
      blogPosts?.forEach((post) => {
        allImages.push({
          id: post.id,
          url: post.imagen_portada_url!,
          alt: post.imagen_portada_alt,
          source: 'blog_post',
          sourceId: post.id,
          sourceName: post.titulo,
        });
      });

      // Agregar imágenes de programas
      programs?.forEach((program) => {
        allImages.push({
          id: program.id,
          url: program.imagen_url!,
          alt: program.imagen_alt,
          source: 'program',
          sourceId: program.id,
          sourceName: program.nombre,
        });
      });

      setImages(allImages);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las imágenes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function saveAltText(image: ImageWithAlt, newAlt: string) {
    try {
      setSaving(image.id);
      const supabase = supabaseBrowserClient;

      if (image.source === 'blog_post') {
        const { error } = await supabase
          .from('blog_posts')
          .update({ imagen_portada_alt: newAlt })
          .eq('id', image.sourceId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('programas')
          .update({ imagen_alt: newAlt })
          .eq('id', image.sourceId);

        if (error) throw error;
      }

      toast({
        title: 'Guardado',
        description: 'Alt text actualizado correctamente',
      });

      // Actualizar estado local
      setImages(images.map(img => 
        img.id === image.id ? { ...img, alt: newAlt } : img
      ));
    } catch (error) {
      console.error('Error saving alt text:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el alt text',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  }

  function generateAltSuggestions(image: ImageWithAlt): string[] {
    const sourceName = image.sourceName;
    
    if (image.source === 'blog_post') {
      return [
        `Imagen de portada del artículo "${sourceName}"`,
        `Ilustración principal para el post sobre ${sourceName}`,
        `Banner del artículo: ${sourceName}`,
        `Imagen destacada del blog sobre ${sourceName}`,
      ];
    } else {
      return [
        `Captura de pantalla de la interfaz de ${sourceName}`,
        `Logo y hero de la página oficial de ${sourceName}`,
        `Imagen representativa de ${sourceName}`,
        `Vista previa de ${sourceName} en acción`,
        `Interfaz principal de ${sourceName}`,
      ];
    }
  }

  const imagesWithoutAlt = images.filter(img => !img.alt);
  const imagesWithAlt = images.filter(img => img.alt);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Gestor de Alt Text</h2>
        <p className="text-muted-foreground">
          Agrega descripciones a tus imágenes para mejorar SEO y accesibilidad
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{images.length}</p>
              <p className="text-sm text-muted-foreground">Total de imágenes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{imagesWithAlt.length}</p>
              <p className="text-sm text-muted-foreground">Con alt text</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{imagesWithoutAlt.length}</p>
              <p className="text-sm text-muted-foreground">Sin alt text</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Imágenes sin alt text */}
      {imagesWithoutAlt.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Imágenes sin Alt Text ({imagesWithoutAlt.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {imagesWithoutAlt.map((image) => (
              <ImageAltCard
                key={`${image.source}-${image.id}`}
                image={image}
                suggestions={generateAltSuggestions(image)}
                onSave={saveAltText}
                saving={saving === image.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Imágenes con alt text */}
      {imagesWithAlt.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Imágenes con Alt Text ({imagesWithAlt.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {imagesWithAlt.map((image) => (
              <ImageAltCard
                key={`${image.source}-${image.id}`}
                image={image}
                suggestions={generateAltSuggestions(image)}
                onSave={saveAltText}
                saving={saving === image.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para cada imagen
function ImageAltCard({
  image,
  suggestions,
  onSave,
  saving,
}: {
  image: ImageWithAlt;
  suggestions: string[];
  onSave: (image: ImageWithAlt, alt: string) => void;
  saving: boolean;
}) {
  const [altText, setAltText] = useState(image.alt || '');
  const [showSuggestions, setShowSuggestions] = useState(!image.alt);

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Imagen */}
        <div className="w-full md:w-48 shrink-0">
          <img
            src={image.url}
            alt={image.alt || 'Sin alt text'}
            className="w-full h-32 object-cover rounded-lg"
          />
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={image.source === 'blog_post' ? 'default' : 'secondary'}>
              {image.source === 'blog_post' ? 'Blog' : 'Programa'}
            </Badge>
            {!image.alt && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Sin alt
              </Badge>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="font-medium">{image.sourceName}</p>
            <p className="text-sm text-muted-foreground">ID: {image.sourceId}</p>
          </div>

          {/* Campo de alt text */}
          <div className="space-y-2">
            <Label>Texto Alternativo</Label>
            <div className="flex gap-2">
              <Input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe la imagen..."
                className="flex-1"
              />
              <Button
                onClick={() => onSave(image, altText)}
                disabled={saving || !altText || altText === image.alt}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </div>

          {/* Sugerencias */}
          {showSuggestions && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Sugerencias de IA
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuggestions(false)}
                  className="h-6 text-xs"
                >
                  Ocultar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAltText(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="text-xs h-auto py-1.5 px-3"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!showSuggestions && !image.alt && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(true)}
              className="text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Ver sugerencias
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
