'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Search, HelpCircle, List } from 'lucide-react';
import { PostSettingsPanel } from './post-settings-panel';
import { SEOPanel } from './seo-panel';
import { PostMetadataPanel } from './post-metadata-panel';
import { BlocksOutlinePanel } from './blocks-outline-panel';
import { Block } from '@/lib/types';

interface Autor {
  id: number;
  nombre: string;
  avatar_url?: string | null;
}

interface EditorSidebarTabsProps {
  // Blocks
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlocks: (ids: string[]) => void;
  onDuplicateBlocks: (ids: string[]) => void;
  onReorderBlocks: (blockIds: string[], targetIndex: number) => void;
  
  // Post Settings
  titulo: string;
  slug: string;
  descripcionCorta: string;
  autorId: number | null;
  autores: Autor[];
  publicado: boolean;
  isFeatured: boolean;
  fechaPublicacion: Date;
  scheduledFor: string | null;
  tags: string[];
  categories: number[];
  imagenPortadaUrl?: string;
  imagenPortadaAlt?: string;
  imageFile: File | null;
  onTituloChange: (titulo: string) => void;
  onSlugChange: (slug: string) => void;
  onDescripcionChange: (desc: string) => void;
  onAutorChange: (autorId: number | null) => void;
  onPublicadoChange: (publicado: boolean) => void;
  onIsFeaturedChange: (featured: boolean) => void;
  onFechaChange: (fecha: Date) => void;
  onScheduledForChange: (date: string | null) => void;
  onTagsChange: (tags: string[]) => void;
  onCategoriesChange: (categories: number[]) => void;
  onImageFileChange: (file: File | null) => void;
  onImagenAltChange: (alt: string) => void;
}

export function EditorSidebarTabs(props: EditorSidebarTabsProps) {
  // Encontrar el autor actual
  const autorActual = props.autores.find(a => a.id === props.autorId);
  
  return (
    <Tabs defaultValue="outline" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-4 shrink-0">
        <TabsTrigger value="outline" className="gap-2">
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">Bloques</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Config</span>
        </TabsTrigger>
        <TabsTrigger value="seo" className="gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">SEO</span>
        </TabsTrigger>
        <TabsTrigger value="help" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Ayuda</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="outline" className="flex-1 overflow-hidden m-0">
        <BlocksOutlinePanel
          blocks={props.blocks}
          selectedBlockId={props.selectedBlockId}
          onSelectBlock={props.onSelectBlock}
          onDeleteBlocks={props.onDeleteBlocks}
          onDuplicateBlocks={props.onDuplicateBlocks}
          onReorderBlocks={props.onReorderBlocks}
        />
      </TabsContent>

      <TabsContent value="settings" className="flex-1 overflow-hidden m-0">
        <PostSettingsPanel
          titulo={props.titulo}
          slug={props.slug}
          descripcionCorta={props.descripcionCorta}
          tags={props.tags}
          publicado={props.publicado}
          isFeatured={props.isFeatured}
          fechaPublicacion={props.fechaPublicacion}
          autor={autorActual?.nombre || 'Sin autor'}
          onSlugChange={props.onSlugChange}
          onDescripcionChange={props.onDescripcionChange}
          onTagsChange={props.onTagsChange}
          onPublicadoChange={props.onPublicadoChange}
          onIsFeaturedChange={props.onIsFeaturedChange}
          onFechaChange={props.onFechaChange}
        />
      </TabsContent>

      <TabsContent value="seo" className="flex-1 overflow-hidden m-0">
        <SEOPanel
          blocks={props.blocks}
          titulo={props.titulo}
          descripcion={props.descripcionCorta}
          slug={props.slug}
          imagenPortada={props.imagenPortadaUrl}
        />
      </TabsContent>

      <TabsContent value="help" className="flex-1 overflow-auto m-0 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">⭐ Destacado en Serie</h3>
            <p className="text-sm text-muted-foreground">
              Activa el switch "Destacado en Serie" en la pestaña Configuración para que este post aparezca en el carrusel destacado de su serie.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🏷️ Tags y Series</h3>
            <p className="text-sm text-muted-foreground">
              Los posts con el mismo tag se agrupan automáticamente en series. Usa tags descriptivos como "Adobe MAX 2025".
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📝 SEO</h3>
            <p className="text-sm text-muted-foreground">
              Optimiza tu contenido para buscadores en la pestaña SEO. El meta título y descripción son importantes para el ranking.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🎨 Bloques</h3>
            <p className="text-sm text-muted-foreground">
              Usa la pestaña Bloques para ver la estructura de tu post y navegar rápidamente entre secciones.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
