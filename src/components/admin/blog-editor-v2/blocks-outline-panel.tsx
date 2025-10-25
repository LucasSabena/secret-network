'use client';

import { useState } from 'react';
import { Block } from '@/lib/types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Trash2, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockListItem } from './components/block-list-item';

interface BlocksOutlinePanelProps {
    blocks: Block[];
    selectedBlockId: string | null;
    onSelectBlock: (blockId: string) => void;
    onDeleteBlocks: (blockIds: string[]) => void;
    onDuplicateBlocks: (blockIds: string[]) => void;
    onReorderBlocks: (blockIds: string[], targetIndex: number) => void;
}



export function BlocksOutlinePanel({
    blocks,
    selectedBlockId,
    onSelectBlock,
    onDeleteBlocks,
    onDuplicateBlocks,
    onReorderBlocks,
}: BlocksOutlinePanelProps) {
    const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
    const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set());

    const toggleBlockSelection = (blockId: string) => {
        const newSelection = new Set(selectedBlocks);
        if (newSelection.has(blockId)) {
            newSelection.delete(blockId);
        } else {
            newSelection.add(blockId);
        }
        setSelectedBlocks(newSelection);
    };

    const toggleAllBlocks = () => {
        if (selectedBlocks.size === blocks.length) {
            setSelectedBlocks(new Set());
        } else {
            setSelectedBlocks(new Set(blocks.map(b => b.id)));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedBlocks.size === 0) return;
        onDeleteBlocks(Array.from(selectedBlocks));
        setSelectedBlocks(new Set());
    };

    const handleDuplicateSelected = () => {
        if (selectedBlocks.size === 0) return;
        onDuplicateBlocks(Array.from(selectedBlocks));
        setSelectedBlocks(new Set());
    };

    const toggleCollapse = (blockId: string) => {
        const newCollapsed = new Set(collapsedBlocks);
        if (newCollapsed.has(blockId)) {
            newCollapsed.delete(blockId);
        } else {
            newCollapsed.add(blockId);
        }
        setCollapsedBlocks(newCollapsed);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header con acciones masivas */}
            <div className="p-4 border-b space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Estructura del Post</h3>
                    <span className="text-xs text-muted-foreground">
                        {blocks.length} bloque{blocks.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {selectedBlocks.size > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {selectedBlocks.size} seleccionado{selectedBlocks.size !== 1 ? 's' : ''}
                        </span>
                        <div className="flex gap-1 ml-auto">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDuplicateSelected}
                                className="h-7 px-2"
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDeleteSelected}
                                className="h-7 px-2 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllBlocks}
                    className="w-full h-7 text-xs"
                >
                    {selectedBlocks.size === blocks.length ? 'Deseleccionar' : 'Seleccionar'} todo
                </Button>
            </div>

            {/* Lista de bloques */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {blocks.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No hay bloques aún</p>
                            <p className="text-xs mt-1">Agrega bloques desde el editor</p>
                        </div>
                    ) : (
                        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                            {blocks.map((block, index) => (
                                <BlockListItem
                                    key={block.id}
                                    block={block}
                                    index={index}
                                    isSelected={selectedBlockId === block.id}
                                    isChecked={selectedBlocks.has(block.id)}
                                    isCollapsed={collapsedBlocks.has(block.id)}
                                    onSelect={() => onSelectBlock(block.id)}
                                    onToggleCheck={() => toggleBlockSelection(block.id)}
                                    onToggleCollapse={() => toggleCollapse(block.id)}
                                />
                            ))}
                        </SortableContext>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
