// FILE: src/components/admin/blog-editor-v2/drag-drop-editor.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Block } from '@/lib/types';
import { SidebarTools } from './sidebar-tools';
import { CanvasArea } from './canvas-area';
import { SidebarProperties } from './sidebar-properties';
import { BlockFactory } from './block-factory';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLOCK_TOOLS } from './block-tools';

interface DragDropEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

// Componente para el menú móvil de bloques
function MobileBlocksMenu({ blocks, onChange }: { blocks: Block[]; onChange: (blocks: Block[]) => void }) {
  const [open, setOpen] = useState(false);

  const handleAddBlock = (type: Block['type']) => {
    const newBlock = BlockFactory.createBlock(type);
    onChange([...blocks, newBlock]);
    setOpen(false);
  };

  return (
    <div className="md:hidden fixed bottom-6 right-6 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Agregar Bloque</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 mt-6 overflow-y-auto max-h-[calc(80vh-100px)]">
            {BLOCK_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleAddBlock(tool.type)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-accent transition-colors"
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <p className="font-medium text-sm">{tool.label}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function DragDropEditor({ blocks, onChange }: DragDropEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<Block | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;
  const selectedIndex = blocks.findIndex((b) => b.id === selectedBlockId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeData = active.data.current;
    const isNewBlock = activeData?.isNew;

    if (isNewBlock) {
      // Crear nuevo bloque desde la herramienta
      const blockType = activeData.type as Block['type'];
      const newBlock = BlockFactory.createBlock(blockType);
      onChange([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
    } else {
      // Reordenar bloques existentes
      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId !== overId) {
        const oldIndex = blocks.findIndex((b) => b.id === activeId);
        const newIndex = blocks.findIndex((b) => b.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          onChange(arrayMove(blocks, oldIndex, newIndex));
        }
      }
    }
  }

  function handleUpdateBlock(id: string, updatedBlock: Block) {
    onChange(blocks.map((b) => (b.id === id ? updatedBlock : b)));
  }

  function handleDeleteBlock(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  }

  function handleDuplicateBlock(id: string) {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;

    const newBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };

    const index = blocks.findIndex((b) => b.id === id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
    setSelectedBlockId(newBlock.id);
  }

  function handleMoveUp(id: string) {
    const index = blocks.findIndex((b) => b.id === id);
    if (index <= 0) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    onChange(newBlocks);
  }

  function handleMoveDown(id: string) {
    const index = blocks.findIndex((b) => b.id === id);
    if (index < 0 || index >= blocks.length - 1) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    onChange(newBlocks);
  }

  function handleCopy(id: string) {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      setClipboard(block);
    }
  }

  function handleCut(id: string) {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      setClipboard(block);
      handleDeleteBlock(id);
    }
  }

  function handlePaste() {
    if (!clipboard) return;

    const newBlock = {
      ...clipboard,
      id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };

    if (selectedBlockId) {
      const index = blocks.findIndex((b) => b.id === selectedBlockId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      onChange(newBlocks);
    } else {
      onChange([...blocks, newBlock]);
    }

    setSelectedBlockId(newBlock.id);
  }

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si está escribiendo en un input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (!selectedBlockId) return;

      // Ctrl+D - Duplicar
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        handleDuplicateBlock(selectedBlockId);
      }

      // Ctrl+C - Copiar
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        handleCopy(selectedBlockId);
      }

      // Ctrl+X - Cortar
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        handleCut(selectedBlockId);
      }

      // Ctrl+V - Pegar
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      }

      // Ctrl+↑ - Mover arriba
      if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        handleMoveUp(selectedBlockId);
      }

      // Ctrl+↓ - Mover abajo
      if (e.ctrlKey && e.key === 'ArrowDown') {
        e.preventDefault();
        handleMoveDown(selectedBlockId);
      }

      // Delete - Eliminar
      if (e.key === 'Delete') {
        e.preventDefault();
        handleDeleteBlock(selectedBlockId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, blocks, clipboard]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row h-full gap-0 md:gap-4 relative">
        {/* Sidebar izquierdo: Herramientas - Hidden en mobile */}
        <div className="hidden md:block w-64 shrink-0 border-r bg-muted/30">
          <SidebarTools />
        </div>

        {/* Canvas central */}
        <div className="flex-1 bg-background overflow-auto">
          <CanvasArea
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onBlocksChange={onChange}
          />
        </div>

        {/* Sidebar derecho: Propiedades - Hidden en mobile */}
        <div className="hidden md:block w-72 shrink-0 border-l bg-muted/30">
          <SidebarProperties selectedBlock={selectedBlock} />
        </div>

        {/* Botón flotante en mobile para agregar bloques */}
        <MobileBlocksMenu blocks={blocks} onChange={onChange} />
      </div>

      {/* Overlay para el drag */}
      <DragOverlay>
        {activeId ? (
          <Card className="p-4 shadow-2xl opacity-80 cursor-grabbing">
            <div className="text-sm font-medium">Arrastrando...</div>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
