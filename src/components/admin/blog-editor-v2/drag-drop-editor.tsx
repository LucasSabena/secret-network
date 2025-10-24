// FILE: src/components/admin/blog-editor-v2/drag-drop-editor.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
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
import { EditorSidebarTabs } from './editor-sidebar-tabs';
import { ResizablePanels } from './resizable-panels';
import { BlockFactory } from './block-factory';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Undo2, Redo2 } from 'lucide-react';
import { BLOCK_TOOLS } from './block-tools';
import { useHistory } from '@/lib/use-history';
import { useToast } from '@/components/ui/use-toast';

interface Autor {
  id: number;
  nombre: string;
  avatar_url?: string | null;
}

interface PostSettings {
  titulo: string;
  slug: string;
  descripcionCorta: string;
  autorId: number | null;
  autores: Autor[];
  publicado: boolean;
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
  onFechaChange: (fecha: Date) => void;
  onScheduledForChange: (date: string | null) => void;
  onTagsChange: (tags: string[]) => void;
  onCategoriesChange: (categories: number[]) => void;
  onImageFileChange: (file: File | null) => void;
  onImagenAltChange: (alt: string) => void;
}

interface DragDropEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  postSettings?: PostSettings;
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

export function DragDropEditor({ blocks, onChange, postSettings }: DragDropEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<Block | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Usar historial para undo/redo
  const { state: historyBlocks, set: setHistoryBlocks, undo, redo, canUndo, canRedo } = useHistory<Block[]>(blocks);

  // Sincronizar con el estado externo
  useEffect(() => {
    onChange(historyBlocks);
  }, [historyBlocks]);

  // Actualizar historial cuando cambian los bloques externos
  useEffect(() => {
    if (JSON.stringify(blocks) !== JSON.stringify(historyBlocks)) {
      setHistoryBlocks(blocks);
    }
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const selectedBlock = historyBlocks.find((b) => b.id === selectedBlockId) || null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (!over) {
      setDropTargetIndex(null);
      return;
    }

    const overData = over.data.current;
    if (overData?.type === 'drop-zone') {
      setDropTargetIndex(overData.index as number);
    } else {
      setDropTargetIndex(null);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setDropTargetIndex(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    const isNewBlock = activeData?.isNew;

    if (isNewBlock) {
      // Crear nuevo bloque desde la herramienta
      const blockType = activeData.type as Block['type'];
      const newBlock = BlockFactory.createBlock(blockType);
      
      // Si hay un drop zone específico, insertar ahí
      if (overData?.type === 'drop-zone') {
        const targetIndex = overData.index as number;
        const newBlocks = [...historyBlocks];
        newBlocks.splice(targetIndex, 0, newBlock);
        setHistoryBlocks(newBlocks);
      } else {
        // Si no, agregar al final
        setHistoryBlocks([...historyBlocks, newBlock]);
      }
      setSelectedBlockId(newBlock.id);
    } else {
      // Reordenar bloques existentes
      const activeId = active.id as string;
      
      if (overData?.type === 'drop-zone') {
        // Mover a una posición específica
        const targetIndex = overData.index as number;
        const oldIndex = historyBlocks.findIndex((b) => b.id === activeId);
        
        if (oldIndex !== -1) {
          const newBlocks = [...historyBlocks];
          const [movedBlock] = newBlocks.splice(oldIndex, 1);
          const adjustedIndex = oldIndex < targetIndex ? targetIndex - 1 : targetIndex;
          newBlocks.splice(adjustedIndex, 0, movedBlock);
          setHistoryBlocks(newBlocks);
        }
      } else {
        // Reordenar entre bloques
        const overId = over.id as string;
        if (activeId !== overId) {
          const oldIndex = historyBlocks.findIndex((b) => b.id === activeId);
          const newIndex = historyBlocks.findIndex((b) => b.id === overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            setHistoryBlocks(arrayMove(historyBlocks, oldIndex, newIndex));
          }
        }
      }
    }
  }

  function handleUpdateBlock(id: string, updatedBlock: Block) {
    setHistoryBlocks(historyBlocks.map((b) => (b.id === id ? updatedBlock : b)));
  }

  function handleDeleteBlock(id: string) {
    setHistoryBlocks(historyBlocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  }

  function handleDuplicateBlock(id: string) {
    const block = historyBlocks.find((b) => b.id === id);
    if (!block) return;

    const newBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };

    const index = historyBlocks.findIndex((b) => b.id === id);
    const newBlocks = [...historyBlocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setHistoryBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
  }

  function handleMoveUp(id: string) {
    const index = historyBlocks.findIndex((b) => b.id === id);
    if (index <= 0) return;

    const newBlocks = [...historyBlocks];
    [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    setHistoryBlocks(newBlocks);
  }

  function handleMoveDown(id: string) {
    const index = historyBlocks.findIndex((b) => b.id === id);
    if (index < 0 || index >= historyBlocks.length - 1) return;

    const newBlocks = [...historyBlocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    setHistoryBlocks(newBlocks);
  }

  function handleCopy(id: string) {
    const block = historyBlocks.find((b) => b.id === id);
    if (block) {
      setClipboard(block);
    }
  }

  function handleCut(id: string) {
    const block = historyBlocks.find((b) => b.id === id);
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
      const index = historyBlocks.findIndex((b) => b.id === selectedBlockId);
      const newBlocks = [...historyBlocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setHistoryBlocks(newBlocks);
    } else {
      setHistoryBlocks([...historyBlocks, newBlock]);
    }

    setSelectedBlockId(newBlock.id);
  }

  function handleUndo() {
    if (canUndo) {
      undo();
      toast({
        title: 'Deshacer',
        description: 'Cambio deshecho',
      });
    }
  }

  function handleRedo() {
    if (canRedo) {
      redo();
      toast({
        title: 'Rehacer',
        description: 'Cambio rehecho',
      });
    }
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

      // Ctrl+Z - Deshacer (global)
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Ctrl+Y - Rehacer (global)
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
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
  }, [selectedBlockId, historyBlocks, clipboard, canUndo, canRedo]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <ResizablePanels
        leftPanel={<SidebarTools />}
        centerPanel={
          <>
            {/* Botones de Undo/Redo */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                title="Deshacer (Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4 mr-2" />
                Deshacer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                title="Rehacer (Ctrl+Y)"
              >
                <Redo2 className="h-4 w-4 mr-2" />
                Rehacer
              </Button>
            </div>

            <div className="overflow-auto h-[calc(100%-56px)]">
              <CanvasArea
                blocks={historyBlocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
                onBlocksChange={setHistoryBlocks}
                dropTargetIndex={dropTargetIndex}
              />
            </div>

            {/* Botón flotante en mobile para agregar bloques */}
            <MobileBlocksMenu blocks={historyBlocks} onChange={setHistoryBlocks} />
          </>
        }
        rightPanel={
          postSettings ? (
            <EditorSidebarTabs
              blocks={historyBlocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onDeleteBlocks={(ids) => {
                setHistoryBlocks(historyBlocks.filter(b => !ids.includes(b.id)));
                if (ids.includes(selectedBlockId || '')) {
                  setSelectedBlockId(null);
                }
              }}
              onDuplicateBlocks={(ids) => {
                const blocksToDuplicate = historyBlocks.filter(b => ids.includes(b.id));
                const newBlocks = blocksToDuplicate.map(block => ({
                  ...block,
                  id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                }));
                setHistoryBlocks([...historyBlocks, ...newBlocks]);
              }}
              onReorderBlocks={(blockIds, targetIndex) => {
                // TODO: Implementar reordenamiento
              }}
              titulo={postSettings.titulo}
              slug={postSettings.slug}
              descripcionCorta={postSettings.descripcionCorta}
              autorId={postSettings.autorId}
              autores={postSettings.autores}
              publicado={postSettings.publicado}
              fechaPublicacion={postSettings.fechaPublicacion}
              scheduledFor={postSettings.scheduledFor}
              tags={postSettings.tags}
              categories={postSettings.categories}
              imagenPortadaUrl={postSettings.imagenPortadaUrl}
              imagenPortadaAlt={postSettings.imagenPortadaAlt}
              imageFile={postSettings.imageFile}
              onTituloChange={postSettings.onTituloChange}
              onSlugChange={postSettings.onSlugChange}
              onDescripcionChange={postSettings.onDescripcionChange}
              onAutorChange={postSettings.onAutorChange}
              onPublicadoChange={postSettings.onPublicadoChange}
              onFechaChange={postSettings.onFechaChange}
              onScheduledForChange={postSettings.onScheduledForChange}
              onTagsChange={postSettings.onTagsChange}
              onCategoriesChange={postSettings.onCategoriesChange}
              onImageFileChange={postSettings.onImageFileChange}
              onImagenAltChange={postSettings.onImagenAltChange}
            />
          ) : (
            <SidebarProperties selectedBlock={selectedBlock} />
          )
        }
      />

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
