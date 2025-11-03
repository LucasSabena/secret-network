/**
 * Factory para los nuevos bloques agregados
 * Importar y agregar al BlockFactory principal
 */

import { Block } from '@/lib/types';

export class NewBlocksFactory {
  private static generateId(): string {
    return `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  static createRedditPost(): Block {
    return {
      id: this.generateId(),
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
  }

  static createTOC(): Block {
    return {
      id: this.generateId(),
      type: 'toc',
      data: {
        title: 'Tabla de Contenidos',
        levels: [2, 3], // H2 y H3
        sticky: false,
        collapsible: true,
      },
    };
  }

  static createNewsletter(): Block {
    return {
      id: this.generateId(),
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
  }

  static createGist(): Block {
    return {
      id: this.generateId(),
      type: 'gist',
      data: {
        gistUrl: '',
        showLineNumbers: true,
        theme: 'dark',
      },
    };
  }

  static createMermaid(): Block {
    return {
      id: this.generateId(),
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
  }

  static createMath(): Block {
    return {
      id: this.generateId(),
      type: 'math',
      data: {
        formula: 'E = mc^2',
        display: 'block',
      },
    };
  }

  static createSpotify(): Block {
    return {
      id: this.generateId(),
      type: 'spotify',
      data: {
        spotifyUrl: '',
        type: 'track',
        height: 152,
      },
    };
  }

  static createInstagram(): Block {
    return {
      id: this.generateId(),
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
  }

  static createNotification(): Block {
    return {
      id: this.generateId(),
      type: 'notification',
      data: {
        type: 'info',
        message: 'Mensaje importante aquí',
        dismissible: true,
      },
    };
  }
}
