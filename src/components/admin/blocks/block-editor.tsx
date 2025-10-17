// FILE: src/components/admin/blocks/block-editor.tsx
'use client';

import { useState } from 'react';
import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  GripVertical,
  Trash2,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  CreditCard,
  LayoutGrid,
  ChevronDown,
  AlertCircle,
  Minus,
  Image as ImageIcon,
  FileCode,
} from 'lucide-react';
import { TextBlockEditor } from './text-block-editor';
import { ProgramCardBlockEditor } from './program-card-block-editor';
import { TabsBlockEditor } from './tabs-block-editor';
import { AccordionBlockEditor } from './accordion-block-editor';
import { AlertBlockEditor } from './alert-block-editor';
import { SeparatorBlockEditor } from './separator-block-editor';
import { ImageBlockEditor } from './image-block-editor';
import { CodeBlockEditor } from './code-block-editor';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // Generar ID único para bloques nuevos
  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Agregar un bloque nuevo
  const addBlock = (type: Block['type'], index?: number) => {
    const newBlock: Block = (() => {
      const id = generateId();
      switch (type) {
        case 'text':
          return { id, type, data: { format: 'paragraph', content: '' } };
        case 'program-card':
          return { id, type, data: { programId: 0 } };
        case 'tabs':
          return { id, type, data: { tabs: [{ id: generateId(), label: 'Tab 1', content: '' }] } };
        case 'accordion':
          return { id, type, data: { items: [{ id: generateId(), title: 'Item 1', content: '' }] } };
        case 'alert':
          return { id, type, data: { variant: 'default', description: '' } };
        case 'separator':
          return { id, type, data: { style: 'solid' } };
        case 'image':
          return { id, type, data: { url: '' } };
        case 'code':
          return { id, type, data: { language: 'javascript', code: '' } };
        default:
          return { id, type: 'text', data: { format: 'paragraph', content: '' } };
      }
    })();

    const newBlocks = [...blocks];
    if (index !== undefined) {
      newBlocks.splice(index + 1, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }
    onChange(newBlocks);
  };

  // Actualizar un bloque
  const updateBlock = (id: string, updatedBlock: Block) => {
    onChange(blocks.map((block) => (block.id === id ? updatedBlock : block)));
  };

  // Eliminar un bloque
  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  // Mover un bloque
  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      {/* Botón para agregar primer bloque si está vacío */}
      {blocks.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No hay bloques aún. ¡Agrega tu primer bloque!</p>
          <AddBlockButton onAdd={(type) => addBlock(type)} />
        </div>
      )}

      {/* Lista de bloques */}
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="group relative"
          onMouseEnter={() => setHoveredBlockId(block.id)}
          onMouseLeave={() => setHoveredBlockId(null)}
        >
          {/* Toolbar del bloque (aparece al hover) */}
          {hoveredBlockId === block.id && (
            <div className="absolute -left-12 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 cursor-grab"
                title="Arrastrar (próximamente)"
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={() => deleteBlock(block.id)}
                title="Eliminar bloque"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Renderizar editor según tipo de bloque */}
          <div className="border border-border rounded-lg p-4 bg-card hover:border-primary/50 transition-colors">
            {block.type === 'text' && (
              <TextBlockEditor block={block as Extract<Block, { type: 'text' }>} onChange={(updated: Block) => updateBlock(block.id, updated)} />
            )}
            {block.type === 'program-card' && (
              <ProgramCardBlockEditor block={block as Extract<Block, { type: 'program-card' }>} onChange={(updated: Block) => updateBlock(block.id, updated)} />
            )}
            {block.type === 'tabs' && (
              <TabsBlockEditor block={block as Extract<Block, { type: 'tabs' }>} onChange={(updated: Block) => updateBlock(block.id, updated)} />
            )}
            {block.type === 'accordion' && (
              <AccordionBlockEditor block={block as Extract<Block, { type: 'accordion' }>} onChange={(updated: Block) => updateBlock(block.id, updated)} />
            )}
            {block.type === 'alert' && (
              <AlertBlockEditor block={block as Extract<Block, { type: 'alert' }>} onChange={(updated: Block) => updateBlock(block.id, updated)} />
            )}
            {block.type === 'separator' && (
              <SeparatorBlockEditor block={block as Extract<Block, { type: 'separator' }>} onChange={(updated: Block) => updateBlock(block.id, updated)} />
            )}
            {block.type === 'image' && (
              <ImageBlockEditor block={block as Extract<Block, { type: 'image' }>} onChange={(updated: Block) => updateBlock(block.id, updated)} />
            )}
            {block.type === 'code' && (
              <CodeBlockEditor block={block as Extract<Block, { type: 'code' }>} onChange={(updated: Block) => updateBlock(block.id, updated)} />
            )}
          </div>

          {/* Botón para agregar bloque después de este */}
          <div className="flex justify-center my-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <AddBlockButton onAdd={(type) => addBlock(type, index)} variant="inline" />
          </div>
        </div>
      ))}

      {/* Botón para agregar bloque al final */}
      {blocks.length > 0 && (
        <div className="flex justify-center pt-4">
          <AddBlockButton onAdd={(type) => addBlock(type)} />
        </div>
      )}
    </div>
  );
}

// Componente para el botón de agregar bloques
function AddBlockButton({ onAdd, variant = 'default' }: { onAdd: (type: Block['type']) => void; variant?: 'default' | 'inline' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant === 'inline' ? 'ghost' : 'default'} size={variant === 'inline' ? 'sm' : 'default'}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Bloque
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem onClick={() => onAdd('text')}>
          <Type className="mr-2 h-4 w-4" />
          <span>Texto/Párrafo</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('program-card')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Tarjeta de Programa</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('tabs')}>
          <LayoutGrid className="mr-2 h-4 w-4" />
          <span>Pestañas (Tabs)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('accordion')}>
          <ChevronDown className="mr-2 h-4 w-4" />
          <span>Acordeón</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('alert')}>
          <AlertCircle className="mr-2 h-4 w-4" />
          <span>Alerta/Callout</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('image')}>
          <ImageIcon className="mr-2 h-4 w-4" />
          <span>Imagen</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('code')}>
          <FileCode className="mr-2 h-4 w-4" />
          <span>Código</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('separator')}>
          <Minus className="mr-2 h-4 w-4" />
          <span>Separador</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
