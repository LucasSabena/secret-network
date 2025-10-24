// FILE: src/components/admin/blog-editor-v2/canvas-area.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Block } from '@/lib/types';
import { CanvasBlock } from './canvas-block';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

// Importar los editores de bloques existentes
import { RichTextBlockEditor } from '../blocks/rich-text-block-editor';
import { ImageBlockEditor } from '../blocks/image-block-editor';
import { ProgramCardBlockEditor } from '../blocks/program-card-block-editor';
import { TabsBlockEditor } from '../blocks/tabs-block-editor';
import { AccordionBlockEditor } from '../blocks/accordion-block-editor';
import { AlertBlockEditor } from '../blocks/alert-block-editor';
import { CodeBlockEditor } from '../blocks/code-block-editor';
import { SeparatorBlockEditor } from '../blocks/separator-block-editor';

interface CanvasAreaProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, block: Block) => void;
  onDeleteBlock: (id: string) => void;
  onBlocksChange?: (blocks: Block[]) => void;
}

export function CanvasArea({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onBlocksChange,
}: CanvasAreaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  const blockIds = blocks.map((b) => b.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'h-full overflow-y-auto p-8 transition-colors',
        isOver && 'bg-primary/5 ring-2 ring-primary ring-inset'
      )}
    >
      <div className="max-w-3xl mx-auto space-y-4">
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
            {blocks.map((block, index) => (
              <CanvasBlock
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => onSelectBlock(block.id)}
                onDelete={() => onDeleteBlock(block.id)}
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
            ))}
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
        <ImageBlockEditor
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
    default:
      return <div className="text-muted-foreground">Tipo de bloque desconocido</div>;
  }
}

// Preview simplificado cuando el bloque no está seleccionado
function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.content || 'Texto vacío...'}
        </div>
      );
    case 'image':
      return block.data.url ? (
        <img
          src={block.data.url}
          alt={block.data.alt || ''}
          className="w-full h-32 object-cover rounded"
        />
      ) : (
        <div className="text-sm text-muted-foreground">Sin imagen</div>
      );
    case 'program-card':
      return (
        <div className="text-sm text-muted-foreground">
          Programa ID: {block.data.programId || 'No seleccionado'}
        </div>
      );
    case 'tabs':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.tabs.length} pestañas
        </div>
      );
    case 'accordion':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.items.length} items
        </div>
      );
    case 'alert':
      return (
        <div className="text-sm text-muted-foreground">
          {block.data.description || 'Alerta vacía...'}
        </div>
      );
    case 'code':
      return (
        <div className="text-sm text-muted-foreground font-mono">
          {block.data.language}: {block.data.code ? `${block.data.code.substring(0, 50)}...` : 'Código vacío'}
        </div>
      );
    case 'separator':
      return <div className="border-t-2 border-border" />;
    default:
      return null;
  }
}
