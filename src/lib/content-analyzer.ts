// FILE: src/lib/content-analyzer.ts
// Análisis avanzado de contenido para SEO y legibilidad

import { Block } from './types';

export interface ContentAnalysis {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  headingCount: number;
  imageCount: number;
  linkCount: number;
  readingTime: number;
  readabilityScore: number;
  seoScore: number;
  keywordDensity: Map<string, number>;
  suggestions: string[];
}

// Extraer texto plano de HTML
function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Extraer todo el texto de los bloques
function extractAllText(blocks: Block[]): string {
  let text = '';
  
  blocks.forEach(block => {
    if (block.type === 'text') {
      text += stripHtml(block.data.content) + ' ';
    } else if (block.type === 'alert') {
      text += `${block.data.title || ''} ${block.data.description} `;
    } else if (block.type === 'tabs') {
      block.data.tabs.forEach(tab => {
        text += `${tab.label} ${stripHtml(tab.content)} `;
      });
    } else if (block.type === 'accordion') {
      block.data.items.forEach(item => {
        text += `${item.title} ${stripHtml(item.content)} `;
      });
    }
  });
  
  return text;
}

// Contar palabras
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Calcular densidad de palabras clave
function calculateKeywordDensity(text: string): Map<string, number> {
  const words = text.toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3); // Solo palabras de más de 3 letras
  
  const frequency = new Map<string, number>();
  const totalWords = words.length;
  
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  
  // Convertir a porcentaje
  const density = new Map<string, number>();
  frequency.forEach((count, word) => {
    const percentage = (count / totalWords) * 100;
    if (percentage > 0.5) { // Solo palabras que aparecen más del 0.5%
      density.set(word, percentage);
    }
  });
  
  // Ordenar por frecuencia y tomar top 10
  const sorted = Array.from(density.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return new Map(sorted);
}

// Calcular score de legibilidad (Flesch-Kincaid adaptado)
function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Fórmula Flesch Reading Ease adaptada
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  // Normalizar a 0-100
  return Math.max(0, Math.min(100, score));
}

// Contar sílabas (aproximación para español)
function countSyllables(word: string): number {
  word = word.toLowerCase();
  const vowels = 'aeiouáéíóúü';
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  return Math.max(1, count);
}

// Contar elementos específicos
function countElements(blocks: Block[]): {
  paragraphs: number;
  headings: number;
  images: number;
  links: number;
} {
  let paragraphs = 0;
  let headings = 0;
  let images = 0;
  let links = 0;
  
  blocks.forEach(block => {
    if (block.type === 'text') {
      if (block.data.format === 'paragraph') paragraphs++;
      if (['h1', 'h2', 'h3', 'h4'].includes(block.data.format)) headings++;
      
      // Contar enlaces en el contenido
      const linkMatches = block.data.content.match(/<a /g);
      if (linkMatches) links += linkMatches.length;
    } else if (block.type === 'image') {
      images++;
    } else if (block.type === 'images-grid') {
      images += block.data.images.length;
    }
  });
  
  return { paragraphs, headings, images, links };
}

// Calcular SEO score
function calculateSEOScore(
  blocks: Block[],
  title: string,
  description: string
): { score: number; suggestions: string[] } {
  const suggestions: string[] = [];
  let score = 100;
  
  const text = extractAllText(blocks);
  const wordCount = countWords(text);
  const elements = countElements(blocks);
  
  // Título
  if (!title || title.length < 30) {
    score -= 15;
    suggestions.push('El título debería tener al menos 30 caracteres');
  }
  if (title && title.length > 60) {
    score -= 10;
    suggestions.push('El título es muy largo (máx. 60 caracteres)');
  }
  
  // Descripción
  if (!description || description.length < 120) {
    score -= 15;
    suggestions.push('La descripción debería tener al menos 120 caracteres');
  }
  if (description && description.length > 160) {
    score -= 10;
    suggestions.push('La descripción es muy larga (máx. 160 caracteres)');
  }
  
  // Longitud del contenido
  if (wordCount < 300) {
    score -= 20;
    suggestions.push('El contenido es muy corto (mín. 300 palabras)');
  }
  
  // Headings
  if (elements.headings === 0) {
    score -= 15;
    suggestions.push('Agrega encabezados (H2, H3) para estructurar el contenido');
  }
  
  // Imágenes
  if (elements.images === 0) {
    score -= 10;
    suggestions.push('Agrega al menos una imagen al contenido');
  }
  
  // Enlaces
  if (elements.links === 0) {
    score -= 10;
    suggestions.push('Agrega enlaces internos o externos relevantes');
  }
  
  // Ratio texto/imagen
  const textImageRatio = wordCount / Math.max(1, elements.images);
  if (textImageRatio > 500) {
    score -= 5;
    suggestions.push('Considera agregar más imágenes (ratio texto/imagen alto)');
  }
  
  return { score: Math.max(0, score), suggestions };
}

// Análisis completo
export function analyzeContent(
  blocks: Block[],
  title: string = '',
  description: string = ''
): ContentAnalysis {
  const text = extractAllText(blocks);
  const wordCount = countWords(text);
  const elements = countElements(blocks);
  const keywordDensity = calculateKeywordDensity(text);
  const readabilityScore = calculateReadabilityScore(text);
  const { score: seoScore, suggestions } = calculateSEOScore(blocks, title, description);
  
  // Tiempo de lectura (promedio 200 palabras por minuto)
  const readingTime = Math.ceil(wordCount / 200);
  
  return {
    wordCount,
    characterCount: text.length,
    paragraphCount: elements.paragraphs,
    headingCount: elements.headings,
    imageCount: elements.images,
    linkCount: elements.links,
    readingTime,
    readabilityScore,
    seoScore,
    keywordDensity,
    suggestions,
  };
}

// Obtener nivel de legibilidad en texto
export function getReadabilityLevel(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score >= 80) {
    return {
      level: 'Muy Fácil',
      description: 'Fácil de leer para todos',
      color: 'text-green-600',
    };
  } else if (score >= 60) {
    return {
      level: 'Fácil',
      description: 'Lectura cómoda',
      color: 'text-blue-600',
    };
  } else if (score >= 40) {
    return {
      level: 'Moderado',
      description: 'Requiere atención',
      color: 'text-yellow-600',
    };
  } else if (score >= 20) {
    return {
      level: 'Difícil',
      description: 'Lectura compleja',
      color: 'text-orange-600',
    };
  } else {
    return {
      level: 'Muy Difícil',
      description: 'Muy complejo',
      color: 'text-red-600',
    };
  }
}

// Obtener nivel de SEO en texto
export function getSEOLevel(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score >= 90) {
    return {
      level: 'Excelente',
      description: 'Optimización perfecta',
      color: 'text-green-600',
    };
  } else if (score >= 70) {
    return {
      level: 'Bueno',
      description: 'Bien optimizado',
      color: 'text-blue-600',
    };
  } else if (score >= 50) {
    return {
      level: 'Regular',
      description: 'Necesita mejoras',
      color: 'text-yellow-600',
    };
  } else {
    return {
      level: 'Pobre',
      description: 'Requiere optimización',
      color: 'text-red-600',
    };
  }
}
