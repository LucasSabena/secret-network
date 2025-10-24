// FILE: src/lib/utm-tracker.ts
/**
 * Utilidad para agregar parámetros UTM a enlaces externos
 * Permite trackear de dónde vienen los usuarios que hacen click
 */

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

const DEFAULT_UTM_SOURCE = 'secretnetwork.co';
const DEFAULT_UTM_MEDIUM = 'referral';

/**
 * Agrega parámetros UTM a una URL
 * @param url - URL original
 * @param params - Parámetros UTM personalizados
 * @returns URL con parámetros UTM
 */
export function addUTMParams(
  url: string,
  params: UTMParams = {}
): string {
  try {
    const urlObj = new URL(url);

    // Agregar parámetros UTM
    if (params.source || !urlObj.searchParams.has('utm_source')) {
      urlObj.searchParams.set('utm_source', params.source || DEFAULT_UTM_SOURCE);
    }

    if (params.medium || !urlObj.searchParams.has('utm_medium')) {
      urlObj.searchParams.set('utm_medium', params.medium || DEFAULT_UTM_MEDIUM);
    }

    if (params.campaign) {
      urlObj.searchParams.set('utm_campaign', params.campaign);
    }

    if (params.term) {
      urlObj.searchParams.set('utm_term', params.term);
    }

    if (params.content) {
      urlObj.searchParams.set('utm_content', params.content);
    }

    return urlObj.toString();
  } catch (error) {
    // Si la URL no es válida, retornar la original
    console.error('Error adding UTM params:', error);
    return url;
  }
}

/**
 * Verifica si una URL es externa
 * @param url - URL a verificar
 * @returns true si es externa
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname !== window.location.hostname;
  } catch {
    // Si no es una URL válida, asumir que es interna
    return false;
  }
}

/**
 * Procesa una URL agregando UTM si es externa
 * @param url - URL original
 * @param params - Parámetros UTM personalizados
 * @returns URL procesada
 */
export function processUrl(url: string, params: UTMParams = {}): string {
  if (isExternalUrl(url)) {
    return addUTMParams(url, params);
  }
  return url;
}
