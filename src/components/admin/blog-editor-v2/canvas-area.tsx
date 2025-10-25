// FILE: src/components/admin/blog-editor-v2/canvas-area.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Block } from '@/lib/types';
import { CanvasBlock } from './canvas-block';
import { DropZoneIndicator } from './drop-zone-indicator';
import { cn } from '@/lib/utils';
import { Plus, Video as VideoIcon, FileIcon, Twitter } from 'lucide-react';

// Importar los editores de bloques existentes
import { RichTextBlockEditor } from '../blocks/rich-text-block-editor';
import { ImageBlockEditorV2 } from '../blocks/image-block-editor-v2';
import { ProgramCardBlockEditor } from '../blocks/program-card-block-editor';
import { ProgramsGridBlockEditor } from '../blocks/programs-grid-block-editor';
import { ImagesGridBlockEditor } from '../blocks/images-grid-block-editor';
import { TabsBlockEditor } from '../blocks/tabs-block-editor';
import { AccordionBlockEditor } from '../blocks/accordion-block-editor';
import { AlertBlockEditor } from '../blocks/alert-block-editor';
import { CodeBlockEditor } from '../blocks/code-block-editor';
import { SeparatorBlockEditor } from '../blocks/separator-block-editor';
import { VideoBlockEditor } from '../blocks/video-block-editor';
import { TweetBlockEditor } from '../blocks/tweet-block-editor';
import { TableBlockEditor } from '../blocks/table-block-editor';
import { CalloutBlockEditor } from '../blocks/callout-block-editor';
import { ButtonBlockEditor } from '../blocks/button-block-editor';
import { DividerTextBlockEditor } from '../blocks/divider-text-block-editor';
import { QuoteBlockEditor } from '../blocks/quote-block-editor';
import { StatsBlockEditor } from '../blocks/stats-block-editor';
import { TimelineBlockEditor } from '../blocks/timeline-block-editor';
import { ComparisonBlockEditor } from '../blocks/comparison-block-editor';
import { FileDownloadBlockEditor } from '../blocks/file-download-block-editor';
import { EmbedBlockEditor } from '../blocks/embed-block-editor';

interface CanvasAreaProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, block: Block) => void;
  onDeleteBlock: (id: string) => void;
  onBlocksChange?: (blocks: Block[]) => void;
  dropTargetIndex?: number | null;
}

export function CanvasArea({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onBlocksChange,
  dropTargetIndex,
}: CanvasAreaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  const blockIds = blocks.map((b) => b.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'h-full overflow-y-auto p-4 md:p-8 transition-colors',
        isOver && 'bg-primary/5'
      )}
    >
      <div className="max-w-3xl mx-auto pb-20 md:pb-4">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Comienza a construir tu post
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Arrastra bloques desde el panel izquierdo para empezar a crear
              contenido. Puedes reorganizarlos en cualquier momento.
            </p>
          </div>
        ) : (
          <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {/* Drop zone al inicio */}
              <DropZoneIndicator id="drop-zone-0" index={0} />
              
              {blocks.map((block, index) => (
                <div key={block.id}>
                      <CanvasBlock
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => onSelectBlock(block.id)}
                    onDelete={() => onDeleteBlock(block.id)}
                    onUpdateBlock={(updatedBlock) => onUpdateBlock(block.id, updatedBlock)}
                    onDuplicate={() => {
                      const newBlock = { ...block, id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}` };
                      const newBlocks = [...blocks];
                      newBlocks.splice(index + 1, 0, newBlock);
                      if (onBlocksChange) onBlocksChange(newBlocks);
                    }}
                    onMoveUp={() => {
                      if (index > 0) {
                        const newBlocks = [...blocks];
                        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
                        if (onBlocksChange) onBlocksChange(newBlocks);
                      }
                    }}
                    onMoveDown={() => {
                      if (index < blocks.length - 1) {
                        const newBlocks = [...blocks];
                        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
                        if (onBlocksChange) onBlocksChange(newBlocks);
                      }
                    }}
                    canMoveUp={index > 0}
                    canMoveDown={index < blocks.length - 1}
                  >
                    <BlockEditorRenderer
                      block={block}
                      onChange={(updatedBlock) => onUpdateBlock(block.id, updatedBlock)}
                      isSelected={selectedBlockId === block.id}
                    />
                  </CanvasBlock>
                  
                  {/* Drop zone después de cada bloque */}
                  <DropZoneIndicator id={`drop-zone-${index + 1}`} index={index + 1} />
                </div>
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}

// Renderizar el editor apropiado según el tipo de bloque
function BlockEditorRenderer({
  block,
  onChange,
  isSelected,
}: {
  block: Block;
  onChange: (block: Block) => void;
  isSelected: boolean;
}) {
  // Si no está seleccionado, mostrar preview simplificado
  if (!isSelected) {
    return <BlockPreview block={block} />;
  }

  // Si está seleccionado, mostrar el editor completo
  switch (block.type) {
    case 'text':
      return (
        <RichTextBlockEditor
          block={block as Extract<Block, { type: 'text' }>}
          onChange={onChange as any}
        />
      );
    case 'image':
      return (
        <ImageBlockEditorV2
          block={block as Extract<Block, { type: 'image' }>}
          onChange={onChange as any}
        />
      );
    case 'program-card':
      return (
        <ProgramCardBlockEditor
          block={block as Extract<Block, { type: 'program-card' }>}
          onChange={onChange as any}
        />
      );
    case 'programs-grid':
      return (
        <ProgramsGridBlockEditor
          block={block as Extract<Block, { type: 'programs-grid' }>}
          onChange={onChange as any}
        />
      );
    case 'images-grid':
      return (
        <ImagesGridBlockEditor
          block={block as Extract<Block, { type: 'images-grid' }>}
          onChange={onChange as any}
        />
      );
    case 'tabs':
      return (
        <TabsBlockEditor
          block={block as Extract<Block, { type: 'tabs' }>}
          onChange={onChange as any}
        />
      );
    case 'accordion':
      return (
        <AccordionBlockEditor
          block={block as Extract<Block, { type: 'accordion' }>}
          onChange={onChange as any}
        />
      );
    case 'alert':
      return (
        <AlertBlockEditor
          block={block as Extract<Block, { type: 'alert' }>}
          onChange={onChange as any}
        />
      );
    case 'code':
      return (
        <CodeBlockEditor
          block={block as Extract<Block, { type: 'code' }>}
          onChange={onChange as any}
        />
      );
    case 'separator':
      return (
        <SeparatorBlockEditor
          block={block as Extract<Block, { type: 'separator' }>}
          onChange={onChange as any}
        />
      );
    case 'video':
      return (
        <VideoBlockEditor
          block={block as Extract<Block, { type: 'video' }>}
          onChange={onChange as any}
        />
      );
    case 'tweet':
      return (
        <TweetBlockEditor
          block={block as Extract<Block, { type: 'tweet' }>}
          onChange={onChange as any}
        />
      );
    case 'table':
      return (
        <TableBlockEditor
          block={block as Extract<Block, { type: 'table' }>}
          onChange={onChange as any}
        />
      );
    case 'callout':
      return (
        <CalloutBlockEditor
          block={block as Extract<Block, { type: 'callout' }>}
          onChange={onChange as any}
        />
      );
    case 'button':
      return (
        <ButtonBlockEditor
          block={block as Extract<Block, { type: 'button' }>}
          onChange={onChange as any}
        />
      );
    case 'divider-text':
      return (
        <DividerTextBlockEditor
          block={block as Extract<Block, { type: 'divider-text' }>}
          onChange={onChange as any}
        />
      );
    case 'quote':
      return (
        <QuoteBlockEditor
          block={block as Extract<Block, { type: 'quote' }>}
          onChange={onChange as any}
        />
      );
    case 'stats':
      return (
        <StatsBlockEditor
          block={block as Extract<Block, { type: 'stats' }>}
          onChange={onChange as any}
        />
      );
    case 'timeline':
      return (
        <TimelineBlockEditor
          block={block as Extract<Block, { type: 'timeline' }>}
          onChange={onChange as any}
        />
      );
    case 'comparison':
      return (
        <ComparisonBlockEditor
          block={block as Extract<Block, { type: 'comparison' }>}
          onChange={onChange as any}
        />
      );
    case 'file-download':
      return (
        <FileDownloadBlockEditor
          block={block as Extract<Block, { type: 'file-download' }>}
          onChange={onChange as any}
        />
      );
    case 'embed':
      return (
        <EmbedBlockEditor
          block={block as Extract<Block, { type: 'embed' }>}
          onChange={onChange as any}
        />
      );
    default:
      return <div className="text-muted-foreground">Tipo de bloque desconocido</div>;
  }
}

// Preview simplificado cuando el bloque no está seleccionado
function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      const textContent = block.data.content?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Texto vacío...';
      return (
        <div className="text-sm text-muted-foreground line-clamp-2">
          {textContent}
        </div>
      );
    case 'image':
      return block.data.url ? (
        <div className="space-y-2">
          <img
            src={block.data.url}
            alt={block.data.alt || ''}
            className="w-full h-32 object-cover rounded"
          />
          {block.data.caption && (
            <p className="text-xs text-muted-foreground">{block.data.caption}</p>
          )}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Sin imagen seleccionada</div>
      );
    case 'video':
      return block.data.url ? (
        <div className="space-y-2">
          <div className="w-full h-32 bg-muted rounded flex items-center justify-center gap-2">
            <VideoIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Video</span>
          </div>
          {block.data.caption && (
            <p className="text-xs text-muted-foreground">{block.data.caption}</p>
          )}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Sin video seleccionado</div>
      );
    case 'program-card':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.programId ? `Programa ID: ${block.data.programId}` : 'No seleccionado'}
        </div>
      );
    case 'programs-grid':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.programIds.length > 0 
            ? `${block.data.programIds.length} programas en ${block.data.columns} columnas`
            : 'Sin programas seleccionados'}
        </div>
      );
    case 'images-grid':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.images.length > 0
            ? `${block.data.images.length} imágenes en ${block.data.columns} columnas`
            : 'Sin imágenes'}
        </div>
      );
    case 'tabs':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.tabs.length > 0
            ? `${block.data.tabs.length} pestañas: ${block.data.tabs.map(t => t.label).join(', ')}`
            : 'Sin pestañas'}
        </div>
      );
    case 'accordion':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.items.length > 0
            ? `${block.data.items.length} items`
            : 'Sin items'}
        </div>
      );
    case 'alert':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.title && <span className="font-medium">{block.data.title}: </span>}
          {block.data.description || 'Alerta vacía...'}
        </div>
      );
    case 'code':
      return (
        <div className="text-sm text-muted-foreground font-mono">
          {block.data.language && <span className="font-semibold">{block.data.language}: </span>}
          {block.data.code ? `${block.data.code.substring(0, 50)}...` : 'Código vacío'}
        </div>
      );
    case 'separator':
      return <div className="border-t-2 border-border my-2" />;
    case 'divider-text':
      return (
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 border-t-2 border-border" />
          {block.data.text && <span className="text-xs text-muted-foreground">{block.data.text}</span>}
          <div className="flex-1 border-t-2 border-border" />
        </div>
      );
    case 'quote':
      return (
        <div className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">
          "{block.data.quote || 'Cita vacía...'}"
          {block.data.author && <span className="block mt-1 not-italic">— {block.data.author}</span>}
        </div>
      );
    case 'callout':
      return (
        <div className="text-sm text-muted-foreground flex items-start gap-2">
          <span className="text-lg">{block.data.icon}</span>
          <span>{block.data.content || 'Callout vacío...'}</span>
        </div>
      );
    case 'button':
      return (
        <div className="text-sm text-muted-foreground">
          Botón: {block.data.text || 'Sin texto'} → {block.data.url || 'Sin URL'}
        </div>
      );
    case 'table':
      return (
        <div className="text-sm text-muted-foreground">
          Tabla: {block.data.headers.length} columnas × {block.data.rows.length} filas
        </div>
      );
    case 'stats':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.stats.length} estadísticas en {block.data.columns} columnas
        </div>
      );
    case 'timeline':
      return (
        <div className="text-sm text-muted-foreground">
          Timeline con {block.data.items.length} eventos
        </div>
      );
    case 'comparison':
      return (
        <div className="text-sm text-muted-foreground">
          Comparación de {block.data.items.length} items
        </div>
      );
    case 'file-download':
      return (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <FileIcon className="h-4 w-4" />
          {block.data.fileName || 'Archivo sin nombre'}
        </div>
      );
    case 'tweet':
      return (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Twitter className="h-4 w-4" />
          Tweet: {block.data.tweetUrl || 'Sin URL'}
        </div>
      );
    case 'embed':
      return (
        <div className="text-sm text-muted-foreground">
          Embed HTML {block.data.caption && `- ${block.data.caption}`}
        </div>
      );
    default:
      return <div className="text-sm text-muted-foreground">Contenido del bloque</div>;
  }
}
