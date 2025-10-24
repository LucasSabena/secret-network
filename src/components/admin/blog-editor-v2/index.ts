// FILE: src/components/admin/blog-editor-v2/index.ts
/**
 * Exportaciones principales del nuevo editor drag-and-drop del blog
 */

// Componentes principales
export { BlogEditorFullPage } from './blog-editor-full-page';
export { BlogQuickCreate } from './blog-quick-create';
export { DragDropEditor } from './drag-drop-editor';

// Layout
export { SidebarTools } from './sidebar-tools';
export { CanvasArea } from './canvas-area';
export { SidebarProperties } from './sidebar-properties';
export { CanvasBlock } from './canvas-block';
export { BlockContextMenu } from './block-context-menu';

// Features
export { EditorHelp } from './editor-help';
export { EditorStats } from './editor-stats';
export { EditorOnboarding } from './editor-onboarding';
export { EditorAnnouncement } from './editor-announcement';

// Utilidades
export { BlockFactory } from './block-factory';
export { BLOCK_TOOLS, BLOCK_CATEGORIES } from './block-tools';

// Tipos
export type { BlockToolDefinition, EditorState, BlockEditorProps } from './types';
