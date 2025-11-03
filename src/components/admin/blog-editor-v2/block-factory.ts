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
          data: { icon: 'lightbulb', content: '', color: 'blue' },
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

      case 'blog-card':
        return {
          id,
          type: 'blog-card',
          data: { blogId: 0, variant: 'default' },
        };

      case 'blogs-grid':
        return {
          id,
          type: 'blogs-grid',
          data: { blogIds: [], columns: 3 },
        };

      case 'faq':
        return {
          id,
          type: 'faq',
          data: {
            items: [
              { id: this.generateId(), question: '¿Pregunta?', answer: 'Respuesta...' },
            ],
          },
        };

      case 'pros-cons':
        return {
          id,
          type: 'pros-cons',
          data: {
            pros: ['Ventaja 1'],
            cons: ['Desventaja 1'],
            title: 'Pros y Contras',
          },
        };

      case 'feature-list':
        return {
          id,
          type: 'feature-list',
          data: {
            features: [
              { id: this.generateId(), icon: 'Check', title: 'Feature 1', description: '' },
            ],
            columns: 3,
          },
        };

      case 'before-after':
        return {
          id,
          type: 'before-after',
          data: {
            beforeImage: '',
            afterImage: '',
            beforeLabel: 'Antes',
            afterLabel: 'Después',
          },
        };

      case 'icon-grid':
        return {
          id,
          type: 'icon-grid',
          data: {
            items: [
              { id: this.generateId(), icon: 'Star', title: 'Item 1', description: '' },
            ],
            columns: 3,
          },
        };

      case 'category-card':
        return {
          id,
          type: 'category-card',
          data: { categoryId: 0, variant: 'default' },
        };

      case 'author-bio':
        return {
          id,
          type: 'author-bio',
          data: { authorId: 0, showSocial: true },
        };

      case 'poll':
        return {
          id,
          type: 'poll',
          data: {
            pollId: `poll-${Date.now()}`,
            question: '¿Tu pregunta aquí?',
            options: [
              { id: this.generateId(), text: 'Opción 1' },
              { id: this.generateId(), text: 'Opción 2' },
            ],
            allowMultiple: false,
          },
        };

      case 'progress-bar':
        return {
          id,
          type: 'progress-bar',
          data: {
            items: [
              { id: this.generateId(), label: 'Progreso 1', value: 75, color: '#3b82f6' },
            ],
          },
        };

      case 'checklist':
        return {
          id,
          type: 'checklist',
          data: {
            items: [
              { id: this.generateId(), text: 'Tarea 1', checked: false },
            ],
            title: 'Checklist',
          },
        };

      case 'changelog':
        return {
          id,
          type: 'changelog',
          data: {
            entries: [
              {
                id: this.generateId(),
                version: '1.0.0',
                date: new Date().toISOString().split('T')[0],
                changes: ['Cambio 1'],
                type: 'added',
              },
            ],
          },
        };

      case 'pricing-table':
        return {
          id,
          type: 'pricing-table',
          data: {
            plans: [
              {
                id: this.generateId(),
                name: 'Plan Básico',
                price: '$0',
                period: '/mes',
                features: ['Feature 1', 'Feature 2'],
                highlighted: false,
                ctaText: 'Comenzar',
                ctaUrl: '',
              },
            ],
          },
        };

      case 'testimonial':
        return {
          id,
          type: 'testimonial',
          data: {
            quote: 'Testimonio aquí...',
            author: 'Nombre',
            role: 'Cargo',
            company: 'Empresa',
            avatar: '',
            rating: 5,
          },
        };

      case 'tip-box':
        return {
          id,
          type: 'tip-box',
          data: {
            type: 'tip',
            title: 'Consejo',
            content: 'Contenido del tip...',
            icon: 'Lightbulb',
          },
        };

      case 'cta-banner':
        return {
          id,
          type: 'cta-banner',
          data: {
            title: 'Título del Banner',
            description: 'Descripción...',
            ctaText: 'Acción',
            ctaUrl: '',
            backgroundColor: '#3b82f6',
          },
        };

      case 'product-showcase':
        return {
          id,
          type: 'product-showcase',
          data: {
            programId: 0,
            features: [],
            ctaText: 'Ver más',
          },
        };

      case 'reddit-post':
        return {
          id,
          type: 'reddit-post',
          data: {
            mode: 'manual',
            username: '',
            subreddit: '',
            title: '',
            content: '',
            upvotes: 0,
            comments: 0,
            date: new Date().toISOString().split('T')[0],
          },
        };

      case 'toc':
        return {
          id,
          type: 'toc',
          data: {
            title: 'Tabla de Contenidos',
            levels: [2, 3],
            sticky: false,
            collapsible: true,
          },
        };

      case 'newsletter':
        return {
          id,
          type: 'newsletter',
          data: {
            title: '📧 Suscríbete al Newsletter',
            description: 'Recibe las últimas actualizaciones directamente en tu email',
            placeholder: 'tu@email.com',
            buttonText: 'Suscribirse',
            successMessage: '¡Gracias por suscribirte!',
            showName: false,
            variant: 'card',
          },
        };

      case 'gist':
        return {
          id,
          type: 'gist',
          data: {
            gistUrl: '',
            showLineNumbers: true,
            theme: 'dark',
          },
        };

      case 'mermaid':
        return {
          id,
          type: 'mermaid',
          data: {
            code: `graph TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[End]
    C -->|No| B`,
            theme: 'default',
          },
        };

      case 'math':
        return {
          id,
          type: 'math',
          data: {
            formula: 'E = mc^2',
            display: 'block',
          },
        };

      case 'spotify':
        return {
          id,
          type: 'spotify',
          data: {
            spotifyUrl: '',
            type: 'track',
            height: 152,
          },
        };

      case 'instagram':
        return {
          id,
          type: 'instagram',
          data: {
            mode: 'manual',
            username: '',
            caption: '',
            imageUrl: '',
            likes: 0,
            date: new Date().toISOString().split('T')[0],
          },
        };

      case 'notification':
        return {
          id,
          type: 'notification',
          data: {
            type: 'info',
            message: 'Mensaje importante aquí',
            dismissible: true,
          },
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
