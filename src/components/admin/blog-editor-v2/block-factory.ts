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

      case 'programs-grid':
        return {
          id,
          type: 'programs-grid',
          data: { programIds: [], columns: 3 },
        };

      case 'images-grid':
        return {
          id,
          type: 'images-grid',
          data: { images: [], columns: 3 },
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

      case 'video':
        return {
          id,
          type: 'video',
          data: { url: '', platform: 'youtube', caption: '' },
        };

      case 'tweet':
        return {
          id,
          type: 'tweet',
          data: { tweetUrl: '' },
        };

      case 'table':
        return {
          id,
          type: 'table',
          data: {
            headers: ['Columna 1', 'Columna 2'],
            rows: [['', '']],
            striped: false,
          },
        };

      case 'callout':
        return {
          id,
          type: 'callout',
          data: { icon: '💡', content: '', color: 'blue' },
        };

      case 'button':
        return {
          id,
          type: 'button',
          data: {
            text: 'Click aquí',
            url: '',
            variant: 'primary',
            size: 'md',
            openInNewTab: false,
          },
        };

      case 'divider-text':
        return {
          id,
          type: 'divider-text',
          data: { text: '', style: 'solid' },
        };

      case 'quote':
        return {
          id,
          type: 'quote',
          data: { quote: '', author: '', role: '', variant: 'default' },
        };

      case 'stats':
        return {
          id,
          type: 'stats',
          data: {
            stats: [{ label: 'Métrica', value: '0' }],
            columns: 3,
          },
        };

      case 'timeline':
        return {
          id,
          type: 'timeline',
          data: {
            items: [
              { id: this.generateId(), date: '', title: '', description: '' },
            ],
          },
        };

      case 'comparison':
        return {
          id,
          type: 'comparison',
          data: {
            items: [{ name: 'Item 1', features: {} }],
            featureLabels: ['Feature 1'],
          },
        };

      case 'file-download':
        return {
          id,
          type: 'file-download',
          data: {
            fileName: 'documento.pdf',
            fileUrl: '',
            fileSize: '',
            fileType: 'PDF',
            description: '',
          },
        };

      case 'embed':
        return {
          id,
          type: 'embed',
          data: { embedCode: '', height: 400, caption: '' },
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
