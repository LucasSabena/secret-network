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
import { cn } from '@/lib/utils';

interface DragDropEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
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
      <div className="flex h-full gap-4">
        {/* Sidebar izquierdo: Herramientas */}
        <div className="w-64 shrink-0 border-r bg-muted/30">
          <SidebarTools />
        </div>

        {/* Canvas central */}
        <div className="flex-1 bg-background">
          <CanvasArea
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onBlocksChange={onChange}
          />
        </div>

        {/* Sidebar derecho: Propiedades */}
        <div className="w-72 shrink-0 border-l bg-muted/30">
          <SidebarProperties selectedBlock={selectedBlock} />
        </div>
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
