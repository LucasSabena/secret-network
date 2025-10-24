// FILE: src/lib/spell-checker.ts
// Sistema de corrección ortográfica usando LanguageTool API

export interface SpellingError {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: string[];
  context: {
    text: string;
    offset: number;
    length: number;
  };
  rule: {
    id: string;
    description: string;
    category: string;
  };
}

export interface SpellCheckResult {
  errors: SpellingError[];
  text: string;
}

// Extraer texto plano de HTML
function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Verificar ortografía usando LanguageTool API
export async function checkSpelling(text: string, language: string = 'es'): Promise<SpellCheckResult> {
  try {
    const cleanText = stripHtml(text);
    
    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: cleanText,
        language: language,
        enabledOnly: 'false',
      }),
    });

    if (!response.ok) {
      throw new Error('Error al verificar ortografía');
    }

    const data = await response.json();
    
    interface LanguageToolMatch {
      message: string;
      shortMessage?: string;
      offset: number;
      length: number;
      replacements: Array<{ value: string }>;
      context: {
        text: string;
        offset: number;
        length: number;
      };
      rule: {
        id: string;
        description: string;
        category: {
          name: string;
        };
      };
    }
    
    const errors: SpellingError[] = data.matches.map((match: LanguageToolMatch) => ({
      message: match.message,
      shortMessage: match.shortMessage || match.message,
      offset: match.offset,
      length: match.length,
      replacements: match.replacements.slice(0, 5).map((r) => r.value),
      context: {
        text: match.context.text,
        offset: match.context.offset,
        length: match.context.length,
      },
      rule: {
        id: match.rule.id,
        description: match.rule.description,
        category: match.rule.category.name,
      },
    }));

    return {
      errors,
      text: cleanText,
    };
  } catch (error) {
    console.error('Error checking spelling:', error);
    throw error;
  }
}

// Verificar ortografía de múltiples textos
export async function checkMultipleTexts(texts: string[], language: string = 'es'): Promise<Map<number, SpellCheckResult>> {
  const results = new Map<number, SpellCheckResult>();
  
  for (let i = 0; i < texts.length; i++) {
    if (texts[i].trim()) {
      try {
        const result = await checkSpelling(texts[i], language);
        if (result.errors.length > 0) {
          results.set(i, result);
        }
      } catch (error) {
        console.error(`Error checking text ${i}:`, error);
      }
    }
  }
  
  return results;
}

// Aplicar corrección a un texto
export function applyCorrection(text: string, error: SpellingError, replacement: string): string {
  const before = text.substring(0, error.offset);
  const after = text.substring(error.offset + error.length);
  return before + replacement + after;
}

// Obtener estadísticas de errores
export function getErrorStats(errors: SpellingError[]): {
  total: number;
  byCategory: Record<string, number>;
} {
  const byCategory: Record<string, number> = {};
  
  errors.forEach(error => {
    const category = error.rule.category;
    byCategory[category] = (byCategory[category] || 0) + 1;
  });
  
  return {
    total: errors.length,
    byCategory,
  };
}
