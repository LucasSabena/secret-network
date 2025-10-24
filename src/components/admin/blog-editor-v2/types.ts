// FILE: src/components/admin/blog-editor-v2/types.ts
/**
 * Tipos para el nuevo editor drag-and-drop del blog
 */

import { Block } from '@/lib/types';

export interface BlockToolDefinition {
  id: string;
  type: Block['type'];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: 'content' | 'media' | 'interactive' | 'layout';
}

export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  isDragging: boolean;
}

export interface BlockEditorProps<T extends Block = Block> {
  block: T;
  onChange: (block: T) => void;
  isSelected?: boolean;
}
