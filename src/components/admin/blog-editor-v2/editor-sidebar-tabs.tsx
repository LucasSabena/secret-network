'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, FileText, Search, BarChart3 } from 'lucide-react';
import { BlocksOutlinePanel } from './blocks-outline-panel';
import { PostMetadataPanel } from './post-metadata-panel';
import { SEOPanel } from './seo-panel';
import { EditorStats } from './editor-stats';
import { Block } from '@/lib/types';

interface Autor {
  id: number;
  nombre: string;
  avatar_url?: string | null;
}

interface EditorSidebarTabsProps {
  // Blocks tab
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onDeleteBlocks: (blockIds: string[]) => void;
  onDuplicateBlocks: (blockIds: string[]) => void;
  onReorderBlocks: (blockIds: string[], targetIndex: number) => void;
  
  // Metadata tab
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

export function EditorSidebarTabs({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlocks,
  onDuplicateBlocks,
  onReorderBlocks,
  titulo,
  slug,
  descripcionCorta,
  autorId,
  autores,
  publicado,
  isFeatured,
  fechaPublicacion,
  scheduledFor,
  tags,
  categories,
  imagenPortadaUrl,
  imagenPortadaAlt,
  imageFile,
  onTituloChange,
  onSlugChange,
  onDescripcionChange,
  onAutorChange,
  onPublicadoChange,
  onIsFeaturedChange,
  onFechaChange,
  onScheduledForChange,
  onTagsChange,
  onCategoriesChange,
  onImageFileChange,
  onImagenAltChange,
}: EditorSidebarTabsProps) {
  return (
    <Tabs defaultValue="metadata" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-4 shrink-0">
        <TabsTrigger value="metadata" className="gap-1 text-xs px-2">
          <FileText className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Info</span>
        </TabsTrigger>
        <TabsTrigger value="blocks" className="gap-1 text-xs px-2">
          <Layers className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Bloques</span>
        </TabsTrigger>
        <TabsTrigger value="seo" className="gap-1 text-xs px-2">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">SEO</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="gap-1 text-xs px-2">
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Stats</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="metadata" className="flex-1 m-0 overflow-hidden">
        <PostMetadataPanel
          titulo={titulo}
          slug={slug}
          descripcionCorta={descripcionCorta}
          autorId={autorId}
          autores={autores}
          publicado={publicado}
          isFeatured={isFeatured}
          fechaPublicacion={fechaPublicacion}
          scheduledFor={scheduledFor}
          tags={tags}
          categories={categories}
          imagenPortadaUrl={imagenPortadaUrl}
          imagenPortadaAlt={imagenPortadaAlt}
          imageFile={imageFile}
          onTituloChange={onTituloChange}
          onSlugChange={onSlugChange}
          onDescripcionChange={onDescripcionChange}
          onAutorChange={onAutorChange}
          onPublicadoChange={onPublicadoChange}
          onIsFeaturedChange={onIsFeaturedChange}
          onFechaChange={onFechaChange}
          onScheduledForChange={onScheduledForChange}
          onTagsChange={onTagsChange}
          onCategoriesChange={onCategoriesChange}
          onImageFileChange={onImageFileChange}
          onImagenAltChange={onImagenAltChange}
        />
      </TabsContent>

      <TabsContent value="blocks" className="flex-1 m-0 overflow-hidden">
        <BlocksOutlinePanel
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={onSelectBlock}
          onDeleteBlocks={onDeleteBlocks}
          onDuplicateBlocks={onDuplicateBlocks}
          onReorderBlocks={onReorderBlocks}
        />
      </TabsContent>

      <TabsContent value="seo" className="flex-1 m-0 overflow-hidden">
        <SEOPanel
          blocks={blocks}
          titulo={titulo}
          descripcion={descripcionCorta}
          slug={slug}
          imagenPortada={imagenPortadaUrl || (imageFile ? URL.createObjectURL(imageFile) : undefined)}
        />
      </TabsContent>

      <TabsContent value="stats" className="flex-1 m-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <EditorStats
              blocks={blocks}
              title={titulo}
              description={descripcionCorta}
            />
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
