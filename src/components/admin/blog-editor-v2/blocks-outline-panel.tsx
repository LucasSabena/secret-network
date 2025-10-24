'use client';

import { useState } from 'react';
import { Block } from '@/lib/types';
import {
    GripVertical,
    Trash2,
    Copy,
    ChevronDown,
    ChevronRight,
    Type,
    Image as ImageIcon,
    Code,
    List,
    Table,
    Video,
    FileText,
    AlertCircle,
    Quote,
    Grid3x3,
    Download,
    Calendar,
    BarChart3,
    GitCompare,
    Minus,
    MousePointer,
    MessageSquare,
    Layers,
    Folder,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BlocksOutlinePanelProps {
    blocks: Block[];
    selectedBlockId: string | null;
    onSelectBlock: (blockId: string) => void;
    onDeleteBlocks: (blockIds: string[]) => void;
    onDuplicateBlocks: (blockIds: string[]) => void;
    onReorderBlocks: (blockIds: string[], targetIndex: number) => void;
}

const BLOCK_ICONS: Record<string, any> = {
    text: Type,
    image: ImageIcon,
    code: Code,
    list: List,
    table: Table,
    video: Video,
    alert: AlertCircle,
    quote: Quote,
    'images-grid': Grid3x3,
    'file-download': Download,
    timeline: Calendar,
    stats: BarChart3,
    comparison: GitCompare,
    divider: Minus,
    button: MousePointer,
    callout: MessageSquare,
    tabs: Layers,
    accordion: Folder,
};

const BLOCK_LABELS: Record<string, string> = {
    text: 'Texto',
    image: 'Imagen',
    code: 'Código',
    list: 'Lista',
    table: 'Tabla',
    video: 'Video',
    alert: 'Alerta',
    quote: 'Cita',
    'images-grid': 'Galería',
    'file-download': 'Descarga',
    timeline: 'Timeline',
    stats: 'Estadísticas',
    comparison: 'Comparación',
    divider: 'Divisor',
    button: 'Botón',
    callout: 'Callout',
    tabs: 'Pestañas',
    accordion: 'Acordeón',
    'programs-grid': 'Grid Programas',
};

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

    const getBlockPreview = (block: Block): string => {
        switch (block.type) {
            case 'text':
                const text = block.data.content?.replace(/<[^>]*>/g, '') || '';
                return text.substring(0, 50) + (text.length > 50 ? '...' : '');
            case 'image':
                return block.data.alt || 'Imagen sin descripción';
            case 'code':
                return `${block.data.language || 'code'} - ${block.data.code?.substring(0, 30) || ''}...`;
            case 'alert':
                return block.data.title || block.data.description?.substring(0, 40) || 'Alerta';
            case 'quote':
                return block.data.quote?.substring(0, 50) || 'Cita';
            case 'button':
                return block.data.text || 'Botón';
            case 'callout':
                return block.data.content?.substring(0, 40) || 'Callout';
            default:
                return BLOCK_LABELS[block.type] || block.type;
        }
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

    const Icon = (type: string) => BLOCK_ICONS[type] || FileText;

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
                        blocks.map((block, index) => {
                            const BlockIcon = Icon(block.type);
                            const isSelected = selectedBlockId === block.id;
                            const isChecked = selectedBlocks.has(block.id);
                            const isCollapsed = collapsedBlocks.has(block.id);
                            const preview = getBlockPreview(block);

                            return (
                                <div
                                    key={block.id}
                                    className={cn(
                                        'group rounded-md border transition-all',
                                        isSelected && 'border-pink-500 bg-pink-50 dark:bg-pink-950/20',
                                        !isSelected && 'border-transparent hover:border-border hover:bg-accent'
                                    )}
                                >
                                    <div className="flex items-start gap-2 p-2">
                                        {/* Checkbox */}
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={() => toggleBlockSelection(block.id)}
                                            className="mt-1"
                                        />

                                        {/* Drag handle */}
                                        <button type="button" className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Arrastrar bloque">
                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        </button>

                                        {/* Contenido del bloque */}
                                        <div
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => onSelectBlock(block.id)}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <BlockIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                <span className="text-xs font-medium">
                                                    {BLOCK_LABELS[block.type] || block.type}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    #{index + 1}
                                                </span>
                                            </div>

                                            {!isCollapsed && preview && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                    {preview}
                                                </p>
                                            )}
                                        </div>

                                        {/* Toggle collapse */}
                                        <button
                                            type="button"
                                            onClick={() => toggleCollapse(block.id)}
                                            className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title={isCollapsed ? 'Expandir' : 'Colapsar'}
                                            aria-label={isCollapsed ? 'Expandir bloque' : 'Colapsar bloque'}
                                        >
                                            {isCollapsed ? (
                                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
