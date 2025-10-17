// FILE: src/lib/reading-time.ts
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
