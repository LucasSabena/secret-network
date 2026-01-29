// FILE: src/lib/reading-time.ts
import { Block } from './types';

/**
 * Calcula el tiempo estimado de lectura basado en la cantidad de palabras
 * Promedio: 200-250 palabras por minuto (usamos 225)
 */

export interface ReadingTime {
  minutes: number;
  words: number;
  text: string;
}

/**
 * Extrae el texto plano de un HTML (elimina tags)
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Cuenta palabras en un texto
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calcula el tiempo de lectura de un contenido HTML
 * @param html - Contenido HTML del blog post
 * @param wordsPerMinute - Palabras por minuto (default: 225)
 * @returns Objeto con minutos, palabras y texto formateado
 */
export function calculateReadingTime(
  html: string,
  wordsPerMinute: number = 225
): ReadingTime {
  const plainText = stripHtml(html);
  const words = countWords(plainText);
  const minutes = Math.ceil(words / wordsPerMinute);

  return {
    minutes,
    words,
    text: `${minutes} min de lectura`,
  };
}

/**
 * Formatea el tiempo de lectura para mostrar
 * @param minutes - Minutos de lectura
 * @returns Texto formateado (ej: "5 min", "< 1 min")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min';
  }
  return `${minutes} min`;
}

/**
 * Calcula el tiempo de lectura desde bloques estructurados
 * @param blocks - Array de bloques del post
 * @param wordsPerMinute - Palabras por minuto (default: 200)
 * @returns Objeto con minutos, palabras y texto formateado
 */
export function calculateReadingTimeFromBlocks(
  blocks: Block[] | null | undefined,
  wordsPerMinute: number = 200
): ReadingTime {
  if (!blocks || blocks.length === 0) {
    return {
      minutes: 1,
      words: 0,
      text: '< 1 min',
    };
  }

  let totalWords = 0;

  blocks.forEach((block) => {
    // n8n/imports can occasionally leave nulls inside the array
    if (!block || typeof block !== 'object' || !(block as any).type) return;

    if (block.type === 'text') {
      const html = (block as any).data?.content || '';
      const text = String(html).replace(/<[^>]*>/g, ''); // Remove HTML
      totalWords += text.split(/\s+/).filter((word) => word.length > 0).length;
    } else if (block.type === 'tabs') {
      const tabs = (block as any).data?.tabs;
      if (!Array.isArray(tabs)) return;
      tabs.forEach((tab: any) => {
        const text = String(tab?.content || '').replace(/<[^>]*>/g, '');
        totalWords += text.split(/\s+/).filter((word) => word.length > 0).length;
      });
    } else if (block.type === 'accordion') {
      const items = (block as any).data?.items;
      if (!Array.isArray(items)) return;
      items.forEach((item: any) => {
        const text = String(item?.content || '').replace(/<[^>]*>/g, '');
        totalWords += text.split(/\s+/).filter((word) => word.length > 0).length;
      });
    } else if (block.type === 'alert') {
      const text = String((block as any).data?.description || '').replace(/<[^>]*>/g, '');
      totalWords += text.split(/\s+/).filter((word) => word.length > 0).length;
    } else if (block.type === 'code') {
      // Código cuenta como palabras también
      const code = String((block as any).data?.code || '');
      totalWords += code.split(/\s+/).filter((word) => word.length > 0).length;
    }
  });

  const minutes = Math.max(1, Math.ceil(totalWords / wordsPerMinute));

  return {
    minutes,
    words: totalWords,
    text: formatReadingTime(minutes),
  };
}
