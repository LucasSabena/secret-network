// FILE: src/lib/clipboard-manager.ts
// Sistema de clipboard persistente para copiar/pegar bloques entre posts

import { Block } from './types';

const CLIPBOARD_KEY = 'blog-editor-clipboard';
const CLIPBOARD_TIMESTAMP_KEY = 'blog-editor-clipboard-timestamp';

export interface ClipboardData {
  blocks: Block[];
  timestamp: number;
  source: 'cut' | 'copy';
}

// Guardar bloques en el clipboard
export function saveToClipboard(blocks: Block[], source: 'cut' | 'copy' = 'copy'): void {
  try {
    const data: ClipboardData = {
      blocks,
      timestamp: Date.now(),
      source,
    };
    localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(data));
    localStorage.setItem(CLIPBOARD_TIMESTAMP_KEY, data.timestamp.toString());
  } catch (error) {
    console.error('Error saving to clipboard:', error);
  }
}

// Obtener bloques del clipboard
export function getFromClipboard(): ClipboardData | null {
  try {
    const data = localStorage.getItem(CLIPBOARD_KEY);
    if (!data) return null;
    
    return JSON.parse(data) as ClipboardData;
  } catch (error) {
    console.error('Error reading from clipboard:', error);
    return null;
  }
}

// Verificar si hay algo en el clipboard
export function hasClipboardData(): boolean {
  return localStorage.getItem(CLIPBOARD_KEY) !== null;
}

// Limpiar el clipboard
export function clearClipboard(): void {
  localStorage.removeItem(CLIPBOARD_KEY);
  localStorage.removeItem(CLIPBOARD_TIMESTAMP_KEY);
}

// Generar nuevos IDs para los bloques al pegar
export function cloneBlocksWithNewIds(blocks: Block[]): Block[] {
  return blocks.map(block => ({
    ...block,
    id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  }));
}

// Obtener tiempo desde que se copió
export function getClipboardAge(): number | null {
  const timestamp = localStorage.getItem(CLIPBOARD_TIMESTAMP_KEY);
  if (!timestamp) return null;
  
  return Date.now() - parseInt(timestamp);
}

// Formatear tiempo para mostrar
export function formatClipboardAge(age: number): string {
  const seconds = Math.floor(age / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `hace ${minutes} min`;
  return 'hace un momento';
}
