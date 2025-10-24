// FILE: src/components/admin/blog-editor-v2/block-factory.ts
/**
 * Factory para crear nuevos bloques con valores por defecto
 */

import { Block } from '@/lib/types';

export class BlockFactory {
  private static generateId(): string {
    return `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  static createBlock(type: Block['type']): Block {
    const id = this.generateId();

    switch (type) {
      case 'text':
        return {
          id,
          type: 'text',
          data: { format: 'paragraph', content: '' },
        };

      case 'image':
        return {
          id,
          type: 'image',
          data: { url: '', alt: '', caption: '' },
        };

      case 'program-card':
        return {
          id,
          type: 'program-card',
          data: { programId: 0, variant: 'default' },
        };

      case 'tabs':
        return {
          id,
          type: 'tabs',
          data: {
            tabs: [
              { id: this.generateId(), label: 'Tab 1', content: '' },
            ],
          },
        };

      case 'accordion':
        return {
          id,
          type: 'accordion',
          data: {
            items: [
              { id: this.generateId(), title: 'Item 1', content: '' },
            ],
          },
        };

      case 'alert':
        return {
          id,
          type: 'alert',
          data: { variant: 'default', description: '' },
        };

      case 'code':
        return {
          id,
          type: 'code',
          data: { language: 'javascript', code: '' },
        };

      case 'separator':
        return {
          id,
          type: 'separator',
          data: { style: 'solid' },
        };

      default:
        return {
          id,
          type: 'text',
          data: { format: 'paragraph', content: '' },
        };
    }
  }
}
