import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { CommandsList } from './commands-list';

interface CommandItem {
  title: string;
  description: string;
  searchTerms: string[];
  command: (props: any) => void;
}

export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const suggestion = {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: 'Título 1',
        description: 'Título grande',
        searchTerms: ['h1', 'heading', 'titulo'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 1 })
            .run();
        },
      },
      {
        title: 'Título 2',
        description: 'Título mediano',
        searchTerms: ['h2', 'heading', 'titulo'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 2 })
            .run();
        },
      },
      {
        title: 'Título 3',
        description: 'Título pequeño',
        searchTerms: ['h3', 'heading', 'titulo'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 3 })
            .run();
        },
      },
      {
        title: 'Título 4',
        description: 'Subtítulo',
        searchTerms: ['h4', 'heading', 'titulo', 'subtitulo'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 4 })
            .run();
        },
      },
      {
        title: 'Título 5',
        description: 'Subtítulo pequeño',
        searchTerms: ['h5', 'heading', 'titulo', 'subtitulo'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 5 })
            .run();
        },
      },
      {
        title: 'Título 6',
        description: 'Subtítulo mínimo',
        searchTerms: ['h6', 'heading', 'titulo', 'subtitulo'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 6 })
            .run();
        },
      },
      {
        title: 'Lista',
        description: 'Lista con viñetas',
        searchTerms: ['ul', 'list', 'lista'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBulletList()
            .run();
        },
      },
      {
        title: 'Lista Numerada',
        description: 'Lista ordenada',
        searchTerms: ['ol', 'list', 'lista', 'numerada'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleOrderedList()
            .run();
        },
      },
      {
        title: 'Cita',
        description: 'Bloque de cita',
        searchTerms: ['quote', 'blockquote', 'cita'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBlockquote()
            .run();
        },
      },
      {
        title: 'Código',
        description: 'Bloque de código',
        searchTerms: ['code', 'codigo'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleCodeBlock()
            .run();
        },
      },
      {
        title: 'Imagen',
        description: 'Insertar imagen',
        searchTerms: ['image', 'img', 'imagen', 'foto'],
        command: ({ editor, range }: any) => {
          const url = window.prompt('URL de la imagen:');
          if (url) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setImage({ src: url })
              .run();
          }
        },
      },
      {
        title: 'Separador',
        description: 'Línea horizontal',
        searchTerms: ['hr', 'divider', 'separador', 'linea'],
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHorizontalRule()
            .run();
        },
      },
    ]
      .filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
          const search = query.toLowerCase();
          return (
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            item.searchTerms.some((term: string) => term.includes(search))
          );
        }
        return true;
      })
      .slice(0, 10);
  },

  render: () => {
    let component: ReactRenderer;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(CommandsList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }

        if (component.ref && typeof component.ref === 'object' && 'onKeyDown' in component.ref) {
          return (component.ref as any).onKeyDown(props);
        }

        return false;
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
