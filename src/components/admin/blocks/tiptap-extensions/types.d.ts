import '@tiptap/core';
import { BadgeColor } from './badge-node';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    badge: {
      /**
       * Insert a badge
       */
      setBadge: (attributes: { text: string; color: BadgeColor }) => ReturnType;
    };
  }
}
