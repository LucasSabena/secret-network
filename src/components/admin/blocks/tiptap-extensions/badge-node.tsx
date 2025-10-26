'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Badge } from '@/components/ui/badge';

// Colores predefinidos basados en la paleta de Secret Network
export const BADGE_COLORS = {
  primary: { bg: 'bg-primary', text: 'text-primary-foreground', label: 'Primario' },
  secondary: { bg: 'bg-secondary', text: 'text-secondary-foreground', label: 'Secundario' },
  blue: { bg: 'bg-blue-500', text: 'text-white', label: 'Azul' },
  green: { bg: 'bg-green-500', text: 'text-white', label: 'Verde' },
  yellow: { bg: 'bg-yellow-500', text: 'text-black', label: 'Amarillo' },
  red: { bg: 'bg-red-500', text: 'text-white', label: 'Rojo' },
  purple: { bg: 'bg-purple-500', text: 'text-white', label: 'Púrpura' },
  orange: { bg: 'bg-orange-500', text: 'text-white', label: 'Naranja' },
  pink: { bg: 'bg-pink-500', text: 'text-white', label: 'Rosa' },
  gray: { bg: 'bg-gray-500', text: 'text-white', label: 'Gris' },
} as const;

export type BadgeColor = keyof typeof BADGE_COLORS;

const BadgeComponent = ({ node, selected }: NodeViewProps) => {
  const { text, color } = node.attrs as { text: string; color: BadgeColor };
  const colorConfig = BADGE_COLORS[color] || BADGE_COLORS.primary;

  return (
    <NodeViewWrapper className="inline-block" data-drag-handle>
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorConfig.bg} ${colorConfig.text} ${
          selected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        contentEditable={false}
      >
        {text}
      </span>
    </NodeViewWrapper>
  );
};

export const BadgeNode = Node.create({
  name: 'badge',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      text: {
        default: 'Badge',
        parseHTML: (element) => element.getAttribute('data-text'),
        renderHTML: (attributes) => {
          return {
            'data-text': attributes.text,
          };
        },
      },
      color: {
        default: 'primary',
        parseHTML: (element) => element.getAttribute('data-color'),
        renderHTML: (attributes) => {
          return {
            'data-color': attributes.color,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-badge]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const text = node.attrs.text || 'Badge';
    const color = node.attrs.color || 'primary';
    const colorConfig = BADGE_COLORS[color as BadgeColor] || BADGE_COLORS.primary;
    
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-badge': '',
        'data-text': text,
        'data-color': color,
        class: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorConfig.bg} ${colorConfig.text}`,
      }),
      text,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BadgeComponent);
  },

  addCommands() {
    return {
      setBadge:
        (attributes: { text: string; color: BadgeColor }) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
