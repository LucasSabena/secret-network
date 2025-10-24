// FILE: src/hooks/use-utm-link.ts
'use client';

import { useMemo } from 'react';
import { addUTMParams, UTMParams } from '@/lib/utm-tracker';

/**
 * Hook para generar enlaces con parámetros UTM
 * @param url - URL original
 * @param params - Parámetros UTM personalizados
 * @returns URL con parámetros UTM
 */
export function useUTMLink(url: string, params: UTMParams = {}): string {
  return useMemo(() => {
    return addUTMParams(url, params);
  }, [url, params]);
}

/**
 * Hook para generar múltiples enlaces con UTM
 * @param urls - Array de URLs
 * @param params - Parámetros UTM personalizados
 * @returns Array de URLs con parámetros UTM
 */
export function useUTMLinks(urls: string[], params: UTMParams = {}): string[] {
  return useMemo(() => {
    return urls.map(url => addUTMParams(url, params));
  }, [urls, params]);
}
