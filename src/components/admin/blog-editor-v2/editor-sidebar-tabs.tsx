'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Settings, BarChart3 } from 'lucide-react';
import { BlocksOutlinePanel } from './blocks-outline-panel';
import { PostSettingsPanel } from './post-settings-panel';
import { EditorStats } from './editor-stats';
import { Block } from '@/lib/types';

interface EditorSidebarTabsProps {
  // Blocks tab
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onDeleteBlocks: (blockIds: string[]) => void;
  onDuplicateBlocks: (blockIds: string[]) => void;
  onReorderBlocks: (blockIds: string[], targetIndex: number) => void;
  
  // Settings tab
  titulo: string;
  slug: string;
  descripcionCorta: string;
  tags: string[];
  publicado: boolean;
  fechaPublicacion: Date;
  autor: string;
  onSlugChange: (slug: string) => void;
  onDescripcionChange: (desc: string) => void;
  onTagsChange: (tags: string[]) => void;
  onPublicadoChange: (publicado: boolean) => void;
  onFechaChange: (fecha: Date) => void;
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
  tags,
  publicado,
  fechaPublicacion,
  autor,
  onSlugChange,
  onDescripcionChange,
  onTagsChange,
  onPublicadoChange,
  onFechaChange,
}: EditorSidebarTabsProps) {
  return (
    <Tabs defaultValue="blocks" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3 shrink-0">
        <TabsTrigger value="blocks" className="gap-2 text-xs">
          <Layers className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Bloques</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2 text-xs">
          <Settings className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Config</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="gap-2 text-xs">
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Stats</span>
        </TabsTrigger>
      </TabsList>

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

      <TabsContent value="settings" className="flex-1 m-0 overflow-hidden">
        <PostSettingsPanel
          titulo={titulo}
          slug={slug}
          descripcionCorta={descripcionCorta}
          tags={tags}
          publicado={publicado}
          fechaPublicacion={fechaPublicacion}
          autor={autor}
          onSlugChange={onSlugChange}
          onDescripcionChange={onDescripcionChange}
          onTagsChange={onTagsChange}
          onPublicadoChange={onPublicadoChange}
          onFechaChange={onFechaChange}
        />
      </TabsContent>

      <TabsContent value="stats" className="flex-1 m-0 overflow-hidden p-4">
        <EditorStats
          blocks={blocks}
          title={titulo}
          description={descripcionCorta}
        />
      </TabsContent>
    </Tabs>
  );
}
